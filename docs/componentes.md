# Componentes de BúhoGondra frente a Figma

Archivo de Figma: `i4xYOLLxPkZxfIX0F8fzZg`. Para revisar etiquetas, botones y avisos, abre `index.html#/componentes`.

**Estados de implementación**

- **Hecho:** está programado a partir del nodo de Figma indicado.
- **Pendiente:** todavía no está programado.
- **TODO de color:** está programado, pero Figma no define uno de sus colores.

Un guion (—) en el id significa que no se encontró un componente para esa variante.

## Barra de navegación y chatbot

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Barra de navegación | Menú activo | Normal | `839:2518` | Hecho |
| Barra de navegación | Puntos activo | Normal | `839:2534` | Hecho |
| Barra de navegación | Más activo | Normal | `839:2550` | Hecho |
| Barra de navegación | Con aviso en Más | Normal | `1112:4696` (punto de aviso) | Hecho (también en la fila Notificaciones) |
| Botón del chatbot | Sin aviso | Normal | `839:2567` | Hecho (`crearAccesoAlChat`, solo en Menú de hoy con pedido activo) |
| Botón del chatbot | Con aviso | Con aviso | `839:2575` | Pendiente |
| Burbuja de ayuda | — | Normal | `1792:4731` | Hecho, con el tamaño de M1c (`1526:11315`) |
| Respuesta rápida del chat | — | Normal | sección `1010:4869` | Hecho (`crearRespuesta`) |

## Encabezado y botones de un icono

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Encabezado | Interno: volver y título | Normal | `1010:4871`, `1051:5423` | Hecho |
| Encabezado | Pestaña: título (Puntos) | Normal | `1003:4399` | Hecho |
| Encabezado | Pestaña: enlace «¿Cómo funciona?» | Normal | `1003:4401` | Pendiente |
| Encabezado | Menú: fecha, subtítulo y calendario | Normal | `1526:11316` | Parcial: sin subtítulo |
| Botón de volver | En encabezado (relleno gris) | Normal | `1027:6547` | Hecho |
| Botón de volver | En encabezado | Presionado | `905:4403` | Hecho |
| Botón de volver | Flotante (relleno blanco) | Normal | `905:4400` | Pendiente |
| Botón de icono | Flotante | Normal | `1173:4653` | Hecho (calendario del Menú) |
| Botón de icono | Flotante | Presionado | `1173:4655` | Pendiente |
| Panel «Más» | Panel lateral | Abierto | `1050:4983` | Hecho (`crearPanel` en `js/vista-mas.js`) |

## Etiquetas

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Etiqueta | Nuevo | Normal | — (solo color de acento, `507:377`) | TODO de color |
| Etiqueta | Combo | Normal | — (solo color de acento, `507:367`) | TODO de color |
| Etiqueta | Casero | Normal | — (solo color de acento, `507:372`) | TODO de color |
| Etiqueta | Disponible | Normal | `820:2416` | Hecho |
| Etiqueta | Agotado | Normal | `820:2419` | Hecho |
| Etiqueta | Calificación | Normal | `820:2412` | Hecho en detalle y comentarios (aún no aparece en #/componentes) |
| Etiqueta | Entregado | Normal | `820:2422` | Hecho en Historial (`crearEtiquetaDeEstado`; aún no aparece en #/componentes) |
| Etiqueta | Cancelado | Normal | `820:2426` | Hecho en Historial y ticket, con las medidas de 51c (aún no aparece en #/componentes) |
| Etiqueta | Menú actualizado | Normal | `870:2946` | Pendiente |
| Etiqueta | Menú desactualizado | Normal | `870:2950` | Pendiente |
| Etiqueta | En curso | Normal | `905:4103` | Hecho en Historial (`crearEtiquetaDeEstado`; aún no aparece en #/componentes) |
| Etiqueta | No recogido | Normal | `905:4106` | Pendiente |
| Etiqueta | Estudiante | Normal | `963:4600` | Hecho en «Crea tu cuenta» (aún no aparece en #/componentes) |
| Etiqueta | Docente o empleado | Normal | `963:4606` | Hecho en «Crea tu cuenta» (aún no aparece en #/componentes) |

## Avisos

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Aviso | Éxito | Normal | `820:2437` | Hecho |
| Aviso | Error | Normal | `820:2430` | Hecho |
| Aviso | Información | Normal | `820:2444` | Hecho en el detalle de otro día (aún no aparece en #/componentes) |
| Aviso | Menú sin actualizar | Normal | `905:4113` | Hecho en el Menú (aún no aparece en #/componentes) |
| Aviso | Flotante (arriba, fundido de entrada, 3 s) | Visible | `1440:11251` | Hecho; Figma no define la salida |

La posición, la entrada y la duración del aviso flotante vienen de Figma. Solo la salida queda con TODO.

## TODO abiertos en el código

| Dónde | Qué falta definir en Figma |
|---|---|
| `css/estilos.css`, `.etiqueta--nuevo`, `--combo`, `--casero` | Color del texto de las tres etiquetas (se usa el texto principal). |
| `css/estilos.css`, `.zona-avisos .aviso` | Cómo se va el aviso flotante. |

## Comentarios y calificaciones

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Fila de opción | Comentarios | Normal | `1176:7257` | Hecho |
| Comentario | Con y sin texto | Normal | `1189:4679` | Hecho |
| Avatar de búho (pequeño) | Búhos 1 a 6 | Normal | `901:3528` | Hecho |
| Calificación (selector) | Valor 0 a 5 | Normal | `827:2507` | Hecho |
| Campo de texto | Vacío, Foco, Lleno y Error | — | `725:2427` | Hecho (en cuenta: `crearCampo`); Deshabilitado pendiente |

## Registro e inicio de sesión

| Pantalla o componente | Nodo de Figma | Dónde está |
|---|---|---|
| Splash | `976:4524` | `dibujarSplash` en `js/vista-cuenta.js` |
| Inicia sesión y sus errores (01 y 01b a 01e) | `940:4228`, sección `1412:9942` | `dibujarLogin` |
| Crear cuenta (02 a 07) | `940:4307`, `964:4642` y vecinos | funciones `dibujarRegistro…` |
| Código de 6 dígitos | `964:4642` | `crearFormularioDeCodigo` (registro y recuperación) |
| Recuperar contraseña (08 a 11) | sección `1156:7059` | funciones `dibujarRecuperar…` |
| Ventana de invitado (Apartar, Puntos y comentarios) | sección `1429:10116`, `1003:4839` | `pedirCuenta` |

## Panel «Más»

| Pantalla | Nodo o sección de Figma | Dónde está |
|---|---|---|
| Panel (40 y 40b) | `1050:4983` | `crearPanel` y `crearFila` en `js/vista-mas.js` |
| Perfil, Configuración, cambios y eliminar cuenta (41 a 47e) | pantallas 41 a 47 | `js/vista-mas.js`; los cambios de cuenta en `js/cuenta.js` |
| Historial y detalle (50, 50b, 51, 51b y 51c; 51d y 51e pendientes) | pantallas 50 y 51 | `dibujarHistorial`, `dibujarDetalleDePedido` |
| Notificaciones (60, 60b y 60d; 60c no aplica en la web) | pantallas 60 | `js/notificaciones.js` y `dibujarNotificaciones` |
| Cotizar eventos (70 y 70b) | `1123:6569` | `dibujarCotizar` |
| Sobre Funda Gondra y sus áreas (80 a 84) | `1134:6527` | `dibujarSobre`, `dibujarArea` |
| Centro de ayuda (90 a 93c) | `1145:6600`, `1145:6652`, `1146:6818`, `1147:7006` | `dibujarCentroDeAyuda` y las funciones que le siguen |

## Chat de Búhi

| Pantalla | Nodo de Figma | Dónde está |
|---|---|---|
| Menú de hoy con pedido activo (M1c) | `1526:11315` | `mostrarAccesoAlChat` en `js/vista-chatbot.js` |
| Chat (30 a 34) | sección `1010:4869` | `dibujarChatbot` y los pasos en `js/vista-chatbot.js`; reglas en `js/chatbot.js` |

## Apartar pedido

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Tarjeta de acompañamiento | Normal y Seleccionado | — | `1345:4696` | Hecho |
| Chip de horario | Normal y Seleccionado | — | `889:3410` | Hecho; Deshabilitado pendiente |
| Opción de cafetería | Normal y Seleccionada | — | `889:3428` | Hecho; «Cerrada por hoy» pendiente |
| Hoja inferior | Revisa tu pedido | Abierta | `1374:9609` | Hecho |
| Ventana de confirmación | Éxito e Informativa | Abierta | `834:2458` | Hecho (Éxito, Informativa y Peligro); Confirmar pendiente |
| Ticket con PIN | Pedido | — | `874:3386` | Hecho; Premio pendiente |
| Línea de descuento de empleado UCA | Revisión y ticket (M30c, M32c, M30d, M32d) | — | `1440:10850`, `1440:10948`, `1449:4426`, `1449:4605` | Hecho; en Historial y detalle, que Figma no dibuja, usa el mismo estilo |

## Puntos

| Componente | Nodo de Figma | Dónde está |
|---|---|---|
| Progreso de puntos (0 a 3 premios alcanzados) | `874:3463` | `crearProgresoDePuntos` en `js/vista-puntos.js` |
| Tarjeta de premio (Disponible, Por recoger, Vencido, Bloqueado; "Canjeado" no se usa en el MVP) | `1002:4641` | `crearTarjetaDePremio` en `js/vista-puntos.js` |
| Pregunta frecuente (Cerrada y Abierta) | `1002:4593` | `crearPreguntaFrecuente` en `js/vista-puntos.js` |
| Ticket con PIN, tipo Premio | `874:3386` | `crearTicketConPin` en `js/vista-pedido.js` y `crearTicketDePremio` en `js/vista-puntos.js` |

## Botones

Componente completo en Figma: `610:2516`.

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Botón | Primario · Grande | Normal | `610:2389` | Hecho |
| Botón | Primario · Grande | Presionado | `610:2391` | Hecho |
| Botón | Primario · Grande | Deshabilitado | `610:2393` | Hecho |
| Botón | Primario · Grande | Foco | `610:2395` | Hecho |
| Botón | Primario · Mediano | Normal | `610:2397` | Hecho |
| Botón | Primario · Mediano | Presionado | `610:2399` | Hecho |
| Botón | Primario · Mediano | Deshabilitado | `610:2401` | Hecho |
| Botón | Primario · Mediano | Foco | `610:2403` | Hecho |
| Botón | Primario · Pequeño | Normal | `610:2405` | Hecho |
| Botón | Primario · Pequeño | Presionado | `610:2407` | Hecho |
| Botón | Primario · Pequeño | Deshabilitado | `610:2409` | Hecho |
| Botón | Primario · Pequeño | Foco | `610:2411` | Hecho |
| Botón | Secundario · Grande | Normal | `610:2413` | Hecho |
| Botón | Secundario · Grande | Presionado | `610:2415` | Hecho |
| Botón | Secundario · Grande | Deshabilitado | `610:2417` | Hecho |
| Botón | Secundario · Grande | Foco | `610:2419` | Hecho |
| Botón | Secundario · Mediano | Normal | `610:2421` | Hecho |
| Botón | Secundario · Mediano | Presionado | `610:2423` | Hecho |
| Botón | Secundario · Mediano | Deshabilitado | `610:2425` | Hecho |
| Botón | Secundario · Mediano | Foco | `610:2427` | Hecho |
| Botón | Secundario · Pequeño | Normal | `610:2429` | Hecho |
| Botón | Secundario · Pequeño | Presionado | `610:2431` | Hecho |
| Botón | Secundario · Pequeño | Deshabilitado | `610:2433` | Hecho |
| Botón | Secundario · Pequeño | Foco | `610:2435` | Hecho |
| Botón | Contorno · Grande | Normal | `610:2437` | Hecho |
| Botón | Contorno · Grande | Presionado | `610:2439` | Hecho |
| Botón | Contorno · Grande | Deshabilitado | `610:2441` | Hecho |
| Botón | Contorno · Grande | Foco | `610:2443` | Hecho |
| Botón | Contorno · Mediano | Normal | `610:2445` | Hecho |
| Botón | Contorno · Mediano | Presionado | `610:2447` | Hecho |
| Botón | Contorno · Mediano | Deshabilitado | `610:2449` | Hecho |
| Botón | Contorno · Mediano | Foco | `610:2451` | Hecho |
| Botón | Contorno · Pequeño | Normal | `610:2453` | Hecho |
| Botón | Contorno · Pequeño | Presionado | `610:2455` | Hecho |
| Botón | Contorno · Pequeño | Deshabilitado | `610:2457` | Hecho |
| Botón | Contorno · Pequeño | Foco | `610:2459` | Hecho |
| Botón | Texto · Grande | Normal | `610:2461` | Hecho |
| Botón | Texto · Grande | Presionado | `610:2463` | Hecho |
| Botón | Texto · Grande | Deshabilitado | `610:2465` | Hecho |
| Botón | Texto · Grande | Foco | `610:2467` | Hecho |
| Botón | Texto · Mediano | Normal | `610:2469` | Hecho |
| Botón | Texto · Mediano | Presionado | `610:2471` | Hecho |
| Botón | Texto · Mediano | Deshabilitado | `610:2473` | Hecho |
| Botón | Texto · Mediano | Foco | `610:2475` | Hecho |
| Botón | Texto · Pequeño | Normal | `610:2477` | Hecho |
| Botón | Texto · Pequeño | Presionado | `610:2479` | Hecho |
| Botón | Texto · Pequeño | Deshabilitado | `610:2481` | Hecho |
| Botón | Texto · Pequeño | Foco | `610:2483` | Hecho |
| Botón | Peligro · Grande | Normal | `610:2485` | Hecho |
| Botón | Peligro · Grande | Presionado | `610:2487` | Hecho |
| Botón | Peligro · Grande | Deshabilitado | `610:2489` | Hecho |
| Botón | Peligro · Grande | Foco | `610:2491` | Hecho |
| Botón | Peligro · Mediano | Normal | `610:2493` | Hecho |
| Botón | Peligro · Mediano | Presionado | `610:2495` | Hecho |
| Botón | Peligro · Mediano | Deshabilitado | `610:2497` | Hecho |
| Botón | Peligro · Mediano | Foco | `610:2499` | Hecho |
| Botón | Peligro · Pequeño | Normal | `610:2501` | Hecho |
| Botón | Peligro · Pequeño | Presionado | `610:2503` | Hecho |
| Botón | Peligro · Pequeño | Deshabilitado | `610:2505` | Hecho |
| Botón | Peligro · Pequeño | Foco | `610:2507` | Hecho |
