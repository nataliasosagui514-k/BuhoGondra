// Pantallas de Puntos. Las cuentas vienen de js/puntos.js.

/* ---------- Progreso de puntos (Figma 874:3463) ---------- */

// En la barra de Figma, el último nivel queda en 280.5 de 292 px: ahí va el 100 % del
// camino. Con el nivel máximo, el avance llena la barra entera.
const ANCHO_DEL_CAMINO = 280.5 / 292;

function formatearDiaYMes(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
  });
}

// "Aún sin nivel", "Nivel Búhi Pro" o "Nivel máximo: Búhi Supremo"
function describirNivel({ nombre, alcanzados, siguiente }) {
  if (!alcanzados) {
    return "Aún sin nivel";
  }
  return siguiente ? `Nivel ${nombre}` : `Nivel máximo: ${nombre}`;
}

function describirLoQueFalta({ siguiente, faltan }) {
  if (!siguiente) {
    // TODO: Figma usa esta frase aunque algún premio ya haya vencido
    return "¡Ya puedes canjear tus 3 premios!";
  }
  // TODO: Figma no muestra el singular ("Te falta 1 punto")
  const cantidad = faltan === 1 ? "Te falta 1 punto" : `Te faltan ${faltan} puntos`;
  return `${cantidad} para ${siguiente.nombre}`;
}

// Un círculo de la barra con el nombre del nivel y sus puntos.
function crearMetaDeNivel(meta, alcanzada) {
  const elemento = crearElemento("li", "progreso__meta");
  elemento.classList.toggle("progreso__meta--alcanzada", alcanzada);
  elemento.style.setProperty("--posicion", calcularAvance(meta.puntos) * ANCHO_DEL_CAMINO);
  const circulo = crearElemento("span", "progreso__circulo");
  if (alcanzada) {
    circulo.append(crearIconoSvg("progreso__palomita", 14, ["M2.92 7.29L5.54 9.92L11.08 4.38"]));
    circulo.setAttribute("aria-label", "Alcanzado");
    circulo.setAttribute("role", "img");
  }
  elemento.append(
    circulo,
    crearElemento("span", "progreso__nombre", meta.nombre.replace("Búhi ", "Búhi\n")),
    crearElemento("span", "progreso__pts", `${meta.puntos} pts`),
  );
  return elemento;
}

// La tarjeta cambia según cuántos niveles se han alcanzado (0 a 3).
function crearProgresoDePuntos(puntos) {
  const nivel = calcularNivel(puntos);
  const cantidad = crearElemento("p", "progreso__cantidad");
  cantidad.append(
    crearElemento("span", "progreso__numero", String(puntos)),
    crearElemento("span", "progreso__unidad", puntos === 1 ? "punto" : "puntos"),
  );
  const textos = crearElemento("div", "progreso__textos");
  textos.append(
    crearElemento("h2", "progreso__etiqueta", "Tus puntos"),
    cantidad,
    crearElemento("p", "progreso__nivel", describirNivel(nivel)),
    crearElemento("p", "progreso__mensaje", describirLoQueFalta(nivel)),
  );

  const buho = document.createElement("img");
  buho.className = "progreso__buho";
  buho.src = "img/buho-puntos.png";
  buho.alt = "";
  const marco = crearElemento("div", "progreso__marco-buho");
  marco.append(buho);
  const encabezado = crearElemento("div", "progreso__encabezado");
  encabezado.append(textos, marco);

  const metas = crearElemento("ol", "progreso__metas");
  metas.append(
    ...NIVELES_PUNTOS.map((meta, posicion) =>
      crearMetaDeNivel(meta, posicion < nivel.alcanzados),
    ),
  );
  const avance = crearElemento("span", "progreso__avance");
  avance.style.setProperty(
    "--avance",
    nivel.siguiente ? calcularAvance(puntos) * ANCHO_DEL_CAMINO : 1,
  );
  const pista = crearElemento("span", "progreso__pista");
  pista.append(avance);
  const barra = crearElemento("div", "progreso__barra");
  barra.append(pista, metas);

  const tarjeta = crearElemento("section", `progreso progreso--${nivel.alcanzados}`);
  tarjeta.append(encabezado, barra);
  return tarjeta;
}

/* ---------- Tarjeta de premio (Figma 1002:4641) ---------- */

const ESTADOS_DE_PREMIO = {
  Bloqueado: {
    clase: "bloqueado",
    // TODO: Figma no muestra el singular ("Te falta 1 pt")
    detalle: ({ faltan }) => (faltan === 1 ? "Te falta 1 pt" : `Te faltan ${faltan} pts`),
    crearAccion: () => crearMarcaDePremio("premio__candado", 24, [
      "M7 11H17C18.1 11 19 11.9 19 13V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V13" +
        "C5 11.9 5.9 11 7 11Z",
      "M8 11V7C8 5.94 8.42 4.92 9.17 4.17C9.92 3.42 10.94 3 12 3C13.06 3 14.08 3.42 " +
        "14.83 4.17C15.58 4.92 16 5.94 16 7V11",
    ], "Premio bloqueado"),
  },
  Disponible: {
    clase: "disponible",
    detalle: ({ venceEl }) => `Vence el ${formatearDiaYMes(venceEl)}`,
    crearAccion: (premio, { alCanjear }) =>
      crearBotonDePremio("Canjear", "primario", () => alCanjear(premio)),
  },
  "Por recoger": {
    clase: "por-recoger",
    detalle: ({ venceEl }) => `Recógelo antes del ${formatearDiaYMes(venceEl)}`,
    crearAccion: (premio, { alVerTicket }) =>
      crearBotonDePremio("Ver ticket", "contorno", () => alVerTicket(premio)),
  },
  Vencido: {
    clase: "vencido",
    detalle: ({ venceEl }) => `Venció el ${formatearDiaYMes(venceEl)}`,
    crearAccion: () => {
      const insignia = crearElemento("p", "premio__insignia");
      insignia.append(
        crearIconoSvg("premio__insignia-icono", 14, [
          "M12.54 7C12.54 10.06 10.06 12.54 7 12.54C3.94 12.54 1.46 10.06 1.46 7" +
            "C1.46 3.94 3.94 1.46 7 1.46C10.06 1.46 12.54 3.94 12.54 7Z",
          "M3.21 10.79L10.79 3.21",
        ]),
        "Vencido",
      );
      return insignia;
    },
  },
};

// El candado: un icono en un círculo, que no se puede tocar.
function crearMarcaDePremio(clase, caja, trazos, descripcion) {
  const marca = crearElemento("span", clase);
  marca.setAttribute("role", "img");
  marca.setAttribute("aria-label", descripcion);
  marca.append(crearIconoSvg("icono", caja, trazos));
  return marca;
}

function crearBotonDePremio(texto, tipo, alTocar) {
  const boton = crearElemento(
    "button",
    `boton boton--${tipo} boton--mediano premio__boton`,
    texto,
  );
  boton.type = "button";
  boton.addEventListener("click", alTocar);
  return boton;
}

// Única función que crea una tarjeta de premio. "acciones": alCanjear y alVerTicket.
function crearTarjetaDePremio(premio, acciones) {
  const estado = ESTADOS_DE_PREMIO[premio.estado];

  const foto = document.createElement("img");
  foto.className = "premio__foto";
  foto.src = premio.foto;
  foto.alt = "";
  const talon = crearElemento("div", "premio__talon");
  talon.append(foto);

  const textos = crearElemento("div", "premio__textos");
  textos.append(
    // Las mayúsculas las pone el estilo
    crearElemento("p", "premio__nivel", `${premio.nivel} · ${premio.meta} pts`),
    crearElemento("h3", "premio__nombre", premio.nombre),
    crearElemento("p", "premio__detalle", estado.detalle(premio)),
  );
  const cuerpo = crearElemento("div", "premio__cuerpo");
  cuerpo.append(textos, estado.crearAccion(premio, acciones));

  const tarjeta = crearElemento("article", `premio premio--${estado.clase}`);
  tarjeta.append(talon, cuerpo);
  const elemento = crearElemento("li", "premios__elemento");
  elemento.append(tarjeta);
  return elemento;
}

/* ---------- Puntos (Figma 1003:4398) ---------- */

function dibujarPuntos(contenedor) {
  const lista = contenedor.querySelector(".premios");
  const acciones = {
    alCanjear: () => {},
    alVerTicket: () => {},
  };
  contenedor
    .querySelector(".puntos__progreso")
    .replaceChildren(crearProgresoDePuntos(calcularPuntosTotales()));
  lista.replaceChildren(
    ...obtenerPremiosDeLaSesion().map((premio) => crearTarjetaDePremio(premio, acciones)),
  );
}
