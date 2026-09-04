import React, { useState, useRef } from 'react';
import { UserSession } from '../types';
import { uiAudio } from '../utils/audioEngine';
import { processImageFile } from '../utils/imageUtils';
import { saveUserSessionToBackend } from '../utils/mockBackendService';
import { IMAGES, FALLBACK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import {
  X,
  Scale,
  Ruler,
  Camera,
  UploadCloud,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  ShieldCheck,
  Globe2,
  Cookie,
  Flame,
  Info,
  Trash2,
  Droplets,
  HelpCircle,
  Eye,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface MiniOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession | null;
  onSaveSession: (updatedSession: UserSession) => void;
}

export function MiniOnboardingModal({
  isOpen,
  onClose,
  userSession,
  onSaveSession,
}: MiniOnboardingModalProps) {
  // Step state: 1 = Medidas & Biometría, 2 = Foto Comparativa 28D, 3 = Perfil & Credencial VIP
  const [step, setStep] = useState<number>(1);

  // Form state
  const [weight, setWeight] = useState<number>(userSession?.weight || 62.0);
  const [height, setHeight] = useState<number>(userSession?.height || 165);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(userSession?.initialPhotoUrl || null);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(userSession?.avatarUrl || null);
  const [name, setName] = useState<string>(userSession?.name || 'Alumna VIP');

  // Drag & drop state for evolution photo
  const [isDraggingEvolution, setIsDraggingEvolution] = useState(false);
  const evolutionFileInputRef = useRef<HTMLInputElement | null>(null);

  // Drag & drop state for avatar photo
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  // Loading / processing states
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculated values
  const bmiNum = height > 0 ? weight / Math.pow(height / 100, 2) : 22.0;
  const bmi = bmiNum.toFixed(1);
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Peso Bajo', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    if (val <= 24.9) return { label: 'Rango Saludable', color: 'text-[#00A859] bg-[#A7FF00]/30 border-[#00A859]' };
    if (val <= 29.9) return { label: 'Tonificación Recomendada', color: 'text-[#FF3377] bg-[#FF3377]/10 border-[#FF3377]' };
    return { label: 'Recomposición Activa', color: 'text-purple-700 bg-purple-100 border-purple-300' };
  };
  const bmiCat = getBmiCategory(bmiNum);

  const estimatedProtein = Math.round(weight * 1.8);
  const estimatedWaterLiters = (weight * 0.035).toFixed(1);

  // Handle file reading for Evolution Photo
  const handleEvolutionFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await processImageFile(file, 800, 1000, 0.75);
      setInitialPhoto(compressedDataUrl);
      uiAudio.play('success');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar la foto.');
      uiAudio.play('alert');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle file reading for Avatar Photo
  const handleAvatarFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await processImageFile(file, 300, 300, 0.8);
      setAvatarPhoto(compressedDataUrl);
      uiAudio.play('success');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar la foto.');
      uiAudio.play('alert');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Drag handlers for Evolution Photo
  const handleEvolutionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingEvolution(true);
  };
  const handleEvolutionDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingEvolution(false);
  };
  const handleEvolutionDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingEvolution(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleEvolutionFile(e.dataTransfer.files[0]);
    }
  };

  // Drag handlers for Avatar Photo
  const handleAvatarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAvatar(true);
  };
  const handleAvatarDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAvatar(false);
  };
  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAvatar(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAvatarFile(e.dataTransfer.files[0]);
    }
  };

  // Save session to Cookie and IP Backend
  const handleFinishOnboarding = () => {
    uiAudio.play('success');
    const updated: UserSession = {
      ...(userSession || {
        email: 'alumna.vip@gluteos28.com',
        plan: 'Desafío Glúteos 28 Días · Vitalicio',
        purchasedAt: 'Hoy',
        isVerified: true,
      }),
      name: name.trim() || 'Alumna VIP',
      weight,
      height,
      initialPhotoUrl: initialPhoto || undefined,
      avatarUrl: avatarPhoto || undefined,
      hasCompletedOnboarding: true,
      ip: userSession?.ip || '187.19.120.45',
      updatedAt: new Date().toISOString(),
    };

    saveUserSessionToBackend(updated, updated.ip);
    onSaveSession(updated);
    onClose();
  };

  const stepsList = [
    { num: 1, label: 'Medidas', icon: Scale },
    { num: 2, label: 'Foto 28D', icon: Camera },
    { num: 3, label: 'Perfil VIP', icon: User },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2B0B2E]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFDF8] border-3 border-[#2B0B2E] w-full max-w-lg rounded-[28px] shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] flex flex-col text-[#2B0B2E] max-h-[94vh] overflow-hidden screen-enter relative">
        
        {/* TOP ACCENT STRIP */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FFE600] via-[#FF3377] to-[#A7FF00] border-b-2 border-[#2B0B2E]" />

        {/* MODAL HEADER */}
        <div className="px-5 pt-4 pb-3 border-b-2 border-[#2B0B2E]/15 flex items-center justify-between bg-[#FFF9E6]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2.5 border-[#2B0B2E] shadow-[2.5px_2.5px_0_#2B0B2E] flex items-center justify-center font-display font-black text-sm">
              <Sparkles className="w-5 h-5 text-[#FF3377]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg text-[#2B0B2E] tracking-tight leading-none">
                  Ficha de Alumna · 28 Días
                </h1>
                <span className="bg-[#A7FF00] text-[#2B0B2E] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#2B0B2E]">
                  VIP
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#6C586B] mt-0.5">
                Calibra tu punto de partida antes de iniciar la Semana 1
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              uiAudio.play('click');
              onClose();
            }}
            className="w-8 h-8 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] flex items-center justify-center font-black transition-colors cursor-pointer shadow-[2px_2px_0_#2B0B2E] active:translate-x-0.5 active:translate-y-0.5"
            title="Cerrar modal"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* STEPPER PROGRESS TABS */}
        <div className="px-5 py-2.5 bg-[#FFF9E6]/30 border-b-2 border-[#2B0B2E]/10">
          <div className="grid grid-cols-3 gap-2">
            {stepsList.map((s) => {
              const IconComp = s.icon;
              const isActive = step === s.num;
              const isPast = step > s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    uiAudio.play('click');
                    setStep(s.num);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                    isActive
                      ? 'bg-[#FFE600] text-[#2B0B2E] border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]'
                      : isPast
                      ? 'bg-[#A7FF00]/40 text-[#2B0B2E] border-[#2B0B2E]/40 hover:bg-[#A7FF00]'
                      : 'bg-white text-[#6C586B] border-transparent hover:bg-white hover:border-[#2B0B2E]/20'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
                      isActive
                        ? 'bg-[#2B0B2E] text-white'
                        : isPast
                        ? 'bg-[#00A859] text-white'
                        : 'bg-[#2B0B2E]/10 text-[#2B0B2E]'
                    }`}
                  >
                    {isPast ? '✓' : s.num}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMessage && (
          <div className="mx-5 mt-3 p-2.5 bg-red-50 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">

          {/* ================= STEP 1: MEDIDAS ================= */}
          {step === 1 && (
            <div className="flex flex-col gap-4 screen-enter">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black uppercase text-[#FF3377] tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  Calibración Antropométrica
                </span>
                <h2 className="font-display font-black text-2xl text-[#2B0B2E] leading-tight">
                  ¿Cuáles son tus medidas iniciales?
                </h2>
                <p className="text-xs text-[#6C586B] leading-relaxed">
                  Usaremos tus valores para personalizar tu meta proteica diaria, hidratación y calcular tu cambio físico de 28 días.
                </p>
              </div>

              {/* DUAL DIAL / MEASUREMENT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* PESO INICIAL */}
                <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#6C586B] flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#FF3377]" />
                      Peso Inicial
                    </span>
                    <span className="text-[10px] font-black bg-[#FFE600] px-2 py-0.5 rounded-full border border-[#2B0B2E]">
                      Día 1
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center gap-1 py-1">
                    <span className="font-display font-black text-4xl text-[#2B0B2E] tracking-tight">
                      {weight.toFixed(1)}
                    </span>
                    <span className="font-bold text-sm text-[#6C586B]">kg</span>
                  </div>

                  {/* Increment / Decrement Steppers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setWeight((w) => Math.max(35, parseFloat((w - 1.0).toFixed(1))));
                      }}
                      className="flex-1 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-[#FFF9E6] hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      -1kg
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setWeight((w) => Math.max(35, parseFloat((w - 0.5).toFixed(1))));
                      }}
                      className="w-9 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setWeight((w) => Math.min(180, parseFloat((w + 0.5).toFixed(1))));
                      }}
                      className="w-9 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setWeight((w) => Math.min(180, parseFloat((w + 1.0).toFixed(1))));
                      }}
                      className="flex-1 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-[#FFF9E6] hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      +1kg
                    </button>
                  </div>
                </div>

                {/* ESTATURA */}
                <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#6C586B] flex items-center gap-1.5">
                      <Ruler className="w-4 h-4 text-[#00A859]" />
                      Estatura
                    </span>
                    <span className="text-[10px] font-black bg-[#A7FF00] px-2 py-0.5 rounded-full border border-[#2B0B2E]">
                      cm
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center gap-1 py-1">
                    <span className="font-display font-black text-4xl text-[#2B0B2E] tracking-tight">
                      {height}
                    </span>
                    <span className="font-bold text-sm text-[#6C586B]">cm</span>
                  </div>

                  {/* Increment / Decrement Steppers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setHeight((h) => Math.max(120, h - 5));
                      }}
                      className="flex-1 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-[#FFF9E6] hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      -5cm
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setHeight((h) => Math.max(120, h - 1));
                      }}
                      className="w-9 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setHeight((h) => Math.min(220, h + 1));
                      }}
                      className="w-9 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-white hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        uiAudio.play('click');
                        setHeight((h) => Math.min(220, h + 5));
                      }}
                      className="flex-1 py-1.5 rounded-xl border-2 border-[#2B0B2E] bg-[#FFF9E6] hover:bg-[#FFE600] font-black text-xs transition-colors shadow-[1.5px_1.5px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                    >
                      +5cm
                    </button>
                  </div>
                </div>
              </div>

              {/* BIOMETRIC SUMMARY / SMART PILLS */}
              <div className="bg-[#FFF9E6] border-2 border-[#2B0B2E] rounded-2xl p-3.5 shadow-[2px_2px_0_#2B0B2E] flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#2B0B2E] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF3377]" />
                    Calibración Automática del Desafío
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${bmiCat.color}`}>
                    IMC {bmi} · {bmiCat.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2B0B2E]/10">
                  <div className="bg-white p-2.5 rounded-xl border border-[#2B0B2E]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#FF3377]" />
                      <span className="text-[11px] font-bold text-[#6C586B]">Meta Proteica:</span>
                    </div>
                    <span className="font-mono font-black text-xs text-[#2B0B2E]">
                      ~{estimatedProtein}g / día
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#2B0B2E]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-[#00A859]" />
                      <span className="text-[11px] font-bold text-[#6C586B]">Agua Sugerida:</span>
                    </div>
                    <span className="font-mono font-black text-xs text-[#2B0B2E]">
                      ~{estimatedWaterLiters} L / día
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: FOTO 28D ================= */}
          {step === 2 && (
            <div className="flex flex-col gap-4 screen-enter">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#00A859] tracking-wider flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    Comparador de Resultados
                  </span>
                  <span className="text-[10px] font-black bg-[#FFE600] text-[#2B0B2E] px-2 py-0.5 rounded-full border border-[#2B0B2E]">
                    Opcional
                  </span>
                </div>
                <h2 className="font-display font-black text-2xl text-[#2B0B2E] leading-tight">
                  Tu Foto de Partida (Día 1)
                </h2>
                <p className="text-xs text-[#6C586B] leading-relaxed">
                  Toma o sube una foto de cuerpo o perfil de pie. Al completar los 28 días verás tu transformación lado a lado.
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={evolutionFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleEvolutionFile(e.target.files[0]);
                  }
                }}
              />

              {/* DRAG & DROP PHOTO CONTAINER */}
              <div
                onDragOver={handleEvolutionDragOver}
                onDragLeave={handleEvolutionDragLeave}
                onDrop={handleEvolutionDrop}
                onClick={() => {
                  if (!initialPhoto) {
                    evolutionFileInputRef.current?.click();
                  }
                }}
                className={`relative rounded-2xl border-3 border-dashed transition-all p-5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] ${
                  isDraggingEvolution
                    ? 'border-[#FF3377] bg-[#FF3377]/10 scale-[1.01]'
                    : initialPhoto
                    ? 'border-[#00A859] bg-white'
                    : 'border-[#2B0B2E]/40 bg-white hover:border-[#FF3377] hover:bg-[#FFF9E6]'
                }`}
              >
                {initialPhoto ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="relative w-full max-h-56 overflow-hidden rounded-xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E]">
                      <img
                        src={initialPhoto}
                        alt="Foto Día 1"
                        className="w-full h-56 object-cover object-center"
                      />
                      <span className="absolute top-2 left-2 bg-[#2B0B2E] text-[#FFE600] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#FFE600] shadow-[1px_1px_0_#2B0B2E] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#A7FF00]" />
                        Día 1 · Punto Cero
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          evolutionFileInputRef.current?.click();
                        }}
                        className="flex-1 py-2 bg-[#FFF9E6] hover:bg-[#FFE600] border-2 border-[#2B0B2E] rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0_#2B0B2E] cursor-pointer active:translate-y-0.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#FF3377]" />
                        <span>Cambiar Foto</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInitialPhoto(null);
                          uiAudio.play('click');
                        }}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-400 rounded-xl cursor-pointer shadow-[2px_2px_0_#2B0B2E] active:translate-y-0.5"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 py-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-2.5 border-[#2B0B2E] flex items-center justify-center shadow-[3px_3px_0_#2B0B2E]">
                      <UploadCloud className="w-8 h-8 text-[#2B0B2E]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-display font-black text-base text-[#2B0B2E]">
                        Arrastra tu foto aquí o haz clic para subir
                      </span>
                      <span className="text-xs text-[#6C586B] font-medium max-w-xs mx-auto">
                        Cuerpo entero o perfil con ropa deportiva cómoda (JPG, PNG o WEBP)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* TIPS FOR A GREAT BEFORE PHOTO */}
              <div className="bg-[#FFF9E6] border-2 border-[#2B0B2E] rounded-2xl p-3 shadow-[2px_2px_0_#2B0B2E] flex flex-col gap-1.5 text-xs text-[#2B0B2E]">
                <span className="font-black flex items-center gap-1.5 text-[#6C586B] uppercase text-[10px] tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A859]" />
                  Recomendaciones para el Día 1
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#6C586B]">
                  <div>✓ Misma ropa que usarás en el Día 28</div>
                  <div>✓ Buena iluminación natural frontal</div>
                  <div>✓ Postura erguida y relajada</div>
                  <div>✓ 100% privada en tu navegador e IP</div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PERFIL & CREDENCIAL ================= */}
          {step === 3 && (
            <div className="flex flex-col gap-4 screen-enter">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black uppercase text-[#FFE600] bg-[#2B0B2E] px-2 py-0.5 rounded-md w-fit font-mono tracking-wider">
                  PASO FINAL
                </span>
                <h2 className="font-display font-black text-2xl text-[#2B0B2E] leading-tight">
                  Tu Perfil & Ficha VIP
                </h2>
                <p className="text-xs text-[#6C586B] leading-relaxed">
                  Personaliza tu nombre y avatar. Se sincronizarán automáticamente con tu IP y Cookies para que tu acceso nunca se pierda.
                </p>
              </div>

              {/* Hidden avatar file input */}
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAvatarFile(e.target.files[0]);
                  }
                }}
              />

              {/* VIP ATHLETE CREDENTIAL CARD */}
              <div className="bg-[#FFF9E6] border-2.5 border-[#2B0B2E] rounded-2xl p-4 shadow-[4px_4px_0_#2B0B2E] flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A859] animate-pulse" />
                    <span className="font-mono font-black text-[11px] uppercase tracking-wider text-[#2B0B2E]">
                      MEMBERSHIP · GLÚTEOS 28D
                    </span>
                  </div>
                  <span className="text-[10px] font-black bg-[#FFE600] px-2 py-0.5 rounded border border-[#2B0B2E]">
                    ACTIVO
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Avatar Upload Drop Zone */}
                  <div
                    onDragOver={handleAvatarDragOver}
                    onDragLeave={handleAvatarDragLeave}
                    onDrop={handleAvatarDrop}
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="relative group cursor-pointer flex-shrink-0"
                    title="Haz clic o arrastra para cambiar avatar"
                  >
                    <div className="w-20 h-20 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] overflow-hidden bg-[#FFE600] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {avatarPhoto ? (
                        <img
                          src={avatarPhoto}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageWithFallback
                          src={IMAGES.profile}
                          fallbackSrc={FALLBACK_IMAGES.profile}
                          alt="Avatar Alumna"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-[#FF3377] text-white border-2 border-[#2B0B2E] flex items-center justify-center shadow-[1.5px_1.5px_0_#2B0B2E] group-hover:scale-110 transition-transform">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Name Input */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#6C586B] flex items-center justify-between">
                      <span>Nombre de la Alumna:</span>
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="text-[10px] text-[#FF3377] font-black hover:underline cursor-pointer"
                      >
                        Subir foto
                      </button>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Camila Silva"
                      className="w-full bg-white border-2 border-[#2B0B2E] px-3 py-2 rounded-xl text-sm font-black text-[#2B0B2E] focus:outline-none focus:border-[#FF3377] shadow-[2px_2px_0_#2B0B2E]"
                    />
                  </div>
                </div>

                {/* Grid summary of entered metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2B0B2E]/10 text-center">
                  <div className="bg-white p-2 rounded-xl border border-[#2B0B2E]/20">
                    <span className="text-[10px] font-bold text-[#6C586B] block">Peso</span>
                    <span className="font-mono font-black text-xs text-[#2B0B2E]">{weight.toFixed(1)} kg</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#2B0B2E]/20">
                    <span className="text-[10px] font-bold text-[#6C586B] block">Estatura</span>
                    <span className="font-mono font-black text-xs text-[#2B0B2E]">{height} cm</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#2B0B2E]/20">
                    <span className="text-[10px] font-bold text-[#6C586B] block">Foto Día 1</span>
                    <span className={`text-xs font-black ${initialPhoto ? 'text-[#00A859]' : 'text-[#6C586B]'}`}>
                      {initialPhoto ? 'Lista ✓' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* IP & COOKIE GUARANTEE BADGE */}
              <div className="flex items-center justify-between text-[11px] font-bold text-[#6C586B] px-1">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#FF3377]" />
                  IP vinculada: <strong className="text-[#2B0B2E]">{userSession?.ip || '187.19.120.45'}</strong>
                </span>
                <span className="flex items-center gap-1 text-[#00A859]">
                  <Cookie className="w-3.5 h-3.5 text-[#00A859]" />
                  Respaldo Permanente Activo
                </span>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-4 sm:px-5 sm:py-3.5 bg-[#FFF9E6] border-t-2 border-[#2B0B2E]/15 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                uiAudio.play('back');
                setStep(step - 1);
              }}
              className="py-2.5 px-3.5 bg-white hover:bg-[#FFF9E6] border-2 border-[#2B0B2E] rounded-xl text-xs font-black shadow-[2px_2px_0_#2B0B2E] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                uiAudio.play('click');
                onClose();
              }}
              className="py-2.5 px-3.5 bg-white hover:bg-[#FFF9E6] border-2 border-[#2B0B2E] rounded-xl text-xs font-black shadow-[2px_2px_0_#2B0B2E] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all text-[#6C586B]"
            >
              <span>Omitir por ahora</span>
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                uiAudio.play('click');
                setStep(step + 1);
              }}
              className="cta-button flex-1 justify-center cursor-pointer shadow-[3px_3px_0_#2B0B2E]"
            >
              <span>{step === 1 ? 'Siguiente: Foto Corporal' : 'Siguiente: Perfil VIP'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
              <span className="button-sheen" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="cta-button flex-1 justify-center cursor-pointer bg-[#A7FF00] hover:bg-[#FFE600] text-[#2B0B2E] border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Ficha y Comenzar</span>
              <span className="button-sheen" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
