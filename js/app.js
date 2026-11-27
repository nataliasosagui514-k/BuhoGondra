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
    deCuenta: true,
  };
}

// Las pantallas de Más se dibujan como las de cuenta, sin barra (js/vista-mas.js).
// "conSesion": sin sesión se regresa al panel.
function crearPantallaDeMas(titulo, preparar, { conSesion = false } = {}) {
  return {
    titulo,
    enBarra: false,
    sinEncabezado: true,
    sinNavegacion: true,
    pestana: "#/mas",
    plantilla: "plantilla-cuenta",
    preparar: conSesion
      ? (c, datos) => (obtenerSesion() ? preparar(c, datos) : location.replace("#/mas"))
      : preparar,
  };
}

// Perfil y lo que se abre desde él
function crearPantallaDePerfil(titulo, preparar) {
  return crearPantallaDeMas(titulo, preparar, { conSesion: true });
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
  // No es una pantalla: es un panel que se abre encima de la anterior (Figma 40)
  "#/mas": { titulo: "Más", esPanel: true },
  "#/mas/perfil": crearPantallaDePerfil("Mi perfil", (c) => dibujarPerfil(c)),
  "#/mas/perfil/configuracion": crearPantallaDePerfil("Configuración", (c) => dibujarConfiguracion(c)),
  "#/mas/perfil/correo": crearPantallaDePerfil("Cambiar correo", (c) => dibujarCambiarCorreo(c)),
  "#/mas/perfil/correo/codigo": crearPantallaDePerfil("Cambiar correo", (c) => dibujarCodigoDeCorreo(c)),
  "#/mas/perfil/contrasena": crearPantallaDePerfil("Cambiar contraseña", (c) => dibujarCambiarContrasena(c)),
  "#/mas/perfil/buho": crearPantallaDePerfil("Cambiar mi búho", (c) => dibujarCambiarBuho(c)),
  "#/mas/perfil/eliminar": crearPantallaDePerfil("Eliminar cuenta", (c) => dibujarEliminarCuenta(c)),
  "#/mas/historial": crearPantallaDeMas("Historial", (c) => dibujarHistorial(c), { conSesion: true }),
  "#/mas/notificaciones": crearPantallaDeMas("Notificaciones", (c) => dibujarNotificaciones(c), {
    conSesion: true,
  }),
  "#/mas/cotizar": crearPantallaDeMas("Cotizar eventos", (c) => dibujarCotizar(c)),
  "#/mas/sobre": crearPantallaDeMas("Sobre Funda Gondra", (c) => dibujarSobre(c)),
  "#/mas/ayuda": crearPantallaDeMas("Centro de ayuda", (c) => dibujarCentroDeAyuda(c)),
  "#/mas/ayuda/preguntas": crearPantallaDeMas("Preguntas frecuentes", (c) => dibujarPreguntasFrecuentes(c)),
  // A estas dos también se llega desde el registro: no se pierde lo ya escrito
  "#/mas/ayuda/terminos": {
    ...crearPantallaDeMas("Términos y condiciones", (c) => dibujarTerminos(c)),
    conservaCuenta: true,
  },
  "#/mas/ayuda/problemas": {
    ...crearPantallaDeMas("Problemas con mi cuenta", (c) => dibujarProblemas(c)),
    conservaCuenta: true,
  },
  ...Object.fromEntries(
    AREAS.map((area) => [
      `#/mas/sobre/${area.id}`,
      crearPantallaDeMas(area.nombre, (c) => dibujarArea(c, area)),
    ]),
  ),
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
  "#/recuperar": crearPantallaDeCuenta("Recuperar contraseña", (c) => dibujarRecuperar(c)),
  "#/recuperar/codigo": crearPantallaDeCuenta("Recuperar contraseña", (c) => dibujarRecuperarCodigo(c)),
  "#/recuperar/nueva": crearPantallaDeCuenta("Recuperar contraseña", (c) => dibujarRecuperarNueva(c)),
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
// del premio canjeado (#/puntos/premio/ID) y del detalle de un pedido
// (#/mas/historial/ID)
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
  // El id es el del pedido
  "mas/historial": crearPantallaDeMas("Detalle de pedido", dibujarDetalleDePedido, {
    conSesion: true,
  }),
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
// ("Contraseña actualizada" dura 5 s: ver js/vista-cuenta.js).
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
    /^#\/(platillo|personalizar|apartar|ticket|comentarios|puntos\/premio|mas\/historial)\/([^/]+?)(\/escribir)?$/,
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

// La pantalla que está dibujada y la última con barra, que es la que queda detrás del
// panel Más
let hashDibujado = null;
let fondoDelPanel = "#/menu";

// Cambia la dirección de la pantalla actual sin crear otra entrada en el historial.
function cambiarDireccion(ruta) {
  history.replaceState(history.state, "", ruta);
  hashAnterior = location.hash;
  if (fondoDelPanel === hashDibujado) {
    fondoDelPanel = location.hash;
  }
  hashDibujado = location.hash;
}

// Muestra la pantalla que indica el hash de la dirección.
function mostrarPantalla() {
  // Si el hash está vacío o no existe, se corrige sin crear otra entrada en el historial.
  if (!buscarPantalla(location.hash)) {
    history.replaceState(history.state, "", pantallaInicial);
  }
  recordarOrigen();
  const pantalla = buscarPantalla(location.hash);
  if (!pantalla.deCuenta && !pantalla.conservaCuenta) {
    salirDeCuenta();
  }

  const panelAbierto = document.querySelector("#contenido > .panel");
  if (pantalla.esPanel) {
    abrirPanel(pantalla);
    return;
  }
  // Al cerrar el panel, la pantalla de atrás sigue como estaba
  if (panelAbierto && location.hash === hashDibujado) {
    panelAbierto.remove();
    const { titulo, ruta, pestana = ruta } = pantalla;
    document.title = `${titulo} · BúhoGondra`;
    marcarPestanaActiva(pestana);
    return;
  }
  dibujarPantalla(pantalla, location.hash);
}

function abrirPanel({ titulo, ruta }) {
  if (hashDibujado !== fondoDelPanel) {
    dibujarPantalla(buscarPantalla(fondoDelPanel), fondoDelPanel);
  }
  const contenido = document.getElementById("contenido");
  contenido.querySelector(":scope > .panel")?.remove();
  document.title = `${titulo} · BúhoGondra`;
  marcarPestanaActiva(ruta);
  abrirDialogo(contenido, crearPanel());
  actualizarPuntoDeAvisos();
}

function dibujarPantalla(pantalla, hash) {
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
  } = pantalla;
  hashDibujado = hash;
  if (!sinNavegacion) {
    fondoDelPanel = hash;
  }

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

  actualizarPuntoDeAvisos();
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

// Muestra un aviso y lo quita después de unos segundos. Lo devuelve, por si hay que
// quitarlo antes.
function mostrarAviso(tipo, titulo, texto, duracion = duracionAviso) {
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
  }, duracion);
  return aviso;
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
