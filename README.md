## Nombre del proyecto y descripción corta

_Pendiente._

## Integrantes

_Pendiente._

## Cómo ver la app

_Pendiente._

### Ruta de demostración

Para mostrar la app fuera del horario de apartar (8:00 a 11:00 a. m.), agrega `?hora=HH:MM` antes del `#` de la dirección, por ejemplo `index.html?hora=10:00#/menu`; sin ese parámetro se usa la hora real del dispositivo.

El parámetro solo simula la hora, no la fecha: solo se puede apartar en un día que tenga menú (por ahora, del 23 al 27 de noviembre de 2026).

## Pruebas

Mientras no exista el Registro, la sesión se abre y se cierra desde la consola del navegador (tecla F12, pestaña "Consola"). Después de cada comando, recarga la página.

- `iniciarSesionDePrueba()` abre una sesión con el correo inventado `prueba@ejemplo.com` (sin contraseña) y la guarda en `localStorage`.
- `cerrarSesionDePrueba()` borra la sesión. La pestaña Puntos vuelve a la vista de invitado.

Los puntos se calculan con los pedidos guardados que se confirmaron **con la sesión abierta**; los que se hicieron sin sesión no suman.

Para probar los premios sin confirmar muchos pedidos, con la sesión abierta pega este comando: guarda un pedido de prueba de 50 puntos (repítelo para llegar a 100 y 150).

```js
guardarPedido({ id: `prueba-${Date.now()}`, fecha: obtenerFechaDeHoy(), platillos: [], puntos: 50, autor: obtenerSesion().correo });
```

Para empezar de cero, ejecuta `localStorage.clear()` y recarga (borra pedidos, premios, sesión y opiniones de este navegador).

## Estructura de carpetas

_Pendiente._

## Tecnologías

HTML, CSS, JavaScript; sin frameworks.

## Estado del proyecto

_Pendiente._
