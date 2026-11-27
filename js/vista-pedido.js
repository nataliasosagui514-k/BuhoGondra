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
  const opciones = obtenerOpcionesPorDefecto(platillo);

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
    () => {
      location.hash = `#/apartar/${id}`;
    },
  );
  boton.classList.add("personalizar__boton");

  contenedor.querySelector(".menu").append(presentacion, grupos, resumen, boton);
}
