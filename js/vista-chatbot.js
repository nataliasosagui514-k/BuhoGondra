// Pantallas del chatbot y el botón que lo abre. Aquí no se cambian pedidos: eso lo
// hacen las funciones de js/chatbot.js.

/* ---------- Botón ChatBot y burbuja de ayuda (Figma 1526:11315) ---------- */

// Componente "Burbuja de ayuda" (Figma 1792:4731), con el tamaño que tiene en M1c:
// el cuerpo y la cola que apunta al botón
const FORMA_DE_LA_BURBUJA =
  "M12.33 0H114.67C117.94 0 121.08 1.09 123.39 3.04C125.7 4.98 127 7.62 127 10.37" +
  "C127 13.12 125.7 15.76 123.39 17.7C121.08 19.65 117.94 20.74 114.67 20.74H109.74" +
  "L109.74 28L100.49 20.74H12.33C9.06 20.74 5.92 19.65 3.61 17.7C1.3 15.76 0 13.12 0 10.37" +
  "C0 7.62 1.3 4.98 3.61 3.04C5.92 1.09 9.06 0 12.33 0Z";

// Componente "Botón del chatbot" (Figma 839:2584)
const ICONO_DEL_CHATBOT = [
  [
    1.67,
    1.67,
    "M3.33 0H13.33C14.22 0 15.07 0.35 15.69 0.98C16.32 1.6 16.67 2.45 16.67 3.33V9.17" +
      "C16.67 10.05 16.32 10.9 15.69 11.52C15.07 12.15 14.22 12.5 13.33 12.5H9.17" +
      "L6.25 15.83V12.5H3.33C2.45 12.5 1.6 12.15 0.98 11.52C0.35 10.9 0 10.05 0 9.17" +
      "V3.33C0 2.45 0.35 1.6 0.98 0.98C1.6 0.35 2.45 0 3.33 0Z",
  ],
  [6.5, 7.33, "M0 0H7L6.42 3.67H0.58Z"],
  [8.17, 5.5, "M0 1.83C0 1.35 0.19 0.88 0.54 0.54C0.88 0.19 1.35 0 1.83 0C2.32 0 2.79 0.19 3.13 0.54C3.47 0.88 3.67 1.35 3.67 1.83"],
];

// Un solo enlace: tocar la burbuja o el botón abre el chat
function crearAccesoAlChat() {
  const forma = crearIconoSvg("ayuda-chat__forma", 28, [FORMA_DE_LA_BURBUJA]);
  forma.setAttribute("viewBox", "0 0 127 28");
  const burbuja = crearElemento("span", "ayuda-chat__burbuja");
  burbuja.append(forma, crearElemento("span", "ayuda-chat__texto", "Ayuda con el pedido"));

  const boton = crearElemento("span", "ayuda-chat__boton");
  boton.append(crearIconoSvg("ayuda-chat__icono", 20, ICONO_DEL_CHATBOT), "ChatBot");

  const enlace = crearElemento("a", "ayuda-chat");
  enlace.href = "#/chatbot";
  enlace.append(burbuja, boton);
  return enlace;
}

// En Menú de hoy: solo si hay un pedido activo (nota de Figma 1526:11407)
function mostrarAccesoAlChat(contenedor) {
  if (!obtenerPedidoActivo()) {
    return;
  }
  const menu = contenedor.querySelector(".menu");
  menu.classList.add("menu--con-chat");
  menu.append(crearAccesoAlChat());
}
