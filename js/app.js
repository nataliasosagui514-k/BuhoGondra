// Navegación por hash y avisos de BúhoGondra.

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
  "#/puntos": { titulo: "Puntos", enBarra: true },
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
  // Ruta oculta: no tiene enlace en la app
  "#/componentes": {
    titulo: "Componentes",
    enBarra: false,
    plantilla: "plantilla-componentes",
    preparar: dibujarCatalogo,
  },
};

// Rutas con el id de un platillo: #/platillo/ID, #/apartar/ID, #/comentarios/ID
// y #/comentarios/ID/escribir
const pantallasConId = {
  platillo: {
    titulo: "Platillo",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    preparar: dibujarDetalle,
  },
  apartar: { titulo: "Apartar", enBarra: false, pestana: "#/menu", preparar: dibujarProximamente },
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
  const partes = ruta.match(/^#\/(platillo|apartar|comentarios)\/([^/]+?)(\/escribir)?$/);
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
    ruta,
    pestana = ruta,
    id,
    parametros,
  } = buscarPantalla(location.hash);

  document.title = `${titulo} · BúhoGondra`;
  document.getElementById("titulo-pantalla").textContent = titulo;
  document.getElementById("boton-volver").hidden = enBarra;
  document.querySelector("body > header").hidden = sinEncabezado;

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
  document.getElementById("zona-avisos").append(aviso);
  setTimeout(() => aviso.remove(), duracionAviso);
}

// Eventos
window.addEventListener("hashchange", mostrarPantalla);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("boton-volver").addEventListener("click", () => history.back());
  mostrarPantalla();
  console.log("BúhoGondra cargada");
});
