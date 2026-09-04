import React, { useState } from 'react';
import { TabType, HabitItem, UserSession } from '../types';
import { IMAGES, FALLBACK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { uiAudio } from '../utils/audioEngine';
import { useGeoTime } from '../utils/useGeoTime';
import { saveUserSessionToBackend } from '../utils/mockBackendService';
import {
  Calendar,
  Dumbbell,
  Clock,
  Plus,
  Minus,
  Zap,
  Utensils,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Timer,
  ShieldAlert,
  Compass,
  MapPin,
  Globe2,
  Cookie,
  Flame,
  Award,
  Camera,
  Scale,
  Ruler,
} from 'lucide-react';

interface InicioTabProps {
  onNavigate: (tab: TabType, prompt?: string) => void;
  waterGlasses: number;
  onAddWater: () => void;
  onRemoveWater?: () => void;
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onOpenQuiz?: () => void;
  currentProtein?: number;
  completedWorkoutSets?: number;
  onResetAll?: () => void;
  userSession?: UserSession | null;
  onUpdateSession?: (updated: UserSession) => void;
  onOpenOnboarding?: () => void;
  onOpenCookbook?: () => void;
  onOpenUpsell?: () => void;
}

export function InicioTab({
  onNavigate,
  waterGlasses,
  onAddWater,
  onRemoveWater,
  habits,
  onToggleHabit,
  onOpenQuiz,
  currentProtein = 0,
  completedWorkoutSets = 0,
  onResetAll,
  userSession,
  onUpdateSession,
  onOpenOnboarding,
  onOpenCookbook,
  onOpenUpsell,
}: InicioTabProps) {
  const geoTime = useGeoTime();
  const completedHabitsCount = habits.filter((h) => h.completed).length;
  const maxWater = 8;
  const targetProtein = 115;
  const waterPercent = Math.min(100, Math.round((waterGlasses / maxWater) * 100));
  const waterLiters = (waterGlasses * 0.3).toFixed(1);
  const proteinPercent = Math.min(100, Math.round((currentProtein / targetProtein) * 100));
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="flex flex-col gap-5 pb-8 screen-enter font-body text-[#2B0B2E]">
      {/* Greeting & GeoTime Header */}
      <section id="greeting-section" className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="eyebrow-pill">
            <Calendar className="w-3.5 h-3.5 text-[#FF3377]" />
            <span>Día 1 de 28 · Inicio del Desafío</span>
          </span>
          <div className="flex items-center gap-1.5">
            {onResetAll && (
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setShowResetConfirm(true);
                }}
                className="text-[10px] font-black text-[#6C586B] hover:text-[#FF3377] bg-white border border-[#2B0B2E] px-2 py-0.5 rounded-full shadow-[1px_1px_0_#2B0B2E] transition-all cursor-pointer"
                title="Poner todos los números en cero para empezar de nuevo"
              >
                🔄 Reiniciar Todo
              </button>
            )}
            <span className="text-[11px] font-black text-[#00A859] bg-[#A7FF00]/40 border-1.5 border-[#2B0B2E] px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0_#2B0B2E]">
              ⚡ Punto Cero
            </span>
          </div>
        </div>

        {/* Dynamic Greeting tailored by Local Time & User Name */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B0B2E] tracking-tight leading-none">
                {geoTime.greeting}
                {userSession?.name ? `, ${userSession.name.split(' ')[0]}` : ''}
              </h1>
              {userSession?.hasUpsell && (
                <span className="bg-[#FFE600] text-[#2B0B2E] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#2B0B2E] shadow-[1px_1px_0_#2B0B2E]">
                  VIP+
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#6C586B] font-semibold">
              Semana 1 · Bloque 1: Fundación & Conciencia Motora
            </p>
          </div>

          {/* User Profile Avatar with fast onboarding trigger */}
          <button
            type="button"
            onClick={() => {
              if (onOpenOnboarding) {
                uiAudio.play('click');
                onOpenOnboarding();
              }
            }}
            className="relative flex-shrink-0 cursor-pointer group"
            title="Editar Ficha Inicial & Foto de Perfil"
          >
            {userSession?.avatarUrl ? (
              <img
                src={userSession.avatarUrl}
                alt="Perfil Alumna"
                className="w-12 h-12 rounded-2xl object-cover border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] group-hover:scale-105 transition-all"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] overflow-hidden flex items-center justify-center group-hover:scale-105 transition-all">
                <ImageWithFallback
                  src={IMAGES.profile}
                  fallbackSrc={FALLBACK_IMAGES.profile}
                  alt="Perfil Camila"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF3377] text-white border border-[#2B0B2E] flex items-center justify-center shadow-[1px_1px_0_#2B0B2E]">
              <Camera className="w-2.5 h-2.5" />
            </span>
          </button>
        </div>

        {/* IP Geolocation & Local Time Dynamic Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9E6] border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#FFE600] border border-[#2B0B2E] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#FF3377]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[#2B0B2E] truncate">
                  {geoTime.city}, {geoTime.country}
                </span>
                <span className="bg-[#A7FF00] text-[#2B0B2E] text-[9px] font-black px-1.5 py-0.2 rounded border border-[#2B0B2E]">
                  {geoTime.isIpDetected ? 'IP detectada' : 'Hora Local'}
                </span>
              </div>
              <span className="text-[10px] text-[#6C586B] font-medium truncate">
                {geoTime.formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#2B0B2E] text-[#FFE600] px-2.5 py-1 rounded-xl font-mono font-black text-xs shadow-[1.5px_1.5px_0_#FF3377]">
            <Clock className="w-3.5 h-3.5 text-[#A7FF00]" />
            <span>{geoTime.formattedTime}</span>
          </div>
        </div>

        {/* UPSELL STATUS & BACKEND SIMULATION QUICK BANNER */}
        {userSession && (
          <div className="p-3 rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] bg-white flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border border-[#2B0B2E] ${
                  userSession.hasUpsell ? 'bg-[#FFE600] text-[#2B0B2E]' : 'bg-[#FFF9E6] text-[#FF3377]'
                }`}>
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-[#2B0B2E]">
                    {userSession.hasUpsell
                      ? '⚡ Protocolo Acelerador VIP Activo'
                      : '⚡ Protocolo Acelerador VIP (Upsell)'}
                  </span>
                  <span className="text-[10px] text-[#6C586B]">
                    Registrado a nombre de: <strong className="text-[#2B0B2E]">{userSession.name}</strong>
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                userSession.hasUpsell
                  ? 'bg-[#A7FF00] text-[#2B0B2E] border-[#2B0B2E]'
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}>
                {userSession.hasUpsell ? 'VIP INCLUIDO' : 'OPCIONAL'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#2B0B2E]/10 text-[10px] font-bold text-[#6C586B]">
              <span className="flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-[#FF3377]" />
                IP: <strong className="text-[#2B0B2E]">{userSession.ip}</strong>
              </span>
              <span className="flex items-center gap-1 text-[#00A859]">
                <Cookie className="w-3 h-3 text-[#00A859]" />
                Guardado en Cookie & IP
              </span>
            </div>

            {onOpenUpsell && (
              <button
                onClick={() => {
                  uiAudio.play('click');
                  onOpenUpsell();
                }}
                className="mt-1 w-full p-2 rounded-xl bg-[#FFE600] hover:bg-[#A7FF00] text-[#2B0B2E] border-1.5 border-[#2B0B2E] shadow-[1.5px_1.5px_0_#2B0B2E] text-xs font-black flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#FF3377] fill-[#FF3377]" />
                  <span>
                    {userSession.hasUpsell
                      ? 'Ver Página do Acelerador VIP (Upsell)'
                      : '⚡ Ver Oferta do Acelerador VIP 3X (com Cronômetro)'}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        )}

        {/* MINI ONBOARDING & EVOLUTION 28D POPUP TRIGGER CARD */}
        <div className="p-3.5 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] bg-[#FFF9E6] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center shadow-[1.5px_1.5px_0_#2B0B2E]">
                <Scale className="w-4 h-4 text-[#FF3377]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#2B0B2E]">
                  Ficha Inicial & Comparador 28 Días
                </span>
                <span className="text-[10px] text-[#6C586B] font-bold">
                  {userSession?.hasCompletedOnboarding
                    ? `Peso: ${userSession.weight || 62}kg · Altura: ${userSession.height || 165}cm`
                    : 'Registra tus medidas y foto para medir tus 28 días'}
                </span>
              </div>
            </div>

            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                userSession?.hasCompletedOnboarding
                  ? 'bg-[#A7FF00] text-[#2B0B2E] border-[#2B0B2E]'
                  : 'bg-[#FF3377] text-white border-[#2B0B2E] animate-pulse'
              }`}
            >
              {userSession?.hasCompletedOnboarding ? 'CALIBRADO' : '¡PENDIENTE!'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#2B0B2E]/10">
            <div className="flex items-center gap-2 text-[11px] text-[#2B0B2E]">
              {userSession?.initialPhotoUrl ? (
                <span className="flex items-center gap-1 text-[#00A859] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Foto Día 1 Guardada
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#6C586B] font-medium">
                  <Camera className="w-3.5 h-3.5 text-[#FF3377]" />
                  Foto Día 1 opcional
                </span>
              )}
            </div>

            {onOpenOnboarding && (
              <button
                type="button"
                onClick={() => {
                  uiAudio.play('click');
                  onOpenOnboarding();
                }}
                className="px-3 py-1.5 bg-[#FFE600] hover:bg-[#A7FF00] border-2 border-[#2B0B2E] rounded-xl text-xs font-black text-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>{userSession?.hasCompletedOnboarding ? 'Ver / Editar Ficha' : 'Completar en Pop-up'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-xs rounded-3xl p-5 shadow-[6px_6px_0_#2B0B2E] flex flex-col gap-3 text-center text-[#2B0B2E]">
            <span className="text-3xl">🔄</span>
            <h3 className="font-display font-black text-base">¿Reiniciar Todo el Panel?</h3>
            <p className="text-xs text-[#6C586B]">
              Esto pondrá todos los contadores (agua, comidas, entrenamientos y hábitos) totalmente en cero para que empieces desde el inicio.
            </p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-white border-2 border-[#2B0B2E] rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  uiAudio.play('success');
                  if (onResetAll) onResetAll();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 bg-[#FF3377] text-white border-2 border-[#2B0B2E] rounded-xl text-xs font-black shadow-[2px_2px_0_#2B0B2E] cursor-pointer"
              >
                Sí, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 28 Days High Conversion Quiz Interactive Banner */}
      {onOpenQuiz && (
        <section
          onClick={() => {
            uiAudio.play('click');
            onOpenQuiz();
          }}
          className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-[#FFE600] via-[#A7FF00] to-[#FFE600] border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E] flex items-center justify-between cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#FF3377] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B0B2E] text-[#FFE600] flex items-center justify-center font-black shadow-[2px_2px_0_#FF3377] group-hover:rotate-6 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[#2B0B2E] uppercase tracking-wider">
                Diagnóstico Oficial 28 Días
              </span>
              <span className="font-display font-black text-sm text-[#2B0B2E] leading-tight">
                Rehacer Test & Cupón BUMBUM90
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#2B0B2E] text-white text-xs font-black px-2.5 py-1.5 rounded-xl group-hover:bg-[#FF3377] transition-colors">
            <span>Abrir</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </section>
      )}

      {/* 2x2 Bento Metrics Grid */}
      <section id="metrics-bento-grid" className="grid grid-cols-2 gap-3">
        {/* Metric 1: Workout */}
        <div
          id="metric-card-workout"
          onClick={() => {
            uiAudio.play('click');
            onNavigate('entrenar');
          }}
          className="neo-card neo-card-interactive p-4 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#6C586B] uppercase tracking-wider">
              Entrenamiento Hoy
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF9E6] border-1.5 border-[#2B0B2E] flex items-center justify-center text-[#FF3377]">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-base text-[#2B0B2E]">Glúteos A</div>
            <div className="flex items-center gap-1.5 mt-1 text-[#FF3377] font-bold text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>{completedWorkoutSets} de 4 series · {completedWorkoutSets === 4 ? 'Completado ✓' : 'Pendiente'}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Protein */}
        <div
          id="metric-card-protein"
          onClick={() => {
            uiAudio.play('click');
            onNavigate('comidas');
          }}
          className="neo-card neo-card-interactive p-4 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#6C586B] uppercase tracking-wider">
              Proteína
            </span>
            <span className="text-[10px] font-black bg-[#A7FF00] border border-[#2B0B2E] px-1.5 py-0.2 rounded-md">
              {proteinPercent}%
            </span>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-base text-[#2B0B2E]">
              {currentProtein}g <span className="text-xs font-normal text-[#6C586B]">/ {targetProtein}g</span>
            </div>
            <span className="text-[11px] font-black text-[#00A859]">
              {currentProtein >= targetProtein ? '¡Meta alcanzada! 🎉' : `Faltan ~${Math.max(0, targetProtein - currentProtein)}g`}
            </span>
          </div>
        </div>

        {/* Metric 3: Hydration */}
        <div
          id="metric-card-water"
          className="neo-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#6C586B] uppercase tracking-wider">
              Hidratación
            </span>
            <div className="flex items-center gap-1">
              {onRemoveWater && waterGlasses > 0 && (
                <button
                  id="btn-remove-water"
                  aria-label="Disminuir vaso de agua"
                  onClick={() => {
                    uiAudio.play('click');
                    onRemoveWater();
                  }}
                  className="w-6 h-6 rounded-md bg-white hover:bg-[#FFE600] border-1.5 border-[#2B0B2E] flex items-center justify-center text-[#2B0B2E] active:scale-90 transition-all cursor-pointer"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
              )}
              <button
                id="btn-add-water"
                aria-label="Añadir vaso de agua"
                onClick={() => {
                  uiAudio.play('click');
                  onAddWater();
                }}
                className="w-6 h-6 rounded-md bg-[#2B0B2E] hover:bg-[#FF3377] text-[#FFE600] flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-[1px_1px_0_#FF3377]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-base text-[#2B0B2E] flex items-baseline justify-between">
              <span>{waterGlasses} / {maxWater} vasos</span>
              <span className="text-[11px] font-bold text-[#6C586B]">{waterLiters}L</span>
            </div>
            <div className="progress-track mt-1.5 h-2">
              <div
                className="progress-fill"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Streak */}
        <div
          id="metric-card-streak"
          className="neo-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#6C586B] uppercase tracking-wider">
              Constancia
            </span>
            <span className="text-xl">🔥</span>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-base text-[#2B0B2E]">0 Días</div>
            <span className="text-[11px] font-black text-[#FF3377]">¡Primer día del desafío!</span>
          </div>
        </div>
      </section>

      {/* Main Workout Hero in Neo-Pop Dark Panel */}
      <section
        id="workout-hero-card"
        className="dark-panel flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <span className="dark-eyebrow">
            DÍA 1 · FUNDACIÓN & HIPERTROFIA
          </span>
          <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/20">
            Fuerza Base
          </span>
        </div>

        {/* Workout Details */}
        <div className="flex flex-col gap-2">
          <h2 className="font-display font-black text-2xl text-white leading-tight">
            Glúteos A: Tensión Mecánica & Puente
          </h2>
          <p className="text-xs text-white/80 leading-relaxed">
            Enfoque en rango acortado y sobrecarga progresiva del glúteo mayor superior e inferior.
          </p>
        </div>

        {/* Dynamic Workout Tip adjusted for IP local time */}
        <div className="bg-[#FFE600]/15 border border-[#FFE600]/30 rounded-xl p-2.5 text-xs text-[#FFE600] flex items-start gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0 text-[#FFE600] mt-0.5" />
          <span>
            <strong>Consejo para tu hora local ({geoTime.formattedTime}):</strong> {geoTime.workoutRecommendation}
          </span>
        </div>

        {/* Quick specs */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex flex-col items-center">
            <Timer className="w-4 h-4 text-[#A7FF00]" />
            <span className="font-bold text-xs mt-0.5">32 min</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex flex-col items-center">
            <Layers className="w-4 h-4 text-[#FFE600]" />
            <span className="font-bold text-xs mt-0.5">{completedWorkoutSets}/4 series</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex flex-col items-center">
            <Zap className="w-4 h-4 text-[#FF3377]" />
            <span className="font-bold text-xs mt-0.5">RPE 8-9</span>
          </div>
        </div>

        {/* Key movements preview */}
        <div className="bg-[#2B0B2E]/60 rounded-xl p-3 border border-white/15 flex flex-col gap-1.5 text-xs text-white">
          <span className="text-[10px] font-black text-[#A7FF00] uppercase tracking-wider">
            Movimientos principales:
          </span>
          <div className="flex justify-between py-0.5 border-b border-white/10">
            <span>1. Hip Thrust con pausa 2s</span>
            <span className="text-[#FFE600] font-bold">4 × 10</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-white/10">
            <span>2. Búlgaro inclinado con mancuernas</span>
            <span className="text-[#FFE600] font-bold">3 × 8/lado</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>3. Abducción en polea / elástico</span>
            <span className="text-[#FFE600] font-bold">3 × 15</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            uiAudio.play('success');
            onNavigate('entrenar');
          }}
          className="cta-button cta-light text-[#2B0B2E] mt-1"
        >
          <span>{completedWorkoutSets === 0 ? 'EMPEZAR ENTRENAMIENTO' : 'CONTINUAR ENTRENAMIENTO'}</span>
          <Zap className="w-4 h-4 stroke-[3]" />
          <span className="button-sheen" />
        </button>
      </section>

      {/* Nutrition Card */}
      <section
        id="nutrition-target-card"
        className="neo-card p-5 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF3377]/15 border-1.5 border-[#2B0B2E] flex items-center justify-center text-[#FF3377]">
              <Utensils className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-[#2B0B2E]">Meta Nutricional</h3>
              <p className="text-xs text-[#6C586B]">Meta diaria: {targetProtein}g proteína</p>
            </div>
          </div>
          <span className="text-xs font-black text-[#2B0B2E] bg-[#FFE600] border-1.5 border-[#2B0B2E] px-2.5 py-1 rounded-full shadow-[2px_2px_0_#2B0B2E]">
            {currentProtein}g hoy
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1">
          <div className="progress-track h-3">
            <div className="progress-fill" style={{ width: `${proteinPercent}%` }} />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-[#6C586B]">
            <span>Consumido: {proteinPercent}%</span>
            <span className="text-[#00A859]">
              {currentProtein >= targetProtein ? '¡Meta alcanzada!' : `Restan ~${Math.max(0, targetProtein - currentProtein)}g`}
            </span>
          </div>
        </div>

        {/* Dynamic Meal Item adjusted for IP local time */}
        <div
          onClick={() => {
            uiAudio.play('click');
            onNavigate('comidas');
          }}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF9E6] border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] hover:border-[#FF3377] transition-colors cursor-pointer"
        >
          <ImageWithFallback
            src={
              geoTime.activeMealKey === 'breakfast'
                ? IMAGES.breakfast
                : geoTime.activeMealKey === 'lunch'
                ? IMAGES.lunch
                : geoTime.activeMealKey === 'snack'
                ? IMAGES.afternoonSnack
                : geoTime.activeMealKey === 'dinner'
                ? IMAGES.dinner
                : IMAGES.supper
            }
            fallbackSrc={
              geoTime.activeMealKey === 'breakfast'
                ? FALLBACK_IMAGES.breakfast
                : geoTime.activeMealKey === 'lunch'
                ? FALLBACK_IMAGES.lunch
                : geoTime.activeMealKey === 'snack'
                ? FALLBACK_IMAGES.afternoonSnack
                : geoTime.activeMealKey === 'dinner'
                ? FALLBACK_IMAGES.dinner
                : FALLBACK_IMAGES.supper
            }
            alt={geoTime.activeMealLabel}
            className="w-12 h-12 rounded-lg object-cover border border-[#2B0B2E] flex-shrink-0"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#9D1CBB] uppercase">
                {geoTime.activeMealLabel} ({geoTime.activeMealTargetTime})
              </span>
              <span className="text-xs font-black text-[#00A859]">
                {geoTime.activeMealKey === 'breakfast'
                  ? '+30g prot'
                  : geoTime.activeMealKey === 'lunch'
                  ? '+38g prot'
                  : geoTime.activeMealKey === 'snack'
                  ? '+24g prot'
                  : geoTime.activeMealKey === 'dinner'
                  ? '+30g prot'
                  : '+20g prot'}
              </span>
            </div>
            <span className="font-display font-bold text-xs text-[#2B0B2E] truncate">
              {geoTime.activeMealKey === 'breakfast'
                ? 'Café da Manhã: Ovos Mexidos com Abacate & Pão Integral'
                : geoTime.activeMealKey === 'lunch'
                ? 'Almoço: Filé de Frango Grelhado, Arroz Integral & Feijão'
                : geoTime.activeMealKey === 'snack'
                ? 'Lanche: Iogurte Grego com Whey Protein & Frutas Vermelhas'
                : geoTime.activeMealKey === 'dinner'
                ? 'Janta: Omelete Proteica com Cottage & Aipim Cozido'
                : 'Ceia: Mousse Noturno Anti-Catabólico com Nozes & Cacau'}
            </span>
            <span className="text-[11px] text-[#6C586B] line-clamp-1">
              {geoTime.mealRecommendation}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            uiAudio.play('click');
            onNavigate('comidas');
          }}
          className="w-full py-3 rounded-xl bg-[#2B0B2E] text-[#FFE600] font-display font-black text-xs uppercase shadow-[3px_3px_0_#FF3377] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>VER PLAN DE COMIDAS COMPLETO</span>
        </button>
      </section>

      {/* AI Coach Shortcut Widget */}
      <section
        id="coach-shortcut-widget"
        className="neo-card p-5 flex flex-col gap-3.5 bg-gradient-to-br from-white to-[#FFF9E6]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#9D1CBB] border-2 border-[#2B0B2E] text-white flex items-center justify-center shadow-[3px_3px_0_#2B0B2E]">
            <Sparkles className="w-5 h-5 text-[#FFE600]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-base text-[#2B0B2E]">Coach Glúteos AI</h3>
              <span className="text-[10px] font-black bg-[#A7FF00] border border-[#2B0B2E] px-1.5 py-0.2 rounded-md">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-[#6C586B]">Resuelve dudas sobre ejercicios o sustituciones</p>
          </div>
        </div>

        {/* Quick prompt buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              uiAudio.play('select');
              onNavigate('coach-ai', 'No tengo pesas en casa para hacer el Hip Thrust');
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-[#FFE600] text-[#2B0B2E] text-xs font-bold border-1.5 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Dumbbell className="w-3.5 h-3.5 text-[#FF3377]" />
            <span>Sin mancuernas en casa</span>
          </button>
          <button
            onClick={() => {
              uiAudio.play('select');
              onNavigate('coach-ai', '¿Qué puedo comer para una cena rápida y rica en proteína?');
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-[#FFE600] text-[#2B0B2E] text-xs font-bold border-1.5 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5 text-[#00A859]" />
            <span>Cena proteica rápida</span>
          </button>
          <button
            onClick={() => {
              uiAudio.play('select');
              onNavigate('coach-ai', 'Siento una ligera molestia en la rodilla al hacer sentadilla');
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-[#FFE600] text-[#2B0B2E] text-xs font-bold border-1.5 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF3377]" />
            <span>Molestia en la rodilla</span>
          </button>
        </div>
      </section>

      {/* Daily Habits Checklist */}
      <section
        id="daily-habits-card"
        className="neo-card p-5 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00A859]" />
            <h3 className="font-display font-black text-base text-[#2B0B2E]">Hábitos Diarios</h3>
          </div>
          <span className="text-xs font-black text-[#6C586B]">
            {completedHabitsCount} de {habits.length} completados
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {habits.map((habit) => (
            <label
              key={habit.id}
              onClick={() => uiAudio.play('click')}
              className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                habit.completed
                  ? 'bg-[#A7FF00]/25 border-[#00A859] shadow-[1.5px_1.5px_0_#00A859]'
                  : 'bg-white border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] hover:bg-[#FFE600]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={habit.completed}
                  onChange={() => onToggleHabit(habit.id)}
                  className="w-5 h-5 rounded accent-[#00A859] cursor-pointer"
                />
                <span
                  className={`text-xs font-bold ${
                    habit.completed ? 'line-through text-[#6C586B]' : 'text-[#2B0B2E]'
                  }`}
                >
                  {habit.title}
                </span>
              </div>
              <span
                className={`text-[11px] font-black ${
                  habit.completed ? 'text-[#00A859]' : 'text-[#FF3377]'
                }`}
              >
                {habit.completed ? '✓ Hecho' : habit.subtitle || 'Pendiente'}
              </span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
