import React, { useState, useRef, useEffect } from 'react';
import { uiAudio } from '../utils/audioEngine';
import { UserSession } from '../types';
import { saveUserSessionToBackend } from '../utils/mockBackendService';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Zap,
  Gift,
  CirclePlay,
  CalendarDays,
  Utensils,
  ShieldCheck,
  Lock,
  User,
  Globe2,
  Cookie,
  Flame,
  BookOpen,
} from 'lucide-react';

interface QuizFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result: { goal: string; time: string; obstacle: string }) => void;
  userSession?: UserSession | null;
  onUpdateSession?: (session: UserSession) => void;
  onOpenCookbook?: () => void;
}

export function QuizFlowModal({
  isOpen,
  onClose,
  onComplete,
  userSession,
  onUpdateSession,
  onOpenCookbook,
}: QuizFlowModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: landing, 1..13: questions, 14: interstitial, 15: scratch coupon, 16: final summary
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  // Name & Upsell confirmation on final step
  const [learnerName, setLearnerName] = useState(userSession?.name || '');
  const [upsellSavedSuccess, setUpsellSavedSuccess] = useState(false);

  useEffect(() => {
    if (userSession?.name) {
      setLearnerName(userSession.name);
    }
  }, [userSession?.name]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const handleActivateUpsell = () => {
    const finalName = learnerName.trim() || userSession?.name || 'Alumna VIP';
    uiAudio.play('success');

    const updatedSession: UserSession = {
      email: userSession?.email || 'alumna.vip@gluteos28.com',
      name: finalName,
      plan: 'Desafío Glúteos 28 Días + Acelerador VIP',
      purchasedAt: userSession?.purchasedAt || 'Hoy',
      isVerified: true,
      ip: userSession?.ip || '187.19.120.45',
      hasUpsell: true,
      upsellName: 'Protocolo VIP + Libro Oficial de +50 Recetas Proteicas para Glúteos',
      upsellPurchasedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      quizAnswers: answers,
      savedVia: 'Cookie + IP Backend',
      updatedAt: new Date().toISOString(),
    };

    saveUserSessionToBackend(updatedSession, userSession?.ip);
    if (onUpdateSession) {
      onUpdateSession(updatedSession);
    }

    setUpsellSavedSuccess(true);
  };

  const questions = [
    {
      id: 'q1',
      phase: 'Tu punto de partida',
      eyebrow: 'Empecemos por cómo te sientes hoy',
      title: '¿Cómo describirías tus glúteos actualmente?',
      options: [
        { id: 'q1_1', label: 'Quiero más firmeza y elevación', sub: 'Siento que perdieron tono con el tiempo' },
        { id: 'q1_2', label: 'Quiero más volumen y forma', sub: 'Busco una curva más redondeada y visible' },
        { id: 'q1_3', label: 'Ya me gustan, pero quiero potenciarlos', sub: 'Quiero definición y un efecto más marcado' },
      ],
    },
    {
      id: 'q2',
      phase: 'Tu punto de partida',
      eyebrow: 'Tu prioridad estética',
      title: '¿Qué cambio tendría más impacto en tu confianza?',
      options: [
        { id: 'q2_1', label: 'Ver más proyección de perfil', sub: 'Una silueta con más volumen y curva' },
        { id: 'q2_2', label: 'Sentirlos más firmes', sub: 'Menos flacidez y mejor tono al tacto' },
        { id: 'q2_3', label: 'Vestirme con más seguridad', sub: 'Sentirme mejor con jeans, vestidos y bikinis' },
      ],
    },
    {
      id: 'q3',
      phase: 'Tu punto de partida',
      eyebrow: 'Tu relación con tu cuerpo',
      title: 'Cuando eliges ropa, ¿cuánto influye esta inseguridad?',
      options: [
        { id: 'q3_1', label: 'Mucho', sub: 'A veces cambio de ropa o evito ciertas prendas' },
        { id: 'q3_2', label: 'Un poco', sub: 'Intento disimular, aunque no siempre' },
        { id: 'q3_3', label: 'Casi nada', sub: 'Mi objetivo es mejorar, no esconderme' },
      ],
    },
    {
      id: 'q4',
      phase: 'Tu rutina ideal',
      eyebrow: 'Ahora vamos a hacerlo posible',
      title: '¿Qué formato encaja mejor en tu día?',
      options: [
        { id: 'q4_1', label: 'Rutinas cortas y directas', sub: 'Quiero terminar antes de encontrar una excusa' },
        { id: 'q4_2', label: 'Sesiones guiadas con calma', sub: 'Prefiero aprender bien cada movimiento' },
        { id: 'q4_3', label: 'Entrenos intensos', sub: 'Me gusta sentir un desafío mayor' },
      ],
    },
    {
      id: 'q5',
      phase: 'Tu rutina ideal',
      eyebrow: 'Constancia antes que perfección',
      title: '¿Seguirías una secuencia clara durante 28 días?',
      options: [
        { id: 'q5_1', label: 'Sí, si sé exactamente qué hacer', sub: 'Necesito una guía día por día' },
        { id: 'q5_2', label: 'Sí, si noto que estoy avanzando', sub: 'Los pequeños logros me mantienen motivada' },
        { id: 'q5_3', label: 'Sí, quiero crear este hábito', sub: 'Estoy lista para priorizarme' },
      ],
    },
    {
      id: 'q6',
      phase: 'Tu rutina ideal',
      eyebrow: 'Diseñemos una meta realista',
      title: '¿Cuánto tiempo puedes reservar para ti?',
      options: [
        { id: 'q6_1', label: '8 a 10 minutos', sub: 'Formato express para días ocupados', val: '8-10 min' },
        { id: 'q6_2', label: '10 a 15 minutos', sub: 'Tiempo para activar y entrenar', val: '10-15 min' },
        { id: 'q6_3', label: '20 minutos o más', sub: 'Quiero una sesión más completa', val: '20+ min' },
      ],
    },
    {
      id: 'q7',
      phase: 'Tu rutina ideal',
      eyebrow: 'Tu frecuencia sostenible',
      title: '¿Cuántos días por semana puedes entrenar en casa?',
      options: [
        { id: 'q7_1', label: '3 días por semana', sub: 'Quiero empezar de forma gradual', val: '3 días' },
        { id: 'q7_2', label: '4 a 5 días por semana', sub: 'Mi equilibrio ideal entre estímulo y descanso', val: '4-5 días' },
        { id: 'q7_3', label: '6 días por semana', sub: 'Me motivan las rutinas diarias y variadas', val: '6 días' },
      ],
    },
    {
      id: 'q8',
      phase: 'Tu rutina ideal',
      eyebrow: 'Un vistazo a tu alimentación',
      title: '¿Cómo suelen ser tus comidas durante el día?',
      options: [
        { id: 'q8_1', label: 'Como poco o me salto comidas', sub: 'Mis horarios dificultan organizarme' },
        { id: 'q8_2', label: 'Hago 3 comidas regulares', sub: 'Tengo una base y puedo mejorar detalles' },
        { id: 'q8_3', label: 'Planifico bien mis comidas', sub: 'Quiero optimizar proteína e hidratación' },
      ],
    },
    {
      id: 'q9',
      phase: 'Tu perfil',
      eyebrow: 'Adaptamos ritmo y recuperación',
      title: '¿Cuál es tu rango de edad?',
      options: [
        { id: 'q9_1', label: '18 - 29 años', sub: 'Enfoque en alta respuesta muscular' },
        { id: 'q9_2', label: '30 - 39 años', sub: 'Enfoque en tono y consistencia' },
        { id: 'q9_3', label: '40 - 49 años', sub: 'Enfoque en activación sin impacto articular' },
        { id: 'q9_4', label: '50+ años', sub: 'Enfoque en fuerza postural y firmeza' },
      ],
    },
    {
      id: 'q10',
      phase: 'Tu perfil',
      eyebrow: 'Tu acuerdo contigo misma',
      title: '¿Qué compromiso se siente posible desde hoy?',
      options: [
        { id: 'q10_1', label: 'Cumplir incluso en días ocupados', sub: 'Ocho minutos también cuentan' },
        { id: 'q10_2', label: 'Volver aunque pierda un día', sub: 'Sin culpa ni mentalidad de todo o nada' },
        { id: 'q10_3', label: 'Registrar cada pequeña victoria', sub: 'Quiero ver mi constancia crecer' },
      ],
    },
    {
      id: 'q11',
      phase: 'Tu perfil',
      eyebrow: 'Tu resultado deseado',
      title: '¿Qué objetivo te emociona más para estos 28 días?',
      options: [
        { id: 'q11_1', label: 'Efecto Push-Up', sub: 'Más elevación, control y firmeza', val: 'Elevar y ganar firmeza' },
        { id: 'q11_2', label: 'Curvas más redondeadas', sub: 'Volumen visual y mejor proyección', val: 'Curvas redondeadas' },
        { id: 'q11_3', label: 'Definición y tono', sub: 'Una apariencia más fuerte y esculpida', val: 'Definir y tonificar' },
      ],
    },
    {
      id: 'q12',
      phase: 'Tu perfil',
      eyebrow: 'Vamos a anticipar los obstáculos',
      title: '¿Qué suele hacerte abandonar una rutina?',
      options: [
        { id: 'q12_1', label: 'Pierdo la motivación', sub: 'Empiezo animada y luego me desconecto', val: 'Falta de motivación' },
        { id: 'q12_2', label: 'No tengo tiempo', sub: 'Trabajo, casa o familia ocupan mi día', val: 'Falta de tiempo' },
        { id: 'q12_3', label: 'Inseguridad con la técnica', sub: 'Me falta una guía visual clara', val: 'Dudas con la técnica' },
      ],
    },
    {
      id: 'q13',
      phase: 'Tu perfil',
      eyebrow: 'Último paso',
      title: '¿Cómo quieres empezar tu nueva rutina?',
      options: [
        { id: 'q13_1', label: 'Con energía y un plan claro', sub: 'Saber exactamente qué hacer desde el día 1' },
        { id: 'q13_2', label: 'A mi ritmo, pero sin parar', sub: 'Constancia sin presión innecesaria' },
        { id: 'q13_3', label: 'Con un reto que me motive', sub: 'Lista para celebrar cada avance diario' },
      ],
    },
  ];

  const currentQIndex = currentStep - 1;
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optId: string, label: string, val?: string) => {
    setSelectedOptionId(optId);
    uiAudio.play('select');

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val || label,
    }));

    setTimeout(() => {
      setSelectedOptionId(null);
      if (currentStep === 3) {
        // Educational interstitial after question 3
        setCurrentStep(14);
      } else if (currentStep < 13) {
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === 13) {
        // Go to scratch card reward
        uiAudio.play('success');
        setCurrentStep(15);
      }
    }, 380);
  };

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    setScratchPercent((prev) => {
      const next = Math.min(100, prev + 8);
      if (next >= 40 && !isScratched) {
        setIsScratched(true);
        uiAudio.play('success');
      }
      return next;
    });
  };

  const initScratchCanvas = (el: HTMLCanvasElement | null) => {
    if (!el) return;
    canvasRef.current = el;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    el.width = el.offsetWidth;
    el.height = el.offsetHeight;

    const grad = ctx.createLinearGradient(0, 0, el.width, el.height);
    grad.addColorStop(0, '#FF3377');
    grad.addColorStop(0.5, '#9D1CBB');
    grad.addColorStop(1, '#2B0B2E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, el.width, el.height);

    ctx.fillStyle = '#FFE600';
    ctx.font = 'bold 13px "Bricolage Grotesque", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ RASPA AQUÍ CON EL DEDO ✨', el.width / 2, el.height / 2 + 5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2B0B2E]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-lg bg-[#FFF9E6] border-3 border-[#2B0B2E] rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0_#2B0B2E,14px_14px_0_#FF3377] text-[#2B0B2E] flex flex-col gap-4 screen-enter max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Top bar with back and close */}
        <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-3">
          <div className="flex items-center gap-2">
            {currentStep > 0 && currentStep <= 13 && (
              <button
                onClick={() => {
                  uiAudio.play('back');
                  setCurrentStep((prev) => Math.max(0, prev - 1));
                }}
                className="back-button"
                aria-label="Volver"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="brand-mark">⚡</span>
            <div className="flex flex-col">
              <span className="font-display font-black text-sm uppercase tracking-tight text-[#2B0B2E]">
                Método 28 Días
              </span>
              <span className="text-[10px] font-bold text-[#FF3377] uppercase tracking-wider">
                Ruta de Glúteos Neo-Pop
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              uiAudio.play('click');
              onClose();
            }}
            className="w-8 h-8 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] flex items-center justify-center text-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 0: LANDING INTRO */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow-pill">60 Segundos</span>
              <span className="text-xs font-bold text-[#6C586B]">13 Preguntas Guiadas</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl leading-[1.05] tracking-tight text-[#2B0B2E]">
              Menos excusas.{' '}
              <span className="text-[#FF3377] underline decoration-4 decoration-[#FFE600]">
                Más fuerza y curva.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
              Descubre una ruta de 28 días para activar y fortalecer tus glúteos en casa, adaptada a tu tiempo, tu nivel y el resultado que quieres ver.
            </p>

            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="mini-benefit">
                <span className="text-[10px] font-black uppercase text-[#FF3377]">Desde 8 min</span>
                <span className="text-[11px] font-bold text-[#2B0B2E]">Por sesión</span>
              </div>
              <div className="mini-benefit">
                <span className="text-[10px] font-black uppercase text-[#00A859]">En casa</span>
                <span className="text-[11px] font-bold text-[#2B0B2E]">Sin máquinas</span>
              </div>
              <div className="mini-benefit">
                <span className="text-[10px] font-black uppercase text-[#9D1CBB]">A tu medida</span>
                <span className="text-[11px] font-bold text-[#2B0B2E]">Paso a paso</span>
              </div>
            </div>

            <button
              onClick={() => {
                uiAudio.play('success');
                setCurrentStep(1);
              }}
              className="cta-button mt-2"
            >
              <span>Crear mi ruta personalizada</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
              <span className="button-sheen" />
            </button>
          </div>
        )}

        {/* QUESTIONS 1 TO 13 */}
        {currentStep >= 1 && currentStep <= 13 && currentQ && (
          <div className="flex flex-col gap-4 py-1 screen-enter">
            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#6C586B]">
                <span className="uppercase tracking-wider">{currentQ.phase}</span>
                <span className="font-mono text-[#FF3377]">
                  {currentStep} / {questions.length}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentStep / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question title */}
            <div className="flex flex-col gap-1 mt-1">
              <span className="eyebrow-pill self-start">{currentQ.eyebrow}</span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#2B0B2E] tracking-tight leading-tight mt-1">
                {currentQ.title}
              </h2>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5 mt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                const letter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id, opt.label, opt.val)}
                    className={`option-card ${isSelected ? 'is-selected' : ''}`}
                  >
                    <span className="option-letter">{letter}</span>
                    <div className="flex-1 flex flex-col text-left">
                      <span className="font-display font-bold text-sm text-[#2B0B2E] leading-snug">
                        {opt.label}
                      </span>
                      <span className="text-xs text-[#6C586B] mt-0.5 leading-tight">
                        {opt.sub}
                      </span>
                    </div>
                    <span className={`option-check ${isSelected ? 'is-selected' : ''}`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 14: EDUCATIONAL INTERSTITIAL */}
        {currentStep === 14 && (
          <div className="flex flex-col gap-4 py-2 screen-enter">
            <span className="eyebrow-pill self-start">Lo que cambia el juego</span>
            <h2 className="font-display font-black text-2xl text-[#2B0B2E] tracking-tight">
              Primero activa. <span className="text-[#FF3377]">Después fortalece.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
              Cuando pasamos muchas horas sentadas, es común compensar ejercicios con muslos o zona lumbar. Por eso el método empieza con movimientos controlados para despertar la conexión mente-músculo.
            </p>

            <div className="dark-panel my-2 flex flex-col gap-3">
              <span className="dark-eyebrow self-start">Metodología Comprobada</span>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 flex flex-col gap-1">
                  <span className="text-[#A7FF00] font-black text-xs uppercase">01. Conectar</span>
                  <span className="text-[11px] text-white/80">Sentir el músculo</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 flex flex-col gap-1">
                  <span className="text-[#A7FF00] font-black text-xs uppercase">02. Controlar</span>
                  <span className="text-[11px] text-white/80">Perfeccionar técnica</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 flex flex-col gap-1">
                  <span className="text-[#A7FF00] font-black text-xs uppercase">03. Progresar</span>
                  <span className="text-[11px] text-white/80">Aumentar carga</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                uiAudio.play('click');
                setCurrentStep(4);
              }}
              className="cta-button"
            >
              <span>Continuar con mi diagnóstico</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
              <span className="button-sheen" />
            </button>
          </div>
        )}

        {/* STEP 15: GAMIFIED SCRATCH CARD COUPON */}
        {currentStep === 15 && (
          <div className="flex flex-col items-center text-center gap-4 py-2 screen-enter">
            <span className="eyebrow-pill">¡13 Preguntas Completadas!</span>
            <h2 className="font-display font-black text-2xl text-[#2B0B2E] tracking-tight">
              Hay un regalo reservado para ti
            </h2>
            <p className="text-xs text-[#6C586B] max-w-sm">
              Raspa la tarjeta con el dedo o ratón para descubrir tu cupón exclusivo antes de ver tu ruta personalizada.
            </p>

            <div className="relative w-full max-w-xs h-36 rounded-2xl border-3 border-[#2B0B2E] overflow-hidden shadow-[6px_6px_0_#2B0B2E] bg-gradient-to-tr from-[#FFE600] to-[#A7FF00] flex flex-col items-center justify-center select-none">
              {/* Underlying coupon content */}
              <div className="flex flex-col items-center justify-center p-3">
                <span className="text-[11px] font-black text-[#2B0B2E] uppercase tracking-widest">
                  CUPÓN EXCLUSIVO
                </span>
                <span className="font-display font-black text-3xl text-[#2B0B2E] tracking-tight">
                  90% OFF
                </span>
                <span className="bg-[#2B0B2E] text-[#FFE600] text-xs font-mono font-bold px-3 py-1 rounded-full mt-1">
                  BUMBUM90
                </span>
                <span className="text-[10px] text-[#00A859] font-bold mt-1">
                  ✓ Descuento listo para ser aplicado
                </span>
              </div>

              {/* Scratch canvas overlay */}
              {!isScratched && (
                <canvas
                  ref={initScratchCanvas}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) handleScratch(e);
                  }}
                  onTouchMove={handleScratch}
                  onClick={handleScratch}
                  className="absolute inset-0 w-full h-full cursor-pointer touch-none"
                />
              )}
            </div>

            {!isScratched ? (
              <button
                onClick={() => {
                  setIsScratched(true);
                  uiAudio.play('success');
                }}
                className="text-xs font-bold text-[#FF3377] underline hover:text-[#D81B60] cursor-pointer"
              >
                (O toca aquí para raspar automáticamente)
              </button>
            ) : (
              <div className="bg-[#A7FF00]/30 border-2 border-[#00A859] text-[#2B0B2E] p-2.5 rounded-xl text-xs font-bold w-full max-w-xs animate-scaleIn">
                🎉 ¡Cupón BUMBUM90 desbloqueado con éxito!
              </div>
            )}

            <button
              onClick={() => {
                uiAudio.play('success');
                setCurrentStep(16);
                if (onComplete) {
                  onComplete({
                    goal: answers['q11'] || 'Elevar y ganar firmeza',
                    time: answers['q6'] || '10-15 min',
                    obstacle: answers['q12'] || 'Falta de tiempo',
                  });
                }
              }}
              disabled={!isScratched}
              className="cta-button disabled:opacity-50"
            >
              <span>Ver mi Ruta Personalizada de 28 Días</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
              <span className="button-sheen" />
            </button>
          </div>
        )}

        {/* STEP 16: FINAL SUMMARY & INTEGRATION */}
        {currentStep === 16 && (
          <div className="flex flex-col gap-4 py-2 screen-enter">
            <span className="eyebrow-pill self-start">Diagnóstico Completo</span>
            <h2 className="font-display font-black text-2xl text-[#2B0B2E] tracking-tight leading-snug">
              Tu próxima victoria cabe en{' '}
              <span className="text-[#FF3377]">{answers['q6'] || '10 a 15 min'}</span> al día.
            </h2>

            <div className="neo-card p-4 flex flex-col gap-2.5 bg-white">
              <span className="text-[11px] font-black text-[#FF3377] uppercase tracking-wider">
                Resumen de tu Ruta Adaptada
              </span>
              <div className="flex flex-col gap-1.5 text-xs text-[#2B0B2E]">
                <div className="flex items-center justify-between border-b border-[#2B0B2E]/10 pb-1.5">
                  <span className="text-[#6C586B]">Objetivo Prioritario:</span>
                  <span className="font-bold text-[#FF3377]">
                    {answers['q11'] || 'Elevar y dar curva'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#2B0B2E]/10 pb-1.5">
                  <span className="text-[#6C586B]">Tiempo por sesión:</span>
                  <span className="font-bold">{answers['q6'] || '10-15 min'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#2B0B2E]/10 pb-1.5">
                  <span className="text-[#6C586B]">Frecuencia ideal:</span>
                  <span className="font-bold">{answers['q7'] || '4 a 5 días'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6C586B]">Estrategia anti-abandono:</span>
                  <span className="font-bold text-[#00A859]">
                    Contra {answers['q12'] || 'falta de tiempo'}
                  </span>
                </div>
              </div>
            </div>

            {/* UPSELL PROTOCOLO ACELERADOR VIP + LIBRO DIGITAL +50 RECETAS PROTEICAS */}
            <div className="bg-[#FFE600] p-4 sm:p-5 rounded-3xl border-3.5 border-[#2B0B2E] shadow-[5px_5px_0_#FF3377] flex flex-col gap-3.5">
              <div className="flex items-center justify-between flex-wrap gap-1.5">
                <span className="bg-[#2B0B2E] text-[#FFE600] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  ⚡ Módulo VIP · Cupón BUMBUM90 Aplicado
                </span>
                <span className="text-[10px] font-black text-[#FF3377] bg-white px-2 py-0.5 rounded-full border border-[#2B0B2E]">
                  90% OFF
                </span>
              </div>

              {/* BOOK COVER HIGHLIGHT SHOWCASE */}
              <div className="relative overflow-hidden rounded-2xl border-2.5 border-[#2B0B2E] bg-gradient-to-br from-[#2B0B2E] via-[#3E1343] to-[#2B0B2E] p-3.5 sm:p-4 text-white shadow-[3px_3px_0_#2B0B2E] flex flex-col sm:flex-row items-center gap-3.5">
                {/* Visual Book Cover Spine Miniature */}
                <div className="relative w-28 sm:w-32 h-36 sm:h-40 rounded-xl border-2 border-[#FFE600] bg-gradient-to-b from-[#FF3377] via-[#D81B60] to-[#2B0B2E] p-2 flex flex-col justify-between shadow-[3px_3px_0_#FFE600] flex-shrink-0 text-center select-none transform sm:-rotate-2">
                  <span className="text-[7px] font-black bg-[#FFE600] text-[#2B0B2E] px-1.5 py-0.2 rounded-full uppercase">
                    GUÍA OFICIAL VIP
                  </span>
                  <div className="my-auto">
                    <span className="text-[7px] font-black text-[#FFE600] block uppercase">28 DÍAS</span>
                    <span className="font-display font-black text-xs text-white leading-tight block">
                      +50 RECETAS PROTEICAS
                    </span>
                    <span className="text-[8px] font-black text-[#A7FF00] block mt-0.5">
                      PARA GLÚTEOS
                    </span>
                  </div>
                  <span className="text-[7px] font-black bg-[#2B0B2E] text-[#FFE600] py-0.5 rounded border border-white/20">
                    ⚡ 24-48g Prot · 52 Recetas
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="bg-[#A7FF00] text-[#2B0B2E] text-[9px] font-black px-2 py-0.2 rounded-full uppercase">
                      NOVEDAD EXCLUSIVA
                    </span>
                    <span className="text-[9px] text-[#FFE600] font-bold">
                      Valorado en $47 USD
                    </span>
                  </div>
                  <h4 className="font-display font-black text-base text-white leading-tight">
                    Libro Digital: +50 Recetas Proteicas para Crecer Glúteos
                  </h4>
                  <p className="text-[11px] text-white/85 leading-snug">
                    52 recetas catalogadas (desayunos, almuerzos, batidos exprés de 3 min y postres fit) con macros exactos para hipertrofia sin acumular grasa.
                  </p>

                  {/* Immediate interactive access button */}
                  {onOpenCookbook && (
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('select');
                        onOpenCookbook();
                      }}
                      className="mt-1 self-center sm:self-start px-3 py-1.5 bg-[#FFE600] hover:bg-[#A7FF00] text-[#2B0B2E] font-display font-black text-xs rounded-xl border-1.5 border-[#2B0B2E] shadow-[2px_2px_0_#FF3377] flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Abrir / Explorar Libro Digital (52 Recetas)</span>
                      <ArrowRight className="w-3 h-3 stroke-[3]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name confirmation input for certificate and IP registration */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-xl border-2 border-[#2B0B2E]">
                <label className="text-[11px] font-bold text-[#2B0B2E] flex items-center justify-between">
                  <span>Tu Nombre para la acreditación VIP y Libro:</span>
                  <span className="text-[9px] text-[#6C586B]">Se guarda en IP & Cookie</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#6C586B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={learnerName}
                    onChange={(e) => setLearnerName(e.target.value)}
                    placeholder="Ej. Camila Silva"
                    className="w-full bg-[#FFF9E6] border border-[#2B0B2E] pl-8 pr-3 py-1.5 rounded-lg text-xs font-bold text-[#2B0B2E] focus:outline-none focus:border-[#FF3377]"
                  />
                </div>
              </div>

              {/* Status or Activate CTA */}
              {upsellSavedSuccess || userSession?.hasUpsell ? (
                <div className="bg-[#A7FF00]/40 border-2 border-[#00A859] p-2.5 rounded-xl text-xs font-black text-[#2B0B2E] flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#00A859] stroke-[3]" />
                    <span>¡Protocolo VIP + Libro +50 Recetas activado en tu IP ({userSession?.ip || 'Actual'}) y Cookie!</span>
                  </div>
                  {onOpenCookbook && (
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('success');
                        onOpenCookbook();
                      }}
                      className="text-[10px] bg-[#2B0B2E] text-[#FFE600] px-3 py-1 rounded-full font-black border border-[#2B0B2E] cursor-pointer hover:bg-[#FF3377] hover:text-white transition-all flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Leer Libro Ahora</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleActivateUpsell}
                  className="w-full py-2.5 px-3 bg-[#2B0B2E] hover:bg-[#FF3377] text-[#FFE600] hover:text-white font-display font-black text-xs uppercase rounded-xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#FF3377] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 text-[#FFE600]" />
                  <span>Activar Protocolo VIP + Libro y Guardar en mi IP & Cookie</span>
                </button>
              )}

              {/* IP & Cookie diagnostic info */}
              <div className="flex items-center justify-between text-[10px] font-bold text-[#6C586B] pt-0.5 border-t border-[#2B0B2E]/15">
                <span className="flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-[#FF3377]" />
                  IP: {userSession?.ip || 'Detectada'}
                </span>
                <span className="flex items-center gap-1 text-[#00A859]">
                  <Cookie className="w-3 h-3 text-[#00A859]" />
                  Acceso permanente sin caducidad
                </span>
              </div>
            </div>

            <div className="dark-panel p-4 flex flex-col gap-2">
              <span className="dark-eyebrow self-start">Plan Activado en el App</span>
              <p className="text-xs text-white/90 leading-relaxed">
                Tus respuestas han sido integradas en tu cronograma diario. Puedes empezar tu primera sesión de 8-10 minutos guiada por el Coach AI en cualquier momento.
              </p>
            </div>

            <button
              onClick={() => {
                uiAudio.play('success');
                onClose();
              }}
              className="cta-button cta-light text-[#2B0B2E]"
            >
              <span>¡Entendido! Comenzar Entrenamientos</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
              <span className="button-sheen" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
