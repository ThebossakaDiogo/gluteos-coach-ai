import React, { useState } from 'react';
import { IMAGES, FALLBACK_IMAGES } from '../data/mockData';
import { ImageWithFallback } from './ImageWithFallback';
import { uiAudio } from '../utils/audioEngine';
import { useGeoTime } from '../utils/useGeoTime';
import { MealsState } from '../types';
import { DETAILED_MEALS, MealPlanConfig, RecipeVariant } from '../data/mealData';
import {
  Utensils,
  Clock,
  Check,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Share2,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Flame,
} from 'lucide-react';

interface ComidasTabProps {
  mealsState?: MealsState;
  onToggleMeal?: (mealKey: keyof MealsState) => void;
  onResetMeals?: () => void;
  currentProtein?: number;
  targetProtein?: number;
  onOpenCookbook?: () => void;
}

export function ComidasTab({
  mealsState = { breakfast: false, lunch: false, snack: false, dinner: false, supper: false },
  onToggleMeal,
  onResetMeals,
  currentProtein = 0,
  targetProtein = 115,
  onOpenCookbook,
}: Readonly<ComidasTabProps>) {
  const geoTime = useGeoTime();
  const [localMeals, setLocalMeals] = useState<MealsState>(mealsState);
  const [activeSwapMeal, setActiveSwapMeal] = useState<MealPlanConfig | null>(null);
  const [expandedMealKey, setExpandedMealKey] = useState<string | null>(null);
  const [selectedGroceryDays, setSelectedGroceryDays] = useState<'3' | '7'>('3');
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected recipe variant per meal (defaults to first variant id)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    breakfast: 'b1',
    lunch: 'l1',
    snack: 's1',
    dinner: 'd1',
    supper: 'c1',
  });

  const activeMeals = onToggleMeal ? mealsState : localMeals;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggle = (key: keyof MealsState, name: string, protGrams: number) => {
    const isNowCompleted = !activeMeals[key];
    if (isNowCompleted) {
      uiAudio.play('success');
      triggerToast(`✓ +${protGrams}g de proteína agregados (${name})`);
    } else {
      uiAudio.play('click');
      triggerToast(`${name} desmarcado.`);
    }

    if (onToggleMeal) {
      onToggleMeal(key);
    } else {
      setLocalMeals((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSelectVariant = (mealKey: string, variant: RecipeVariant) => {
    uiAudio.play('select');
    setSelectedVariants((prev) => ({ ...prev, [mealKey]: variant.id }));
    setActiveSwapMeal(null);
    triggerToast(`Opción actualizada: ${variant.name.slice(0, 30)}...`);
  };

  const toggleExpand = (mealKey: string) => {
    uiAudio.play('click');
    setExpandedMealKey((prev) => (prev === mealKey ? null : mealKey));
  };

  // Helper to get active recipe for a meal
  const getActiveRecipe = (meal: MealPlanConfig): RecipeVariant => {
    const chosenId = selectedVariants[meal.key];
    return meal.options.find((opt) => opt.id === chosenId) || meal.options[0];
  };

  // Protein calculations
  const calculatedProteinFromMeals = DETAILED_MEALS.reduce((sum, meal) => {
    if (activeMeals[meal.key]) {
      const activeRecipe = getActiveRecipe(meal);
      return sum + activeRecipe.protein;
    }
    return sum;
  }, 0);

  const proteinVal = onToggleMeal ? currentProtein : calculatedProteinFromMeals;
  const proteinPercent = Math.min(100, Math.round((proteinVal / targetProtein) * 100));

  const groceryList = {
    '3': [
      {
        cat: 'Proteínas Principales (Almuerzo, Merienda, Cena y Snack)',
        items: [
          '600g Pechuga de pollo limpia sin piel',
          '350g Carne magra de ternera picada',
          '2 botes de Yogur Griego Natural 0% (500g)',
          '1 tarrina de Queso Cottage o Ricota fresca (250g)',
          '12 Huevos camperos frescos',
          '1 lata Atún al natural en agua',
          'Proteína Whey o Caseína (vainilla/fresa)',
        ],
      },
      {
        cat: 'Carbohidratos y Energía Hipertrófica',
        items: [
          '500g Arroz integral o vaporizado',
          '500g Frijoles negros o pintos cocidos',
          '1kg Batata (camote) o Yuca',
          '1 paquete Copos de avena finos',
          '1 Calabaza asada mediana',
          '1 racimo de plátanos maduros',
        ],
      },
      {
        cat: 'Grasas Saludables, Micronutrientes y Snack Nocturno',
        items: [
          '2 Aguacates maduros',
          '1 manojo Espinacas frescas y rúcula',
          '2 cajitas Fresas o frutos rojos',
          '100g Semillas de chía',
          '100g Nueces o frutos secos picados',
          '1 bote Cacao puro 100% y Canela en polvo',
          'Aceite de oliva virgen extra',
        ],
      },
    ],
    '7': [
      {
        cat: 'Proteínas Principales (Semana Completa)',
        items: [
          '1.4kg Filetes de pechuga de pollo',
          '800g Carne magra picada',
          '400g Filete de salmón fresco o tilapia',
          '4 botes de Yogur Griego Natural 0%',
          '2 tarrinas de Queso Cottage fresco',
          '24 a 30 Huevos camperos',
          '3 latas Atún al natural',
          '1 bote Whey Protein / Caseína',
        ],
      },
      {
        cat: 'Carbohidratos y Energía Hipertrófica',
        items: [
          '1kg Arroz integral',
          '1kg Frijoles negros',
          '2kg Batata y Yuca fresca',
          '1 paquete grande de Copos de avena',
          '2 Calabazas medianas',
          '2 docenas de plátanos',
        ],
      },
      {
        cat: 'Grasas Saludables, Micronutrientes y Snack Nocturno',
        items: [
          '5 Aguacates maduros',
          '3 manojos de Espinacas y brócoli frescos',
          '4 cajitas Frutos rojos frescos o congelados',
          '200g Semillas de chía',
          '250g Nueces o mix de frutos secos',
          'Cacao puro 100% y Canela de Ceilán',
          '1 botella Aceite de oliva virgen extra',
        ],
      },
    ],
  };

  const completedCount = [
    activeMeals.breakfast,
    activeMeals.lunch,
    activeMeals.snack,
    activeMeals.dinner,
    activeMeals.supper,
  ].filter(Boolean).length;

  const getMealCardStyle = (isDone: boolean, isCurrent: boolean) => {
    if (isDone) return 'bg-white border-[#00A859] shadow-[3px_3px_0_#00A859]';
    if (isCurrent) return 'bg-white border-[#FF3377] shadow-[4px_4px_0_#FF3377]';
    return 'bg-white border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E]';
  };

  return (
    <div className="flex flex-col gap-5 pb-8 screen-enter font-body text-[#2B0B2E]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 p-3 rounded-xl bg-[#2B0B2E] border-2 border-[#FFE600] text-[#FFE600] text-xs font-black shadow-[4px_4px_0_#FF3377] flex items-center justify-between screen-enter">
          <span>{toastMessage}</span>
          <span className="text-[10px] bg-[#FF3377] text-white px-2 py-0.5 rounded-full">OK</span>
        </div>
      )}

      {/* Header */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="eyebrow-pill self-start">
            Nutrición Adaptativa · Hipertrofia de Glúteos
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B0B2E] tracking-tight mt-1">
            Plan Alimenticio
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {onResetMeals && (
            <button
              onClick={() => {
                uiAudio.play('click');
                onResetMeals();
                triggerToast('¡Todas las comidas se han reiniciado a cero!');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#FFF9E6] text-[#6C586B] hover:text-[#FF3377] text-xs font-bold rounded-full border-1.5 border-[#2B0B2E] shadow-[1.5px_1.5px_0_#2B0B2E] transition-all cursor-pointer"
              title="Reiniciar comidas para empezar de cero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}

          <button
            onClick={() => {
              uiAudio.play('click');
              setShowGroceryModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFE600] hover:bg-[#A7FF00] text-[#2B0B2E] text-xs font-black rounded-full border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#FF3377]" />
            <span>Lista de Compras</span>
          </button>
        </div>
      </section>

      {/* Local Time Banner for Nutrition */}
      <div className="flex items-center justify-between p-2.5 bg-[#FFF9E6] rounded-2xl border-2 border-[#2B0B2E] text-xs shadow-[2px_2px_0_#2B0B2E]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#FF3377]" />
          <span>
            Hora local ({geoTime.city}): <strong className="font-mono">{geoTime.formattedTime}</strong>
          </span>
        </div>
        <span className="text-[10px] font-black bg-[#A7FF00] text-[#2B0B2E] px-2 py-0.5 rounded-full border border-[#2B0B2E]">
          {geoTime.activeMealLabel}
        </span>
      </div>

      {/* Protein Master Card */}
      <section className="neo-card p-5 flex flex-col gap-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center shadow-[2px_2px_0_#FF3377]">
              <Utensils className="w-5 h-5 text-[#2B0B2E]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#6C586B] uppercase tracking-wider block">
                Meta Diaria para Hipertrofia
              </span>
              <h2 className="font-display font-black text-xl text-[#2B0B2E] leading-none">
                {proteinVal}g <span className="text-xs font-normal text-[#6C586B]">/ {targetProtein}g Proteína</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-[#00A859] bg-[#A7FF00]/40 border border-[#2B0B2E] px-2 py-0.5 rounded-lg">
              {proteinPercent}%
            </span>
            <span className="text-[10px] font-bold text-[#6C586B] mt-0.5">
              {proteinVal >= targetProtein ? '¡Meta alcanzada! 🎉' : `Faltan ~${Math.max(0, targetProtein - proteinVal)}g`}
            </span>
          </div>
        </div>

        {/* Dynamic Progress Track */}
        <div className="w-full h-3 bg-[#2B0B2E]/10 rounded-full overflow-hidden p-0.5 border border-[#2B0B2E]">
          <div
            className="h-full bg-gradient-to-r from-[#FFE600] to-[#00A859] rounded-full transition-all duration-500"
            style={{ width: `${proteinPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-[#6C586B]">
          <span>
            {proteinVal >= targetProtein
              ? '🎉 ¡Excelente! Has alcanzado el rango óptimo de hipertrofia.'
              : `Faltan ~${Math.max(0, targetProtein - proteinVal)}g para tu ventana anabólica.`}
          </span>
          <span className="text-[#00A859]">
            {proteinVal >= targetProtein ? '100% Cubierto' : `${100 - proteinPercent}% restante`}
          </span>
        </div>
      </section>

      {/* +50 Protein Recipes Book Banner */}
      {onOpenCookbook && (
        <button
          type="button"
          onClick={() => {
            uiAudio.play('select');
            onOpenCookbook();
          }}
          className="w-full text-left p-3.5 bg-gradient-to-r from-[#2B0B2E] via-[#3E1343] to-[#2B0B2E] rounded-2xl border-2.5 border-[#FFE600] shadow-[3px_3px_0_#2B0B2E] text-white flex items-center justify-between cursor-pointer hover:shadow-[4px_4px_0_#FF3377] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] text-[#2B0B2E] flex items-center justify-center font-black shadow-[2px_2px_0_#FF3377] group-hover:rotate-6 transition-transform flex-shrink-0">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[9px] font-black bg-[#A7FF00] text-[#2B0B2E] px-1.5 py-0.2 rounded uppercase inline-block">
                E-book VIP Incluido
              </span>
              <h4 className="font-display font-black text-sm text-[#FFE600] leading-tight mt-0.5">
                +50 Recetas Anabólicas para Glúteos
              </h4>
              <p className="text-[10px] text-white/80">
                52 recetas con macros calculados y preparación en menos de 15 min
              </p>
            </div>
          </div>
          <div className="bg-[#FFE600] text-[#2B0B2E] text-xs font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1 group-hover:bg-[#A7FF00] transition-colors flex-shrink-0">
            <span>Abrir Libro</span>
          </div>
        </button>
      )}

      {/* Meal Timeline */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-base text-[#2B0B2E] flex items-center gap-2">
            <span>Comidas de tu Día</span>
            <span className="text-[10px] bg-[#FFE600] text-[#2B0B2E] px-2 py-0.5 rounded-full border border-[#2B0B2E] font-black">
              5 Comidas Hipertróficas
            </span>
          </h3>
          <span className="text-xs text-[#6C586B] font-bold">
            {completedCount} de 5 consumidas
          </span>
        </div>

        {/* Render each of the 5 meals in 2-column grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {DETAILED_MEALS.map((meal) => {
          const isDone = Boolean(activeMeals[meal.key]);
          const isCurrent = geoTime.activeMealKey === meal.key;
          const currentRecipe = getActiveRecipe(meal);
          const isExpanded = expandedMealKey === meal.key;

          const imageSrc = IMAGES[meal.imageKey];
          const fallbackSrc = FALLBACK_IMAGES[meal.imageKey];

          return (
            <div
              key={meal.key}
              className={`rounded-2xl border-2.5 transition-all overflow-hidden ${getMealCardStyle(isDone, isCurrent)}`}
            >
              {/* Card Header & Main Specs */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <ImageWithFallback
                      src={imageSrc}
                      fallbackSrc={fallbackSrc}
                      alt={meal.title}
                      className="w-16 h-16 rounded-xl object-cover border-1.5 border-[#2B0B2E] flex-shrink-0"
                    />

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black text-[#6C586B] uppercase tracking-wider">
                          {meal.title} · {meal.timeSlot}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-black bg-[#FFE600] text-[#2B0B2E] px-1.5 py-0.2 rounded border border-[#2B0B2E] animate-pulse">
                            Horario Actual
                          </span>
                        )}
                        <span className="text-[9px] font-bold bg-[#FFF9E6] text-[#FF3377] border border-[#FF3377] px-1.5 py-0.2 rounded">
                          {currentRecipe.tag}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm text-[#2B0B2E] leading-snug mt-0.5 line-clamp-2">
                        {currentRecipe.name}
                      </h4>

                      {/* Macros row */}
                      <div className="flex items-center gap-2 text-xs font-black text-[#2B0B2E] mt-1 flex-wrap">
                        <span className="text-[#00A859] bg-[#00A859]/10 px-1.5 py-0.2 rounded">
                          {currentRecipe.protein}g proteína
                        </span>
                        <span className="text-[#6C586B] font-bold">
                          {currentRecipe.carbs}g carbos · {currentRecipe.fats}g grasas
                        </span>
                        <span className="text-[#FF3377] font-bold">
                          {currentRecipe.calories} kcal
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(meal.key, meal.title, currentRecipe.protein)}
                      className={`px-3 py-1.5 rounded-xl font-display font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#00A859] text-white shadow-[2px_2px_0_#2B0B2E]'
                          : 'bg-[#2B0B2E] text-[#FFE600] shadow-[2px_2px_0_#FF3377] hover:bg-[#FF3377] hover:text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isDone ? 'Listo ✓' : `Consumir (+${currentRecipe.protein}g)`}</span>
                    </button>

                    <button
                      onClick={() => {
                        uiAudio.play('click');
                        setActiveSwapMeal(meal);
                      }}
                      className="text-[11px] font-black text-[#FF3377] bg-[#FFF9E6] border border-[#2B0B2E] px-2 py-0.5 rounded-lg shadow-[1px_1px_0_#2B0B2E] flex items-center gap-1 hover:bg-[#FFE600] transition-colors cursor-pointer"
                      title="Cambiar este plato por otra opción hipertrófica"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Cambiar Opción</span>
                    </button>
                  </div>
                </div>

                {/* Physiology / Goal Pill */}
                <div className="flex items-center justify-between pt-2 border-t border-[#2B0B2E]/10 text-xs">
                  <span className="text-[11px] text-[#6C586B] flex items-center gap-1 font-medium">
                    <Flame className="w-3.5 h-3.5 text-[#FF3377]" />
                    <span><strong>Función en Glúteos:</strong> {meal.physiologyGoal}</span>
                  </span>

                  <button
                    onClick={() => toggleExpand(meal.key)}
                    className="flex items-center gap-1 text-[11px] font-black text-[#2B0B2E] hover:text-[#FF3377] transition-colors cursor-pointer flex-shrink-0 ml-2"
                  >
                    <span>{isExpanded ? 'Ocultar Receta' : 'Ver Receta y Preparación'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Recipe & Ingredients Section */}
              {isExpanded && (
                <div className="bg-[#FFF9E6] p-4 border-t-2 border-[#2B0B2E] flex flex-col gap-3.5 text-xs screen-enter">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2B0B2E]/10">
                    <div className="flex items-center gap-1.5 font-display font-black text-sm text-[#2B0B2E]">
                      <ChefHat className="w-4 h-4 text-[#FF3377]" />
                      <span>Modo de Preparación Rápida ({currentRecipe.prepTime})</span>
                    </div>
                    <span className="text-[10px] font-bold bg-white border border-[#2B0B2E] px-2 py-0.5 rounded-full">
                      Fácil y Práctico
                    </span>
                  </div>

                  {/* Ingredients List */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-black text-[#2B0B2E] uppercase tracking-wider">
                      🛒 Ingredientes y Medidas Exactas:
                    </span>
                    <ul className="flex flex-col gap-1 bg-white p-3 rounded-xl border border-[#2B0B2E]/20 text-[#2B0B2E]">
                      {currentRecipe.ingredients.map((ing) => (
                        <li key={`ing-${ing}`} className="flex items-start gap-2 text-xs">
                          <span className="text-[#00A859] font-black">✓</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step by Step Instructions */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-black text-[#2B0B2E] uppercase tracking-wider">
                      👨‍🍳 Paso a Paso:
                    </span>
                    <div className="flex flex-col gap-2">
                      {currentRecipe.instructions.map((step, idx) => (
                        <div key={`step-${currentRecipe.id}-${idx + 1}`} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#2B0B2E]/15">
                          <span className="w-5 h-5 rounded-full bg-[#FFE600] border border-[#2B0B2E] text-[#2B0B2E] font-black text-[11px] flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-[#2B0B2E] font-medium leading-relaxed">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coach Gold Tip */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#FFE600]/30 to-[#A7FF00]/30 border-2 border-[#2B0B2E] flex items-start gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-[#FF3377] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2B0B2E] block font-black">Consejo de Oro del Coach Glúteos AI:</strong>
                      <span className="text-[#2B0B2E]">{currentRecipe.coachTip}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </section>

      {/* Food Swap Drawer / Modal */}
      {activeSwapMeal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-md rounded-3xl p-5 shadow-[8px_8px_0_#2B0B2E,14px_14px_0_#FF3377] flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto screen-enter text-[#2B0B2E]">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2.5">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#FF3377]" />
                <div>
                  <h3 className="font-display font-black text-base">
                    Sustitutos para {activeSwapMeal.title}
                  </h3>
                  <p className="text-[11px] text-[#6C586B]">
                    Elige la opción que mejor se adapte a tu rutina y despensa hoy
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setActiveSwapMeal(null);
                }}
                className="w-7 h-7 rounded-lg border-2 border-[#2B0B2E] bg-white flex items-center justify-center font-bold cursor-pointer hover:bg-[#FF3377] hover:text-white transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {activeSwapMeal.options.map((variant) => {
                const isSelected = selectedVariants[activeSwapMeal.key] === variant.id;

                return (
                  <button
                    key={variant.id}
                    onClick={() => handleSelectVariant(activeSwapMeal.key, variant)}
                    className={`p-3.5 rounded-2xl border-2 border-[#2B0B2E] text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#FFE600] shadow-[3px_3px_0_#2B0B2E]'
                        : 'bg-white hover:bg-[#FFF9E6] shadow-[2px_2px_0_#2B0B2E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-[#2B0B2E] bg-white text-[#FF3377]">
                        {variant.tag}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#00A859]">
                          {variant.protein}g proteína
                        </span>
                        <span className="text-[10px] text-[#6C586B]">
                          {variant.calories} kcal
                        </span>
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-sm text-[#2B0B2E] leading-snug">
                      {variant.name}
                    </h4>

                    <p className="text-[11px] text-[#6C586B]">
                      {variant.shortDesc}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-[#2B0B2E]/10 text-[10px] font-bold">
                      <span className="flex items-center gap-1 text-[#2B0B2E]">
                        <Clock className="w-3 h-3 text-[#FF3377]" />
                        Preparación: {variant.prepTime}
                      </span>
                      <span className="text-[#2B0B2E]">
                        {isSelected ? '✓ Plato Seleccionado' : 'Haz clic para Elegir'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grocery List Modal */}
      {showGroceryModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-md rounded-3xl p-5 shadow-[8px_8px_0_#2B0B2E,14px_14px_0_#FF3377] flex flex-col gap-4 max-h-[88vh] overflow-y-auto screen-enter text-[#2B0B2E]">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2.5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF3377]" />
                <div>
                  <h3 className="font-display font-black text-lg">Lista de Compras Inteligente</h3>
                  <p className="text-[11px] text-[#6C586B]">Ingredientes para Desayuno, Almuerzo, Merienda, Cena y Snack</p>
                </div>
              </div>
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setShowGroceryModal(false);
                }}
                className="w-7 h-7 rounded-lg border-2 border-[#2B0B2E] bg-white flex items-center justify-center font-bold cursor-pointer hover:bg-[#FF3377] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Days Toggle */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  uiAudio.play('select');
                  setSelectedGroceryDays('3');
                }}
                className={`px-4 py-1.5 rounded-xl font-display font-black text-xs uppercase border-2 border-[#2B0B2E] transition-all cursor-pointer ${
                  selectedGroceryDays === '3'
                    ? 'bg-[#FFE600] text-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]'
                    : 'bg-white text-[#6C586B]'
                }`}
              >
                Plan de 3 Días
              </button>
              <button
                onClick={() => {
                  uiAudio.play('select');
                  setSelectedGroceryDays('7');
                }}
                className={`px-4 py-1.5 rounded-xl font-display font-black text-xs uppercase border-2 border-[#2B0B2E] transition-all cursor-pointer ${
                  selectedGroceryDays === '7'
                    ? 'bg-[#FFE600] text-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]'
                    : 'bg-white text-[#6C586B]'
                }`}
              >
                Plan Semanal (7 Días)
              </button>
            </div>

            {/* List items by Category */}
            <div className="flex flex-col gap-3">
              {groceryList[selectedGroceryDays].map((group) => (
                <div key={`cat-${group.cat}`} className="bg-white p-3.5 rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex flex-col gap-2">
                  <span className="text-[11px] font-black text-[#FF3377] uppercase tracking-wider">
                    {group.cat}
                  </span>
                  <div className="flex flex-col gap-1.5 text-xs">
                    {group.items.map((item) => (
                      <label key={`item-${item}`} className="flex items-center gap-2 cursor-pointer hover:text-[#FF3377]">
                        <input type="checkbox" className="w-4 h-4 rounded accent-[#00A859]" />
                        <span className="text-[#2B0B2E] font-medium">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  uiAudio.play('success');
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(
                      `Lista de Compras Hipertrofia Glúteos (${selectedGroceryDays} días):\n` +
                        groceryList[selectedGroceryDays]
                          .map((g) => `${g.cat}:\n${g.items.join('\n')}`)
                          .join('\n\n')
                    );
                  }
                  triggerToast('📋 ¡Lista de compras copiada al portapapeles!');
                  setShowGroceryModal(false);
                }}
                className="cta-button"
              >
                <Share2 className="w-4 h-4" />
                <span>Copiar Lista de Compras</span>
                <span className="button-sheen" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
