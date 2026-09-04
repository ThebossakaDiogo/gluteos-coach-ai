export interface ProteinRecipe {
  id: string;
  title: string;
  category: 'desayunos' | 'almuerzos-cenas' | 'batidos' | 'snacks-postres';
  categoryLabel: string;
  protein: number; // grams
  calories: number; // kcal
  carbs: number; // grams
  fat: number; // grams
  prepTime: string;
  difficulty: 'Exprés (5 min)' | 'Fácil (10-15 min)' | 'Media (20 min)';
  gluteBenefit: string;
  tag: string;
  ingredients: string[];
  instructions: string[];
}

export const PROTEIN_RECIPES: ProteinRecipe[] = [
  // ================= DESAYUNOS (13 Recetas) =================
  {
    id: 'rec_1',
    title: 'Pancakes Anabólicos de Avena & Suero',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 38,
    calories: 380,
    carbs: 42,
    fat: 6,
    prepTime: '10 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Estimulación óptima de mTOR matutina para soporte muscular en glúteos.',
    tag: 'Top Desayuno',
    ingredients: ['1 scoop de proteína sabor vainilla (30g)', '45g de avena molida', '2 claras de huevo + 1 huevo entero', '60ml de leche vegetal', '1/2 cucharadita de canela', 'Un puñado de arándanos frescos'],
    instructions: [
      'Licúa o mezcla enérgicamente todos los ingredientes hasta lograr una mezcla homogénea.',
      'Calienta una sartén antiadherente con una gota de aceite de oliva o coco a fuego medio.',
      'Vierte pequeñas porciones y dora 2 minutos por lado hasta que aparezcan burbujas.',
      'Sirve caliente con los arándanos por encima y un toque de canela.'
    ]
  },
  {
    id: 'rec_2',
    title: 'Omelette Hipertrófico de Espinacas & Pavo',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 35,
    calories: 310,
    carbs: 5,
    fat: 14,
    prepTime: '8 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Aporte de leucina y micronutrientes bioactivos para contracción muscular.',
    tag: 'Bajo en Carb',
    ingredients: ['3 huevos enteros + 2 claras', '80g de pechuga de pavo en cubos', '1 taza de espinacas baby frescas', '30g de queso feta o requesón bajo en grasa', 'Pizca de sal marina y pimienta'],
    instructions: [
      'Bate los huevos y claras con una pizca de sal marina y pimienta negra.',
      'Saltea las espinacas y el pavo en la sartén durante 1 minuto a fuego medio.',
      'Vierte los huevos batidos, esparce el queso feta desmenuzado y dobla a la mitad al cuajar.',
      'Cocina 1 minuto más a fuego bajo hasta que el centro quede jugoso.'
    ]
  },
  {
    id: 'rec_3',
    title: 'Tostadas Francesas Fit con Requesón & Fresas',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 32,
    calories: 350,
    carbs: 44,
    fat: 5,
    prepTime: '10 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Glucógeno de rápida asimilación para días de entrenamiento pesado.',
    tag: 'Energía Glútea',
    ingredients: ['2 rebanadas de pan 100% integral', '1 huevo entero + 2 claras', '100g de requesón o cottage 0%', '4 fresas laminadas', 'Canela en polvo y extracto de vainilla'],
    instructions: [
      'Bate el huevo y las claras con vainilla y canela.',
      'Sumerge las rebanadas de pan asegurándote de que absorban todo el líquido.',
      'Dora en sartén antiadherente 2-3 minutos por lado.',
      'Cubre con el requesón batido y las fresas frescas.'
    ]
  },
  {
    id: 'rec_4',
    title: 'Bowl de Avena Nocturna con Proteína & Chía',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 34,
    calories: 390,
    carbs: 48,
    fat: 8,
    prepTime: '5 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Digestión progresiva de aminoácidos para alimentar el glúteo durante horas.',
    tag: 'Sin Cocinar',
    ingredients: ['50g de copos de avena integral', '1 scoop de proteína de suero o soja', '15g de semillas de chía', '180ml de leche de almendras sin azúcar', '1 cucharada de semillas de calabaza'],
    instructions: [
      'En un tarro hermético, mezcla la avena, la proteína en polvo y la chía.',
      'Agrega la leche y remueve hasta disolver los grumos de proteína.',
      'Refrigera toda la noche (mínimo 4 horas).',
      'Por la mañana, decora con semillas de calabaza y consume frío.'
    ]
  },
  {
    id: 'rec_5',
    title: 'Huevos Turcos Ricos en Proteína con Yogur Griego',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 31,
    calories: 330,
    carbs: 10,
    fat: 16,
    prepTime: '10 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Calcio y probióticos para maximizar la absorción de aminoácidos.',
    tag: 'Gourmet Fit',
    ingredients: ['2 huevos poché o a la plancha', '180g de yogur griego natural 0%', '1 diente de ajo rallado fino', '1 cucharadita de aceite de oliva con pimentón dulce', '1 rebanada de pan tostado'],
    instructions: [
      'Mezcla el yogur griego con el ajo rallado y una pizca de sal.',
      'Coloca la base de yogur en un plato hondo.',
      'Cocina los huevos poché (yema blanda) y colócalos sobre el yogur.',
      'Rocía con el aceite templado con pimentón y acompaña con la tostada.'
    ]
  },
  {
    id: 'rec_6',
    title: 'Waffles Dorados de Proteína & Crema de Almendras',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 36,
    calories: 410,
    carbs: 38,
    fat: 12,
    prepTime: '12 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Densidad calórica limpia para etapa de aumento de masa muscular limpia.',
    tag: 'Volumen Limpio',
    ingredients: ['40g de harina de avena', '1 scoop de proteína sabor vainilla o galleta', '1 huevo entero + 50ml de claras', '1 cucharada de crema de almendras pura', '1/2 cucharadita de levadura en polvo'],
    instructions: [
      'Mezcla todos los ingredientes en una licuadora hasta que espese.',
      'Engrasa ligeramente la wafflera caliente.',
      'Vierte la masa y cocina por 4-5 minutos hasta que esté dorada y crujiente.',
      'Corona con la cucharada de crema de almendras.'
    ]
  },
  {
    id: 'rec_7',
    title: 'Scramble Proteico con Salmón Ahumado & Aguacate',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 33,
    calories: 360,
    carbs: 4,
    fat: 19,
    prepTime: '7 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Ácidos grasos Omega-3 antiinflamatorios que optimizan la recuperación glútea.',
    tag: 'Omega-3 Booster',
    ingredients: ['2 huevos + 2 claras', '60g de salmón ahumado en tiras', '40g de aguacate maduro en láminas', 'Eneldo fresco y cebollino picado'],
    instructions: [
      'Bate suavemente los huevos con las claras.',
      'Cocina en sartén a fuego medio-bajo revolviendo suavemente con espátula.',
      'Retira del fuego cuando aún estén cremosos y añade el salmón.',
      'Acompaña con el aguacate en láminas y eneldo fresco.'
    ]
  },
  {
    id: 'rec_8',
    title: 'Porridge Hipertrófico de Cacao & Plátano',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 32,
    calories: 420,
    carbs: 58,
    fat: 6,
    prepTime: '8 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Magnesio y potasio para evitar calambres y potenciar la contracción en glúteos.',
    tag: 'Pre-Entreno',
    ingredients: ['50g de avena en copos', '1 cucharada de cacao puro 100%', '1 scoop de proteína de chocolate', '1 plátano maduro en rodajas', '200ml de agua o leche desnatada'],
    instructions: [
      'Cocina la avena con el agua y el cacao a fuego medio durante 4 minutos.',
      'Apaga el fuego, espera 1 minuto y agrega la proteína en polvo removiendo bien.',
      'Sirve en un bol y coloca las rodajas de plátano encima.'
    ]
  },
  {
    id: 'rec_9',
    title: 'Crepes Franceses Proteicos Rellenos de Cottage',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 37,
    calories: 320,
    carbs: 26,
    fat: 5,
    prepTime: '12 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Caseína natural de digestión lenta para mantener el entorno anabólico.',
    tag: 'Saciante',
    ingredients: ['3 claras de huevo + 1 huevo', '25g de harina de avena', '120g de queso cottage bajo en grasa', 'Canela y unas gotas de stevia', 'Ralladura de limón'],
    instructions: [
      'Bate el huevo, las claras y la avena hasta obtener una masa líquida.',
      'Haz 2 crepes muy finos en sartén bien caliente durante 1 minuto por lado.',
      'Mezcla el cottage con stevia, canela y ralladura de limón.',
      'Rellena los crepes, enróllalos y sirve de inmediato.'
    ]
  },
  {
    id: 'rec_10',
    title: 'Muffins de Huevo & Pavo Horneados en 15 Minutos',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 30,
    calories: 270,
    carbs: 6,
    fat: 12,
    prepTime: '15 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Preparación por lotes ideal para no saltarte tu meta de proteína matutina.',
    tag: 'Batch Cooking',
    ingredients: ['4 huevos enteros', '100g de pechuga de pavo picada', '1/2 pimiento rojo en cubitos', '1 puñado de espinacas picadas', 'Pimienta negra molida'],
    instructions: [
      'Precalienta el horno o freidora de aire a 180°C.',
      'Bate los huevos y mezcla con el pavo, pimiento y espinacas.',
      'Vierte en 4 moldes individuales para muffins.',
      'Hornea durante 12-15 minutos hasta que estén inflados y firmes.'
    ]
  },
  {
    id: 'rec_11',
    title: 'Bagel Proteico con Atún & Queso Crema Ligero',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 41,
    calories: 390,
    carbs: 38,
    fat: 8,
    prepTime: '5 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Bomba proteica de 41g para antes de una sesión de Hip Thrust pesado.',
    tag: 'Ultra Proteína',
    ingredients: ['1 bagel o pan redondo integral', '1 lata de atún al natural escurrida (100g)', '30g de queso crema light', 'Rodajas de tomate y rúcula', 'Pimienta y unas gotas de limón'],
    instructions: [
      'Tuesta el bagel por ambas caras.',
      'Mezcla el atún con el queso crema light y unas gotas de limón.',
      'Unta la pasta de atún generosamente sobre la base.',
      'Coloca el tomate y la rúcula, cierra el bagel y disfruta.'
    ]
  },
  {
    id: 'rec_12',
    title: 'Chía Pudding con Proteína de Vainilla & Mango',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 29,
    calories: 310,
    carbs: 36,
    fat: 7,
    prepTime: '5 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Rico en fibra prebiótica para desinflamar el abdomen y resaltar la cadera.',
    tag: 'Anti-Inflamatorio',
    ingredients: ['25g de semillas de chía', '1 scoop de proteína aislada de vainilla', '200ml de leche vegetal', '1/2 mango maduro picado en cubos'],
    instructions: [
      'Bate la proteína con la leche vegetal.',
      'Añade las semillas de chía y remueve durante 1 minuto para evitar que se asienten.',
      'Deja reposar 30 minutos o toda la noche en la nevera.',
      'Cubre con cubos de mango fresco al momento de comer.'
    ]
  },
  {
    id: 'rec_13',
    title: 'Revuelto de Claras, Champiñones & Queso de Cabra',
    category: 'desayunos',
    categoryLabel: 'Desayunos Proteicos',
    protein: 34,
    calories: 290,
    carbs: 6,
    fat: 13,
    prepTime: '9 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Bajo en carbohidratos, ideal para días de descanso activo o recomposición.',
    tag: 'Definición',
    ingredients: ['1 huevo entero + 4 claras de huevo', '100g de champiñones laminados', '25g de queso de cabra suave', 'Perejil fresco picado', '1 cucharadita de aceite de oliva'],
    instructions: [
      'Saltea los champiñones en la sartén con el aceite hasta dorar.',
      'Vierte las claras y el huevo ligeramente batidos.',
      'Cocina a fuego medio removiendo hasta cuajar.',
      'Desmenuza el queso de cabra por encima y añade el perejil fresco.'
    ]
  },

  // ================= ALMUERZOS & CENAS (13 Recetas) =================
  {
    id: 'rec_14',
    title: 'Pechuga Marinada al Limón & Romero con Batata Asada',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 44,
    calories: 460,
    carbs: 48,
    fat: 9,
    prepTime: '20 min',
    difficulty: 'Media (20 min)',
    gluteBenefit: 'La combinación reina: proteína magra pura + carbohidrato complejo para el glúteo.',
    tag: 'El Clásico de Oro',
    ingredients: ['180g de pechuga de pollo limpia', '200g de batata / camote en rodajas finas', 'Zumo de 1/2 limón + romero seco', '1 cucharadita de aceite de oliva virgen', 'Brócoli al vapor como guarnición'],
    instructions: [
      'Marina el pollo con el limón, romero, ajo en polvo y sal durante 10 minutos.',
      'Asa las rodajas de batata en sartén tapada o freidora de aire a 190°C por 12 minutos.',
      'Cocina la pechuga en sartén bien caliente hasta dorar por ambos lados (4 min por lado).',
      'Sirve con la batata crujiente y brócoli al vapor.'
    ]
  },
  {
    id: 'rec_15',
    title: 'Lomo de Salmón con Costra de Sésamo & Quinoa Tricolor',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 39,
    calories: 480,
    carbs: 36,
    fat: 20,
    prepTime: '15 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Mejora la sensibilidad a la insulina muscular para dirigir nutrientes a los glúteos.',
    tag: 'Grasas Buenas',
    ingredients: ['160g de lomo de salmón fresco', '50g de quinoa en seco (cocida en caldo)', '1 cucharada de semillas de sésamo', 'Espárragos trigueros a la plancha', '1 cucharada de salsa de soja baja en sodio'],
    instructions: [
      'Pasa la parte superior del salmón por el sésamo presionando ligeramente.',
      'Cocina el salmón en sartén caliente por el lado de la piel 4 min, voltea 2 min.',
      'Saltea los espárragos en la misma sartén con unas gotas de soja.',
      'Sirve sobre la base de quinoa tricolor caliente.'
    ]
  },
  {
    id: 'rec_16',
    title: 'Bowl Hipertrófico de Ternera Magra & Arroz Jazmín',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 42,
    calories: 490,
    carbs: 52,
    fat: 10,
    prepTime: '15 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Hierro hemo y creatina natural que aumentan la fuerza en sentadillas y zancadas.',
    tag: 'Fuerza Pura',
    ingredients: ['160g de carne picada de ternera magra (<5% grasa)', '60g de arroz jazmín cocido', 'Calabacín y zanahoria rallados', '1 cucharada de salsa teriyaki baja en azúcar', 'Semillas de sésamo'],
    instructions: [
      'Saltea la ternera en la sartén hasta que cambie de color y suelte aroma.',
      'Añade el calabacín y la zanahoria y cocina 3 minutos más.',
      'Incorpora la salsa teriyaki y remueve para integrar sabores.',
      'Monta el bowl con el arroz jazmín y la carne encima.'
    ]
  },
  {
    id: 'rec_17',
    title: 'Hamburguesas Caseras de Pavo & Avena al Grill',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 46,
    calories: 430,
    carbs: 32,
    fat: 11,
    prepTime: '18 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Máxima saciedad con densidad de aminoácidos para reparación de miofibrillas.',
    tag: 'Favorita Fit',
    ingredients: ['200g de pechuga de pavo picada', '25g de copos de avena triturados', '1 clara de huevo', 'Cebolla picada fina y pimentón ahumado', 'Panecillo integral o envoltura en hojas de lechuga'],
    instructions: [
      'Mezcla el pavo, la avena, la clara y las especias en un bol con las manos.',
      'Forma 2 medallones compactos.',
      'Cocina a la plancha a fuego medio 5 minutos por lado hasta que estén bien cocidas.',
      'Acompaña con rodajas de tomate, cebolla morada y mostaza Dijon.'
    ]
  },
  {
    id: 'rec_18',
    title: 'Merluza al Horno en Papillote con Verduras Asadas',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 36,
    calories: 310,
    carbs: 18,
    fat: 6,
    prepTime: '18 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Cena ligera de digestión rápida que favorece la hormona de crecimiento nocturna.',
    tag: 'Cena Ligera',
    ingredients: ['200g de filetes de merluza o bacalao fresco', '1 pimiento verde en juliana', '1/2 cebolla en juliana', '6 tomates cherry partidos', '1 cucharadita de AOVE y perejil'],
    instructions: [
      'Extiende una lámina de papel de horno y coloca las verduras de base.',
      'Pon la merluza encima, salpimienta y añade unas gotas de aceite de oliva.',
      'Cierra el paquete doblando los bordes para crear un sellado hermético.',
      'Hornea a 200°C durante 15 minutos. Abre con cuidado el vapor y sirve.'
    ]
  },
  {
    id: 'rec_19',
    title: 'Tacos Fit de Pollo Desmechado con Guacamole Casero',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 38,
    calories: 420,
    carbs: 38,
    fat: 12,
    prepTime: '12 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Grasas monoinsaturadas del aguacate que optimizan el perfil hormonal femenino.',
    tag: 'Noche Mexicana',
    ingredients: ['150g de pechuga de pollo cocida y desmechada', '2 tortillas de maíz pequeñas', '40g de aguacate machacado con lima y cilantro', 'Pico de gallo fresco (tomate, cebolla, lima)', 'Gotas de salsa picante al gusto'],
    instructions: [
      'Saltea el pollo desmechado con comino, ajo y sal para impregnar sabor.',
      'Calienta las tortillas de maíz en una sartén seca 30 segundos por lado.',
      'Unta el guacamole casero, añade el pollo caliente y corona con pico de gallo.',
      'Sirve inmediatamente con un chorrito de lima fresca.'
    ]
  },
  {
    id: 'rec_20',
    title: 'Curry Proteico de Pollo & Leche de Coco Light',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 41,
    calories: 450,
    carbs: 40,
    fat: 11,
    prepTime: '20 min',
    difficulty: 'Media (20 min)',
    gluteBenefit: 'La cúrcuma del curry combate la inflamación articular tras sentadillas pesadas.',
    tag: 'Anti-Dolor Post-Gym',
    ingredients: ['170g de pechuga de pollo en dados', '100ml de leche de coco ligera', '1 cucharada de curry en polvo amarillo', 'Calabacín y champiñones en dados', '50g de arroz basmati cocido'],
    instructions: [
      'Dora el pollo en sartén antiadherente con un spray de aceite.',
      'Añade las verduras y cocina 3 minutos.',
      'Vierte la leche de coco y el curry, removiendo a fuego medio hasta espesar (5 min).',
      'Sirve acompañado del arroz basmati caliente.'
    ]
  },
  {
    id: 'rec_21',
    title: 'Bowl Vegano de Tofu Crujiente con Edamames & Arroz',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 35,
    calories: 430,
    carbs: 46,
    fat: 13,
    prepTime: '15 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Perfil completo de aminoácidos 100% plant-based para el crecimiento muscular.',
    tag: '100% Vegano',
    ingredients: ['180g de tofu extra firme en dados', '80g de edamames cocidos desgranados', '50g de arroz integral cocido', '1 cucharada de salsa de soja + 1 cdta de aceite de sésamo', 'Semillas de chía'],
    instructions: [
      'Prensa el tofu con papel absorbente para retirar la humedad.',
      'Saltea el tofu en sartén caliente con aceite de sésamo hasta que quede crujiente.',
      'Añade la salsa de soja al final para glasear los dados.',
      'Monta el bowl con el arroz, los edamames y el tofu crujiente.'
    ]
  },
  {
    id: 'rec_22',
    title: 'Wrap Integral de Atún Claro, Huevo Duro & Hummus',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 37,
    calories: 390,
    carbs: 35,
    fat: 11,
    prepTime: '6 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Comida exprés ideal para llevar al trabajo y no descuidar tu meta proteica.',
    tag: 'Para Llevar',
    ingredients: ['1 tortilla grande 100% integral', '1 lata grande de atún al natural (120g)', '1 huevo cocido picado', '30g de hummus casero o tradicional', 'Hojas de espinaca fresca'],
    instructions: [
      'Extiende el hummus sobre toda la superficie de la tortilla integral.',
      'Coloca las hojas de espinaca, el atún desmenuzado y el huevo cocido.',
      'Enrolla el wrap apretando firmemente los bordes.',
      'Córtalo en diagonal y consérvalo en papel aluminio o consume al instante.'
    ]
  },
  {
    id: 'rec_23',
    title: 'Stir-Fry de Ternera con Brócoli & Pimientos al Wok',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 43,
    calories: 420,
    carbs: 28,
    fat: 12,
    prepTime: '14 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Aporte masivo de zinc y magnesio para optimizar la síntesis proteica.',
    tag: 'Wok Asiático',
    ingredients: ['170g de tiras de ternera magra', '1 taza de ramilletes de brócoli', '1/2 pimiento rojo en tiras', '1 diente de ajo y jengibre rallado', '1 cucharada de salsa de soja y sésamo'],
    instructions: [
      'Calienta el wok o sartén amplia a fuego máximo.',
      'Saltea las tiras de ternera durante 2 minutos y reserva.',
      'En el mismo wok, saltea el brócoli, pimiento, ajo y jengibre con 2 cdas de agua.',
      'Reincorpora la carne, añade la salsa de soja y saltea 1 minuto más.'
    ]
  },
  {
    id: 'rec_24',
    title: 'Pechuga a la Parmesana Fit (Sin Fritura) con Calabacín',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 45,
    calories: 410,
    carbs: 16,
    fat: 14,
    prepTime: '18 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Sabor gourmet indulgente manteniendo el déficit o superávit limpio.',
    tag: 'Italiana Fit',
    ingredients: ['180g de pechuga de pollo abierta en filete', '4 cucharadas de tomate triturado natural', '30g de mozzarella rallada light', '10g de queso parmesano', 'Orégano y calabacín a la plancha'],
    instructions: [
      'Marca el filete de pollo en la plancha 2 minutos por lado.',
      'Coloca en una bandeja de horno, cubre con el tomate natural, orégano y los quesos.',
      'Gratina en el horno o freidora de aire a 200°C por 6 minutos hasta dorar el queso.',
      'Sirve con rodajas de calabacín a la plancha con orégano.'
    ]
  },
  {
    id: 'rec_25',
    title: 'Poke Bowl de Salmón Marinado, Mango & Edamames',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 36,
    calories: 460,
    carbs: 48,
    fat: 14,
    prepTime: '10 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Antioxidantes y carotenoides que aceleran la regeneración de tejidos conectivos.',
    tag: 'Fresco & Vital',
    ingredients: ['140g de salmón fresco calidad sashimi en cubos', '60g de arroz para sushi o integral cocido', '40g de edamames cocidos', '40g de mango en cubos', 'Alga nori en tiras y sésamo negro'],
    instructions: [
      'Marina el salmón 5 minutos con salsa de soja y unas gotas de aceite de sésamo.',
      'Coloca el arroz tibio de base en un cuenco hondo.',
      'Distribuye por secciones el salmón, los edamames y el mango.',
      'Decora con tiras de alga nori y sésamo negro.'
    ]
  },
  {
    id: 'rec_26',
    title: 'Albóndigas Caseras de Pollo & Chía en Salsa de Tomate',
    category: 'almuerzos-cenas',
    categoryLabel: 'Almuerzos & Cenas Hipertróficas',
    protein: 42,
    calories: 390,
    carbs: 22,
    fat: 10,
    prepTime: '20 min',
    difficulty: 'Media (20 min)',
    gluteBenefit: 'Fácil digestión con alto contenido de glutamina natural para los glúteos.',
    tag: 'Comfort Food',
    ingredients: ['200g de pollo picado', '1 cucharada de semillas de chía molidas', '1 clara de huevo', '150ml de salsa de tomate casera sin azúcar', 'Albahaca fresca'],
    instructions: [
      'Mezcla el pollo picado con la chía, la clara, sal y pimienta.',
      'Forma 6-8 albóndigas pequeñas con las palmas de las manos húmedas.',
      'Dora las albóndigas en la sartén durante 4 minutos.',
      'Vierte la salsa de tomate, tapa y deja chof-chof a fuego lento 10 minutos.'
    ]
  },

  // ================= BATIDOS & SHAKES (13 Recetas) =================
  {
    id: 'rec_27',
    title: 'Shake Monster Glúteos: Plátano & Mantequilla de Cacahuete',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 40,
    calories: 440,
    carbs: 45,
    fat: 12,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Disparo de insulina post-entreno para meter aminoácidos directamente en la masa glútea.',
    tag: 'Post-Entreno Estrella',
    ingredients: ['1 scoop y medio de proteína de suero (vainilla o chocolate)', '1 plátano maduro congelado', '20g de mantequilla de cacahuete pura 100%', '250ml de leche desnatada o bebida de soja', '3 cubitos de hielo'],
    instructions: [
      'Coloca todos los ingredientes en el vaso de la batidora.',
      'Bate a máxima potencia durante 45 segundos hasta obtener textura cremosa estilo frappé.',
      'Consume dentro de los 45 minutos posteriores a tu entrenamiento de glúteos.'
    ]
  },
  {
    id: 'rec_28',
    title: 'Smoothie Berry Colágeno: Frutos Rojos & Suero Aislado',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 34,
    calories: 260,
    carbs: 24,
    fat: 3,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Refuerzo de colágeno para tendones, ligamentos y firmeza dérmica en la zona glútea.',
    tag: 'Firmeza & Piel',
    ingredients: ['1 scoop de proteína aislada de suero', '10g de péptidos de colágeno hidrolizado', '100g de mix de frutos rojos congelados (fresas, arándanos, frambuesas)', '200ml de agua fría o agua de coco'],
    instructions: [
      'Introduce los frutos rojos, la proteína y el colágeno en la batidora.',
      'Añade el agua de coco o agua fría.',
      'Tritura hasta que quede completamente suave y sin grumos.'
    ]
  },
  {
    id: 'rec_29',
    title: 'Frappé Fit Café Moka & Proteína de Chocolate',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 32,
    calories: 220,
    carbs: 12,
    fat: 4,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Cafeína que incrementa la activación neuromuscular en ejercicios unilaterales.',
    tag: 'Energía Pre-Workout',
    ingredients: ['1 taza de café espresso recién hecho y enfriado', '1 scoop de proteína de chocolate', '150ml de leche de almendras sin azúcar', '1 cucharadita de cacao puro', 'Mucho hielo picado'],
    instructions: [
      'Vierte el café frío, la leche de almendras y la proteína en la licuadora.',
      'Añade abundante hielo y el cacao.',
      'Bate en modo pulsos hasta conseguir una textura espesa tipo cafetería.'
    ]
  },
  {
    id: 'rec_30',
    title: 'Batido Verde Anabólico: Espinacas, Manzana & Vainilla',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 30,
    calories: 240,
    carbs: 26,
    fat: 2,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Nitratos naturales de la espinaca que dilatan los vasos sanguíneos para mayor bombeo.',
    tag: 'Pump Muscular',
    ingredients: ['1 scoop de proteína sabor vainilla', '1 taza colmada de espinacas frescas', '1/2 manzana verde', '1 trocito de jengibre pelado', '200ml de agua bien fría'],
    instructions: [
      'Pon las espinacas y la manzana en trozos en el fondo de la batidora.',
      'Añade el jengibre, la proteína y el agua.',
      'Licúa durante 1 minuto a máxima velocidad hasta que el color sea verde brillante.'
    ]
  },
  {
    id: 'rec_31',
    title: 'Shake Tropical de Mango, Piña & Proteína de Coco',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 31,
    calories: 290,
    carbs: 38,
    fat: 3,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Bromelina de la piña que acelera la recuperación de micro-roturas musculares.',
    tag: 'Anti-Agujetas',
    ingredients: ['1 scoop de proteína de vainilla o coco', '80g de piña fresca o congelada', '80g de mango en dados', '200ml de agua de coco natural'],
    instructions: [
      'Agrega la fruta congelada y el scoop de proteína en el vaso mezclador.',
      'Vierte el agua de coco.',
      'Bate a velocidad constante hasta lograr un batido sedoso y tropical.'
    ]
  },
  {
    id: 'rec_32',
    title: 'Smoothie Proteico de Avena & Canela Sabor Tarta de Manzana',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 35,
    calories: 380,
    carbs: 46,
    fat: 6,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Carbohidratos complejos de absorción media que sostienen el crecimiento nocturno.',
    tag: 'Súper Saciante',
    ingredients: ['1 scoop de proteína de vainilla o canela', '35g de copos de avena', '1/2 manzana cocida al microondas con canela (1 min)', '220ml de leche desnatada o vegetal', 'Canela extra para decorar'],
    instructions: [
      'Cocina la manzana en un plato con canela al microondas por 1 minuto hasta que ablande.',
      'Añade la manzana, la avena, la proteína y la leche a la batidora.',
      'Licúa bien durante 1 minuto para disolver los copos de avena por completo.'
    ]
  },
  {
    id: 'rec_33',
    title: 'Batido Nocturno de Caseína & Crema de Almendras',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 36,
    calories: 280,
    carbs: 6,
    fat: 10,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Suministro continuo de aminoácidos durante las 8 horas de sueño regenerador.',
    tag: 'Anti-Catabólico',
    ingredients: ['1 scoop de proteína de caseína micelar (o yogur griego espeso)', '15g de crema de almendras pura', '200ml de leche de almendras sin azúcar', 'Pizca de nuez moscada o canela'],
    instructions: [
      'Mezcla la caseína con la leche fría en un shaker o batidora pequeña.',
      'Agrega la crema de almendras y bate suavemente.',
      'Tómalo 30 minutos antes de acostarte.'
    ]
  },
  {
    id: 'rec_34',
    title: 'Shake Choco-Avellana Fit (Sabor Nutella Proteica)',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 33,
    calories: 340,
    carbs: 22,
    fat: 12,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Grasas cardiosaludables y polifenoles que mejoran el flujo sanguíneo periférico.',
    tag: 'Antojo Dulce Fit',
    ingredients: ['1 scoop de proteína de chocolate', '15g de crema de avellanas 100% natural', '1 cucharadita de cacao desgrasado', '220ml de leche desnatada o bebida de avellana', 'Hielo'],
    instructions: [
      'Coloca la proteína, el cacao, la crema de avellanas y la leche en la batidora.',
      'Añade 3 cubitos de hielo.',
      'Bate a velocidad alta hasta emulsionar como una crema líquida.'
    ]
  },
  {
    id: 'rec_35',
    title: 'Batido Refrescante de Melón, Pepino & Proteína Neutra',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 28,
    calories: 190,
    carbs: 18,
    fat: 1,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Hidratación celular masiva tras entrenamientos en climas cálidos.',
    tag: 'Ultra Liviano',
    ingredients: ['1 scoop de proteína aislada sabor neutro o lima-limón', '150g de melón en dados', '1/2 pepino pelado', 'Unas hojas de menta fresca', '150ml de agua con gas o fría'],
    instructions: [
      'Licúa el melón, el pepino y las hojas de menta.',
      'Agrega la proteína en polvo y mezcla a velocidad baja para no generar exceso de espuma.',
      'Sirve en un vaso alto con hielo.'
    ]
  },
  {
    id: 'rec_36',
    title: 'Smoothie Cítrico Recuperador de Naranja & Suero',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 29,
    calories: 220,
    carbs: 24,
    fat: 2,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Vitamina C que potencia la biosíntesis de carnitina para transporte energético.',
    tag: 'Inmunidad & Músculo',
    ingredients: ['1 scoop de proteína de vainilla', 'Zumo de 1 naranja recién exprimida', '100g de yogur natural 0%', 'Ralladura fina de naranja', 'Hielo picado'],
    instructions: [
      'Vierte el zumo de naranja, el yogur y la proteína en el vaso.',
      'Bate intensamente 30 segundos.',
      'Sirve espolvoreando la ralladura de naranja por encima.'
    ]
  },
  {
    id: 'rec_37',
    title: 'Shake Vegano Power de Guisante, Arroz & Dátil',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 32,
    calories: 310,
    carbs: 34,
    fat: 5,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Combinación vegana óptima para puntaje químico de aminoácidos 100%.',
    tag: '100% Plant Protein',
    ingredients: ['1 scoop de proteína vegetal combinada (guisante + arroz)', '2 dátiles medjool sin hueso', '1 cucharadita de semillas de lino molidas', '250ml de leche de soja enriquecida'],
    instructions: [
      'Remoja los dátiles 5 minutos en agua tibia para ablandarlos.',
      'Licúa con la leche de soja, la proteína vegetal y las semillas de lino.',
      'Bate a fondo hasta que el dátil esté completamente integrado.'
    ]
  },
  {
    id: 'rec_38',
    title: 'Frappé Matcha Proteico Antioxidante',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 30,
    calories: 210,
    carbs: 14,
    fat: 3,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'EGCG que activa la termogénesis conservando el tejido muscular ganado.',
    tag: 'Antioxidante Zen',
    ingredients: ['1 scoop de proteína de vainilla', '1 cucharadita de té matcha ceremonial en polvo', '200ml de leche de avena o almendras', 'Hielo en cubos grandes'],
    instructions: [
      'Disuelve el té matcha en 30ml de agua templada con batidor.',
      'Añade a la licuadora con la leche, la proteína y el hielo.',
      'Bate hasta conseguir una espuma densa y homogénea.'
    ]
  },
  {
    id: 'rec_39',
    title: 'Batido Hiper-Calórico Limpio para Aumento Rápido',
    category: 'batidos',
    categoryLabel: 'Shakes Post-Entreno de Absorción Rápida',
    protein: 48,
    calories: 580,
    carbs: 65,
    fat: 15,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Superávit calórico controlado para alumnas que les cuesta ganar volumen glúteo.',
    tag: 'Gainer Casero',
    ingredients: ['2 scoops de proteína de chocolate', '50g de avena molida', '1 plátano maduro', '25g de crema de cacahuete', '300ml de leche entera o vegetal'],
    instructions: [
      'Añade primero los líquidos en el vaso de la licuadora.',
      'Agrega la avena, el plátano, la crema de cacahuete y la proteína.',
      'Bate durante 60 segundos completos para asegurar textura sedosa sin grumos.'
    ]
  },

  // ================= SNACKS & POSTRES FIT (13 Recetas) =================
  {
    id: 'rec_40',
    title: 'Mousse Proteico de Chocolate Negro & Yogur Griego en 2 Minutos',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 28,
    calories: 210,
    carbs: 12,
    fat: 4,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Elimina antojos de dulce nocturnos aportando 28g de proteína pura.',
    tag: 'Postre Anti-Ansiedad',
    ingredients: ['200g de yogur griego 0%', '1 scoop de proteína de chocolate o cacao puro con stevia', '1 onza de chocolate negro 85% rallado', '1 cucharadita de leche para emulsionar'],
    instructions: [
      'Coloca el yogur griego en un cuenco.',
      'Añade el scoop de proteína y la cucharadita de leche.',
      'Bate enérgicamente con una cuchara durante 1 minuto hasta que se vuelva cremoso y aireado.',
      'Corona con el chocolate negro 85% rallado por encima.'
    ]
  },
  {
    id: 'rec_41',
    title: 'Bolitas Energéticas Anabólicas de Avena, Dátiles & Cacahuete',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 24,
    calories: 290,
    carbs: 32,
    fat: 9,
    prepTime: '10 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Snack transportable para consumir 30 min antes de entrenar glúteos.',
    tag: 'Energy Bites',
    ingredients: ['1 scoop de proteína sabor vainilla o chocolate', '40g de avena en copos', '4 dátiles deshuesados picados', '1 cucharada colmada de crema de cacahuete', '1 cucharada de agua tibia'],
    instructions: [
      'Procesa los dátiles y la crema de cacahuete en un procesador o pica finamente.',
      'Mezcla con la avena y la proteína, añadiendo la cucharada de agua si es necesario.',
      'Forma 4 bolitas compactas con las manos.',
      'Refrigera 15 minutos para que endurezcan.'
    ]
  },
  {
    id: 'rec_42',
    title: 'Mug Cake Exprés de Chocolate al Microondas en 90 Segundos',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 31,
    calories: 260,
    carbs: 20,
    fat: 6,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Bizcocho esponjoso caliente con 31g de proteína sin romper el plan.',
    tag: 'Microondas 90s',
    ingredients: ['1 huevo entero', '1 scoop de proteína de chocolate', '1 cucharada de harina de avena', '1/2 cucharadita de levadura química', '2 cucharadas de leche vegetal'],
    instructions: [
      'Engrasa una taza apta para microondas con una gota de aceite.',
      'Mezcla todos los ingredientes directamente en la taza con un tenedor.',
      'Cocina en el microondas a máxima potencia durante 80-90 segundos.',
      'Deja templar 1 minuto y consume tibio.'
    ]
  },
  {
    id: 'rec_43',
    title: 'Helado Proteico de Frutos del Bosque (Solo 3 Ingredientes)',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 27,
    calories: 195,
    carbs: 18,
    fat: 2,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Sensación de helado artesanal con cero azúcar añadido para saciedad máxima.',
    tag: 'Helado Fit',
    ingredients: ['150g de frutos rojos completamente congelados', '120g de queso fresco batido 0% o yogur griego', '1 scoop de proteína de vainilla o fresa'],
    instructions: [
      'Coloca los frutos rojos congelados en un procesador de alimentos o batidora potente.',
      'Añade el queso fresco batido y la proteína en polvo.',
      'Tritura pulsando varias veces hasta lograr textura de helado cremoso.',
      'Sirve de inmediato en una copa.'
    ]
  },
  {
    id: 'rec_44',
    title: 'Galletas Crujientes de Avena, Plátano & Proteína',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 26,
    calories: 280,
    carbs: 38,
    fat: 5,
    prepTime: '15 min',
    difficulty: 'Fácil (10-15 min)',
    gluteBenefit: 'Snack crocante ideal para media tarde con cafeína antes del gimnasio.',
    tag: 'Sin Azúcar',
    ingredients: ['1 plátano maduro triturado', '50g de avena en copos', '1 scoop de proteína sabor galleta o vainilla', 'Pizca de canela y pepitas de chocolate 85%'],
    instructions: [
      'Precalienta el horno a 180°C.',
      'Chafa el plátano con un tenedor hasta hacerlo puré y mézclalo con la avena y la proteína.',
      'Forma 4 galletas sobre una bandeja con papel de horno.',
      'Hornea durante 12 minutos hasta que los bordes estén dorados.'
    ]
  },
  {
    id: 'rec_45',
    title: 'Pudding de Chía con Crema de Cacahuete & Nibs de Cacao',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 25,
    calories: 290,
    carbs: 16,
    fat: 14,
    prepTime: '5 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Grasas de combustión lenta que estabilizan la glucosa y reducen cortisol.',
    tag: 'Keto Friendly',
    ingredients: ['20g de semillas de chía', '1 scoop de proteína de chocolate', '180ml de leche de almendras', '1 cucharadita de crema de cacahuete', '1 cucharadita de nibs de cacao crujientes'],
    instructions: [
      'Disuelve la proteína en la leche y añade las semillas de chía.',
      'Deja reposar en la nevera durante 20 minutos (o déjalo listo la noche anterior).',
      'Remata con la cucharadita de crema de cacahuete y los nibs de cacao crujientes.'
    ]
  },
  {
    id: 'rec_46',
    title: 'Dip Salado Proteico de Requesón & Hierbas con Bastones de Verduras',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 29,
    calories: 180,
    carbs: 10,
    fat: 3,
    prepTime: '5 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Snack salado saciante para ver series sin picotear comida chatarra.',
    tag: 'Snack Salado',
    ingredients: ['200g de requesón o cottage 0%', 'Cebollino fresco y eneldo picados', '1 pizca de ajo en polvo y sal marina', 'Bastones de zanahoria, pepino y apio frescos'],
    instructions: [
      'Tritura o bate el requesón con un tenedor hasta que quede cremoso.',
      'Añade las hierbas frescas picadas, el ajo en polvo y la sal.',
      'Sirve en un bol acompañado de los bastones crujientes de verdura.'
    ]
  },
  {
    id: 'rec_47',
    title: 'Trufas Proteicas de Coco & Chocolate Blanco Fit',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 25,
    calories: 260,
    carbs: 14,
    fat: 12,
    prepTime: '10 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Ácidos grasos MCT del coco que se utilizan como combustible directo.',
    tag: 'Delicia de Coco',
    ingredients: ['1 scoop de proteína de vainilla', '30g de coco rallado deshidratado', '60g de queso crema light o yogur griego espeso', 'Unas gotas de extracto de vainilla'],
    instructions: [
      'Mezcla el queso crema con la proteína y la mitad del coco rallado.',
      'Forma bolitas con las manos ligeramente húmedas.',
      'Pasa las trufas por el resto del coco rallado para rebozarlas.',
      'Refrigera 20 minutos antes de servir.'
    ]
  },
  {
    id: 'rec_48',
    title: 'Parfait Capas de Yogur Griego, Proteína & Manzana Salteada',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 30,
    calories: 270,
    carbs: 28,
    fat: 3,
    prepTime: '6 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Pectina de la manzana que favorece la microbiota intestinal asimiladora.',
    tag: 'Vaso Gourmet',
    ingredients: ['180g de yogur griego 0%', '1/2 scoop de proteína de vainilla', '1/2 manzana salteada 2 min con canela', '1 cucharada de nueces picadas'],
    instructions: [
      'Saltea la manzana en cubos con canela en una sartén pequeña durante 2 minutos.',
      'Mezcla el yogur griego con la proteína de vainilla.',
      'En un vaso transparente, alterna capas de crema de yogur y manzana tibia.',
      'Decora con las nueces picadas por encima.'
    ]
  },
  {
    id: 'rec_49',
    title: 'Brownie Proteico al Microondas en Taza (Húmedo & Denso)',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 28,
    calories: 250,
    carbs: 22,
    fat: 5,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Flavonoides del cacao que mejoran la oxigenación muscular post-fatiga.',
    tag: 'Chocoholic',
    ingredients: ['1 scoop de proteína de chocolate', '1 cucharada de harina de avena', '1 cucharada de cacao puro desgrasado', '1 clara de huevo', '3 cucharadas de leche desnatada o vegetal'],
    instructions: [
      'Integra todos los ingredientes secos en una taza.',
      'Añade la clara de huevo y la leche, batiendo con un tenedor hasta que no haya grumos.',
      'Cocina en el microondas durante solo 60-70 segundos para que el centro quede fundido.',
      'Come directamente con cuchara.'
    ]
  },
  {
    id: 'rec_50',
    title: 'Gelatina Proteica de Fresa con Capa de Yogur',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 24,
    calories: 140,
    carbs: 6,
    fat: 1,
    prepTime: '5 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Colágeno y aminoácidos glicina-prolina para soporte fascial en glúteos.',
    tag: 'Ultra Low Cal',
    ingredients: ['1 sobre de gelatina sin azúcar sabor fresa', '1 scoop de proteína aislada de fresa o vainilla', '150g de queso fresco batido 0%', '250ml de agua caliente + 250ml de agua fría'],
    instructions: [
      'Disuelve la gelatina en el agua caliente y luego añade el agua fría.',
      'Bate la mitad de la gelatina tibia con el queso batido y la proteína.',
      'Vierte en copas y refrigera 2 horas hasta que cuaje firmemente.',
      'Un snack ultra refrescante con solo 140 kcal y 24g de proteína.'
    ]
  },
  {
    id: 'rec_51',
    title: 'Rollitos de Jamón Serrano, Huevo Cocido & Espárragos',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 30,
    calories: 220,
    carbs: 3,
    fat: 10,
    prepTime: '4 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Sodio equilibrado y electrolitos para reponer tras sesiones de sudoración intensa.',
    tag: 'Snack Salado Rápido',
    ingredients: ['60g de jamón serrano sin tocino visible', '2 huevos cocidos en cuartos', '6 puntas de espárragos en conserva', 'Pimienta negra'],
    instructions: [
      'Extiende las lonchas de jamón serrano sobre una tabla.',
      'Coloca un cuarto de huevo cocido y una punta de espárrago en cada una.',
      'Enrolla firmemente y asegura con un palillo.',
      'Listo en 4 minutos sin necesidad de encender la cocina.'
    ]
  },
  {
    id: 'rec_52',
    title: 'Tortitas de Arroz con Mousse de Requesón, Cacao & Frutos Rojos',
    category: 'snacks-postres',
    categoryLabel: 'Snacks & Postres Fit para Antojos',
    protein: 25,
    calories: 210,
    carbs: 24,
    fat: 2,
    prepTime: '3 min',
    difficulty: 'Exprés (5 min)',
    gluteBenefit: 'Carbohidratos crujientes de índice glicémico medio para recargar energía limpia.',
    tag: 'Crujiente Fit',
    ingredients: ['2 tortitas de arroz integral inflado', '120g de requesón 0%', '1 cucharadita de cacao puro', 'Gotas de stevia', 'Arándanos frescos'],
    instructions: [
      'Mezcla el requesón con el cacao y la stevia hasta que parezca crema de chocolate.',
      'Unta generosamente sobre las tortitas de arroz integral.',
      'Corona con arándanos frescos y come de inmediato para mantener el crunch.'
    ]
  }
];
