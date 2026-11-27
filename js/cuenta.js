// Reglas de cuenta de BúhoGondra: tipo de correo, códigos, contraseñas y sesión.
// Las pantallas están en js/vista-cuenta.js.
//
// Es un modo de demostración sin servidor: las cuentas viven en este navegador y el
// código de verificación se muestra en la pantalla y en la consola. No protege como un
// servidor real.

// Todas las cuentas van en una sola clave: { correo: datos de la cuenta }
const CLAVE_CUENTAS = "buhogondra.cuentas";
const MINIMO_CONTRASENA = 8;
const MINUTOS_DEL_CODIGO = 10;
const CANTIDAD_DE_BUHOS = 6;
const INTENTOS_PARA_AVISAR = 5;

/* ---------- Correo ---------- */

function normalizarCorreo(correo) {
  return String(correo ?? "").trim().toLowerCase();
}

// "estudiante" (8 dígitos antes de la @), "docente" (solo letras), "otro-formato"
// (otro correo UCA) o "no-uca".
function detectarTipoCorreo(correo) {
  const partes = /^([^\s@]+)@uca\.edu\.sv$/.exec(normalizarCorreo(correo));
  if (!partes) {
    return "no-uca";
  }
  if (/^\d{8}$/.test(partes[1])) {
    return "estudiante";
  }
  return /^[a-z]+$/.test(partes[1]) ? "docente" : "otro-formato";
}

/* ---------- Contraseñas ---------- */

function aHexadecimal(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// La sal es un texto al azar distinto en cada cuenta: así dos contraseñas iguales
// no dan el mismo hash.
function crearSal() {
  return aHexadecimal(crypto.getRandomValues(new Uint8Array(16)));
}

// SHA-256 de la sal y la contraseña. Devuelve null si el navegador no ofrece la Web
// Crypto API (pasa en una dirección http que no sea localhost).
async function calcularHash(contraseña, sal) {
  if (!globalThis.crypto?.subtle) {
    return null;
  }
  const datos = new TextEncoder().encode(`${sal}:${contraseña}`);
  return aHexadecimal(new Uint8Array(await crypto.subtle.digest("SHA-256", datos)));
}

// La sal y el hash que se guardan en lugar de la contraseña, o null si no se pueden calcular.
async function protegerContrasena(contraseña) {
  if (!globalThis.crypto?.getRandomValues) {
    return null;
  }
  const sal = crearSal();
  const hash = await calcularHash(contraseña, sal);
  return hash && { sal, hash };
}

/* ---------- Cuentas ---------- */

function obtenerCuentas() {
  const cuentas = leerDato(CLAVE_CUENTAS);
  return cuentas && typeof cuentas === "object" && !Array.isArray(cuentas) ? cuentas : {};
}

// La cuenta de un correo, o null si no existe.
function obtenerCuenta(correo) {
  const cuentas = obtenerCuentas();
  const clave = normalizarCorreo(correo);
  return Object.hasOwn(cuentas, clave) ? cuentas[clave] : null;
}

function guardarCuenta(correo, cuenta) {
  return escribirDato(CLAVE_CUENTAS, { ...obtenerCuentas(), [correo]: cuenta });
}

// Cómo se muestra el autor de una opinión. El correo nunca se muestra.
// TODO: Figma solo muestra nombres de ejemplo; "Tú" y la inicial del apellido se decidieron aquí
function nombrarAutor(autor) {
  if (autor === obtenerSesion()?.correo) {
    return "Tú";
  }
  const cuenta = obtenerCuenta(autor);
  return cuenta ? `${cuenta.nombre} ${cuenta.apellido.charAt(0)}.` : autor;
}

// La sesión guarda solo el correo, el tipo, el búho y la fecha de inicio.
function abrirSesion(correo, { tipo, buho }) {
  const sesion = { correo, tipo, buho, inicio: new Date().toISOString() };
  return escribirDato(CLAVE_SESION, sesion) ? sesion : null;
}

// Crea la cuenta y abre su sesión. Se llama al tocar "Aceptar y continuar".
// Devuelve { ok: true, sesion } o { ok: false, motivo }.
async function crearCuenta(correo, contraseña, buho, { nombre = "", apellido = "" } = {}) {
  const clave = normalizarCorreo(correo);
  const tipoCorreo = detectarTipoCorreo(clave);
  if (tipoCorreo === "no-uca") {
    return { ok: false, motivo: "no-uca" };
  }
  if (obtenerCuenta(clave)) {
    return { ok: false, motivo: "ya-existe" };
  }
  const completos =
    typeof contraseña === "string" &&
    contraseña.length >= MINIMO_CONTRASENA &&
    Number.isInteger(buho) &&
    buho >= 1 &&
    buho <= CANTIDAD_DE_BUHOS &&
    nombre.trim() &&
    apellido.trim();
  if (!completos) {
    return { ok: false, motivo: "datos" };
  }
  const protegida = await protegerContrasena(contraseña);
  if (!protegida) {
    return { ok: false, motivo: "sin-guardado" };
  }
  const cuenta = {
    // Con otro formato la cuenta queda sin tipo (Figma 964:4588)
    tipo: tipoCorreo === "otro-formato" ? null : tipoCorreo,
    buho,
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    ...protegida,
    // TODO: Figma pide guardar fecha y versión de los Términos; todavía no hay versión
    terminosAceptados: new Date().toISOString(),
  };
  const sesion = guardarCuenta(clave, cuenta) && abrirSesion(clave, cuenta);
  return sesion ? { ok: true, sesion } : { ok: false, motivo: "sin-guardado" };
}

/* ---------- Inicio y cierre de sesión ---------- */

// La sesión abierta ({ correo, tipo, buho, inicio }), o null. Solo vale si su cuenta existe.
function obtenerSesion() {
  const sesion = leerDato(CLAVE_SESION);
  return typeof sesion?.correo === "string" && obtenerCuenta(sesion.correo) ? sesion : null;
}

function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Sin almacenamiento no hay sesión que borrar
  }
}

// Al abrir la app se borra una sesión sin cuenta, como la de prueba de la fase de Puntos
if (leerDato(CLAVE_SESION) && !obtenerSesion()) {
  borrarSesion();
}

// Intentos con datos incorrectos desde que se abrió la app
let intentosFallidos = 0;

// Devuelve { ok: true, sesion } o { ok: false, motivo, intentos }. El motivo
// "credenciales" no dice si falló el correo o la contraseña (Figma 1412:10004).
async function iniciarSesion(correo, contraseña) {
  const clave = normalizarCorreo(correo);
  const cuenta = obtenerCuenta(clave);
  // El hash se calcula aunque no haya cuenta
  const hash = await calcularHash(contraseña, cuenta?.sal ?? "");
  if (!hash) {
    return { ok: false, motivo: "sin-guardado" };
  }
  if (!cuenta || hash !== cuenta.hash) {
    intentosFallidos += 1;
    return { ok: false, motivo: "credenciales", intentos: intentosFallidos };
  }
  const sesion = abrirSesion(clave, cuenta);
  if (!sesion) {
    return { ok: false, motivo: "sin-guardado" };
  }
  intentosFallidos = 0;
  return { ok: true, sesion };
}

// Borra la sesión y el pedido que se estaba armando. Las cuentas, los pedidos y los
// premios se conservan.
function cerrarSesion() {
  borrarSesion();
  borrarPedidoEnCurso();
}

/* ---------- Cambios de la cuenta (desde Perfil) ---------- */

// La sesión y su cuenta, o null sin sesión.
function obtenerCuentaDeLaSesion() {
  const sesion = obtenerSesion();
  return sesion && { sesion, cuenta: obtenerCuenta(sesion.correo) };
}

function actualizarCuentaDeLaSesion(cambios) {
  const actual = obtenerCuentaDeLaSesion();
  return Boolean(actual) && guardarCuenta(actual.sesion.correo, { ...actual.cuenta, ...cambios });
}

function cambiarNombre(nombre, apellido) {
  return Boolean(nombre.trim() && apellido.trim()) &&
    actualizarCuentaDeLaSesion({ nombre: nombre.trim(), apellido: apellido.trim() });
}

// El búho va en la cuenta y en la sesión.
function cambiarBuho(buho) {
  if (!Number.isInteger(buho) || buho < 1 || buho > CANTIDAD_DE_BUHOS) {
    return false;
  }
  return actualizarCuentaDeLaSesion({ buho }) &&
    escribirDato(CLAVE_SESION, { ...obtenerSesion(), buho });
}

// Compara los hashes: la contraseña guardada no existe en texto.
async function coincideContrasena(cuenta, contraseña) {
  const hash = await calcularHash(contraseña, cuenta.sal);
  return Boolean(hash) && hash === cuenta.hash;
}

// Devuelve { ok: true } o { ok: false, motivo }.
async function cambiarContrasena(contraseñaActual, nueva) {
  const actual = obtenerCuentaDeLaSesion();
  if (!actual || !(await coincideContrasena(actual.cuenta, contraseñaActual))) {
    return { ok: false, motivo: "actual" };
  }
  if (nueva.length < MINIMO_CONTRASENA) {
    return { ok: false, motivo: "datos" };
  }
  const protegida = await protegerContrasena(nueva);
  return protegida && actualizarCuentaDeLaSesion(protegida)
    ? { ok: true }
    : { ok: false, motivo: "sin-guardado" };
}

// Cambia el correo, cuyo código se acaba de verificar. El tipo de cuenta sale del
// correo nuevo y los pedidos, premios y opiniones pasan con él.
function cambiarCorreo(nuevo) {
  const actual = obtenerCuentaDeLaSesion();
  const clave = normalizarCorreo(nuevo);
  const tipoCorreo = detectarTipoCorreo(clave);
  if (!actual || correoVerificado !== clave || tipoCorreo === "no-uca" || obtenerCuenta(clave)) {
    return false;
  }
  const { sesion, cuenta } = actual;
  const { [sesion.correo]: anterior, ...otras } = obtenerCuentas();
  const tipo = tipoCorreo === "otro-formato" ? null : tipoCorreo;
  if (!escribirDato(CLAVE_CUENTAS, { ...otras, [clave]: { ...cuenta, tipo } })) {
    return false;
  }
  correoVerificado = null;
  cambiarAutor(sesion.correo, clave);
  return escribirDato(CLAVE_SESION, { ...sesion, correo: clave, tipo });
}

function listarPedidosEnCurso() {
  return listarPedidosConRecogida().filter((pedido) => estaEnCurso(pedido));
}

// Borra para siempre la cuenta y todo lo suyo, y cierra la sesión. No se puede con
// pedidos en curso. Devuelve { ok: true } o { ok: false, motivo }.
async function eliminarCuenta(contraseña) {
  const actual = obtenerCuentaDeLaSesion();
  if (!actual || !(await coincideContrasena(actual.cuenta, contraseña))) {
    return { ok: false, motivo: "contrasena" };
  }
  if (listarPedidosEnCurso().length) {
    return { ok: false, motivo: "pedidos" };
  }
  const { [actual.sesion.correo]: borrada, ...otras } = obtenerCuentas();
  if (!borrarDatosDeAutor(actual.sesion.correo) || !escribirDato(CLAVE_CUENTAS, otras)) {
    return { ok: false, motivo: "sin-guardado" };
  }
  cerrarSesion();
  return { ok: true };
}

/* ---------- Códigos de verificación ---------- */

// Solo hay un código activo y vive en memoria: no se guarda y se pierde al recargar
let codigoActivo = null;
let correoVerificado = null;

// Seis dígitos al azar
function crearCodigo() {
  const [numero] = crypto.getRandomValues(new Uint32Array(1));
  return String(numero % 1000000).padStart(6, "0");
}

// Genera un código nuevo (el anterior deja de servir) y lo "envía" a la consola.
function generarCodigo(correo = "", ahora = Date.now()) {
  const codigo = crearCodigo();
  codigoActivo = {
    codigo,
    correo: normalizarCorreo(correo),
    vence: ahora + MINUTOS_DEL_CODIGO * 60000,
  };
  correoVerificado = null;
  // Modo de demostración: la app no envía correos (ver el README)
  console.info(
    `BúhoGondra (demostración) · Código para ${codigoActivo.correo}: ${codigo}. Vence en ${MINUTOS_DEL_CODIGO} minutos.`,
  );
  return codigo;
}

function descartarCodigo() {
  codigoActivo = null;
  correoVerificado = null;
}

// Devuelve true si el código es el activo y no ha vencido. Cada código sirve una vez.
function verificarCodigo(codigo, ahora = Date.now()) {
  if (!codigoActivo || ahora >= codigoActivo.vence || codigo !== codigoActivo.codigo) {
    return false;
  }
  correoVerificado = codigoActivo.correo;
  codigoActivo = null;
  return true;
}

/* ---------- Recuperar la contraseña ---------- */

// Solo se "envía" el código cuando el correo tiene cuenta. En modo de demostración
// se muestra en pantalla, así que su ausencia deja ver que no hay cuenta.
function enviarCodigoDeRecuperacion(correo) {
  if (obtenerCuenta(correo)) {
    generarCodigo(correo);
  } else {
    descartarCodigo();
  }
}

// Cambia la contraseña de un correo cuyo código se acaba de verificar.
async function restablecerContrasena(correo, nueva) {
  const clave = normalizarCorreo(correo);
  const cuenta = obtenerCuenta(clave);
  if (!cuenta || correoVerificado !== clave || nueva.length < MINIMO_CONTRASENA) {
    return false;
  }
  const protegida = await protegerContrasena(nueva);
  if (!protegida || !guardarCuenta(clave, { ...cuenta, ...protegida })) {
    return false;
  }
  correoVerificado = null;
  intentosFallidos = 0;
  // Si había una sesión abierta, se cierra: hay que entrar con la contraseña nueva
  cerrarSesion();
  return true;
}
