import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { IMAGES, FALLBACK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { uiAudio } from '../utils/audioEngine';
import {
  Sparkles,
  Shield,
  Dumbbell,
  Utensils,
  RefreshCw,
  Timer,
  Image as ImageIcon,
  Mic,
  ArrowUp,
  ShieldAlert,
  Check,
} from 'lucide-react';

interface CoachAiTabProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export function CoachAiTab({ initialPrompt, onClearInitialPrompt }: CoachAiTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'coach',
      text: '¡Hola Camila! Hoy tienes programada tu sesión de Glúteos A enfocada en tensión mecánica.\n\n¿Tienes listo tu espacio con mancuernas o prefieres adaptar algún ejercicio para entrenar 100% en casa?',
      time: '08:32 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: '¡Hola Coach! No alcancé a ir al gimnasio y en casa no tengo barra ni banco para el Hip Thrust. ¿Qué puedo hacer para no perder el estímulo hoy?',
      time: '08:34 AM',
    },
    {
      id: 'm3',
      sender: 'coach',
      text: '¡Tranquila, la constancia supera la perfección! Podemos hacer Puente de Glúteos en el suelo con tu mancuerna y banda elástica sobre las rodillas. Mantendrás el 92% del estímulo biomecánico.',
      time: '08:35 AM',
      card: {
        type: 'exercise_swap',
        title: 'Glute Bridge en Suelo + Mini Band',
        tag: 'Casa / Sin Banco',
        subtitle: 'Sustituye Hip Thrust con barra manteniendo la máxima tensión en acortamiento.',
        stimulusPercent: 92,
        imageUrl: IMAGES.chatBridgeSubstitute,
        instructions: [
          'Haz una pausa isométrica de 2 segundos apretando el glúteo arriba en cada rep.',
          'Haz 4 series de 14–16 reps aumentando cadencia controlada (RPE 8.5).',
        ],
      },
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    uiAudio.play('click');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    // AI answer simulation
    setTimeout(() => {
      let botResponse = '¡Excelente consulta! Para optimizar la hipertrofia de glúteos, mantén la conexión mente-músculo y registra el RPE para calibrar la carga la próxima semana.';
      
      const lower = text.toLowerCase();
      if (lower.includes('mancuerna') || lower.includes('pesos') || lower.includes('sin equipo')) {
        botResponse = 'Para entrenar sin mancuernas pesadas, aumenta el tiempo bajo tensión (TUT). Haz cada repetición con 3 segundos de bajada excéntrica y 2 segundos de contracción en el pico. El estímulo será igual de potente.';
      } else if (lower.includes('ceno') || lower.includes('jantar') || lower.includes('comida') || lower.includes('proteína')) {
        botResponse = 'Te sugiero una tortilla de 3 claras y 1 huevo entero con espinacas y 60g de requesón o queso panela. Aportará 28g de proteína y facilitará tu descanso nocturno sin pesadez.';
      } else if (lower.includes('rodilla') || lower.includes('desconforto') || lower.includes('joelho') || lower.includes('dolor')) {
        botResponse = '¡Cuidado con el ángulo de la tibia! Al hacer sentadilla búlgara, inclina el torso levemente hacia adelante para descargar la rótula y dirigir el 80% de la tensión hacia el glúteo mayor.';
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'coach',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      uiAudio.play('success');
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleVoiceRecord = () => {
    uiAudio.play('select');
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage('Hola Coach, ¿cómo puedo intensificar el puente si solo tengo una mancuerna ligera?');
      }, 2200);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] screen-enter font-body text-[#2B0B2E]">
      {/* Header bar */}
      <section className="flex items-center justify-between pb-3 border-b-2 border-[#2B0B2E]/15">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-[#9D1CBB] border-2 border-[#2B0B2E] text-white flex items-center justify-center shadow-[3px_3px_0_#2B0B2E]">
            <Sparkles className="w-5 h-5 text-[#FFE600]" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#00A859] border border-[#2B0B2E]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-black text-lg text-[#2B0B2E]">Coach Glúteos AI</h1>
              <span className="text-[10px] font-black bg-[#A7FF00] border border-[#2B0B2E] px-1.5 py-0.2 rounded-md">
                PRO
              </span>
            </div>
            <span className="text-xs text-[#6C586B] font-semibold">
              Especialista en Hipertrofia Femenina & Biomecánica
            </span>
          </div>
        </div>
      </section>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3.5 no-scrollbar pr-1">
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isCoach ? 'self-start items-start' : 'self-end items-end'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isCoach
                    ? 'bg-white text-[#2B0B2E] border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E]'
                    : 'bg-[#2B0B2E] text-[#FFE600] border-2 border-[#2B0B2E] shadow-[3px_3px_0_#FF3377]'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {/* Optional Exercise Swap Card in chat */}
                {msg.card && (
                  <div className="mt-3 p-3 rounded-xl bg-[#FFF9E6] border-2 border-[#2B0B2E] text-[#2B0B2E] flex flex-col gap-2 shadow-[2px_2px_0_#2B0B2E]">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-xs text-[#2B0B2E]">
                        {msg.card.title}
                      </span>
                      <span className="bg-[#A7FF00] border border-[#2B0B2E] text-[10px] font-black px-1.5 py-0.5 rounded">
                        {msg.card.stimulusPercent}% Estímulo
                      </span>
                    </div>

                    <div className="w-full h-32 rounded-lg overflow-hidden border border-[#2B0B2E]">
                      <ImageWithFallback
                        src={msg.card.imageUrl}
                        fallbackSrc={FALLBACK_IMAGES.chatBridgeSubstitute}
                        alt="Variante sugerida"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-[11px] text-[#6C586B] font-normal leading-snug">
                      {msg.card.subtitle}
                    </p>

                    <div className="flex flex-col gap-1 text-[11px] bg-white p-2 rounded-lg border border-[#2B0B2E]/20">
                      {msg.card.instructions.map((inst, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#00A859] flex-shrink-0 mt-0.5" />
                          <span>{inst}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#6C586B] mt-1 font-bold px-1">{msg.time}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="self-start bg-white border-2 border-[#2B0B2E] p-3 rounded-2xl shadow-[2px_2px_0_#2B0B2E] flex items-center gap-1.5 text-xs text-[#6C586B]">
            <div className="w-2 h-2 rounded-full bg-[#FF3377] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#9D1CBB] animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-[#FFE600] animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-bold ml-1">Coach formulando ajuste biomecánico...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
        <button
          onClick={() => {
            uiAudio.play('select');
            handleSendMessage('No tengo mancuernas pesadas en casa, ¿cómo mantengo la intensidad?');
          }}
          className="flex-shrink-0 px-2.5 py-1 bg-white hover:bg-[#FFE600] border-1.5 border-[#2B0B2E] text-[11px] font-bold text-[#2B0B2E] rounded-full shadow-[1.5px_1.5px_0_#2B0B2E] transition-all cursor-pointer flex items-center gap-1"
        >
          <Dumbbell className="w-3 h-3 text-[#FF3377]" />
          <span>Sin mancuernas pesadas</span>
        </button>

        <button
          onClick={() => {
            uiAudio.play('select');
            handleSendMessage('¿Qué cena rápida y alta en proteína me sugieres para hoy?');
          }}
          className="flex-shrink-0 px-2.5 py-1 bg-white hover:bg-[#FFE600] border-1.5 border-[#2B0B2E] text-[11px] font-bold text-[#2B0B2E] rounded-full shadow-[1.5px_1.5px_0_#2B0B2E] transition-all cursor-pointer flex items-center gap-1"
        >
          <Utensils className="w-3 h-3 text-[#00A859]" />
          <span>Sugerencia de cena proteica</span>
        </button>

        <button
          onClick={() => {
            uiAudio.play('select');
            handleSendMessage('Siento una leve molestia en la rodilla al hacer la búlgara');
          }}
          className="flex-shrink-0 px-2.5 py-1 bg-white hover:bg-[#FFE600] border-1.5 border-[#2B0B2E] text-[11px] font-bold text-[#2B0B2E] rounded-full shadow-[1.5px_1.5px_0_#2B0B2E] transition-all cursor-pointer flex items-center gap-1"
        >
          <ShieldAlert className="w-3 h-3 text-[#FF3377]" />
          <span>Molestia en rodilla</span>
        </button>
      </div>

      {/* Input controls */}
      <div className="pt-2 border-t-2 border-[#2B0B2E]/15 flex items-center gap-2">
        <button
          onClick={handleVoiceRecord}
          className={`w-10 h-10 rounded-xl border-2 border-[#2B0B2E] flex items-center justify-center transition-all cursor-pointer ${
            isRecording
              ? 'bg-[#FF3377] text-white animate-pulse shadow-[2px_2px_0_#2B0B2E]'
              : 'bg-white hover:bg-[#FFE600] text-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]'
          }`}
          title="Grabar mensaje de voz"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={isRecording ? 'Grabando tu consulta...' : 'Pregunta sobre ejercicios, cargas o nutrición...'}
          className="flex-1 bg-white border-2 border-[#2B0B2E] focus:border-[#FF3377] text-[#2B0B2E] placeholder:text-[#6C586B]/60 px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none shadow-[2px_2px_0_#2B0B2E]"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim()}
          className="w-10 h-10 rounded-xl bg-[#2B0B2E] disabled:opacity-50 text-[#FFE600] flex items-center justify-center shadow-[2px_2px_0_#FF3377] hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
