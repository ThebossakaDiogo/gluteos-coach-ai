import React, { useState } from 'react';
import { AppSlug, ROUTES, RouteMeta } from '../utils/router';
import { uiAudio } from '../utils/audioEngine';
import {
  Link2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  Flame,
  KeyRound,
  Home,
  Dumbbell,
  Utensils,
  Sparkles,
  TrendingUp,
  HelpCircle,
  BookOpen,
  Smartphone,
  Layers,
} from 'lucide-react';

interface SlugBarProps {
  currentSlug: AppSlug;
  onNavigateSlug: (slug: AppSlug) => void;
}

export function SlugBar({ currentSlug, onNavigateSlug }: SlugBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUpsell = currentSlug === '/upsell';
  const currentMeta = ROUTES[currentSlug] || ROUTES['/inicio'];

  const handleSelect = (slug: AppSlug) => {
    uiAudio.play('select');
    onNavigateSlug(slug);
    setIsOpen(false);
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    uiAudio.play('success');
    const fullUrl = `${window.location.origin}${currentSlug}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // ignore
      });
  };

  const getIcon = (slug: AppSlug) => {
    switch (slug) {
      case '/upsell':
        return <Flame className="w-3.5 h-3.5 text-[#FF3377] fill-[#FF3377]" />;
      case '/acesso':
        return <KeyRound className="w-3.5 h-3.5 text-[#00A859]" />;
      case '/inicio':
        return <Home className="w-3.5 h-3.5 text-[#2B0B2E]" />;
      case '/entrenar':
        return <Dumbbell className="w-3.5 h-3.5 text-[#FF3377]" />;
      case '/comidas':
        return <Utensils className="w-3.5 h-3.5 text-[#00A859]" />;
      case '/coach-ai':
        return <Sparkles className="w-3.5 h-3.5 text-[#9D1CBB]" />;
      case '/progreso':
        return <TrendingUp className="w-3.5 h-3.5 text-[#2B0B2E]" />;
      case '/quiz':
        return <HelpCircle className="w-3.5 h-3.5 text-[#FF3377]" />;
      case '/receitas':
        return <BookOpen className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />;
    }
  };

  return (
    <div className="w-full bg-[#2B0B2E] text-white border-b-2.5 border-[#FFE600] text-xs font-bold px-3 py-2 shadow-[0_4px_12px_rgba(43,11,46,0.3)] z-50 relative transition-all">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        {/* Top Tier: Clean Dual-Mode Separation: Upsell Page vs Member Area App */}
        <div className="flex items-center justify-between gap-2">
          {/* Main Mode Segmented Control */}
          <div className="flex items-center gap-1.5 bg-[#3E1343] p-1 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => handleSelect('/upsell')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                isUpsell
                  ? 'bg-[#FF3377] text-white shadow-[2px_2px_0_#FFE600] border border-[#FFE600]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current text-[#FFE600]" />
              <span>⚡ Página de Upsell</span>
              <span className="text-[9px] bg-[#FFE600] text-[#2B0B2E] px-1.5 py-0.2 rounded font-black border border-[#2B0B2E] hidden sm:inline">
                OFERTA OTO
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('/inicio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                !isUpsell
                  ? 'bg-[#FFE600] text-[#2B0B2E] shadow-[2px_2px_0_#FF3377] border border-[#2B0B2E]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Aplicación de la Alumna</span>
              <span className="text-[9px] bg-[#00A859] text-white px-1.5 py-0.2 rounded font-black border border-white/20 hidden sm:inline">
                ÁREA MIEMBROS
              </span>
            </button>
          </div>

          {/* Quick Copy Link */}
          <button
            type="button"
            onClick={handleCopyUrl}
            className="flex items-center gap-1 text-[11px] font-black bg-white/10 hover:bg-[#A7FF00] hover:text-[#2B0B2E] text-white border border-white/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex-shrink-0"
            title="Copiar URL completa de este enlace"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00A859] stroke-[3]" />
                <span className="text-[#00A859]">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar URL</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Tier: Current Active Route Indicator & Fast Sub-routing */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px]">
          <div
            onClick={() => {
              uiAudio.play('click');
              setIsOpen(!isOpen);
            }}
            className="flex items-center gap-1.5 bg-black/20 hover:bg-white/10 px-2.5 py-1 rounded-md cursor-pointer transition-all border border-white/10"
          >
            <span className="text-white/60 uppercase font-black text-[9px]">Ruta Activa:</span>
            <span className="font-mono font-black text-[#FFE600]">{currentSlug}</span>
            <span className="text-white/80 hidden sm:inline">({currentMeta.label})</span>
            {isOpen ? <ChevronUp className="w-3 h-3 text-[#FFE600]" /> : <ChevronDown className="w-3 h-3 text-[#FFE600]" />}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {isUpsell ? (
              <span className="text-[10px] text-[#A7FF00] font-black flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                Página 100% Independiente de Upsell
              </span>
            ) : (
              (['/inicio', '/entrenar', '/comidas', '/coach-ai', '/progreso'] as AppSlug[]).map((slug) => {
                const isActive = currentSlug === slug;
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => handleSelect(slug)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                      isActive
                        ? 'bg-[#FFE600] text-[#2B0B2E] border-[#FFE600]'
                        : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'
                    }`}
                  >
                    <span>{slug}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Expanded Slug Menu Modal / Drawer */}
        {isOpen && (
          <div className="pt-2 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-1.5 screen-enter">
            {(Object.keys(ROUTES) as AppSlug[]).map((slug) => {
              const meta = ROUTES[slug];
              const isActive = currentSlug === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => handleSelect(slug)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                    isActive
                      ? 'bg-[#FFE600] text-[#2B0B2E] border-[#FFE600] shadow-[2px_2px_0_#FF3377]'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {getIcon(slug)}
                      <span className="font-mono font-black text-xs">{slug}</span>
                    </div>
                    {meta.badge && (
                      <span className="text-[9px] font-black bg-[#FF3377] text-white px-1.5 py-0.2 rounded-full">
                        {meta.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold truncate ${isActive ? 'text-[#2B0B2E]' : 'text-white/70'}`}>
                    {meta.label} · {meta.type}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
