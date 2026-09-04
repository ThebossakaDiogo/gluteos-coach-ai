import React, { useState, useEffect } from 'react';
import { uiAudio } from '../utils/audioEngine';
import { useGeoTime } from '../utils/useGeoTime';
import { UserSession } from '../types';
import { SoundControl } from './SoundControl';
import { saveUserSessionToBackend } from '../utils/mockBackendService';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Zap,
  ArrowRight,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Gift,
  Heart,
  Award,
  AlertTriangle,
  RotateCcw,
  Users,
  Smartphone,
} from 'lucide-react';

interface UpsellPageProps {
  userSession?: UserSession | null;
  onAcceptUpsell: (updatedSession: UserSession) => void;
  onDeclineUpsell: () => void;
  onGoToApp?: () => void;
}

export function UpsellPage({
  userSession,
  onAcceptUpsell,
  onDeclineUpsell,
  onGoToApp,
}: UpsellPageProps) {
  const geoTime = useGeoTime();

  // Dynamic 15:00 countdown timer (persists in session storage to feel realistic)
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('upsell_countdown_seconds');
      if (saved) {
        const parsed = parseInt(saved, 10);
        return parsed > 0 ? parsed : 894; // ~14m 54s
      }
    } catch {
      // ignore
    }
    return 894;
  });

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(38); // percent
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [spotCount, setSpotCount] = useState<number>(5);

  // Decrement timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        try {
          sessionStorage.setItem('upsell_countdown_seconds', next.toString());
        } catch {
          // ignore
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Video progress animation when playing
  useEffect(() => {
    if (!isPlayingVideo) return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => (prev >= 98 ? 10 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlayingVideo]);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {
      minutes: mins < 10 ? `0${mins}` : `${mins}`,
      seconds: secs < 10 ? `0${secs}` : `${secs}`,
    };
  };

  const timer = formatTime(secondsLeft);

  const handleBuyOneClick = () => {
    uiAudio.play('click');
    setIsProcessingBuy(true);

    setTimeout(() => {
      uiAudio.play('success');
      setBuySuccess(true);

      const updated: UserSession = {
        email: userSession?.email || 'aluna.vip@gluteos28.com',
        name: userSession?.name || 'Aluna VIP',
        plan: 'Desafío Glúteos 28 Días + Acelerador VIP 3X (Vitalício)',
        purchasedAt: userSession?.purchasedAt || 'Hoje',
        isVerified: true,
        ip: geoTime.ip || '187.19.120.45',
        city: geoTime.city,
        country: geoTime.country,
        hasUpsell: true,
        upsellName: 'Protocolo Acelerador Glúteos 3X VIP',
        upsellPurchasedAt: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        savedVia: 'Cookie + IP Backend',
        updatedAt: new Date().toISOString(),
      };

      saveUserSessionToBackend(updated, geoTime.ip);

      setTimeout(() => {
        onAcceptUpsell(updated);
      }, 1500);
    }, 1400);
  };

  const handleDecline = () => {
    uiAudio.play('back');
    onDeclineUpsell();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#2B0B2E] flex flex-col font-body selection:bg-[#FF3377] selection:text-white relative">
      {/* Floating Sound Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <SoundControl />
      </div>

      {/* 1. TOP CRITICAL NOTIFICATION BAR (ORDER CONFIRMATION ALERT) */}
      <section className="sticky top-0 z-40 bg-[#2B0B2E] text-white border-b-3 border-[#FFE600] px-3 py-2.5 shadow-[0_4px_12px_rgba(43,11,46,0.25)]">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A7FF00] animate-ping flex-shrink-0" />
            <span className="text-xs sm:text-sm font-black text-[#FFE600] uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#A7FF00] stroke-[3]" />
              Pedido Principal Aprovado!
            </span>
            <span className="hidden md:inline text-xs text-white/80">
              | Não feche ou atualize esta página
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-bold bg-[#FF3377] text-white px-2.5 py-0.5 rounded-full border border-white/40">
              <span>Passo 2 de 2: Oferta de 1-Clique</span>
            </div>

            {onGoToApp && (
              <button
                type="button"
                onClick={onGoToApp}
                className="flex items-center gap-1 text-[11px] font-black bg-white/15 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full border border-white/30 transition-all cursor-pointer"
                title="Ir para o Aplicativo da Aluna"
              >
                <Smartphone className="w-3 h-3 text-[#A7FF00]" />
                <span>Ir para o App</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-5 pb-20 flex flex-col gap-6">
        {/* 2. PROGRESS STEP BAR */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-[#00A859] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> 1. Compra Principal Concluída
            </span>
            <span className="text-[#FF3377] flex items-center gap-1">
              2. Personalização Turbo VIP (Última Etapa)
            </span>
          </div>
          <div className="w-full h-3 bg-[#2B0B2E]/10 rounded-full overflow-hidden p-0.5 border border-[#2B0B2E]">
            <div className="h-full bg-gradient-to-r from-[#00A859] via-[#FFE600] to-[#FF3377] rounded-full w-[85%] animate-pulse" />
          </div>
        </div>

        {/* 3. SOPHISTICATED COUNTDOWN TIMER BANNER */}
        <section className="bg-[#FFF9E6] border-3 border-[#2B0B2E] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0_#2B0B2E,10px_10px_0_#FF3377] flex flex-col sm:flex-row items-center justify-between gap-4 screen-enter">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3377] text-white flex items-center justify-center border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex-shrink-0 animate-bounce">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF3377] flex items-center justify-center sm:justify-start gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#FF3377]" />
                Oportunidade Única de Recém-Compradora
              </span>
              <h3 className="font-display font-black text-sm sm:text-base text-[#2B0B2E] leading-tight">
                Esta página expira e nunca mais será exibida:
              </h3>
            </div>
          </div>

          {/* Clock Display */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="bg-[#2B0B2E] text-[#FFE600] font-mono font-black text-2xl sm:text-3xl px-3 py-1.5 rounded-xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#FF3377]">
                {timer.minutes}
              </div>
              <span className="text-[9px] font-black text-[#6C586B] uppercase mt-0.5">minutos</span>
            </div>

            <span className="font-mono font-black text-2xl text-[#FF3377] animate-pulse">:</span>

            <div className="flex flex-col items-center">
              <div className="bg-[#2B0B2E] text-[#FFE600] font-mono font-black text-2xl sm:text-3xl px-3 py-1.5 rounded-xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#FF3377]">
                {timer.seconds}
              </div>
              <span className="text-[9px] font-black text-[#6C586B] uppercase mt-0.5">segundos</span>
            </div>
          </div>
        </section>

        {/* 4. HERO SECTION - MAGNETIC HEADLINE & SUBHEADLINE */}
        <section className="text-center flex flex-col items-center gap-3 screen-enter">
          <span className="eyebrow-pill">
            <Zap className="w-3.5 h-3.5 text-[#FF3377] fill-[#FF3377]" />
            Acelerador de Resultados 3X · Apenas R$ 29,90
          </span>

          <h1 className="font-display font-black text-2xl sm:text-4xl text-[#2B0B2E] leading-[1.15] tracking-tight">
            Quer <span className="bg-[#FFE600] px-2 py-0.5 rounded-md border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] inline-block -rotate-1">Triplicar</span> os Resultados dos Seus Glúteos em Menos da Metade do Tempo?
          </h1>

          <p className="text-sm sm:text-base text-[#6C586B] font-medium max-w-xl leading-relaxed">
            Parabéns pelo acesso ao <strong>Desafio Glúteos 28 Días</strong>! O método padrão funciona, mas se você não quer esperar 4 semanas para ver os primeiros centímetros e deseja <strong>eliminar a celulite e empinar o bumbum sem ganhar barriga</strong>, você precisa desta chave mestra.
          </p>
        </section>

        {/* 5. INTERACTIVE VSL / VIDEO PRESENTATION MOCKUP */}
        <section className="relative rounded-3xl bg-[#2B0B2E] border-3 border-[#2B0B2E] shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] overflow-hidden">
          {/* Header of Video Player */}
          <div className="bg-[#3E1343] px-4 py-2 flex items-center justify-between border-b-2 border-white/10 text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3377] animate-ping" />
              <span className="font-black tracking-wider uppercase text-[11px] text-[#FFE600]">
                Vídeo Oficial da Coach Glúteos
              </span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold">
              01:42 / 03:15
            </span>
          </div>

          {/* Video Stage / Visual Content */}
          <div className="relative aspect-video bg-gradient-to-br from-[#2B0B2E] via-[#4A154B] to-[#1F0721] flex flex-col items-center justify-center p-4 text-center text-white overflow-hidden group">
            {/* Background Texture Graphic */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Coach Preview Card inside Video */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 border-[#FFE600] shadow-[3px_3px_0_#FF3377] overflow-hidden bg-white">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiN2l2LYyVuDglRwJajrz4Peonhajg-655LnqrsaiPKNTNbv1lmHE-ILafkuMiubkp2tCuQpMvYAcAxqyiPbgwp8MYA1yT9mrMWporgjpinrEvMYDUcl7ru_mJ6XAjhnOo_TlWS18gb95-Yy5OAz-8feaPZTfvcQjBrhDclf1-rPQQBkCL5kU5XjP1UdD6SqiKVYH856bOxaD5BVxXdyyRlLUu6olPpus4WGvjVMSB94gkoX1hNzbH"
                  alt="Coach Camila"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="bg-[#A7FF00] text-[#2B0B2E] text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-[#2B0B2E] inline-block mb-1">
                  Exclusivo para Alunas Novas
                </span>
                <h4 className="font-display font-black text-lg sm:text-xl text-[#FFE600] leading-tight">
                  Como Ativar Fibras Glúteas Profundas
                </h4>
                <p className="text-xs text-white/80 max-w-sm mt-0.5">
                  "O segredo que 94% das mulheres ignoram ao tentar aumentar os glúteos em casa."
                </p>
              </div>

              {/* Play / Pause Big Button */}
              <button
                onClick={() => {
                  uiAudio.play(isPlayingVideo ? 'click' : 'select');
                  setIsPlayingVideo(!isPlayingVideo);
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFE600] hover:bg-[#A7FF00] text-[#2B0B2E] border-3 border-[#2B0B2E] shadow-[3px_3px_0_#FF3377] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              >
                {isPlayingVideo ? (
                  <Pause className="w-7 h-7 fill-[#2B0B2E]" />
                ) : (
                  <Play className="w-7 h-7 fill-[#2B0B2E] ml-1" />
                )}
              </button>
            </div>

            {/* Video Controls Bar at bottom */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between gap-3 text-white text-xs z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    uiAudio.play('click');
                    setIsPlayingVideo(!isPlayingVideo);
                  }}
                  className="p-1 hover:text-[#FFE600]"
                >
                  {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => {
                    uiAudio.play('click');
                    setIsVideoMuted(!isVideoMuted);
                  }}
                  className="p-1 hover:text-[#FFE600]"
                >
                  {isVideoMuted ? <VolumeX className="w-4 h-4 text-[#FF3377]" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Progress Slider */}
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFE600] transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <span className="text-[10px] font-mono text-white/70">HD 1080p</span>
            </div>
          </div>
        </section>

        {/* 6. PRIMARY CALL TO ACTION BUTTON (1-CLICK BUY) */}
        <section className="flex flex-col gap-2.5 p-4 rounded-3xl bg-[#FFE600] border-3 border-[#2B0B2E] shadow-[5px_5px_0_#2B0B2E,9px_9px_0_#FF3377] text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#2B0B2E]">
            <Sparkles className="w-4 h-4 text-[#FF3377]" />
            <span>OFERTA ÚNICA: DE R$ 197,00 POR APENAS R$ 29,90</span>
            <Sparkles className="w-4 h-4 text-[#FF3377]" />
          </div>

          <button
            onClick={handleBuyOneClick}
            disabled={isProcessingBuy}
            className="cta-button py-4 text-base sm:text-lg cursor-pointer"
          >
            {isProcessingBuy ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando 1-Clique no Mesmo Cartão...</span>
              </div>
            ) : buySuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#A7FF00] stroke-[3]" />
                <span>¡Acelerador VIP Ativado com Sucesso!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 font-black">
                <span>SIM! QUERO ADICIONAR O ACELERADOR 3X POR R$ 29,90</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </div>
            )}
            <span className="button-sheen" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-[#2B0B2E]">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#00A859]" /> Cobrança em 1-Clique segura
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#FF3377]" /> Adição instantânea à sua conta
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#00A859]" /> 30 Dias de Garantia
            </span>
          </div>
        </section>

        {/* 7. WHAT'S IN THE VIP ACCELERATOR (VALUE STACKING) */}
        <section className="flex flex-col gap-4">
          <div className="text-center">
            <span className="eyebrow-pill mx-auto">O Que Você Recebe Imediatamente</span>
            <h2 className="font-display font-black text-2xl text-[#2B0B2E] mt-1">
              Os 5 Pilares do Protocolo Acelerador 3X
            </h2>
            <p className="text-xs text-[#6C586B] mt-0.5">
              Desenvolvido para destravar o ganho muscular mesmo em mulheres com glúteos retos ou caídos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs text-[#2B0B2E]">
                  01
                </span>
                <span className="text-[10px] font-black uppercase text-[#00A859] bg-[#A7FF00]/30 px-2 py-0.5 rounded-md">
                  Treino Noturno
                </span>
              </div>
              <h3 className="font-display font-black text-sm text-[#2B0B2E]">
                Treinos Noturnos de Ativação Neuromuscular 3X
              </h3>
              <p className="text-xs text-[#6C586B] leading-relaxed">
                Rotinas express de 10 minutos para fazer na cama ou tapete antes de dormir. Ativam fibras dormentes do glúteo máximo sem sobrecarregar coxas.
              </p>
              <span className="text-[11px] font-bold text-[#FF3377] mt-auto">Valor individual: R$ 67,00</span>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs text-[#2B0B2E]">
                  02
                </span>
                <span className="text-[10px] font-black uppercase text-[#FF3377] bg-[#FF3377]/10 px-2 py-0.5 rounded-md">
                  Anti-Flacidez
                </span>
              </div>
              <h3 className="font-display font-black text-sm text-[#2B0B2E]">
                Protocolo Linfático Anti-Celulite & Efeito Redondo
              </h3>
              <p className="text-xs text-[#6C586B] leading-relaxed">
                Drenagem manual de 4 minutos no banho com ativos naturais que estimulam a circulação local e eliminam os furinhos da celulite em 14 dias.
              </p>
              <span className="text-[11px] font-bold text-[#FF3377] mt-auto">Valor individual: R$ 47,00</span>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs text-[#2B0B2E]">
                  03
                </span>
                <span className="text-[10px] font-black uppercase text-[#9D1CBB] bg-[#9D1CBB]/10 px-2 py-0.5 rounded-md">
                  Nutrição Direcionada
                </span>
              </div>
              <h3 className="font-display font-black text-sm text-[#2B0B2E]">
                Guia Secreto de Combinação Proteica para Volume
              </h3>
              <p className="text-xs text-[#6C586B] leading-relaxed">
                As combinações exatas de aminoácidos + carboidratos anti-barriga que direcionam os nutrientes 100% para o bumbum sem acumular gordura abdominal.
              </p>
              <span className="text-[11px] font-bold text-[#FF3377] mt-auto">Valor individual: R$ 57,00</span>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs text-[#2B0B2E]">
                  04
                </span>
                <span className="text-[10px] font-black uppercase text-[#00A859] bg-[#A7FF00]/30 px-2 py-0.5 rounded-md">
                  Inteligência AI
                </span>
              </div>
              <h3 className="font-display font-black text-sm text-[#2B0B2E]">
                Acesso Ilimitado ao Coach AI com Prioridade VIP
              </h3>
              <p className="text-xs text-[#6C586B] leading-relaxed">
                Tire dúvidas 24h por dia, peça substituições de exercícios em 1 segundo e tenha correções personalizadas para sua biomecânica individual.
              </p>
              <span className="text-[11px] font-bold text-[#FF3377] mt-auto">Valor individual: R$ 97,00</span>
            </div>
          </div>

          {/* SUPER BONUS CARD */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF9E6] to-[#FFE600]/40 border-2.5 border-[#FF3377] shadow-[4px_4px_0_#2B0B2E] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF3377] text-white flex items-center justify-center font-black border-2 border-[#2B0B2E] flex-shrink-0 shadow-[2px_2px_0_#2B0B2E]">
              <Gift className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-[#FF3377] text-white px-2 py-0.2 rounded-full">
                  SUPER BÔNUS HOJE
                </span>
                <span className="text-xs font-bold text-[#00A859]">100% Grátis</span>
              </div>
              <h4 className="font-display font-black text-sm text-[#2B0B2E] leading-tight mt-0.5">
                Comunidade Secreta VIP de Alunas + Suporte Nutricional
              </h4>
              <p className="text-xs text-[#6C586B]">
                Acesso ao grupo exclusivo de motivação, fotos de evolução diária e acompanhamento contínuo.
              </p>
            </div>
          </div>
        </section>

        {/* 8. COMPARISON TABLE: STANDARD VS ACCELERATED VIP */}
        <section className="bg-white rounded-3xl border-3 border-[#2B0B2E] shadow-[5px_5px_0_#2B0B2E] p-5 flex flex-col gap-4">
          <div className="text-center">
            <h3 className="font-display font-black text-lg text-[#2B0B2E]">
              Compare os Dois Caminhos
            </h3>
            <p className="text-xs text-[#6C586B]">
              Qual das duas jornadas você escolhe seguir a partir de hoje?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Standard Plan Column */}
            <div className="p-3 bg-[#FFFDF8] rounded-2xl border-2 border-[#2B0B2E]/20 flex flex-col gap-2.5 opacity-90">
              <div className="text-center pb-2 border-b border-[#2B0B2E]/10">
                <span className="text-[10px] font-bold text-[#6C586B] uppercase block">Seu Plano Atual</span>
                <strong className="text-xs text-[#2B0B2E]">Desafio 28D Padrão</strong>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-[#6C586B]">
                <Clock className="w-3.5 h-3.5 text-[#6C586B] flex-shrink-0 mt-0.5" />
                <span>Resultados visíveis em 4 a 6 semanas</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-[#6C586B]">
                <Check className="w-3.5 h-3.5 text-[#6C586B] flex-shrink-0 mt-0.5" />
                <span>Treinos diários normais</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-[#6C586B]">
                <X className="w-3.5 h-3.5 text-[#FF3377] flex-shrink-0 mt-0.5" />
                <span>Sem protocolo anti-celulite rápido</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-[#6C586B]">
                <X className="w-3.5 h-3.5 text-[#FF3377] flex-shrink-0 mt-0.5" />
                <span>Sem ativação neuromuscular noturna</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-[#6C586B]">
                <X className="w-3.5 h-3.5 text-[#FF3377] flex-shrink-0 mt-0.5" />
                <span>Coach AI com fila padrão</span>
              </div>
            </div>

            {/* Accelerated VIP Plan Column */}
            <div className="p-3 bg-[#FFF9E6] rounded-2xl border-2.5 border-[#FF3377] shadow-[3px_3px_0_#FF3377] flex flex-col gap-2.5">
              <div className="text-center pb-2 border-b border-[#FF3377]/20">
                <span className="text-[10px] font-black text-[#FF3377] uppercase block">COM O ACELERADOR</span>
                <strong className="text-xs text-[#2B0B2E] font-black">Protocolo VIP 3X</strong>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] font-black text-[#00A859]">
                <Zap className="w-3.5 h-3.5 text-[#FF3377] flex-shrink-0 mt-0.5 fill-[#FF3377]" />
                <span>Resultados visíveis em 7 a 14 dias</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] font-black text-[#2B0B2E]">
                <Check className="w-3.5 h-3.5 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Treinos padrão + 10 min noturnos 3X</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] font-black text-[#2B0B2E]">
                <Check className="w-3.5 h-3.5 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Drenagem Linfática Glúteos 14D</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] font-black text-[#2B0B2E]">
                <Check className="w-3.5 h-3.5 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Guia Combinação Proteica Anti-Barriga</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] font-black text-[#2B0B2E]">
                <Check className="w-3.5 h-3.5 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Coach AI Ilimitado + Resposta Instantânea</span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. REAL TESTIMONIALS & SOCIAL PROOF */}
        <section className="flex flex-col gap-3.5">
          <div className="text-center">
            <span className="eyebrow-pill mx-auto">Resultados Reais de Alunas VIP</span>
            <h3 className="font-display font-black text-xl text-[#2B0B2E] mt-1">
              Quem Adicionou o Acelerador Amou:
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {/* Testimonial 1 */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#FFE600] border border-[#2B0B2E] flex items-center justify-center font-bold text-xs text-[#2B0B2E]">
                    MR
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2B0B2E]">Mariana R. — São Paulo</h4>
                    <div className="flex text-[#FFE600] text-xs">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-[#A7FF00]/40 text-[#00A859] px-2 py-0.5 rounded-full border border-[#00A859]">
                  +4.5 cm no quadril
                </span>
              </div>
              <p className="text-xs text-[#6C586B] italic leading-relaxed">
                "Eu já tinha tentado de tudo na academia e só ficava com a coxa grossa e a bunda quadrada. O Acelerador me ensinou a ativar o glúteo de verdade. Em 12 dias minhas calças já vestiam completamente diferente!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#FF3377] text-white border border-[#2B0B2E] flex items-center justify-center font-bold text-xs">
                    JP
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2B0B2E]">Juliana P. — Curitiba</h4>
                    <div className="flex text-[#FFE600] text-xs">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-[#A7FF00]/40 text-[#00A859] px-2 py-0.5 rounded-full border border-[#00A859]">
                  Menos Celulite
                </span>
              </div>
              <p className="text-xs text-[#6C586B] italic leading-relaxed">
                "O protocolo da drenagem no banho e o mousse noturno são surreais. Perdi aquela retenção mole do bumbum e a pele ficou lisinha e empinada. Vale cada centavo, é praticamente de graça por R$ 29."
              </p>
            </div>
          </div>
        </section>

        {/* 10. UNCONDITIONAL 30-DAY GUARANTEE */}
        <section className="bg-[#FFF9E6] p-5 rounded-3xl border-3 border-[#2B0B2E] shadow-[5px_5px_0_#2B0B2E] flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#00A859] text-white flex items-center justify-center border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex-shrink-0">
            <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-black text-base text-[#2B0B2E] leading-tight">
              Garantia Incondicional Blindada de 30 Dias
            </h3>
            <p className="text-xs text-[#6C586B] leading-relaxed mt-1">
              Teste o Acelerador VIP por 30 dias completos. Se você não notar seus glúteos mais firmes, empinados e redondos no espelho, basta enviar um e-mail com 1 clique e devolvemos 100% do seu dinheiro. Risco zero absoluto!
            </p>
          </div>
        </section>

        {/* 11. SECONDARY BUY BUTTON (STICKY ACTION AT BOTTOM) */}
        <section className="flex flex-col gap-2.5 p-4 rounded-3xl bg-[#FFE600] border-3 border-[#2B0B2E] shadow-[5px_5px_0_#2B0B2E,9px_9px_0_#FF3377] text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#2B0B2E]">
            <Flame className="w-4 h-4 text-[#FF3377] fill-[#FF3377]" />
            <span>CLIQUE ABAIXO PARA ADICIONAR AO SEU PEDIDO COM 80% OFF</span>
          </div>

          <button
            onClick={handleBuyOneClick}
            disabled={isProcessingBuy}
            className="cta-button py-4 text-base sm:text-lg cursor-pointer"
          >
            {isProcessingBuy ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando 1-Clique...</span>
              </div>
            ) : buySuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#A7FF00] stroke-[3]" />
                <span>¡Acelerador VIP Ativado!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 font-black">
                <span>SIM! QUERO ADICIONAR POR APENAS R$ 29,90</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </div>
            )}
            <span className="button-sheen" />
          </button>

          <p className="text-[11px] font-bold text-[#6C586B]">
            *Cobrança segura em 1-clique no mesmo meio de pagamento do pedido principal.
          </p>
        </section>

        {/* 12. RESPECTFUL NO-THANKS / SKIP LINK (DOWNSELL / REJECTION) */}
        <div className="text-center pt-2">
          <button
            onClick={handleDecline}
            className="text-xs font-bold text-[#6C586B] hover:text-[#FF3377] underline decoration-[#2B0B2E]/30 hover:decoration-[#FF3377] transition-all cursor-pointer p-2"
          >
            Não, obrigado. Eu entendo que esta é a minha única chance de ter o Acelerador 3X por R$ 29,90 e prefiro continuar apenas com o plano básico e arriscar demorar mais para ver resultados.
          </button>
        </div>

        {/* 13. FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section className="flex flex-col gap-3 pt-4 border-t-2 border-[#2B0B2E]/15">
          <h3 className="font-display font-black text-lg text-center text-[#2B0B2E]">
            Dúvidas Frequentes sobre o Acelerador
          </h3>

          <div className="flex flex-col gap-2 text-xs">
            {[
              {
                q: 'Como funciona o pagamento em 1-clique?',
                a: 'Seus dados já foram validados com segurança na compra do produto principal há poucos instantes. Ao clicar no botão de confirmação, o sistema apenas adiciona o valor único de R$ 29,90 ao mesmo pedido, sem você precisar digitar cartão ou dados novamente.',
              },
              {
                q: 'Por que esta oferta é tão barata?',
                a: 'Porque você acabou de se tornar nossa aluna oficial! Como agradecimento pela confiança, liberamos o Acelerador com 80% de desconto exclusivo para novos membros durante os 15 minutos desta página.',
              },
              {
                q: 'E se eu tiver pouco tempo no meu dia?',
                a: 'O protocolo noturno leva apenas 10 minutos e a massagem linfática apenas 4 minutos no banho. Ele foi desenhado sob medida para mulheres ocupadas que não têm horas para gastar na academia.',
              },
              {
                q: 'Como recebo o acesso?',
                a: 'Imediatamente! Assim que você clicar no botão, o seu acesso ao aplicativo já será atualizado com a insígnia VIP e todas as rotinas e bônus desbloqueados instantaneamente na sua conta.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-[#2B0B2E] overflow-hidden"
              >
                <button
                  onClick={() => {
                    uiAudio.play('click');
                    setOpenFaq(openFaq === idx ? null : idx);
                  }}
                  className="w-full p-3.5 text-left font-display font-bold text-xs flex items-center justify-between text-[#2B0B2E] cursor-pointer hover:bg-[#FFF9E6]"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#FF3377] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6C586B] flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-3.5 pt-0 text-[#6C586B] leading-relaxed border-t border-[#2B0B2E]/10 bg-[#FFFDF8]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-[11px] font-bold text-[#6C586B] pt-4">
          <p>Método Glúteos 28 Días © 2026 · Todos os direitos reservados.</p>
          <p className="text-[10px] text-[#6C586B]/70 mt-0.5">
            Pagamento Processado com Criptografia de Ponta a Ponta · SSL 256-bit
          </p>
        </footer>
      </main>
    </div>
  );
}
