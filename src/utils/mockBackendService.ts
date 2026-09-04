import { UserSession } from '../types';

const COOKIE_SESSION_KEY = 'gluteos_user_session';
const COOKIE_NAME_KEY = 'gluteos_user_name';
const COOKIE_EMAIL_KEY = 'gluteos_user_email';
const COOKIE_UPSELL_KEY = 'gluteos_has_upsell';
const COOKIE_IP_KEY = 'gluteos_client_ip';

const LOCAL_SESSION_KEY = 'coach_gluteos_user_session';
const IP_DATABASE_KEY = 'simulated_backend_ip_records';

/**
 * Cookie Management Helpers
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    // SameSite=Lax and path=/ for universal access across pages
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
  } catch (err) {
    console.warn('Cookie write error:', err);
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
  } catch (err) {
    console.warn('Cookie read error:', err);
  }
  return null;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

/**
 * Simulated Backend Database indexed by Client IP
 * Simulates a server-side storage where each IP address holds its registered profile,
 * upsell purchases, and activity data.
 */
function getIpDatabase(): Record<string, UserSession> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(IP_DATABASE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveIpDatabase(db: Record<string, UserSession>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(IP_DATABASE_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
}

/**
 * Save user profile & upsell data both to Cookies and the Simulated IP Backend Database
 */
export function saveUserSessionToBackend(session: UserSession, clientIp?: string): UserSession {
  const effectiveIp = clientIp || session.ip || '187.19.120.45';
  const nowStr = new Date().toISOString();

  const enrichedSession: UserSession = {
    ...session,
    ip: effectiveIp,
    updatedAt: nowStr,
    savedVia: 'Cookie + IP Backend',
  };

  // 1. Save to primary cookie as serialized JSON (exclude heavy base64 images to stay within 4KB cookie limits)
  try {
    const lightweightCookieSession: Partial<UserSession> = {
      email: enrichedSession.email,
      name: enrichedSession.name,
      plan: enrichedSession.plan,
      purchasedAt: enrichedSession.purchasedAt,
      isVerified: enrichedSession.isVerified,
      ip: enrichedSession.ip,
      city: enrichedSession.city,
      country: enrichedSession.country,
      hasUpsell: enrichedSession.hasUpsell,
      upsellName: enrichedSession.upsellName,
      weight: enrichedSession.weight,
      height: enrichedSession.height,
      hasCompletedOnboarding: enrichedSession.hasCompletedOnboarding,
      savedVia: enrichedSession.savedVia,
      updatedAt: enrichedSession.updatedAt,
    };

    setCookie(COOKIE_SESSION_KEY, JSON.stringify(lightweightCookieSession), 365);
    setCookie(COOKIE_NAME_KEY, enrichedSession.name, 365);
    setCookie(COOKIE_EMAIL_KEY, enrichedSession.email, 365);
    setCookie(COOKIE_UPSELL_KEY, enrichedSession.hasUpsell ? 'true' : 'false', 365);
    setCookie(COOKIE_IP_KEY, effectiveIp, 365);
  } catch (e) {
    console.warn('Failed to write cookies:', e);
  }

  // 2. Save into simulated backend IP database
  try {
    const db = getIpDatabase();
    db[effectiveIp] = enrichedSession;
    // Also save under fallback/local key
    db['latest_active'] = enrichedSession;
    saveIpDatabase(db);
  } catch (e) {
    console.warn('Failed to write to IP database:', e);
  }

  // 3. Keep local storage in sync
  try {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(enrichedSession));
  } catch {
    // ignore
  }

  return enrichedSession;
}

/**
 * Load user session from Cookie or Simulated IP Backend
 */
export function loadUserSessionFromBackend(clientIp?: string): UserSession | null {
  // Strategy 1: Check Cookies first, and enrich with local/IP database images
  try {
    const cookieRaw = getCookie(COOKIE_SESSION_KEY);
    if (cookieRaw) {
      const parsed: UserSession = JSON.parse(cookieRaw);
      if (parsed && parsed.email) {
        const effectiveIp = clientIp || parsed.ip || '187.19.120.45';
        const db = getIpDatabase();
        const storedIpRecord = db[effectiveIp] || db['latest_active'];

        // Merge cached image data & extended metrics if present in simulated IP db
        const enriched: UserSession = {
          ...parsed,
          ip: effectiveIp,
          avatarUrl: storedIpRecord?.avatarUrl || parsed.avatarUrl,
          initialPhotoUrl: storedIpRecord?.initialPhotoUrl || parsed.initialPhotoUrl,
          afterPhotoUrl: storedIpRecord?.afterPhotoUrl || parsed.afterPhotoUrl,
          weight: parsed.weight || storedIpRecord?.weight,
          height: parsed.height || storedIpRecord?.height,
          hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? storedIpRecord?.hasCompletedOnboarding ?? false,
        };

        return enriched;
      }
    }
  } catch {
    // ignore
  }

  // Strategy 2: Check Simulated Backend Database by IP
  if (clientIp) {
    try {
      const db = getIpDatabase();
      if (db[clientIp]) {
        const ipRecord = db[clientIp];
        // Reseed cookie from IP record
        saveUserSessionToBackend(ipRecord, clientIp);
        return ipRecord;
      }
    } catch {
      // ignore
    }
  }

  // Strategy 3: Check fallback local storage
  try {
    const localRaw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (localRaw) {
      const parsed: UserSession = JSON.parse(localRaw);
      if (parsed && parsed.email) {
        saveUserSessionToBackend(parsed, clientIp || parsed.ip);
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // Strategy 4: Check if individual cookies exist (e.g. name + email)
  const cName = getCookie(COOKIE_NAME_KEY);
  const cEmail = getCookie(COOKIE_EMAIL_KEY);
  if (cEmail) {
    const reconstructed: UserSession = {
      name: cName || cEmail.split('@')[0],
      email: cEmail,
      plan: 'Desafío Glúteos 28 Días · Vitalicio',
      purchasedAt: 'Recuperado por Cookie',
      isVerified: true,
      ip: clientIp || getCookie(COOKIE_IP_KEY) || '187.19.120.45',
      hasUpsell: getCookie(COOKIE_UPSELL_KEY) === 'true',
      savedVia: 'Cookie + IP Backend',
    };
    saveUserSessionToBackend(reconstructed, reconstructed.ip);
    return reconstructed;
  }

  return null;
}

/**
 * Clear user session across all simulated backends (Cookies, IP database, LocalStorage)
 */
export function clearUserSessionFromBackend(clientIp?: string): void {
  deleteCookie(COOKIE_SESSION_KEY);
  deleteCookie(COOKIE_NAME_KEY);
  deleteCookie(COOKIE_EMAIL_KEY);
  deleteCookie(COOKIE_UPSELL_KEY);
  deleteCookie(COOKIE_IP_KEY);

  try {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  } catch {
    // ignore
  }

  if (clientIp) {
    try {
      const db = getIpDatabase();
      delete db[clientIp];
      delete db['latest_active'];
      saveIpDatabase(db);
    } catch {
      // ignore
    }
  }
}

/**
 * Inspect the simulated backend status for UI diagnostics
 */
export function getSimulatedBackendDiagnostic(currentSession?: UserSession | null, currentIp?: string) {
  const hasCookie = Boolean(getCookie(COOKIE_SESSION_KEY) || getCookie(COOKIE_NAME_KEY));
  const effectiveIp = currentIp || currentSession?.ip || 'IP Pendiente';
  const db = getIpDatabase();
  const hasIpRecord = Boolean(db[effectiveIp] || db['latest_active']);

  return {
    hasCookie,
    hasIpRecord,
    effectiveIp,
    savedName: currentSession?.name || getCookie(COOKIE_NAME_KEY) || 'No registrado',
    savedEmail: currentSession?.email || getCookie(COOKIE_EMAIL_KEY) || 'No registrado',
    hasUpsell: currentSession?.hasUpsell || getCookie(COOKIE_UPSELL_KEY) === 'true',
    upsellName: currentSession?.upsellName || 'Protocolo Acelerador Glúteos VIP',
    lastUpdated: currentSession?.updatedAt || new Date().toISOString(),
  };
}
