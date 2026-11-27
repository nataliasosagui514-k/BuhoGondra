// Navegación por hash y avisos de BúhoGondra.

// Pantallas disponibles. Las que no están en la barra muestran el botón de volver.
const pantallas = {
  "#/menu": { titulo: "Menú", enBarra: true },
  "#/puntos": { titulo: "Puntos", enBarra: true },
  "#/mas": { titulo: "Más", enBarra: true },
};
const pantallaInicial = "#/menu";
const duracionAviso = 4000; // milisegundos

// Muestra la pantalla que indica el hash de la dirección.
function mostrarPantalla() {
  // Si el hash está vacío o no existe, se corrige sin crear otra entrada en el historial.
  if (!Object.hasOwn(pantallas, location.hash)) {
    history.replaceState(null, "", pantallaInicial);
  }
  const { titulo, enBarra } = pantallas[location.hash];

  document.title = `${titulo} · BúhoGondra`;
  document.getElementById("titulo-pantalla").textContent = titulo;
  document.getElementById("boton-volver").hidden = enBarra;

  const plantilla = document.getElementById("plantilla-pantalla");
  document.getElementById("contenido").replaceChildren(plantilla.content.cloneNode(true));

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

// Crea un aviso ("exito" o "error"), lo muestra y lo quita después de unos segundos.
function mostrarAviso(tipo, titulo) {
  const aviso = document.createElement("div");
  aviso.className = `aviso aviso--${tipo}`;

  const texto = document.createElement("p");
  texto.className = "aviso__titulo";
  texto.textContent = titulo;

  aviso.append(texto);
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
