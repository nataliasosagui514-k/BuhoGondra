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

/* ---------- Horarios ---------- */

// La hora con la que trabaja Apartar.
function obtenerAhora() {
  return new Date();
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

// Agrega una línea. Si ya está el mismo platillo con las mismas opciones, suma cantidades.
function unirLineas(lineas, nueva) {
  const esIgual = (linea) =>
    linea.id === nueva.id &&
    (Boolean(nueva.opciones.tipo) ||
      JSON.stringify(linea.opciones) === JSON.stringify(nueva.opciones));
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

// El valor por defecto de cada grupo que lo tiene: { guarnicion: "Arroz", … }
function obtenerOpcionesPorDefecto(platillo) {
  return Object.fromEntries(
    (platillo.opciones ?? [])
      .filter((grupo) => grupo.porDefecto)
      .map((grupo) => [grupo.id, grupo.porDefecto]),
  );
}
