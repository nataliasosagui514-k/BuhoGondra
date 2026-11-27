// Cuentas de puntos, niveles y premios. Es la única fuente de estos cálculos: las
// pantallas piden el resultado aquí.
// Los puntos no se guardan aparte: salen siempre de los pedidos guardados.

const DIAS_PARA_RECOGER_PREMIO = 7;
const SIN_NIVEL = "Sin nivel";

/* ---------- Puntos y nivel ---------- */

// Los pedidos que hizo la persona que tiene la sesión abierta, del más antiguo al más
// reciente (el orden en que se guardaron). Sin sesión no hay ninguno.
function obtenerPedidosDeLaSesion() {
  const sesion = obtenerSesion();
  return sesion ? obtenerPedidos().filter((pedido) => pedido.autor === sesion.correo) : [];
}

// Los que se pueden mostrar en Historial y en los avisos. Un pedido de prueba (ver
// README) solo trae puntos: suma, pero no tiene recogida que mostrar.
function listarPedidosConRecogida() {
  return obtenerPedidosDeLaSesion().filter((pedido) => pedido.horaRecogida);
}

// Un pedido cancelado no suma. Conserva su campo "puntos" como registro.
function contarPuntos(pedido) {
  return pedido.cancelado ? 0 : (pedido.puntos ?? 0);
}

function sumarPuntos(pedidos) {
  return pedidos.reduce((suma, pedido) => suma + contarPuntos(pedido), 0);
}

function calcularPuntosTotales() {
  return sumarPuntos(obtenerPedidosDeLaSesion());
}

// El nivel alcanzado ("Sin nivel", "Búhi Pro"…), cuántos niveles van, cuál sigue
// (null en el máximo) y cuántos puntos faltan para llegar a él.
function calcularNivel(puntos) {
  const alcanzados = NIVELES_PUNTOS.filter((nivel) => puntos >= nivel.puntos).length;
  const siguiente = NIVELES_PUNTOS[alcanzados] ?? null;
  return {
    nombre: NIVELES_PUNTOS[alcanzados - 1]?.nombre ?? SIN_NIVEL,
    alcanzados,
    siguiente,
    faltan: siguiente ? siguiente.puntos - puntos : 0,
  };
}

// Qué parte del camino hasta el último nivel llevan esos puntos: de 0 a 1.
function calcularAvance(puntos) {
  return Math.min(puntos / NIVELES_PUNTOS.at(-1).puntos, 1);
}

/* ---------- Premios ---------- */

// "2026-11-27" y 7 días -> "2026-12-04"
function sumarDias(fecha, dias) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return obtenerFechaDeHoy(new Date(anio, mes - 1, dia + dias));
}

// El día del pedido con el que se llegó a esos puntos, o null si no se ha llegado.
function buscarFechaDeDesbloqueo(meta, pedidos) {
  let suma = 0;
  const pedido = pedidos.find((uno) => {
    suma += contarPuntos(uno);
    return suma >= meta;
  });
  return pedido?.fecha ?? null;
}

// Los tres premios con su estado: "Bloqueado", "Disponible", "Por recoger" o
// "Vencido". Un premio vence 7 días después de quedar disponible, se haya tocado
// "Canjear" o no.
// TODO: "Canjeado" no se usa en el MVP. El canje en caja se hace fuera de la app, así
// que la app no sabe si el premio ya se entregó.
function obtenerPremios(
  puntos,
  premiosGuardados,
  { pedidos = obtenerPedidosDeLaSesion(), hoy = obtenerFechaDeHoy() } = {},
) {
  return NIVELES_PUNTOS.map((nivel) => {
    const premio = {
      id: nivel.id,
      nivel: nivel.nombre,
      meta: nivel.puntos,
      nombre: nivel.premio,
      foto: nivel.foto,
      fotoGrande: nivel.fotoGrande,
    };
    if (puntos < nivel.puntos) {
      return { ...premio, estado: "Bloqueado", faltan: nivel.puntos - puntos };
    }
    const guardado = premiosGuardados.find((uno) => uno.id === nivel.id);
    const disponibleDesde =
      guardado?.disponibleDesde ?? buscarFechaDeDesbloqueo(nivel.puntos, pedidos) ?? hoy;
    const venceEl = sumarDias(disponibleDesde, DIAS_PARA_RECOGER_PREMIO);
    let estado = guardado ? "Por recoger" : "Disponible";
    // Las fechas "AAAA-MM-DD" se pueden comparar como texto
    if (hoy > venceEl) {
      estado = "Vencido";
    }
    return {
      ...premio,
      estado,
      disponibleDesde,
      venceEl,
      // Un premio vencido ya no enseña su PIN
      pin: estado === "Por recoger" ? guardado.pin : null,
    };
  });
}

// Los premios de la persona que tiene la sesión abierta.
function obtenerPremiosDeLaSesion(hoy = obtenerFechaDeHoy()) {
  const correo = obtenerSesion()?.correo;
  const canjeados = obtenerPremiosCanjeados().filter((premio) => premio.autor === correo);
  return obtenerPremios(calcularPuntosTotales(), canjeados, { hoy });
}

// Los PIN de los premios que todavía se pueden recoger.
function listarPinesActivos(canjeados, hoy) {
  return new Set(
    canjeados
      .filter((premio) => hoy <= sumarDias(premio.disponibleDesde, DIAS_PARA_RECOGER_PREMIO))
      .map((premio) => premio.pin),
  );
}

// Canjea un premio disponible: le da un PIN y lo guarda. No descuenta puntos.
// Devuelve lo guardado, o null si el premio no estaba disponible o no se pudo guardar.
function canjearPremio(id, { hoy = obtenerFechaDeHoy(), azar = Math.random } = {}) {
  const sesion = obtenerSesion();
  const premio = obtenerPremiosDeLaSesion(hoy).find((uno) => uno.id === id);
  if (!sesion || premio?.estado !== "Disponible") {
    return null;
  }
  return guardarPremioCanjeado({
    id,
    autor: sesion.correo,
    pin: generarPinLibre(listarPinesActivos(obtenerPremiosCanjeados(), hoy), azar),
    disponibleDesde: premio.disponibleDesde,
  });
}

// Cuando bajan los puntos (un pedido cancelado), se borran los canjes todavía
// pendientes de los niveles que ya no se alcanzan: su PIN deja de servir. Si se vuelve
// a llegar al nivel, el premio aparece otra vez para canjearlo. Los vencidos se quedan.
// Devuelve false si no se pudo guardar.
function quitarCanjesSinPuntos(autor, hoy = obtenerFechaDeHoy()) {
  const puntos = sumarPuntos(obtenerPedidos().filter((pedido) => pedido.autor === autor));
  const canjes = obtenerPremiosCanjeados();
  const quedan = canjes.filter((canje) => {
    const meta = NIVELES_PUNTOS.find((nivel) => nivel.id === canje.id)?.puntos ?? 0;
    const pendiente = hoy <= sumarDias(canje.disponibleDesde, DIAS_PARA_RECOGER_PREMIO);
    return !(canje.autor === autor && pendiente && puntos < meta);
  });
  return quedan.length === canjes.length || guardarPremiosCanjeados(quedan);
}
