import React, { useState, useEffect } from 'react';
import { TabType, LoggedSet } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { uiAudio } from '../utils/audioEngine';
import { useGeoTime } from '../utils/useGeoTime';
import { WORKOUT_ROUTINES, WorkoutRoutine, ExerciseItem } from '../data/workoutData';
import {
  Timer,
  Hourglass,
  Plus,
  Minus,
  Check,
  RefreshCw,
  Lightbulb,
  Award,
  Zap,
  RotateCcw,
  Sparkles,
  Flame,
  ChevronRight,
  Activity,
  Dumbbell,
  HelpCircle,
  X,
  Play,
  Pause,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface EntrenarTabProps {
  onNavigate: (tab: TabType) => void;
  completedSetsCount?: number;
  loggedSets?: LoggedSet[];
  onUpdateSets?: (sets: LoggedSet[]) => void;
  onResetWorkout?: () => void;
}

export function EntrenarTab({
  onNavigate,
  completedSetsCount = 0,
  loggedSets = [],
  onUpdateSets,
  onResetWorkout,
}: EntrenarTabProps) {
  const geoTime = useGeoTime();

  // Active Routine selection (Glúteos A, B, or C)
  const [activeRoutineIndex, setActiveRoutineIndex] = useState<number>(0);
  const currentRoutine: WorkoutRoutine = WORKOUT_ROUTINES[activeRoutineIndex] || WORKOUT_ROUTINES[0];

  // Active exercise index inside routine (0 to 4)
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const currentExercise: ExerciseItem = currentRoutine.exercises[activeExerciseIndex] || currentRoutine.exercises[0];

  // Session stopwatch (starts at 0s)
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Rest countdown (starts at 0s, inactive)
  const [restSeconds, setRestSeconds] = useState(0);
  const [restActive, setRestActive] = useState(false);

  // Exercise Swap state (home alternative vs gym default)
  const [swappedExercises, setSwappedExercises] = useState<Record<string, boolean>>({});
  const isCurrentSwapped = !!swappedExercises[currentExercise.id];
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  // Series per exercise map
  const [exerciseSetsState, setExerciseSetsState] = useState<Record<string, LoggedSet[]>>(() => {
    const initial: Record<string, LoggedSet[]> = {};
    WORKOUT_ROUTINES.forEach((r) => {
      r.exercises.forEach((ex) => {
        initial[ex.id] = Array.from({ length: ex.defaultSets }, (_, i) => ({
          setNumber: i + 1,
          title: `Serie ${i + 1} (${i === 0 ? 'Calentamiento' : i === ex.defaultSets - 1 ? 'Tensión Máxima' : 'Efectiva'})`,
          reps: 10,
          weight: 12,
          rpe: 8,
          completed: false,
        }));
      });
    });
    return initial;
  });

  const currentExerciseSets = exerciseSetsState[currentExercise.id] || [];

  // Active set editor state
  const uncompletedSetIndex = currentExerciseSets.findIndex((s) => !s.completed);
  const activeSetToLog = uncompletedSetIndex !== -1 ? currentExerciseSets[uncompletedSetIndex] : null;

  const [inputReps, setInputReps] = useState<number>(10);
  const [inputWeight, setInputWeight] = useState<number>(12);
  const [inputDifficulty, setInputDifficulty] = useState<'ligera' | 'adecuada' | 'fallo'>('adecuada');

  // Metronome / Cadence guide state
  const [cadenceActive, setCadenceActive] = useState(false);
  const [cadencePhase, setCadencePhase] = useState<'descenso' | 'pausa' | 'subida'>('descenso');
  const [cadenceTimer, setCadenceTimer] = useState<number>(3);

  // Synchronize reps/weight when active set changes
  useEffect(() => {
    if (activeSetToLog) {
      setInputReps(activeSetToLog.reps);
      setInputWeight(activeSetToLog.weight);
    }
  }, [uncompletedSetIndex, currentExercise.id]);

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

  // Metronome loop (3s descenso -> 2s pausa arriba -> 1s subida)
  useEffect(() => {
    if (!cadenceActive) return;

    const interval = setInterval(() => {
      setCadenceTimer((prev) => {
        if (prev <= 1) {
          uiAudio.play('click');
          if (cadencePhase === 'descenso') {
            setCadencePhase('pausa');
            return 2;
          } else if (cadencePhase === 'pausa') {
            setCadencePhase('subida');
            return 1;
          } else {
            setCadencePhase('descenso');
            return 3;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cadenceActive, cadencePhase]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate total volume (tonnage in kg)
  const calculateTotalVolume = () => {
    let totalKg = 0;
    Object.values(exerciseSetsState).forEach((sets) => {
      sets.forEach((s) => {
        if (s.completed) {
          totalKg += s.reps * s.weight;
        }
      });
    });
    return totalKg;
  };

  // Calculate completed sets across routine
  const totalCompletedSetsInRoutine = currentRoutine.exercises.reduce((acc, ex) => {
    const sets = exerciseSetsState[ex.id] || [];
    return acc + sets.filter((s) => s.completed).length;
  }, 0);

  const totalSetsInRoutine = currentRoutine.exercises.reduce((acc, ex) => acc + ex.defaultSets, 0);

  const handleRegisterSet = () => {
    if (uncompletedSetIndex === -1) return;

    uiAudio.play('success');

    const updated = currentExerciseSets.map((set, idx) => {
      if (idx === uncompletedSetIndex) {
        return {
          ...set,
          completed: true,
          reps: inputReps,
          weight: inputWeight,
          rpe: inputDifficulty === 'ligera' ? 7 : inputDifficulty === 'fallo' ? 10 : 8,
        };
      }
      return set;
    });

    setExerciseSetsState((prev) => ({
      ...prev,
      [currentExercise.id]: updated,
    }));

    if (onUpdateSets) {
      onUpdateSets(updated);
    }

    // Trigger rest timer
    setRestSeconds(currentExercise.recommendedRestSeconds || 75);
    setRestActive(true);

    // If last set of this exercise completed, prompt next exercise or finish
    if (uncompletedSetIndex === currentExerciseSets.length - 1) {
      if (activeExerciseIndex < currentRoutine.exercises.length - 1) {
        setTimeout(() => {
          setActiveExerciseIndex((prev) => prev + 1);
        }, 1200);
      } else {
        setTimeout(() => {
          setShowFinishedModal(true);
        }, 600);
      }
    }
  };

  const handleResetSession = () => {
    uiAudio.play('click');
    setSessionSeconds(0);
    setRestSeconds(0);
    setRestActive(false);
    setCadenceActive(false);

    setExerciseSetsState((prev) => {
      const resetMap: Record<string, LoggedSet[]> = {};
      Object.keys(prev).forEach((key) => {
        resetMap[key] = prev[key].map((s) => ({ ...s, completed: false }));
      });
      return resetMap;
    });

    if (onResetWorkout) {
      onResetWorkout();
    }
  };

  const toggleSwapCurrentExercise = () => {
    uiAudio.play('select');
    setSwappedExercises((prev) => ({
      ...prev,
      [currentExercise.id]: !prev[currentExercise.id],
    }));
    setShowSwapModal(false);
  };

  const totalVolumeTonnage = calculateTotalVolume();
  const estimatedCaloriesBurned = Math.round((sessionSeconds / 60) * 6.5) + Math.round(totalVolumeTonnage * 0.04);

  return (
    <div className="flex flex-col gap-6 pb-12 screen-enter font-body text-[#2B0B2E]">
      {/* 1. TOP HEADER & ROUTINE SELECTOR */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="eyebrow-pill self-start">
              Día 1 · Desafío 28 Días
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B0B2E] tracking-tight mt-1">
              {currentRoutine.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6C586B] font-medium mt-0.5">
              {currentRoutine.subtitle}
            </p>
          </div>

          {/* Live Controls: Reset & Stopwatch */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <button
              onClick={handleResetSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-[#2B0B2E] text-[#6C586B] hover:text-[#FF3377] text-xs font-black shadow-[2px_2px_0_#2B0B2E] cursor-pointer transition-all"
              title="Reiniciar entrenamiento"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2B0B2E] text-[#FFE600] border-2 border-[#2B0B2E] shadow-[2px_2px_0_#FF3377]">
              <Timer className="w-4 h-4 text-[#FF3377] animate-pulse" />
              <span className="font-mono text-xs font-black">
                {formatTime(sessionSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Routine Selector Tabs (A, B, C) */}
        <div className="grid grid-cols-3 gap-2 bg-[#FFF9E6] p-1.5 rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
          {WORKOUT_ROUTINES.map((routine, idx) => {
            const isActive = activeRoutineIndex === idx;
            return (
              <button
                key={routine.id}
                onClick={() => {
                  uiAudio.play('select');
                  setActiveRoutineIndex(idx);
                  setActiveExerciseIndex(0);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-[#FF3377] text-white border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]'
                    : 'text-[#6C586B] hover:text-[#2B0B2E] hover:bg-white/60'
                }`}
              >
                <span>{routine.title.split(':')[0]}</span>
                <span className={`text-[9px] uppercase font-bold truncate ${isActive ? 'text-[#FFE600]' : 'opacity-70'}`}>
                  {routine.focus.split('&')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. REAL-TIME STATS BENTO (PC & MOBILE) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6C586B] flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#FF3377]" /> Progreso Sesión
          </span>
          <div className="mt-2">
            <span className="font-display font-black text-xl text-[#2B0B2E]">
              {totalCompletedSetsInRoutine} <span className="text-xs font-normal text-[#6C586B]">/ {totalSetsInRoutine}</span>
            </span>
            <span className="text-[10px] font-bold text-[#00A859] block mt-0.5">
              {Math.round((totalCompletedSetsInRoutine / totalSetsInRoutine) * 100)}% completado
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6C586B] flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5 text-[#00A859]" /> Carga Levantada
          </span>
          <div className="mt-2">
            <span className="font-display font-black text-xl text-[#2B0B2E]">
              {totalVolumeTonnage} <span className="text-xs font-normal text-[#6C586B]">kg</span>
            </span>
            <span className="text-[10px] font-bold text-[#6C586B] block mt-0.5">
              Tonelaje Acumulado
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6C586B] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#FF3377] fill-[#FF3377]" /> Gasto Calórico
          </span>
          <div className="mt-2">
            <span className="font-display font-black text-xl text-[#2B0B2E]">
              ~{estimatedCaloriesBurned} <span className="text-xs font-normal text-[#6C586B]">kcal</span>
            </span>
            <span className="text-[10px] font-bold text-[#FF3377] block mt-0.5">
              Quema Activa
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6C586B] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" /> Circadiano ({geoTime.city})
          </span>
          <div className="mt-2">
            <span className="font-display font-black text-sm text-[#2B0B2E] leading-tight block truncate">
              {geoTime.workoutRecommendation}
            </span>
            <span className="text-[10px] font-bold text-[#00A859] block mt-0.5">
              Hora Óptima ({geoTime.formattedTime})
            </span>
          </div>
        </div>
      </section>

      {/* 3. REST COUNTDOWN TIMER BAR */}
      <section className="p-4 rounded-2xl bg-gradient-to-r from-[#FFE600] via-[#A7FF00] to-[#FFE600] border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2B0B2E] text-[#FFE600] flex items-center justify-center font-bold shadow-[2px_2px_0_#FF3377] flex-shrink-0">
            <Hourglass className={`w-5 h-5 ${restActive ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#2B0B2E] tracking-wider block">
              {restActive ? 'Descanso Activo Entre Series' : 'Temporizador de Descanso (En espera)'}
            </span>
            <span className="font-display font-black text-2xl text-[#2B0B2E] leading-none">
              {formatTime(restSeconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              uiAudio.play('click');
              setRestSeconds((prev) => prev + 30);
              setRestActive(true);
            }}
            className="px-3 py-1.5 bg-white hover:bg-[#FFF9E6] text-xs font-black text-[#2B0B2E] rounded-xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] active:scale-95 cursor-pointer"
          >
            +30s
          </button>
          <button
            onClick={() => {
              uiAudio.play('click');
              setRestActive(false);
              setRestSeconds(0);
            }}
            className="px-3 py-1.5 bg-[#2B0B2E] text-[#FFE600] hover:bg-[#FF3377] hover:text-white text-xs font-black rounded-xl shadow-[2px_2px_0_#FF3377] active:scale-95 cursor-pointer transition-colors"
          >
            Saltar Descanso
          </button>
        </div>
      </section>

      {/* 4. 5-EXERCISE SELECTOR CAROUSEL / NAV TABS */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-base sm:text-lg text-[#2B0B2E] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF3377]" />
            Ejercicios del Día (5 Estaciones)
          </h2>
          <span className="text-xs font-bold text-[#6C586B]">
            Estación {activeExerciseIndex + 1} de {currentRoutine.exercises.length}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {currentRoutine.exercises.map((ex, idx) => {
            const isCurrent = activeExerciseIndex === idx;
            const sets = exerciseSetsState[ex.id] || [];
            const isAllCompleted = sets.length > 0 && sets.every((s) => s.completed);
            const hasStarted = sets.some((s) => s.completed);

            return (
              <button
                key={ex.id}
                onClick={() => {
                  uiAudio.play('select');
                  setActiveExerciseIndex(idx);
                }}
                className={`p-2 sm:p-2.5 rounded-2xl border-2.5 text-center flex flex-col items-center justify-between gap-1 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#2B0B2E] text-white border-[#2B0B2E] shadow-[3px_3px_0_#FF3377] scale-[1.02]'
                    : isAllCompleted
                    ? 'bg-[#A7FF00]/30 text-[#2B0B2E] border-[#00A859] shadow-[2px_2px_0_#00A859]'
                    : 'bg-white text-[#2B0B2E] border-[#2B0B2E]/30 hover:border-[#2B0B2E]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#FFE600] text-[#2B0B2E]'
                      : isAllCompleted
                      ? 'bg-[#00A859] text-white'
                      : 'bg-[#FFF9E6] text-[#2B0B2E] border border-[#2B0B2E]'
                  }`}>
                    {isAllCompleted ? '✓' : idx + 1}
                  </span>
                  <span className="text-[8px] font-mono opacity-80">
                    {sets.filter((s) => s.completed).length}/{sets.length}
                  </span>
                </div>

                <span className="text-[10px] sm:text-xs font-black line-clamp-1 text-left w-full mt-0.5">
                  {ex.name.split(' ')[0]} {ex.name.split(' ')[1] || ''}
                </span>

                <span className={`text-[8px] font-black uppercase px-1 rounded-sm w-full truncate ${
                  isCurrent ? 'text-[#FFE600]' : 'text-[#6C586B]'
                }`}>
                  {ex.targetMuscle.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. ACTIVE EXERCISE DETAIL CARD & VIDEO PREVIEW */}
      <section className="bg-white rounded-3xl border-3 border-[#2B0B2E] shadow-[5px_5px_0_#2B0B2E] p-5 sm:p-6 flex flex-col gap-4">
        {/* Header with Exercise Name & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2B0B2E]/10 pb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE600] text-[#2B0B2E] font-black text-xs px-2.5 py-0.5 rounded-full border border-[#2B0B2E]">
                Estación {activeExerciseIndex + 1} de {currentRoutine.exercises.length}
              </span>
              <span className="bg-[#FF3377] text-white font-black text-xs px-2.5 py-0.5 rounded-full border border-[#2B0B2E]">
                {currentExercise.targetMuscle}
              </span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#2B0B2E] leading-snug mt-1">
              {isCurrentSwapped ? currentExercise.homeAlternative.name : currentExercise.name}
            </h2>
            <p className="text-xs text-[#6C586B]">
              {isCurrentSwapped ? currentExercise.homeAlternative.description : currentExercise.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                uiAudio.play('click');
                setShowSwapModal(true);
              }}
              className="px-3 py-1.5 bg-[#FFF9E6] hover:bg-[#FFE600] border-2 border-[#2B0B2E] rounded-xl text-xs font-black text-[#FF3377] shadow-[2px_2px_0_#2B0B2E] flex items-center gap-1.5 cursor-pointer transition-all"
              title="Sustituir por versión adaptada para casa"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isCurrentSwapped ? 'Ver Original' : 'Versión Casa'}</span>
            </button>

            <button
              onClick={() => {
                uiAudio.play('click');
                setShowTechniqueModal(true);
              }}
              className="px-3 py-1.5 bg-[#2B0B2E] hover:bg-[#3E1343] text-[#FFE600] rounded-xl text-xs font-black shadow-[2px_2px_0_#FF3377] flex items-center gap-1.5 cursor-pointer transition-all"
              title="Ver técnica detallada y errores comunes"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>Guía Técnica</span>
            </button>
          </div>
        </div>

        {/* Visual Media & Biomechanical Cues */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Exercise Image Display with High Quality Fallback */}
          <div className="md:col-span-6 relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border-2.5 border-[#2B0B2E] bg-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E]">
            <ImageWithFallback
              src={isCurrentSwapped ? currentExercise.homeAlternative.imageUrl : currentExercise.primaryImageUrl}
              fallbackSrc={currentExercise.fallbackImageUrl}
              alt={currentExercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 bg-[#2B0B2E]/90 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A7FF00] animate-pulse" />
              <span>{isCurrentSwapped ? 'Variante Casa (Sin Banco)' : 'Patrón Biomecánico Principal'}</span>
            </div>
          </div>

          {/* Biomechanical Foci & Cadence Metronome */}
          <div className="md:col-span-6 flex flex-col gap-3">
            {/* Neural Cue Pill */}
            <div className="p-3.5 bg-[#FFF9E6] rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex items-start gap-2.5 text-xs">
              <Lightbulb className="w-4 h-4 text-[#FF3377] flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <strong className="text-[#2B0B2E] block font-black">Foco Neural del Coach:</strong>
                <p className="text-[#6C586B] font-medium leading-relaxed mt-0.5">
                  {currentExercise.cueNote}
                </p>
              </div>
            </div>

            {/* Recommended Cadence */}
            <div className="p-3 rounded-2xl bg-white border-2 border-[#2B0B2E] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#FF3377]" />
                <span className="text-[#2B0B2E] font-bold">Cadencia Recomendada:</span>
              </div>
              <span className="font-mono text-[11px] font-black text-[#2B0B2E] bg-[#FFE600] px-2 py-0.5 rounded-lg border border-[#2B0B2E]">
                {currentExercise.recommendedCadence}
              </span>
            </div>

            {/* Interactive Cadence Metronome (Anti-Amnesia Glútea) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2B0B2E] to-[#3E1343] text-white border-2 border-[#2B0B2E] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                  cadenceActive ? 'bg-[#A7FF00] text-[#2B0B2E] animate-bounce' : 'bg-white/15 text-white'
                }`}>
                  {cadenceActive ? cadenceTimer : <Play className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FFE600] tracking-wider block">
                    Metrónomo de Cadencia (Bip sonoro)
                  </span>
                  <span className="text-xs font-bold text-white/90">
                    {cadenceActive
                      ? cadencePhase === 'descenso'
                        ? '⬇️ Bajada lenta (3s excéntrica)'
                        : cadencePhase === 'pausa'
                        ? '🛑 Apriete máximo arriba (2s pausa)'
                        : '⬆️ Subida explosiva (1s concéntrica)'
                      : 'Pulsa para guiar cada repetición'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  uiAudio.play('click');
                  setCadenceActive(!cadenceActive);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  cadenceActive
                    ? 'bg-[#FF3377] text-white border border-white'
                    : 'bg-[#FFE600] text-[#2B0B2E] hover:bg-[#A7FF00]'
                }`}
              >
                {cadenceActive ? 'Pausar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SERIES LOGGER & LOGISTICS (4 SERIES) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-base sm:text-lg text-[#2B0B2E]">
            Registro de Series ({currentExerciseSets.filter((s) => s.completed).length} de {currentExerciseSets.length} completadas)
          </h3>
          <span className="text-xs font-bold text-[#6C586B]">RPE Objetivo: 8 a 9</span>
        </div>

        {/* Series Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentExerciseSets.map((set, index) => {
            const isDone = set.completed;
            const isCurrentActive = index === uncompletedSetIndex;

            if (isDone) {
              return (
                <div
                  key={set.setNumber}
                  className="p-3.5 rounded-2xl bg-white border-2 border-[#00A859] shadow-[2px_2px_0_#00A859] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#A7FF00] border border-[#2B0B2E] flex items-center justify-center font-black text-[#2B0B2E]">
                      ✓
                    </span>
                    <div className="flex flex-col">
                      <span className="font-black text-[#2B0B2E]">{set.title}</span>
                      <span className="text-[#6C586B] font-bold mt-0.5">
                        {set.reps} reps con {set.weight} kg · {set.reps * set.weight} kg levantados
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#00A859] bg-[#A7FF00]/30 px-2 py-0.5 rounded-md border border-[#00A859]">
                    RPE {set.rpe}
                  </span>
                </div>
              );
            }

            if (isCurrentActive) {
              return (
                <div
                  key={set.setNumber}
                  className="col-span-1 md:col-span-2 p-5 rounded-3xl bg-[#FFF9E6] border-3 border-[#2B0B2E] shadow-[5px_5px_0_#FF3377] flex flex-col gap-3 screen-enter"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#FF3377] tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 fill-[#FF3377]" />
                      {set.title} — ¡Serie en Curso!
                    </span>
                    <span className="bg-[#FFE600] border-2 border-[#2B0B2E] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      Listo para Registrar
                    </span>
                  </div>

                  {/* Reps, Weight & Difficulty Adjusters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Reps */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-[#2B0B2E] flex flex-col justify-between">
                      <span className="text-[10px] font-black text-[#6C586B] uppercase">Repeticiones Realizadas</span>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => {
                            uiAudio.play('click');
                            setInputReps((prev) => Math.max(1, prev - 1));
                          }}
                          className="w-8 h-8 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90 cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-display font-black text-2xl text-[#2B0B2E]">{inputReps}</span>
                        <button
                          onClick={() => {
                            uiAudio.play('click');
                            setInputReps((prev) => prev + 1);
                          }}
                          className="w-8 h-8 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-[#2B0B2E] flex flex-col justify-between">
                      <span className="text-[10px] font-black text-[#6C586B] uppercase">Carga Utilizada (kg)</span>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => {
                            uiAudio.play('click');
                            setInputWeight((prev) => Math.max(0, prev - 2));
                          }}
                          className="w-8 h-8 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90 cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-display font-black text-2xl text-[#2B0B2E]">{inputWeight}kg</span>
                        <button
                          onClick={() => {
                            uiAudio.play('click');
                            setInputWeight((prev) => prev + 2);
                          }}
                          className="w-8 h-8 bg-[#FFF9E6] rounded-xl border border-[#2B0B2E] flex items-center justify-center font-bold active:scale-90 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Difficulty perception */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-[#2B0B2E] flex flex-col justify-between">
                      <span className="text-[10px] font-black text-[#6C586B] uppercase">Esfuerzo Percibido</span>
                      <div className="grid grid-cols-3 gap-1 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            uiAudio.play('select');
                            setInputDifficulty('ligera');
                          }}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                            inputDifficulty === 'ligera'
                              ? 'bg-[#A7FF00] text-[#2B0B2E] border-[#2B0B2E]'
                              : 'bg-white text-[#6C586B] border-[#2B0B2E]/20'
                          }`}
                        >
                          Ligero
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            uiAudio.play('select');
                            setInputDifficulty('adecuada');
                          }}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                            inputDifficulty === 'adecuada'
                              ? 'bg-[#FFE600] text-[#2B0B2E] border-[#2B0B2E]'
                              : 'bg-white text-[#6C586B] border-[#2B0B2E]/20'
                          }`}
                        >
                          Óptimo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            uiAudio.play('select');
                            setInputDifficulty('fallo');
                          }}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                            inputDifficulty === 'fallo'
                              ? 'bg-[#FF3377] text-white border-[#2B0B2E]'
                              : 'bg-white text-[#6C586B] border-[#2B0B2E]/20'
                          }`}
                        >
                          Fallo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Register Set CTA Button */}
                  <button
                    onClick={handleRegisterSet}
                    className="w-full py-3.5 bg-[#00A859] hover:bg-[#00904C] text-white text-sm font-display font-black uppercase rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Registrar {set.title} y Activar Descanso</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={set.setNumber}
                className="p-3.5 rounded-2xl bg-white/70 border-2 border-dashed border-[#2B0B2E]/30 flex items-center justify-between text-xs opacity-75"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#FFF9E6] border border-[#2B0B2E]/40 flex items-center justify-center font-bold text-[#6C586B]">
                    {set.setNumber}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#6C586B]">{set.title}</span>
                    <span className="text-[10px] text-[#6C586B]">Meta: {currentExercise.defaultReps}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#6C586B] bg-gray-100 px-2 py-0.5 rounded">
                  Bloqueada
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. MODAL: HOME ADAPTATION & SWAP */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-md rounded-3xl p-6 shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] flex flex-col gap-4 text-[#2B0B2E] max-h-[90vh] overflow-y-auto screen-enter">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#FF3377]" />
                <h3 className="font-display font-black text-lg">Sustitución de Ejercicio</h3>
              </div>
              <button
                onClick={() => setShowSwapModal(false)}
                className="w-8 h-8 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] flex items-center justify-center font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#6C586B]">
                ¿No dispones de banco o mancuernas pesadas hoy? Activa la variante recomendada para entrenar 100% en el suelo o con peso corporal manteniendo la tensión en el glúteo.
              </p>

              <div className="p-4 rounded-2xl bg-white border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-[#00A859] bg-[#A7FF00]/30 px-2 py-0.5 rounded-md self-start">
                  Alternativa para Casa
                </span>
                <h4 className="font-display font-black text-base text-[#2B0B2E]">
                  {currentExercise.homeAlternative.name}
                </h4>
                <p className="text-xs text-[#6C586B] leading-relaxed">
                  {currentExercise.homeAlternative.description}
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 py-2.5 bg-white border-2 border-[#2B0B2E] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Volver
                </button>
                <button
                  onClick={toggleSwapCurrentExercise}
                  className="flex-1 py-2.5 bg-[#FF3377] text-white border-2 border-[#2B0B2E] rounded-xl text-xs font-black shadow-[2px_2px_0_#2B0B2E] cursor-pointer"
                >
                  {isCurrentSwapped ? 'Restablecer Original' : 'Confirmar Variante Casa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: TECHNIQUE GUIDE & MISTAKES TO AVOID */}
      {showTechniqueModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border-3 border-[#2B0B2E] w-full max-w-lg rounded-3xl p-6 shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] flex flex-col gap-4 text-[#2B0B2E] max-h-[90vh] overflow-y-auto screen-enter">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#FF3377]" />
                <h3 className="font-display font-black text-lg">Guía de Técnica y Postura</h3>
              </div>
              <button
                onClick={() => setShowTechniqueModal(false)}
                className="w-8 h-8 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] flex items-center justify-center font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-display font-black text-base text-[#2B0B2E] mb-1">
                  {currentExercise.name}
                </h4>
                <p className="text-xs text-[#6C586B]">
                  Paso a paso para maximizar el estímulo del {currentExercise.targetMuscle} y proteger tu columna.
                </p>
              </div>

              {/* Execution Steps */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black uppercase text-[#00A859] tracking-wider">
                  ✓ Cómo Ejecutar el Ejercicio:
                </span>
                <div className="flex flex-col gap-2">
                  {currentExercise.executionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2B0B2E] bg-[#FFF9E6] p-2.5 rounded-xl border border-[#2B0B2E]/20">
                      <span className="w-5 h-5 rounded-full bg-[#2B0B2E] text-[#FFE600] flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mistakes to Avoid */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black uppercase text-[#FF3377] tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  ⚠️ Errores Críticos a Evitar:
                </span>
                <div className="flex flex-col gap-1.5">
                  {currentExercise.mistakesToAvoid.map((mistake, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#FF3377] bg-[#FF3377]/10 p-2.5 rounded-xl border border-[#FF3377]/30">
                      <span className="font-black text-sm leading-none flex-shrink-0 mt-0.5">✕</span>
                      <span className="leading-snug">{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowTechniqueModal(false)}
                className="w-full py-3 bg-[#2B0B2E] text-[#FFE600] font-display font-black text-xs uppercase rounded-xl shadow-[3px_3px_0_#FF3377] cursor-pointer mt-1"
              >
                Entendido, ¡A Entrenar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: WORKOUT COMPLETE CELEBRATION */}
      {showFinishedModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border-3 border-[#2B0B2E] w-full max-w-sm rounded-3xl p-6 shadow-[8px_8px_0_#FFE600,14px_14px_0_#FF3377] flex flex-col gap-4 text-center text-[#2B0B2E] screen-enter">
            <div className="w-16 h-16 rounded-3xl bg-[#FFE600] border-3 border-[#2B0B2E] flex items-center justify-center mx-auto shadow-[3px_3px_0_#2B0B2E] animate-bounce">
              <Award className="w-9 h-9 text-[#FF3377]" />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-[#00A859] tracking-wider">
                ¡Misión Cumplida!
              </span>
              <h3 className="font-display font-black text-2xl text-[#2B0B2E] mt-0.5">
                Sesión Finalizada con Éxito
              </h3>
              <p className="text-xs text-[#6C586B] mt-1">
                Completaste los 5 ejercicios de {currentRoutine.title}. Has dado un paso gigante en tu transformación de 28 días.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#FFF9E6] p-3 rounded-2xl border-2 border-[#2B0B2E] text-xs">
              <div>
                <span className="text-[10px] text-[#6C586B] uppercase block">Carga Total:</span>
                <strong className="font-display font-black text-base text-[#2B0B2E]">{totalVolumeTonnage} kg</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#6C586B] uppercase block">Tiempo de Sesión:</span>
                <strong className="font-display font-black text-base text-[#2B0B2E]">{formatTime(sessionSeconds)}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                uiAudio.play('success');
                setShowFinishedModal(false);
                onNavigate('inicio');
              }}
              className="w-full py-3.5 bg-[#FF3377] hover:bg-[#D81B60] text-white font-display font-black text-sm uppercase rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>Volver al Inicio y Registrar</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
