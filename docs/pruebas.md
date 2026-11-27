# Lista de pruebas

Marca cada casilla cuando lo pruebes y veas el resultado esperado: cambia `[ ]` por `[x]`. Si algo falla, no marques la casilla y anótalo al final.

## Preparación

- [ ] La fecha del dispositivo es un día entre el 23 y el 27 de noviembre de 2026.
- [ ] La app se abre con `?hora=10:00` antes del `#`.
- [ ] La vista de dispositivo está en 393 px de ancho.
- [ ] La consola del navegador (F12) está disponible.
- [ ] Si quiero empezar de cero, ejecuté `localStorage.clear()` y recargué (esto borra los datos de prueba).

## 1. Registro e inicio de sesión

- [ ] Un correo que no es `@uca.edu.sv` muestra un error al registrarse.
- [ ] Una contraseña de menos de 8 caracteres no se acepta.
- [ ] Un correo con 8 números muestra la etiqueta **Estudiante**.
- [ ] Un correo con solo letras muestra **Docente o empleado UCA · 10 % de descuento**.
- [ ] En **Verifica tu correo** aparece el código de demostración.
- [ ] Un código equivocado muestra **Código incorrecto**.
- [ ] El código correcto permite continuar.
- [ ] **Registrar** no se activa sin elegir un búho.
- [ ] Al tocar **Aceptar y continuar** se crea la cuenta y aparece el menú.
- [ ] Registrar otra vez el mismo correo muestra **Este correo ya tiene una cuenta**.
- [ ] **Más › Perfil › Cerrar sesión** cierra la sesión.
- [ ] Una contraseña equivocada muestra **Correo o contraseña incorrectos**.
- [ ] Con los datos correctos se inicia sesión.
- [ ] Al recuperar la contraseña, el código aparece solo en la consola.
- [ ] Después de **Guardar contraseña** puedo entrar con la nueva, y la anterior ya no funciona.
- [ ] En `localStorage`, la clave `buhogondra.cuentas` tiene `sal` y `hash`, no la contraseña.

## 2. Menú y apartar

- [ ] El **Menú de hoy** muestra las cuatro categorías con sus platillos.
- [ ] El calendario abre el **Menú de la semana** y puedo cambiar de día.
- [ ] En un día distinto de hoy no puedo apartar.
- [ ] Una tarjeta abre el detalle del platillo, con su foto.
- [ ] Como invitado, al intentar apartar aparece **Inicia sesión para apartar**.
- [ ] En un plato fuerte puedo elegir acompañamientos.
- [ ] En las pupusas puedo elegir tipos y cantidades.
- [ ] **Continuar** se activa cuando ya elegí todo lo necesario.
- [ ] Puedo elegir hora y cafetería.
- [ ] **Revisa tu pedido** muestra platillos, total, hora y cafetería.
- [ ] **+ Agregar otro platillo** conserva lo que ya había elegido.
- [ ] **Cambiar algo** permite quitar un platillo.
- [ ] Un pedido con almuerzo y típicos pide dos horas y genera un solo PIN.
- [ ] **Confirmar pedido** muestra **¡Pedido apartado!** y el ticket con un PIN de 4 dígitos.
- [ ] Con una cuenta de docente aparece el 10 % de descuento en la revisión y en el ticket.
- [ ] Con una cuenta de estudiante no hay descuento.
- [ ] Con `?hora=11:30`, la app no deja apartar.

## 3. Puntos

- [ ] Sin sesión, **Puntos** muestra la ventana para iniciar sesión o registrarse.
- [ ] Al confirmar un plato fuerte, la cuenta suma 3 puntos.
- [ ] Dos platillos de la misma categoría en un pedido suman los puntos de esa categoría una sola vez.
- [ ] Con 50 puntos (ver el comando del README) se puede canjear el **Postre**.
- [ ] Al tocar **Canjear** aparece un ticket con PIN.
- [ ] Después de canjear, los puntos siguen iguales.
- [ ] **Ver ticket** vuelve a mostrar el PIN del premio.
- [ ] Con 100 puntos se desbloquea el **Típico**.
- [ ] Con 150 puntos se desbloquea el **Plato fuerte**.
- [ ] Un premio con la fecha ya pasada se muestra **Vencido** y sin PIN (para probarlo, adelanta 8 días la fecha del dispositivo desde que se desbloqueó y luego regrésala).

## 4. Chatbot

Primero aparta un pedido para hoy con `?hora=10:00`.

- [ ] El botón **ChatBot** aparece en el Menú cuando hay un pedido activo.
- [ ] Sin pedidos activos, el botón no aparece.
- [ ] Con dos pedidos activos, el chat pregunta de cuál se trata.
- [ ] **No llegaré a tiempo** permite elegir otra hora y el ticket cambia.
- [ ] **Cambiar de cafetería** actualiza la cafetería del ticket.
- [ ] **Cancelar mi pedido** pide confirmación.
- [ ] **No, mantener** conserva el pedido.
- [ ] **Sí, cancelar pedido** lo deja como **Cancelado** y su ticket ya no muestra PIN.
- [ ] El pedido cancelado ya no suma puntos.
- [ ] Con `?hora=11:30` no se puede cancelar ni cambiar de cafetería.
- [ ] Con `?hora=11:30` todavía se puede cambiar la hora, si quedan horas.

## 5. Más

- [ ] El botón **Más** abre el panel.
- [ ] Como invitado, Perfil, Historial y Notificaciones piden una cuenta.
- [ ] En Configuración puedo cambiar mi nombre.
- [ ] Puedo cambiar mi correo con el código que aparece en la consola.
- [ ] Puedo cambiar mi contraseña escribiendo la actual.
- [ ] Puedo cambiar mi búho.
- [ ] Historial muestra mis pedidos y abre el detalle de cada uno.
- [ ] Notificaciones muestra el aviso de un pedido de hoy.
- [ ] Cotizar eventos permite copiar el número (no hace falta enviar el mensaje).
- [ ] Sobre Funda Gondra muestra sus áreas.
- [ ] En Centro de ayuda se abren las preguntas frecuentes y los términos.
- [ ] **Problemas con mi cuenta** pide los tres datos y muestra **Recibimos tu reporte** (recordar: no se envía a nadie).
- [ ] Con un pedido en curso no puedo eliminar la cuenta.
- [ ] Con una cuenta de prueba sin pedidos en curso puedo eliminarla con mi contraseña.

## Registro de la prueba

| Fecha | Navegador | Quién probó | Qué falló |
|---|---|---|---|
| | | | |
