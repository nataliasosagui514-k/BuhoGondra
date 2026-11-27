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

## Pruebas

Al abrir `index.html` sin nada después, aparece el Splash 4.5 segundos y luego "Inicia sesión" (o el menú, si ya hay sesión). Con una ruta, como `index.html#/menu`, se entra directo.

Sin sesión se puede ver el menú, los platillos y los comentarios, pero no apartar ni comentar.

La sesión se cierra en Más › Perfil › "Cerrar sesión". Como respaldo, también se puede ejecutar `cerrarSesion()` en la consola y recargar la página.

Los puntos se calculan con los pedidos confirmados con la sesión de cada cuenta; los pedidos antiguos que quedaron como "invitado" no suman.

Para probar los premios sin confirmar muchos pedidos, con la sesión abierta pega este comando: guarda un pedido de prueba de 50 puntos (repítelo para llegar a 100 y 150).

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
