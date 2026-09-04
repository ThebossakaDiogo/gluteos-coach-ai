import React, { useState, useMemo } from 'react';
import { PROTEIN_RECIPES, ProteinRecipe } from '../data/recipesData';
import { uiAudio } from '../utils/audioEngine';
import {
  X,
  BookOpen,
  Search,
  Sparkles,
  Flame,
  Clock,
  ChefHat,
  Star,
  Check,
  Copy,
  PlusCircle,
  Award,
  Filter,
  CheckCircle2,
  Share2,
  Zap,
  ArrowRight,
  Bookmark,
  Coffee,
  UtensilsCrossed,
  CupSoda,
  Cookie,
  Heart,
} from 'lucide-react';

interface ProteinCookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProtein?: (grams: number) => void;
  isUnlocked?: boolean;
  onUnlock?: () => void;
}

export function ProteinCookbookModal({
  isOpen,
  onClose,
  onAddProtein,
  isUnlocked = true,
  onUnlock,
}: ProteinCookbookModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<ProteinRecipe | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gluteos_recipe_favorites');
      return saved ? JSON.parse(saved) : ['rec_1', 'rec_14', 'rec_27', 'rec_40'];
    } catch {
      return ['rec_1', 'rec_14', 'rec_27', 'rec_40'];
    }
  });
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [addedProteinNotification, setAddedProteinNotification] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cover' | 'browser'>('cover');

  const toggleFavorite = (recipeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    uiAudio.play('click');
    setFavorites((prev) => {
      const next = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      try {
        localStorage.setItem('gluteos_recipe_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleIngredient = (ingredient: string) => {
    uiAudio.play('click');
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredient]: !prev[ingredient],
    }));
  };

  const handleCopyRecipe = (recipe: ProteinRecipe) => {
    uiAudio.play('select');
    const text = `📖 ${recipe.title} (${recipe.protein}g Proteína)
🎯 Efecto Glúteos: ${recipe.gluteBenefit}
⏱️ Tiempo: ${recipe.prepTime} | Calorías: ${recipe.calories} kcal (P:${recipe.protein}g | C:${recipe.carbs}g | G:${recipe.fat}g)

🛒 INGREDIENTES:
${recipe.ingredients.map((i) => `• ${i}`).join('\n')}

👩‍🍳 PREPARACIÓN:
${recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

✨ Receta del Libro Oficial: +50 Recetas Proteicas para Glúteos 28D`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleLogProtein = (grams: number) => {
    uiAudio.play('success');
    if (onAddProtein) {
      onAddProtein(grams);
    }
    setAddedProteinNotification(grams);
    setTimeout(() => setAddedProteinNotification(null), 3000);
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return PROTEIN_RECIPES.filter((r) => {
      const matchesCategory =
        selectedCategory === 'todos'
          ? true
          : selectedCategory === 'favoritos'
          ? favorites.includes(r.id)
          : r.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.tag.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
        r.gluteBenefit.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, favorites]);

  const categoryCounts = {
    todos: PROTEIN_RECIPES.length,
    desayunos: PROTEIN_RECIPES.filter((r) => r.category === 'desayunos').length,
    'almuerzos-cenas': PROTEIN_RECIPES.filter((r) => r.category === 'almuerzos-cenas').length,
    batidos: PROTEIN_RECIPES.filter((r) => r.category === 'batidos').length,
    'snacks-postres': PROTEIN_RECIPES.filter((r) => r.category === 'snacks-postres').length,
    favoritos: favorites.length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2B0B2E]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#FFFDF5] border-3.5 border-[#2B0B2E] rounded-3xl shadow-[8px_8px_0_#2B0B2E] flex flex-col overflow-hidden text-[#2B0B2E]">
        
        {/* Top Energy Strip */}
        <div className="h-2.5 bg-gradient-to-r from-[#FFE600] via-[#FF3377] to-[#A7FF00] border-b-2 border-[#2B0B2E]" />

        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b-2.5 border-[#2B0B2E] bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center text-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] flex-shrink-0">
              <BookOpen className="w-5 h-5 text-[#FF3377] stroke-[2.5]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-[#FF3377] text-white px-2 py-0.2 rounded-full uppercase tracking-wider">
                  LIBRO DIGITAL VIP
                </span>
                <span className="text-[10px] font-black text-[#00A859] bg-[#A7FF00]/40 border border-[#2B0B2E] px-1.5 py-0.2 rounded-md">
                  +50 Recetas
                </span>
              </div>
              <h2 className="font-display font-black text-base sm:text-lg text-[#2B0B2E] truncate">
                Recetas Proteicas para Crecer Glúteos
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                uiAudio.play('click');
                setViewMode((prev) => (prev === 'cover' ? 'browser' : 'cover'));
              }}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#2B0B2E] text-xs font-black shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cover'
                  ? 'bg-[#FFE600] text-[#2B0B2E] hover:bg-[#A7FF00]'
                  : 'bg-white text-[#2B0B2E] hover:bg-[#FFE600]'
              }`}
            >
              <span>{viewMode === 'cover' ? 'Explorar Recetas' : 'Ver Portada'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                uiAudio.play('click');
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-[#FFF9E6] hover:bg-[#FF3377] hover:text-white border-2 border-[#2B0B2E] flex items-center justify-center shadow-[2px_2px_0_#2B0B2E] transition-colors cursor-pointer"
              title="Cerrar libro"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Notifications Toast */}
        {copiedNotification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#2B0B2E] text-[#FFE600] border-2 border-[#FFE600] px-4 py-2 rounded-xl text-xs font-black shadow-[4px_4px_0_#FF3377] flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-[#A7FF00] stroke-[3]" />
            <span>¡Receta copiada al portapapeles lista para enviar o guardar!</span>
          </div>
        )}

        {addedProteinNotification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#00A859] text-white border-2 border-[#2B0B2E] px-4 py-2 rounded-xl text-xs font-black shadow-[4px_4px_0_#2B0B2E] flex items-center gap-2 animate-bounce">
            <Zap className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
            <span>¡+ {addedProteinNotification}g de proteína añadidos a tu meta diaria!</span>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* VIEW 1: BOOK COVER SHOWCASE (Destacado en la portada) */}
          {viewMode === 'cover' && !selectedRecipe && (
            <div className="flex flex-col gap-5 screen-enter">
              
              {/* THE 3D NEO-POP BOOK COVER MOCKUP */}
              <div className="relative overflow-hidden rounded-3xl border-3.5 border-[#2B0B2E] bg-gradient-to-br from-[#2B0B2E] via-[#3E1343] to-[#2B0B2E] text-white p-5 sm:p-7 shadow-[6px_6px_0_#FF3377] flex flex-col md:flex-row items-center gap-6">
                
                {/* Left side book spine visual indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#FFE600] border-r-2 border-[#2B0B2E]" />

                {/* 3D Realistic Book Card Visual */}
                <div className="relative w-44 sm:w-52 h-64 sm:h-72 rounded-2xl border-3 border-[#FFE600] bg-gradient-to-b from-[#FF3377] via-[#D81B60] to-[#2B0B2E] p-4 flex flex-col justify-between shadow-[6px_6px_0_#FFE600] transform md:-rotate-2 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                  
                  {/* Spine sheen */}
                  <div className="absolute top-0 left-2 bottom-0 w-1.5 bg-white/20 rounded-full" />
                  
                  {/* Top Seal */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black bg-[#FFE600] text-[#2B0B2E] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ★ GUÍA OFICIAL VIP
                    </span>
                    <span className="text-[9px] font-black bg-[#A7FF00] text-[#2B0B2E] px-2 py-0.5 rounded-full">
                      52 RECETAS
                    </span>
                  </div>

                  {/* Main Title on Book Cover */}
                  <div className="flex flex-col gap-1 my-auto text-center">
                    <span className="text-[10px] font-black text-[#FFE600] uppercase tracking-widest">
                      PROTOCOLO 28 DÍAS
                    </span>
                    <h1 className="font-display font-black text-xl sm:text-2xl leading-none text-white drop-shadow-md">
                      +50 RECETAS PROTEICAS
                    </h1>
                    <span className="font-display font-black text-sm text-[#A7FF00] tracking-tight">
                      PARA CRECER GLÚTEOS
                    </span>
                    <p className="text-[8px] text-white/90 font-semibold mt-1">
                      Hipertrofia Glútea Máxima · Sin Acumular Grasa
                    </p>
                  </div>

                  {/* Bottom Stats on Cover */}
                  <div className="bg-[#2B0B2E]/90 border border-white/20 p-1.5 rounded-xl text-center">
                    <div className="flex justify-around text-[9px] font-black text-[#FFE600]">
                      <span>⚡ 24g-48g Prot</span>
                      <span>⏱️ 5-15 min</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Book Description, Benefits & Quick CTA */}
                <div className="flex flex-col gap-3 flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <span className="bg-[#FFE600] text-[#2B0B2E] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#2B0B2E]">
                      INCLUIDO EN EL UPSELL VIP
                    </span>
                    <span className="text-[10px] font-black text-[#A7FF00] bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                      VALORADO EN $47 USD
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                    El Recetario Definitivo para tus <span className="text-[#FFE600]">28 Días</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                    Diseñado por nutricionistas deportivos para activar la síntesis proteica (mTOR) y garantizar que cada serie de Hip Thrust y sentadilla se transforme en volumen glúteo real y firme.
                  </p>

                  {/* 4 Value Pillars */}
                  <div className="grid grid-cols-2 gap-2 my-1 text-xs">
                    <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex items-center gap-2">
                      <span className="text-base">🥞</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[11px]">13 Desayunos</span>
                        <span className="text-[9px] text-white/70">Hasta 41g proteína</span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex items-center gap-2">
                      <span className="text-base">🍗</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[11px]">13 Almuerzos/Cenas</span>
                        <span className="text-[9px] text-white/70">Cero grasa extra</span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex items-center gap-2">
                      <span className="text-base">🥤</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[11px]">13 Shakes Exprés</span>
                        <span className="text-[9px] text-white/70">Listos en 3 minutos</span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex items-center gap-2">
                      <span className="text-base">🍫</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[11px]">13 Snacks Fit</span>
                        <span className="text-[9px] text-white/70">Mousse, brownies, mugcakes</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Button to Open Recipes */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => {
                        uiAudio.play('success');
                        setViewMode('browser');
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-[#FFE600] hover:bg-[#A7FF00] text-[#2B0B2E] font-display font-black text-sm uppercase rounded-2xl border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#FF3377] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 stroke-[3]" />
                      <span>Abrir y Cocinar (52 Recetas)</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>

                    <button
                      onClick={() => {
                        uiAudio.play('select');
                        setViewMode('browser');
                        setSelectedCategory('favoritos');
                      }}
                      className="text-xs font-bold text-[#FFE600] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
                      <span>Ver mis Favoritas ({favorites.length})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#A7FF00]/40 border border-[#2B0B2E] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#00A859]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#2B0B2E]">Ingredientes Accesibles</span>
                    <span className="text-[10px] text-[#6C586B]">Nada de suplementos caros</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFE600] border border-[#2B0B2E] flex items-center justify-center">
                    <Flame className="w-5 h-5 text-[#FF3377]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#2B0B2E]">Efecto Glúteos 28D</span>
                    <span className="text-[10px] text-[#6C586B]">Explicación científica de cada plato</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FF3377] border border-[#2B0B2E] text-white flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#2B0B2E]">Registro Instantáneo</span>
                    <span className="text-[10px] text-[#6C586B]">Suma proteína al panel con 1 clic</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: RECIPE BROWSER OR RECIPE DETAIL */}
          {viewMode === 'browser' && !selectedRecipe && (
            <div className="flex flex-col gap-4 screen-enter">
              
              {/* Search Bar & Stats */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#6C586B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por ingrediente (pollo, avena, chocolate, yogur, batata...)"
                    className="w-full bg-white border-2 border-[#2B0B2E] pl-9 pr-8 py-2 rounded-2xl text-xs font-bold text-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] focus:outline-none focus:border-[#FF3377]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6C586B] hover:text-[#2B0B2E]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-black text-[#2B0B2E]">
                  <span className="bg-[#FFE600] px-3 py-2 rounded-2xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] whitespace-nowrap">
                    📖 {filteredRecipes.length} de 52 Recetas
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'todos', label: 'Todas', icon: BookOpen, count: categoryCounts.todos },
                  { id: 'desayunos', label: 'Desayunos', icon: Coffee, count: categoryCounts.desayunos },
                  { id: 'almuerzos-cenas', label: 'Almuerzos & Cenas', icon: UtensilsCrossed, count: categoryCounts['almuerzos-cenas'] },
                  { id: 'batidos', label: 'Shakes & Batidos', icon: CupSoda, count: categoryCounts.batidos },
                  { id: 'snacks-postres', label: 'Snacks & Postres', icon: Cookie, count: categoryCounts['snacks-postres'] },
                  { id: 'favoritos', label: '⭐ Favoritos', icon: Star, count: categoryCounts.favoritos },
                ].map((cat) => {
                  const IconComp = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        uiAudio.play('select');
                        setSelectedCategory(cat.id);
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#2B0B2E] text-[#FFE600] border-[#2B0B2E] shadow-[2px_2px_0_#FF3377]'
                          : 'bg-white text-[#2B0B2E] border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E] hover:bg-[#FFE600]'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isActive ? 'bg-[#FFE600] text-[#2B0B2E]' : 'bg-gray-100 text-[#6C586B]'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Recipes Grid */}
              {filteredRecipes.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] text-center flex flex-col items-center gap-2">
                  <span className="text-3xl">🔍</span>
                  <h4 className="font-display font-black text-base">No se encontraron recetas</h4>
                  <p className="text-xs text-[#6C586B]">
                    Intenta con otro término de búsqueda o cambia la categoría seleccionada.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('todos');
                    }}
                    className="mt-2 px-3 py-1.5 bg-[#FFE600] border-2 border-[#2B0B2E] rounded-xl text-xs font-black cursor-pointer"
                  >
                    Ver todas las 52 recetas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredRecipes.map((recipe) => {
                    const isFav = favorites.includes(recipe.id);
                    return (
                      <div
                        key={recipe.id}
                        onClick={() => {
                          uiAudio.play('click');
                          setSelectedRecipe(recipe);
                          setCheckedIngredients({});
                        }}
                        className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#FF3377] transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                      >
                        {/* Card Header: Tag & Protein Pill */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black bg-[#FFF9E6] border border-[#2B0B2E] px-2 py-0.5 rounded-full text-[#2B0B2E]">
                            {recipe.tag}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black bg-[#A7FF00] border border-[#2B0B2E] px-2 py-0.5 rounded-lg shadow-[1px_1px_0_#2B0B2E]">
                              +{recipe.protein}g Prot
                            </span>
                            <button
                              onClick={(e) => toggleFavorite(recipe.id, e)}
                              className="p-1 text-[#6C586B] hover:text-[#FF3377] cursor-pointer"
                              title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  isFav ? 'text-[#FF3377] fill-[#FF3377]' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Title & Glute Benefit */}
                        <div className="flex flex-col gap-1">
                          <h4 className="font-display font-black text-sm text-[#2B0B2E] leading-snug group-hover:text-[#FF3377] transition-colors">
                            {recipe.title}
                          </h4>
                          <p className="text-[11px] text-[#6C586B] line-clamp-2 leading-relaxed">
                            {recipe.gluteBenefit}
                          </p>
                        </div>

                        {/* Card Footer: Macros & Prep Time */}
                        <div className="pt-2 border-t border-[#2B0B2E]/10 flex items-center justify-between text-[10px] font-bold text-[#6C586B]">
                          <div className="flex items-center gap-2">
                            <span>🔥 {recipe.calories} kcal</span>
                            <span>⏱️ {recipe.prepTime}</span>
                          </div>
                          <span className="text-[#FF3377] font-black group-hover:underline flex items-center gap-0.5">
                            <span>Ver receta</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: SINGLE RECIPE DETAILED COOKING VIEW */}
          {selectedRecipe && (
            <div className="flex flex-col gap-4 screen-enter">
              
              {/* Back button */}
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setSelectedRecipe(null);
                }}
                className="self-start text-xs font-black text-[#2B0B2E] hover:text-[#FF3377] bg-white border-2 border-[#2B0B2E] px-3 py-1.5 rounded-xl shadow-[2px_2px_0_#2B0B2E] flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>← Volver al Índice de Recetas</span>
              </button>

              {/* Recipe Hero Card */}
              <div className="bg-gradient-to-br from-[#FFE600] via-[#FFF9E6] to-[#A7FF00]/40 p-5 rounded-3xl border-3 border-[#2B0B2E] shadow-[5px_5px_0_#2B0B2E] flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-[#2B0B2E] text-[#FFE600] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedRecipe.categoryLabel}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(selectedRecipe.id)}
                      className="px-2.5 py-1 rounded-xl bg-white border-1.5 border-[#2B0B2E] text-xs font-bold flex items-center gap-1 cursor-pointer shadow-[1.5px_1.5px_0_#2B0B2E]"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          favorites.includes(selectedRecipe.id)
                            ? 'text-[#FF3377] fill-[#FF3377]'
                            : 'text-[#6C586B]'
                        }`}
                      />
                      <span>
                        {favorites.includes(selectedRecipe.id) ? 'Favorito' : 'Guardar'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleCopyRecipe(selectedRecipe)}
                      className="px-2.5 py-1 rounded-xl bg-white border-1.5 border-[#2B0B2E] text-xs font-bold flex items-center gap-1 cursor-pointer shadow-[1.5px_1.5px_0_#2B0B2E]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-[#2B0B2E] leading-tight">
                  {selectedRecipe.title}
                </h3>

                {/* Glute Target Badge */}
                <div className="bg-white/80 border border-[#2B0B2E]/20 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                  <Flame className="w-4 h-4 text-[#FF3377] flex-shrink-0" />
                  <span className="font-semibold text-[#2B0B2E]">
                    <strong>Efecto Glúteos 28D:</strong> {selectedRecipe.gluteBenefit}
                  </span>
                </div>

                {/* 4 Macros Bar */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-white p-2 rounded-xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
                    <span className="text-[9px] font-black text-[#6C586B] uppercase block">Proteína</span>
                    <span className="font-display font-black text-base text-[#00A859]">
                      {selectedRecipe.protein}g
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
                    <span className="text-[9px] font-black text-[#6C586B] uppercase block">Calorías</span>
                    <span className="font-display font-black text-base text-[#2B0B2E]">
                      {selectedRecipe.calories}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
                    <span className="text-[9px] font-black text-[#6C586B] uppercase block">Carbos</span>
                    <span className="font-display font-black text-base text-[#FF3377]">
                      {selectedRecipe.carbs}g
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border-2 border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
                    <span className="text-[9px] font-black text-[#6C586B] uppercase block">Grasas</span>
                    <span className="font-display font-black text-base text-[#6C586B]">
                      {selectedRecipe.fat}g
                    </span>
                  </div>
                </div>

                {/* Log Protein Action Button */}
                <button
                  onClick={() => handleLogProtein(selectedRecipe.protein)}
                  className="w-full py-2.5 px-4 bg-[#00A859] hover:bg-[#008f4c] text-white font-display font-black text-xs uppercase rounded-xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
                  <span>Registrar esta comida en mi día (+{selectedRecipe.protein}g proteína)</span>
                </button>
              </div>

              {/* Ingredients & Steps Two-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Ingredients with interactive checkboxes */}
                <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-[#2B0B2E]/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="w-4 h-4 text-[#FF3377]" />
                      <span className="font-display font-black text-sm text-[#2B0B2E]">
                        Ingredientes Exactos
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6C586B] font-bold">
                      Toca para marcar
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {selectedRecipe.ingredients.map((ing, idx) => {
                      const isChecked = !!checkedIngredients[ing];
                      return (
                        <label
                          key={idx}
                          onClick={() => toggleIngredient(ing)}
                          className={`flex items-start gap-2 p-2 rounded-xl border transition-all cursor-pointer text-xs ${
                            isChecked
                              ? 'bg-[#A7FF00]/20 border-[#00A859] line-through text-[#6C586B]'
                              : 'bg-[#FFFDF5] border-[#2B0B2E]/20 text-[#2B0B2E] hover:bg-[#FFE600]/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 w-4 h-4 rounded accent-[#00A859] cursor-pointer"
                          />
                          <span className="font-semibold">{ing}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Cooking Instructions */}
                <div className="bg-white p-4 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-[#2B0B2E]/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#FF3377]" />
                      <span className="font-display font-black text-sm text-[#2B0B2E]">
                        Paso a Paso ({selectedRecipe.prepTime})
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-[#00A859] bg-[#A7FF00]/30 px-2 py-0.5 rounded-full">
                      {selectedRecipe.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {selectedRecipe.instructions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2B0B2E]">
                        <span className="w-5 h-5 rounded-full bg-[#FFE600] border border-[#2B0B2E] text-[#2B0B2E] font-black flex items-center justify-center flex-shrink-0 text-[10px] shadow-[1px_1px_0_#2B0B2E] mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-medium leading-relaxed flex-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-4 sm:px-6 py-3 border-t-2.5 border-[#2B0B2E] bg-white flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A859] animate-pulse" />
            <span className="font-black text-[#2B0B2E]">
              Libro 100% Desbloqueado · Guardado en tu Cuenta
            </span>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'browser' && (
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setViewMode('cover');
                  setSelectedRecipe(null);
                }}
                className="text-xs font-bold text-[#FF3377] hover:underline cursor-pointer"
              >
                Volver a la Portada
              </button>
            )}
            <button
              onClick={() => {
                uiAudio.play('click');
                onClose();
              }}
              className="px-4 py-1.5 bg-[#2B0B2E] text-white hover:bg-[#FF3377] font-black text-xs rounded-xl border border-[#2B0B2E] cursor-pointer shadow-[2px_2px_0_#FFE600] transition-colors"
            >
              Listo / Volver al App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
