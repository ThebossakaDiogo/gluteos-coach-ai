import React, { useState, useEffect } from 'react';
import { IMAGES, FALLBACK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { uiAudio } from '../utils/audioEngine';
import { SoundControl } from './SoundControl';
import { useGeoTime } from '../utils/useGeoTime';
import {
  saveUserSessionToBackend,
  loadUserSessionFromBackend,
  getSimulatedBackendDiagnostic,
} from '../utils/mockBackendService';
import {
  CheckCircle2,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  Lock,
  Zap,
  HelpCircle,
  KeyRound,
  Check,
  ShieldCheck,
  Globe2,
  Cookie,
  Flame,
} from 'lucide-react';
import { UserSession } from '../types';

interface PurchaseAuthScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultEmail?: string;
  defaultName?: string;
}

export function PurchaseAuthScreen({
  onLoginSuccess,
  defaultEmail = '',
  defaultName = '',
}: PurchaseAuthScreenProps) {
  const geoTime = useGeoTime();
  const [email, setEmail] = useState(defaultEmail || '');
  const [name, setName] = useState(defaultName || '');
  const [hasUpsell, setHasUpsell] = useState(true);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [recoveredFromBackend, setRecoveredFromBackend] = useState(false);

  // Auto-recover previous session associated with Cookie or this IP
  useEffect(() => {
    const existing = loadUserSessionFromBackend(geoTime.ip);
    if (existing) {
      if (!name && existing.name) setName(existing.name);
      if (!email && existing.email) setEmail(existing.email);
      if (existing.hasUpsell !== undefined) setHasUpsell(existing.hasUpsell);
      setRecoveredFromBackend(true);
    }
  }, [geoTime.ip]);

  const validateAndSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    const cleanName = name.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');

    if (!cleanEmail) {
      uiAudio.play('back');
      setErrorMessage('Por favor, ingresa el correo electrónico utilizado en la compra.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      uiAudio.play('back');
      setErrorMessage('Ingresa una dirección de correo válida.');
      return;
    }

    setErrorMessage('');
    setStatus('verifying');
    uiAudio.play('click');

    // Realistic verification simulation:
    // Persists to Cookie and IP Database, then grants instant access
    setTimeout(() => {
      setStatus('verified');
      uiAudio.play('success');

      const userSession: UserSession = {
        email: cleanEmail,
        name: cleanName,
        plan: hasUpsell
          ? 'Desafío Glúteos 28 Días + Acelerador VIP'
          : 'Desafío Glúteos 28 Días · Vitalicio',
        purchasedAt: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        isVerified: true,
        ip: geoTime.ip || '187.19.120.45',
        city: geoTime.city,
        country: geoTime.country,
        hasUpsell,
        upsellName: hasUpsell ? 'Protocolo Acelerador Glúteos 28D VIP' : undefined,
        upsellPurchasedAt: hasUpsell ? new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : undefined,
        savedVia: 'Cookie + IP Backend',
        updatedAt: new Date().toISOString(),
      };

      // Persist in Cookie and Simulated IP database
      saveUserSessionToBackend(userSession, geoTime.ip);

      // Automatically transition after showing the checkmark confirmation
      setTimeout(() => {
        onLoginSuccess(userSession);
      }, 1200);
    }, 1100);
  };

  const handleQuickFill = (quickEmail: string, quickName: string) => {
    uiAudio.play('select');
    setEmail(quickEmail);
    setName(quickName);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen quiz-canvas text-[#2B0B2E] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-body selection:bg-[#FF3377] selection:text-white">
      {/* Ambient background orbs */}
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />

      {/* Sound Toggle Button */}
      <SoundControl />

      {/* Top Header */}
      <header className="w-full max-w-md pt-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <span className="brand-mark">⚡</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg text-[#2B0B2E] tracking-tight">
                Método 28 Días
              </span>
              <span className="bg-[#FF3377] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
                VIP
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#6C586B] tracking-wider uppercase">
              Coach Glúteos Neo-Pop
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            uiAudio.play('click');
            setShowHelpModal(true);
          }}
          className="flex items-center gap-1 text-xs font-bold text-[#2B0B2E] bg-white hover:bg-[#FFE600] border-2 border-[#2B0B2E] px-3 py-1.5 rounded-full shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#FF3377]" />
          <span>Ayuda</span>
        </button>
      </header>

      {/* Main Neo-Brutalist Authentication Card */}
      <div className="w-full max-w-md my-auto py-5 z-10 screen-enter">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-[7px_7px_0_#2B0B2E,13px_13px_0_#FF3377] border-3 border-[#2B0B2E] flex flex-col gap-5 relative">
          
          {/* Status icon & Neo-Pop Badge */}
          <div className="flex flex-col items-center text-center gap-2.5">
            {status === 'verified' ? (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#A7FF00]/30 border-3 border-[#2B0B2E] flex items-center justify-center text-[#2B0B2E] shadow-[5px_5px_0_#00A859] animate-scaleIn">
                  <CheckCircle2 className="w-10 h-10 text-[#00A859] stroke-[3]" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#2B0B2E] text-[#FFE600] p-1.5 rounded-full text-[10px] font-black border border-[#2B0B2E]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </div>
            ) : status === 'verifying' ? (
              <div className="relative w-16 h-16 rounded-full bg-[#FF3377]/15 border-3 border-[#2B0B2E] flex items-center justify-center text-[#FF3377]">
                <div className="w-8 h-8 border-3 border-[#FF3377] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-3 border-[#2B0B2E] flex items-center justify-center text-[#2B0B2E] shadow-[4px_4px_0_#FF3377] rotate-[-2deg]">
                <ShieldCheck className="w-9 h-9 text-[#2B0B2E]" />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="eyebrow-pill mx-auto">
                <Sparkles className="w-3 h-3 text-[#FF3377]" />
                {status === 'verified' ? 'Acceso Confirmado' : 'Alumnas & Miembros VIP'}
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B0B2E] tracking-tight leading-tight">
                {status === 'verified'
                  ? `¡Bienvenida, ${name || 'Alumna'}!`
                  : 'Verifica tu Acceso'}
              </h1>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed max-w-xs mx-auto">
                {status === 'verified'
                  ? 'Tus datos quedaron vinculados a tu IP y guardados en tu Cookie de sesión. Ingresando...'
                  : 'Ingresa tu nombre y correo para personalizar tu entrenamiento y sincronizar tu acceso.'}
              </p>
            </div>
          </div>

          {/* Backend Simulation Pill Banner */}
          <div className="flex items-center justify-between p-2.5 bg-[#FFF9E6] rounded-2xl border-2 border-[#2B0B2E] text-[11px] shadow-[2px_2px_0_#2B0B2E]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Globe2 className="w-3.5 h-3.5 text-[#FF3377] flex-shrink-0" />
              <span className="truncate font-semibold text-[#2B0B2E]">
                IP: <strong className="font-mono text-[#FF3377]">{geoTime.ip || 'Detectando IP...'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-[#2B0B2E] text-[10px] font-black text-[#00A859] flex-shrink-0">
              <Cookie className="w-3 h-3" />
              <span>Cookie Activa</span>
            </div>
          </div>

          {recoveredFromBackend && (
            <div className="p-2.5 bg-[#A7FF00]/30 rounded-xl border-1.5 border-[#00A859] text-xs font-bold text-[#2B0B2E] flex items-center justify-between animate-fadeIn">
              <span>⚡ ¡Datos previos recuperados de tu IP y Cookie!</span>
              <span className="text-[10px] font-black uppercase text-[#00A859]">Reconocida ✓</span>
            </div>
          )}

          {/* Form or Verified Success Card */}
          {status === 'verified' ? (
            <div className="flex flex-col gap-3 bg-[#FFF9E6] p-4 rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#00A859] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2">
                <span className="text-[10px] font-black text-[#6C586B] uppercase tracking-wider">
                  Estado de la Licencia
                </span>
                <span className="text-xs font-black text-[#00A859] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00A859] animate-ping" />
                  Activa & Guardada en IP
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6C586B] font-bold">Alumna:</span>
                  <span className="font-black text-[#2B0B2E]">{name || 'Camila Silva'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6C586B] font-bold">Correo:</span>
                  <span className="font-mono font-bold text-[#2B0B2E] truncate max-w-[170px]">{email}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6C586B] font-bold">Upsell VIP:</span>
                  <span className="font-black text-[#FF3377]">
                    {hasUpsell ? '✓ Protocolo Acelerador Activado' : 'Estándar'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2B0B2E]/10">
                  <span className="text-[#6C586B] font-bold">Persistencia:</span>
                  <span className="text-[#00A859] font-black text-[11px]">Cookie + Base IP vinculada</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => {
                    uiAudio.play('success');
                    const session: UserSession = {
                      email,
                      name: name || email.split('@')[0],
                      plan: hasUpsell
                        ? 'Desafío Glúteos 28 Días + Acelerador VIP'
                        : 'Desafío Glúteos 28 Días · Vitalicio',
                      purchasedAt: 'Hoy',
                      isVerified: true,
                      ip: geoTime.ip || '187.19.120.45',
                      hasUpsell,
                      upsellName: hasUpsell ? 'Protocolo Acelerador Glúteos 28D VIP' : undefined,
                      savedVia: 'Cookie + IP Backend',
                    };
                    saveUserSessionToBackend(session, geoTime.ip);
                    onLoginSuccess(session);
                  }}
                  className="cta-button cta-light text-[#2B0B2E]"
                >
                  <span>Entrar a la Aplicación Ahora</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                  <span className="button-sheen" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={validateAndSubmit} className="flex flex-col gap-3.5">
              {/* Name Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#2B0B2E] flex items-center justify-between">
                  <span>Tu Nombre:</span>
                  <span className="text-[10px] text-[#6C586B]">Se guarda en tu perfil</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6C586B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Camila Silva"
                    disabled={status === 'verifying'}
                    className="w-full bg-[#FFF9E6] border-2 border-[#2B0B2E] focus:border-[#FF3377] text-[#2B0B2E] placeholder:text-[#6C586B]/60 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-3 focus:ring-[#FF3377]/30 shadow-[3px_3px_0_#2B0B2E] transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#2B0B2E] flex items-center justify-between">
                  <span>Correo de la compra:</span>
                  <span className="text-[10px] text-[#FF3377] font-bold">Cualquier correo de prueba</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6C586B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="tu-correo@ejemplo.com"
                    disabled={status === 'verifying'}
                    className="w-full bg-[#FFF9E6] border-2 border-[#2B0B2E] focus:border-[#FF3377] text-[#2B0B2E] placeholder:text-[#6C586B]/60 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-3 focus:ring-[#FF3377]/30 shadow-[3px_3px_0_#2B0B2E] transition-all"
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-[#FF3377] mt-0.5 font-bold flex items-center gap-1">
                    ⚠️ {errorMessage}
                  </p>
                )}
              </div>

              {/* UPSELL BOX (Interactive Post-Purchase Add-on) */}
              <div
                onClick={() => {
                  uiAudio.play('select');
                  setHasUpsell(!hasUpsell);
                }}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  hasUpsell
                    ? 'bg-[#FFE600] border-[#2B0B2E] shadow-[3px_3px_0_#FF3377]'
                    : 'bg-white border-[#2B0B2E]/40 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-lg border-2 border-[#2B0B2E] flex items-center justify-center font-bold text-xs ${
                        hasUpsell ? 'bg-[#FF3377] text-white' : 'bg-white'
                      }`}
                    >
                      {hasUpsell ? '✓' : ''}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-xs text-[#2B0B2E]">
                          Upsell Acelerador Glúteos VIP
                        </span>
                        <span className="bg-[#FF3377] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-[#2B0B2E]">
                          90% OFF
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6C586B] font-bold">
                        Guarda tu nombre e historial acelerado en Cookie & IP
                      </span>
                    </div>
                  </div>
                  <Flame className="w-5 h-5 text-[#FF3377] flex-shrink-0" />
                </div>
              </div>

              {/* Quick Fill Pills */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#6C586B]">Accesos rápidos de prueba:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('magalhaesdiogo2018@gmail.com', 'Diogo Magalhães')}
                    className="px-2 py-1 bg-white hover:bg-[#FFE600] text-[10px] font-bold text-[#2B0B2E] rounded-lg border-1.5 border-[#2B0B2E] shadow-[1.5px_1.5px_0_#2B0B2E] transition-all cursor-pointer"
                  >
                    Diogo (magalhaesdiogo2018@gmail.com)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('camila.alumna@gluteos28.com', 'Camila Silva')}
                    className="px-2 py-1 bg-white hover:bg-[#FFE600] text-[10px] font-bold text-[#2B0B2E] rounded-lg border-1.5 border-[#2B0B2E] shadow-[1.5px_1.5px_0_#2B0B2E] transition-all cursor-pointer"
                  >
                    Camila (camila.alumna@gluteos28.com)
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={status === 'verifying'}
                className="cta-button mt-1"
              >
                {status === 'verifying' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando en IP & Cookie...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 stroke-[3]" />
                    <span>Desbloquear Mi Acceso PRO</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
                <span className="button-sheen" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[10px] font-bold text-[#6C586B] pt-0.5">
                <Lock className="w-3.5 h-3.5 text-[#00A859]" />
                <span>Backend Simulado · Nombre y datos persistidos por IP y Cookie</span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <footer className="w-full max-w-md text-center py-2 z-10">
        <p className="text-[11px] font-bold text-[#6C586B]">
          Método Glúteos 28 Días © 2026 · Persistencia Inteligente en IP & Cookies
        </p>
      </footer>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-sm rounded-3xl p-5 shadow-[6px_6px_0_#2B0B2E] flex flex-col gap-3.5 screen-enter text-[#2B0B2E]">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2.5">
              <h3 className="font-display font-black text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF3377]" />
                Acceso & Backend Simulado
              </h3>
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setShowHelpModal(false);
                }}
                className="w-7 h-7 rounded-lg border-2 border-[#2B0B2E] bg-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#6C586B] leading-relaxed">
              El sistema simula un backend real: guarda tu <strong>Nombre</strong>, <strong>Correo</strong> y <strong>Upsell VIP</strong> tanto en las <strong>Cookies del navegador</strong> (duración 365 días) como indexados por tu <strong>dirección IP ({geoTime.ip})</strong>.
            </p>
            <div className="bg-white p-3 rounded-xl border-2 border-[#2B0B2E] text-xs font-semibold text-[#2B0B2E]">
              💡 <strong>Persistencia Total:</strong> Si cierras la pestaña, recargas o vuelves mañana desde este mismo dispositivo o red, tu nombre e información seguirán guardados automáticamente.
            </div>
            <button
              onClick={() => {
                uiAudio.play('click');
                setShowHelpModal(false);
              }}
              className="w-full py-2.5 bg-[#2B0B2E] text-[#FFE600] font-display font-black text-xs uppercase rounded-xl shadow-[3px_3px_0_#FF3377] transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

