import React, { useState, useEffect, useRef } from 'react';
import { TabType, UserSession } from '../types';
import { IMAGES, FALLBACK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { uiAudio } from '../utils/audioEngine';
import { saveUserSessionToBackend } from '../utils/mockBackendService';
import { processImageFile } from '../utils/imageUtils';
import { AppSlug, ROUTES } from '../utils/router';
import {
  Home,
  Dumbbell,
  Utensils,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Mail,
  Calendar,
  X,
  Compass,
  User,
  Edit3,
  Check,
  Globe2,
  Cookie,
  Flame,
  Lock,
  Camera,
  Scale,
  Ruler,
  UploadCloud,
  Link2,
} from 'lucide-react';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

interface TopHeaderProps {
  currentTab: TabType;
  currentSlug?: AppSlug;
  userSession?: UserSession | null;
  onLogout?: () => void;
  onOpenQuiz?: () => void;
  onUpdateSession?: (updatedSession: UserSession) => void;
  onOpenOnboarding?: () => void;
  onOpenUpsell?: () => void;
  onNavigateSlug?: (slug: AppSlug) => void;
}

export function TopHeader({
  currentTab,
  currentSlug,
  userSession,
  onLogout,
  onOpenQuiz,
  onUpdateSession,
  onOpenOnboarding,
  onOpenUpsell,
  onNavigateSlug,
}: TopHeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userSession?.name || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userSession?.name) {
      setNameInput(userSession.name);
    }
  }, [userSession?.name]);

  const handleAvatarUpload = async (file: File) => {
    if (!userSession) return;
    try {
      const dataUrl = await processImageFile(file, 300, 300, 0.8);
      uiAudio.play('success');
      const updated: UserSession = {
        ...userSession,
        avatarUrl: dataUrl,
        updatedAt: new Date().toISOString(),
      };
      saveUserSessionToBackend(updated, userSession.ip);
      if (onUpdateSession) onUpdateSession(updated);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 2500);
    } catch (e) {
      uiAudio.play('alert');
    }
  };

  const handleSaveName = () => {
    if (!nameInput.trim() || !userSession) return;
    const cleanName = nameInput.trim();
    uiAudio.play('success');

    const updated: UserSession = {
      ...userSession,
      name: cleanName,
      updatedAt: new Date().toISOString(),
    };

    saveUserSessionToBackend(updated, userSession.ip);
    if (onUpdateSession) onUpdateSession(updated);

    setIsEditingName(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleToggleUpsell = () => {
    if (!userSession) return;
    uiAudio.play('success');
    const nextUpsell = !userSession.hasUpsell;

    const updated: UserSession = {
      ...userSession,
      hasUpsell: nextUpsell,
      upsellName: nextUpsell ? 'Protocolo Acelerador Glúteos 28D VIP' : undefined,
      plan: nextUpsell
        ? 'Desafío Glúteos 28 Días + Acelerador VIP'
        : 'Desafío Glúteos 28 Días · Vitalicio',
      updatedAt: new Date().toISOString(),
    };

    saveUserSessionToBackend(updated, userSession.ip);
    if (onUpdateSession) onUpdateSession(updated);

    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const getTabName = () => {
    switch (currentTab) {
      case 'inicio': return 'Inicio';
      case 'entrenar': return 'Entrenar';
      case 'comidas': return 'Comidas';
      case 'coach-ai': return 'Coach AI';
      case 'progreso': return 'Progreso';
    }
  };

  return (
    <>
      <header
        id="top-header"
        className="sticky top-0 inset-x-0 z-40 bg-[#FFF9E6]/95 backdrop-blur-xl border-b-2.5 border-[#2B0B2E] shadow-[0_4px_12px_rgba(43,11,46,0.08)]"
      >
        <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="brand-mark">⚡</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-base text-[#2B0B2E] tracking-tight">
                  Glúteos 28D
                </span>
                <span className="bg-[#FF3377] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-[#2B0B2E] shadow-[1.5px_1.5px_0_#2B0B2E]">
                  {userSession?.hasUpsell ? 'VIP+' : 'PRO'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#6C586B] uppercase tracking-wider">
                  {getTabName()}
                </span>
                {currentSlug && (
                  <span className="text-[9px] font-mono font-black text-[#FF3377] bg-white border border-[#2B0B2E]/30 px-1.5 py-0.2 rounded-md">
                    {currentSlug}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right actions: Quiz badge & Profile */}
          <div className="flex items-center gap-2">
            {onOpenQuiz && (
              <button
                onClick={() => {
                  uiAudio.play('click');
                  onOpenQuiz();
                }}
                className="flex items-center gap-1 text-[11px] font-black text-[#2B0B2E] bg-[#FFE600] hover:bg-[#A7FF00] border-2 border-[#2B0B2E] px-2.5 py-1 rounded-full shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer"
                title="Abrir Evaluación de 28 Días"
              >
                <Compass className="w-3.5 h-3.5 text-[#FF3377]" />
                <span className="hidden sm:inline">Diagnóstico 28D</span>
                <span className="sm:hidden">28D</span>
              </button>
            )}

            {onOpenUpsell && (
              <button
                onClick={() => {
                  uiAudio.play('click');
                  onOpenUpsell();
                }}
                className="flex items-center gap-1 text-[11px] font-black bg-[#FF3377] hover:bg-[#FFE600] text-white hover:text-[#2B0B2E] border-2 border-[#2B0B2E] px-2.5 py-1 rounded-full shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer"
                title="Abrir Página de Upsell Oficial"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Página Upsell</span>
                <span className="sm:hidden">Upsell</span>
              </button>
            )}

            <button
              onClick={() => {
                uiAudio.play('click');
                setShowProfileModal(true);
              }}
              className="relative focus:outline-none group cursor-pointer"
              title="Ver detalles de la cuenta y persistencia en IP & Cookie"
            >
              {userSession?.avatarUrl ? (
                <img
                  src={userSession.avatarUrl}
                  alt={userSession.name || 'Perfil'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#2B0B2E] group-hover:scale-105 transition-all shadow-[2px_2px_0_#2B0B2E]"
                />
              ) : (
                <ImageWithFallback
                  src={IMAGES.profile}
                  fallbackSrc={FALLBACK_IMAGES.profile}
                  alt={userSession?.name || 'Perfil'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#2B0B2E] group-hover:scale-105 transition-all shadow-[2px_2px_0_#2B0B2E]"
                />
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00A859] border border-[#2B0B2E]" />
            </button>
          </div>
        </div>
      </header>

      {/* User Account / Purchase Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-sm rounded-3xl p-5 shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] flex flex-col gap-3.5 screen-enter text-[#2B0B2E] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00A859]" />
                <h3 className="font-display font-black text-[#2B0B2E] text-base">
                  Perfil de Miembro VIP
                </h3>
              </div>
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setShowProfileModal(false);
                }}
                className="w-7 h-7 rounded-lg border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-2 bg-[#A7FF00]/40 rounded-xl border border-[#00A859] text-xs font-bold text-[#2B0B2E] flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 text-[#00A859]" />
                <span>¡Actualizado y guardado en tu IP y Cookie!</span>
              </div>
            )}

            {/* Profile Avatar & Editable Name with Photo Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAvatarUpload(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col gap-2.5 bg-white p-3 rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E]">
              <div className="flex items-center gap-3">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Cambiar foto de perfil (clic para subir)"
                >
                  {userSession?.avatarUrl ? (
                    <img
                      src={userSession.avatarUrl}
                      alt="Profile"
                      className="w-13 h-13 rounded-full object-cover border-2 border-[#2B0B2E]"
                    />
                  ) : (
                    <ImageWithFallback
                      src={IMAGES.profile}
                      fallbackSrc={FALLBACK_IMAGES.profile}
                      alt="Profile"
                      className="w-13 h-13 rounded-full object-cover border-2 border-[#2B0B2E]"
                    />
                  )}
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#FF3377] text-white border border-[#2B0B2E] flex items-center justify-center shadow-[1px_1px_0_#2B0B2E]">
                    <Camera className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  {!isEditingName ? (
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-black text-[#2B0B2E] truncate">
                        {userSession?.name || 'Alumna Registrada'}
                      </span>
                      <button
                        onClick={() => {
                          uiAudio.play('select');
                          setIsEditingName(true);
                        }}
                        className="text-[10px] font-bold text-[#FF3377] hover:text-[#2B0B2E] flex items-center gap-1 bg-[#FFF9E6] px-2 py-0.5 rounded-full border border-[#2B0B2E] cursor-pointer"
                        title="Modificar nombre"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Nombre de la alumna"
                        className="flex-1 bg-[#FFF9E6] border border-[#2B0B2E] px-2 py-1 rounded-lg text-xs font-bold text-[#2B0B2E] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1 bg-[#A7FF00] border border-[#2B0B2E] rounded-lg text-[#2B0B2E] cursor-pointer hover:bg-[#FFE600]"
                        title="Guardar nombre en Cookie & IP"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-bold text-[#FF3377] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Subir foto de perfil</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mini Onboarding / Measurements summary card */}
              <div className="bg-[#FFF9E6] p-2.5 rounded-xl border border-[#2B0B2E]/20 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#6C586B] tracking-wider flex items-center gap-1">
                    <Scale className="w-3 h-3 text-[#FF3377]" />
                    Medidas Iniciales (28D)
                  </span>
                  {userSession?.hasCompletedOnboarding ? (
                    <span className="text-[9px] bg-[#A7FF00] text-[#2B0B2E] font-black px-1.5 py-0.2 rounded border border-[#2B0B2E]">
                      REGISTRADAS
                    </span>
                  ) : (
                    <span className="text-[9px] bg-[#FFE600] text-[#2B0B2E] font-black px-1.5 py-0.2 rounded border border-[#2B0B2E]">
                      PENDIENTE
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-[#2B0B2E]">
                  <div>
                    Peso inicial:{' '}
                    <strong>{userSession?.weight ? `${userSession.weight} kg` : '62.0 kg'}</strong>
                  </div>
                  <div>
                    Estatura:{' '}
                    <strong>{userSession?.height ? `${userSession.height} cm` : '165 cm'}</strong>
                  </div>
                  <div className="col-span-2">
                    Foto Día 1 (Antes):{' '}
                    <strong className={userSession?.initialPhotoUrl ? 'text-[#00A859]' : 'text-[#6C586B]'}>
                      {userSession?.initialPhotoUrl ? 'Guardada para comparar ✓' : 'Sin foto'}
                    </strong>
                  </div>
                </div>

                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(false);
                      onOpenOnboarding();
                    }}
                    className="w-full mt-1 py-1.5 px-2 bg-white hover:bg-[#FFE600] text-[#2B0B2E] border border-[#2B0B2E] rounded-lg text-[10px] font-black flex items-center justify-center gap-1.5 shadow-[1px_1px_0_#2B0B2E] cursor-pointer transition-all"
                  >
                    <Ruler className="w-3 h-3 text-[#00A859]" />
                    <span>Configurar Peso, Altura & Foto Inicial (Onboarding)</span>
                  </button>
                )}
              </div>

              {/* Upsell VIP Status Card */}
              <div className="pt-1.5 border-t border-[#2B0B2E]/10 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#6C586B] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#FF3377]" />
                    Upsell Acelerador 28D:
                  </span>
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                      userSession?.hasUpsell
                        ? 'bg-[#FFE600] text-[#2B0B2E] border-[#2B0B2E]'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {userSession?.hasUpsell ? 'VIP Activo' : 'No Incluido'}
                  </span>
                </div>

                <button
                  onClick={handleToggleUpsell}
                  className="w-full text-center text-[10px] font-black text-[#2B0B2E] bg-[#FFE600] hover:bg-[#A7FF00] border border-[#2B0B2E] py-1 rounded-lg shadow-[1px_1px_0_#2B0B2E] cursor-pointer transition-all"
                >
                  {userSession?.hasUpsell
                    ? 'Desactivar Upsell'
                    : '⚡ Activar Upsell Protocolo Acelerador (90% OFF)'}
                </button>

                {onOpenUpsell && (
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      onOpenUpsell();
                    }}
                    className="w-full text-center text-[10px] font-black text-white bg-[#FF3377] hover:bg-[#FFE600] hover:text-[#2B0B2E] border border-[#2B0B2E] py-1.5 rounded-lg shadow-[1px_1px_0_#2B0B2E] cursor-pointer transition-all flex items-center justify-center gap-1 mt-0.5"
                  >
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>Ver Página Oficial do Upsell (com Cronômetro)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Direct Slugs Directory */}
            <div className="bg-[#FFF9E6] p-3 rounded-2xl border border-[#2B0B2E]/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#6C586B] tracking-wider flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-[#FF3377]" />
                  Slugs Disponíveis na Aplicação
                </span>
                <span className="text-[9px] font-black bg-[#FFE600] text-[#2B0B2E] px-1.5 py-0.2 rounded border border-[#2B0B2E]">
                  9 ROTAS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-left">
                {(Object.keys(ROUTES) as AppSlug[]).map((slug) => {
                  const meta = ROUTES[slug];
                  const isActive = currentSlug === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => {
                        setShowProfileModal(false);
                        if (onNavigateSlug) onNavigateSlug(slug);
                      }}
                      className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col ${
                        isActive
                          ? 'bg-[#2B0B2E] text-[#FFE600] border-[#2B0B2E]'
                          : 'bg-white hover:bg-[#FFE600] text-[#2B0B2E] border-[#2B0B2E]/30'
                      }`}
                    >
                      <span className="font-mono font-black text-[11px]">{slug}</span>
                      <span className="text-[9px] opacity-80 truncate">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Backend Simulation Diagnostic Card */}
            <div className="flex flex-col gap-2 text-xs bg-white/80 p-3 rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
              <div className="flex items-center justify-between pb-1 border-b border-[#2B0B2E]/10">
                <span className="text-[10px] font-black uppercase text-[#6C586B] tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#00A859]" />
                  Backend Simulado (Persistencia)
                </span>
                <span className="text-[10px] font-black text-[#00A859]">En Línea</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#6C586B] flex items-center gap-1.5 font-bold">
                  <Globe2 className="w-3.5 h-3.5 text-[#FF3377]" />
                  IP del Dispositivo:
                </span>
                <span className="text-[#2B0B2E] font-mono font-bold text-[11px]">
                  {userSession?.ip || '187.19.120.45'}
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#6C586B] flex items-center gap-1.5 font-bold">
                  <Cookie className="w-3.5 h-3.5 text-[#FFE600]" />
                  Cookie del Navegador:
                </span>
                <span className="text-[#00A859] font-bold text-[11px]">
                  gluteos_user_session (365d)
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#6C586B] flex items-center gap-1.5 font-bold">
                  <Mail className="w-3.5 h-3.5 text-[#FF3377]" />
                  Correo vinculado:
                </span>
                <span className="text-[#2B0B2E] font-mono font-bold truncate max-w-[150px]">
                  {userSession?.email || 'aluna@vip.com'}
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#6C586B] flex items-center gap-1.5 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  Activación:
                </span>
                <span className="text-[#2B0B2E] font-bold">
                  {userSession?.purchasedAt || 'Hoy'}
                </span>
              </div>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              {onLogout && (
                <button
                  onClick={() => {
                    uiAudio.play('back');
                    setShowProfileModal(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-3 bg-white hover:bg-[#FFE600] text-[#FF3377] hover:text-[#2B0B2E] border-2 border-[#2B0B2E] rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar sesión / Limpiar Cookie & IP</span>
                </button>
              )}
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setShowProfileModal(false);
                }}
                className="w-full py-2.5 bg-[#2B0B2E] text-[#FFE600] font-display font-black text-xs uppercase rounded-xl shadow-[3px_3px_0_#FF3377] transition-all cursor-pointer"
              >
                Volver a la App
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BottomNavBar({ currentTab, onSelectTab }: NavigationProps) {
  const navItems: { id: TabType; label: string; icon: typeof Home }[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'entrenar', label: 'Entrenar', icon: Dumbbell },
    { id: 'comidas', label: 'Comidas', icon: Utensils },
    { id: 'coach-ai', label: 'Coach AI', icon: Sparkles },
    { id: 'progreso', label: 'Progreso', icon: TrendingUp },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#FFF9E6]/95 backdrop-blur-xl border-t-2.5 border-[#2B0B2E] shadow-[0_-4px_20px_rgba(43,11,46,0.1)]"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => {
                uiAudio.play('click');
                onSelectTab(item.id);
              }}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FF3377] text-white font-black border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] scale-105'
                  : 'text-[#6C586B] hover:text-[#2B0B2E] active:scale-95'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
