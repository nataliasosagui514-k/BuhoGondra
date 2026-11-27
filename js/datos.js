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
/* "recogida" es la forma de la línea "Recógelo de 2:00 a 5:30 p. m.": concuerda en género
   y número con el nombre de cada platillo. Donde Figma muestra otra forma, manda Figma
   ("Recógelas" en las empanadas, cuyo nombre está en singular). */
const tipico = (id, nombre, precio, extras) =>
  crearPlatillo(id, nombre, "tipicos", precio, { recogida: "Recógelo", ...extras });
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

/* "enCombo" es cómo se nombra cada alternativa en la caja "El combo incluye" del
   detalle (Figma 1193:7688). Esa frase no menciona "Sin guarnición" ni "Sin ensalada".
   "imagen" es la foto de la tarjeta de "Personaliza tu plato", recortada como en Figma
   (nota 1347:9329: algunas son ilustraciones provisionales). */
const crearValor = (nombre, foto, enCombo) => ({
  nombre,
  imagen: `img/acomp-${foto}.png`,
  ...(enCombo && { enCombo }),
});
const GUARNICION = {
  id: "guarnicion",
  nombre: "Guarnición",
  valores: [
    crearValor("Arroz", "arroz", "Arroz"),
    crearValor("Casamiento", "casamiento", "casamiento"),
    crearValor("Sin guarnición", "sin"),
  ],
  porDefecto: "Arroz",
};
const ENSALADA = {
  id: "ensalada",
  nombre: "Ensalada",
  valores: [
    crearValor("Ensalada fresca", "ensalada-fresca", "Ensalada fresca"),
    crearValor("Ensalada de coditos", "ensalada-coditos", "de coditos"),
    crearValor("Vegetales al vapor", "vegetales", "vegetales al vapor"),
    crearValor("Sin ensalada", "sin"),
  ],
  porDefecto: "Ensalada fresca",
};
const BEBIDA = {
  id: "bebida",
  nombre: "Bebida",
  valores: [
    crearValor("Fresco de tamarindo", "tamarindo", "Fresco de tamarindo"),
    crearValor("Fresco de Jamaica", "jamaica", "de Jamaica"),
  ],
  porDefecto: "Fresco de tamarindo",
};
const TORTILLAS = {
  id: "tortillas",
  nombre: "Tortillas",
  prefijoEnCombo: "Tortillas: ",
  valores: [
    crearValor("2 tortillas", "tortillas-2", "2"),
    crearValor("1 tortilla", "tortillas-1", "1"),
    crearValor("Sin tortillas", "sin", "ninguna"),
  ],
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
  recogida: "Recógelas",
});
const empanadaFrijol = tipico("empanada-de-frijol", "Empanada de frijol", 0.75, {
  eligeCantidad: true,
  recogida: "Recógelas",
});
const pastelitoPollo = tipico("pastelito-de-pollo", "Pastelito de pollo", 0.65);
const pastelitoRes = tipico("pastelito-de-res", "Pastelito de res", 0.65);
const tamalPollo = tipico("tamal-de-pollo", "Tamal de pollo", 0.95);
const tamalChipilin = tipico("tamal-de-chipilin", "Tamal de chipilín", 0.95);
const tamales = tipico("tamales", "Tamales", 0.95, { recogida: "Recógelos" });
// Los dos tipos cuestan lo mismo: el precio es el del platillo, por unidad
const pupusas = tipico("pupusas", "Pupusas", 0.8, {
  eligeCantidad: true,
  recogida: "Recógelas",
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

/* TODO: en sábado y domingo la app abre el último día con menú de MENU_SEMANA (viernes 27).
   Figma (nota 1176:7472) pide el lunes siguiente: cambiar cuando haya datos de la semana
   siguiente. */
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
      tipico("canoa-de-leche", "Canoa de leche", 1.35, {
        eligeCantidad: true,
        recogida: "Recógela",
      }),
      tipico("canoa-de-frijol", "Canoa de frijol", 1.35, {
        eligeCantidad: true,
        recogida: "Recógela",
      }),
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
      /* TODO: falta decidir si se elige entre yuca frita o sancochada. Ninguna pantalla de
         Figma lo muestra; la nota 1320:8575 dice "dos opciones con el mismo precio" y lo
         deja en la lista para revisar con Funda Gondra. */
      tipico("yuca-frita-o-sancochada", "Yuca frita o sancochada", 1.35, {
        recogida: "Recógela",
      }),
      tipico("poleada", "Poleada", 1.0, { recogida: "Recógela" }),
      tipico("enchilada", "Enchilada", 1.25, { recogida: "Recógela" }),
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
      tipico("nuegados", "Nuégados", 1.0, { recogida: "Recógelos" }),
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
  // Cada 15 minutos, como los almuerzos (nota de Figma 1375:9318)
  recogerTipicos: { desde: "14:00", hasta: "17:30", cadaMinutos: 15 },
};

const LIMITE_UNIDADES_POR_PEDIDO = null; // null: no hay límite

// Niveles de puntos y premio de cada uno, de menor a mayor. "id" es el del premio.
// TODO: no hay fotos de los premios; se usan las imágenes marcador de Figma. "fotoGrande"
// es la de "Premio canjeado", que Figma solo dibuja para el postre.
const NIVELES_PUNTOS = [
  {
    id: "buhi-pro",
    nombre: "Búhi Pro",
    puntos: 50,
    premio: "Postre",
    foto: "img/premio-postre.png",
    fotoGrande: "img/premio-postre-grande.png",
  },
  {
    id: "buhi-mega-pro",
    nombre: "Búhi Mega Pro",
    puntos: 100,
    premio: "Típico",
    foto: "img/premio-tipico.png",
    fotoGrande: null,
  },
  {
    id: "buhi-supremo",
    nombre: "Búhi Supremo",
    puntos: 150,
    premio: "Plato fuerte",
    foto: "img/premio-plato-fuerte.png",
    fotoGrande: null,
  },
];

/* Opiniones de ejemplo, marcadas con "ejemplo": true. Cubren SOLO algunos platillos
   (croissant, croquetas y pupusas); los demás muestran "Todavía no hay opiniones" (M5c).
   Promedio y número de cada uno coinciden con Figma (M2, M3 y M24). Los nombres y textos
   del croissant son los de M5; el resto es relleno sin texto. "buho" es el avatar.
   No tienen fecha fija: guardan hace cuántos días se escribieron y la fecha se calcula
   al mostrarlas (ver obtenerOpiniones). */
function crearOpinionDeEjemplo(platilloId, autor, calificacion, haceDias, texto, buho) {
  return { platilloId, autor, calificacion, texto, haceDias, buho, ejemplo: true };
}

// Una opinión sin texto por cada calificación, una por día hacia atrás desde "desde".
function crearOpinionesDeRelleno(platilloId, calificaciones, desde) {
  return calificaciones.map((calificacion, posicion) => {
    const autor = `Persona de ejemplo ${posicion + 1}`;
    const buho = (posicion % 6) + 1;
    return crearOpinionDeEjemplo(platilloId, autor, calificacion, desde + posicion, "", buho);
  });
}

const OPINIONES_DE_EJEMPLO = [
  // Los días de estas cuatro dan los textos de M5: 2 y 4 días, 1 y 2 semanas
  crearOpinionDeEjemplo(croissant.id, "María López", 5, 2,
    "Crujiente y bien relleno. El refresco venía frío. Lo vuelvo a pedir.", 3),
  crearOpinionDeEjemplo(croissant.id, "Carlos Ramírez", 4, 4,
    "Buen tamaño para el precio. Me gustaría que trajera un poco más de queso.", 1),
  crearOpinionDeEjemplo(croissant.id, "Ana Martínez", 5, 7,
    "Perfecto para un almuerzo rápido entre clases.", 5),
  crearOpinionDeEjemplo(croissant.id, "José Hernández", 5, 14, "", 6),
  // Con las cuatro de arriba: 8 de cinco, 3 de cuatro y 1 de tres estrellas
  ...crearOpinionesDeRelleno(croissant.id, [5, 4, 5, 3, 5, 4, 5, 5], 21),
  ...crearOpinionesDeRelleno("croquetas-de-pollo", [5, 4, 4, 5, 4, 4, 4, 4], 8),
  // 21 opiniones: 17 de cinco y 4 de cuatro estrellas
  ...crearOpinionesDeRelleno(
    pupusas.id,
    Array.from({ length: 21 }, (_, posicion) => (posicion % 5 === 4 ? 4 : 5)),
    3,
  ),
];
