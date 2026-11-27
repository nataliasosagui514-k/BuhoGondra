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

// PIN al azar de 4 dígitos que no tenga otro pedido de ese día en esa cafetería.
// Es texto para no perder los ceros del principio ("0427").
function generarPin(pedidos, fecha, cafeteria, azar = Math.random) {
  const usados = new Set(
    pedidos
      .filter((pedido) => pedido.fecha === fecha && pedido.cafeteria === cafeteria)
      .map((pedido) => pedido.pin),
  );
  let pin;
  do {
    pin = String(Math.floor(azar() * 10 ** CIFRAS_DEL_PIN)).padStart(CIFRAS_DEL_PIN, "0");
  } while (usados.has(pin));
  return pin;
}

// Consecutivo: "A-1043", "A-1044"…
function obtenerSiguienteNumero(pedidos) {
  const usados = pedidos
    .map((pedido) => Number(String(pedido.numero).replace("A-", "")))
    .filter(Number.isInteger);
  return `A-${Math.max(PRIMER_NUMERO_DE_PEDIDO - 1, ...usados) + 1}`;
}

/* ---------- El pedido que se guarda ---------- */

// TODO (fase de Registro): sin sesión, el autor es "invitado". Falta la regla de lo
// que puede hacer una persona invitada.
const AUTOR_INVITADO = "invitado";

// Arma el pedido con los datos del diseño y ningún otro. "articulos" son las líneas
// junto con su platillo, precio y cantidad; "anteriores", los pedidos ya guardados.
function crearPedido({ articulos, fecha, cafeteria, horaRecogida, anteriores }) {
  const numero = obtenerSiguienteNumero(anteriores);
  return {
    id: `${fecha}-${numero}`,
    fecha,
    cafeteria,
    horaRecogida,
    platillos: articulos.map(({ linea }) => linea),
    total: calcularTotal(articulos),
    pin: generarPin(anteriores, fecha, cafeteria),
    numero,
    puntos: calcularPuntos(articulos.map(({ platillo }) => platillo)),
    autor: AUTOR_INVITADO,
  };
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

// Un pedido admite una sola ventana de recogida (los pedidos mixtos son de otra fase).
function esDeLaMismaVentana(platillosDelPedido, platillo) {
  return platillosDelPedido.every((otro) => otro.ventana_recogida === platillo.ventana_recogida);
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
