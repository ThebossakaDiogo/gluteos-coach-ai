import React, { useState, useEffect } from 'react';
import { uiAudio } from '../utils/audioEngine';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundControl() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setIsEnabled(uiAudio.enabled);
  }, []);

  const handleToggle = () => {
    const newState = uiAudio.toggle();
    setIsEnabled(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`sound-control ${isEnabled ? 'is-enabled' : ''}`}
      aria-label="Controle de Som Neo-Pop"
      title={isEnabled ? 'Desativar sons interativos' : 'Ativar sons interativos'}
    >
      {isEnabled ? (
        <Volume2 className="w-3.5 h-3.5 text-[#2B0B2E]" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-[#6C586B]" />
      )}
      <span>{isEnabled ? 'Som: On' : 'Som: Off'}</span>
      <i />
    </button>
  );
}
