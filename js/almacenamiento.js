// Guardado local de pedidos, puntos y opiniones con localStorage.
// Si no está disponible, las funciones devuelven un valor vacío y la app sigue.

const CLAVE_PEDIDOS = "buhogondra.pedidos";
const CLAVE_PUNTOS = "buhogondra.puntos";
const CLAVE_OPINIONES = "buhogondra.opiniones";

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

// Agrega un pedido a la lista. Devuelve el pedido, o null si no se guardó.
// Guarda lo que recibe: quien lo llame debe enviar solo datos del diseño.
function guardarPedido(pedido) {
  if (!pedido) {
    return null;
  }
  return escribirDato(CLAVE_PEDIDOS, [...obtenerPedidos(), pedido]) ? pedido : null;
}

// Devuelve el total de puntos guardado (0 si no hay).
function obtenerPuntos() {
  const puntos = leerDato(CLAVE_PUNTOS);
  return Number.isInteger(puntos) && puntos >= 0 ? puntos : 0;
}

// Reemplaza el total de puntos. Devuelve la cantidad, o null si no se guardó.
function guardarPuntos(cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    return null;
  }
  return escribirDato(CLAVE_PUNTOS, cantidad) ? cantidad : null;
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

// TODO: sin sesión, el autor es "Tú". La revisión de sesión y de persona invitada
// (que solo puede leer) se hace en la fase de Registro.
const AUTOR_SIN_SESION = "Tú";
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

// La opinión propia sobre un platillo, o null si todavía no la ha escrito.
function obtenerMiOpinion(platilloId) {
  return (
    obtenerOpinionesGuardadas().find(
      (opinion) => opinion.platilloId === platilloId && opinion.autor === AUTOR_SIN_SESION,
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
