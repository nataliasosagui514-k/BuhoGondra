// Datos de BúhoGondra: menú de la semana, cafeterías, horarios y puntos.
// Cada platillo se escribe una sola vez y los días lo reutilizan.
// Un valor null significa que el dato no existe o no está confirmado.

// Puntos que da cada platillo según su categoría (los complementos no tienen).
const PUNTOS_POR_CATEGORIA = {
  economicos: 1,
  "platos-fuertes": 3,
  tipicos: 2,
  complementos: null,
  "mas-complementos": null,
};

// Cuándo se recoge cada categoría: "almuerzo" o "tipicos" (las horas están en HORARIOS).
const VENTANA_POR_CATEGORIA = {
  economicos: "almuerzo",
  "platos-fuertes": "almuerzo",
  tipicos: "tipicos",
  complementos: "almuerzo",
  "mas-complementos": "almuerzo",
};

const CATEGORIAS = {
  economicos: { nombre: "Económicos" },
  "platos-fuertes": { nombre: "Platos fuertes" },
  tipicos: { nombre: "Típicos de la tarde" },
  complementos: { nombre: "Complementos" },
  "mas-complementos": { nombre: "Más complementos", sinPrecio: true },
};

// Crea un platillo. "extras" cambia solo lo que no es igual al valor normal.
function crearPlatillo(id, nombre, categoria, precio, extras = {}) {
  return {
    id,
    nombre,
    categoria,
    precio,
    eligeCantidad: false,
    puntos: PUNTOS_POR_CATEGORIA[categoria],
    ventana_recogida: VENTANA_POR_CATEGORIA[categoria],
    disponible: true,
    foto: null, // las fotos llegan en otra fase
    ...extras,
  };
}

const economico = (id, nombre, precio, extras) =>
  crearPlatillo(id, nombre, "economicos", precio, extras);
const tipico = (id, nombre, precio, extras) =>
  crearPlatillo(id, nombre, "tipicos", precio, extras);
const complemento = (id, nombre, precio, extras) =>
  crearPlatillo(id, nombre, "complementos", precio, extras);
const otroComplemento = (id, nombre) =>
  crearPlatillo(id, nombre, "mas-complementos", null);

/* Opciones. Cada grupo tiene sus valores y, si existe, el valor por defecto.
   Un valor con precio propio reemplaza al precio del platillo. */
const SOLO_LA_PORCION = {
  id: "presentacion",
  valores: [{ nombre: "Solo la porción", precio: 1.75 }],
  porDefecto: null, // si no se elige, vale el precio del platillo
};

const GUARNICION = {
  id: "guarnicion",
  nombre: "Guarnición",
  valores: [{ nombre: "Arroz" }, { nombre: "Casamiento" }, { nombre: "Sin guarnición" }],
  porDefecto: "Arroz",
};
const ENSALADA = {
  id: "ensalada",
  nombre: "Ensalada",
  valores: [
    { nombre: "Ensalada fresca" },
    { nombre: "Ensalada de coditos" },
    { nombre: "Vegetales al vapor" },
    { nombre: "Sin ensalada" },
  ],
  porDefecto: "Ensalada fresca",
};
const BEBIDA = {
  id: "bebida",
  nombre: "Bebida",
  valores: [{ nombre: "Fresco de Tamarindo" }, { nombre: "Fresco de Jamaica" }],
  porDefecto: "Fresco de Tamarindo",
};
const TORTILLAS = {
  id: "tortillas",
  nombre: "Tortillas",
  valores: [{ nombre: "2 tortillas" }, { nombre: "1 tortilla" }, { nombre: "Sin tortillas" }],
  porDefecto: "2 tortillas",
};

const platoFuerte = (id, nombre, precio) =>
  crearPlatillo(id, nombre, "platos-fuertes", precio, {
    opciones: [GUARNICION, ENSALADA, BEBIDA, TORTILLAS],
  });
// Las sopas no llevan guarnición ni ensalada
const sopa = (id, nombre, precio) =>
  crearPlatillo(id, nombre, "platos-fuertes", precio, { opciones: [BEBIDA, TORTILLAS] });

// Platillos que se repiten en varios días
const croissant = economico("croissant-de-jamon-y-queso", "Croissant de jamón y queso", 2.75, {
  incluye: "papas y refresco pequeño",
});
const filetePollo = platoFuerte("filete-de-pollo", "Filete de pollo", 4.0);
const empanadaLeche = tipico("empanada-de-leche", "Empanada de leche", 0.75, {
  eligeCantidad: true,
});
const empanadaFrijol = tipico("empanada-de-frijol", "Empanada de frijol", 0.75, {
  eligeCantidad: true,
});
const pastelitoPollo = tipico("pastelito-de-pollo", "Pastelito de pollo", 0.65);
const pastelitoRes = tipico("pastelito-de-res", "Pastelito de res", 0.65);
const tamalPollo = tipico("tamal-de-pollo", "Tamal de pollo", 0.95);
const tamalChipilin = tipico("tamal-de-chipilin", "Tamal de chipilín", 0.95);
const tamales = tipico("tamales", "Tamales", 0.95);
// Los dos tipos cuestan lo mismo: el precio es el del platillo, por unidad
const pupusas = tipico("pupusas", "Pupusas", 0.8, {
  eligeCantidad: true,
  opciones: [
    {
      id: "tipo",
      nombre: "Tipo",
      valores: [{ nombre: "Frijol con queso" }, { nombre: "Revuelta" }],
      porDefecto: null,
    },
  ],
});

// Complementos: iguales todos los días
const COMPLEMENTOS = [
  // No tiene un precio único: se elige una opción al apartar
  complemento("ensalada-cesar", "Ensalada César", null, {
    opciones: [
      {
        id: "presentacion",
        valores: [
          { nombre: "Solo la ensalada", precio: 3.5 },
          { nombre: "En combo", precio: 4.0, incluye: "pollo, aderezo y queso" },
        ],
        porDefecto: null,
      },
    ],
  }),
  complemento("papa-francesa", "Papa francesa", 1.75, { incluye: "porción con aderezos" }),
  complemento("papa-sazonada", "Papa sazonada", 1.75, {
    incluye: "porción sazonada con aderezos",
  }),
];
const MAS_COMPLEMENTOS = [
  otroComplemento("ensalada-fresca", "Ensalada fresca"),
  otroComplemento("vegetales-al-vapor", "Vegetales al vapor"),
  otroComplemento("casamiento", "Casamiento"),
];

/* Arma un día. Cada día recibe su propia copia de los platillos, para poder
   marcar uno como agotado sin afectar a los demás días. */
function crearDia(nombre, fecha, platillosPorCategoria) {
  const todos = {
    ...platillosPorCategoria,
    complementos: COMPLEMENTOS,
    "mas-complementos": MAS_COMPLEMENTOS,
  };
  const categorias = Object.entries(todos).map(([id, platillos]) => ({
    id,
    ...CATEGORIAS[id],
    platillos: platillos.map((platillo) => ({ ...platillo })),
  }));
  return { nombre, fecha, categorias };
}

const MENU_SEMANA = {
  lunes: crearDia("Lunes", "2026-11-23", {
    economicos: [
      croissant,
      economico("croquetas-de-pollo", "Croquetas de pollo", 2.75, {
        opciones: [SOLO_LA_PORCION],
      }),
    ],
    "platos-fuertes": [
      filetePollo,
      sopa("sopa-de-pollo", "Sopa de pollo", 3.5),
      platoFuerte("cuarto-de-pollo-horneado", "1/4 de pollo horneado", 4.0),
      platoFuerte("chop-suey", "Chop suey", 4.0),
      platoFuerte("crepa-de-res", "Crepa de res", 4.0),
    ],
    tipicos: [
      empanadaLeche,
      empanadaFrijol,
      tipico("arroz-en-leche", "Arroz en leche", 0.8),
      pastelitoPollo,
      tamalPollo,
      tamalChipilin,
      pupusas,
    ],
  }),

  martes: crearDia("Martes", "2026-11-24", {
    economicos: [
      economico("hamburguesa-de-res-y-pollo", "Hamburguesa de res y pollo", 2.75, {
        incluye: "combo con papas y fresco pequeño",
      }),
      economico("espagueti-con-carne", "Espagueti con carne", 2.75, {
        opciones: [SOLO_LA_PORCION],
      }),
    ],
    "platos-fuertes": [
      filetePollo,
      sopa("sopa-de-frijoles", "Sopa de frijoles", 3.5),
      platoFuerte("cuarto-de-pollo-empanizado", "1/4 de pollo empanizado", 4.5),
      platoFuerte("bistec-encebollado", "Bistec encebollado", 4.0),
      platoFuerte("lasana-de-pollo", "Lasaña de pollo", 4.0),
    ],
    tipicos: [
      tipico("canoa-de-leche", "Canoa de leche", 1.35, { eligeCantidad: true }),
      tipico("canoa-de-frijol", "Canoa de frijol", 1.35, { eligeCantidad: true }),
      tipico("atol-de-maiz-tostado", "Atol de maíz tostado", 1.0),
      pastelitoRes,
      tamalPollo,
      tamalChipilin,
      pupusas,
    ],
  }),

  miercoles: crearDia("Miércoles", "2026-11-25", {
    economicos: [
      croissant,
      economico("papa-con-huevo", "Papa con huevo", 2.75, { opciones: [SOLO_LA_PORCION] }),
    ],
    "platos-fuertes": [
      filetePollo,
      sopa("sopa-de-res", "Sopa de res", 3.5),
      platoFuerte("cuarto-de-pollo-en-salsa-de-cilantro", "1/4 de pollo en salsa de cilantro", 4.0),
      platoFuerte("carne-guisada", "Carne guisada", 4.0),
      // El viernes hay otra lonja con precio distinto: por eso el id lleva el día
      platoFuerte("lonja-empanizada-miercoles", "Lonja empanizada", 5.0),
    ],
    tipicos: [
      tipico("platano-en-miel", "Plátano en miel", 1.75),
      tipico("yuca-frita-o-sancochada", "Yuca frita o sancochada", 1.35, {
        opciones: [
          {
            id: "preparacion",
            nombre: "Preparación",
            valores: [{ nombre: "Frita" }, { nombre: "Sancochada" }],
            porDefecto: null,
          },
        ],
      }),
      tipico("poleada", "Poleada", 1.0),
      tipico("enchilada", "Enchilada", 1.25),
      tamales,
      pupusas,
    ],
  }),

  jueves: crearDia("Jueves", "2026-11-26", {
    economicos: [
      economico("quesadilla-mexicana", "Quesadilla mexicana", 2.75),
      economico("chilaquila", "Chilaquila", 2.75, { opciones: [SOLO_LA_PORCION] }),
    ],
    "platos-fuertes": [
      filetePollo,
      sopa("sopa-de-pata", "Sopa de pata", 4.5),
      platoFuerte("cuarto-de-pollo-guisado", "1/4 de pollo guisado", 4.0),
      platoFuerte("lasana-bolonesa", "Lasaña boloñesa", 4.0),
      platoFuerte("carne-deshilada", "Carne deshilada", 4.0),
    ],
    tipicos: [
      empanadaLeche,
      empanadaFrijol,
      tipico("pancito-con-pollo", "Pancito con pollo", 1.3),
      tipico("nuegados", "Nuégados", 1.0),
      tamales,
      pupusas,
    ],
  }),

  viernes: crearDia("Viernes", "2026-11-27", {
    economicos: [
      economico("club-sandwich", "Club sándwich", 2.75, {
        incluye: "papas y refresco pequeño",
      }),
      economico("relleno-de-coli", "Relleno de coli", 2.75, { opciones: [SOLO_LA_PORCION] }),
    ],
    "platos-fuertes": [
      filetePollo,
      sopa("sopa-de-tortillas", "Sopa de tortillas", 4.0),
      platoFuerte("cuarto-de-pollo-a-la-plancha", "1/4 de pollo a la plancha", 4.0),
      platoFuerte("carne-a-la-plancha", "Carne a la plancha", 4.0),
      platoFuerte("lonja-empanizada-viernes", "Lonja empanizada", 5.5),
    ],
    tipicos: [
      tipico("pastel-de-platano", "Pastel de plátano", 1.75),
      tipico("raspado-de-elote", "Raspado de elote", 1.7),
      pastelitoRes,
      tamales,
      pupusas,
    ],
  }),
};

// Una const no se agrega sola a window: se expone para revisarla como window.MENU_SEMANA
window.MENU_SEMANA = MENU_SEMANA;

// Cafeterías
const CAFETERIAS = [
  { id: "jardines", nombre: "Jardines", predeterminada: false },
  { id: "central", nombre: "Central", predeterminada: true },
  { id: "icas", nombre: "ICAS", predeterminada: false },
];

// Horarios en formato de 24 horas
const HORARIOS = {
  apartar: { desde: "08:00", hasta: "11:00" },
  recogerAlmuerzos: { desde: "12:00", hasta: "14:00", cadaMinutos: 15 },
  recogerTipicos: { desde: "14:00", hasta: "17:30", cadaMinutos: null }, // intervalo sin definir
};

const LIMITE_UNIDADES_POR_PEDIDO = null; // null: no hay límite

// Niveles de puntos y premio de cada uno
const NIVELES_PUNTOS = [
  { nombre: "Búhi Pro", puntos: 50, premio: "Postre" },
  { nombre: "Búhi Mega Pro", puntos: 100, premio: "Típico" },
  { nombre: "Búhi Supremo", puntos: 150, premio: "Plato fuerte" },
];
