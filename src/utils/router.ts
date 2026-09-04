// Utility for seamless slug-based routing with History API & Hash support
export type AppSlug =
  | '/inicio'
  | '/acesso'
  | '/upsell'
  | '/entrenar'
  | '/comidas'
  | '/coach-ai'
  | '/progreso'
  | '/quiz'
  | '/receitas';

export interface RouteMeta {
  slug: AppSlug;
  aliases: string[];
  label: string;
  pageTitle: string;
  type: 'page' | 'tab' | 'modal';
  badge?: string;
}

export const ROUTES: Record<AppSlug, RouteMeta> = {
  '/upsell': {
    slug: '/upsell',
    aliases: ['/oferta-vip', '/acelerador', '/oto', '/oferta', '/turbo', '/upsell-page', '/upsell.html'],
    label: 'Página de Upsell',
    pageTitle: '⚠️ Oferta Única VIP · Protocolo Acelerador 3X',
    type: 'page',
    badge: '80% OFF',
  },
  '/acesso': {
    slug: '/acesso',
    aliases: ['/login', '/auth', '/verificar', '/bienvenida', '/compra-aprobada', '/acceso'],
    label: 'Acceso Alumna',
    pageTitle: 'Acceso y Verificación · Coach Glúteos 28D',
    type: 'page',
    badge: 'Check-in',
  },
  '/inicio': {
    slug: '/inicio',
    aliases: ['/', '/app', '/home', '/dashboard', '/alumna', '/index.html'],
    label: 'Inicio (App)',
    pageTitle: 'Inicio · Coach Glúteos 28D',
    type: 'tab',
  },
  '/entrenar': {
    slug: '/entrenar',
    aliases: ['/entrenamiento', '/treino', '/workout', '/ejercicios', '/rutina'],
    label: 'Entrenar',
    pageTitle: 'Entrenamiento de Glúteos · Coach Glúteos 28D',
    type: 'tab',
  },
  '/comidas': {
    slug: '/comidas',
    aliases: ['/dieta', '/menu', '/nutricion', '/alimentos', '/meals'],
    label: 'Plan Nutricional',
    pageTitle: 'Plan Nutricional · Coach Glúteos 28D',
    type: 'tab',
  },
  '/coach-ai': {
    slug: '/coach-ai',
    aliases: ['/coach', '/ia', '/asistente', '/chat'],
    label: 'Coach AI',
    pageTitle: 'Coach AI 24/7 · Coach Glúteos 28D',
    type: 'tab',
  },
  '/progreso': {
    slug: '/progreso',
    aliases: ['/evolucion', '/metricas', '/resultados', '/fotos'],
    label: 'Progreso y Fotos',
    pageTitle: 'Progreso 28 Días · Coach Glúteos 28D',
    type: 'tab',
  },
  '/quiz': {
    slug: '/quiz',
    aliases: ['/diagnostico', '/evaluacion', '/test'],
    label: 'Diagnóstico 28D',
    pageTitle: 'Diagnóstico Personalizado · Coach Glúteos 28D',
    type: 'modal',
  },
  '/receitas': {
    slug: '/receitas',
    aliases: ['/recetas', '/cookbook', '/recetas-proteicas', '/libro-recetas'],
    label: 'Libro de Recetas',
    pageTitle: '+50 Recetas Proteicas · Coach Glúteos 28D',
    type: 'modal',
    badge: '+50',
  },
};

/**
 * Parses current window location (pathname or hash) to an authorized AppSlug
 */
export function getCurrentSlug(): AppSlug {
  if (typeof window === 'undefined') return '/inicio';

  // 1. Check path
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

  // 2. Check hash (if hash routing is used like /#upsell or #/upsell)
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().replace(/\/$/, '');

  const target = hash ? `/${hash}` : path;

  // Match direct slugs
  for (const [slug, meta] of Object.entries(ROUTES)) {
    if (target === slug || meta.aliases.includes(target)) {
      return slug as AppSlug;
    }
  }

  // If path explicitly mentions upsell
  if (path.includes('upsell')) {
    return '/upsell';
  }

  return '/inicio';
}

/**
 * Pushes a new slug to window history and updates document title
 */
export function navigateToSlug(slug: AppSlug, replace: boolean = false) {
  if (typeof window === 'undefined') return;

  const meta = ROUTES[slug];
  if (meta?.pageTitle) {
    document.title = meta.pageTitle;
  }

  const currentPath = window.location.pathname;
  if (currentPath !== slug) {
    try {
      if (replace) {
        window.history.replaceState({ slug }, '', slug);
      } else {
        window.history.pushState({ slug }, '', slug);
      }
    } catch {
      // Fallback to hash if pushState fails in certain environments
      window.location.hash = slug;
    }
  }
}
