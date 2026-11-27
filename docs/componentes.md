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
| Barra de navegación | Con aviso en Más | Normal | `1112:4696` (punto de aviso) | Pendiente |
| Botón del chatbot | Sin aviso | Normal | `839:2567` | Pendiente |
| Botón del chatbot | Con aviso | Con aviso | `839:2575` | Pendiente |

## Encabezado y botones de un icono

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Encabezado | Interno: volver y título | Normal | `1010:4871`, `1051:5423` | Hecho |
| Encabezado | Pestaña: título (Puntos) | Normal | `1003:4399` | Hecho |
| Encabezado | Pestaña: enlace «¿Cómo funciona?» | Normal | `1003:4401` | Pendiente |
| Encabezado | Menú: fecha, subtítulo y calendario | Normal | `1526:11316` | Pendiente |
| Botón de volver | En encabezado (relleno gris) | Normal | `1027:6547` | Hecho |
| Botón de volver | En encabezado | Presionado | `905:4403` | Hecho |
| Botón de volver | Flotante (relleno blanco) | Normal | `905:4400` | Pendiente |
| Botón de icono | Flotante | Normal | `1173:4653` | Pendiente |
| Botón de icono | Flotante | Presionado | `1173:4655` | Pendiente |
| Panel «Más» | Panel lateral | Abierto | `1050:4983` | Pendiente |

## Etiquetas

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Etiqueta | Nuevo | Normal | — (solo color de acento, `507:377`) | TODO de color |
| Etiqueta | Combo | Normal | — (solo color de acento, `507:367`) | TODO de color |
| Etiqueta | Casero | Normal | — (solo color de acento, `507:372`) | TODO de color |
| Etiqueta | Disponible | Normal | `820:2416` | Hecho |
| Etiqueta | Agotado | Normal | `820:2419` | Hecho |
| Etiqueta | Calificación | Normal | `820:2412` | Pendiente |
| Etiqueta | Entregado | Normal | `820:2422` | Pendiente |
| Etiqueta | Cancelado | Normal | `820:2426` | Pendiente |
| Etiqueta | Menú actualizado | Normal | `870:2946` | Pendiente |
| Etiqueta | Menú desactualizado | Normal | `870:2950` | Pendiente |
| Etiqueta | En curso | Normal | `905:4103` | Pendiente |
| Etiqueta | No recogido | Normal | `905:4106` | Pendiente |
| Etiqueta | Estudiante | Normal | `963:4600` | Pendiente |
| Etiqueta | Docente o empleado | Normal | `963:4606` | Pendiente |

## Avisos

| Componente | Variante | Estado | Nodo en Figma | Implementación |
|---|---|---|---|---|
| Aviso | Éxito | Normal | `820:2437` | Hecho |
| Aviso | Error | Normal | `820:2430` | Hecho |
| Aviso | Información | Normal | `820:2444` | Hecho en el detalle de otro día (aún no aparece en #/componentes) |
| Aviso | Menú sin actualizar | Normal | `905:4113` | Hecho en el Menú (aún no aparece en #/componentes) |
| Aviso | Flotante (posición, animación y cristal) | Visible | — | Pendiente |

El aviso flotante actual usa una posición y una duración provisionales, marcadas con TODO en el código.

## TODO abiertos en el código

| Dónde | Qué falta definir en Figma |
|---|---|
| `css/estilos.css`, `.etiqueta--nuevo`, `--combo`, `--casero` | Color del texto de las tres etiquetas (se usa el texto principal). |
| `css/estilos.css`, `.zona-avisos` | Posición, animación y cristal del aviso flotante. |
| `js/app.js`, `duracionAviso` | Duración del aviso (se usan 4 segundos). |

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
