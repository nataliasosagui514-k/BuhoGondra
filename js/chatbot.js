// Reglas del chatbot: qué pedido está activo y qué se le puede cambiar. Cada función
// revisa y guarda; las pantallas (js/vista-chatbot.js) no cambian pedidos.
// Los horarios salen de HORARIOS y de las funciones de js/pedido.js.
//
// Cambios: { ok: true, pedido } o { ok: false, motivo }. Motivos: "no-activo",
// "tarde", "hora", "cafeteria" y "sin-guardado".

function contarMinutos(momento) {
  return momento.getHours() * 60 + momento.getMinutes();
}

// Las partes de un pedido: ["almuerzo"], ["tipicos"] o las dos. No se puede saber solo
// con la hora, porque las 2:00 p. m. están en las dos ventanas.
function obtenerVentanasDelPedido(pedido) {
  if (esPedidoMixto(pedido.horaRecogida)) {
    return Object.keys(pedido.horaRecogida);
  }
  const ventanas = obtenerVentanas(
    detallarLineas(pedido.platillos, pedido.fecha).map(({ platillo }) => platillo),
  );
  if (ventanas.length) {
    return [ventanas[0]];
  }
  // Un platillo que ya no está en los datos: se decide por la hora
  return [pedido.horaRecogida > HORARIOS.recogerAlmuerzos.hasta ? "tipicos" : "almuerzo"];
}

function obtenerHoraDeVentana(pedido, ventana) {
  return esPedidoMixto(pedido.horaRecogida) ? pedido.horaRecogida[ventana] : pedido.horaRecogida;
}

// Sigue activo hasta que termina la última ventana de recogida del pedido (incluida
// la hora final: a las 2:00 p. m. todavía se puede recoger el almuerzo)
function estaActivo(pedido, ahora = obtenerAhora(), hoy = obtenerFechaDeHoy()) {
  if (pedido.fecha !== hoy || pedido.cancelado || !pedido.horaRecogida) {
    return false;
  }
  const fin = Math.max(
    ...obtenerVentanasDelPedido(pedido).map((ventana) =>
      aMinutos(obtenerRangoDeRecogida(ventana).hasta),
    ),
  );
  return contarMinutos(ahora) <= fin;
}

// Los pedidos activos de la sesión (sin sesión, los de invitado), por hora de recogida
function obtenerPedidosActivos(ahora = obtenerAhora()) {
  const autor = obtenerSesion()?.correo ?? AUTOR_INVITADO;
  const primeraHora = (pedido) =>
    aMinutos(obtenerHoraDeVentana(pedido, obtenerVentanasDelPedido(pedido)[0]));
  return obtenerPedidos()
    .filter((pedido) => pedido.autor === autor && estaActivo(pedido, ahora))
    .sort((uno, otro) => primeraHora(uno) - primeraHora(otro));
}

// El que se recoge primero, o null si no hay ninguno
function obtenerPedidoActivo(ahora = obtenerAhora()) {
  return obtenerPedidosActivos(ahora)[0] ?? null;
}

function buscarPedidoActivo(id, ahora = obtenerAhora()) {
  return obtenerPedidosActivos(ahora).find((pedido) => pedido.id === id) ?? null;
}

// Cancelar y cambiar de cafetería: solo antes de las 11:00, cuando cierra Apartar,
// porque después la cafetería ya prepara el pedido (Figma 31d y 33c).
// Figma 31d: "Por confirmar con Funda Gondra".
function estaATiempoDeCambiar(ahora = obtenerAhora()) {
  return contarMinutos(ahora) < aMinutos(HORARIOS.apartar.hasta);
}

// Las horas a las que se puede pasar: las de su ventana, cada 15 minutos, que todavía
// no pasaron, menos la que ya tiene
function listarHorasNuevas(pedido, ventana, ahora = obtenerAhora()) {
  return crearHorasDeRecogida(ventana).filter(
    (hora) =>
      hora !== obtenerHoraDeVentana(pedido, ventana) && aMinutos(hora) > contarMinutos(ahora),
  );
}

// Las cafeterías a las que se puede pasar: todas menos la actual (nota de Figma 33)
function listarOtrasCafeterias(pedido) {
  return CAFETERIAS.filter((cafeteria) => cafeteria.id !== pedido.cafeteria);
}

function guardarCambio(pedido) {
  return actualizarPedido(pedido)
    ? { ok: true, pedido }
    : { ok: false, motivo: "sin-guardado" };
}

// "2026-11-27T09:40", con la hora con la que trabaja la app
function marcarMomento(ahora) {
  const dosCifras = (numero) => String(numero).padStart(2, "0");
  return `${obtenerFechaDeHoy()}T${dosCifras(ahora.getHours())}:${dosCifras(ahora.getMinutes())}`;
}

function cancelarPedido(id, ahora = obtenerAhora()) {
  const pedido = buscarPedidoActivo(id, ahora);
  if (!pedido) {
    return { ok: false, motivo: "no-activo" };
  }
  if (!estaATiempoDeCambiar(ahora)) {
    return { ok: false, motivo: "tarde" };
  }
  // El pedido no se borra: queda en el Historial como cancelado
  const resultado = guardarCambio({ ...pedido, cancelado: marcarMomento(ahora) });
  if (resultado.ok) {
    quitarCanjesSinPuntos(pedido.autor);
  }
  return resultado;
}

// "ventana" solo hace falta en un pedido mixto, que tiene dos horas
function cambiarHoraPedido(id, hora, ventana, ahora = obtenerAhora()) {
  const pedido = buscarPedidoActivo(id, ahora);
  if (!pedido) {
    return { ok: false, motivo: "no-activo" };
  }
  const ventanas = obtenerVentanasDelPedido(pedido);
  const parte = ventana ?? (ventanas.length === 1 ? ventanas[0] : null);
  if (!ventanas.includes(parte) || !listarHorasNuevas(pedido, parte, ahora).includes(hora)) {
    return { ok: false, motivo: "hora" };
  }
  const horaRecogida = esPedidoMixto(pedido.horaRecogida)
    ? { ...pedido.horaRecogida, [parte]: hora }
    : hora;
  return guardarCambio({ ...pedido, horaRecogida });
}

function cambiarCafeteriaPedido(id, cafeteria, ahora = obtenerAhora()) {
  const pedido = buscarPedidoActivo(id, ahora);
  if (!pedido) {
    return { ok: false, motivo: "no-activo" };
  }
  if (!estaATiempoDeCambiar(ahora)) {
    return { ok: false, motivo: "tarde" };
  }
  if (!listarOtrasCafeterias(pedido).some((una) => una.id === cafeteria)) {
    return { ok: false, motivo: "cafeteria" };
  }
  // El PIN no cambia, salvo que en la otra cafetería ya haya uno igual ese día: dos
  // pedidos de una cafetería no pueden compartirlo
  const alla = obtenerPedidos().filter(
    (otro) => otro.fecha === pedido.fecha && otro.cafeteria === cafeteria,
  );
  const repetido = alla.some((otro) => otro.pin === pedido.pin);
  return guardarCambio({
    ...pedido,
    cafeteria,
    ...(repetido ? { pin: generarPin(alla, pedido.fecha, cafeteria) } : {}),
  });
}
