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
  // Ruta oculta: no tiene enlace en la app
  "#/componentes": {
    titulo: "Componentes",
    enBarra: false,
    plantilla: "plantilla-componentes",
    preparar: dibujarCatalogo,
  },
};

// Rutas que terminan en el id de un platillo: #/platillo/ID y #/apartar/ID
const pantallasConId = {
  platillo: {
    titulo: "Platillo",
    enBarra: false,
    sinEncabezado: true,
    pestana: "#/menu",
    preparar: dibujarDetalle,
  },
  apartar: { titulo: "Apartar", enBarra: false, pestana: "#/menu", preparar: dibujarProximamente },
};
const pantallaInicial = "#/menu";
const duracionAviso = 4000; // milisegundos. TODO: Figma no define la duración

// Devuelve la pantalla de un hash (con su ruta, su id y los datos que van después
// del "?"), o null si no existe.
function buscarPantalla(hash) {
  const [ruta, consulta = ""] = hash.split("?");
  const parametros = new URLSearchParams(consulta);
  if (Object.hasOwn(pantallas, ruta)) {
    return { ...pantallas[ruta], ruta, parametros };
  }
  const partes = ruta.match(/^#\/(platillo|apartar)\/([^/]+)$/);
  return partes ? { ...pantallasConId[partes[1]], ruta, parametros, id: partes[2] } : null;
}

// Cada entrada del historial recuerda desde qué pantalla se llegó a ella.
let hashAnterior = null;
function recordarOrigen() {
  if (history.state === null) {
    history.replaceState({ desde: hashAnterior }, "");
  }
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
