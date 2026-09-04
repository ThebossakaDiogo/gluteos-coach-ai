import React, { useState, useRef } from 'react';
import { TabType, UserSession } from '../types';
import { uiAudio } from '../utils/audioEngine';
import { processImageFile } from '../utils/imageUtils';
import { saveUserSessionToBackend } from '../utils/mockBackendService';
import {
  CheckCircle2,
  Sliders,
  Dumbbell,
  Utensils,
  TrendingUp,
  Sparkles,
  Bed,
  Rocket,
  Award,
  RotateCcw,
  Edit3,
  Check,
  Droplets,
  Camera,
  Scale,
  Ruler,
  UploadCloud,
  ArrowRight,
  Flame,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

interface ProgresoTabProps {
  onNavigate: (tab: TabType) => void;
  completedWorkoutSets?: number;
  currentProtein?: number;
  targetProtein?: number;
  waterGlasses?: number;
  onResetAll?: () => void;
  userSession?: UserSession | null;
  onUpdateSession?: (updatedSession: UserSession) => void;
  onOpenOnboarding?: () => void;
}

export function ProgresoTab({
  onNavigate,
  completedWorkoutSets = 0,
  currentProtein = 0,
  targetProtein = 135,
  waterGlasses = 0,
  onResetAll,
  userSession,
  onUpdateSession,
  onOpenOnboarding,
}: ProgresoTabProps) {
  const [acceptedWeek3, setAcceptedWeek3] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // User measurements - starting from clean baseline
  const [gluteoMeasurement, setGluteoMeasurement] = useState<number>(0);
  const [cinturaMeasurement, setCinturaMeasurement] = useState<number>(0);
  const [pesoMeasurement, setPesoMeasurement] = useState<number>(userSession?.weight || 0);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);

  // Evolution photos drag states
  const [isDraggingInitial, setIsDraggingInitial] = useState(false);
  const [isDraggingAfter, setIsDraggingAfter] = useState(false);
  const initialInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  const proteinAdherence = targetProtein > 0 ? Math.min(100, Math.round((currentProtein / targetProtein) * 100)) : 0;

  // Upload handlers for Evolution photos
  const handleUploadPhoto = async (file: File, type: 'initial' | 'after') => {
    try {
      const dataUrl = await processImageFile(file, 800, 1000, 0.75);
      uiAudio.play('success');
      const updated: UserSession = {
        ...(userSession || {
          email: 'alumna@gluteos28.com',
          name: 'Alumna VIP',
          plan: 'Desafío Glúteos 28 Días · Vitalicio',
          purchasedAt: 'Hoy',
          isVerified: true,
        }),
        initialPhotoUrl: type === 'initial' ? dataUrl : userSession?.initialPhotoUrl,
        afterPhotoUrl: type === 'after' ? dataUrl : userSession?.afterPhotoUrl,
        updatedAt: new Date().toISOString(),
      };
      saveUserSessionToBackend(updated, updated.ip);
      if (onUpdateSession) onUpdateSession(updated);
    } catch {
      uiAudio.play('alert');
    }
  };

  const handleAcceptPlan = () => {
    uiAudio.play('click');
    setIsSyncing(true);
    setTimeout(() => {
      uiAudio.play('success');
      setIsSyncing(false);
      setAcceptedWeek3(true);
    }, 700);
  };

  const handleResetMetrics = () => {
    uiAudio.play('click');
    setGluteoMeasurement(0);
    setCinturaMeasurement(0);
    setPesoMeasurement(0);
    setAcceptedWeek3(false);
    if (onResetAll) {
      onResetAll();
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-8 screen-enter font-body text-[#2B0B2E]">
      {/* Top Header */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="eyebrow-pill">
            <CheckCircle2 className={`w-3.5 h-3.5 ${completedWorkoutSets > 0 ? 'text-[#00A859]' : 'text-[#6C586B]'}`} />
            <span>{completedWorkoutSets > 0 ? 'Día 1 en Progreso' : 'Día 1 · Punto de Partida'}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetMetrics}
              className="text-[11px] font-black text-[#6C586B] hover:text-[#FF3377] flex items-center gap-1 bg-white border border-[#2B0B2E] px-2 py-1 rounded-full shadow-[1px_1px_0_#2B0B2E] cursor-pointer"
              title="Reiniciar todas las métricas para comenzar desde cero"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reiniciar Todo</span>
            </button>
            <button
              onClick={() => {
                uiAudio.play('click');
                setIsEditingMetrics(!isEditingMetrics);
              }}
              className="text-[11px] font-black text-[#2B0B2E] flex items-center gap-1 bg-[#FFE600] border border-[#2B0B2E] px-2.5 py-1 rounded-full shadow-[1px_1px_0_#2B0B2E] cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditingMetrics ? 'Guardar' : 'Medidas'}</span>
            </button>
          </div>
        </div>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B0B2E] tracking-tight leading-snug">
          Revisión & Evolución
        </h1>
        <p className="text-xs text-[#6C586B] leading-relaxed">
          Comienza desde cero registrando tus medidas basales. A medida que entrenas y cumples tu meta de proteína, el algoritmo adapta tu sobrecarga.
        </p>
      </section>

      {/* Editor Modal / Bar if editing */}
      {isEditingMetrics && (
        <section className="neo-card p-4 bg-[#FFF9E6] border-2 border-[#FF3377] flex flex-col gap-3 screen-enter">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#FF3377]">
              Registrar Medidas Iniciales
            </span>
            <span className="text-[11px] text-[#6C586B]">Valores en cm y kg</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#6C586B] uppercase">Glúteos (cm)</label>
              <input
                type="number"
                value={gluteoMeasurement || ''}
                placeholder="0.0"
                onChange={(e) => setGluteoMeasurement(parseFloat(e.target.value) || 0)}
                className="p-2 rounded-lg border border-[#2B0B2E] bg-white font-mono text-sm font-bold text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#6C586B] uppercase">Cintura (cm)</label>
              <input
                type="number"
                value={cinturaMeasurement || ''}
                placeholder="0.0"
                onChange={(e) => setCinturaMeasurement(parseFloat(e.target.value) || 0)}
                className="p-2 rounded-lg border border-[#2B0B2E] bg-white font-mono text-sm font-bold text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-[#6C586B] uppercase">Peso (kg)</label>
              <input
                type="number"
                value={pesoMeasurement || ''}
                placeholder="0.0"
                onChange={(e) => setPesoMeasurement(parseFloat(e.target.value) || 0)}
                className="p-2 rounded-lg border border-[#2B0B2E] bg-white font-mono text-sm font-bold text-center"
              />
            </div>
          </div>

          <button
            onClick={() => {
              uiAudio.play('success');
              setIsEditingMetrics(false);
            }}
            className="cta-button py-2 text-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirmar Medidas Iniciales</span>
            <span className="button-sheen" />
          </button>
        </section>
      )}

      {/* 28-DAY EVOLUTION PHOTO COMPARATOR SECTION */}
      <section className="neo-card p-4 bg-white border-3 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E,8px_8px_0_#FF3377] flex flex-col gap-3.5 screen-enter">
        <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center shadow-[2px_2px_0_#2B0B2E]">
              <Camera className="w-4 h-4 text-[#FF3377]" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-display font-black text-base text-[#2B0B2E] leading-tight">
                Comparador de Evolución · 28 Días
              </h2>
              <span className="text-[10px] text-[#6C586B] font-bold">
                Compara tu silueta del Día 1 con tu resultado al finalizar el ciclo
              </span>
            </div>
          </div>

          {onOpenOnboarding && (
            <button
              onClick={() => {
                uiAudio.play('click');
                onOpenOnboarding();
              }}
              className="text-[10px] font-black text-[#2B0B2E] bg-[#A7FF00] hover:bg-[#FFE600] border border-[#2B0B2E] px-2.5 py-1 rounded-full shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer transition-all flex items-center gap-1"
            >
              <Scale className="w-3 h-3 text-[#2B0B2E]" />
              <span>Mini Onboarding</span>
            </button>
          )}
        </div>

        {/* Hidden inputs for both photos */}
        <input
          ref={initialInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUploadPhoto(e.target.files[0], 'initial');
            }
          }}
        />
        <input
          ref={afterInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUploadPhoto(e.target.files[0], 'after');
            }
          }}
        />

        {/* Side-by-side comparison cards (Antes vs Después) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* ANTES (DÍA 1) */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#FFF9E6] border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#2B0B2E] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3377]" />
                Antes · Día 1
              </span>
              <span className="font-mono text-[11px] font-black bg-white px-2 py-0.5 rounded-md border border-[#2B0B2E]">
                {userSession?.weight ? `${userSession.weight} kg` : '62.0 kg'}
              </span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingInitial(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingInitial(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingInitial(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleUploadPhoto(e.dataTransfer.files[0], 'initial');
                }
              }}
              onClick={() => {
                if (!userSession?.initialPhotoUrl) {
                  initialInputRef.current?.click();
                }
              }}
              className={`relative h-56 rounded-xl border-2 overflow-hidden flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                isDraggingInitial
                  ? 'border-[#FF3377] bg-[#FF3377]/10'
                  : userSession?.initialPhotoUrl
                  ? 'border-[#2B0B2E] bg-black/5'
                  : 'border-dashed border-[#2B0B2E]/40 bg-white hover:border-[#FF3377]'
              }`}
            >
              {userSession?.initialPhotoUrl ? (
                <>
                  <img
                    src={userSession.initialPhotoUrl}
                    alt="Antes Día 1"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between bg-[#2B0B2E]/80 backdrop-blur-xs p-1.5 rounded-lg text-white text-[10px]">
                    <span className="font-bold flex items-center gap-1 text-[#FFE600]">
                      <CheckCircle2 className="w-3 h-3 text-[#A7FF00]" />
                      Día 1 · Punto Cero
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        initialInputRef.current?.click();
                      }}
                      className="bg-white text-[#2B0B2E] px-2 py-0.5 rounded text-[9px] font-black hover:bg-[#FFE600] cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-1.5 border-[#2B0B2E] flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-[#2B0B2E]" />
                  </div>
                  <span className="text-xs font-black text-[#2B0B2E]">Subir foto Día 1</span>
                  <span className="text-[10px] text-[#6C586B]">
                    Arrastra aquí o haz clic para subir
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#6C586B] font-bold">
              <span>Estatura: {userSession?.height || 165} cm</span>
              <span className="text-[#00A859]">Guardado en Cookie & IP</span>
            </div>
          </div>

          {/* DESPUÉS (DÍA 28) */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#FFF9E6] border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#2B0B2E] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A859]" />
                Después · Día 28
              </span>
              <span className="font-mono text-[11px] font-black bg-[#A7FF00] px-2 py-0.5 rounded-md border border-[#2B0B2E]">
                Meta: Tonificación
              </span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingAfter(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingAfter(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingAfter(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleUploadPhoto(e.dataTransfer.files[0], 'after');
                }
              }}
              onClick={() => {
                if (!userSession?.afterPhotoUrl) {
                  afterInputRef.current?.click();
                }
              }}
              className={`relative h-56 rounded-xl border-2 overflow-hidden flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                isDraggingAfter
                  ? 'border-[#00A859] bg-[#A7FF00]/10'
                  : userSession?.afterPhotoUrl
                  ? 'border-[#2B0B2E] bg-black/5'
                  : 'border-dashed border-[#2B0B2E]/40 bg-white hover:border-[#00A859]'
              }`}
            >
              {userSession?.afterPhotoUrl ? (
                <>
                  <img
                    src={userSession.afterPhotoUrl}
                    alt="Después Día 28"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between bg-[#2B0B2E]/80 backdrop-blur-xs p-1.5 rounded-lg text-white text-[10px]">
                    <span className="font-bold flex items-center gap-1 text-[#A7FF00]">
                      <Sparkles className="w-3 h-3 text-[#FFE600]" />
                      Día 28 · Resultados
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        afterInputRef.current?.click();
                      }}
                      className="bg-white text-[#2B0B2E] px-2 py-0.5 rounded text-[9px] font-black hover:bg-[#A7FF00] cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#A7FF00] border-1.5 border-[#2B0B2E] flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[#2B0B2E]" />
                  </div>
                  <span className="text-xs font-black text-[#2B0B2E]">Subir foto Día 28</span>
                  <span className="text-[10px] text-[#6C586B]">
                    Sube tu resultado o foto en progreso
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#6C586B] font-bold">
              <span>Evolución esperada: +1.5 a 3cm</span>
              <span className="text-[#FF3377]">Desafío en curso</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recomposition Stats Bento in Neo-Pop cards */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="neo-card p-3 flex flex-col items-center text-center bg-white">
          <span className="text-[10px] font-black uppercase text-[#6C586B]">Glúteo/Cadera</span>
          <span className="font-display font-black text-xl text-[#00A859] mt-1">
            {gluteoMeasurement > 0 ? `${gluteoMeasurement} cm` : '0.0 cm'}
          </span>
          <span className="text-[10px] font-bold text-[#6C586B]">
            {gluteoMeasurement > 0 ? 'Línea de base' : 'A registrar'}
          </span>
        </div>

        <div className="neo-card p-3 flex flex-col items-center text-center bg-white">
          <span className="text-[10px] font-black uppercase text-[#6C586B]">Cintura</span>
          <span className="font-display font-black text-xl text-[#FF3377] mt-1">
            {cinturaMeasurement > 0 ? `${cinturaMeasurement} cm` : '0.0 cm'}
          </span>
          <span className="text-[10px] font-bold text-[#6C586B]">
            {cinturaMeasurement > 0 ? 'Línea de base' : 'A registrar'}
          </span>
        </div>

        <div className="neo-card p-3 flex flex-col items-center text-center bg-white">
          <span className="text-[10px] font-black uppercase text-[#6C586B]">Series Hoy</span>
          <span className="font-display font-black text-xl text-[#2B0B2E] mt-1">
            {completedWorkoutSets > 0 ? `${completedWorkoutSets}/4` : '0/4'}
          </span>
          <span className="text-[10px] font-bold text-[#00A859]">
            {completedWorkoutSets > 0 ? 'En curso' : 'Por iniciar'}
          </span>
        </div>
      </section>

      {/* Calibration Banner */}
      <section className="dark-panel flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <span className="dark-eyebrow">
            Fase 1: Activación y Carga Base
          </span>
          <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {completedWorkoutSets > 0 ? 'Activo' : 'Iniciar'}
          </span>
        </div>

        <h2 className="font-display font-black text-xl text-white leading-tight">
          Sobrecarga Progresiva & Mayor Tensión
        </h2>
        <p className="text-xs text-white/80 leading-relaxed">
          Tu plan se calibra automáticamente. Al completar las 4 series de Hip Thrust y alcanzar los {targetProtein}g de proteína, se desbloquearán los aumentos de carga.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-white">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#A7FF00] flex-shrink-0" />
            <span>Hip Thrust: 10kg a 12kg</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#FFE600] flex-shrink-0" />
            <span>Proteína: {targetProtein}g diarios</span>
          </div>
        </div>

        {!acceptedWeek3 ? (
          <button
            onClick={handleAcceptPlan}
            disabled={isSyncing}
            className="cta-button cta-light text-[#2B0B2E] mt-1"
          >
            {isSyncing ? (
              <span>Calibrando Parámetros...</span>
            ) : (
              <>
                <Rocket className="w-4 h-4 stroke-[3]" />
                <span>CONFIRMAR PLAN DE INICIO</span>
              </>
            )}
            <span className="button-sheen" />
          </button>
        ) : (
          <div className="p-3 bg-[#A7FF00]/30 border-2 border-[#00A859] rounded-xl text-center text-xs font-black text-white flex items-center justify-center gap-1.5 animate-scaleIn">
            <CheckCircle2 className="w-4 h-4 text-[#A7FF00]" />
            <span>¡Plan de estímulo y nutrición confirmado!</span>
          </div>
        )}
      </section>

      {/* Biomechanical Habits Review */}
      <section className="neo-card p-5 flex flex-col gap-3.5 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-base text-[#2B0B2E]">
            Métricas de Hoy (En Tiempo Real)
          </h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md border border-[#2B0B2E] ${
            completedWorkoutSets > 0 || currentProtein > 0 ? 'bg-[#A7FF00]/30 text-[#00A859]' : 'bg-[#FFF9E6] text-[#6C586B]'
          }`}>
            {completedWorkoutSets > 0 || currentProtein > 0 ? 'En progreso' : '0% Iniciando'}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E]">
            <span className="font-bold text-[#2B0B2E] flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-[#FF3377]" />
              Series de Entrenamiento
            </span>
            <span className="font-black text-[#FF3377]">
              {completedWorkoutSets} de 4 series ({Math.round((completedWorkoutSets / 4) * 100)}%)
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E]">
            <span className="font-bold text-[#2B0B2E] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#00A859]" />
              Adherencia a la Proteína
            </span>
            <span className="font-black text-[#00A859]">
              {proteinAdherence}% ({currentProtein}g / {targetProtein}g)
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E]">
            <span className="font-bold text-[#2B0B2E] flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#00A859]" />
              Hidratación
            </span>
            <span className="font-black text-[#2B0B2E]">
              {waterGlasses} de 8 vasos ({waterGlasses * 250}ml)
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            uiAudio.play('click');
            onNavigate('entrenar');
          }}
          className="w-full py-2.5 bg-[#2B0B2E] text-[#FFE600] rounded-xl font-display font-black text-xs uppercase shadow-[2px_2px_0_#FF3377] transition-all cursor-pointer mt-1"
        >
          {completedWorkoutSets > 0 ? 'Continuar Entrenamiento' : 'Comenzar Entrenamiento de Hoy'}
        </button>
      </section>
    </div>
  );
}

