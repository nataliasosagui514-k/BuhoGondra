// Pantallas del chatbot y el botón que lo abre. Aquí no se cambian pedidos: eso lo
// hacen las funciones de js/chatbot.js.

/* ---------- Botón ChatBot y burbuja de ayuda (Figma 1526:11315) ---------- */

// Componente "Burbuja de ayuda" (Figma 1792:4731), con el tamaño que tiene en M1c:
// el cuerpo y la cola que apunta al botón
const FORMA_DE_LA_BURBUJA =
  "M12.33 0H114.67C117.94 0 121.08 1.09 123.39 3.04C125.7 4.98 127 7.62 127 10.37" +
  "C127 13.12 125.7 15.76 123.39 17.7C121.08 19.65 117.94 20.74 114.67 20.74H109.74" +
  "L109.74 28L100.49 20.74H12.33C9.06 20.74 5.92 19.65 3.61 17.7C1.3 15.76 0 13.12 0 10.37" +
  "C0 7.62 1.3 4.98 3.61 3.04C5.92 1.09 9.06 0 12.33 0Z";

// Componente "Botón del chatbot" (Figma 839:2584)
const ICONO_DEL_CHATBOT = [
  [
    1.67,
    1.67,
    "M3.33 0H13.33C14.22 0 15.07 0.35 15.69 0.98C16.32 1.6 16.67 2.45 16.67 3.33V9.17" +
      "C16.67 10.05 16.32 10.9 15.69 11.52C15.07 12.15 14.22 12.5 13.33 12.5H9.17" +
      "L6.25 15.83V12.5H3.33C2.45 12.5 1.6 12.15 0.98 11.52C0.35 10.9 0 10.05 0 9.17" +
      "V3.33C0 2.45 0.35 1.6 0.98 0.98C1.6 0.35 2.45 0 3.33 0Z",
  ],
  [6.5, 7.33, "M0 0H7L6.42 3.67H0.58Z"],
  [8.17, 5.5, "M0 1.83C0 1.35 0.19 0.88 0.54 0.54C0.88 0.19 1.35 0 1.83 0C2.32 0 2.79 0.19 3.13 0.54C3.47 0.88 3.67 1.35 3.67 1.83"],
];

// Un solo enlace: tocar la burbuja o el botón abre el chat
function crearAccesoAlChat() {
  const forma = crearIconoSvg("ayuda-chat__forma", 28, [FORMA_DE_LA_BURBUJA]);
  forma.setAttribute("viewBox", "0 0 127 28");
  const burbuja = crearElemento("span", "ayuda-chat__burbuja");
  burbuja.append(forma, crearElemento("span", "ayuda-chat__texto", "Ayuda con el pedido"));

  const boton = crearElemento("span", "ayuda-chat__boton");
  boton.append(crearIconoSvg("ayuda-chat__icono", 20, ICONO_DEL_CHATBOT), "ChatBot");

  const enlace = crearElemento("a", "ayuda-chat");
  enlace.href = "#/chatbot";
  enlace.append(burbuja, boton);
  return enlace;
}

// En Menú de hoy: solo si hay un pedido activo (nota de Figma 1526:11407)
function mostrarAccesoAlChat(contenedor) {
  if (!obtenerPedidoActivo()) {
    return;
  }
  const menu = contenedor.querySelector(".menu");
  menu.classList.add("menu--con-chat");
  menu.append(crearAccesoAlChat());
}

/* ---------- Conversación (Figma 1010:4870 a 1010:5195) ---------- */

// TODO: Figma pide que Búhi "escriba" un momento antes de responder, sin decir cuánto
const PAUSA_DE_BUHI = 700;
const RESPUESTAS_A_LA_VEZ = 3;

// Única función que crea una opción del chat (respuesta rápida)
function crearRespuesta(texto, alTocar) {
  const respuesta = crearElemento("button", "respuesta-rapida", texto);
  respuesta.type = "button";
  respuesta.addEventListener("click", alTocar);
  return respuesta;
}

function crearMensaje(autor, ...partes) {
  const mensaje = crearElemento("p", `mensaje mensaje--${autor}`);
  mensaje.append(...partes);
  return mensaje;
}

// Lo que se puede hacer en la conversación. "registro" guarda los mensajes.
function crearConversacion(registro) {
  const mostrar = (elemento) => {
    registro.append(elemento);
    elemento.scrollIntoView({ block: "nearest" });
    return elemento;
  };

  const decir = (autor, texto) => mostrar(crearMensaje(autor, texto));

  // Búhi muestra los tres puntos antes de cada respuesta. Devuelve false si mientras
  // tanto la persona salió del chat.
  const responder = async (...textos) => {
    for (const texto of textos) {
      const puntos = crearMensaje(
        "buhi",
        ...[1, 2, 3].map(() => crearElemento("span", "mensaje__punto")),
      );
      puntos.classList.add("mensaje--escribiendo");
      // TODO: Figma no define cómo lo anuncia un lector de pantalla
      puntos.setAttribute("aria-hidden", "true");
      mostrar(puntos);
      await new Promise((listo) => setTimeout(listo, PAUSA_DE_BUHI));
      if (!registro.isConnected) {
        return false;
      }
      puntos.remove();
      decir("buhi", texto);
    }
    return true;
  };

  // Respuestas rápidas: al tocar una, queda como mensaje y las demás desaparecen. Se
  // ven tres a la vez.
  const ofrecer = (opciones, desde = 0) => {
    const grupo = crearElemento("div", "respuestas-rapidas");
    grupo.append(
      ...opciones.slice(desde, desde + RESPUESTAS_A_LA_VEZ).map(({ texto, alElegir }) =>
        crearRespuesta(texto, () => {
          grupo.remove();
          decir("persona", texto);
          alElegir();
        }),
      ),
    );
    if (opciones.length > RESPUESTAS_A_LA_VEZ) {
      // Al llegar al final, vuelve a las primeras
      const siguiente = desde + RESPUESTAS_A_LA_VEZ;
      grupo.append(
        crearRespuesta("Ver más", () => {
          grupo.remove();
          ofrecer(opciones, siguiente < opciones.length ? siguiente : 0);
        }),
      );
    }
    mostrar(grupo);
  };

  return { decir, responder, ofrecer };
}

/* ---------- Cómo se escribe un pedido ---------- */

// "las 12:30 p. m.", pero "la 1:30 p. m."
function conArticulo(hora) {
  const articulo = formatearHora(hora).startsWith("1:") ? "la" : "las";
  return `${articulo} ${formatearHora(hora)}`;
}

// En un pedido mixto: "las 12:30 p. m. y a las 2:00 p. m."
// TODO: Figma no muestra el pedido mixto en el chat
function describirHorasEnElChat(pedido) {
  return obtenerVentanasDelPedido(pedido)
    .map((ventana) => conArticulo(obtenerHoraDeVentana(pedido, ventana)))
    .join(" y a ");
}

// "Filete de pollo". TODO: Figma abrevia ("pollo con arroz") sin decir cómo
function nombrarParaBuhi(pedido) {
  const articulos = detallarLineas(pedido.platillos, pedido.fecha);
  return articulos.length ? titularTicket(articulos).replace(/ \(combo\)/g, "") : "";
}

// "#A-1042 · Pupusas · 1:00" (Figma 30b)
function nombrarEnLaLista(pedido) {
  const [primera] = obtenerVentanasDelPedido(pedido);
  return unirConPuntos(
    [
      `#${pedido.numero}`,
      nombrarParaBuhi(pedido),
      separarHora(obtenerHoraDeVentana(pedido, primera)).hora,
    ].filter(Boolean),
  );
}

// 30
function saludarConPedido(pedido) {
  const platillo = nombrarParaBuhi(pedido).toLowerCase();
  return (
    `Tu pedido #${pedido.numero}${platillo ? ` (${platillo})` : ""} es para ` +
    `${describirHorasEnElChat(pedido)} en ${nombrarCafeteria(pedido.cafeteria)}. ¿En qué te ayudo?`
  );
}

/* ---------- Pasos del chat ---------- */

// Cada paso recibe "chat": { decir, responder, ofrecer, contenedor, id }, donde "id"
// es el pedido del que se está hablando

function ofrecerCambios(chat) {
  chat.ofrecer([
    { texto: "Cancelar mi pedido", alElegir: () => empezarACancelar(chat) },
    { texto: "No llegaré a tiempo", alElegir: () => empezarCambioDeHora(chat) },
    { texto: "Cambiar de cafetería", alElegir: () => empezarCambioDeCafeteria(chat) },
  ]);
}

// Saluda con un pedido (30) y ofrece los cambios. La primera vez no hay puntos de
// "escribiendo": la pantalla 30 ya abre con el mensaje.
async function atenderPedido(chat, pedido, { deInmediato = false } = {}) {
  chat.id = pedido.id;
  if (deInmediato) {
    chat.decir("buhi", saludarConPedido(pedido));
  } else if (!(await chat.responder(saludarConPedido(pedido)))) {
    return;
  }
  ofrecerCambios(chat);
}

// 30b: con varios pedidos activos, primero se elige cuál
function preguntarCualPedido(chat, activos) {
  chat.ofrecer(
    activos.map((pedido) => ({
      texto: nombrarEnLaLista(pedido),
      alElegir: () => {
        const actual = buscarPedidoActivo(pedido.id);
        if (actual) {
          atenderPedido(chat, actual);
        } else {
          avisarQueNoSePudo(chat, "no-activo");
        }
      },
    })),
  );
}

function preguntaDeCualPedido(activos) {
  return `Tienes ${activos.length} pedidos activos. ¿Sobre cuál pedido?`;
}

// Después de "Sí": las opciones del mismo pedido; si se canceló, las de otro
async function seguirAyudando(chat) {
  const activos = obtenerPedidosActivos();
  if (activos.some((pedido) => pedido.id === chat.id)) {
    ofrecerCambios(chat);
  } else if (activos.length === 1) {
    atenderPedido(chat, activos[0]);
  } else if (!activos.length) {
    // TODO: Figma no dice qué pasa si ya no queda ningún pedido activo
    despedirse(chat);
  } else if (await chat.responder(preguntaDeCualPedido(activos))) {
    preguntarCualPedido(chat, activos);
  }
}

// "¿Necesitas algo más?": "Sí" vuelve a las opciones y "No" se despide
async function preguntarSiNecesitaAlgo(chat, ...antes) {
  if (!(await chat.responder(...antes, "¿Necesitas algo más?"))) {
    return;
  }
  chat.ofrecer([
    { texto: "Sí", alElegir: () => seguirAyudando(chat) },
    { texto: "No", alElegir: () => despedirse(chat) },
  ]);
}

// 34
async function despedirse(chat) {
  if (!(await chat.responder("¡Listo! Aquí estaré si me necesitas."))) {
    return;
  }
  const acciones = crearElemento("div", "cuenta__acciones");
  acciones.append(crearBotonInferior("Volver al inicio", () => volverA("#/menu")));
  chat.contenedor.querySelector(".cuenta").append(acciones);
  acciones.scrollIntoView({ block: "nearest" });
}

// Por qué no se hizo un cambio. El mensaje de "tarde" lo pone quien llama.
// TODO: Figma solo escribe los mensajes de "después de las 11" (31d y 33c)
function avisarQueNoSePudo(chat, motivo, mensajeDeTarde) {
  const mensajes = {
    tarde: mensajeDeTarde,
    "no-activo": "Este pedido ya no se puede cambiar.",
    hora: "Esa hora ya no está disponible.",
    cafeteria: "No se pudo cambiar a esa cafetería.",
    "sin-guardado": "No se pudo guardar el cambio.",
  };
  return preguntarSiNecesitaAlgo(chat, mensajes[motivo]);
}

// El pedido tal como está ahora, o null (y lo dice) si ya no está activo
function revisarPedido(chat) {
  const pedido = buscarPedidoActivo(chat.id);
  if (!pedido) {
    avisarQueNoSePudo(chat, "no-activo");
  }
  return pedido;
}

// 31c y "No, mantener hora"
function mantenerPedido(chat) {
  const pedido = revisarPedido(chat);
  if (pedido) {
    preguntarSiNecesitaAlgo(
      chat,
      `¡Tu pedido sigue en curso! Recógelo a ${describirHorasEnElChat(pedido)} en ` +
        `${nombrarCafeteria(pedido.cafeteria)}.`,
    );
  }
}

/* Cancelar (31, 31b, 31c y 31d) */

const TARDE_PARA_CANCELAR =
  "Ya no se puede cancelar después de las 11 a. m.: la cafetería ya está preparando tu pedido.";

function empezarACancelar(chat) {
  const pedido = revisarPedido(chat);
  if (!pedido) {
    return;
  }
  if (!estaATiempoDeCambiar()) {
    avisarQueNoSePudo(chat, "tarde", TARDE_PARA_CANCELAR);
    return;
  }
  const cerrar = () => {
    ventana.close();
    ventana.remove();
  };
  const mantener = () => {
    cerrar();
    mantenerPedido(chat);
  };
  const ventana = crearVentana({
    tipo: "peligro",
    titulo: `¿Cancelar tu pedido #${pedido.numero}?`,
    mensaje:
      "No se puede deshacer. Perderás tu lugar y la comida quedará libre para otros estudiantes.",
    textoBoton: "Sí, cancelar pedido",
    tipoBoton: "peligro",
    alTocar: () => {
      cerrar();
      // cancelarPedido revisa otra vez la hora: pudieron dar las 11 con la ventana abierta
      const resultado = cancelarPedido(pedido.id);
      if (resultado.ok) {
        preguntarSiNecesitaAlgo(
          chat,
          `Listo, tu pedido #${pedido.numero} fue cancelado. El ticket ya no sirve.`,
        );
      } else {
        avisarQueNoSePudo(chat, resultado.motivo, TARDE_PARA_CANCELAR);
      }
    },
    segundo: { texto: "No, mantener", alTocar: mantener },
    // Escape o un toque afuera hacen lo mismo que "No, mantener" (nota de Figma 31)
    alCerrar: mantener,
  });
  abrirDialogo(chat.contenedor, ventana);
}

/* No llegaré a tiempo (32 y 32b) */

async function empezarCambioDeHora(chat) {
  if (!revisarPedido(chat) || !(await chat.responder("¿Quieres cambiar la hora de recogida?"))) {
    return;
  }
  chat.ofrecer([
    { texto: "Sí, cambiar hora", alElegir: () => elegirParteDeLaHora(chat) },
    { texto: "No, mantener hora", alElegir: () => mantenerPedido(chat) },
  ]);
}

// Un pedido mixto tiene dos horas: se pregunta cuál se cambia
async function elegirParteDeLaHora(chat) {
  const pedido = revisarPedido(chat);
  if (!pedido) {
    return;
  }
  const partes = obtenerVentanasDelPedido(pedido).filter(
    (ventana) => listarHorasNuevas(pedido, ventana).length,
  );
  if (!partes.length) {
    // TODO: Figma no muestra el caso sin horas libres
    preguntarSiNecesitaAlgo(chat, "Ya no quedan horas para cambiar la recogida.");
  } else if (partes.length === 1) {
    elegirHoraNueva(chat, partes[0]);
  } else if (await chat.responder("¿Cuál hora quieres cambiar?")) {
    // TODO: Figma no muestra el pedido mixto en el chat
    chat.ofrecer(
      partes.map((parte) => ({
        texto: NOMBRES_DE_PARTE[parte],
        alElegir: () => elegirHoraNueva(chat, parte),
      })),
    );
  }
}

async function elegirHoraNueva(chat, parte) {
  // La hora final ya termina en punto ("p. m.")
  const fin = formatearHora(obtenerRangoDeRecogida(parte).hasta);
  if (!(await chat.responder(`Elige la nueva hora. Se recoge hasta las ${fin}`))) {
    return;
  }
  const pedido = revisarPedido(chat);
  if (!pedido) {
    return;
  }
  chat.ofrecer(
    listarHorasNuevas(pedido, parte).map((hora) => ({
      texto: formatearHora(hora),
      alElegir: () => {
        const resultado = cambiarHoraPedido(pedido.id, hora, parte);
        if (!resultado.ok) {
          avisarQueNoSePudo(chat, resultado.motivo);
          return;
        }
        // TODO: Figma no muestra qué dice si solo cambia una de las dos horas
        const que = esPedidoMixto(resultado.pedido.horaRecogida)
          ? { almuerzo: "el almuerzo ", tipicos: "los típicos " }[parte]
          : "";
        preguntarSiNecesitaAlgo(
          chat,
          `Listo: ahora recoges ${que}a ${conArticulo(hora)} en ` +
            `${nombrarCafeteria(resultado.pedido.cafeteria)}. Tu ticket ya está actualizado.`,
        );
      },
    })),
  );
}

/* Cambiar de cafetería (33, 33b y 33c) */

const TARDE_PARA_CAMBIAR_DE_CAFETERIA =
  "Ya no se puede cambiar de cafetería después de las 11 a. m.: la cafetería ya está preparando tu pedido.";

async function empezarCambioDeCafeteria(chat) {
  const pedido = revisarPedido(chat);
  if (!pedido) {
    return;
  }
  if (!estaATiempoDeCambiar()) {
    avisarQueNoSePudo(chat, "tarde", TARDE_PARA_CAMBIAR_DE_CAFETERIA);
    return;
  }
  const pregunta = `Ahora recoges en ${nombrarCafeteria(pedido.cafeteria)}. ¿A cuál quieres cambiar?`;
  if (!(await chat.responder(pregunta))) {
    return;
  }
  chat.ofrecer(
    listarOtrasCafeterias(pedido).map((cafeteria) => ({
      texto: nombrarCafeteria(cafeteria.id),
      alElegir: () => {
        const resultado = cambiarCafeteriaPedido(pedido.id, cafeteria.id);
        if (!resultado.ok) {
          avisarQueNoSePudo(chat, resultado.motivo, TARDE_PARA_CAMBIAR_DE_CAFETERIA);
          return;
        }
        // Las horas ya terminan en punto ("p. m.")
        preguntarSiNecesitaAlgo(
          chat,
          `Listo: ahora recoges en ${nombrarCafeteria(cafeteria.id)} a ` +
            `${describirHorasEnElChat(resultado.pedido)} Tu ticket ya está actualizado.`,
        );
      },
    })),
  );
}

/* ---------- La pantalla #/chatbot (Figma 30 y 30b) ---------- */

// Con "?pedido=id" (desde el Historial) empieza hablando de ese pedido
function dibujarChatbot(contenedor, { parametros }) {
  const activos = obtenerPedidosActivos();
  if (!activos.length) {
    location.replace("#/menu");
    return;
  }
  const saludo = crearElemento("div", "chat__saludo");
  // TODO: Figma no muestra el saludo de un invitado, que no tiene nombre
  const nombre = obtenerCuentaDeLaSesion()?.cuenta.nombre;
  saludo.append(
    crearImagen("chat__buhi", "img/buhi-ayuda.png"),
    crearElemento("h2", "chat__nombre", nombre ? `Hola, ${nombre}` : "Hola"),
    crearElemento("p", "vacio__texto", "Te ayudo con tu pedido de hoy."),
  );
  const registro = crearElemento("div", "chat__conversacion");
  registro.setAttribute("role", "log");
  // TODO: Figma no define el nombre de la conversación para lectores de pantalla
  registro.setAttribute("aria-label", "Conversación con Búhi");

  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(() => {
      // "Atrás" cierra el chat y regresa a donde estaba (nota de Figma 30)
      if (history.state?.desde) {
        history.back();
      } else {
        location.replace("#/menu");
      }
    }, "Búhi, tu asistente"),
    saludo,
    registro,
  );

  const chat = { ...crearConversacion(registro), contenedor, id: null };
  const elegido = activos.find((pedido) => pedido.id === parametros.get("pedido"));
  if (elegido || activos.length === 1) {
    atenderPedido(chat, elegido ?? activos[0], { deInmediato: true });
  } else {
    chat.decir("buhi", preguntaDeCualPedido(activos));
    preguntarCualPedido(chat, activos);
  }
}
