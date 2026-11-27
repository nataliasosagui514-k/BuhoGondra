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

/* ---------- Líneas del pedido ---------- */

// El valor por defecto de cada grupo que lo tiene: { guarnicion: "Arroz", … }
function obtenerOpcionesPorDefecto(platillo) {
  return Object.fromEntries(
    (platillo.opciones ?? [])
      .filter((grupo) => grupo.porDefecto)
      .map((grupo) => [grupo.id, grupo.porDefecto]),
  );
}
