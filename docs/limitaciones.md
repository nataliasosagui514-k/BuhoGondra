# Limitaciones

Esto es lo que el MVP **no** hace o todavía no está resuelto. Conviene decirlo con claridad al presentar el proyecto.

## Sin servidor

- **No envía correos reales.** Al registrarse, al recuperar la contraseña y al cambiar el correo, el código se muestra en pantalla ("Modo demostración: tu código es …"). Por eso no se comprueba que el correo sea de la persona. Al recuperar la contraseña, el aviso solo aparece si el correo tiene cuenta en ese navegador, así que también revela si la cuenta existe.
- **Los datos viven en el navegador** (`localStorage`). No pasan a otro teléfono o navegador, se pierden si se borran los datos del sitio y **cualquier persona con acceso al navegador puede modificarlos**: puntos, pedidos, premios o tipo de cuenta.
- **El hash de la contraseña se calcula y se guarda en el navegador**, no en un servidor seguro. SHA-256 es rápido y no basta para proteger contraseñas en una app real.
- Que cada quien vea solo sus pedidos y tickets lo controla la pantalla. No es una protección contra quien lea el almacenamiento del navegador.
- **La cafetería no recibe nada:** ni pedidos, ni cancelaciones, ni cambios. No hay un panel para el personal.
- Los números y PIN de pedido se calculan en cada navegador: dos personas en dispositivos distintos pueden tener los mismos. El PIN usa `Math.random` y la app no lo valida en caja.
- Los reportes de **Problemas con mi cuenta** solo se guardan en este navegador. **No llegan a Funda Gondra**, aunque la pantalla diga que responderá.

## Pedidos, puntos y premios

- La app no cobra y no sabe si un pedido se pagó o se recogió. Los de días anteriores no cancelados aparecen como **Entregado**. Esto sigue una regla indicada para la cafetería: si no llega quien apartó, la comida se puede vender a otra persona.
- **Los puntos se suman al confirmar el pedido**, aunque después no se recoja.
- **La función de avisos de la cafetería cuando cancela un pedido no existe.**
- **"Canjeado" no se usa:** la entrega del premio en caja ocurre fuera de la app. Un premio canjeado queda **Por recoger** hasta que vence.
- **El vencimiento de los premios se calcula con la fecha del navegador.** Si se cambia la fecha del dispositivo, cambia el resultado.
- `?hora=` permite a cualquier persona simular otra hora. Las reglas de horario no son un control real.
- La app no comprueba el día de la semana para apartar: depende de que exista menú con la fecha de hoy.
- Ningún platillo está marcado como agotado en los datos. El aviso de **Este platillo se agotó** está programado, pero no hay forma de marcar existencias desde la app.
- No existen los estados "No recogido" ni "Cancelado por la cafetería".
- No hay notificaciones del teléfono. Solo hay avisos dentro de la app sobre pedidos de hoy y premios; faltan, por ejemplo, el del menú del día y el de pedido cancelado.

## Textos de la app que no coinciden con el código

Los textos de **Centro de ayuda**, **Términos** y **Puntos** deben revisarse con Funda Gondra:

| La app dice | Lo que hace realmente |
|---|---|
| El texto de la ayuda de puntos dice que un pedido no recogido no suma. | La app suma al confirmar y no sabe si se recogió. Solo la cancelación quita esos puntos. |
| Si la cafetería no puede preparar el pedido, lo cancelará y avisará. | La función de avisos de la cafetería cuando cancela un pedido no existe. |
| La entrega y los cambios de hora son entre 12:00 y 2:00 p. m. | Eso vale para el almuerzo. Los típicos van de 2:00 a 5:30 p. m. |
| Para cancelar, se toca la burbuja de Búhi y se elige «Cancelar mi pedido». | El botón se llama **ChatBot** y aparece solo con un pedido activo. |
| Se puede apartar de lunes a viernes. | Solo funciona en las fechas que tienen menú. |

## Menú y fechas

- **Datos de la fecha:** el menú solo tiene los días **23 al 27 de noviembre de 2026**. **La demostración se hace con el viernes 27.** Después de esa semana no se puede apartar sin agregar datos nuevos (o cambiar la fecha del dispositivo para una demostración).
- Las opiniones iniciales de croissant, croquetas y pupusas son **de ejemplo**, no de personas reales. También afectan su calificación promedio.
- Las imágenes de los premios son provisionales.

## Fotos

- **El origen de las fotos está por confirmar.** Algunas capas de Figma tienen nombres que indican generación con inteligencia artificial (por ejemplo, "Imagen de ChatGPT…"). **No se usan en una publicación oficial sin confirmar el origen y el permiso.** El código no registra de dónde viene cada foto: una parte se descargó del archivo de diseño en Figma y las demás se agregaron a mano a `img/platillos/`.
- Varias fotos son **la misma imagen repetida** en platillos distintos, y algunas pueden no representar el platillo (por ejemplo, la de las lasañas). Revisa que cada una corresponda.
- **Ensalada fresca, vegetales al vapor y casamiento** no tienen foto propia de platillo.
- Los archivos PNG de `img/platillos/` pesan mucho (cada uno más de 800 KB), lo que gasta datos y tarda en cargar.
- El encuadre en las tarjetas tiene reglas por archivo en `css/estilos.css`. Si se cambia una foto, hay que revisar su regla.
- Algunas fotos, como la de las pupusas, perdieron parte del borde del plato al recortarlas.

## Pendientes y textos marcados como TODO

El código tiene comentarios `TODO`: textos o comportamientos que Figma no definía, se decidieron de forma provisional o faltan. Para verlos todos, busca `TODO` en `js/` y en `css/estilos.css`. Incluyen mensajes de error, textos para lectores de pantalla y casos del chat.

### Decisiones pendientes con Funda Gondra

| Tema | Estado actual |
|---|---|
| **Yuca frita o sancochada** | No se puede elegir una de las dos. |
| **Fines de semana** | Se muestra el viernes 27 (último día con datos), solo para ver. El diseño pide mostrar el lunes siguiente. |
| **Ayuda sobre pedidos no recogidos** | El texto promete que no suman puntos, pero la app no puede saberlo. |
| Límite de las 11:00 para cancelar o cambiar de cafetería | Funciona así; está por confirmar. |
| Correos UCA con otro formato | La cuenta queda sin tipo; falta definir cómo verificar a docentes y empleados. |
| Reportes de cuenta | Faltan el canal de envío y el plazo de respuesta. |
| Versión de los Términos | Se guarda la fecha de aceptación, pero no una versión. |

## Otros detalles conocidos

- El ticket y algunos avisos pueden decir "a las 1:15" en lugar de "a la 1:15".
- En tarjetas con nombres muy largos, como **1/4 de pollo en salsa de cilantro**, la foto puede tapar parte del precio.
- No hay pruebas automáticas en el repositorio. La lista de [pruebas](pruebas.md) es manual.
- La app está diseñada para teléfono; no tiene un diseño propio para computadora.
