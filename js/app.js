// Navegación por hash y avisos de BúhoGondra.

// Las pantallas de cuenta dibujan todo su contenido y no llevan barra.
function crearPantallaDeCuenta(titulo, preparar) {
  return {
    titulo,
    enBarra: false,
    sinEncabezado: true,
    sinNavegacion: true,
    plantilla: "plantilla-cuenta",
    preparar,
  };
}

// Pantallas disponibles. Las que no están en la barra muestran el botón de volver.
const pantallas = {
  // El menú dibuja su propio encabezado
  "#/menu": {
    titulo: "Menú",
    enBarra: true,
    sinEncabezado: true,
    plantilla: "plantilla-menu",
    preparar: dibujarMenu,
  },
  "#/puntos": {
    titulo: "Puntos",
    enBarra: true,
    sinEncabezado: true,
    plantilla: "plantilla-puntos",
    preparar: dibujarPuntos,
  },
  "#/puntos/ayuda": {
    titulo: "Puntos y premios",
    enBarra: false,
    sinEncabezado: true,
    sinNavegacion: true,
    pestana: "#/puntos",
    plantilla: "plantilla-ayuda-puntos",
    preparar: dibujarAyudaDePuntos,
  },
  "#/mas": { titulo: "Más", enBarra: true },
  // Se abre con el calendario del menú; también dibuja su propio encabezado
  "#/semana": {
    titulo: "Menú de la semana",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    plantilla: "plantilla-semana",
    preparar: dibujarSemana,
  },
  // Cuenta: sin barra (se dibujan en js/vista-cuenta.js)
  "#/splash": crearPantallaDeCuenta("BúhoGondra", (c) => dibujarSplash(c)),
  "#/login": crearPantallaDeCuenta("Inicia sesión", (c) => dibujarLogin(c)),
  "#/registro/correo": crearPantallaDeCuenta("Crea tu cuenta", (c) => dibujarRegistroCorreo(c)),
  "#/registro/codigo": crearPantallaDeCuenta("Verifica tu correo", (c) => dibujarRegistroCodigo(c)),
  "#/registro/datos": crearPantallaDeCuenta("Crea tu cuenta", (c) => dibujarRegistroDatos(c)),
  "#/registro/buho": crearPantallaDeCuenta("Elige a tu búhi", (c) => dibujarRegistroBuho(c)),
  "#/registro/terminar": crearPantallaDeCuenta("Bienvenida", (c) => dibujarRegistroTerminar(c)),
  // Ruta oculta: no tiene enlace en la app
  "#/componentes": {
    titulo: "Componentes",
    enBarra: false,
    plantilla: "plantilla-componentes",
    preparar: dibujarCatalogo,
  },
};

// Rutas con el id de un platillo: #/platillo/ID, #/personalizar/ID, #/apartar/ID,
// #/comentarios/ID y #/comentarios/ID/escribir. Y las del ticket (#/ticket/PEDIDO)
// y del premio canjeado (#/puntos/premio/ID)
const pantallasConId = {
  personalizar: {
    titulo: "Personaliza tu plato",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    plantilla: "plantilla-apartar",
    preparar: dibujarPersonalizar,
  },
  platillo: {
    titulo: "Platillo",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    preparar: dibujarDetalle,
  },
  apartar: {
    titulo: "Apartar pedido",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    plantilla: "plantilla-apartar",
    preparar: dibujarApartar,
  },
  // El id es el del pedido. No lleva barra ni botón de volver (nota de Figma 1375:9321)
  ticket: {
    titulo: "Tu ticket",
    enBarra: false,
    sinEncabezado: true,
    sinNavegacion: true,
    pestana: "#/menu",
    plantilla: "plantilla-ticket",
    preparar: dibujarTicket,
  },
  // "Premio canjeado": el id es el del premio. Sin barra (Figma 1003:4490)
  "puntos/premio": {
    titulo: "Premio canjeado",
    enBarra: false,
    sinEncabezado: true,
    sinNavegacion: true,
    pestana: "#/puntos",
    plantilla: "plantilla-ticket",
    preparar: dibujarPremio,
  },
  comentarios: {
    titulo: "Comentarios y calificaciones",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    plantilla: "plantilla-comentarios",
    preparar: dibujarComentarios,
  },
  "comentarios/escribir": {
    titulo: "Escribir mi opinión",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    plantilla: "plantilla-escribir",
    preparar: dibujarEscribirOpinion,
  },
};
const pantallaInicial = "#/menu";
// Milisegundos. Notas de Figma 1440:11261 y 1429:10299: el aviso se va solo a los 3 s
// (la de la pantalla 01, que aún no existe, pide 5 s).
const duracionAviso = 3000;

// Devuelve la pantalla de un hash (con su ruta, su id y los datos que van después
// del "?"), o null si no existe.
function buscarPantalla(hash) {
  const [ruta, consulta = ""] = hash.split("?");
  const parametros = new URLSearchParams(consulta);
  if (Object.hasOwn(pantallas, ruta)) {
    return { ...pantallas[ruta], ruta, parametros };
  }
  const partes = ruta.match(
    /^#\/(platillo|personalizar|apartar|ticket|comentarios|puntos\/premio)\/([^/]+?)(\/escribir)?$/,
  );
  const tipo = partes && `${partes[1]}${partes[3] ?? ""}`;
  return Object.hasOwn(pantallasConId, tipo)
    ? { ...pantallasConId[tipo], ruta, parametros, id: partes[2] }
    : null;
}

// Cada entrada del historial recuerda desde qué pantalla se llegó a ella.
let hashAnterior = null;
function recordarOrigen() {
  if (history.state === null) {
    history.replaceState({ desde: hashAnterior }, "");
  }
  hashAnterior = location.hash;
}

// Cambia la dirección de la pantalla actual sin crear otra entrada en el historial.
function cambiarDireccion(ruta) {
  history.replaceState(history.state, "", ruta);
  hashAnterior = location.hash;
}

// Muestra la pantalla que indica el hash de la dirección.
function mostrarPantalla() {
  // Si el hash está vacío o no existe, se corrige sin crear otra entrada en el historial.
  if (!buscarPantalla(location.hash)) {
    history.replaceState(history.state, "", pantallaInicial);
  }
  recordarOrigen();
  const {
    titulo,
    enBarra,
    plantilla = "plantilla-pantalla",
    preparar,
    sinEncabezado = false,
    sinNavegacion = false,
    ruta,
    pestana = ruta,
    id,
    parametros,
  } = buscarPantalla(location.hash);

  document.title = `${titulo} · BúhoGondra`;
  document.getElementById("titulo-pantalla").textContent = titulo;
  document.getElementById("boton-volver").hidden = enBarra;
  document.querySelector("body > header").hidden = sinEncabezado;
  document.getElementById("navegacion-inferior").hidden = sinNavegacion;

  const contenido = document.getElementById("contenido");
  contenido.classList.toggle("contenido--completo", sinEncabezado);
  contenido.replaceChildren(document.getElementById(plantilla).content.cloneNode(true));
  preparar?.(contenido, { id, parametros }); // contenido extra que necesite la pantalla
  window.scrollTo(0, 0);

  marcarPestanaActiva(pestana);
}

// Marca en la barra la opción que corresponde a la pantalla actual.
function marcarPestanaActiva(ruta) {
  document.querySelectorAll(".pestana").forEach((pestana) => {
    if (pestana.getAttribute("href") === ruta) {
      pestana.setAttribute("aria-current", "page");
    } else {
      pestana.removeAttribute("aria-current");
    }
  });
}

// Crea un elemento con una clase y, si se indica, un texto.
function crearElemento(etiqueta, clase, texto = "") {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

// Crea un aviso ("exito" o "error") con título y texto explicativo opcional.
function crearAviso(tipo, titulo, texto) {
  const aviso = crearElemento("div", `aviso aviso--${tipo}`);
  const contenido = crearElemento("div", "aviso__contenido");
  contenido.append(crearElemento("p", "aviso__titulo", titulo));
  if (texto) {
    contenido.append(crearElemento("p", "aviso__texto", texto));
  }
  aviso.append(contenido);
  return aviso;
}

// Muestra un aviso y lo quita después de unos segundos.
function mostrarAviso(tipo, titulo, texto) {
  const aviso = crearAviso(tipo, titulo, texto);
  const zona = document.getElementById("zona-avisos");
  zona.append(aviso);
  // Una ventana abierta queda por encima de todo: para que el aviso se vea, la zona
  // se sube a esa misma capa
  zona.removeAttribute("popover");
  if (document.querySelector("dialog[open]") && zona.showPopover) {
    zona.popover = "manual";
    zona.showPopover();
  }
  setTimeout(() => {
    aviso.remove();
    if (!zona.children.length) {
      zona.removeAttribute("popover");
    }
  }, duracionAviso);
}

// Eventos
window.addEventListener("hashchange", mostrarPantalla);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("boton-volver").addEventListener("click", () => history.back());
  // Al abrir la app sin una ruta se muestra el Splash
  if (!location.hash) {
    history.replaceState(null, "", "#/splash");
  }
  mostrarPantalla();
  console.log("BúhoGondra cargada");
});
