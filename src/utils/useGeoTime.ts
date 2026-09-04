import { useState, useEffect, useCallback } from 'react';

export interface GeoLocationInfo {
  city: string;
  country: string;
  countryCode?: string;
  timezone: string;
  ip?: string;
  detectedVia: 'IP' | 'Navegador';
  isIpDetected: boolean;
}

export interface GeoTimeData extends GeoLocationInfo {
  currentTime: Date;
  currentHour: number;
  formattedTime: string; // e.g., "14:25"
  formattedDate: string; // e.g., "Jueves, 3 de septiembre"
  greeting: string; // "¡Buenos días!" | "¡Buenas tardes!" | "¡Buenas noches!"
  timeOfDay: 'mañana' | 'tarde' | 'noche';
  activeMealKey: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper';
  activeMealLabel: string;
  activeMealTargetTime: string;
  mealRecommendation: string;
  workoutRecommendation: string;
  refresh: () => void;
}

// Fallback extraction of city name from IANA timezone like "America/Mexico_City" -> "Ciudad de México"
function extractCityFromTz(tz: string): { city: string; country: string } {
  const parts = tz.split('/');
  const rawCity = (parts[parts.length - 1] || 'Tu Ciudad').replace(/_/g, ' ');
  
  // Clean translation map for common Spanish-speaking & international timezones
  const cityMap: Record<string, { city: string; country: string }> = {
    'Mexico City': { city: 'Ciudad de México', country: 'México' },
    'Bogota': { city: 'Bogotá', country: 'Colombia' },
    'Madrid': { city: 'Madrid', country: 'España' },
    'Buenos Aires': { city: 'Buenos Aires', country: 'Argentina' },
    'Santiago': { city: 'Santiago', country: 'Chile' },
    'Lima': { city: 'Lima', country: 'Perú' },
    'Caracas': { city: 'Caracas', country: 'Venezuela' },
    'Guatemala': { city: 'Ciudad de Guatemala', country: 'Guatemala' },
    'Quito': { city: 'Quito', country: 'Ecuador' },
    'Montevideo': { city: 'Montevideo', country: 'Uruguay' },
    'Asuncion': { city: 'Asunción', country: 'Paraguay' },
    'Santo Domingo': { city: 'Santo Domingo', country: 'República Dominicana' },
    'San Juan': { city: 'San Juan', country: 'Puerto Rico' },
    'Panama': { city: 'Ciudad de Panamá', country: 'Panamá' },
    'San Jose': { city: 'San José', country: 'Costa Rica' },
    'Tegucigalpa': { city: 'Tegucigalpa', country: 'Honduras' },
    'El Salvador': { city: 'San Salvador', country: 'El Salvador' },
    'Managua': { city: 'Managua', country: 'Nicaragua' },
    'Sao Paulo': { city: 'São Paulo', country: 'Brasil' },
    'New York': { city: 'Nueva York', country: 'Estados Unidos' },
    'Los Angeles': { city: 'Los Ángeles', country: 'Estados Unidos' },
    'Miami': { city: 'Miami', country: 'Estados Unidos' },
  };

  if (cityMap[rawCity]) {
    return cityMap[rawCity];
  }

  return {
    city: rawCity,
    country: parts[0] ? parts[0].replace(/_/g, ' ') : 'Local',
  };
}

export function useGeoTime(): GeoTimeData {
  const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Mexico_City';
  const defaultCityInfo = extractCityFromTz(defaultTz);

  const [geoInfo, setGeoInfo] = useState<GeoLocationInfo>(() => {
    // Check local storage cache (valid for 2 hours)
    try {
      const cached = localStorage.getItem('coach_gluteos_geotime');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Date.now() - parsed.timestamp < 2 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch {
      // ignore
    }
    return {
      city: defaultCityInfo.city,
      country: defaultCityInfo.country,
      timezone: defaultTz,
      detectedVia: 'Navegador',
      isIpDetected: false,
    };
  });

  const [now, setNow] = useState<Date>(new Date());

  // Detect location and timezone via IP API
  const detectIpLocation = useCallback(async () => {
    try {
      // First attempt: ipapi.co
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.timezone) {
          const newInfo: GeoLocationInfo = {
            city: data.city || defaultCityInfo.city,
            country: data.country_name || defaultCityInfo.country,
            countryCode: data.country_code,
            timezone: data.timezone,
            ip: data.ip,
            detectedVia: 'IP',
            isIpDetected: true,
          };
          setGeoInfo(newInfo);
          try {
            localStorage.setItem(
              'coach_gluteos_geotime',
              JSON.stringify({ timestamp: Date.now(), data: newInfo })
            );
          } catch {
            // ignore
          }
          return;
        }
      }
    } catch {
      // Second fallback attempt: freeipapi.com
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 3000);
        const res2 = await fetch('https://freeipapi.com/api/json', {
          signal: controller2.signal,
        });
        clearTimeout(timeoutId2);

        if (res2.ok) {
          const data2 = await res2.json();
          if (data2 && data2.timeZones && data2.timeZones[0]) {
            const tz = data2.timeZones[0];
            const newInfo: GeoLocationInfo = {
              city: data2.cityName || defaultCityInfo.city,
              country: data2.countryName || defaultCityInfo.country,
              countryCode: data2.countryCode,
              timezone: tz,
              ip: data2.ipAddress,
              detectedVia: 'IP',
              isIpDetected: true,
            };
            setGeoInfo(newInfo);
            try {
              localStorage.setItem(
                'coach_gluteos_geotime',
                JSON.stringify({ timestamp: Date.now(), data: newInfo })
              );
            } catch {
              // ignore
            }
            return;
          }
        }
      } catch {
        // Fallback to browser's exact timezone
      }
    }
  }, [defaultCityInfo.city, defaultCityInfo.country]);

  useEffect(() => {
    detectIpLocation();
  }, [detectIpLocation]);

  // Keep live time ticking every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute local hour in the user's detected timezone
  let currentHour = now.getHours();
  try {
    const hourFormatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: geoInfo.timezone,
      hour: 'numeric',
      hourCycle: 'h23',
    });
    const parsedHour = parseInt(hourFormatter.format(now), 10);
    if (!isNaN(parsedHour)) {
      currentHour = parsedHour;
    }
  } catch {
    // fallback to local device hour
  }

  // Format time in Spanish (e.g. "14:35")
  let formattedTime = '';
  try {
    formattedTime = new Intl.DateTimeFormat('es-ES', {
      timeZone: geoInfo.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now);
  } catch {
    const h = String(currentHour).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    formattedTime = `${h}:${m}`;
  }

  // Format date in Spanish (e.g. "Jueves, 3 de septiembre")
  let formattedDate = '';
  try {
    const dateFormatted = new Intl.DateTimeFormat('es-ES', {
      timeZone: geoInfo.timezone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(now);
    // Capitalize first letter (e.g. "jueves" -> "Jueves")
    formattedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
  } catch {
    formattedDate = 'Hoy';
  }

  // Determine greeting based on local hour
  let greeting = '¡Hola, Camila! ✨';
  let timeOfDay: 'mañana' | 'tarde' | 'noche' = 'mañana';

  if (currentHour >= 5 && currentHour < 12) {
    greeting = '¡Buenos días, Camila! ☀️';
    timeOfDay = 'mañana';
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = '¡Buenas tardes, Camila! ⚡';
    timeOfDay = 'tarde';
  } else {
    greeting = '¡Buenas noches, Camila! 🌙';
    timeOfDay = 'noche';
  }

  // Determine active meal & recommendations based on detected local time
  let activeMealKey: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper' = 'breakfast';
  let activeMealLabel = 'Desayuno';
  let activeMealTargetTime = '08:30';
  let mealRecommendation = '';
  let workoutRecommendation = '';

  if (currentHour < 11 && currentHour >= 5) {
    activeMealKey = 'breakfast';
    activeMealLabel = 'Desayuno Proteico Energético';
    activeMealTargetTime = '08:30';
    mealRecommendation = 'Toma 500ml de agua y 5g de creatina junto a tus huevos revueltos con aguacate (+30g proteína).';
    workoutRecommendation = 'Tu cuerpo despierta: activa la conexión mente-músculo con 2 minutos de activación de glúteo medio antes de entrenar.';
  } else if (currentHour >= 11 && currentHour < 15) {
    activeMealKey = 'lunch';
    activeMealLabel = 'Almuerzo Hipertrófico Principal';
    activeMealTargetTime = '13:00';
    mealRecommendation = 'Momento del plato fuerte: Filete de pollo con arroz integral, frijoles y batata (+38g proteína) para síntesis e hipertrofia de glúteos.';
    workoutRecommendation = 'Niveles óptimos de energía: Tus reservas de glucógeno y temperatura corporal están en el punto más alto del día para mover cargas.';
  } else if (currentHour >= 15 && currentHour < 19) {
    activeMealKey = 'snack';
    activeMealLabel = 'Merienda / Pre-Entrenamiento Glúteos';
    activeMealTargetTime = '16:30';
    mealRecommendation = 'Yogur griego con proteína whey, frutos rojos y chía (+24g proteína). Energía rápida sin pesadez estomacal.';
    workoutRecommendation = 'Pico de fuerza neuromuscular: Momento predilecto para tu sesión de Glúteos A: Tensión Mecánica & Hip Thrust.';
  } else if (currentHour >= 19 && currentHour < 22) {
    activeMealKey = 'dinner';
    activeMealLabel = 'Cena Anabólica Reparadora';
    activeMealTargetTime = '20:00';
    mealRecommendation = 'Tortilla proteica con queso cottage, verduras y patata cocida o pescado a la plancha (+30g proteína). Reparación tisular nocturna.';
    workoutRecommendation = 'Ventana anabólica nocturna: La regeneración muscular y secreción de hormona de crecimiento ocurren mientras duermes.';
  } else {
    activeMealKey = 'supper';
    activeMealLabel = 'Snack Nocturno Anti-Catabólico';
    activeMealTargetTime = '22:30';
    mealRecommendation = 'Mousse de caseína/yogur griego con cacao 100% y nueces (+20g proteína de absorción lenta). Previene el catabolismo muscular durante el sueño.';
    workoutRecommendation = 'Fase de recuperación profunda y liberación de GH (hormona del crecimiento): duerme de 7 a 8 horas para máxima hipertrofia de glúteos.';
  }

  return {
    ...geoInfo,
    currentTime: now,
    currentHour,
    formattedTime,
    formattedDate,
    greeting,
    timeOfDay,
    activeMealKey,
    activeMealLabel,
    activeMealTargetTime,
    mealRecommendation,
    workoutRecommendation,
    refresh: detectIpLocation,
  };
}
