// Cuentas y reglas del pedido. Las pantallas no hacen cuentas: piden el resultado aquí.

/* ---------- Dinero ---------- */

// Las sumas se hacen en centavos para que no aparezcan restos como 2.4000000000000004.
function aCentavos(precio) {
  return Math.round(precio * 100);
}

// Precio de "cantidad" unidades.
function calcularSubtotal(precio, cantidad) {
  return (aCentavos(precio) * cantidad) / 100;
}

// Unidades en total. "cantidades" es un objeto como { Revuelta: 2, "Frijol con queso": 1 }
function contarUnidades(cantidades) {
  return Object.values(cantidades).reduce((suma, cantidad) => suma + cantidad, 0);
}

// Total de una lista de { precio, cantidad }.
function calcularTotal(articulos) {
  const centavos = articulos.reduce(
    (suma, { precio, cantidad }) => suma + aCentavos(precio) * cantidad,
    0,
  );
  return centavos / 100;
}

/* ---------- Descuento de empleado UCA (Figma 1440:10850) ---------- */

const PORCENTAJE_DE_DESCUENTO_DOCENTE = 10;
const ETIQUETA_DE_DESCUENTO = `Descuento empleado UCA (${PORCENTAJE_DE_DESCUENTO_DOCENTE} %)`;

// Solo las cuentas "docente" (docentes y empleados) tienen descuento. Se redondea a
// centavos. Sin sesión no hay tipo de cuenta, así que no hay descuento.
function calcularDescuento(subtotal, tipoCuenta) {
  return tipoCuenta === "docente"
    ? Math.round((aCentavos(subtotal) * PORCENTAJE_DE_DESCUENTO_DOCENTE) / 100) / 100
    : 0;
}

// Lo que se cobra por un pedido: { subtotal, descuento, total }. El descuento es sobre
// todo el pedido junto, también si es mixto.
function calcularCobro(articulos, tipoCuenta) {
  const subtotal = calcularTotal(articulos);
  const descuento = calcularDescuento(subtotal, tipoCuenta);
  return { subtotal, descuento, total: (aCentavos(subtotal) - aCentavos(descuento)) / 100 };
}

/* ---------- Puntos, PIN y número ---------- */

const PRIMER_NUMERO_DE_PEDIDO = 1043;
const CIFRAS_DEL_PIN = 4;

// Los puntos se dan por pedido, no por cantidad: se suman una vez los de cada
// categoría que tenga el pedido (plato fuerte 3 + económico 1 = 4).
function calcularPuntos(platillos) {
  const porCategoria = new Map(
    platillos.map((platillo) => [platillo.categoria, platillo.puntos ?? 0]),
  );
  return [...porCategoria.values()].reduce((suma, puntos) => suma + puntos, 0);
}

// PIN al azar de 4 dígitos que no esté en "usados". Lo usan los pedidos y los premios.
// Es texto para no perder los ceros del principio ("0427").
function generarPinLibre(usados, azar = Math.random) {
  let pin;
  do {
    pin = String(Math.floor(azar() * 10 ** CIFRAS_DEL_PIN)).padStart(CIFRAS_DEL_PIN, "0");
  } while (usados.has(pin));
  return pin;
}

// El PIN de un pedido no se repite entre los de ese día en esa cafetería.
function generarPin(pedidos, fecha, cafeteria, azar = Math.random) {
  const usados = new Set(
    pedidos
      .filter((pedido) => pedido.fecha === fecha && pedido.cafeteria === cafeteria)
      .map((pedido) => pedido.pin),
  );
  return generarPinLibre(usados, azar);
}

// Consecutivo: "A-1043", "A-1044"…
function obtenerSiguienteNumero(pedidos) {
  const usados = pedidos
    .map((pedido) => Number(String(pedido.numero).replace("A-", "")))
    .filter(Number.isInteger);
  return `A-${Math.max(PRIMER_NUMERO_DE_PEDIDO - 1, ...usados) + 1}`;
}

/* ---------- El pedido que se guarda ---------- */

// El autor es el correo de la sesión. "invitado" queda en los pedidos hechos antes de
// que apartar pidiera una cuenta (no suman puntos y no se modifican).
const AUTOR_INVITADO = "invitado";

// Arma el pedido con los datos del diseño y ningún otro. "articulos" son las líneas
// junto con su platillo, precio y cantidad; "anteriores", los pedidos ya guardados.
function crearPedido({
  articulos,
  fecha,
  cafeteria,
  horaRecogida,
  anteriores,
  autor = AUTOR_INVITADO,
  tipoCuenta,
}) {
  const numero = obtenerSiguienteNumero(anteriores);
  const { descuento, total } = calcularCobro(articulos, tipoCuenta);
  return {
    id: `${fecha}-${numero}`,
    fecha,
    cafeteria,
    horaRecogida,
    platillos: articulos.map(({ linea }) => linea),
    descuento,
    total, // ya con el descuento: es lo que se paga en caja
    pin: generarPin(anteriores, fecha, cafeteria),
    numero,
    puntos: calcularPuntos(articulos.map(({ platillo }) => platillo)),
    autor,
  };
}

// Un pedido está en curso el día en que se recoge. Los de días anteriores ya cuentan
// como entregados (regla de la cafetería).
// TODO: la app no sabe si un pedido se recogió, se canceló o no se recogió
function estaEnCurso(pedido, hoy = obtenerFechaDeHoy()) {
  return pedido.fecha >= hoy;
}

/* ---------- Agotados ---------- */

// Los platillos del pedido que ya no tienen existencias (disponible: false en los
// datos), cada uno una sola vez. Se revisa al confirmar.
// TODO (fase de Menú de la semana y Platillo agotado, NUEVO 5): mostrar también el
// estado de agotado en las tarjetas del menú (Figma N5a) y en el detalle (N5b).
function buscarAgotados(articulos) {
  return contarPorPlatillo(articulos)
    .map(({ platillo }) => platillo)
    .filter((platillo) => !platillo.disponible);
}

/* ---------- Horarios ---------- */

// La hora con la que trabaja Apartar: la del teléfono o, para las demostraciones, la
// que diga la dirección (index.html?hora=10:00). Solo cambia la hora, no la fecha.
function obtenerAhora(consulta = location.search) {
  const ahora = new Date();
  const pedida = new URLSearchParams(consulta).get("hora") ?? "";
  const partes = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(pedida);
  if (partes) {
    ahora.setHours(Number(partes[1]), Number(partes[2]), 0, 0);
  }
  return ahora;
}

function aMinutos(hora) {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

// Se aparta desde las 8:00 y hasta antes de las 11:00.
function estaAbiertoApartar(ahora = obtenerAhora()) {
  const minutos = ahora.getHours() * 60 + ahora.getMinutes();
  return minutos >= aMinutos(HORARIOS.apartar.desde) && minutos < aMinutos(HORARIOS.apartar.hasta);
}

// El rango de recogida de una ventana: "almuerzo" o "tipicos".
function obtenerRangoDeRecogida(ventana) {
  return ventana === "tipicos" ? HORARIOS.recogerTipicos : HORARIOS.recogerAlmuerzos;
}

// Las horas que se pueden elegir: ["12:00", "12:15", …]
function crearHorasDeRecogida(ventana) {
  const { desde, hasta, cadaMinutos } = obtenerRangoDeRecogida(ventana);
  const horas = [];
  for (let minutos = aMinutos(desde); minutos <= aMinutos(hasta); minutos += cadaMinutos) {
    const resto = String(minutos % 60).padStart(2, "0");
    horas.push(`${String(Math.floor(minutos / 60)).padStart(2, "0")}:${resto}`);
  }
  return horas;
}

/* ---------- Partes del pedido (pedido mixto) ---------- */

// Las partes en el orden en que se recogen. Un pedido mixto tiene las dos: lleva dos
// horas, pero una sola cafetería, un solo número, un solo PIN y se paga todo al
// recoger el almuerzo.
const VENTANAS_DE_RECOGIDA = ["almuerzo", "tipicos"];

function obtenerVentanas(platillos) {
  return VENTANAS_DE_RECOGIDA.filter((ventana) =>
    platillos.some((platillo) => platillo.ventana_recogida === ventana),
  );
}

// Primero lo del almuerzo y después los típicos; dentro de cada parte no cambia el orden.
function ordenarPorVentana(articulos) {
  const posicion = ({ platillo }) => VENTANAS_DE_RECOGIDA.indexOf(platillo.ventana_recogida);
  return [...articulos].sort((uno, otro) => posicion(uno) - posicion(otro));
}

// Lo que se guarda como hora de recogida: "12:30" y, en un pedido mixto, la de cada
// parte: { almuerzo: "12:30", tipicos: "15:00" }. "horas" tiene lo elegido por parte.
function juntarHoras(horas, ventanas) {
  return ventanas.length === 1
    ? horas[ventanas[0]]
    : Object.fromEntries(ventanas.map((ventana) => [ventana, horas[ventana]]));
}

function esPedidoMixto(horaRecogida) {
  return typeof horaRecogida === "object";
}

/* ---------- Líneas del pedido ---------- */

// Una línea es lo que se guarda de cada platillo: su id, la cantidad y las opciones.
function crearLinea(id, cantidad, opciones) {
  return { id, cantidad, opciones };
}

// Línea de un platillo que se pide por tipos (pupusas). Guarda la cantidad de cada
// tipo y la línea lleva la suma de todos.
function crearLineaPorTipos(id, cantidades) {
  const elegidas = Object.fromEntries(
    Object.entries(cantidades).filter(([, cantidad]) => cantidad > 0),
  );
  return crearLinea(id, contarUnidades(elegidas), { tipo: elegidas });
}

// Dos líneas son la misma si son del mismo platillo con las mismas opciones. En los
// platillos con tipos basta el platillo: las cantidades de cada tipo se suman.
function sonLaMismaLinea(una, otra) {
  return (
    una.id === otra.id &&
    (Boolean(otra.opciones.tipo) ||
      JSON.stringify(una.opciones) === JSON.stringify(otra.opciones))
  );
}

function quitarLinea(lineas, quitada) {
  return lineas.filter((linea) => !sonLaMismaLinea(linea, quitada));
}

// Agrega una línea. Si ya está el mismo platillo con las mismas opciones, suma cantidades.
function unirLineas(lineas, nueva) {
  const esIgual = (linea) => sonLaMismaLinea(linea, nueva);
  if (!lineas.some(esIgual)) {
    return [...lineas, nueva];
  }
  return lineas.map((linea) => {
    if (!esIgual(linea)) {
      return linea;
    }
    if (!nueva.opciones.tipo) {
      return crearLinea(linea.id, linea.cantidad + nueva.cantidad, linea.opciones);
    }
    const sumadas = { ...linea.opciones.tipo };
    Object.entries(nueva.opciones.tipo).forEach(([tipo, cantidad]) => {
      sumadas[tipo] = (sumadas[tipo] ?? 0) + cantidad;
    });
    return crearLineaPorTipos(linea.id, sumadas);
  });
}

/* ---------- Presentaciones ---------- */

// Las formas de llevar un platillo, cada una con su precio ("Solo la porción", "En
// combo"…). Si el platillo ya tiene precio, la otra forma es llevarlo completo.
function obtenerPresentaciones(platillo) {
  const grupo = platillo.opciones?.find((uno) => uno.id === "presentacion");
  if (!grupo) {
    return [];
  }
  return platillo.precio === null
    ? grupo.valores
    : [{ nombre: "Plato completo", precio: platillo.precio }, ...grupo.valores];
}

// Lo que cuesta una unidad de la línea. null: falta elegir la presentación.
function obtenerPrecio(platillo, linea) {
  const presentaciones = obtenerPresentaciones(platillo);
  if (!presentaciones.length) {
    return platillo.precio;
  }
  const elegida = presentaciones.find((una) => una.nombre === linea.opciones.presentacion);
  return elegida?.precio ?? null;
}

function elegirPresentacion(linea, presentacion) {
  return crearLinea(linea.id, linea.cantidad, { ...linea.opciones, presentacion });
}

// Las unidades de cada platillo, aunque esté en varias líneas.
function contarPorPlatillo(articulos) {
  const cuentas = new Map();
  articulos.forEach(({ platillo, cantidad }) => {
    cuentas.set(platillo.id, {
      platillo,
      cantidad: (cuentas.get(platillo.id)?.cantidad ?? 0) + cantidad,
    });
  });
  return [...cuentas.values()];
}

// El valor por defecto de cada grupo que lo tiene: { guarnicion: "Arroz", … }
function obtenerOpcionesPorDefecto(platillo) {
  return Object.fromEntries(
    (platillo.opciones ?? [])
      .filter((grupo) => grupo.porDefecto)
      .map((grupo) => [grupo.id, grupo.porDefecto]),
  );
}
