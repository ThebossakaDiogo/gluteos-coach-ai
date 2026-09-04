import React, { useState } from 'react';
import { UserSession } from '../types';
import { UpsellPage } from '../components/UpsellPage';
import { saveUserSessionToBackend, loadUserSessionFromBackend } from '../utils/mockBackendService';
import { useGeoTime } from '../utils/useGeoTime';

export function UpsellApp() {
  const geoTime = useGeoTime();

  const [userSession, setUserSession] = useState<UserSession>(() => {
    const existing = loadUserSessionFromBackend();
    if (existing) return existing;
    return {
      email: 'alumna.vip@gluteos28.com',
      name: 'Camila Silva',
      plan: 'Desafío Glúteos 28 Días · Acceso Vitalicio',
      purchasedAt: 'Hoy',
      isVerified: true,
      ip: '187.19.120.45',
      hasUpsell: false,
      savedVia: 'Cookie + IP Backend',
    };
  });

  const handleAcceptUpsell = (updated: UserSession) => {
    setUserSession(updated);
    saveUserSessionToBackend(updated, geoTime.ip);
    setTimeout(() => {
      window.location.href = '/#inicio';
    }, 1600);
  };

  const handleDeclineUpsell = () => {
    window.location.href = '/#acesso';
  };

  const handleGoToApp = () => {
    window.location.href = '/#inicio';
  };

  return (
    <UpsellPage
      userSession={userSession}
      onAcceptUpsell={handleAcceptUpsell}
      onDeclineUpsell={handleDeclineUpsell}
      onGoToApp={handleGoToApp}
    />
  );
}
