// Pantallas de Apartar pedido. Las cuentas vienen de js/pedido.js.

/* ---------- Textos y piezas comunes ---------- */

function empezarEnMinuscula(texto) {
  return `${texto.charAt(0).toLowerCase()}${texto.slice(1)}`;
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
function crearFilaDePlatillo(platillo, precio) {
  const fila = crearPlatilloResumido(platillo);
  fila.append(crearElemento("p", "platillo-resumido__precio", formatearPrecio(precio)));
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

// Lo elegido en una línea: "Arroz · ensalada fresca · …" o "2 × Revuelta".
// TODO: Figma solo muestra el texto de un combo; las formas con tipos y con
// "Cantidad" se arman con los nombres de los datos.
function describirLinea(platillo, linea) {
  if (linea.opciones.tipo) {
    return unirConPuntos(
      Object.entries(linea.opciones.tipo).map(([tipo, cantidad]) => `${cantidad} × ${tipo}`),
    );
  }
  const texto = unirConPuntos(listarOpciones(platillo, linea.opciones));
  const partes = [
    linea.cantidad > 1 ? `Cantidad: ${linea.cantidad}` : "",
    texto && `${texto.charAt(0).toUpperCase()}${texto.slice(1)}`,
  ];
  return unirConPuntos(partes.filter(Boolean));
}

// Junta cada línea con su platillo del menú de hoy y con lo que cuesta.
function detallarLineas(lineas) {
  return lineas.flatMap((linea) => {
    const platillo = obtenerPlatillo(linea.id, obtenerFechaDeHoy());
    return platillo
      ? [{ linea, platillo, precio: platillo.precio, cantidad: linea.cantidad }]
      : [];
  });
}

/* ---------- Ventana (Figma 834:2458) ---------- */

const ICONOS_DE_VENTANA = {
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

// Ventana centrada sobre un fondo oscuro, con un solo botón.
function crearVentana({ tipo, titulo, mensaje, textoBoton, alTocar }) {
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
    crearElemento("p", "ventana__mensaje", mensaje),
    crearBotonInferior(textoBoton, alTocar),
  );
  // La tecla Escape hace lo mismo que el botón
  ventana.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    alTocar();
  });
  return ventana;
}

// Agrega una ventana o una hoja a la pantalla y la abre encima de todo.
function abrirDialogo(contenedor, dialogo) {
  // El foco entra al diálogo, no al primer botón (así no aparece su anillo al abrir)
  dialogo.setAttribute("autofocus", "");
  dialogo.tabIndex = -1;
  contenedor.append(dialogo);
  dialogo.showModal();
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

const AVISO_PEDIDO_MIXTO = "Pedido mixto: próximamente";

// ¿Se puede sumar este platillo a lo que ya está en el pedido en curso?
function cabeEnElPedido(platillo) {
  const enCurso = detallarLineas(obtenerPedidoEnCurso()).map((una) => una.platillo);
  return esDeLaMismaVentana(enCurso, platillo);
}

// Lo que hace el botón "Apartar": recuerda lo elegido y pasa a hora y cafetería.
function apartar(platillo, linea) {
  if (!cabeEnElPedido(platillo)) {
    mostrarAviso("info", AVISO_PEDIDO_MIXTO);
    return;
  }
  guardarSeleccion(linea);
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

function crearPreguntaDeHora(ventana) {
  const rango = formatearRango(obtenerRangoDeRecogida(ventana));
  return crearPregunta(
    "horas",
    "¿A qué hora lo recoges?",
    `Hoy, de ${rango}`,
    crearHorasDeRecogida(ventana).map((hora) =>
      crearOpcion("chip", "hora", hora, false, [
        crearElemento("span", "chip__hora", formatearHora(hora)),
      ]),
    ),
  );
}

function crearPreguntaDeCafeteria() {
  return crearPregunta(
    "cafeterias",
    "¿Dónde lo recoges?",
    "Funda Gondra lleva tu pedido a la cafetería que elijas.",
    CAFETERIAS.map((cafeteria) => {
      const textos = crearElemento("span", "cafeteria__textos");
      textos.append(
        crearElemento("span", "cafeteria__nombre", `Cafetería ${cafeteria.nombre}`),
        crearElemento("span", "cafeteria__detalle", "Recoges tu pedido en caja"),
      );
      return crearOpcion("cafeteria", "cafeteria", cafeteria.id, cafeteria.predeterminada, [
        textos,
      ]);
    }),
  );
}

// Lo que se va a apartar: el pedido en curso más el platillo que se está eligiendo.
// Devuelve null si falta elegir algo en el detalle.
function armarLineas(platillo) {
  const enCurso = obtenerPedidoEnCurso();
  const seleccion = obtenerSeleccion();
  if (seleccion?.id === platillo.id) {
    return unirLineas(enCurso, seleccion);
  }
  if (enCurso.some((linea) => linea.id === platillo.id)) {
    return enCurso;
  }
  // Se entró directo: sirve el platillo con las opciones por defecto, salvo que
  // haya que elegir tipos
  return platillo.opciones?.some((grupo) => grupo.id === "tipo")
    ? null
    : unirLineas(enCurso, crearLinea(platillo.id, 1, obtenerOpcionesPorDefecto(platillo)));
}

function dibujarApartar(contenedor, { id }) {
  const esCombo = () => obtenerPlatillo(id, obtenerFechaDeHoy())?.categoria === "platos-fuertes";
  prepararEncabezado(contenedor, "Apartar pedido", () =>
    volverA(esCombo() ? `#/personalizar/${id}` : `#/platillo/${id}`),
  );
  const platillo = obtenerPlatilloDeHoy(contenedor, id);
  if (!platillo) {
    return;
  }
  if (!estaAbiertoApartar()) {
    mostrarHorarioCerrado(contenedor);
    return;
  }
  // TODO: la Ensalada César no tiene precio hasta elegir su presentación, y esa
  // elección (nota de Figma 1176:7471) no está diseñada ni pedida en esta fase.
  if (platillo.precio === null) {
    contenedor.replaceChildren(
      crearMensajeConRegreso(crearElemento("h1", "no-encontrado__titulo", "Próximamente")),
    );
    return;
  }
  if (!cabeEnElPedido(platillo)) {
    mostrarAviso("info", AVISO_PEDIDO_MIXTO);
    location.replace("#/menu");
    return;
  }
  const lineas = armarLineas(platillo);
  if (!lineas) {
    location.replace(`#/platillo/${id}`);
    return;
  }

  const articulos = detallarLineas(lineas);
  const resumen = crearElemento("ul", "apartar__platillos");
  resumen.append(
    ...articulos.map((articulo) => {
      const elemento = crearElemento("li", "apartar__platillo");
      elemento.append(
        crearFilaDePlatillo(articulo.platillo, calcularTotal([articulo])),
      );
      const detalle = describirLinea(articulo.platillo, articulo.linea);
      if (detalle) {
        elemento.append(crearElemento("p", "apartar__opciones", detalle));
      }
      return elemento;
    }),
  );

  const continuar = crearElemento("button", "boton boton--primario", "Continuar");
  continuar.type = "submit";
  continuar.disabled = true;

  const formulario = crearElemento("form", "apartar");
  formulario.append(
    resumen,
    crearPreguntaDeHora(platillo.ventana_recogida),
    crearPreguntaDeCafeteria(),
    continuar,
  );
  // "Continuar" se activa cuando hay una hora y una cafetería
  formulario.addEventListener("change", () => {
    continuar.disabled = !formulario.checkValidity();
  });
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
  });

  contenedor.querySelector(".menu").append(formulario);
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
