// Guardado local de pedidos, premios y opiniones con localStorage. La sesión y las
// cuentas se manejan en js/cuenta.js.
// Si no está disponible, las funciones devuelven un valor vacío y la app sigue.

const CLAVE_PEDIDOS = "buhogondra.pedidos";
const CLAVE_SESION = "buhogondra.sesion";
const CLAVE_PREMIOS = "buhogondra.premios";
const CLAVE_OPINIONES = "buhogondra.opiniones";
const CLAVE_LEIDAS = "buhogondra.notificacionesLeidas";
const CLAVE_REPORTES = "buhogondra.reportes";

// Lee un valor guardado; devuelve null si no existe o no se puede leer.
function leerDato(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave));
  } catch {
    return null;
  }
}

// Guarda un valor; devuelve true si lo logró.
function escribirDato(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

// Devuelve la lista de pedidos guardados (vacía si no hay).
function obtenerPedidos() {
  const pedidos = leerDato(CLAVE_PEDIDOS);
  return Array.isArray(pedidos) ? pedidos : [];
}

// Reemplaza el pedido que tiene el mismo id y autor. Devuelve true si se guardó.
function actualizarPedido(cambiado) {
  const pedidos = obtenerPedidos();
  const esEse = (pedido) => pedido.id === cambiado.id && pedido.autor === cambiado.autor;
  return (
    pedidos.some(esEse) &&
    escribirDato(CLAVE_PEDIDOS, pedidos.map((pedido) => (esEse(pedido) ? cambiado : pedido)))
  );
}

// Agrega un pedido a la lista. Devuelve el pedido, o null si no se guardó.
// Guarda lo que recibe: quien lo llame debe enviar solo datos del diseño.
function guardarPedido(pedido) {
  if (!pedido) {
    return null;
  }
  return escribirDato(CLAVE_PEDIDOS, [...obtenerPedidos(), pedido]) ? pedido : null;
}

/* ---------- Premios ---------- */

// Los premios que ya se canjearon: { id, autor, pin, disponibleDesde }. Los puntos no
// se guardan: se calculan con los pedidos (js/puntos.js).
function obtenerPremiosCanjeados() {
  const premios = leerDato(CLAVE_PREMIOS);
  return Array.isArray(premios) ? premios : [];
}

// Reemplaza la lista completa. Devuelve true si se guardó.
function guardarPremiosCanjeados(premios) {
  return escribirDato(CLAVE_PREMIOS, premios);
}

// Devuelve lo guardado, o null si no se pudo guardar.
function guardarPremioCanjeado(premio) {
  return escribirDato(CLAVE_PREMIOS, [...obtenerPremiosCanjeados(), premio]) ? premio : null;
}

/* ---------- Notificaciones leídas ---------- */

// Solo se guarda qué avisos se vieron y cuáles se abrieron: { correo: { vistas, leidas } }.
// Los avisos no se guardan, salen de los pedidos y premios (js/notificaciones.js).
function obtenerLeidasPorCuenta() {
  const leidas = leerDato(CLAVE_LEIDAS);
  return leidas && typeof leidas === "object" && !Array.isArray(leidas) ? leidas : {};
}

function guardarLeidasPorCuenta(leidas) {
  return escribirDato(CLAVE_LEIDAS, leidas);
}

/* ---------- Datos de una cuenta ---------- */

// Todo lo que lleva el correo de su autor: pedidos, premios y opiniones.
const CLAVES_CON_AUTOR = [CLAVE_PEDIDOS, CLAVE_PREMIOS, CLAVE_OPINIONES];

function reescribirDatosDeAutor(cambiar) {
  return CLAVES_CON_AUTOR.every((clave) => {
    const lista = leerDato(clave);
    return !Array.isArray(lista) || escribirDato(clave, cambiar(lista));
  });
}

// Al cambiar de correo, sus datos pasan al nuevo.
function cambiarAutor(anterior, nuevo) {
  const datos = reescribirDatosDeAutor((lista) =>
    lista.map((uno) => (uno?.autor === anterior ? { ...uno, autor: nuevo } : uno)),
  );
  const { [anterior]: leidas, ...otras } = obtenerLeidasPorCuenta();
  return datos && (!leidas || escribirDato(CLAVE_LEIDAS, { ...otras, [nuevo]: leidas }));
}

// Al eliminar una cuenta se borra todo lo suyo.
function borrarDatosDeAutor(autor) {
  const datos = reescribirDatosDeAutor((lista) => lista.filter((uno) => uno?.autor !== autor));
  const { [autor]: leidas, ...otras } = obtenerLeidasPorCuenta();
  return datos && (!leidas || escribirDato(CLAVE_LEIDAS, otras));
}

/* ---------- Reportes ---------- */

// Los reportes de "Problemas con mi cuenta": { nombre, correo, mensaje, fecha }.
// Devuelve true si se guardó.
function guardarReporte(reporte) {
  const reportes = leerDato(CLAVE_REPORTES);
  return escribirDato(CLAVE_REPORTES, [...(Array.isArray(reportes) ? reportes : []), reporte]);
}

/* ---------- Pedido en curso y selección ---------- */

const CLAVE_PEDIDO_EN_CURSO = "buhogondra.pedidoEnCurso";
const CLAVE_SELECCION = "buhogondra.seleccion";

// Los platillos que ya se agregaron al pedido que se está armando. Solo vale hoy.
function obtenerPedidoEnCurso() {
  const enCurso = leerDato(CLAVE_PEDIDO_EN_CURSO);
  return enCurso?.fecha === obtenerFechaDeHoy() && Array.isArray(enCurso.platillos)
    ? enCurso.platillos
    : [];
}

function guardarPedidoEnCurso(platillos) {
  return escribirDato(CLAVE_PEDIDO_EN_CURSO, { fecha: obtenerFechaDeHoy(), platillos });
}

// El platillo que se está apartando y todavía no se agregó ni se confirmó. Se guarda
// solo mientras la pestaña esté abierta, para que no se pierda al recargar.
function obtenerSeleccion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SELECCION));
  } catch {
    return null;
  }
}

function guardarSeleccion(linea) {
  try {
    sessionStorage.setItem(CLAVE_SELECCION, JSON.stringify(linea));
  } catch {
    // Sin almacenamiento, la pantalla usa las opciones por defecto
  }
}

function borrarPedidoEnCurso() {
  try {
    localStorage.removeItem(CLAVE_PEDIDO_EN_CURSO);
    sessionStorage.removeItem(CLAVE_SELECCION);
  } catch {
    // Sin almacenamiento no hay nada que borrar
  }
}

/* ---------- Opiniones ---------- */

const MAXIMO_CARACTERES_OPINION = 200;

// Una opinión sirve si tiene platillo, autor, de 1 a 5 estrellas, texto corto y fecha.
function esOpinionValida(opinion) {
  return Boolean(
    opinion &&
      typeof opinion.platilloId === "string" &&
      typeof opinion.autor === "string" &&
      Number.isInteger(opinion.calificacion) &&
      opinion.calificacion >= 1 &&
      opinion.calificacion <= 5 &&
      typeof opinion.texto === "string" &&
      opinion.texto.length <= MAXIMO_CARACTERES_OPINION &&
      !Number.isNaN(Date.parse(opinion.fecha)),
  );
}

// Las opiniones escritas en este teléfono (sin las de ejemplo).
function obtenerOpinionesGuardadas() {
  const opiniones = leerDato(CLAVE_OPINIONES);
  return Array.isArray(opiniones) ? opiniones.filter(esOpinionValida) : [];
}

// Las opiniones de ejemplo, con la fecha contada hacia atrás desde ahora.
function fecharOpinionesDeEjemplo(ahora = new Date()) {
  return OPINIONES_DE_EJEMPLO.map(({ haceDias, ...opinion }) => {
    const fecha = new Date(ahora.getTime());
    fecha.setDate(fecha.getDate() - haceDias);
    return { ...opinion, fecha: fecha.toISOString() };
  });
}

// Opiniones de un platillo (guardadas y de ejemplo), de la más reciente a la más antigua.
function obtenerOpiniones(platilloId) {
  return [...obtenerOpinionesGuardadas(), ...fecharOpinionesDeEjemplo()]
    .filter((opinion) => opinion.platilloId === platilloId)
    .sort((una, otra) => new Date(otra.fecha) - new Date(una.fecha));
}

// La opinión de la sesión sobre un platillo, o null si no hay sesión o no la ha escrito.
function obtenerMiOpinion(platilloId) {
  const correo = obtenerSesion()?.correo;
  return (
    obtenerOpinionesGuardadas().find(
      (opinion) => opinion.platilloId === platilloId && opinion.autor === correo,
    ) ?? null
  );
}

// Guarda una opinión. Cada persona tiene una sola por platillo: la nueva reemplaza
// a la anterior. Solo se guardan estos cinco datos. Devuelve null si no se guardó.
function guardarOpinion({ platilloId, autor, calificacion, texto, fecha }) {
  const opinion = { platilloId, autor, calificacion, texto, fecha };
  if (!esOpinionValida(opinion)) {
    return null;
  }
  const otras = obtenerOpinionesGuardadas().filter(
    (una) => !(una.platilloId === platilloId && una.autor === autor),
  );
  return escribirDato(CLAVE_OPINIONES, [...otras, opinion]) ? opinion : null;
}
