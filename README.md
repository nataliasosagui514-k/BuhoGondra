## Nombre del proyecto y descripción corta

_Pendiente._

## Integrantes

_Pendiente._

## Cómo ver la app

_Pendiente._

### Ruta de demostración

Para mostrar la app fuera del horario de apartar (8:00 a 11:00 a. m.), agrega `?hora=HH:MM` antes del `#` de la dirección, por ejemplo `index.html?hora=10:00#/menu`; sin ese parámetro se usa la hora real del dispositivo.

El parámetro solo simula la hora, no la fecha: solo se puede apartar en un día que tenga menú (por ahora, del 23 al 27 de noviembre de 2026).

## Cuentas (modo de demostración)

La app no tiene servidor: las cuentas se guardan en este navegador y **no se envían correos**.

### Código de verificación

Al registrarte, la pantalla "Verifica tu correo" muestra el aviso "Modo demostración: tu código es NNNNNN". Se quitará cuando haya envío real de correos.

Al recuperar la contraseña, el código de 6 dígitos solo aparece en la **consola del navegador** (tecla F12, pestaña "Consola"), porque un aviso en pantalla revelaría si el correo tiene cuenta:

```
BúhoGondra (demostración) · Código para 00123425@uca.edu.sv: 482173. Vence en 10 minutos.
```

El código vence a los 10 minutos, sirve una sola vez y deja de servir si se pide otro o se recarga la página. Al recuperar la contraseña, solo aparece si el correo tiene una cuenta en este navegador.

### Por qué se guarda un hash y no la contraseña

La contraseña nunca se guarda en texto. Se guarda su hash **SHA-256** (Web Crypto API), calculado con una sal al azar distinta en cada cuenta. El hash no permite leer la contraseña, y para entrar se calcula otra vez y se comparan los dos.

Límites de la demostración: SHA-256 es muy rápido, así que una contraseña débil se puede adivinar probando muchas; y quien use el navegador puede cambiar los datos guardados. Una versión real necesita un servidor y un método lento para contraseñas (por ejemplo, bcrypt o Argon2). No uses aquí una contraseña que uses en otro sitio.

La Web Crypto API solo funciona al abrir el archivo directamente, en `localhost` o con `https`.

### Qué se guarda

- Todas las cuentas, en la clave `buhogondra.cuentas`: tipo, búho, nombre, apellido, sal, hash y fecha en que se aceptaron los Términos.
- La sesión (`buhogondra.sesion`): solo correo, tipo de cuenta, búho y fecha de inicio.

## Panel «Más» (modo de demostración)

- **Historial y Notificaciones** salen de los pedidos guardados en este navegador. La app no sabe si un pedido se recogió: los de días anteriores aparecen como "Entregado".
- **Eliminar cuenta** pide la contraseña y borra la cuenta, sus pedidos, premios, comentarios y avisos de este navegador. No se puede con pedidos en curso.
- **Reportes** de "Problemas con mi cuenta": se guardan en `buhogondra.reportes` (nombre, correo, mensaje y fecha). **No se envían a nadie**; falta definir el canal de envío.
- **Cambiar correo**: el código de verificación solo aparece en la consola del navegador.

## Descuento de empleado UCA

Las cuentas de docente o empleado (correo de solo letras) tienen 10 % de descuento sobre todo el pedido, redondeado a centavos. Se calcula en `js/pedido.js` y se guarda en el pedido como `descuento` (un número; 0 si no aplica). El `total` guardado ya lo trae restado. Los puntos no cambian.

## Chat de Búhi

Con un pedido activo, el Menú de hoy muestra el botón "ChatBot" y la burbuja "Ayuda con el pedido". Un pedido está activo si es de hoy, no se canceló y no ha terminado su horario de recogida (almuerzo hasta las 2:00 p. m.; típicos hasta las 5:30 p. m.).

| Cambio | Hasta cuándo |
|---|---|
| Cancelar | Antes de las 11:00 a. m. |
| Cambiar de cafetería | Antes de las 11:00 a. m. |
| Cambiar la hora (otra hora de la misma ventana que no haya pasado) | Mientras queden horas |

El límite de las 11:00 viene de Figma (31d y 33c) y está por confirmar con Funda Gondra. Las reglas están en `js/chatbot.js` y las pantallas en `js/vista-chatbot.js`.

Un pedido cancelado no se borra: guarda en el campo `cancelado` la fecha y hora en que se canceló, aparece así en Historial y en su ticket, y ya no suma puntos. Los premios canjeados y sin vencer de un nivel que ya no se alcanza se borran junto con su PIN.

Como la app no tiene servidor, la cafetería **no se entera** de estos cambios.

Para probarlo a cualquier hora usa la [ruta de demostración](#ruta-de-demostración), por ejemplo `index.html?hora=10:00#/menu`.

## Pruebas

Al abrir `index.html` sin nada después, aparece el Splash 4.5 segundos y luego "Inicia sesión" (o el menú, si ya hay sesión). Con una ruta, como `index.html#/menu`, se entra directo.

Sin sesión se puede ver el menú, los platillos y los comentarios, pero no apartar ni comentar.

La sesión se cierra en Más › Perfil › "Cerrar sesión". Como respaldo, también se puede ejecutar `cerrarSesion()` en la consola y recargar la página.

Los puntos se calculan con los pedidos confirmados con la sesión de cada cuenta; los pedidos antiguos que quedaron como "invitado" no suman.

Para probar los premios sin confirmar muchos pedidos, con la sesión abierta pega este comando: guarda un pedido de prueba de 50 puntos (repítelo para llegar a 100 y 150). Estos pedidos de prueba suman puntos, pero no aparecen en Historial ni generan avisos de pedido.

```js
guardarPedido({ id: `prueba-${Date.now()}`, fecha: obtenerFechaDeHoy(), platillos: [], puntos: 50, autor: obtenerSesion().correo });
```

Para empezar de cero, ejecuta `localStorage.clear()` y recarga (borra cuentas, pedidos, premios, sesión y opiniones de este navegador).

## Estructura de carpetas

_Pendiente._

## Tecnologías

HTML, CSS, JavaScript; sin frameworks.

## Estado del proyecto

_Pendiente._
