// Comentarios y calificaciones: la fila del detalle, la pantalla de opiniones
// y la pantalla para escribir la propia.

// Única función que calcula el promedio, redondeado a un decimal. Sin opiniones es null.
function calcularPromedio(opiniones) {
  if (!opiniones.length) {
    return null;
  }
  const suma = opiniones.reduce((total, opinion) => total + opinion.calificacion, 0);
  return Math.round((suma / opiniones.length) * 10) / 10;
}

// "1 opinión" o "12 opiniones"
function formatearConteo(total) {
  return `${total} ${total === 1 ? "opinión" : "opiniones"}`;
}

/* ---------- Iconos y piezas comunes ---------- */

// Icono SVG a partir de sus trazos. El color y el grosor se ponen en el CSS.
function crearIconoSvg(clase, caja, trazos) {
  const espacio = "http://www.w3.org/2000/svg";
  const icono = document.createElementNS(espacio, "svg");
  icono.setAttribute("class", clase);
  icono.setAttribute("viewBox", `0 0 ${caja} ${caja}`);
  icono.setAttribute("aria-hidden", "true");
  trazos.forEach((trazo) => {
    // Un trazo es la ruta sola o [x, y, ruta] si va desplazada dentro de la caja
    const [x, y, forma] = Array.isArray(trazo) ? trazo : [0, 0, trazo];
    const ruta = document.createElementNS(espacio, "path");
    ruta.setAttribute("d", forma);
    if (x || y) {
      ruta.setAttribute("transform", `translate(${x} ${y})`);
    }
    icono.append(ruta);
  });
  return icono;
}

// Única función que crea las estrellas (Figma 827:2428).
function crearEstrella(clase = "estrella estrella--llena") {
  return crearIconoSvg(clase, 32, [
    "M16 4L19.6 11.4667L27.7333 12.6667L21.8667 18.4L23.2 26.5333L16 22.6667" +
      "L8.8 26.5333L10.1333 18.4L4.26667 12.6667L12.4 11.4667L16 4Z",
  ]);
}

// Etiqueta "Calificación": estrella y texto (Figma 820:2456). "descripcion" es lo que
// oye quien usa un lector de pantalla.
function crearEtiquetaDeCalificacion(texto, descripcion) {
  const etiqueta = crearElemento("span", "etiqueta etiqueta--calificacion");
  etiqueta.setAttribute("role", "img");
  etiqueta.setAttribute("aria-label", descripcion);
  etiqueta.append(crearEstrella(), texto);
  return etiqueta;
}

/* ---------- Fila del detalle ---------- */

// Fila que lleva del detalle a las opiniones (Figma 1176:7257).
function crearFilaDeComentarios(platilloId, opiniones) {
  const promedio = calcularPromedio(opiniones);
  const fila = crearElemento("a", "fila-opcion");
  fila.href = `#/comentarios/${platilloId}`;

  const textos = crearElemento("span", "fila-opcion__textos");
  textos.append(
    crearElemento("span", "fila-opcion__titulo", "Comentarios y calificaciones"),
    crearElemento(
      "span",
      "fila-opcion__detalle",
      promedio === null
        ? "Sin opiniones todavía"
        : `${promedio.toFixed(1)} de 5 · ${formatearConteo(opiniones.length)}`,
    ),
  );

  fila.append(
    crearIconoSvg("fila-opcion__icono", 24, [
      "M5 4H19C19.5304 4 20.0391 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V15" +
        "C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H12L8 21" +
        "V17H5C4.46957 17 3.96086 16.7893 3.58579 16.4142C3.21071 16.0391 3 15.5304 3 15V6" +
        "C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z",
      "M7.5 8.5H16.5",
      "M7.5 12H13.5",
    ]),
    textos,
    crearIconoSvg("fila-opcion__flecha", 20, ["M7.5 5L12.5 10L7.5 15"]),
  );
  return fila;
}

/* ---------- Pantalla de comentarios ---------- */

const OPINIONES_POR_PAGINA = 20;
// Búho de un autor sin cuenta en este navegador (algunas opiniones de ejemplo). M5d
// muestra el 3
const BUHO_SIN_ELEGIR = 3;

// "Hace un momento", "Hace 2 días", "Hace 1 semana"…
// TODO: Figma no muestra las formas con minutos, horas, meses ni años
function formatearFechaRelativa(fecha, ahora = new Date()) {
  const antes = new Date(fecha);
  const hace = (cantidad, una, varias) => `Hace ${cantidad} ${cantidad === 1 ? una : varias}`;
  const minutos = Math.floor((ahora - antes) / 60000);
  if (minutos < 1) {
    return "Hace un momento";
  }
  if (minutos < 60) {
    return hace(minutos, "minuto", "minutos");
  }
  if (minutos < 24 * 60) {
    return hace(Math.floor(minutos / 60), "hora", "horas");
  }
  // Desde las 24 horas se cuentan días del calendario
  const medianoche = (una) => new Date(una.getFullYear(), una.getMonth(), una.getDate());
  const dias = Math.round((medianoche(ahora) - medianoche(antes)) / 86400000);
  if (dias < 7) {
    return hace(dias, "día", "días");
  }
  if (dias < 30) {
    return hace(Math.floor(dias / 7), "semana", "semanas");
  }
  if (dias < 365) {
    return hace(Math.floor(dias / 30), "mes", "meses");
  }
  return hace(Math.floor(dias / 365), "año", "años");
}

// Única función que crea una opinión: el componente Comentario (Figma 1189:4679).
function crearComentario(opinion) {
  const buho = document.createElement("img");
  buho.className = "avatar__buho";
  buho.src = `img/avatar-buho-${opinion.buho ?? obtenerCuenta(opinion.autor)?.buho ?? BUHO_SIN_ELEGIR}.png`;
  buho.alt = "";
  const avatar = crearElemento("span", "avatar");
  avatar.append(buho);

  const fecha = crearElemento("time", "comentario__fecha", formatearFechaRelativa(opinion.fecha));
  fecha.dateTime = opinion.fecha;
  const textos = crearElemento("div", "comentario__textos");
  textos.append(crearElemento("p", "comentario__nombre", nombrarAutor(opinion.autor)), fecha);

  const autor = crearElemento("div", "comentario__autor");
  autor.append(
    avatar,
    textos,
    crearEtiquetaDeCalificacion(
      String(opinion.calificacion),
      `${opinion.calificacion} de 5 estrellas`,
    ),
  );

  const comentario = crearElemento("li", "comentario");
  comentario.append(autor);
  // Sin texto, solo se ven las estrellas
  if (opinion.texto) {
    comentario.append(crearElemento("p", "comentario__texto", opinion.texto));
  }
  return comentario;
}

// Foto pequeña, categoría y nombre del platillo (Figma 1190:7388).
function crearPlatilloResumido(platillo) {
  const idCategoria = obtenerCategoriaVisual(platillo.categoria);
  const textos = crearElemento("div", "platillo-resumido__textos");
  textos.append(
    crearElemento("p", "platillo-resumido__categoria", CATEGORIAS[idCategoria].nombre),
    crearElemento("p", "platillo-resumido__nombre", platillo.nombre),
  );
  const fila = crearElemento("div", `platillo-resumido categoria--${idCategoria}`);
  fila.append(crearFoto(platillo, "platillo-resumido__foto"), textos);
  return fila;
}

// Una barra por cada número de estrellas. Su ancho es cantidad ÷ total.
function crearBarraDeResumen(estrellas, cantidad, total) {
  const pista = crearElemento("span", "resumen__barra");
  const relleno = crearElemento("span", "resumen__relleno");
  relleno.style.width = `${(cantidad / total) * 100}%`;
  pista.append(relleno);

  const fila = crearElemento("li", "resumen__fila");
  fila.setAttribute(
    "aria-label",
    `${estrellas} ${estrellas === 1 ? "estrella" : "estrellas"}: ${formatearConteo(cantidad)}`,
  );
  fila.append(
    crearElemento("span", "resumen__estrellas", String(estrellas)),
    pista,
    crearElemento("span", "resumen__cantidad", String(cantidad)),
  );
  return fila;
}

function llenarResumen(resumen, opiniones) {
  const numero = resumen.querySelector(".resumen__numero");
  numero.textContent = calcularPromedio(opiniones).toFixed(1);
  numero.after(crearEtiquetaDeCalificacion("de 5", "de 5 estrellas"));
  resumen.querySelector(".resumen__conteo").textContent = formatearConteo(opiniones.length);
  resumen.querySelector(".resumen__barras").append(
    ...[5, 4, 3, 2, 1].map((estrellas) =>
      crearBarraDeResumen(
        estrellas,
        opiniones.filter((opinion) => opinion.calificacion === estrellas).length,
        opiniones.length,
      ),
    ),
  );
}

// Muestra las opiniones de 20 en 20; "Ver más" agrega las siguientes.
function llenarLista(seccion, opiniones) {
  const lista = seccion.querySelector(".lista-opiniones");
  const verMas = seccion.querySelector(".opiniones__ver-mas");
  const agregarPagina = () => {
    const desde = lista.children.length;
    lista.append(...opiniones.slice(desde, desde + OPINIONES_POR_PAGINA).map(crearComentario));
    verMas.hidden = lista.children.length >= opiniones.length;
  };
  verMas.addEventListener("click", agregarPagina);
  agregarPagina();
}

// Regresa a la pantalla anterior si es la esperada; si se entró directo, va a "ruta".
function volverA(rutaEsperada, ruta = rutaEsperada) {
  if ((history.state?.desde ?? "").split("?")[0] === rutaEsperada) {
    history.back();
  } else {
    location.replace(ruta);
  }
}

// Parte común de las pantallas de opiniones: botón de volver y fila del platillo.
// Devuelve el platillo, o null si el id no existe (y deja el mensaje en pantalla).
function prepararPantallaDeOpiniones(contenedor, id, alVolver) {
  const encontrado = buscarPlatilloEnSemana(id, obtenerFechaInicial());
  if (!encontrado) {
    // Se pasa un menú cualquiera: lo que falta es el platillo
    contenedor.replaceChildren(crearVistaDeDetalle(null, MENU_SEMANA));
    return null;
  }
  contenedor
    .querySelector(".encabezado-interno")
    .prepend(crearBotonVolver(() => alVolver(encontrado)));
  contenedor.querySelector(".opiniones").prepend(crearPlatilloResumido(encontrado.platillo));
  return encontrado.platillo;
}

function dibujarComentarios(contenedor, { id }) {
  const platillo = prepararPantallaDeOpiniones(contenedor, id, ({ fecha }) =>
    volverA(`#/platillo/${id}`, `#/platillo/${id}?dia=${fecha}`),
  );
  if (!platillo) {
    return;
  }

  const opiniones = obtenerOpiniones(id);
  const resumen = contenedor.querySelector(".resumen");
  const lista = contenedor.querySelector(".opiniones__lista");
  const escribir = contenedor.querySelector(".opiniones__escribir");
  escribir.href = `#/comentarios/${id}/escribir`;
  if (obtenerMiOpinion(id)) {
    escribir.textContent = "Editar mi opinión";
  }
  // Sin opiniones, escribir es la acción principal (M5c)
  escribir.classList.add(opiniones.length ? "boton--contorno" : "boton--primario");
  // Una persona invitada solo puede leer (notas de Figma de M5)
  if (!obtenerSesion()) {
    escribir.addEventListener("click", (evento) => {
      evento.preventDefault();
      pedirCuenta(contenedor, {
        titulo: "Inicia sesión o regístrate para calificar y comentar",
        destino: { hash: location.hash, tipo: "opinion" },
      });
    });
  }

  if (!opiniones.length) {
    resumen.remove();
    lista.remove();
    return;
  }
  contenedor.querySelector(".sin-opiniones").remove();
  llenarResumen(resumen, opiniones);
  llenarLista(lista, opiniones);
}

/* ---------- Escribir mi opinión ---------- */

// Texto que va debajo de las estrellas, de 1 a 5 (Figma, nota 1199:7740)
const TEXTOS_DE_ESTRELLAS = ["Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

// Selector de 1 a 5 estrellas (Figma 827:2507). Son botones de opción, así que
// también funciona con el teclado. "inicial" es 0 cuando no hay ninguna elegida.
function prepararSelectorDeEstrellas(bloque, inicial, alElegir) {
  const lugar = bloque.querySelector(".selector-estrellas");
  const estrellas = TEXTOS_DE_ESTRELLAS.map((texto, posicion) => {
    const valor = posicion + 1;
    const entrada = document.createElement("input");
    entrada.className = "selector-estrellas__entrada";
    entrada.type = "radio";
    entrada.name = "calificacion";
    entrada.value = valor;
    entrada.checked = valor === inicial;
    entrada.setAttribute("aria-label", `${valor} de 5: ${texto}`);
    entrada.addEventListener("change", () => marcar(valor));

    const dibujo = crearEstrella("estrella estrella--vacia");
    const opcion = crearElemento("label", "selector-estrellas__opcion");
    opcion.append(entrada, dibujo);
    lugar.append(opcion);
    return dibujo;
  });

  // Rellena las estrellas hasta el valor elegido y escribe su texto
  const marcar = (valor) => {
    estrellas.forEach((dibujo, posicion) => {
      dibujo.classList.toggle("estrella--llena", posicion < valor);
      dibujo.classList.toggle("estrella--vacia", posicion >= valor);
    });
    bloque.querySelector(".calificar__texto").textContent = TEXTOS_DE_ESTRELLAS[valor - 1] ?? "";
    alElegir(valor);
  };
  marcar(inicial);
}

function dibujarEscribirOpinion(contenedor, { id }) {
  const volverAComentarios = () => volverA(`#/comentarios/${id}`);
  if (!obtenerSesion()) {
    location.replace(`#/comentarios/${id}`);
    return;
  }
  if (!prepararPantallaDeOpiniones(contenedor, id, volverAComentarios)) {
    return;
  }

  const formulario = contenedor.querySelector(".formulario-opinion");
  const entrada = formulario.querySelector(".campo__entrada");
  const publicar = formulario.querySelector(".formulario-opinion__publicar");
  const contarCaracteres = () => {
    formulario.querySelector(".campo__ayuda").textContent =
      `${entrada.value.length}/${entrada.maxLength} caracteres`;
  };
  // Si ya opinó, el formulario se abre con lo que escribió
  const anterior = obtenerMiOpinion(id);
  entrada.value = anterior?.texto ?? "";
  entrada.addEventListener("input", contarCaracteres);
  contarCaracteres();

  entrada.maxLength = MAXIMO_CARACTERES_OPINION;

  let calificacion = anterior?.calificacion ?? 0;
  prepararSelectorDeEstrellas(formulario.querySelector(".calificar"), calificacion, (valor) => {
    calificacion = valor;
    publicar.disabled = valor === 0; // sin estrellas no se puede publicar
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!calificacion) {
      return;
    }
    const guardada = guardarOpinion({
      platilloId: id,
      autor: obtenerSesion().correo,
      calificacion,
      texto: entrada.value.trim(),
      fecha: new Date().toISOString(),
    });
    if (!guardada) {
      // TODO: Figma no define el aviso para cuando el teléfono no deja guardar
      mostrarAviso("error", "No se pudo guardar tu opinión");
      return;
    }
    volverAComentarios();
    // Aviso "Éxito" de M5d
    mostrarAviso(
      "exito",
      "¡Gracias por tu opinión!",
      "Tu calificación ya cuenta en el promedio de este platillo.",
    );
  });
}
