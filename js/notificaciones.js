// Los avisos de una cuenta. No se guardan: salen de sus pedidos y de sus premios. Solo
// se guarda cuáles se vieron (quitan el punto azul de Más) y cuáles se abrieron
// (dejan de verse resaltados). La pantalla está en js/vista-mas.js.

// TODO: Figma no dice desde cuántos días antes un premio está "por vencer"
const DIAS_DE_AVISO_ANTES_DE_VENCER = 2;
const DIAS_DE_ESTA_SEMANA = 7;

// Pedidos apartados para hoy
function crearAvisosDePedidos(pedidos, hoy) {
  return pedidos
    .filter((pedido) => estaEnCurso(pedido, hoy))
    .map((pedido) => {
      const articulos = detallarLineas(pedido.platillos, pedido.fecha);
      const platillo = articulos.length ? titularTicket(articulos) : "pedido";
      const horas = esPedidoMixto(pedido.horaRecogida)
        ? unirEnFrase(Object.values(pedido.horaRecogida).map(formatearHora))
        : formatearHora(pedido.horaRecogida);
      return {
        id: `pedido:${pedido.id}`,
        tipo: "pedido",
        // TODO: Figma muestra "Hace 5 min"; el pedido no guarda a qué hora se apartó
        fecha: pedido.fecha,
        titulo: "Tu pedido estará listo pronto",
        mensaje: `Recoge tu ${platillo} a las ${horas} en ${nombrarCafeteria(pedido.cafeteria)}.`,
        destino: `#/ticket/${pedido.id}`,
      };
    });
}

// Un aviso cuando se alcanza un nivel y otro cuando su premio está por vencer. Un
// premio vencido ya no avisa.
function crearAvisosDePremios(premios, hoy) {
  return premios
    .filter((premio) => premio.disponibleDesde && premio.estado !== "Vencido")
    .flatMap((premio) => {
      const comunes = { tipo: "premio", destino: "#/puntos" };
      const avisos = [
        {
          ...comunes,
          id: `premio:${premio.id}`,
          fecha: premio.disponibleDesde,
          titulo: "¡Tienes un cupón esperándote!",
          mensaje: `Llegaste a ${premio.nivel}. Elige tu premio y pide ya: vence en ${DIAS_PARA_RECOGER_PREMIO} días.`,
        },
      ];
      const desde = sumarDias(premio.venceEl, -DIAS_DE_AVISO_ANTES_DE_VENCER);
      if (hoy >= desde) {
        avisos.push({
          ...comunes,
          id: `vence:${premio.id}`,
          fecha: desde,
          // TODO: Figma no tiene el aviso de premio por vencer; este texto es provisional
          titulo: "Tu premio está por vencer",
          mensaje: `Vence el ${formatearDiaYMes(premio.venceEl)}.`,
        });
      }
      return avisos;
    });
}

// Los avisos de la sesión, del más reciente al más antiguo. Sin sesión no hay.
// TODO: faltan el menú del día, cancelado, no recogido y "a 1 pedido de tu premio"
function obtenerNotificaciones(hoy = obtenerFechaDeHoy()) {
  if (!obtenerSesion()) {
    return [];
  }
  const primerDia = sumarDias(hoy, -DIAS_DE_ESTA_SEMANA);
  return [
    ...crearAvisosDePedidos(listarPedidosConRecogida().reverse(), hoy),
    ...crearAvisosDePremios(obtenerPremiosDeLaSesion(hoy), hoy),
  ]
    .filter((aviso) => aviso.fecha >= primerDia)
    .sort((uno, otro) => otro.fecha.localeCompare(uno.fecha));
}

// { vistas: [ids], leidas: [ids] } de la sesión
function obtenerEstadoDeAvisos() {
  const guardado = obtenerLeidasPorCuenta()[obtenerSesion()?.correo];
  return { vistas: guardado?.vistas ?? [], leidas: guardado?.leidas ?? [] };
}

// "lista" es "vistas" o "leidas"
function marcarAvisos(lista, ids) {
  const correo = obtenerSesion()?.correo;
  if (!correo) {
    return false;
  }
  const estado = obtenerEstadoDeAvisos();
  return guardarLeidasPorCuenta({
    ...obtenerLeidasPorCuenta(),
    [correo]: { ...estado, [lista]: [...new Set([...estado[lista], ...ids])] },
  });
}

function hayAvisosSinVer() {
  const { vistas } = obtenerEstadoDeAvisos();
  return obtenerNotificaciones().some((aviso) => !vistas.includes(aviso.id));
}
