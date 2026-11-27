// Más: el panel lateral y las pantallas que se abren desde él. Los cambios de cuenta
// están en js/cuenta.js.

/* ---------- Iconos (Figma, "Bloque 4") ---------- */

// Cada trazo es [x, y, ruta] dentro de una caja de 24; x e y son su posición.
const CIRCULO_DE_ICONO = [
  3,
  3,
  "M18 9C18 13.97 13.97 18 9 18C4.03 18 0 13.97 0 9C0 4.03 4.03 0 9 0C13.97 0 18 4.03 18 9Z",
];

const ICONOS_DE_MAS = {
  perfil: [
    [8.2, 4.2, "M7.6 3.8C7.6 5.9 5.9 7.6 3.8 7.6C1.7 7.6 0 5.9 0 3.8C0 1.7 1.7 0 3.8 0C5.9 0 7.6 1.7 7.6 3.8Z"],
    [4.5, 13.7, "M0 6.8C0 2.7 3.3 0 7.5 0C11.7 0 15 2.7 15 6.8"],
  ],
  historial: [
    [3.6, 3.58, "M0 8.42C0 10.37 0.69 12.25 1.93 13.75C3.17 15.25 4.89 16.27 6.8 16.65C8.71 17.02 10.69 16.71 12.4 15.79C14.11 14.86 15.45 13.37 16.18 11.57C16.91 9.76 17 7.76 16.42 5.9C15.84 4.04 14.64 2.45 13.01 1.38C11.38 0.31 9.43 -0.16 7.5 0.05C5.56 0.26 3.76 1.13 2.4 2.52"],
    [3.4, 3.6, "M0 0L0 4.2L4.2 4.2"],
    [12, 7.6, "M0 0L0 4.4L3 6.4"],
  ],
  notificaciones: [
    [4.4, 5, "M1.6 11.5L1.6 6C1.6 4.41 2.23 2.88 3.36 1.76C4.48 0.63 6.01 0 7.6 0C9.19 0 10.72 0.63 11.84 1.76C12.97 2.88 13.6 4.41 13.6 6L13.6 11.5L15.2 13.7L0 13.7L1.6 11.5Z"],
    [10, 21.4, "M0 0L4 0"],
  ],
  cotizar: [
    [3.5, 4.5, "M3 0L14 0C15.66 0 17 1.34 17 3L17 13C17 14.66 15.66 16 14 16L3 16C1.34 16 0 14.66 0 13L0 3C0 1.34 1.34 0 3 0Z"],
    [3.5, 9.5, "M0 0L17 0"],
    [8, 2.8, "M0 0L0 3.4"],
    [16, 2.8, "M0 0L0 3.4"],
    [10.2, 12.1, "M3.6 1C3.2 0.3 2.5 0 1.8 0C0.8 0 0 0.5 0 1.3C0 2.1 0.8 2.5 1.8 2.7C2.8 2.9 3.6 3.3 3.6 4.1C3.6 4.9 2.8 5.4 1.8 5.4C1 5.4 0.3 5 0 4.4"],
    [12, 11, "M0 0L0 1.2"],
    [12, 17.4, "M0 0L0 1.1"],
  ],
  sobre: [
    [4, 4.5, "M0 5.7L1.6 0L14.4 0L16 5.7"],
    [4, 10.2, "M0 0C0 1.4 1.1 2.5 2.5 2.5C3.9 2.5 5 1.4 5 0C5 1.4 6.1 2.5 8 2.5C9.9 2.5 11 1.4 11 0C11 1.4 12.1 2.5 13.5 2.5C14.9 2.5 16 1.4 16 0"],
    [5.5, 12.7, "M0 0L0 7.8L13 7.8L13 0"],
    [10, 16.3, "M0 4.2L0 0L4 0L4 4.2"],
  ],
  ayuda: [
    CIRCULO_DE_ICONO,
    [9.4, 6.88, "M0 2.72C0 2.24 0.12 1.76 0.36 1.35C0.61 0.93 0.95 0.58 1.37 0.35C1.79 0.11 2.27 -0.01 2.75 0C3.23 0.01 3.7 0.15 4.12 0.4C4.53 0.65 4.86 1.01 5.09 1.44C5.31 1.86 5.42 2.34 5.4 2.82C5.38 3.3 5.22 3.77 4.96 4.17C4.7 4.58 4.33 4.9 3.9 5.12C3.1 5.52 2.6 6.12 2.6 7.02"],
    [12, 16.9, "M0 0L0.01 0"],
  ],
};

/* ---------- Filas ---------- */

// Única función que crea las filas del panel y de sus pantallas. Con "href" es un
// enlace; si no, un botón que llama a "alTocar".
function crearFila({ icono, titulo, detalle = "", href = "", alTocar, flecha = false, clase = "" }) {
  const fila = crearElemento(href ? "a" : "button", `fila ${clase}`.trim());
  if (href) {
    fila.href = href;
  } else {
    fila.type = "button";
    fila.addEventListener("click", alTocar);
  }
  const marco = crearElemento("span", "fila__marco");
  marco.append(crearIconoSvg("fila__icono", 24, ICONOS_DE_MAS[icono]));
  const textos = crearElemento("span", "fila__textos");
  textos.append(crearElemento("span", "fila__titulo", titulo));
  if (detalle) {
    fila.classList.add("fila--con-detalle");
    textos.append(crearElemento("span", "fila__detalle", detalle));
  }
  fila.append(marco, textos);
  if (flecha) {
    fila.append(crearIconoSvg("fila__flecha", 20, ["M7.5 5L12.5 10L7.5 15"]));
  }
  return fila;
}

/* ---------- Panel (Figma 40 y 40b) ---------- */

const VERSION_DE_LA_APP = "1.0";
const DESLIZAMIENTO_PARA_CERRAR = 60; // píxeles hacia la derecha

// Las filas del panel. "invitado" es la ventana que sale sin sesión (40c, 50c y 60d);
// las que no la tienen se pueden usar sin cuenta.
const FILAS_DEL_PANEL = [
  {
    icono: "perfil",
    titulo: "Perfil",
    ruta: "#/mas/perfil",
    invitado: {
      titulo: "Inicia sesión o crea una cuenta",
      mensaje: "Así podrás ver tu perfil, apartar platillos y canjear puntos.",
    },
  },
  {
    icono: "historial",
    titulo: "Historial",
    ruta: "#/mas/historial",
    invitado: {
      titulo: "Aún no tienes pedidos",
      mensaje:
        "No has realizado un pedido. Inicia sesión o crea una cuenta para poder ver tu historial.",
    },
  },
  {
    icono: "notificaciones",
    titulo: "Notificaciones",
    ruta: "#/mas/notificaciones",
    invitado: {
      titulo: "Recibe avisos de tus pedidos",
      mensaje: "Inicia sesión para recibir avisos de tus pedidos y del menú.",
    },
  },
  { icono: "cotizar", titulo: "Cotizar eventos", ruta: "#/mas/cotizar" },
  { icono: "sobre", titulo: "Sobre Funda Gondra", ruta: "#/mas/sobre" },
  { icono: "ayuda", titulo: "Centro de ayuda", ruta: "#/mas/ayuda" },
];

// El búho de la cuenta dentro de un círculo
function crearAvatar(numero, clase = "") {
  const avatar = crearElemento("span", `avatar ${clase}`.trim());
  avatar.append(crearImagen("avatar__buho", `img/avatar-buho-${numero}.png`));
  return avatar;
}

function nombrarCuenta(cuenta) {
  return `${cuenta.nombre} ${cuenta.apellido}`;
}

// Arriba del panel: la cuenta o, sin sesión, la invitación a entrar. El texto "¡Hola!"
// es el de Figma 40b.
function crearCabeceraDelPanel(sesion) {
  const cabecera = crearElemento("header", "panel__cabecera");
  if (!sesion) {
    cabecera.classList.add("panel__cabecera--invitado");
    cabecera.append(
      crearElemento("h2", "panel__nombre", "¡Hola!"),
      crearElemento(
        "p",
        "panel__invitacion",
        "Inicia sesión para apartar platillos y juntar puntos.",
      ),
      crearBotonInferior("Iniciar sesión", () => {
        location.hash = "#/login";
      }),
      crearBotonDeTexto("Crear cuenta", () => {
        location.hash = "#/registro/correo";
      }),
    );
    return cabecera;
  }
  const cuenta = obtenerCuenta(sesion.correo);
  const textos = crearElemento("div", "panel__datos");
  textos.append(
    crearElemento("h2", "panel__nombre", nombrarCuenta(cuenta)),
    crearElemento("p", "panel__correo", sesion.correo),
  );
  // Una cuenta sin tipo (correo con otro formato) no lleva etiqueta
  const etiqueta = sesion.tipo && crearIndicadorDeTipo(sesion.tipo);
  if (etiqueta) {
    textos.append(etiqueta);
  }
  cabecera.append(crearAvatar(sesion.buho), textos);
  return cabecera;
}

// Se cierra tocando el fondo, deslizando a la derecha o con la tecla Escape
function cerrarPanel() {
  if (history.state?.desde) {
    history.back();
  } else {
    location.replace("#/menu");
  }
}

function crearPanel() {
  const sesion = obtenerSesion();
  const filas = crearElemento("nav", "panel__filas");
  // TODO: Figma no define el nombre del menú para lectores de pantalla
  filas.setAttribute("aria-label", "Opciones de Más");
  filas.append(
    ...FILAS_DEL_PANEL.map(({ icono, titulo, ruta, invitado }) => {
      if (sesion || !invitado) {
        return crearFila({ icono, titulo, href: ruta, clase: "fila--panel" });
      }
      return crearFila({
        icono,
        titulo,
        clase: "fila--panel",
        alTocar: () =>
          pedirCuenta(panel, { ...invitado, destino: { hash: ruta, tipo: "mas" } }),
      });
    }),
  );

  const panel = crearElemento("dialog", "panel");
  panel.setAttribute("aria-label", "Más");
  panel.append(
    crearCabeceraDelPanel(sesion),
    filas,
    crearElemento("p", "panel__pie", `BúhoGondra · versión ${VERSION_DE_LA_APP}`),
  );

  panel.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    cerrarPanel();
  });
  // Un toque en el fondo llega al diálogo, pero fuera de su rectángulo
  panel.addEventListener("click", (evento) => {
    const { left } = panel.getBoundingClientRect();
    if (evento.target === panel && evento.clientX < left) {
      cerrarPanel();
    }
  });
  let inicio = null;
  panel.addEventListener("pointerdown", (evento) => {
    // La ventana de invitado va dentro del panel: sus toques no lo mueven
    inicio = evento.target.closest("dialog") === panel ? [evento.clientX, evento.clientY] : null;
  });
  panel.addEventListener("pointerup", (evento) => {
    if (!inicio) {
      return;
    }
    const [dx, dy] = [evento.clientX - inicio[0], evento.clientY - inicio[1]];
    inicio = null;
    if (dx > DESLIZAMIENTO_PARA_CERRAR && dx > Math.abs(dy)) {
      cerrarPanel();
    }
  });
  return panel;
}
