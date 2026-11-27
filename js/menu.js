// Consultas sobre el menú. Solo usan MENU_SEMANA (js/datos.js).

// Devuelve el día cuya fecha ("AAAA-MM-DD") coincide, o null si no existe.
function obtenerMenuDelDia(fecha) {
  return Object.values(MENU_SEMANA).find((dia) => dia.fecha === fecha) ?? null;
}

// Devuelve el platillo con ese id, o null si no existe.
// Si se repite en la semana, devuelve el del primer día en que aparece.
function obtenerPlatillo(id) {
  const platillos = Object.values(MENU_SEMANA).flatMap((dia) =>
    dia.categorias.flatMap((categoria) => categoria.platillos),
  );
  return platillos.find((platillo) => platillo.id === id) ?? null;
}
