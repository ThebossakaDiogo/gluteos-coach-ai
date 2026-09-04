import React, { useState, useEffect } from 'react';
import { TabType, LoggedSet } from '../types';
import { IMAGES, FALLBACK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { uiAudio } from '../utils/audioEngine';
import { useGeoTime } from '../utils/useGeoTime';
import {
  Timer,
  Hourglass,
  Plus,
  Minus,
  Check,
  RefreshCw,
  Lightbulb,
  Lock,
  X,
  Award,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface EntrenarTabProps {
  onNavigate: (tab: TabType) => void;
  completedSetsCount?: number;
  loggedSets?: LoggedSet[];
  onUpdateSets?: (sets: LoggedSet[]) => void;
  onResetWorkout?: () => void;
}

const DEFAULT_SETS: LoggedSet[] = [
  { setNumber: 1, title: 'Serie 1 (Calentamiento)', reps: 10, weight: 10, rpe: 7, completed: false },
  { setNumber: 2, title: 'Serie 2 (Efectiva)', reps: 10, weight: 12, rpe: 8, completed: false },
  { setNumber: 3, title: 'Serie 3 (Tensión Máxima)', reps: 10, weight: 12, rpe: 8, completed: false },
  { setNumber: 4, title: 'Serie 4 (Back-off / Amplitud)', reps: 12, weight: 10, rpe: 9, completed: false },
];

export function EntrenarTab({
  onNavigate,
  completedSetsCount = 0,
  loggedSets = DEFAULT_SETS,
  onUpdateSets,
  onResetWorkout,
}: EntrenarTabProps) {
  const geoTime = useGeoTime();
  // Session stopwatch (starts at 0s)
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Rest countdown (starts at 0s, inactive)
  const [restSeconds, setRestSeconds] = useState(0);
  const [restActive, setRestActive] = useState(false);

  // Internal sets state fallback if parent handler not provided
  const [localSets, setLocalSets] = useState<LoggedSet[]>(loggedSets);
  const currentSets = loggedSets.length > 0 ? loggedSets : localSets;

  // Find next uncompleted set index (0 to 3)
  const activeSetIndex = currentSets.findIndex((s) => !s.completed);
  const currentActiveSet = activeSetIndex !== -1 ? currentSets[activeSetIndex] : null;

  // Active set editor state
  const [reps, setReps] = useState(currentActiveSet ? currentActiveSet.reps : 10);
  const [weight, setWeight] = useState(currentActiveSet ? currentActiveSet.weight : 10);
  const [difficulty, setDifficulty] = useState<string>('adecuada');

  // Exercise variant swap
  const [isSwapped, setIsSwapped] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  // Keep reps/weight in sync when active set changes
  useEffect(() => {
    if (currentActiveSet) {
      setReps(currentActiveSet.reps);
      setWeight(currentActiveSet.weight);
    }
  }, [activeSetIndex]);

  // Session timer increment
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest countdown
  useEffect(() => {
    if (!restActive) return;
    const interval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          uiAudio.play('success');
          setRestActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRegisterActiveSet = () => {
    if (activeSetIndex === -1) return;

    uiAudio.play('success');

    const updated = currentSets.map((set, idx) => {
      if (idx === activeSetIndex) {
        return {
          ...set,
          completed: true,
          reps,
          weight,
          rpe: difficulty === 'ligera' ? 7 : difficulty === 'fallo' ? 10 : 8,
        };
      }
      return set;
    });

    if (onUpdateSets) {
      onUpdateSets(updated);
    } else {
      setLocalSets(updated);
    }

    // Trigger rest timer
    setRestSeconds(90);
    setRestActive(true);

    // If last set was just completed, show finished modal!
    if (activeSetIndex === currentSets.length - 1) {
      setTimeout(() => {
        setShowFinishedModal(true);
      }, 500);
    }
  };

  const handleReset = () => {
    uiAudio.play('click');
    setSessionSeconds(0);
    setRestSeconds(0);
    setRestActive(false);
    if (onResetWorkout) {
      onResetWorkout();
    } else {
      setLocalSets(DEFAULT_SETS.map((s) => ({ ...s, completed: false })));
    }
  };

  const countCompleted = currentSets.filter((s) => s.completed).length;

  return (
    <div className="flex flex-col gap-5 pb-8 screen-enter font-body text-[#2B0B2E]">
      {/* Top Header Controls: Workout Info & Session Stopwatch */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="eyebrow-pill self-start">
            Día 1 · Sesión 1 de 3
          </span>
          <h1 className="font-display font-black text-2xl text-[#2B0B2E] tracking-tight mt-1">
            Glúteos A: Hipertrofia
          </h1>
        </div>

        {/* Live Controls: Reset & Stopwatch */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border-1.5 border-[#2B0B2E] text-[#6C586B] hover:text-[#FF3377] text-xs font-bold shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer transition-all"
            title="Reiniciar entrenamiento para comenzar desde cero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
            <Timer className="w-4 h-4 text-[#FF3377] animate-pulse" />
            <span className="font-mono text-xs font-black text-[#2B0B2E]">
              {formatTime(sessionSeconds)}
            </span>
          </div>
        </div>
      </section>

      {/* Circadian Workout Recommendation from IP / Local Time */}
      <div className="p-3 bg-[#FFF9E6] rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF3377] flex-shrink-0" />
          <span className="text-[#2B0B2E]">
            <strong className="text-[#FF3377] font-bold">Ritmo Circadiano ({geoTime.city}, {geoTime.formattedTime}):</strong> {geoTime.workoutRecommendation}
          </span>
        </div>
      </div>

      {/* Rest Countdown Bar in Neo-Pop Pill */}
      <section className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FFE600] to-[#A7FF00] border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2B0B2E] text-[#FFE600] flex items-center justify-center font-bold">
            <Hourglass className={`w-4 h-4 ${restActive ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#2B0B2E] tracking-wider block">
              {restActive ? 'Descanso entre series' : 'Descanso (Pausado)'}
            </span>
            <span className="font-display font-black text-lg text-[#2B0B2E] leading-none">
              {formatTime(restSeconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              uiAudio.play('click');
              setRestSeconds((prev) => prev + 30);
              setRestActive(true);
            }}
            className="px-2.5 py-1 bg-white hover:bg-[#FFF9E6] text-[11px] font-black text-[#2B0B2E] rounded-lg border-1.5 border-[#2B0B2E] shadow-[1.5px_1.5px_0_#2B0B2E] active:scale-95 cursor-pointer"
          >
            +30s
          </button>
          <button
            onClick={() => {
              uiAudio.play('click');
              setRestActive(false);
              setRestSeconds(0);
            }}
            className="px-2.5 py-1 bg-[#2B0B2E] text-[#FFE600] text-[11px] font-black rounded-lg shadow-[1.5px_1.5px_0_#FF3377] active:scale-95 cursor-pointer"
          >
            Saltar
          </button>
        </div>
      </section>

      {/* Current Exercise Card */}
      <section className="neo-card p-4 flex flex-col gap-3.5 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#2B0B2E] text-[#FFE600] flex items-center justify-center text-xs font-black">
              1
            </span>
            <span className="text-xs font-bold text-[#6C586B]">Ejercicio 1 de 5</span>
          </div>
          <button
            onClick={() => {
              uiAudio.play('click');
              setShowSwapModal(true);
            }}
            className="text-[11px] font-black text-[#FF3377] hover:text-[#D81B60] flex items-center gap-1 bg-[#FFF9E6] border border-[#2B0B2E] px-2 py-0.5 rounded-lg shadow-[1px_1px_0_#2B0B2E] cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sustituir</span>
          </button>
        </div>

        {/* Video / Preview with Fallback */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-[#2B0B2E] bg-black">
          <ImageWithFallback
            src={isSwapped ? IMAGES.exerciseFloorBridge : IMAGES.exerciseActive}
            fallbackSrc={isSwapped ? FALLBACK_IMAGES.exerciseFloorBridge : FALLBACK_IMAGES.exerciseActive}
            alt="Ejercicio activo"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-[#2B0B2E] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/30">
            {isSwapped ? 'Variante Suelo (Adaptada)' : 'Hip Thrust Banco (Original)'}
          </div>
        </div>

        <div>
          <h2 className="font-display font-black text-xl text-[#2B0B2E] leading-tight">
            {isSwapped
              ? 'Puente de Glúteos en el Suelo con Carga'
              : 'Hip Thrust con Mancuerna (Pausa 2s)'}
          </h2>
          <p className="text-xs text-[#6C586B] mt-1 leading-relaxed">
            Mantén la barbilla pegada al pecho en el punto más alto para máxima activación del glúteo mayor y cero sobrecarga lumbar.
          </p>
        </div>

        {/* Biomechanical tip */}
        <div className="p-3 bg-[#FFF9E6] rounded-xl border-1.5 border-[#2B0B2E] flex items-start gap-2 text-xs">
          <Lightbulb className="w-4 h-4 text-[#FFE600] flex-shrink-0 mt-0.5 stroke-[2.5]" />
          <p className="text-[#2B0B2E] font-medium leading-snug">
            <strong>Foco Neural:</strong> Empuja con los talones y no arquees la espalda baja al subir.
          </p>
        </div>
      </section>

      {/* Series Logger Section */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-base text-[#2B0B2E]">
            Registro de Series ({countCompleted} de {currentSets.length} completadas)
          </h3>
          <span className="text-xs font-normal text-[#6C586B]">Meta: RPE 8-9</span>
        </div>

        {/* Series List */}
        {currentSets.map((set, index) => {
          const isCurrentActive = index === activeSetIndex;
          const isDone = set.completed;
          const isLocked = index > activeSetIndex && !isDone;

          if (isDone) {
            return (
              <div
                key={set.setNumber}
                className="p-3 rounded-xl bg-white border-2 border-[#00A859] shadow-[2px_2px_0_#00A859] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#A7FF00] border border-[#2B0B2E] flex items-center justify-center font-black text-[#2B0B2E]">
                    ✓
                  </span>
                  <div className="flex flex-col">
                    <span className="font-black text-[#2B0B2E]">{set.title}</span>
                    <span className="text-[#6C586B]">{set.reps} reps · {set.weight} kg</span>
                  </div>
                </div>
                <span className="font-bold text-[#00A859] bg-[#A7FF00]/30 px-2 py-0.5 rounded-md border border-[#00A859]">
                  Completada · RPE {set.rpe}
                </span>
              </div>
            );
          }

          if (isCurrentActive) {
            return (
              <div
                key={set.setNumber}
                className="p-4 rounded-2xl bg-white border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#FF3377] flex flex-col gap-3 screen-enter"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#FF3377] tracking-wider">
                    {set.title} (Actual)
                  </span>
                  <span className="bg-[#FFE600] border border-[#2B0B2E] text-[10px] font-black px-2 py-0.5 rounded-full">
                    En curso
                  </span>
                </div>

                {/* Reps & Weight Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Reps */}
                  <div className="flex flex-col gap-1 p-2.5 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E]">
                    <span className="text-[10px] font-bold text-[#6C586B] uppercase">Repeticiones</span>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          uiAudio.play('click');
                          setReps((prev) => Math.max(1, prev - 1));
                        }}
                        className="w-7 h-7 bg-white rounded-lg border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-display font-black text-xl text-[#2B0B2E]">{reps}</span>
                      <button
                        onClick={() => {
                          uiAudio.play('click');
                          setReps((prev) => prev + 1);
                        }}
                        className="w-7 h-7 bg-white rounded-lg border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="flex flex-col gap-1 p-2.5 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E]">
                    <span className="text-[10px] font-bold text-[#6C586B] uppercase">Carga (kg)</span>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          uiAudio.play('click');
                          setWeight((prev) => Math.max(0, prev - 2));
                        }}
                        className="w-7 h-7 bg-white rounded-lg border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-display font-black text-xl text-[#2B0B2E]">{weight}kg</span>
                      <button
                        onClick={() => {
                          uiAudio.play('click');
                          setWeight((prev) => prev + 2);
                        }}
                        className="w-7 h-7 bg-white rounded-lg border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* RPE Selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-[#6C586B] uppercase">Sensación de Esfuerzo (RPE):</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'ligera', label: 'RPE 7 (Fácil)' },
                      { id: 'adecuada', label: 'RPE 8-9 (Ideal)' },
                      { id: 'fallo', label: 'RPE 10 (Fallo)' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          uiAudio.play('select');
                          setDifficulty(item.id);
                        }}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          difficulty === item.id
                            ? 'bg-[#2B0B2E] text-[#FFE600] border-[#2B0B2E] shadow-[1.5px_1.5px_0_#FF3377]'
                            : 'bg-white text-[#2B0B2E] border-[#2B0B2E]/30 hover:bg-[#FFF9E6]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRegisterActiveSet}
                  className="cta-button mt-1"
                >
                  <span>REGISTRAR {set.title.toUpperCase()}</span>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span className="button-sheen" />
                </button>
              </div>
            );
          }

          // Locked future set
          return (
            <div
              key={set.setNumber}
              className="p-3 rounded-xl bg-[#FFF9E6] border border-[#2B0B2E]/30 flex items-center justify-between text-xs opacity-75"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white border border-[#2B0B2E] flex items-center justify-center text-xs font-bold">
                  {set.setNumber}
                </span>
                <span>{set.title}</span>
              </div>
              <div className="flex items-center gap-1 text-[#6C586B]">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">Pendiente</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Complete Workout Button */}
      <button
        onClick={() => {
          uiAudio.play('success');
          setShowFinishedModal(true);
        }}
        className="cta-button cta-light text-[#2B0B2E] mt-2"
      >
        <Award className="w-5 h-5 stroke-[2.5]" />
        <span>CONCLUIR ENTRENAMIENTO DE HOY</span>
        <span className="button-sheen" />
      </button>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-sm rounded-3xl p-5 shadow-[6px_6px_0_#2B0B2E] flex flex-col gap-3.5 screen-enter text-[#2B0B2E]">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2.5">
              <h3 className="font-display font-black text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#FF3377]" />
                Sustituir Ejercicio
              </h3>
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setShowSwapModal(false);
                }}
                className="w-7 h-7 rounded-lg border-2 border-[#2B0B2E] bg-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#6C586B] leading-relaxed">
              Elige la variante que mejor se adapte a tu equipo disponible o comodidad articular:
            </p>

            <button
              onClick={() => {
                uiAudio.play('select');
                setIsSwapped(false);
                setShowSwapModal(false);
              }}
              className={`p-3 rounded-xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                !isSwapped
                  ? 'bg-white border-[#2B0B2E] shadow-[3px_3px_0_#FF3377]'
                  : 'bg-white/60 border-[#2B0B2E]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-[#2B0B2E]">Hip Thrust en Banco (Original)</span>
                {!isSwapped && <span className="text-xs font-bold text-[#00A859]">Activo</span>}
              </div>
              <span className="text-[11px] text-[#6C586B]">Mayor rango de movimiento y sobrecarga máxima.</span>
            </button>

            <button
              onClick={() => {
                uiAudio.play('select');
                setIsSwapped(true);
                setShowSwapModal(false);
              }}
              className={`p-3 rounded-xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                isSwapped
                  ? 'bg-white border-[#2B0B2E] shadow-[3px_3px_0_#00A859]'
                  : 'bg-white/60 border-[#2B0B2E]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-[#2B0B2E]">Puente en Suelo (Sin Banco)</span>
                {isSwapped && <span className="text-xs font-bold text-[#00A859]">Activo</span>}
              </div>
              <span className="text-[11px] text-[#6C586B]">Ideal para casa y menor exigencia en la zona lumbar.</span>
            </button>
          </div>
        </div>
      )}

      {/* Finished Workout Modal */}
      {showFinishedModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-sm rounded-3xl p-6 shadow-[8px_8px_0_#2B0B2E,14px_14px_0_#A7FF00] flex flex-col items-center text-center gap-4 screen-enter text-[#2B0B2E]">
            <div className="w-16 h-16 rounded-full bg-[#A7FF00] border-3 border-[#2B0B2E] flex items-center justify-center text-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E]">
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="eyebrow-pill mx-auto">Día 1 Concluido</span>
              <h2 className="font-display font-black text-2xl text-[#2B0B2E]">
                ¡Gran Trabajo, Camila!
              </h2>
              <p className="text-xs text-[#6C586B] leading-relaxed">
                Registraste tu sesión de estímulo mecánico. La síntesis proteica está maximizada para las próximas 24 horas.
              </p>
            </div>

            <div className="w-full bg-white p-3.5 rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex justify-around text-xs">
              <div className="flex flex-col">
                <span className="text-[#6C586B] font-bold">Tiempo</span>
                <span className="font-black text-sm text-[#2B0B2E]">{formatTime(sessionSeconds)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#6C586B] font-bold">Volumen</span>
                <span className="font-black text-sm text-[#FF3377]">{countCompleted} series</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#6C586B] font-bold">Racha</span>
                <span className="font-black text-sm text-[#00A859]">1 Día 🔥</span>
              </div>
            </div>

            <button
              onClick={() => {
                uiAudio.play('success');
                setShowFinishedModal(false);
                onNavigate('comidas');
              }}
              className="cta-button"
            >
              <span>Ver Comida Post-Entreno</span>
              <span className="button-sheen" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
