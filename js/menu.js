// Consultas sobre el menú. Solo usan MENU_SEMANA (js/datos.js).

// Devuelve el día cuya fecha ("AAAA-MM-DD") coincide, o null si no existe.
function obtenerMenuDelDia(fecha) {
  return Object.values(MENU_SEMANA).find((dia) => dia.fecha === fecha) ?? null;
}

// Devuelve el platillo con ese id en el menú de esa fecha ("AAAA-MM-DD").
// Es null si ese día no existe o no tiene el platillo.
function obtenerPlatillo(id, fecha) {
  const categorias = obtenerMenuDelDia(fecha)?.categorias ?? [];
  const platillos = categorias.flatMap((categoria) => categoria.platillos);
  return platillos.find((platillo) => platillo.id === id) ?? null;
}

// Busca un platillo en toda la semana, empezando por la fecha preferida.
// Devuelve { platillo, fecha } o null.
function buscarPlatilloEnSemana(id, fechaPreferida) {
  const fechas = [fechaPreferida, ...Object.values(MENU_SEMANA).map((dia) => dia.fecha)];
  const fecha = fechas.find((una) => obtenerPlatillo(id, una));
  return fecha ? { platillo: obtenerPlatillo(id, fecha), fecha } : null;
}

// Fecha más reciente de la semana que tiene menú.
function obtenerUltimaFechaConMenu() {
  return Object.values(MENU_SEMANA)
    .map((dia) => dia.fecha)
    .sort()
    .at(-1);
}
