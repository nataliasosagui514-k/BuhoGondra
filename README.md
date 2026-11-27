# BúhoGondra

App web, pensada para el teléfono, para ver el menú de las cafeterías UCA, apartar la comida del día, recibir un ticket con PIN y juntar puntos. Es un MVP (una primera versión) que funciona **sin servidor**.

## Enlace público

**<https://nataliasosagui514-k.github.io/BuhoGondra/>** (GitHub Pages)

## Cómo ver la app en el navegador

No hay que instalar nada.

- **En internet:** abre el enlace público.
- **En tu computadora:** descarga el proyecto y abre `index.html` con un navegador actual (por ejemplo, Chrome o Edge).

Está diseñada para teléfono. En la computadora, presiona **F12**, activa la vista de dispositivo (**Ctrl + Shift + M**) y usa un ancho de **393 px**.

Las tipografías vienen de Google Fonts: sin internet, la app se ve con otra letra.

Al abrir la dirección sin nada después, aparece el Splash 4.5 segundos y luego "Inicia sesión" (o el menú, si ya hay sesión). Si la dirección trae una ruta, como `#/menu`, se entra directo.

> **Importante sobre la fecha:** solo hay menú del **lunes 23 al viernes 27 de noviembre de 2026**. Para apartar, la fecha del dispositivo debe ser uno de esos cinco días. En sábado o domingo se muestra el menú del viernes 27, y entre semana en otras fechas aparece "Funda Gondra todavía no publica el menú de este día.". Para una demostración en otra fecha hay que cambiar temporalmente la fecha de la computadora.

## Ruta de demostración: `?hora=10:00`

**Por qué existe:** solo se puede apartar de **8:00 a antes de las 11:00 a. m.** Sin esta ruta, fuera de ese horario no se podría mostrar cómo se aparta.

Escribe `?hora=HH:MM` (formato de 24 horas) **antes del `#`**:

| Dónde | Ejemplo |
|---|---|
| En internet | `https://nataliasosagui514-k.github.io/BuhoGondra/?hora=10:00#/menu` |
| En tu computadora | `index.html?hora=10:00#/menu` (en la barra de direcciones, con la ruta completa del archivo) |

- Si va **después** del `#`, no funciona.
- Solo cambia la **hora** que usan las reglas de apartar y del chat, **no la fecha**. La función es `obtenerAhora()`, en `js/pedido.js`.
- Sin ese parámetro se usa la hora del dispositivo.
- La hora simulada queda fija: no avanza. Para probar "después de las 11", usa `?hora=11:30`.

## Modo demostración del código de verificación

La app no tiene servidor y **no envía correos**. El código de 6 dígitos se genera en el navegador.

| Cuándo se pide | Dónde se ve el código |
|---|---|
| Al registrarse | En la pantalla "Verifica tu correo": "Modo demostración: tu código es NNNNNN" (y en la consola) |
| Al recuperar la contraseña | **Solo en la consola** (F12, pestaña "Consola"), y solo si el correo tiene cuenta |
| Al cambiar de correo | **Solo en la consola** |

En la consola se ve así:

```text
BúhoGondra (demostración) · Código para 00123425@uca.edu.sv: 482173. Vence en 10 minutos.
```

El código vence a los 10 minutos, sirve una sola vez y deja de servir si se pide otro o se recarga la página. Para reenviarlo hay que esperar 60 segundos. Al recuperar la contraseña no se muestra en pantalla para no revelar si un correo tiene cuenta.

## Sesión de prueba y cómo cerrarla

La app **no trae ninguna cuenta creada**. Para probar, regístrate con un correo inventado que tenga el formato de la UCA:

| Tipo de cuenta | Formato | Ejemplo |
|---|---|---|
| Estudiante | 8 números antes de la `@` | `00123425@uca.edu.sv` |
| Docente o empleado (10 % de descuento) | solo letras antes de la `@` | `docente@uca.edu.sv` |

Usa una contraseña de al menos 8 caracteres, **distinta de las que usas en otros sitios**. La cuenta existe solo en ese navegador.

**Cerrar la sesión:**

- En la app: **Más › Perfil › Cerrar sesión**.
- Como respaldo, desde la consola: ejecuta `cerrarSesion()` y recarga la página.

**Probar los premios sin hacer muchos pedidos:** con la sesión abierta, pega esto en la consola y recarga. Guarda un pedido de prueba de 50 puntos; repítelo para llegar a 100 y 150. Suma puntos, pero no aparece en Historial.

```js
guardarPedido({ id: `prueba-${Date.now()}`, fecha: obtenerFechaDeHoy(), platillos: [], puntos: 50, autor: obtenerSesion().correo });
```

**Empezar de cero:** ejecuta `localStorage.clear()` y recarga. Borra las cuentas, pedidos, premios, sesión, opiniones, avisos leídos y reportes de ese navegador.

## Cómo funcionan algunas reglas

### Contraseñas

La contraseña no se guarda. Se guarda su **hash SHA-256** (Web Crypto API), calculado junto con una **sal**: un texto al azar distinto en cada cuenta. Al iniciar sesión se calcula otra vez y se comparan los dos hash.

Esto **no equivale a la seguridad de un servidor**: SHA-256 es muy rápido, así que una contraseña débil se puede adivinar probando muchas, y quien use el navegador puede cambiar los datos. La Web Crypto API necesita que la app se abra como archivo, en `localhost` o con `https`.

### Qué se guarda en el navegador

| Clave de `localStorage` | Contenido |
|---|---|
| `buhogondra.cuentas` | Por correo: tipo, búho, nombre, apellido, sal, hash y fecha en que se aceptaron los Términos |
| `buhogondra.sesion` | Solo correo, tipo de cuenta, búho y fecha de inicio |
| `buhogondra.pedidos` | Pedidos |
| `buhogondra.premios` | Premios canjeados y su PIN |
| `buhogondra.opiniones` | Opiniones escritas en ese navegador |
| `buhogondra.notificacionesLeidas` | Qué avisos se vieron o se abrieron |
| `buhogondra.reportes` | Reportes de "Problemas con mi cuenta" (**no se envían a nadie**) |
| `buhogondra.pedidoEnCurso` | El pedido que se está armando (solo vale ese día) |

La clave `buhogondra.seleccion`, del platillo que se está eligiendo, va en `sessionStorage`.

### Descuento de empleado UCA

Las cuentas de docente o empleado (correo de solo letras) tienen **10 % de descuento** sobre todo el pedido, redondeado a centavos. Se calcula en `js/pedido.js` y se guarda en el pedido como `descuento` (0 si no aplica). El `total` ya lo trae restado. Los puntos no cambian.

### Chat de Búhi

Con un pedido activo, el Menú muestra el botón **ChatBot** y la burbuja "Ayuda con el pedido". Un pedido está activo si es de hoy, no se canceló y no ha terminado su horario de recogida (almuerzo hasta las 2:00 p. m.; típicos hasta las 5:30 p. m.).

| Cambio | Hasta cuándo |
|---|---|
| Cancelar | Antes de las 11:00 a. m. |
| Cambiar de cafetería | Antes de las 11:00 a. m. |
| Cambiar la hora (otra de la misma ventana que no haya pasado) | Mientras queden horas |

El límite de las 11:00 viene del diseño y está **por confirmar con Funda Gondra**. Un pedido cancelado no se borra: guarda en el campo `cancelado` la fecha y hora, y ya no suma puntos. Los premios canjeados y sin vencer de un nivel que ya no se alcanza se borran junto con su PIN. La cafetería **no se entera** de ningún cambio.

### Panel «Más»

- **Historial y Notificaciones** salen de los pedidos y premios guardados en el navegador. La app no sabe si un pedido se recogió: los de días anteriores que no se cancelaron aparecen como "Entregado".
- **Eliminar cuenta** pide la contraseña y borra la cuenta y sus pedidos, premios, opiniones y avisos leídos. No se puede con pedidos en curso. Los reportes enviados no se borran.

## Estructura de carpetas

```text
BuhoGondra/
├── index.html      La única página: la barra de navegación y las plantillas de las pantallas
├── css/            estilos.css: todos los estilos (colores y medidas en variables)
├── js/             El código: datos, reglas (cálculos) y pantallas (archivos vista-*.js)
├── img/            Imágenes de la interfaz: búhos, logos, íconos y acompañamientos
│   └── platillos/  Fotos de los platillos
├── docs/           Documentación del proyecto
└── README.md       Este archivo
```

## Tecnologías

**HTML, CSS y JavaScript. Sin frameworks** y sin librerías de JavaScript. No necesita instalación ni compilación. CSS usa Flexbox y Grid. Los datos del usuario se guardan con `localStorage` y las contraseñas se protegen con la Web Crypto API.

## Integrantes

Desarrollo individual por **Natalia Sosa**.

## Estado del proyecto

### Terminado (en modo demostración)

- Registro, inicio y cierre de sesión, y recuperación de contraseña.
- Menú de hoy, menú de la semana y detalle de cada platillo.
- Comentarios y calificaciones.
- Apartar: acompañamientos, cantidad u opciones, hora, cafetería, revisión, confirmación y ticket con PIN; incluye pedidos de almuerzo y típicos juntos.
- Descuento de 10 % para docentes y empleados.
- Puntos, tres niveles y canje de premios.
- Chat de Búhi: cancelar, cambiar la hora y cambiar de cafetería.
- Panel «Más»: perfil, historial, notificaciones dentro de la app, cotizar, sobre Funda Gondra y centro de ayuda.

### No terminado

- No hay servidor, base de datos ni envío de correos.
- La cafetería no recibe los pedidos ni los cambios, y la app no confirma la recogida, el pago ni la entrega de premios.
- Los puntos se suman **al confirmar** el pedido, no al recogerlo (algunos textos de ayuda dentro de la app dicen otra cosa).
- El aviso de "platillo agotado" está programado, pero ningún platillo de los datos está marcado como agotado y no hay pantalla para marcarlo.
- Faltan estados de pedido como "No recogido" y "Cancelado por la cafetería", y algunos tipos de notificación.
- Tres platillos no tienen foto.
- No hay pruebas automáticas en el repositorio; las pruebas son manuales.

La lista completa está en [docs/limitaciones.md](docs/limitaciones.md).

## Documentación

Todo está en la carpeta [docs/](docs/):

| Documento | Para qué sirve |
|---|---|
| [Arquitectura](docs/arquitectura.md) | Cómo está armada la app |
| [Decisiones técnicas](docs/decisiones.md) | Qué se decidió y por qué |
| [Manual de uso](docs/manual-de-uso.md) | Pasos para una persona nueva |
| [Pruebas](docs/pruebas.md) | Lista para marcar al probar |
| [Limitaciones](docs/limitaciones.md) | Lo que el MVP no hace |
| [Componentes](docs/componentes.md) | Relación entre los componentes de Figma y el código (puede no incluir los cambios más recientes) |
