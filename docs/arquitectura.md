# Arquitectura

## En un párrafo

BúhoGondra es **una sola página HTML** (`index.html`) que cambia de pantalla según la parte de la dirección que va después del **`#`** (por ejemplo, `#/menu` o `#/puntos`): `js/app.js` escucha el evento `hashchange`, busca la ruta, copia en la zona de contenido una plantilla `<template>` de `index.html` y llama a la función que dibuja esa pantalla. El menú, las cafeterías, los horarios y los niveles de puntos están escritos en **`js/datos.js`**. Lo que genera cada persona (cuentas, sesión, pedidos, premios, opiniones y reportes) se guarda en **`localStorage`**, casi siempre mediante `js/almacenamiento.js`. Los cálculos y reglas principales están separados de las pantallas: **`js/pedido.js`** (dinero, descuento, PIN, horarios y líneas del pedido), **`js/puntos.js`** (puntos, niveles y premios) y **`js/cuenta.js`** (tipo de correo, contraseñas, códigos y sesión); las reglas del chat están en `js/chatbot.js` y las de los avisos en `js/notificaciones.js`. Los archivos `js/vista-*.js` dibujan las pantallas y responden a lo que toca la persona. No hay servidor.

## Cómo se carga

Son scripts normales, no módulos: comparten el mismo espacio global, así que una función de un archivo se puede usar en otro. `index.html` los carga en este orden:

```text
componentes → datos → almacenamiento → cuenta → menu → pedido → puntos →
notificaciones → chatbot → vista-menu → vista-comentarios → vista-pedido →
vista-puntos → vista-cuenta → vista-mas → vista-chatbot → app
```

`app.js` va al final porque su tabla de rutas usa lo que definen los anteriores.

## Cómo se conectan

```text
index.html  (barra de navegación + <template> de pantallas)
   │  carga css/estilos.css y los archivos de js/
   ▼
js/app.js   dirección (#) → tabla de rutas → función "dibujar…"
   ▼
PANTALLAS   js/vista-*.js
   │  piden datos y cálculos, y cambian el HTML (DOM)
   ▼
REGLAS      js/menu.js · js/pedido.js · js/puntos.js
            js/cuenta.js · js/chatbot.js · js/notificaciones.js
   │                              │
   ▼                              ▼
js/datos.js                 js/almacenamiento.js
(datos fijos:                     │
 menú, cafeterías,                ▼
 horarios, niveles)     localStorage / sessionStorage
                        (datos de la persona)
```

Una excepción: `js/cuenta.js` borra la sesión usando `localStorage` directamente (función `borrarSesion`).

### Ejemplo: apartar un platillo

1. En la dirección queda `#/apartar/ID` → `app.js` llama a `dibujarApartar` (`vista-pedido.js`).
2. La pantalla pregunta a `pedido.js` si está abierto (`estaAbiertoApartar`) y qué horas mostrar (`crearHorasDeRecogida`).
3. La revisión calcula lo que se paga con `calcularCobro`.
4. Al confirmar, `confirmarPedido` llama a `crearPedido` (`pedido.js`) y a `guardarPedido` (`almacenamiento.js`).
5. La app va a `#/ticket/PEDIDO`.
6. Después, `puntos.js` calcula los puntos leyendo los pedidos guardados.

## Archivos de `js/`

| Archivo | Qué hace |
|---|---|
| `app.js` | Navegación por `#`, tabla de rutas y funciones comunes (`crearElemento`, `mostrarAviso`). |
| `datos.js` | Datos fijos: menú del 23 al 27 de noviembre, rutas de las fotos, cafeterías, horarios, niveles de puntos y opiniones de ejemplo. |
| `almacenamiento.js` | Lee y escribe pedidos, premios, opiniones, reportes, avisos leídos y el pedido que se está armando. |
| `cuenta.js` | Tipo de correo, hash de contraseñas, cuentas, sesión y códigos de verificación. |
| `menu.js` | Busca el menú de un día y un platillo. |
| `pedido.js` | Cálculos del pedido: total, descuento, PIN, número, horarios (incluido `?hora=`) y líneas. |
| `puntos.js` | Calcula puntos, niveles y premios; canjea premios. |
| `notificaciones.js` | Arma los avisos a partir de los pedidos y premios. |
| `chatbot.js` | Reglas del chat: qué pedido está activo y cómo cancelarlo o cambiarlo. |
| `vista-menu.js` | Menú de hoy, menú de la semana y detalle; tarjetas y fotos de platillos (`crearFoto`). |
| `vista-comentarios.js` | Pantallas para ver y escribir opiniones. |
| `vista-pedido.js` | Acompañamientos, hora y cafetería, revisión, confirmación y ticket. |
| `vista-puntos.js` | Pantallas de puntos, ayuda y premio canjeado. |
| `vista-cuenta.js` | Splash, inicio de sesión, registro, recuperación y ventana para invitados. |
| `vista-mas.js` | Panel «Más», perfil, historial, notificaciones, cotizar, sobre Funda Gondra y ayuda. |
| `vista-chatbot.js` | Botón ChatBot y conversación con Búhi. |
| `componentes.js` | Catálogo de botones, etiquetas y avisos de la ruta oculta `#/componentes`. |
