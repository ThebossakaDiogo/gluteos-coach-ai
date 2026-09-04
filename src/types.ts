export type TabType = 'inicio' | 'entrenar' | 'comidas' | 'coach-ai' | 'progreso';

export interface UserSession {
  email: string;
  name: string;
  avatarUrl?: string; // Foto de perfil personalizada en Data URL
  weight?: number; // Peso inicial en kg (ej: 64.5)
  height?: number; // Altura en cm (ej: 165)
  initialPhotoUrl?: string; // Foto corporal Día 1 "Antes" para comparar a los 28 días
  afterPhotoUrl?: string; // Foto corporal Día 28 "Después"
  hasCompletedOnboarding?: boolean; // Si completó el mini onboarding inicial
  plan: string;
  purchasedAt: string;
  isVerified: boolean;
  ip?: string;
  city?: string;
  country?: string;
  hasUpsell?: boolean;
  upsellName?: string;
  upsellPurchasedAt?: string;
  quizAnswers?: Record<string, string>;
  savedVia?: 'Cookie + IP Backend';
  updatedAt?: string;
}

export interface SetLog {
  id: number;
  reps: number;
  weight: number;
  difficulty: 'muy-facil' | 'adecuada' | 'muy-dificil' | 'molestia';
  completed: boolean;
}

export interface MealItem {
  id: string;
  name: string;
  category: string;
  protein: string;
  calories: string;
  description: string;
  imageUrl: string;
  status: 'completed' | 'current' | 'planned';
  timeNote: string;
}

export interface MealsState {
  breakfast: boolean;
  lunch: boolean;
  snack: boolean;
  dinner: boolean;
  supper: boolean;
}

export interface LoggedSet {
  setNumber: number;
  title?: string;
  reps: number;
  weight: number;
  rpe: string | number;
  label?: string;
  completed?: boolean;
}

export interface HabitItem {
  id: string;
  title: string;
  subtitle?: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time: string;
  card?: {
    type: 'exercise_swap';
    title: string;
    tag: string;
    subtitle: string;
    stimulusPercent: number;
    imageUrl: string;
    instructions: string[];
  };
}
