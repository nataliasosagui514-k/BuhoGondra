// Pantallas de Apartar pedido. Las cuentas vienen de js/pedido.js.

/* ---------- Textos y piezas comunes ---------- */

function empezarEnMinuscula(texto) {
  return `${texto.charAt(0).toLowerCase()}${texto.slice(1)}`;
}

function empezarEnMayuscula(texto) {
  return `${texto.charAt(0).toUpperCase()}${texto.slice(1)}`;
}

// "a", "a y b", "a, b y c"
function unirEnFrase(partes) {
  return partes.length > 1
    ? `${partes.slice(0, -1).join(", ")} y ${partes.at(-1)}`
    : (partes[0] ?? "");
}

// ["1 de frijol con queso", "1 revuelta"]. Así lo escribe Figma (1377:9384): los
// rellenos llevan "de"; "revuelta", que describe a la pupusa, no.
function listarTipos(linea) {
  return Object.entries(linea.opciones.tipo).map(([tipo, cantidad]) => {
    const nombre = empezarEnMinuscula(tipo);
    return `${cantidad} ${nombre === "revuelta" ? "" : "de "}${nombre}`;
  });
}

// Nombres de las opciones elegidas, en el orden de los grupos y en minúscula.
function listarOpciones(platillo, opciones) {
  return (platillo.opciones ?? [])
    .map((grupo) => opciones[grupo.id])
    .filter((valor) => typeof valor === "string")
    .map(empezarEnMinuscula);
}

// "Arroz · ensalada fresca · …"
function unirConPuntos(partes) {
  return partes.join(" · ");
}

// Foto, categoría, nombre y precio (Figma 1346:8846). Reutiliza la fila de Comentarios.
// Con varias unidades el nombre es "2 × Pupusas" (Figma 1377:9381). Sin precio
// todavía (falta elegir la presentación), la fila no lo muestra.
function crearFilaDePlatillo(platillo, precio, cantidad = 1) {
  const fila = crearPlatilloResumido(platillo);
  if (cantidad > 1) {
    fila.querySelector(".platillo-resumido__nombre").textContent =
      `${cantidad} × ${platillo.nombre}`;
  }
  if (precio !== null) {
    fila.append(crearElemento("p", "platillo-resumido__precio", formatearPrecio(precio)));
  }
  return fila;
}

// Escribe el título y pone el botón de volver en una pantalla de Apartar.
function prepararEncabezado(contenedor, titulo, alVolver) {
  const encabezado = contenedor.querySelector(".encabezado-interno");
  encabezado.querySelector("h1").textContent = titulo;
  encabezado.prepend(crearBotonVolver(alVolver));
}

// El platillo del menú de hoy, que es el único que se puede apartar. Si no está,
// deja en pantalla el mensaje que lo explica y devuelve null.
function obtenerPlatilloDeHoy(contenedor, id) {
  const fecha = obtenerFechaDeHoy();
  const platillo = obtenerPlatillo(id, fecha);
  if (!platillo) {
    const mensaje = obtenerMenuDelDia(fecha)
      ? // TODO: Figma no define el mensaje de platillo no encontrado
        crearElemento("h1", "no-encontrado__titulo", "No encontramos ese platillo")
      : crearAvisoSinMenu();
    contenedor.replaceChildren(crearMensajeConRegreso(mensaje));
  }
  return platillo;
}

// "12:30" -> "12:30 p. m."
function formatearHora(hora24) {
  const { hora, periodo } = separarHora(hora24);
  return `${hora} ${periodo}`;
}

// Lo elegido en una línea, para la pantalla de hora: "Arroz · ensalada fresca · …" o
// "1 de frijol con queso · 1 revuelta".
function describirLinea(platillo, linea) {
  if (linea.opciones.tipo) {
    return unirConPuntos(listarTipos(linea));
  }
  return empezarEnMayuscula(unirConPuntos(listarOpciones(platillo, linea.opciones)));
}

// Junta cada línea con su platillo del menú de ese día y con lo que cuesta, con el
// almuerzo primero.
function detallarLineas(lineas, fecha = obtenerFechaDeHoy()) {
  const articulos = lineas.flatMap((linea) => {
    const platillo = obtenerPlatillo(linea.id, fecha);
    return platillo
      ? [{ linea, platillo, precio: obtenerPrecio(platillo, linea), cantidad: linea.cantidad }]
      : [];
  });
  return ordenarPorVentana(articulos);
}

// "Filete de pollo (combo)": son combos los platos con guarnición.
function nombrarEnElPedido(platillo) {
  const esCombo = platillo.opciones?.some((grupo) => grupo.id === "guarnicion");
  return esCombo ? `${platillo.nombre} (combo)` : platillo.nombre;
}

// "1 × Filete de pollo (combo)"
function nombrarConCantidad(articulo) {
  return `${articulo.cantidad} × ${nombrarEnElPedido(articulo.platillo)}`;
}

// El título del ticket: "Filete de pollo (combo)" o, con varios platillos,
// "Filete de pollo y 2 pupusas" (Figma 1377:9703).
// TODO: Figma no muestra tres platillos o más; se unen con comas y "y".
function titularTicket(articulos) {
  const platillos = contarPorPlatillo(articulos);
  if (platillos.length === 1) {
    return nombrarEnElPedido(platillos[0].platillo);
  }
  return unirEnFrase(
    platillos.map(({ platillo, cantidad }, posicion) => {
      if (cantidad > 1) {
        return `${cantidad} ${empezarEnMinuscula(platillo.nombre)}`;
      }
      return posicion ? empezarEnMinuscula(platillo.nombre) : platillo.nombre;
    }),
  );
}

// Para la revisión: "Con arroz, ensalada fresca, fresco de tamarindo y 2 tortillas" o
// "1 de frijol con queso y 1 revuelta"
function describirEnFrase(platillo, linea) {
  if (linea.opciones.tipo) {
    return unirEnFrase(listarTipos(linea));
  }
  // TODO: Figma no muestra la presentación en la revisión; va solo su nombre
  if (linea.opciones.presentacion) {
    return linea.opciones.presentacion;
  }
  const elegidas = listarOpciones(platillo, linea.opciones);
  const incluidas = elegidas.filter((opcion) => !opcion.startsWith("sin "));
  const frase = incluidas.length ? `Con ${unirEnFrase(incluidas)}` : "";
  // TODO: Figma no muestra cómo se escribe un grupo "Sin …"
  const sin = elegidas.filter((opcion) => opcion.startsWith("sin "));
  return unirConPuntos([frase, ...sin].filter(Boolean));
}

// Cómo se llama cada parte de un pedido mixto
const NOMBRES_DE_PARTE = { almuerzo: "Almuerzo", tipicos: "Típicos" };

// Las líneas de hora de la revisión: una o, en un pedido mixto, una por parte.
function describirRecogidaEnRevision(horaRecogida) {
  return esPedidoMixto(horaRecogida)
    ? Object.entries(horaRecogida).map(
        ([parte, hora]) => `${NOMBRES_DE_PARTE[parte]}: hoy a las ${formatearHora(hora)}`,
      )
    : [`Recoger hoy a las ${formatearHora(horaRecogida)}`];
}

// La del ticket va en una sola línea: "Almuerzo 12:30 p. m. · Típicos 3:00 p. m."
function describirRecogidaEnTicket(horaRecogida) {
  return esPedidoMixto(horaRecogida)
    ? [
        unirConPuntos(
          Object.entries(horaRecogida).map(
            ([parte, hora]) => `${NOMBRES_DE_PARTE[parte]} ${formatearHora(hora)}`,
          ),
        ),
      ]
    : describirRecogidaEnRevision(horaRecogida);
}

// Caja gris con cuándo (una o varias líneas) y dónde se recoge.
function crearCajaGris(destacadas, lugar) {
  const caja = crearElemento("div", "recogida");
  caja.append(
    ...destacadas.map((linea) => crearElemento("p", "recogida__hora", linea)),
    crearElemento("p", "recogida__lugar", lugar),
  );
  return caja;
}

// La caja con la hora y la cafetería. La usan la revisión y el ticket del pedido.
function crearCajaDeRecogida(horas, idCafeteria) {
  return crearCajaGris(horas, nombrarCafeteria(idCafeteria));
}

function nombrarCafeteria(idCafeteria) {
  return `Cafetería ${CAFETERIAS.find((una) => una.id === idCafeteria)?.nombre ?? ""}`;
}

/* ---------- Ventana (Figma 834:2458) ---------- */

const ICONOS_DE_VENTANA = {
  exito: {
    caja: 56,
    trazos: ["M19 28L25.5455 34.5L37 21.5"],
  },
  informacion: {
    caja: 28,
    trazos: [
      "M24.5 14C24.5 19.8 19.8 24.5 14 24.5C8.2 24.5 3.5 19.8 3.5 14C3.5 8.2 8.2 3.5 14 3.5" +
        "C19.8 3.5 24.5 8.2 24.5 14Z",
      "M14 12.83V19.25",
      "M14 8.98H14.01",
    ],
  },
};
// La de invitado (Figma 1003:4839) usa el mismo icono, en azul
ICONOS_DE_VENTANA.invitado = ICONOS_DE_VENTANA.informacion;

// Ventana centrada sobre un fondo oscuro, con uno o dos botones ("segundo": { texto,
// alTocar }). Si recibe "alCerrar", también se cierra al tocar fuera.
function crearVentana({ tipo, titulo, destacado, mensaje, textoBoton, alTocar, segundo, alCerrar }) {
  const { caja, trazos } = ICONOS_DE_VENTANA[tipo];
  const circulo = crearElemento("span", "ventana__circulo");
  circulo.append(crearIconoSvg("ventana__icono", caja, trazos));

  const ventana = crearElemento("dialog", `ventana ventana--${tipo}`);
  const encabezado = crearElemento("h2", "ventana__titulo", titulo);
  encabezado.id = "titulo-ventana";
  ventana.setAttribute("aria-labelledby", encabezado.id);
  ventana.append(
    circulo,
    encabezado,
    ...(destacado ? [crearElemento("p", "ventana__destacado", destacado)] : []),
    ...(mensaje ? [crearElemento("p", "ventana__mensaje", mensaje)] : []),
    crearBotonInferior(textoBoton, alTocar),
    ...(segundo ? [crearBotonInferior(segundo.texto, segundo.alTocar, "contorno")] : []),
  );
  // La tecla Escape cierra la ventana o, si no se puede cerrar, hace lo mismo que el botón
  ventana.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    (alCerrar ?? alTocar)();
  });
  if (alCerrar) {
    // Un toque en el fondo llega al diálogo, pero fuera de su rectángulo
    ventana.addEventListener("click", (evento) => {
      const { left, right, top, bottom } = ventana.getBoundingClientRect();
      const { clientX: x, clientY: y } = evento;
      if (evento.target === ventana && (x < left || x > right || y < top || y > bottom)) {
        alCerrar();
      }
    });
  }
  return ventana;
}

// Agrega una ventana o una hoja a la pantalla y la abre encima de todo.
function abrirDialogo(contenedor, dialogo) {
  // El foco entra al diálogo, no al primer botón (así no aparece su anillo al abrir)
  dialogo.setAttribute("autofocus", "");
  dialogo.tabIndex = -1;
  contenedor.append(dialogo);
  dialogo.showModal();
  // Algunos navegadores no respetan "autofocus" en el propio diálogo
  dialogo.focus();
}

// "Horario cerrado" (Figma 1374:9939): no deja avanzar.
function mostrarHorarioCerrado(contenedor) {
  abrirDialogo(
    contenedor,
    crearVentana({
      tipo: "informacion",
      titulo: "El horario de pedidos cerró",
      // El rango ya termina en punto ("a. m.")
      mensaje: `Los pedidos se reciben de ${formatearRango(HORARIOS.apartar)} No se apartó nada.`,
      textoBoton: "Volver al menú",
      alTocar: () => {
        location.hash = "#/menu";
      },
    }),
  );
}

/* ---------- Apartar un platillo ---------- */

// Lo que hace el botón "Apartar": recuerda lo elegido y pasa a hora y cafetería. Sin
// sesión, aparece la ventana de invitado.
function apartar(platillo, linea) {
  guardarSeleccion(linea);
  if (!obtenerSesion()) {
    pedirCuentaParaApartar(platillo, linea);
    return;
  }
  lineaDeInvitado = null;
  location.hash = `#/apartar/${platillo.id}`;
}

/* ---------- Hora y cafetería (Figma 1374:9387) ---------- */

// Un botón de opción con su etiqueta. Lo usan las horas y las cafeterías.
function crearOpcion(clase, nombre, valor, elegida, contenido) {
  const entrada = crearElemento("input", "opcion__entrada");
  entrada.type = "radio";
  entrada.name = nombre;
  entrada.value = valor;
  entrada.checked = elegida;
  entrada.required = true;
  const marca = crearElemento("span", "opcion__marca");
  marca.append(crearIconoSvg("opcion__palomita", 14, ["M2.92 7.29L5.54 9.92L11.08 4.38"]));
  const etiqueta = crearElemento("label", `opcion ${clase}`);
  etiqueta.append(entrada, marca, ...contenido);
  return etiqueta;
}

// Título, explicación y las opciones de un grupo.
function crearPregunta(clase, titulo, explicacion, opciones) {
  const encabezado = crearElemento("legend", "pregunta__encabezado");
  encabezado.append(
    crearElemento("span", "pregunta__titulo", titulo),
    crearElemento("span", "pregunta__explicacion", explicacion),
  );
  const lista = crearElemento("div", clase);
  lista.append(...opciones);
  const pregunta = crearElemento("fieldset", "pregunta");
  pregunta.append(encabezado, lista);
  return pregunta;
}

// Textos de cada bloque de hora en un pedido mixto (Figma 1377:9318)
const PREGUNTAS_DE_PARTE = {
  almuerzo: "¿A qué hora recoges el almuerzo?",
  tipicos: "¿A qué hora recoges los típicos?",
};

// "Filete de pollo". TODO: Figma no muestra una parte con varios platillos; se unen
// con comas y "y".
function nombrarPlatillosDeLaParte(articulos) {
  return unirEnFrase(
    contarPorPlatillo(articulos).map(({ platillo }, posicion) =>
      posicion ? empezarEnMinuscula(platillo.nombre) : platillo.nombre,
    ),
  );
}

// El bloque de horas de una parte. En un pedido mixto dice de qué platillos es. El
// grupo se llama "hora-almuerzo" u "hora-tipicos": cada bloque exige elegir una.
function crearPreguntaDeHora(ventana, elegida, articulos, mixto) {
  const rango = formatearRango(obtenerRangoDeRecogida(ventana));
  const deLaParte = articulos.filter(
    ({ platillo }) => platillo.ventana_recogida === ventana,
  );
  return crearPregunta(
    "horas",
    mixto ? PREGUNTAS_DE_PARTE[ventana] : "¿A qué hora lo recoges?",
    mixto ? `${nombrarPlatillosDeLaParte(deLaParte)} · hoy, de ${rango}` : `Hoy, de ${rango}`,
    crearHorasDeRecogida(ventana).map((hora) =>
      crearOpcion("chip", `hora-${ventana}`, hora, hora === elegida, [
        crearElemento("span", "chip__hora", formatearHora(hora)),
      ]),
    ),
  );
}

// Caja "Elige tu opción" (Figma 1176:7290 y 1228:7895), aquí con botones de opción.
// Ninguna llega marcada.
// TODO: Figma no dibuja esta caja con una opción marcada; el círculo es el de cafetería.
function crearCajaDePresentacion(platillo, elegida) {
  const lista = crearElemento("div", "presentaciones__lista");
  lista.append(
    ...obtenerPresentaciones(platillo).map(({ nombre, precio }) =>
      crearOpcion("presentacion", "presentacion", nombre, nombre === elegida, [
        crearElemento("span", "presentacion__texto", `${nombre} · ${formatearPrecio(precio)}`),
      ]),
    ),
  );
  const caja = crearElemento("fieldset", "caja presentaciones");
  caja.append(crearElemento("legend", "caja__titulo presentaciones__titulo", "Elige tu opción"), lista);
  return caja;
}

function crearPreguntaDeCafeteria(elegida, mixto) {
  return crearPregunta(
    "cafeterias",
    "¿Dónde lo recoges?",
    mixto
      ? "Las dos partes se entregan en la misma cafetería."
      : "Funda Gondra lleva tu pedido a la cafetería que elijas.",
    CAFETERIAS.map((cafeteria) => {
      const textos = crearElemento("span", "cafeteria__textos");
      textos.append(
        crearElemento("span", "cafeteria__nombre", `Cafetería ${cafeteria.nombre}`),
        crearElemento("span", "cafeteria__detalle", "Recoges tu pedido en caja"),
      );
      return crearOpcion("cafeteria", "cafeteria", cafeteria.id, cafeteria.id === elegida, [
        textos,
      ]);
    }),
  );
}

/* ---------- Revisa tu pedido (Figma 1374:9516) ---------- */

// Una línea de la revisión, con su botón para quitarla (oculto hasta "Cambiar algo").
function crearLineaDeRevision(articulo, editando, alQuitar) {
  const renglon = crearElemento("p", "hoja__renglon");
  renglon.append(
    crearElemento("span", "hoja__platillo", nombrarConCantidad(articulo)),
    crearElemento("span", "hoja__precio", formatearPrecio(calcularTotal([articulo]))),
  );
  const elemento = crearElemento("li", "hoja__linea");
  elemento.append(renglon);
  const frase = describirEnFrase(articulo.platillo, articulo.linea);
  if (frase) {
    elemento.append(crearElemento("p", "hoja__detalle", frase));
  }
  // TODO: Figma no define este botón ni su texto
  const quitar = crearElemento("button", "boton boton--texto boton--pequeno hoja__quitar", "Quitar");
  quitar.type = "button";
  quitar.hidden = !editando;
  quitar.setAttribute("aria-label", `Quitar ${articulo.platillo.nombre}`);
  quitar.addEventListener("click", () => alQuitar(articulo));
  elemento.append(quitar);
  return elemento;
}

// Hoja inferior sobre la pantalla de hora. Tocar el fondo, la X o la tecla Escape la
// cierran. "Cambiar algo" muestra (u oculta) el botón para quitar cada platillo.
function crearHojaDeRevision({
  articulos,
  horaRecogida,
  cafeteria,
  editando,
  alQuitar,
  alAgregar,
  alConfirmar,
}) {
  const hoja = crearElemento("dialog", "hoja");
  const cerrar = () => {
    hoja.close();
    hoja.remove();
  };

  const titulo = crearElemento("h2", "hoja__titulo", "Revisa tu pedido");
  titulo.id = "titulo-revision";
  hoja.setAttribute("aria-labelledby", titulo.id);

  const equis = crearElemento("button", "hoja__cerrar");
  equis.type = "button";
  equis.setAttribute("aria-label", "Cerrar");
  equis.append(crearIconoSvg("icono", 24, ["M18 6L6 18M6 6L18 18"]));
  equis.addEventListener("click", cerrar);

  const encabezado = crearElemento("div", "hoja__encabezado");
  encabezado.append(titulo, equis);

  const lineas = crearElemento("ul", "hoja__lineas");
  lineas.append(
    ...articulos.map((articulo) => crearLineaDeRevision(articulo, editando, alQuitar)),
  );

  const total = crearElemento("p", "hoja__total");
  total.append(
    crearElemento("span", "hoja__total-etiqueta", "Total"),
    crearElemento("span", "hoja__total-monto", formatearPrecio(calcularTotal(articulos))),
  );

  const agregar = crearElemento("button", "boton boton--texto", "+ Agregar otro platillo");
  const confirmar = crearElemento("button", "boton boton--primario", "Confirmar pedido");
  const cambiar = crearElemento("button", "boton boton--contorno", "Cambiar algo");
  agregar.type = confirmar.type = cambiar.type = "button";
  agregar.addEventListener("click", alAgregar);
  confirmar.addEventListener("click", () => alConfirmar(confirmar));
  cambiar.setAttribute("aria-pressed", String(Boolean(editando)));
  cambiar.addEventListener("click", () => {
    const activar = cambiar.getAttribute("aria-pressed") !== "true";
    cambiar.setAttribute("aria-pressed", String(activar));
    lineas.querySelectorAll(".hoja__quitar").forEach((boton) => {
      boton.hidden = !activar;
    });
  });

  hoja.append(
    crearElemento("span", "hoja__asa"),
    encabezado,
    lineas,
    total,
    crearCajaDeRecogida(describirRecogidaEnRevision(horaRecogida), cafeteria),
    crearElemento(
      "p",
      "hoja__pago",
      // En el pedido mixto, Figma (1377:9586) repite la frase de un solo platillo; la
      // decisión aprobada es decir que todo se paga en la primera recogida.
      esPedidoMixto(horaRecogida)
        ? "Pagas todo en caja al recoger el almuerzo."
        : "Pagas en caja al recoger, no antes.",
    ),
    agregar,
    confirmar,
    cambiar,
  );

  hoja.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    cerrar();
  });
  // Un toque en el fondo llega al diálogo, pero fuera de su rectángulo
  hoja.addEventListener("click", (evento) => {
    if (evento.target === hoja && evento.clientY < hoja.getBoundingClientRect().top) {
      cerrar();
    }
  });
  return hoja;
}

// Guarda lo que ya se eligió y vuelve al menú para sumar otro platillo.
function agregarOtroPlatillo(lineas) {
  if (!guardarPedidoEnCurso(lineas)) {
    // TODO: Figma no define este mensaje
    mostrarAviso("error", "No se pudo guardar tu pedido");
    return;
  }
  guardarSeleccion(null);
  location.hash = "#/menu";
}

// El platillo que se está eligiendo y todavía no está en el pedido en curso: lo
// elegido en el detalle o, si se entró directo, el platillo con las opciones por
// defecto. Devuelve null si no hay ninguno o si falta elegir tipos.
function obtenerLineaNueva(platillo) {
  const seleccion = obtenerSeleccion();
  if (seleccion?.id === platillo.id) {
    return seleccion;
  }
  const yaEsta = obtenerPedidoEnCurso().some((linea) => linea.id === platillo.id);
  const faltanTipos = platillo.opciones?.some((grupo) => grupo.id === "tipo");
  return yaEsta || faltanTipos
    ? null
    : crearLinea(platillo.id, 1, obtenerOpcionesPorDefecto(platillo));
}

// Filas de los platillos que se van a apartar, con lo elegido en cada uno.
function crearResumenDeApartar(articulos) {
  const resumen = crearElemento("ul", "apartar__platillos");
  resumen.append(
    ...articulos.map((articulo) => {
      const elemento = crearElemento("li", "apartar__platillo");
      const precio = articulo.precio === null ? null : calcularTotal([articulo]);
      elemento.append(crearFilaDePlatillo(articulo.platillo, precio, articulo.cantidad));
      const detalle = describirLinea(articulo.platillo, articulo.linea);
      if (detalle) {
        elemento.append(crearElemento("p", "apartar__opciones", detalle));
      }
      return elemento;
    }),
  );
  return resumen;
}

function dibujarApartar(contenedor, { id }) {
  // Cambia si se quita de la revisión el platillo con el que se entró
  let idActual = id;
  prepararEncabezado(contenedor, "Apartar pedido", () => {
    const esCombo =
      obtenerPlatillo(idActual, obtenerFechaDeHoy())?.categoria === "platos-fuertes";
    volverA(esCombo ? `#/personalizar/${idActual}` : `#/platillo/${idActual}`);
  });
  const platillo = obtenerPlatilloDeHoy(contenedor, id);
  if (!platillo) {
    return;
  }
  // Para apartar se necesita una cuenta
  if (!obtenerSesion()) {
    location.replace(`#/platillo/${id}`);
    return;
  }
  if (!estaAbiertoApartar()) {
    mostrarHorarioCerrado(contenedor);
    return;
  }
  let nueva = obtenerLineaNueva(platillo);
  const armarLineas = () =>
    nueva ? unirLineas(obtenerPedidoEnCurso(), nueva) : obtenerPedidoEnCurso();
  if (!nueva && !armarLineas().some((linea) => linea.id === id)) {
    location.replace(`#/platillo/${id}`);
    return;
  }

  // Lo ya marcado en la pantalla, para no perderlo al quitar un platillo
  const elecciones = {
    horas: {}, // por parte: { almuerzo: "12:30", tipicos: "15:00" }
    cafeteria: CAFETERIAS.find((una) => una.predeterminada).id,
  };
  const formulario = crearElemento("form", "apartar");
  const continuar = crearElemento("button", "boton boton--primario", "Continuar");
  continuar.type = "submit";

  const pintar = () => {
    const articulos = detallarLineas(armarLineas());
    const partes = [crearResumenDeApartar(articulos)];
    if (nueva && obtenerPresentaciones(platillo).length) {
      partes.push(crearCajaDePresentacion(platillo, nueva.opciones.presentacion));
    }
    const ventanas = obtenerVentanas(articulos.map((articulo) => articulo.platillo));
    const mixto = ventanas.length > 1;
    formulario.replaceChildren(
      ...partes,
      ...ventanas.map((ventana) =>
        crearPreguntaDeHora(ventana, elecciones.horas[ventana], articulos, mixto),
      ),
      crearPreguntaDeCafeteria(elecciones.cafeteria, mixto),
      continuar,
    );
    // "Continuar" se activa cuando no falta nada por elegir
    continuar.disabled = !formulario.checkValidity();
  };

  const quitar = (articulo) => {
    const enCurso = quitarLinea(obtenerPedidoEnCurso(), articulo.linea);
    const quedaNueva = nueva && !sonLaMismaLinea(nueva, articulo.linea) ? nueva : null;
    if (!quedaNueva && !enCurso.length) {
      borrarPedidoEnCurso();
      location.hash = "#/menu";
      return;
    }
    if (!guardarPedidoEnCurso(enCurso)) {
      contenedor.querySelector("dialog.hoja")?.remove(); // el aviso debe verse
      // TODO: Figma no define este mensaje
      mostrarAviso("error", "No se pudo guardar tu pedido");
      return;
    }
    nueva = quedaNueva;
    if (!nueva) {
      guardarSeleccion(null);
      idActual = enCurso[0].id;
      // La dirección pasa a un platillo que sigue en el pedido, para que al recargar
      // no vuelva el que se quitó. No redibuja la pantalla.
      history.replaceState(history.state, "", `#/apartar/${idActual}`);
    }
    contenedor.querySelector("dialog.hoja").remove();
    pintar();
    abrirRevision(true);
  };

  const abrirRevision = (editando = false) => {
    const lineas = armarLineas();
    const articulos = detallarLineas(lineas);
    const pedido = {
      articulos,
      cafeteria: elecciones.cafeteria,
      horaRecogida: juntarHoras(
        elecciones.horas,
        obtenerVentanas(articulos.map((articulo) => articulo.platillo)),
      ),
    };
    abrirDialogo(
      contenedor,
      crearHojaDeRevision({
        ...pedido,
        editando,
        alQuitar: quitar,
        alAgregar: () => agregarOtroPlatillo(lineas),
        alConfirmar: (boton) => {
          boton.disabled = true; // un segundo toque no debe crear otro pedido
          confirmarPedido(contenedor, pedido);
        },
      }),
    );
  };

  formulario.addEventListener("change", ({ target }) => {
    if (target.name === "presentacion") {
      nueva = elegirPresentacion(nueva, target.value);
      guardarSeleccion(nueva);
      formulario
        .querySelector(".apartar__platillos")
        .replaceWith(crearResumenDeApartar(detallarLineas(armarLineas())));
    } else if (target.name === "cafeteria") {
      elecciones.cafeteria = target.value;
    } else {
      elecciones.horas[target.name.replace("hora-", "")] = target.value;
    }
    continuar.disabled = !formulario.checkValidity();
  });
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!estaAbiertoApartar()) {
      mostrarHorarioCerrado(contenedor);
      return;
    }
    abrirRevision();
  });

  pintar();
  contenedor.querySelector(".menu").append(formulario);
}

/* ---------- Se agotó (Figma 1374:9853) ---------- */

// No se aparta nada. Lo agotado sale del pedido; lo demás se conserva en el pedido
// en curso. "Ver otros platillos" lleva al menú en la categoría de lo agotado.
function mostrarAgotado(contenedor, articulos, agotados) {
  const restantes = articulos
    .filter(({ platillo }) => !agotados.some((agotado) => agotado.id === platillo.id))
    .map(({ linea }) => linea);
  borrarPedidoEnCurso();
  if (restantes.length) {
    guardarPedidoEnCurso(restantes);
  }
  const categoria = obtenerCategoriaVisual(agotados[0].categoria);
  abrirDialogo(
    contenedor,
    crearVentana({
      tipo: "informacion",
      titulo: "Este platillo se agotó",
      // TODO: Figma no pone el nombre del platillo en esta ventana (se pidió mostrarlo)
      // ni muestra el caso de varios platillos agotados.
      destacado: unirEnFrase(agotados.map((platillo) => platillo.nombre)),
      // TODO: Figma solo muestra la frase con "platos fuertes"
      mensaje:
        "Se terminó mientras pedías. No se apartó nada; te mostramos otros " +
        `${CATEGORIAS[categoria].nombre.toLowerCase()}.`,
      textoBoton: "Ver otros platillos",
      alTocar: () => {
        location.hash = crearRutaDelMenu(categoria);
      },
    }),
  );
}

/* ---------- Confirmar ---------- */

// El ticket del pedido que se acaba de confirmar abre con "¡Pedido apartado!"
let pedidoRecienApartado = null;

function confirmarPedido(contenedor, { articulos, horaRecogida, cafeteria }) {
  // Pudieron pasar las 11:00 mientras se revisaba (nota de Figma 1375:9324)
  if (!estaAbiertoApartar()) {
    mostrarHorarioCerrado(contenedor);
    return;
  }
  const agotados = buscarAgotados(articulos);
  if (agotados.length) {
    mostrarAgotado(contenedor, articulos, agotados);
    return;
  }
  const pedido = crearPedido({
    articulos,
    fecha: obtenerFechaDeHoy(),
    cafeteria,
    horaRecogida,
    anteriores: obtenerPedidos(),
    autor: obtenerSesion()?.correo,
  });
  if (!guardarPedido(pedido)) {
    contenedor.querySelector("dialog.hoja")?.remove(); // el aviso debe verse
    // TODO: Figma no define este mensaje
    mostrarAviso("error", "No se pudo guardar tu pedido");
    return;
  }
  borrarPedidoEnCurso();
  pedidoRecienApartado = pedido.id;
  // El ticket reemplaza a "Hora y cafetería": volver atrás no repite el pedido
  location.replace(`#/ticket/${pedido.id}`);
}

/* ---------- Tu ticket (Figma 1374:9674) ---------- */

// Componente "Ticket con PIN", tipo Pedido (Figma 874:3386).
function crearTicket(pedido, articulos) {
  const lista = crearElemento("ul", "ticket__lineas");
  lista.append(
    ...articulos.map((articulo) => {
      const elemento = crearElemento("li", "ticket__linea");
      elemento.append(
        crearElemento("span", "ticket__platillo", nombrarConCantidad(articulo)),
        crearElemento("span", "ticket__precio", formatearPrecio(calcularTotal([articulo]))),
      );
      return elemento;
    }),
  );
  const desglose = crearElemento("div", "ticket__desglose");
  desglose.append(crearElemento("h3", "ticket__subtitulo", "Lo que pediste"), lista);

  const textosDePago = crearElemento("div", "pago-en-caja__textos");
  textosDePago.append(
    crearElemento("p", "pago-en-caja__titulo", "Pago en caja"),
    crearElemento(
      "p",
      "pago-en-caja__mensaje",
      esPedidoMixto(pedido.horaRecogida)
        ? "Pagas todo al recoger el almuerzo."
        : "Se paga al recoger tu pedido, no antes.",
    ),
  );
  const pago = crearElemento("div", "pago-en-caja");
  pago.append(
    crearIconoSvg("pago-en-caja__icono", 24, [
      "M5 6H19C20.66 6 22 7.34 22 9V15C22 16.66 20.66 18 19 18H5C3.34 18 2 16.66 2 15V9" +
        "C2 7.34 3.34 6 5 6Z",
      "M14.5 12C14.5 13.38 13.38 14.5 12 14.5C10.62 14.5 9.5 13.38 9.5 12" +
        "C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12Z",
      "M6 12H6.01M18 12H18.01",
    ]),
    textosDePago,
    crearElemento("p", "pago-en-caja__total", formatearPrecio(pedido.total)),
  );

  return crearTicketConPin({
    etiqueta: `PEDIDO #${pedido.numero}`,
    titulo: titularTicket(articulos),
    detalles: [
      crearCajaDeRecogida(describirRecogidaEnTicket(pedido.horaRecogida), pedido.cafeteria),
      desglose,
      pago,
    ],
    pin: pedido.pin,
    instruccion: "Dile este PIN a quien te atienda para recoger tu pedido.",
  });
}

// La forma común del "Ticket con PIN" (Figma 874:3386): los datos, el corte y el PIN.
// La usan el ticket del pedido y el del premio.
function crearTicketConPin({ etiqueta, titulo, detalles, pin, instruccion }) {
  const datos = crearElemento("div", "ticket__datos");
  datos.append(
    crearElemento("p", "ticket__numero", etiqueta),
    crearElemento("h2", "ticket__titulo", titulo),
    ...detalles,
  );

  const digitos = crearElemento("p", "ticket__digitos");
  digitos.setAttribute("aria-label", [...pin].join(" "));
  digitos.setAttribute("role", "img");
  digitos.append(...[...pin].map((cifra) => crearElemento("span", "ticket__digito", cifra)));
  const zonaDelPin = crearElemento("div", "ticket__pin");
  zonaDelPin.append(
    crearElemento("p", "ticket__pin-etiqueta", "Tu PIN"),
    digitos,
    crearElemento("p", "ticket__instruccion", instruccion),
  );

  const ticket = crearElemento("article", "ticket");
  ticket.append(datos, crearElemento("div", "ticket__corte"), zonaDelPin);
  return ticket;
}

// Lo que cambia entre un pedido de una sola hora y uno mixto (Figma 1374:9674,
// 1374:9745, 1377:9654 y 1377:9697): la indicación del ticket y el mensaje de
// "¡Pedido apartado!", que en el mixto menciona las dos horas.
function redactarAvisosDelTicket({ horaRecogida, cafeteria }) {
  const lugar = nombrarCafeteria(cafeteria);
  if (esPedidoMixto(horaRecogida)) {
    const almuerzo = formatearHora(horaRecogida.almuerzo);
    const tipicos = formatearHora(horaRecogida.tipicos);
    return {
      indicacion: "Recoge cada parte a su hora, con el mismo PIN.",
      exito:
        `Te esperamos en ${lugar}: el almuerzo a las ${almuerzo} y los típicos a las ` +
        `${tipicos} Pagas todo al recoger el almuerzo.`,
    };
  }
  const hora = formatearHora(horaRecogida);
  return {
    indicacion: `Llévalo a ${lugar} a las ${hora}`,
    exito: `Te esperamos hoy a las ${hora} en ${lugar}. Pagas en caja al recoger.`,
  };
}

function dibujarTicket(contenedor, { id }) {
  // Cada quien ve solo sus tickets: el PIN no se muestra en otra cuenta
  const autor = obtenerSesion()?.correo ?? AUTOR_INVITADO;
  const pedido = obtenerPedidos().find((uno) => uno.id === id && uno.autor === autor);
  if (!pedido) {
    location.replace("#/menu");
    return;
  }
  const avisos = redactarAvisosDelTicket(pedido);

  const titulos = crearElemento("header", "ticket-pantalla__titulos");
  titulos.append(
    crearElemento("h1", "ticket-pantalla__titulo", "Tu ticket"),
    crearElemento("p", "ticket-pantalla__indicacion", avisos.indicacion),
  );

  const acciones = crearElemento("div", "ticket-pantalla__acciones");
  // TODO (fase de Más): Figma pone sobre "Listo" la nota "También lo encuentras en
  // Más › Historial, aunque no tengas internet.". Volver a ponerla cuando exista.
  acciones.append(
    crearBotonInferior("Listo", () => {
      borrarPedidoEnCurso();
      location.hash = "#/menu";
    }),
  );

  const pantalla = contenedor.querySelector(".ticket-pantalla");
  pantalla.classList.toggle("ticket-pantalla--mixto", esPedidoMixto(pedido.horaRecogida));
  pantalla.append(
    titulos,
    crearTicket(pedido, detallarLineas(pedido.platillos, pedido.fecha)),
    acciones,
  );

  if (pedidoRecienApartado === pedido.id) {
    pedidoRecienApartado = null;
    const ventana = crearVentana({
      tipo: "exito",
      titulo: "¡Pedido apartado!",
      mensaje: avisos.exito,
      textoBoton: "Ver mi ticket",
      alTocar: () => {
        ventana.close();
        ventana.remove();
      },
    });
    abrirDialogo(contenedor, ventana);
  }
}

/* ---------- Personaliza tu plato (Figma 1346:8841 y 1347:9194) ---------- */

// Componente "Tarjeta de acompañamiento" (Figma 1345:4696). Es un botón de opción.
function crearTarjetaDeAcompanamiento(grupo, valor, elegida, alElegir) {
  const entrada = crearElemento("input", "acompanamiento__entrada");
  entrada.type = "radio";
  entrada.name = `grupo-${grupo.id}`;
  entrada.value = valor.nombre;
  entrada.checked = elegida;
  entrada.addEventListener("change", () => alElegir(grupo.id, valor.nombre));

  const imagen = document.createElement("img");
  imagen.className = "acompanamiento__imagen";
  imagen.src = valor.imagen;
  imagen.alt = "";

  const marca = crearElemento("span", "acompanamiento__marca");
  marca.append(crearIconoSvg("acompanamiento__palomita", 20, ["M5.5 10.75L8.5 13.75L14.5 7.25"]));

  const tarjeta = crearElemento("label", "acompanamiento");
  tarjeta.append(entrada, imagen, marca, crearElemento("span", "acompanamiento__pie", valor.nombre));
  return tarjeta;
}

// Un grupo: título, "Elige 1" y sus tarjetas en una fila que se desplaza.
function crearGrupoDeAcompanamientos(grupo, elegido, alElegir) {
  const titulo = crearElemento("legend", "grupo__titulo");
  titulo.append(
    crearElemento("span", "grupo__nombre", grupo.nombre),
    crearElemento("span", "grupo__ayuda", "Elige 1"),
  );
  const tarjetas = crearElemento("div", "grupo__opciones");
  tarjetas.append(
    ...grupo.valores.map((valor) =>
      crearTarjetaDeAcompanamiento(grupo, valor, valor.nombre === elegido, alElegir),
    ),
  );
  const bloque = crearElemento("fieldset", "grupo");
  bloque.append(titulo, tarjetas);
  return bloque;
}

function dibujarPersonalizar(contenedor, { id }) {
  prepararEncabezado(contenedor, "Personaliza tu plato", () =>
    volverA(`#/platillo/${id}`),
  );
  const platillo = obtenerPlatilloDeHoy(contenedor, id);
  if (!platillo) {
    return;
  }
  if (platillo.categoria !== "platos-fuertes") {
    location.replace(`#/platillo/${id}`);
    return;
  }

  // Las sopas no llevan guarnición: Figma cambia los textos
  const esSopa = !platillo.opciones.some((grupo) => grupo.id === "guarnicion");
  // Si se vuelve desde "Hora y cafetería", se conserva lo que ya se había elegido
  const seleccion = obtenerSeleccion();
  const opciones = {
    ...obtenerOpcionesPorDefecto(platillo),
    ...(seleccion?.id === id && seleccion.opciones),
  };

  const presentacion = crearElemento("div", "personalizar__presentacion");
  presentacion.append(
    crearFilaDePlatillo(platillo, platillo.precio),
    crearElemento(
      "p",
      "personalizar__explicacion",
      esSopa
        ? "Tu sopa incluye bebida y tortillas. Ya marcamos las de siempre; toca otra para cambiarla."
        : "Tu combo incluye un acompañamiento de cada grupo. Ya marcamos los de siempre; toca otro para cambiarlo.",
    ),
  );

  const resumen = crearElemento("p", "personalizar__resumen");
  resumen.setAttribute("aria-live", "polite");
  const escribirResumen = () => {
    const elegidas = unirConPuntos(listarOpciones(platillo, opciones));
    resumen.textContent = `${esSopa ? "Tu sopa" : "Tu combo"}: ${elegidas}`;
  };
  escribirResumen();

  const grupos = crearElemento("div", "personalizar__grupos");
  grupos.append(
    ...platillo.opciones.map((grupo) =>
      crearGrupoDeAcompanamientos(grupo, opciones[grupo.id], (idGrupo, valor) => {
        opciones[idGrupo] = valor;
        escribirResumen();
      }),
    ),
  );

  const boton = crearBotonInferior(
    `Apartar · ${formatearPrecio(calcularSubtotal(platillo.precio, 1))}`,
    () => apartar(platillo, crearLinea(id, 1, { ...opciones })),
  );
  boton.classList.add("personalizar__boton");

  contenedor.querySelector(".menu").append(presentacion, grupos, resumen, boton);
}
