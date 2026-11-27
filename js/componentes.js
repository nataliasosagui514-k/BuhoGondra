// Catálogo de la ruta oculta #/componentes (para revisar las variantes y para la defensa).

// Variantes de botón con el texto de ejemplo que usa Figma.
const tiposBoton = [
  { clase: "primario", nombre: "Primario", texto: "Ver menú" },
  { clase: "secundario", nombre: "Secundario", texto: "Iniciar sesión" },
  { clase: "contorno", nombre: "Contorno", texto: "Cancelar" },
  { clase: "texto", nombre: "Texto", texto: "Omitir" },
  { clase: "peligro", nombre: "Peligro", texto: "Eliminar" },
];
const tamanosBoton = [
  { clase: "", nombre: "Grande" }, // es el tamaño por defecto
  { clase: "boton--mediano", nombre: "Mediano" },
  { clase: "boton--pequeno", nombre: "Pequeño" },
];
// Presionado y Foco se fijan con una clase para poder verlos sin tocar.
const estadosBoton = [
  { clase: "", nombre: "Normal" },
  { clase: "es-presionado", nombre: "Presionado" },
  { clase: "", nombre: "Deshabilitado", deshabilitado: true },
  { clase: "es-foco", nombre: "Foco" },
];
const tiposEtiqueta = ["Nuevo", "Combo", "Casero", "Disponible", "Agotado"];
const ejemplosAviso = [
  {
    tipo: "exito",
    nombre: "Éxito",
    titulo: "Horario guardado",
    texto: "Tu pedido se recogerá hoy a las 12:30 p. m. en Cafetería Central.",
  },
  {
    tipo: "error",
    nombre: "Error",
    titulo: "Fuera de horario",
    texto: "Los pedidos se reciben de 8:00 a. m. a 11:00 a. m. Intenta de nuevo mañana.",
  },
];

// Coloca un componente con su nombre debajo.
function crearMuestra(componente, nombre) {
  const muestra = crearElemento("figure", "muestra");
  muestra.append(componente, crearElemento("figcaption", "muestra__nombre", nombre));
  return muestra;
}

// Crea un grupo con subtítulo y sus muestras.
function crearGrupo(titulo, muestras, claseExtra = "") {
  const grupo = crearElemento("section", "catalogo__grupo");
  const rejilla = crearElemento("div", `catalogo__rejilla ${claseExtra}`);
  rejilla.append(...muestras);
  grupo.append(crearElemento("h2", "catalogo__titulo", titulo), rejilla);
  return grupo;
}

function crearBotonDeMuestra(tipo, tamano, estado) {
  const clases = ["boton", `boton--${tipo.clase}`, tamano.clase, estado.clase];
  const boton = crearElemento("button", clases.filter(Boolean).join(" "), tipo.texto);
  boton.type = "button";
  boton.disabled = Boolean(estado.deshabilitado);
  return crearMuestra(boton, `${tipo.nombre} · ${tamano.nombre} · ${estado.nombre}`);
}

// Dibuja todas las variantes dentro del contenedor indicado.
function dibujarCatalogo(contenedor) {
  const gruposBoton = tiposBoton.map((tipo) =>
    crearGrupo(
      `Botón ${tipo.nombre}`,
      tamanosBoton.flatMap((tamano) =>
        estadosBoton.map((estado) => crearBotonDeMuestra(tipo, tamano, estado)),
      ),
    ),
  );

  const etiquetas = tiposEtiqueta.map((nombre) =>
    crearMuestra(
      crearElemento("span", `etiqueta etiqueta--${nombre.toLowerCase()}`, nombre),
      nombre,
    ),
  );

  const avisos = ejemplosAviso.map(({ tipo, nombre, titulo, texto }) =>
    crearMuestra(crearAviso(tipo, titulo, texto), nombre),
  );

  contenedor.querySelector(".catalogo").append(
    crearGrupo("Etiquetas", etiquetas),
    ...gruposBoton,
    crearGrupo("Avisos", avisos, "catalogo__rejilla--una-columna"),
  );
}
