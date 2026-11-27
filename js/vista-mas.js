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
  configuracion: [
    [4, 7, "M0 0L10 0"],
    [18, 7, "M0 0L2 0"],
    [4, 17, "M0 0L4 0"],
    [12, 17, "M0 0L8 0"],
    [14, 5, "M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4Z"],
    [8, 15, "M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4Z"],
  ],
  salir: [
    [4, 4, "M6 0L2 0C1.47 0 0.96 0.21 0.59 0.59C0.21 0.96 0 1.47 0 2L0 14C0 14.53 0.21 15.04 0.59 15.41C0.96 15.79 1.47 16 2 16L6 16"],
    [15, 8, "M0 0L4 4L0 8"],
    [9, 12, "M10 0L0 0"],
  ],
  eliminar: [
    [4, 7, "M0 0L16 0"],
    [9, 4, "M0 3L0 0L6 0L6 3"],
    [6, 7, "M0 0L1 13L11 13L12 0"],
    [10, 11, "M0 0L0 6"],
    [14, 11, "M0 0L0 6"],
  ],
  correo: [
    [4, 6, "M1 0L15 0C15.55 0 16 0.45 16 1L16 11C16 11.55 15.55 12 15 12L1 12C0.45 12 0 11.55 0 11L0 1C0 0.45 0.45 0 1 0Z"],
    [4, 7, "M0 0L8 6L16 0"],
  ],
  candado: [
    [5, 11, "M2 0L12 0C13.1 0 14 0.9 14 2L14 8C14 9.1 13.1 10 12 10L2 10C0.9 10 0 9.1 0 8L0 2C0 0.9 0.9 0 2 0Z"],
    [8, 3, "M0 8L0 4C0 1.8 1.8 0 4 0C6.2 0 8 1.8 8 4L8 8"],
  ],
  premio: [
    CIRCULO_DE_ICONO,
    [7.34, 7.5, "M4.66 0L5.84 3.28L9.32 3.39L6.56 5.52L7.54 8.86L4.66 6.9L1.78 8.86L2.76 5.52L0 3.39L3.48 3.28L4.66 0Z"],
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
  volverA(fondoDelPanel.split("?")[0], fondoDelPanel);
}

function crearPanel() {
  const avisosSinVer = hayAvisosSinVer();
  const sesion = obtenerSesion();
  const filas = crearElemento("nav", "panel__filas");
  // TODO: Figma no define el nombre del menú para lectores de pantalla
  filas.setAttribute("aria-label", "Opciones de Más");
  filas.append(
    ...FILAS_DEL_PANEL.map(({ icono, titulo, ruta, invitado }) => {
      if (sesion || !invitado) {
        const conAviso = icono === "notificaciones" && avisosSinVer;
        return crearFila({ icono, titulo, href: ruta, clase: conAviso ? "fila--con-aviso" : "" });
      }
      return crearFila({
        icono,
        titulo,
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

/* ---------- Pantallas que se abren desde el panel ---------- */

// Encabezado con "volver" y el nombre de la pantalla. "anterior" es a donde regresa.
function montarPantallaDeMas(contenedor, { titulo, anterior }, ...partes) {
  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(() => volverA(anterior), titulo),
    ...partes,
  );
}

// Los títulos de las pantallas de Más son más pequeños que los de cuenta (43, 44 y 47)
function crearTitulosDeMas(titulo, descripcion) {
  const titulos = crearTitulosDeCuenta({ titulo, descripcion });
  titulos.classList.add("cuenta__titulos--mas");
  return titulos;
}

function crearSubtitulo(texto) {
  return crearElemento("h2", "mas__subtitulo", texto);
}

/* ---------- Perfil (Figma 41) ---------- */

function dibujarPerfil(contenedor) {
  const { sesion, cuenta } = obtenerCuentaDeLaSesion();
  const resumen = crearElemento("div", "perfil__resumen");
  resumen.append(
    crearAvatar(sesion.buho, "avatar--grande"),
    crearElemento("h1", "perfil__nombre", nombrarCuenta(cuenta)),
    crearElemento("p", "perfil__correo", sesion.correo),
  );
  const etiqueta = sesion.tipo && crearIndicadorDeTipo(sesion.tipo);
  if (etiqueta) {
    resumen.append(etiqueta);
  }

  const filas = crearElemento("div", "mas__filas");
  filas.append(
    crearFila({
      icono: "configuracion",
      titulo: "Configuración de la cuenta",
      detalle: "Nombre, correo y contraseña",
      href: "#/mas/perfil/configuracion",
      flecha: true,
    }),
    crearFila({
      icono: "perfil",
      titulo: "Cambiar mi búhi",
      detalle: "Elige tu foto de perfil",
      href: "#/mas/perfil/buho",
      flecha: true,
    }),
  );
  const salida = crearElemento("div", "perfil__salida");
  salida.append(
    crearFila({
      icono: "salir",
      titulo: "Cerrar sesión",
      alTocar: () => preguntarCierreDeSesion(contenedor),
    }),
  );

  montarPantallaDeMas(
    contenedor,
    { titulo: "Mi perfil", anterior: "#/mas" },
    resumen,
    filas,
    salida,
    crearFila({
      icono: "eliminar",
      titulo: "Eliminar cuenta",
      detalle: "Se borran tu historial y tus puntos",
      href: "#/mas/perfil/eliminar",
      flecha: true,
      clase: "fila--peligro perfil__eliminar",
    }),
  );
}

// 46: tocar fuera es "Quedarme"
function preguntarCierreDeSesion(contenedor) {
  const quedarme = () => {
    ventana.close();
    ventana.remove();
  };
  const ventana = crearVentana({
    tipo: "invitado",
    titulo: "¿Cerrar sesión?",
    mensaje: "Tu pedido apartado seguirá activo. Puedes volver a entrar cuando quieras.",
    textoBoton: "Cerrar sesión",
    alTocar: () => {
      cerrarSesion();
      location.hash = "#/login";
    },
    segundo: { texto: "Quedarme", alTocar: quedarme },
    alCerrar: quedarme,
  });
  abrirDialogo(contenedor, ventana);
}

/* ---------- Configuración (Figma 42) ---------- */

function dibujarConfiguracion(contenedor) {
  const { sesion, cuenta } = obtenerCuentaDeLaSesion();
  const [nombre, apellido] = [
    { clave: "nombre", etiqueta: "Nombre", autocompletar: "given-name" },
    { clave: "apellido", etiqueta: "Apellido", autocompletar: "family-name" },
  ].map(({ clave, etiqueta, autocompletar }) =>
    crearCampo({
      id: `cuenta-${clave}`,
      etiqueta,
      autocompletar,
      valor: cuenta[clave],
    }),
  );
  const guardar = crearBotonDeEnvio("Guardar cambios");
  // Solo se activa si cambió el nombre o el apellido
  const revisar = () => {
    guardar.disabled =
      nombre.entrada.value.trim() === cuenta.nombre &&
      apellido.entrada.value.trim() === cuenta.apellido;
  };
  revisar();

  const datos = crearElemento("div", "cuenta__campos");
  datos.append(crearSubtitulo("¿Cómo te llamas?"), nombre.elemento, apellido.elemento);
  const entrada = crearElemento("div", "mas__filas");
  entrada.append(
    crearSubtitulo("Datos para entrar"),
    crearFila({
      icono: "correo",
      titulo: "Correo institucional",
      detalle: sesion.correo,
      href: "#/mas/perfil/correo",
      flecha: true,
    }),
    crearFila({
      icono: "candado",
      titulo: "Contraseña",
      detalle: "Cámbiala cuando quieras",
      href: "#/mas/perfil/contrasena",
      flecha: true,
    }),
  );

  const formulario = crearFormularioDeCuenta(
    () => {
      // TODO: Figma no define estos mensajes
      if (!nombre.entrada.value.trim()) {
        nombre.marcarError("Escribe tu nombre");
        return;
      }
      if (!apellido.entrada.value.trim()) {
        apellido.marcarError("Escribe tu apellido");
        return;
      }
      if (!cambiarNombre(nombre.entrada.value, apellido.entrada.value)) {
        // TODO: Figma no define este aviso
        mostrarAviso("error", "No se pudieron guardar tus datos");
        return;
      }
      const guardada = obtenerCuentaDeLaSesion().cuenta;
      volverA("#/mas/perfil");
      // 41b
      mostrarAviso("exito", "Tus datos se guardaron", `Ahora tu nombre es ${nombrarCuenta(guardada)}.`);
    },
    [datos, entrada],
    [guardar],
  );
  formulario.classList.add("configuracion");
  formulario.addEventListener("input", revisar);

  montarPantallaDeMas(contenedor, { titulo: "Configuración", anterior: "#/mas/perfil" }, formulario);
}

/* ---------- Cambiar correo (Figma 43 y 43b) ---------- */

// El correo nuevo mientras no se confirma su código. Solo en memoria
let correoNuevo = "";

const TIPOS_DE_CUENTA = { estudiante: "Estudiante", docente: "Docente o empleado" };

function dibujarCambiarCorreo(contenedor) {
  const { sesion } = obtenerCuentaDeLaSesion();
  const correo = crearCampo({
    id: "cambio-correo",
    etiqueta: "Correo institucional nuevo",
    tipo: "email",
    ejemplo: "tucorreo@uca.edu.sv",
    autocompletar: "email",
    valor: correoNuevo,
  });
  const tipo = crearElemento("div", "cuenta__tipo");
  tipo.setAttribute("aria-live", "polite");
  const mostrarTipo = () => {
    const indicador = crearIndicadorDeTipo(detectarTipoCorreo(correo.entrada.value));
    tipo.replaceChildren(...(indicador ? [indicador] : []));
  };
  correo.entrada.addEventListener("input", mostrarTipo);
  mostrarTipo();
  const bloque = crearElemento("div", "cuenta__correo");
  bloque.append(correo.elemento, tipo);

  montarPantallaDeMas(
    contenedor,
    { titulo: "Cambiar correo", anterior: "#/mas/perfil/configuracion" },
    crearTitulosDeMas(
      "Escribe tu nuevo correo",
      "Te enviaremos un código para confirmar que es tuyo. Tu tipo de cuenta se actualiza según el correo.",
    ),
    crearFormularioDeCuenta(
      () => {
        // Las mismas revisiones que en el registro (02c y 02d)
        const escrito = normalizarCorreo(correo.entrada.value);
        if (detectarTipoCorreo(escrito) === "no-uca") {
          tipo.replaceChildren();
          correo.marcarError(
            escrito ? "Usa tu correo de la UCA (termina en @uca.edu.sv)" : "Escribe tu correo institucional",
          );
          return;
        }
        if (obtenerCuenta(escrito)) {
          tipo.replaceChildren();
          correo.marcarError("Este correo ya tiene una cuenta");
          return;
        }
        correoNuevo = escrito;
        // TODO: sin envío real de correos, este código solo aparece en la consola
        generarCodigo(escrito);
        codigoEnviadoEn = Date.now();
        location.hash = "#/mas/perfil/correo/codigo";
      },
      [
        bloque,
        crearElemento("p", "mas__nota", `Mientras no lo confirmes, sigues entrando con ${sesion.correo}.`),
      ],
      [crearBotonDeEnvio("Enviar código")],
    ),
  );
}

function dibujarCodigoDeCorreo(contenedor) {
  if (!correoNuevo) {
    location.replace("#/mas/perfil/correo");
    return;
  }
  const destino = correoNuevo;
  const cambiar = () => volverA("#/mas/perfil/correo");
  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(cambiar, "Cambiar correo"),
    crearTitulosDeCuenta({
      titulo: "Verifica tu nuevo correo",
      descripcion: `Te enviamos un código de 6 dígitos a ${destino}. Vence en 10 minutos.`,
    }),
    crearFormularioDeCodigo({
      textoBoton: "Confirmar correo",
      alReenviar: () => generarCodigo(destino),
      alCambiarCorreo: cambiar,
      alVerificar: (codigo) => {
        if (!verificarCodigo(codigo)) {
          return false;
        }
        if (!cambiarCorreo(destino)) {
          // TODO: Figma no define este aviso
          mostrarAviso("error", "No se pudo cambiar tu correo");
          return true;
        }
        correoNuevo = "";
        const nombreDelTipo = TIPOS_DE_CUENTA[obtenerSesion().tipo];
        location.replace("#/mas/perfil/configuracion");
        // 42b
        // TODO: Figma no muestra el aviso para una cuenta sin tipo
        mostrarAviso(
          "exito",
          "Correo actualizado",
          `Ahora entras con ${destino}.${nombreDelTipo ? ` Tu cuenta es de ${nombreDelTipo}.` : ""}`,
        );
        return true;
      },
    }),
  );
}

/* ---------- Cambiar contraseña (Figma 44 y 44b) ---------- */

function dibujarCambiarContrasena(contenedor) {
  const { sesion, cuenta } = obtenerCuentaDeLaSesion();
  const [actual, nueva, repetida] = [
    { id: "cambio-actual", etiqueta: "Contraseña actual", autocompletar: "current-password" },
    { id: "cambio-nueva", etiqueta: "Nueva contraseña", ayuda: "Mínimo 8 caracteres", autocompletar: "new-password" },
    { id: "cambio-repetida", etiqueta: "Repite la nueva contraseña", autocompletar: "new-password" },
  ].map((datos) => crearCampo({ ...datos, tipo: "password" }));

  const olvidaste = crearBotonDeTexto("¿Olvidaste tu contraseña?", () => irARecuperar(sesion.correo));
  olvidaste.classList.add("cuenta__enlace-izquierda");
  const guardar = crearBotonDeEnvio("Guardar contraseña");

  montarPantallaDeMas(
    contenedor,
    { titulo: "Cambiar contraseña", anterior: "#/mas/perfil/configuracion" },
    crearTitulosDeMas(
      "Cambia tu contraseña",
      "Primero escribe la que usas ahora. La nueva debe tener al menos 8 caracteres.",
    ),
    crearFormularioDeCuenta(
      async () => {
        guardar.disabled = true;
        // Primero se revisa la actual (44b)
        if (!(await coincideContrasena(cuenta, actual.entrada.value))) {
          guardar.disabled = false;
          actual.marcarError("La contraseña actual no es correcta");
          return;
        }
        if (nueva.entrada.value.length < MINIMO_CONTRASENA) {
          guardar.disabled = false;
          nueva.marcarError("Mínimo 8 caracteres");
          return;
        }
        if (repetida.entrada.value !== nueva.entrada.value) {
          guardar.disabled = false;
          repetida.marcarError("Las contraseñas no coinciden");
          return;
        }
        const resultado = await cambiarContrasena(actual.entrada.value, nueva.entrada.value);
        if (!resultado.ok) {
          guardar.disabled = false;
          // TODO: Figma no define este aviso
          mostrarAviso("error", "No se pudo guardar tu contraseña");
          return;
        }
        volverA("#/mas/perfil");
        // TODO: Figma pide un aviso de éxito, pero no da su texto; se usa el título de 11
        mostrarAviso("exito", "Contraseña actualizada");
      },
      [actual.elemento, nueva.elemento, repetida.elemento, olvidaste],
      [guardar],
    ),
  );
}

/* ---------- Cambiar mi búho (Figma 45) ---------- */

function dibujarCambiarBuho(contenedor) {
  const { sesion } = obtenerCuentaDeLaSesion();
  let elegido = sesion.buho;
  const vista = crearElemento("div", "vista-de-buho");
  vista.setAttribute("aria-live", "polite");
  const guardar = crearBotonDeEnvio("Guardar búho");
  const mostrarElegido = () => {
    // Solo se guarda un búho distinto del actual
    guardar.disabled = elegido === sesion.buho;
    vista.replaceChildren(
      crearImagen("vista-de-buho__imagen", `img/buho-perfil-${elegido}.png`),
      crearElemento("p", "vista-de-buho__nombre", `Búhi ${elegido}`),
    );
  };
  const cuadricula = crearElemento("fieldset", "opciones-de-buho");
  // TODO: Figma no define el nombre del grupo para lectores de pantalla
  cuadricula.setAttribute("aria-label", "Búhos disponibles");
  cuadricula.append(
    ...Array.from({ length: CANTIDAD_DE_BUHOS }, (_, posicion) =>
      crearOpcionDeBuho(posicion + 1, elegido === posicion + 1, (numero) => {
        elegido = numero;
        mostrarElegido();
      }),
    ),
  );
  mostrarElegido();

  const formulario = crearFormularioDeCuenta(
    () => {
      if (!cambiarBuho(elegido)) {
        // TODO: Figma no define este aviso
        mostrarAviso("error", "No se pudo guardar tu búho");
        return;
      }
      volverA("#/mas/perfil");
      // 41c
      mostrarAviso("exito", "Tu búhi se actualizó", "Así te verán en comentarios y en el panel de Más.");
    },
    [vista, cuadricula],
    [guardar],
  );
  formulario.classList.add("cuenta__formulario--buho");

  montarPantallaDeMas(
    contenedor,
    { titulo: "Cambiar mi búho", anterior: "#/mas/perfil" },
    crearTitulosDeCuenta({
      titulo: "Cambia tu búho",
      descripcion: `Es tu foto de perfil. Tu búho actual es Búhi ${sesion.buho}.`,
    }),
    formulario,
  );
}

/* ---------- Eliminar cuenta (Figma 47) ---------- */

const LO_QUE_SE_BORRA = [
  "Tu cuenta: nombre, correo y búho",
  "Tu historial de pedidos",
  "Tus puntos y cupones sin usar",
];

// 47b. TODO: Figma solo muestra un pedido en curso
function redactarPedidosEnCurso(pedidos) {
  const numeros = pedidos.map((pedido) => `#${pedido.numero}`).join(", ");
  const cuantos = pedidos.length === 1 ? "1 pedido" : `${pedidos.length} pedidos`;
  return `Tienes ${cuantos} en curso (${numeros}). Cuando termine, podrás eliminar tu cuenta.`;
}

function dibujarEliminarCuenta(contenedor) {
  const enCurso = listarPedidosEnCurso();
  const lista = crearElemento("ul", "eliminar__lista");
  lista.append(...LO_QUE_SE_BORRA.map((texto) => crearElemento("li", "eliminar__punto", texto)));

  const eliminar = crearBotonInferior(
    "Eliminar mi cuenta",
    () => confirmarEliminacion(contenedor),
    "peligro",
  );
  eliminar.disabled = enCurso.length > 0;
  const acciones = crearElemento("div", "cuenta__acciones");
  acciones.append(
    eliminar,
    crearBotonDeTexto("Mantener mi cuenta", () => volverA("#/mas/perfil")),
  );

  montarPantallaDeMas(
    contenedor,
    { titulo: "Eliminar cuenta", anterior: "#/mas/perfil" },
    ...(enCurso.length
      ? [crearAviso("info", "Primero recoge o cancela tus pedidos", redactarPedidosEnCurso(enCurso))]
      : []),
    crearTitulosDeMas("¿Seguro que quieres irte?", "Si eliminas tu cuenta, se borra para siempre:"),
    lista,
    crearElemento(
      "p",
      "mas__nota",
      "Puedes crear una cuenta nueva con tu correo de la UCA cuando quieras, pero empezarás de cero.",
    ),
    acciones,
  );
}

// 47c y 47d: pide la contraseña. Tocar fuera es "Mantener mi cuenta"
function confirmarEliminacion(contenedor) {
  const contraseña = crearCampo({
    id: "eliminar-contrasena",
    etiqueta: "Escribe tu contraseña para confirmar",
    tipo: "password",
    autocompletar: "current-password",
  });
  const mantener = () => {
    ventana.close();
    ventana.remove();
  };
  let revisando = false;
  const confirmar = async () => {
    if (revisando) {
      return;
    }
    revisando = true;
    const resultado = await eliminarCuenta(contraseña.entrada.value);
    revisando = false;
    if (resultado.ok) {
      // 47e
      avisoAlEntrar = ["exito", "Tu cuenta se eliminó", "Puedes crear una cuenta nueva cuando quieras."];
      location.replace("#/login");
      return;
    }
    if (resultado.motivo === "contrasena") {
      contraseña.marcarError("Contraseña incorrecta. Inténtalo de nuevo.");
      return;
    }
    mantener();
    if (resultado.motivo === "pedidos") {
      mostrarPantalla(); // vuelve a dibujar con el aviso 47b
      return;
    }
    // TODO: Figma no define este aviso
    mostrarAviso("error", "No se pudo eliminar tu cuenta");
  };
  contraseña.entrada.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      confirmar();
    }
  });
  const ventana = crearVentana({
    tipo: "peligro",
    titulo: "¿Eliminar tu cuenta?",
    mensaje: "No se puede deshacer. Se borran tu historial, puntos y cupones.",
    contenido: [contraseña.elemento],
    textoBoton: "Sí, eliminar",
    tipoBoton: "peligro",
    alTocar: confirmar,
    segundo: { texto: "Mantener mi cuenta", alTocar: mantener },
    alCerrar: mantener,
  });
  // La tecla Escape llama a "alCerrar": nunca elimina
  abrirDialogo(contenedor, ventana);
}

/* ---------- Pantallas sin contenido (50b, 60b y 93c) ---------- */

// Búho, título y explicación al centro, y el botón abajo.
function crearEstadoVacio({ imagen, clase, titulo, texto }) {
  const bloque = crearElemento("div", "vacio");
  bloque.append(
    crearImagen(`vacio__imagen ${clase}`, imagen),
    crearElemento("h1", "vacio__titulo", titulo),
    crearElemento("p", "vacio__texto", texto),
  );
  return bloque;
}

function crearBotonAlMenu() {
  return crearBotonInferior("Ver el menú de hoy", () => {
    location.hash = "#/menu";
  });
}

/* ---------- Historial (Figma 50 y 50b) ---------- */

// Solo hay dos estados porque la app solo conoce la fecha del pedido (ver estaEnCurso).
// TODO: "Cancelado" y "No recogido" (51c, 51d y 51e) necesitan un dato que no existe
const ESTADOS_DE_PEDIDO = {
  curso: { texto: "En curso", trazos: null },
  entregado: { texto: "Entregado", trazos: [[2.92, 4.38, "M0 2.92L2.62 5.54L8.17 0"]] },
};

function crearEtiquetaDeEstado(pedido) {
  const clave = estaEnCurso(pedido) ? "curso" : "entregado";
  const { texto, trazos } = ESTADOS_DE_PEDIDO[clave];
  const etiqueta = crearElemento("span", `etiqueta estado estado--${clave}`);
  etiqueta.append(
    trazos ? crearIconoSvg("estado__icono", 14, trazos) : crearElemento("span", "estado__punto"),
    texto,
  );
  return etiqueta;
}

// "20 nov"
function formatearFechaCorta(fecha) {
  const mes = convertirAFecha(fecha).toLocaleDateString("es", { month: "short" }).replace(".", "");
  return `${Number(fecha.slice(-2))} ${mes}`;
}

// "Hoy · 12:30 p. m. · Central · $4.00" o "20 nov · Jardines · $4.00". Figma no pone
// el total en la tarjeta; se agregó porque la lista debe mostrarlo.
function describirEnLista(pedido) {
  const horas = esPedidoMixto(pedido.horaRecogida)
    ? Object.values(pedido.horaRecogida)
    : [pedido.horaRecogida];
  const cuando = estaEnCurso(pedido)
    ? ["Hoy", unirEnFrase(horas.map(formatearHora))]
    : [formatearFechaCorta(pedido.fecha)];
  const cafeteria = CAFETERIAS.find((una) => una.id === pedido.cafeteria)?.nombre;
  return unirConPuntos([...cuando, cafeteria, formatearPrecio(pedido.total)].filter(Boolean));
}

// Lo que se muestra de un pedido: sus platillos con precio y su nombre
function resumirPedido(pedido) {
  const articulos = detallarLineas(pedido.platillos, pedido.fecha);
  // TODO: un platillo que ya no está en el menú no se puede nombrar
  return { articulos, titulo: articulos.length ? titularTicket(articulos) : "Pedido" };
}

function crearTarjetaDePedido(pedido) {
  const { articulos, titulo } = resumirPedido(pedido);
  const textos = crearElemento("span", "pedido__textos");
  textos.append(
    crearElemento("span", "pedido__numero", `Pedido #${pedido.numero}`),
    crearElemento("span", "pedido__titulo", titulo),
    crearEtiquetaDeEstado(pedido),
    crearElemento("span", "pedido__datos", describirEnLista(pedido)),
  );
  const tarjeta = crearElemento("a", "pedido");
  tarjeta.href = `#/mas/historial/${pedido.id}`;
  tarjeta.append(
    crearFoto(articulos[0]?.platillo ?? { foto: null }, "pedido__foto"),
    textos,
    crearIconoSvg("fila__flecha", 20, ["M7.5 5L12.5 10L7.5 15"]),
  );
  const elemento = crearElemento("li", "");
  elemento.append(tarjeta);
  return elemento;
}

function crearGrupoDePedidos(titulo, pedidos) {
  const lista = crearElemento("ul", "pedidos__lista");
  lista.append(...pedidos.map(crearTarjetaDePedido));
  const grupo = crearElemento("section", "pedidos__grupo");
  grupo.append(crearSubtitulo(titulo), lista);
  return grupo;
}

function dibujarHistorial(contenedor) {
  const encabezado = { titulo: "Historial", anterior: "#/mas" };
  // Del más reciente al más antiguo (se guardan en el orden en que se hicieron)
  const pedidos = obtenerPedidosDeLaSesion()
    .reverse()
    .sort((uno, otro) => otro.fecha.localeCompare(uno.fecha));
  if (!pedidos.length) {
    montarPantallaDeMas(
      contenedor,
      encabezado,
      crearEstadoVacio({
        imagen: "img/buhi-historial.png",
        clase: "vacio__imagen--historial",
        titulo: "Todavía no tienes pedidos",
        texto: "Cuando apartes un platillo, aquí verás si está en curso, entregado o cancelado.",
      }),
      crearBotonAlMenu(),
    );
    return;
  }
  const grupos = crearElemento("div", "pedidos");
  grupos.append(
    ...[
      ["En curso", pedidos.filter((pedido) => estaEnCurso(pedido))],
      ["Anteriores", pedidos.filter((pedido) => !estaEnCurso(pedido))],
    ]
      .filter(([, lista]) => lista.length)
      .map(([titulo, lista]) => crearGrupoDePedidos(titulo, lista)),
  );
  montarPantallaDeMas(contenedor, encabezado, crearElemento("h1", "solo-lectores", "Historial"), grupos);
}

/* ---------- Detalle de pedido (Figma 51 y 51b) ---------- */

// TODO: Figma no muestra cómo se llama la categoría de un típico
const NOMBRES_DE_LINEA = {
  economicos: "Plato económico",
  "platos-fuertes": "Plato fuerte",
  complementos: "Complemento",
  tipicos: "Típico",
};

function crearSeccionDeDetalle(titulo, ...partes) {
  const seccion = crearElemento("section", "detalle-pedido__seccion");
  seccion.append(crearElemento("h2", "mas__subtitulo", titulo), ...partes);
  return seccion;
}

function crearDesgloseDePedido(pedido, articulos) {
  const lineas = crearElemento("ul", "detalle-pedido__lineas");
  lineas.append(
    ...articulos.map((articulo) => {
      const nombre = crearElemento("div", "");
      nombre.append(
        crearElemento("p", "detalle-pedido__categoria", NOMBRES_DE_LINEA[articulo.platillo.categoria]),
        crearElemento("p", "detalle-pedido__platillo", nombrarConCantidad(articulo)),
      );
      const linea = crearElemento("li", "detalle-pedido__linea");
      linea.append(nombre, crearElemento("p", "detalle-pedido__precio", formatearPrecio(calcularTotal([articulo]))));
      return linea;
    }),
  );
  const total = crearElemento("p", "detalle-pedido__total");
  total.append(
    crearElemento("span", "", "Total"),
    crearElemento("span", "detalle-pedido__monto", formatearPrecio(pedido.total)),
  );
  return crearSeccionDeDetalle(
    "Tu pedido",
    lineas,
    total,
    crearElemento("p", "mas__nota", estaEnCurso(pedido) ? "Pagas en caja al recoger" : "Pagado en caja"),
  );
}

function crearEntregaDePedido(pedido) {
  if (estaEnCurso(pedido)) {
    return crearSeccionDeDetalle(
      "Detalles de la entrega",
      crearCajaDeRecogida(describirRecogidaEnRevision(pedido.horaRecogida), pedido.cafeteria),
    );
  }
  // TODO: Figma muestra "Entregado a las 12:45 p. m.", pero la app no sabe esa hora
  const puntos = pedido.puntos ? ["Este pedido sumó puntos a tu nivel."] : [];
  return crearSeccionDeDetalle(
    "Detalles de la entrega",
    crearCajaGris(["Entregado"], unirConPuntos([nombrarCafeteria(pedido.cafeteria), ...puntos])),
  );
}

// En curso: ver el ticket y pedir ayuda. Entregado: calificar lo que falte.
function crearAccionesDePedido(pedido, articulos) {
  if (estaEnCurso(pedido)) {
    return [
      crearBotonInferior("Ver mi ticket", () => {
        location.hash = `#/ticket/${pedido.id}`;
      }),
      // TODO: Figma abre el chat de Búhi, que todavía no existe
      crearBotonDeTexto("Ayuda con este pedido", avisarPantallaPendiente),
    ];
  }
  const sinCalificar = articulos.find(({ platillo }) => !obtenerMiOpinion(platillo.id));
  return sinCalificar
    ? [
        crearBotonInferior(
          "Calificar platillo",
          () => {
            location.hash = `#/comentarios/${sinCalificar.platillo.id}/escribir`;
          },
          "contorno",
        ),
      ]
    : [];
}

// El id es el del pedido. Cada quien ve solo los suyos.
function dibujarDetalleDePedido(contenedor, { id }) {
  const pedido = obtenerPedidosDeLaSesion().find((uno) => uno.id === id);
  if (!pedido) {
    location.replace(obtenerSesion() ? "#/mas/historial" : "#/mas");
    return;
  }
  const { articulos, titulo } = resumirPedido(pedido);

  const volver = crearBotonVolver(() => volverA("#/mas/historial"));
  volver.classList.add("boton-volver--sobre-foto");
  const portada = crearElemento("div", "detalle-pedido__portada");
  portada.append(volver, crearFoto(articulos[0]?.platillo ?? { foto: null }, "detalle-pedido__foto"));

  const estado = crearElemento("p", "detalle-pedido__estado");
  estado.append(
    crearEtiquetaDeEstado(pedido),
    crearElemento("span", "pedido__numero", `Pedido #${pedido.numero}`),
  );
  const fecha = empezarEnMinuscula(formatearFechaLarga(convertirAFecha(pedido.fecha)));
  const titulos = crearElemento("header", "detalle-pedido__titulos");
  titulos.append(
    estado,
    crearElemento("h1", "cuenta__titulo", titulo),
    crearElemento(
      "p",
      "detalle-pedido__fecha",
      estaEnCurso(pedido) ? `Pedido hoy, ${fecha}` : `Pedido el ${fecha}`,
    ),
  );

  const acciones = crearElemento("div", "detalle-pedido__acciones");
  acciones.append(...crearAccionesDePedido(pedido, articulos));

  const hoja = crearElemento("div", "detalle-pedido__hoja");
  hoja.append(titulos, crearDesgloseDePedido(pedido, articulos), crearEntregaDePedido(pedido), acciones);

  const pantalla = contenedor.querySelector(".cuenta");
  pantalla.classList.add("detalle-pedido");
  pantalla.replaceChildren(portada, hoja);
}

/* ---------- Notificaciones (Figma 60 y 60b) ---------- */

// TODO: 60c (notificaciones del iPhone apagadas, "Abrir Ajustes del iPhone") no se
// puede hacer en una página web

// El punto azul del botón Más de la barra
function actualizarPuntoDeAvisos() {
  const boton = document.querySelector('.pestana[href="#/mas"]');
  const hay = hayAvisosSinVer();
  boton.classList.toggle("pestana--con-aviso", hay);
  // TODO: Figma no define cómo lo anuncia un lector de pantalla
  boton.querySelector("span").textContent = hay ? "Más, con avisos nuevos" : "Más";
}

// "Sáb 21 nov"
function formatearFechaDeAviso(fecha) {
  const dia = convertirAFecha(fecha).toLocaleDateString("es", { weekday: "short" }).replace(".", "");
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${formatearFechaCorta(fecha)}`;
}

const ICONOS_DE_AVISO = { pedido: "historial", premio: "premio" };

function crearNotificacion(aviso, leida, hoy) {
  const marco = crearElemento("span", "notificacion__marco");
  marco.append(crearIconoSvg("fila__icono", 24, ICONOS_DE_MAS[ICONOS_DE_AVISO[aviso.tipo]]));
  const textos = crearElemento("span", "notificacion__textos");
  textos.append(
    crearElemento("span", "notificacion__titulo", aviso.titulo),
    crearElemento("span", "notificacion__mensaje", aviso.mensaje),
  );
  // Las de hoy ya están bajo "Hoy" y no se sabe su hora
  if (aviso.fecha !== hoy) {
    textos.append(crearElemento("span", "notificacion__fecha", formatearFechaDeAviso(aviso.fecha)));
  }
  const enlace = crearElemento("a", `notificacion${leida ? "" : " notificacion--nueva"}`);
  enlace.href = aviso.destino;
  enlace.append(marco, textos);
  if (!leida) {
    const punto = crearElemento("span", "notificacion__punto");
    punto.setAttribute("role", "img");
    // TODO: Figma no define este texto para lectores de pantalla
    punto.setAttribute("aria-label", "Sin leer");
    enlace.append(punto);
  }
  enlace.addEventListener("click", () => marcarAvisos("leidas", [aviso.id]));
  const elemento = crearElemento("li", "");
  elemento.append(enlace);
  return elemento;
}

function dibujarNotificaciones(contenedor) {
  const encabezado = { titulo: "Notificaciones", anterior: "#/mas" };
  const hoy = obtenerFechaDeHoy();
  const avisos = obtenerNotificaciones(hoy);
  if (!avisos.length) {
    montarPantallaDeMas(
      contenedor,
      encabezado,
      crearEstadoVacio({
        imagen: "img/buhi-ayuda.png",
        clase: "vacio__imagen--avisos",
        titulo: "No tienes notificaciones",
        texto:
          "Aquí te avisaremos cuando tu pedido esté listo, si tienes un cupón o si hay platos de temporada.",
      }),
      crearBotonAlMenu(),
    );
    return;
  }
  const { leidas } = obtenerEstadoDeAvisos();
  // Al entrar se quitan los puntos azules de Más
  marcarAvisos("vistas", avisos.map((aviso) => aviso.id));

  const grupos = crearElemento("div", "pedidos");
  grupos.append(
    ...[
      ["Hoy", avisos.filter((aviso) => aviso.fecha === hoy)],
      ["Esta semana", avisos.filter((aviso) => aviso.fecha !== hoy)],
    ]
      .filter(([, lista]) => lista.length)
      .map(([titulo, lista]) => {
        const elementos = crearElemento("ul", "pedidos__lista");
        elementos.append(
          ...lista.map((aviso) => crearNotificacion(aviso, leidas.includes(aviso.id), hoy)),
        );
        const grupo = crearElemento("section", "pedidos__grupo notificaciones__grupo");
        grupo.append(crearSubtitulo(titulo), elementos);
        return grupo;
      }),
  );
  montarPantallaDeMas(
    contenedor,
    encabezado,
    crearElemento("h1", "solo-lectores", "Notificaciones"),
    grupos,
  );
}

/* ---------- Copiar y enlaces ---------- */

// Copia un texto y devuelve true si lo logró. Si el navegador no deja usar el
// portapapeles moderno, prueba con la forma antigua.
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const caja = document.createElement("textarea");
    caja.value = texto;
    caja.setAttribute("readonly", "");
    // Dentro de una ventana abierta, el texto solo se puede elegir si va en ella
    (document.querySelector("dialog[open]") ?? document.body).append(caja);
    caja.select();
    const copiado = document.execCommand("copy");
    caja.remove();
    return copiado;
  }
}

async function copiarYAvisar(texto, titulo, mensaje) {
  if (await copiarTexto(texto)) {
    mostrarAviso("exito", titulo, mensaje);
  } else {
    // TODO: Figma no define este aviso
    mostrarAviso("error", "No se pudo copiar");
  }
}

// Un enlace que se ve como botón inferior
function crearBotonDeEnlace(texto, destino) {
  const enlace = crearElemento("a", "boton boton--primario detalle__boton boton--enlace", texto);
  enlace.href = destino;
  return enlace;
}

/* ---------- Cotizar eventos (Figma 70 y 70b) ---------- */

const NUMERO_DE_COTIZACIONES = "+503 7140 0499";
const MENSAJE_DE_COTIZACION = "Hola, quiero cotizar un evento.";

// "https://wa.me/50371400499?text=…"
function crearEnlaceDeWhatsApp(numero, mensaje) {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
}

function dibujarCotizar(contenedor) {
  const presentacion = crearElemento("div", "cotizar");
  const tarjeta = crearElemento("div", "cotizar__tarjeta");
  tarjeta.append(
    crearElemento("p", "cotizar__etiqueta", "WhatsApp de cotizaciones"),
    crearElemento("p", "cotizar__numero", NUMERO_DE_COTIZACIONES),
    crearElemento("p", "cotizar__detalle", "Para un servicio personalizado"),
  );
  presentacion.append(
    crearImagen("cotizar__imagen", "img/buho-taza.png"),
    crearElemento("h1", "vacio__titulo", "¿Tienes un evento?"),
    crearElemento(
      "p",
      "vacio__texto",
      "Escríbenos por WhatsApp y armamos contigo el menú para tu reunión o celebración.",
    ),
    tarjeta,
  );

  const escribir = crearBotonDeEnlace(
    "Escribir por WhatsApp",
    crearEnlaceDeWhatsApp(NUMERO_DE_COTIZACIONES, MENSAJE_DE_COTIZACION),
  );
  escribir.target = "_blank";
  escribir.rel = "noopener noreferrer";
  const acciones = crearElemento("div", "cuenta__acciones");
  acciones.append(
    escribir,
    crearBotonDeTexto("Copiar número", () =>
      copiarYAvisar(
        NUMERO_DE_COTIZACIONES,
        "Número copiado",
        "Pégalo en WhatsApp o guárdalo en tus contactos.",
      ),
    ),
  );

  montarPantallaDeMas(
    contenedor,
    { titulo: "Cotizar eventos", anterior: "#/mas" },
    presentacion,
    acciones,
  );
}
