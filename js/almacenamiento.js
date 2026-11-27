// Guardado local de pedidos y puntos con localStorage.
// Si no está disponible, las funciones devuelven un valor vacío y la app sigue.

const CLAVE_PEDIDOS = "buhogondra.pedidos";
const CLAVE_PUNTOS = "buhogondra.puntos";

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

// Opiniones de un platillo, de la más reciente a la más antigua.
function obtenerOpiniones(platilloId) {
  return OPINIONES_DE_EJEMPLO.filter((opinion) => opinion.platilloId === platilloId).sort(
    (una, otra) => new Date(otra.fecha) - new Date(una.fecha),
  );
}
