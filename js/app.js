// Navegación por hash y avisos de BúhoGondra.

// Pantallas disponibles. Las que no están en la barra muestran el botón de volver.
const pantallas = {
  "#/menu": { titulo: "Menú", enBarra: true },
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
const pantallaInicial = "#/menu";
const duracionAviso = 4000; // milisegundos. TODO: Figma no define la duración

// Muestra la pantalla que indica el hash de la dirección.
function mostrarPantalla() {
  // Si el hash está vacío o no existe, se corrige sin crear otra entrada en el historial.
  if (!Object.hasOwn(pantallas, location.hash)) {
    history.replaceState(null, "", pantallaInicial);
  }
  const {
    titulo,
    enBarra,
    plantilla = "plantilla-pantalla",
    preparar,
  } = pantallas[location.hash];

  document.title = `${titulo} · BúhoGondra`;
  document.getElementById("titulo-pantalla").textContent = titulo;
  document.getElementById("boton-volver").hidden = enBarra;

  const contenido = document.getElementById("contenido");
  contenido.replaceChildren(document.getElementById(plantilla).content.cloneNode(true));
  preparar?.(contenido); // contenido extra que necesite la pantalla
  window.scrollTo(0, 0);

  marcarPestanaActiva();
}

// Marca en la barra la opción que corresponde a la pantalla actual.
function marcarPestanaActiva() {
  document.querySelectorAll(".pestana").forEach((pestana) => {
    if (pestana.getAttribute("href") === location.hash) {
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
  mostrarAviso("exito", "Bienvenida a BúhoGondra"); // PRUEBA: quitar después
  console.log("BúhoGondra cargada");
});
