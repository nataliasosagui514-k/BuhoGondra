// Vistas del Menú de hoy y del detalle de platillo.
// Solo muestran información: aquí no se aparta ni se guarda nada.

const CATEGORIA_INICIAL = "economicos";

// La dirección del menú guarda la categoría: #/menu?categoria=tipicos
function crearRutaDelMenu(idCategoria) {
  return `#/menu?categoria=${idCategoria}`;
}

/* ---------- Formatos de texto ---------- */

function formatearPrecio(precio) {
  return `$${precio.toFixed(2)}`;
}

// Precio que se muestra: el del platillo o, si depende de la opción, el menor.
function obtenerPrecioVisible(platillo) {
  if (platillo.precio !== null) {
    return platillo.precio;
  }
  const precios = (platillo.opciones ?? [])
    .flatMap((grupo) => grupo.valores)
    .map((valor) => valor.precio)
    .filter((precio) => precio !== undefined);
  return precios.length ? Math.min(...precios) : null;
}

// "14:00" -> { hora: "2:00", periodo: "p. m." }
function separarHora(hora24) {
  const [horas, minutos] = hora24.split(":");
  return {
    hora: `${Number(horas) % 12 || 12}:${minutos}`,
    periodo: Number(horas) < 12 ? "a. m." : "p. m.",
  };
}

// Une dos horas. Si comparten "a. m." o "p. m.", se escribe una sola vez.
// "corta" quita los ":00".
function formatearRango({ desde, hasta }, union = " a ", corta = false) {
  const [inicio, fin] = [desde, hasta].map(separarHora);
  const texto = (parte) => (corta ? parte.hora.replace(":00", "") : parte.hora);
  const periodoInicio = inicio.periodo === fin.periodo ? "" : ` ${inicio.periodo}`;
  return `${texto(inicio)}${periodoInicio}${union}${texto(fin)} ${fin.periodo}`;
}

// Fecha del teléfono en formato "AAAA-MM-DD" (sin convertir a otra zona horaria).
function obtenerFechaDeHoy(hoy = new Date()) {
  const dos = (numero) => String(numero).padStart(2, "0");
  return `${hoy.getFullYear()}-${dos(hoy.getMonth() + 1)}-${dos(hoy.getDate())}`;
}

// "Viernes 27 de noviembre"
function formatearFechaLarga(fecha) {
  const dia = fecha.toLocaleDateString("es", { weekday: "long" });
  const mes = fecha.toLocaleDateString("es", { month: "long" });
  return `${dia[0].toUpperCase()}${dia.slice(1)} ${fecha.getDate()} de ${mes}`;
}

/* ---------- Búsqueda de lo que se muestra ---------- */

// "Más complementos" es una categoría en los datos; se muestra como una sola tarjeta.
function crearResumenDeCategoria(categoria) {
  return {
    id: categoria.id,
    nombre: categoria.nombre,
    categoria: categoria.id,
    precio: null,
    ventana_recogida: categoria.platillos[0].ventana_recogida,
    disponible: categoria.platillos.some((platillo) => platillo.disponible),
    foto: null,
    elementos: categoria.platillos.map((platillo) => platillo.nombre),
  };
}

// Devuelve lo que se muestra en el detalle para ese día, o null si no está en su menú.
function buscarPlatilloParaVista(id, dia) {
  const resumida = dia.categorias.find((categoria) => categoria.id === id && categoria.sinPrecio);
  return resumida ? crearResumenDeCategoria(resumida) : obtenerPlatillo(id, dia.fecha);
}

// Los complementos sin precio comparten color y nombre con Complementos.
function obtenerCategoriaVisual(idCategoria) {
  return idCategoria === "mas-complementos" ? "complementos" : idCategoria;
}

/* ---------- Menú de hoy ---------- */

// Única función que crea las tarjetas.
function crearTarjeta(platillo) {
  const enlace = crearElemento(
    "a",
    `tarjeta categoria--${obtenerCategoriaVisual(platillo.categoria)}`,
  );
  enlace.href = `#/platillo/${platillo.id}`;

  const textos = crearElemento("span", "tarjeta__textos");
  const precio = obtenerPrecioVisible(platillo);
  textos.append(
    crearElemento("span", "tarjeta__nombre", platillo.nombre),
    crearElemento(
      "span",
      "tarjeta__precio",
      precio === null ? "Ver opciones" : formatearPrecio(precio),
    ),
  );
  enlace.append(textos, crearFoto(platillo, "tarjeta__foto"));

  const elemento = document.createElement("li");
  elemento.append(enlace);
  return elemento;
}

// Foto en círculo. Sin foto, queda el fondo gris de carga.
function crearFoto(platillo, clase) {
  const marco = crearElemento("span", `foto ${clase}`);
  if (platillo.foto) {
    const imagen = document.createElement("img");
    imagen.src = platillo.foto;
    imagen.alt = "";
    marco.append(imagen);
  }
  return marco;
}

// Muestra la lista de una categoría sin cambiar de pantalla.
function mostrarCategoria(contenedor, dia, idCategoria) {
  const categoria = dia.categorias.find((una) => una.id === idCategoria);
  const platillos = [...categoria.platillos];
  if (idCategoria === "complementos") {
    const masComplementos = dia.categorias.find((una) => una.id === "mas-complementos");
    platillos.push(crearResumenDeCategoria(masComplementos));
  }

  contenedor.querySelectorAll(".categoria").forEach((boton) => {
    boton.setAttribute("aria-pressed", String(boton.dataset.categoria === idCategoria));
  });
  contenedor.querySelector(".menu__categoria").textContent = categoria.nombre;
  // Figma cuenta "opciones" en Complementos y "platillos" en las demás categorías
  const [una, varias] =
    idCategoria === "complementos" ? ["opción", "opciones"] : ["platillo", "platillos"];
  contenedor.querySelector(".menu__conteo").textContent =
    `${platillos.length} ${platillos.length === 1 ? una : varias}`;

  const nota = contenedor.querySelector(".menu__nota");
  nota.hidden = idCategoria !== "tipicos";
  nota.textContent = `Apártalos de ${formatearRango(HORARIOS.apartar, " a ", true)} y recógelos de ${formatearRango(HORARIOS.recogerTipicos)}`;

  contenedor.querySelector(".menu__rejilla").replaceChildren(...platillos.map(crearTarjeta));
}

// Aviso para un día sin menú.
// TODO: Figma no tiene pantalla para un día sin menú. Se usa el aviso "Menú sin actualizar"
// (1399:9826) sin su primera frase, que habla de un menú anterior que aquí no se muestra.
function crearAvisoSinMenu() {
  const { hora, periodo } = separarHora(HORARIOS.apartar.desde);
  return crearAviso(
    "desactualizado",
    "Menú sin actualizar",
    `Por ahora no se puede apartar; Funda Gondra lo publica antes de las ${hora.replace(":00", "")} ${periodo}`,
  );
}

function dibujarMenu(contenedor, { parametros }) {
  const ahora = new Date();
  contenedor.querySelector(".menu__fecha").textContent = formatearFechaLarga(ahora);

  const dia = obtenerMenuDelDia(obtenerFechaDeHoy(ahora));
  if (!dia) {
    contenedor.querySelector(".menu__del-dia").replaceWith(crearAvisoSinMenu());
    return;
  }

  contenedor.querySelector(".anuncio__titulo").textContent =
    `Aparta de ${formatearRango(HORARIOS.apartar, " a ", true)}`;
  contenedor.querySelector(".anuncio__texto").textContent =
    `Recoge tu comida de ${formatearRango(HORARIOS.recogerAlmuerzos)} en tu cafetería UCA.`;

  contenedor.querySelectorAll(".categoria").forEach((boton) => {
    boton.addEventListener("click", () => {
      const idCategoria = boton.dataset.categoria;
      // Cambia la dirección sin crear otra entrada en el historial
      history.replaceState(history.state, "", crearRutaDelMenu(idCategoria));
      mostrarCategoria(contenedor, dia, idCategoria);
    });
  });
  // Sin categoría en la dirección (o con una que no existe) se usa la inicial
  const pedida = parametros.get("categoria");
  const hayBoton = [...contenedor.querySelectorAll(".categoria")].some(
    (boton) => boton.dataset.categoria === pedida,
  );
  mostrarCategoria(contenedor, dia, hayBoton ? pedida : CATEGORIA_INICIAL);
}

/* ---------- Detalle de platillo ---------- */

// Caja gris con título, lista y nota opcional.
function crearCajaDeOpciones(titulo, lineas, nota = "") {
  const caja = crearElemento("section", "caja");
  const lista = crearElemento("ul", "caja__lista");
  // Cada línea es un texto, o una lista de textos y elementos
  lista.append(
    ...lineas.map((linea) => {
      const elemento = crearElemento("li", "caja__linea");
      elemento.append(...[linea].flat());
      return elemento;
    }),
  );
  caja.append(crearElemento("h2", "caja__titulo", titulo), lista);
  if (nota) {
    caja.append(crearElemento("p", "caja__nota", nota));
  }
  return caja;
}

// Selector de cantidad (Figma 1293:4703). Avisa cada cambio con alCambiar().
function crearSelectorDeCantidad({ etiqueta, detalle, minimo, alCambiar }) {
  let cantidad = minimo;

  const fila = crearElemento("div", "selector");
  const textos = crearElemento("div", "selector__textos");
  textos.append(
    crearElemento("p", "selector__etiqueta", etiqueta),
    crearElemento("p", "selector__detalle", detalle),
  );

  const restar = crearElemento("button", "selector__boton selector__boton--restar", "−");
  const sumar = crearElemento("button", "selector__boton selector__boton--sumar", "+");
  const numero = crearElemento("output", "selector__numero", String(cantidad));
  restar.type = sumar.type = "button";
  restar.setAttribute("aria-label", `Restar: ${etiqueta}`);
  sumar.setAttribute("aria-label", `Sumar: ${etiqueta}`);
  restar.disabled = cantidad === minimo;

  const cambiar = (paso) => {
    cantidad = Math.max(minimo, cantidad + paso);
    numero.textContent = cantidad;
    restar.disabled = cantidad === minimo;
    alCambiar(cantidad);
  };
  restar.addEventListener("click", () => cambiar(-1));
  sumar.addEventListener("click", () => cambiar(1));

  const contador = crearElemento("div", "selector__contador");
  contador.append(restar, numero, sumar);
  fila.append(textos, contador);
  return fila;
}

// Un selector por platillo, o uno por cada tipo (pupusas).
// El total solo cambia lo que se ve en pantalla; no se guarda.
function crearCajaDeCantidad(platillo, alCambiarTotal) {
  const tipos = platillo.opciones?.find((grupo) => grupo.id === "tipo")?.valores;
  const filas = tipos ? tipos.map((tipo) => tipo.nombre) : ["Cantidad"];
  // Con tipos, cada uno empieza en 0 y se necesita al menos 1 en total
  const minimo = tipos ? 0 : 1;
  const cantidades = filas.map(() => minimo);
  const sumarCantidades = () => cantidades.reduce((suma, cantidad) => suma + cantidad, 0);

  const caja = crearElemento("section", "caja caja--cantidad");
  if (tipos) {
    // Texto de Figma para pupusas, el único platillo con tipos
    caja.append(crearElemento("h2", "caja__titulo", "Elige tus pupusas"));
  }
  filas.forEach((etiqueta, posicion) => {
    caja.append(
      crearSelectorDeCantidad({
        etiqueta,
        detalle: `${formatearPrecio(platillo.precio)} c/u`,
        minimo,
        alCambiar: (cantidad) => {
          cantidades[posicion] = cantidad;
          alCambiarTotal(sumarCantidades());
        },
      }),
    );
  });
  alCambiarTotal(sumarCantidades());
  return caja;
}

// Orden en que Figma nombra los grupos en la caja del combo (1193:7688)
const ORDEN_EN_COMBO = ["guarnicion", "ensalada", "tortillas", "bebida"];

// "• Arroz o casamiento": todas las alternativas del grupo, con la de siempre marcada.
function crearLineaDeCombo(grupo) {
  const alternativas = grupo.valores.filter((valor) => valor.enCombo);
  const linea = [`• ${grupo.prefijoEnCombo ?? ""}`];
  alternativas.forEach((valor, posicion) => {
    if (posicion > 0) {
      linea.push(posicion === alternativas.length - 1 ? " o " : ", ");
    }
    linea.push(
      valor.nombre === grupo.porDefecto
        ? crearElemento("strong", "caja__por-defecto", valor.enCombo)
        : valor.enCombo,
    );
  });
  return linea;
}

// Botón inferior que lleva a otra ruta.
function crearBotonInferior(texto, alTocar, tipo = "primario") {
  const boton = crearElemento("button", `boton boton--${tipo} detalle__boton`, texto);
  boton.type = "button";
  boton.addEventListener("click", alTocar);
  return boton;
}

// Aviso que ocupa el lugar del botón en un platillo de otro día (Figma 1436:10283).
function crearAvisoDeOtroDia(dia) {
  const nombre = dia.nombre.toLowerCase();
  const numero = Number(dia.fecha.slice(-2));
  let texto = `Solo puedes apartar el menú de hoy, de ${formatearRango(HORARIOS.apartar, " a ", true)}`;
  // TODO: Figma solo muestra un día que aún no llega. En un día pasado se quita la
  // frase "Vuelve el … para pedirlo.", porque no sería cierta.
  if (dia.fecha > obtenerFechaDeHoy()) {
    texto += ` Vuelve el ${nombre} para pedirlo.`;
  }
  return crearAviso("info", `Este platillo es del ${nombre} ${numero}`, texto);
}

// Devuelve la caja de opciones (si hay) y el botón, según el tipo de platillo.
function crearAccionesDeDetalle(platillo, esDeHoy) {
  if (obtenerPrecioVisible(platillo) === null) {
    const verPlatosFuertes = crearBotonInferior(
      "Ver platos fuertes",
      () => {
        location.hash = crearRutaDelMenu("platos-fuertes");
      },
      "secundario",
    );
    return platillo.elementos
      ? [crearCajaDeOpciones("Opciones", platillo.elementos.map((nombre) => `• ${nombre}`)), verPlatosFuertes]
      : [verPlatosFuertes];
  }

  const irAApartar = () => {
    location.hash = `#/apartar/${platillo.id}`;
  };
  const textoApartar = (precio) => `Apartar · ${formatearPrecio(precio)}`;

  if (platillo.categoria === "platos-fuertes") {
    const incluye = ORDEN_EN_COMBO.map((idGrupo) =>
      platillo.opciones.find((grupo) => grupo.id === idGrupo),
    )
      .filter(Boolean)
      .map(crearLineaDeCombo);
    // En Figma, las sopas (sin guarnición) no llevan esta nota (1193:7745)
    const llevaGuarnicion = platillo.opciones.some((grupo) => grupo.id === "guarnicion");
    // En otro día no hay siguiente paso
    const nota = llevaGuarnicion && esDeHoy ? "Los eliges en el siguiente paso." : "";
    return [
      crearCajaDeOpciones("El combo incluye", incluye, nota),
      crearBotonInferior("Elegir acompañamientos", irAApartar),
    ];
  }

  const boton = crearBotonInferior(textoApartar(obtenerPrecioVisible(platillo)), irAApartar);

  if (platillo.eligeCantidad) {
    const caja = crearCajaDeCantidad(platillo, (total) => {
      boton.disabled = total === 0;
      const precio = formatearPrecio(platillo.precio * total);
      boton.textContent = total > 1 ? `Apartar ${total} · ${precio}` : `Apartar · ${precio}`;
    });
    return [caja, boton];
  }

  const grupo = platillo.opciones?.[0];
  if (!grupo) {
    return [boton];
  }
  const lineas = grupo.valores.map((valor) =>
    valor.precio === undefined
      ? `• ${valor.nombre}`
      : `• ${valor.nombre} · ${formatearPrecio(valor.precio)}`,
  );
  // Si el platillo ya tiene precio, la otra opción es llevarlo completo
  if (platillo.precio !== null && grupo.valores.some((valor) => valor.precio !== undefined)) {
    lineas.unshift(`• Plato completo · ${formatearPrecio(platillo.precio)}`);
  }
  return [crearCajaDeOpciones("Elige tu opción", lineas, "Eliges la opción al apartar."), boton];
}

// Regresa al menú en la categoría correcta. Si se llegó desde el menú, retrocede en el
// historial; si el detalle se abrió directo, usa la categoría del platillo.
function volverAlMenu(idCategoria) {
  if (history.state?.desde?.startsWith("#/menu")) {
    history.back();
  } else {
    location.replace(crearRutaDelMenu(idCategoria));
  }
}

// Única función que crea el detalle. "dia" es el menú al que pertenece el platillo.
function crearDetalle(platillo, dia) {
  // Esta fase solo revisa la fecha; la hora se revisa en la fase de Apartar
  const esDeHoy = dia.fecha === obtenerFechaDeHoy();
  const idCategoria = obtenerCategoriaVisual(platillo.categoria);
  const detalle = crearElemento("article", `detalle categoria--${idCategoria}`);

  const portada = crearElemento("div", "detalle__portada");
  const volver = document.getElementById("boton-volver").cloneNode(true);
  volver.removeAttribute("id");
  volver.hidden = false;
  volver.classList.add("boton-volver--sobre-foto");
  volver.addEventListener("click", () => volverAlMenu(idCategoria));
  portada.append(volver, crearFoto(platillo, "detalle__foto"));

  const contenido = crearElemento("div", "detalle__contenido");
  const estado = crearElemento("div", "detalle__estado");
  estado.append(crearElemento("p", "detalle__categoria", CATEGORIAS[idCategoria].nombre));
  // En Figma, el detalle de otro día no lleva etiqueta de estado (1436:10236)
  if (platillo.disponible && esDeHoy) {
    estado.append(crearElemento("span", "etiqueta etiqueta--disponible", "Disponible"));
  }

  const encabezado = crearElemento("div", "detalle__encabezado");
  encabezado.append(crearElemento("h1", "detalle__nombre", platillo.nombre));
  const precio = obtenerPrecioVisible(platillo);
  if (precio !== null) {
    encabezado.append(crearElemento("p", "detalle__precio", formatearPrecio(precio)));
  }

  contenido.append(estado, encabezado);
  // En Figma solo los típicos llevan la línea de recogida (1294:8255 a 1294:8283)
  if (platillo.recogida) {
    contenido.append(
      crearElemento(
        "p",
        "detalle__recoger",
        `${platillo.recogida} de ${formatearRango(HORARIOS.recogerTipicos)}`,
      ),
    );
  }
  const acciones = crearAccionesDeDetalle(platillo, esDeHoy);
  if (esDeHoy) {
    contenido.append(...acciones);
  } else {
    // En otro día quedan las cajas, sin ningún botón, y el aviso
    const cajas = acciones.filter((accion) => !accion.classList.contains("detalle__boton"));
    contenido.append(...cajas, crearAvisoDeOtroDia(dia));
  }
  detalle.append(portada, contenido);
  return detalle;
}

// Pantalla para cuando no se puede mostrar el detalle: un mensaje y el regreso al menú.
// TODO: Figma no define esta disposición ni el botón "Volver al menú"
function crearMensajeConRegreso(mensaje) {
  const bloque = crearElemento("section", "no-encontrado");
  bloque.append(
    mensaje,
    crearBotonInferior("Volver al menú", () => {
      location.hash = "#/menu";
    }),
  );
  return bloque;
}

// Crea lo que va en la pantalla: el detalle, o el mensaje que explica por qué no está.
function crearVistaDeDetalle(platillo, dia) {
  if (!dia) {
    return crearMensajeConRegreso(crearAvisoSinMenu());
  }
  if (!platillo) {
    // TODO: Figma no define el mensaje de platillo no encontrado
    return crearMensajeConRegreso(
      crearElemento("h1", "no-encontrado__titulo", "No encontramos ese platillo"),
    );
  }
  return crearDetalle(platillo, dia);
}

// Sin ?dia=AAAA-MM-DD en la dirección, el detalle es del menú de hoy.
function dibujarDetalle(contenedor, { id, parametros }) {
  const dia = obtenerMenuDelDia(parametros.get("dia") ?? obtenerFechaDeHoy());
  const platillo = dia && buscarPlatilloParaVista(id, dia);
  if (platillo) {
    document.title = `${platillo.nombre} · BúhoGondra`;
  }
  contenedor.replaceChildren(crearVistaDeDetalle(platillo, dia));
}

// Ruta provisional: apartar se construye en la siguiente fase.
function dibujarProximamente(contenedor) {
  contenedor.querySelector(".mensaje-construccion").textContent = "Próximamente";
}
