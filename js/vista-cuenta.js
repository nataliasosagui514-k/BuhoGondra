// Pantallas de cuenta: Splash, registro, inicio de sesión, recuperar contraseña y la
// ventana de invitado. Las reglas están en js/cuenta.js.

/* ---------- Piezas comunes ---------- */

const TRAZOS_DEL_OJO = [
  "M2 12C2 12 5.6 5 12 5C18.4 5 22 12 22 12C22 12 18.4 19 12 19C5.6 19 2 12 2 12Z",
  "M15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12Z",
];

// Único lugar donde se crea un campo de texto con su mensaje de error (Figma 725:2427).
// El error se quita en cuanto se vuelve a escribir.
function crearCampo({ id, etiqueta, tipo = "text", ejemplo = "", ayuda = "", autocompletar = "off", valor = "" }) {
  const nombre = crearElemento("label", "campo__etiqueta", etiqueta);
  nombre.htmlFor = id;
  const entrada = crearElemento("input", "campo__entrada");
  entrada.id = id;
  entrada.type = tipo;
  entrada.placeholder = ejemplo;
  entrada.autocomplete = autocompletar;
  entrada.value = valor;
  if (tipo === "email" || tipo === "password") {
    entrada.autocapitalize = "off";
    entrada.spellcheck = false;
  }

  const control = crearElemento("div", "campo__control");
  control.append(entrada);
  if (tipo === "password") {
    // El ojo muestra u oculta la contraseña
    const ojo = crearElemento("button", "campo__ojo");
    ojo.type = "button";
    ojo.setAttribute("aria-label", "Mostrar contraseña");
    ojo.setAttribute("aria-pressed", "false");
    ojo.append(crearIconoSvg("campo__icono-ojo", 24, TRAZOS_DEL_OJO));
    ojo.addEventListener("click", () => {
      const mostrar = entrada.type === "password";
      entrada.type = mostrar ? "text" : "password";
      ojo.setAttribute("aria-pressed", String(mostrar));
    });
    entrada.classList.add("campo__entrada--con-ojo");
    control.append(ojo);
  }

  const elemento = crearElemento("div", "campo");
  elemento.append(nombre, control);
  const textoDeAyuda = ayuda ? crearElemento("p", "campo__ayuda", ayuda) : null;
  const error = crearElemento("p", "campo__error");
  error.id = `${id}-error`;
  error.setAttribute("role", "alert");

  const quitarError = () => {
    if (!error.isConnected) {
      return;
    }
    elemento.classList.remove("campo--error");
    entrada.removeAttribute("aria-invalid");
    entrada.removeAttribute("aria-describedby");
    error.remove();
    if (textoDeAyuda) {
      elemento.append(textoDeAyuda);
    }
  };
  // El mensaje ocupa el lugar de la ayuda
  const marcarError = (mensaje) => {
    textoDeAyuda?.remove();
    error.textContent = mensaje;
    elemento.classList.add("campo--error");
    entrada.setAttribute("aria-invalid", "true");
    entrada.setAttribute("aria-describedby", error.id);
    elemento.append(error);
  };
  if (textoDeAyuda) {
    elemento.append(textoDeAyuda);
  }
  entrada.addEventListener("input", quitarError);
  return { elemento, entrada, marcarError, quitarError };
}

// Botón principal de un formulario: también se activa con la tecla Enter.
function crearBotonDeEnvio(texto) {
  const boton = crearElemento("button", "boton boton--primario", texto);
  boton.type = "submit";
  return boton;
}

// Botón de texto, como "Cambiar correo" o "Crea tu cuenta".
function crearBotonDeTexto(texto, alTocar) {
  const boton = crearElemento("button", "boton boton--texto boton--mediano", texto);
  boton.type = "button";
  boton.addEventListener("click", alTocar);
  return boton;
}

// "¿Ya tienes cuenta? Inicia sesión"
function crearPieDeCuenta(pregunta, accion, alTocar) {
  const pie = crearElemento("p", "cuenta__pie", pregunta);
  pie.append(crearBotonDeTexto(accion, alTocar));
  return pie;
}

// Paso (opcional), título y explicación.
function crearTitulosDeCuenta({ paso = "", titulo, descripcion }) {
  const titulos = crearElemento("div", "cuenta__titulos");
  if (paso) {
    titulos.append(crearElemento("p", "cuenta__paso", paso));
  }
  titulos.append(
    crearElemento("h1", "cuenta__titulo", titulo),
    crearElemento("p", "cuenta__descripcion", descripcion),
  );
  return titulos;
}

// Encabezado con el botón de volver y, en recuperar contraseña, un título.
function crearEncabezadoDeCuenta(alVolver, titulo = "") {
  const encabezado = crearElemento("header", "encabezado-interno");
  encabezado.append(crearBotonVolver(alVolver));
  if (titulo) {
    encabezado.append(crearElemento("p", "cuenta__encabezado", titulo));
  }
  return encabezado;
}

// Formulario que ocupa el resto de la pantalla; las acciones quedan abajo.
function crearFormularioDeCuenta(alEnviar, campos, acciones) {
  const formulario = crearElemento("form", "cuenta__formulario");
  formulario.noValidate = true; // los mensajes de error son los de Figma
  const contenido = crearElemento("div", "cuenta__campos");
  contenido.append(...campos);
  const pie = crearElemento("div", "cuenta__acciones");
  pie.append(...acciones);
  formulario.append(contenido, pie);
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    alEnviar();
  });
  return formulario;
}

function montarPantallaDeCuenta(contenedor, ...partes) {
  contenedor.querySelector(".cuenta").replaceChildren(...partes);
}

/* ---------- Código de 6 dígitos ---------- */

const CIFRAS_DEL_CODIGO = 6;
const SEGUNDOS_PARA_REENVIAR = 60;

// Cuándo se envió el último código, para el contador de "Reenviar código"
let codigoEnviadoEn = 0;

// Seis casillas: avanzan solas y, al pegar un código, se llenan todas.
function crearCasillas(alCambiar) {
  const grupo = crearElemento("div", "codigo");
  grupo.setAttribute("role", "group");
  // TODO: Figma no define el nombre de las casillas para lectores de pantalla
  grupo.setAttribute("aria-label", "Código de 6 dígitos");
  const casillas = Array.from({ length: CIFRAS_DEL_CODIGO }, (_, posicion) => {
    const casilla = crearElemento("input", "codigo__casilla");
    casilla.type = "text";
    casilla.inputMode = "numeric";
    casilla.autocomplete = posicion === 0 ? "one-time-code" : "off";
    casilla.setAttribute("aria-label", `Dígito ${posicion + 1}`);
    return casilla;
  });
  grupo.append(...casillas);
  const valor = () => casillas.map((casilla) => casilla.value).join("");

  // Escribe los dígitos a partir de una casilla y deja el cursor en la siguiente
  const repartir = (desde, texto) => {
    const digitos = texto.replace(/\D/g, "").slice(0, CIFRAS_DEL_CODIGO);
    const inicio = digitos.length === CIFRAS_DEL_CODIGO ? 0 : desde;
    casillas[desde].value = "";
    [...digitos].slice(0, CIFRAS_DEL_CODIGO - inicio).forEach((digito, paso) => {
      casillas[inicio + paso].value = digito;
    });
    if (digitos) {
      casillas[Math.min(inicio + digitos.length, CIFRAS_DEL_CODIGO - 1)].focus();
    }
    alCambiar(valor());
  };
  casillas.forEach((casilla, posicion) => {
    casilla.addEventListener("input", () => repartir(posicion, casilla.value));
    casilla.addEventListener("focus", () => casilla.select());
    casilla.addEventListener("paste", (evento) => {
      evento.preventDefault();
      repartir(posicion, evento.clipboardData.getData("text"));
    });
    casilla.addEventListener("keydown", (evento) => {
      if (evento.key === "Backspace" && !casilla.value && posicion > 0) {
        evento.preventDefault();
        casillas[posicion - 1].value = "";
        casillas[posicion - 1].focus();
        alCambiar(valor());
      }
    });
  });
  return { elemento: grupo, valor };
}

// Casillas, aviso de código incorrecto, "Reenviar código" y "Cambiar correo". La usan
// "Verifica tu correo" (03) y "Escribe el código" (09).
function crearFormularioDeCodigo({ textoBoton, alVerificar, alReenviar, alCambiarCorreo }) {
  const boton = crearBotonDeEnvio(textoBoton);
  boton.disabled = true; // se activa con las 6 casillas llenas
  let aviso = null;
  const quitarError = () => {
    aviso?.remove();
    aviso = null;
    casillas.elemento.classList.remove("codigo--error");
  };
  const casillas = crearCasillas((codigo) => {
    quitarError();
    boton.disabled = codigo.length < CIFRAS_DEL_CODIGO;
  });

  const reenviar = crearBotonDeTexto("", () => {
    alReenviar();
    codigoEnviadoEn = Date.now();
    contar();
    reloj = setInterval(contar, 1000);
  });
  let reloj = null;
  function contar() {
    const faltan = Math.max(
      0,
      Math.ceil((codigoEnviadoEn + SEGUNDOS_PARA_REENVIAR * 1000 - Date.now()) / 1000),
    );
    const tiempo = `${Math.floor(faltan / 60)}:${String(faltan % 60).padStart(2, "0")}`;
    reenviar.textContent = faltan ? `Reenviar código en ${tiempo}` : "Reenviar código";
    reenviar.disabled = faltan > 0;
    if (!faltan) {
      clearInterval(reloj);
    }
  }
  contar();
  reloj = setInterval(() => {
    // Si ya se salió de la pantalla, el contador se detiene
    if (!reenviar.isConnected) {
      clearInterval(reloj);
      return;
    }
    contar();
  }, 1000);

  const opciones = crearElemento("div", "codigo__opciones");
  opciones.append(reenviar, crearBotonDeTexto("Cambiar correo", alCambiarCorreo));

  const formulario = crearFormularioDeCuenta(
    () => {
      if (casillas.valor().length < CIFRAS_DEL_CODIGO || alVerificar(casillas.valor())) {
        return;
      }
      quitarError();
      casillas.elemento.classList.add("codigo--error");
      aviso = crearAviso("error", "Código incorrecto", "Revisa el código o pide uno nuevo.");
      aviso.setAttribute("role", "alert");
      casillas.elemento.after(aviso);
    },
    [casillas.elemento, opciones],
    [boton],
  );
  formulario.classList.add("cuenta__formulario--codigo");
  return formulario;
}

/* ---------- Registro ---------- */

// Lo que se va completando. Vive solo en memoria: la contraseña no se guarda y, si se
// recarga la página, el registro empieza de nuevo.
let registro = crearRegistroVacio();

function crearRegistroVacio() {
  return { correo: "", contraseña: "", verificado: false, nombre: "", apellido: "", buho: null };
}

// TODO: Figma abre otras pantallas (Centro de ayuda) que todavía no existen
function avisarPantallaPendiente() {
  mostrarAviso("info", "Próximamente");
}

// Etiqueta o aviso del tipo de cuenta según el correo escrito (Figma 02, 02b y 02e).
function crearIndicadorDeTipo(tipo) {
  if (tipo === "no-uca") {
    return null;
  }
  if (tipo === "otro-formato") {
    // TODO: pedir confirmar con el carnet o ID (por definir con Funda Gondra)
    return crearAviso(
      "info",
      "No pudimos saber tu tipo de cuenta",
      "Puedes continuar. Si eres docente o empleado, escríbenos desde Centro de ayuda para activar tu 10 % de descuento.",
    );
  }
  const texto = tipo === "estudiante" ? "Estudiante" : "Docente o empleado UCA · 10 % de descuento";
  const etiqueta = crearElemento("p", `etiqueta etiqueta--${tipo}`);
  etiqueta.append(
    crearIconoSvg("etiqueta__icono", 14, [
      "M9.22 4.67C9.22 5.89 8.22 6.88 7 6.88C5.78 6.88 4.78 5.89 4.78 4.67C4.78 3.44 5.78 2.45 7 2.45C8.22 2.45 9.22 3.44 9.22 4.67Z",
      "M2.63 11.96C2.63 9.57 4.56 7.99 7 7.99C9.45 7.99 11.38 9.57 11.38 11.96",
    ]),
    texto,
  );
  return etiqueta;
}

// 02 · Crear cuenta · Correo
function dibujarRegistroCorreo(contenedor) {
  const correo = crearCampo({
    id: "registro-correo",
    etiqueta: "Correo institucional",
    tipo: "email",
    ejemplo: "tucorreo@uca.edu.sv",
    autocompletar: "email",
    valor: registro.correo,
  });
  const contraseña = crearCampo({
    id: "registro-contrasena",
    etiqueta: "Crea una contraseña",
    tipo: "password",
    ayuda: "Mínimo 8 caracteres",
    autocompletar: "new-password",
    valor: registro.contraseña,
  });
  const tipo = crearElemento("div", "cuenta__tipo");
  tipo.setAttribute("aria-live", "polite");
  const bloqueDeCorreo = crearElemento("div", "cuenta__correo");
  bloqueDeCorreo.append(correo.elemento, tipo);

  const mostrarTipo = () => {
    const indicador = crearIndicadorDeTipo(detectarTipoCorreo(correo.entrada.value));
    tipo.replaceChildren(...(indicador ? [indicador] : []));
  };

  const continuar = crearBotonDeEnvio("Continuar");
  const pie = crearPieDeCuenta("¿Ya tienes cuenta?", "Inicia sesión", () => irAIniciarSesion());
  // 02d: el correo ya tiene cuenta
  const noLaCreaste = crearBotonDeTexto("¿No creaste esta cuenta?", avisarPantallaPendiente);
  noLaCreaste.classList.add("cuenta__enlace-izquierda");
  const entrarConEste = crearBotonDeEnvio("Iniciar sesión con este correo");
  const usarOtro = crearBotonDeTexto("Usar otro correo", () => {
    registro.correo = correo.entrada.value = "";
    correo.quitarError();
    quitarCuentaExistente();
    mostrarTipo();
    correo.entrada.focus();
  });
  let yaTieneCuenta = false;
  const quitarCuentaExistente = () => {
    if (!yaTieneCuenta) {
      return;
    }
    yaTieneCuenta = false;
    noLaCreaste.remove();
    acciones.replaceChildren(continuar, pie);
  };

  const formulario = crearFormularioDeCuenta(
    () => {
      const escrito = normalizarCorreo(correo.entrada.value);
      if (yaTieneCuenta) {
        irAIniciarSesion(escrito);
        return;
      }
      if (detectarTipoCorreo(escrito) === "no-uca") {
        tipo.replaceChildren();
        correo.marcarError(
          escrito ? "Usa tu correo de la UCA (termina en @uca.edu.sv)" : "Escribe tu correo institucional",
        );
        return;
      }
      if (obtenerCuenta(escrito)) {
        yaTieneCuenta = true;
        tipo.replaceChildren();
        correo.marcarError("Este correo ya tiene una cuenta");
        bloqueDeCorreo.append(noLaCreaste);
        acciones.replaceChildren(entrarConEste, usarOtro);
        return;
      }
      if (contraseña.entrada.value.length < MINIMO_CONTRASENA) {
        contraseña.marcarError("Mínimo 8 caracteres");
        return;
      }
      Object.assign(registro, { correo: escrito, contraseña: contraseña.entrada.value, verificado: false });
      generarCodigo(escrito);
      codigoEnviadoEn = Date.now();
      location.hash = "#/registro/codigo";
    },
    [bloqueDeCorreo, contraseña.elemento],
    [continuar, pie],
  );
  const acciones = formulario.querySelector(".cuenta__acciones");
  correo.entrada.addEventListener("input", () => {
    registro.correo = correo.entrada.value;
    quitarCuentaExistente();
    mostrarTipo();
  });
  mostrarTipo();

  montarPantallaDeCuenta(
    contenedor,
    // Atrás regresa a la pantalla desde la que se llegó
    crearEncabezadoDeCuenta(() => (regreso ? regresarA(regreso) : volverA("#/login"))),
    crearTitulosDeCuenta({
      paso: "PASO 1 DE 3",
      titulo: "Crea tu cuenta",
      descripcion: "Usa tu correo institucional de la UCA. Te enviaremos un código para verificarlo.",
    }),
    formulario,
  );
}

// Cada paso pide haber completado los anteriores; si no, regresa al primero.
function faltaUnPaso(completo) {
  if (!completo) {
    location.replace("#/registro/correo");
  }
  return !completo;
}

// 03 · Verifica tu correo
function dibujarRegistroCodigo(contenedor) {
  if (faltaUnPaso(registro.correo && registro.contraseña)) {
    return;
  }
  const cambiarCorreo = () => volverA("#/registro/correo");
  // TODO: quitar este aviso cuando haya envío real de correos. La app no tiene servidor,
  // así que en modo de demostración el código se muestra aquí, sobre sus casillas.
  const demostracion = crearAviso("info", "");
  demostracion.classList.add("codigo__demostracion");
  const mostrarCodigo = (codigo) => {
    demostracion.querySelector(".aviso__titulo").textContent =
      `Modo demostración: tu código es ${codigo}`;
  };
  const formulario = crearFormularioDeCodigo({
    textoBoton: "Verificar",
    alReenviar: () => mostrarCodigo(generarCodigo(registro.correo)),
    alCambiarCorreo: cambiarCorreo,
    alVerificar: (codigo) => {
      if (!verificarCodigo(codigo)) {
        return false;
      }
      registro.verificado = true;
      mostrarAviso("exito", "Correo verificado");
      location.hash = "#/registro/datos";
      return true;
    },
  });
  // Un código ya usado no se vuelve a mostrar
  if (codigoActivo) {
    mostrarCodigo(codigoActivo.codigo);
    formulario.querySelector(".cuenta__campos").prepend(demostracion);
  }
  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(cambiarCorreo),
    crearTitulosDeCuenta({
      paso: "PASO 2 DE 3",
      titulo: "Verifica tu correo",
      descripcion: `Te enviamos un código de 6 dígitos a ${registro.correo}. Vence en 10 minutos.`,
    }),
    formulario,
  );
}

// 04 y 06 · Tus datos
// TODO: revisar con Figma. La cuenta no se crea aquí sino en 07, con "Aceptar y
// continuar"; nombre y apellido se quedan en esta pantalla (#/registro/datos).
function dibujarRegistroDatos(contenedor) {
  if (faltaUnPaso(registro.verificado)) {
    return;
  }
  const campos = [
    { clave: "nombre", etiqueta: "Nombre", autocompletar: "given-name" },
    { clave: "apellido", etiqueta: "Apellido", autocompletar: "family-name" },
  ].map(({ clave, etiqueta, autocompletar }) => {
    const campo = crearCampo({
      id: `registro-${clave}`,
      etiqueta,
      autocompletar,
      valor: registro[clave],
    });
    campo.entrada.addEventListener("input", () => {
      registro[clave] = campo.entrada.value;
    });
    return { ...campo, clave, etiqueta };
  });

  const miniatura = crearImagen(
    "buho-de-perfil__imagen",
    registro.buho ? `img/avatar-buho-${registro.buho}.png` : "img/buho-taza.png",
  );
  const marco = crearElemento("span", "buho-de-perfil__marco");
  marco.append(miniatura);
  const textos = crearElemento("div", "buho-de-perfil__textos");
  textos.append(
    crearElemento("p", "buho-de-perfil__titulo", "Búhi de perfil"),
    crearElemento(
      "p",
      "buho-de-perfil__detalle",
      registro.buho ? `Elegiste a Búhi ${registro.buho}` : "Aún no eliges tu búho mascota",
    ),
  );
  const tarjeta = crearElemento("div", "buho-de-perfil");
  tarjeta.append(
    marco,
    textos,
    crearBotonDeTexto(registro.buho ? "Cambiar" : "Elegir", () => {
      location.hash = "#/registro/buho";
    }),
  );

  const registrar = crearBotonDeEnvio("Registrar");
  registrar.disabled = !registro.buho;
  const nota = crearElemento("p", "cuenta__nota", "Elige tu búho para poder registrarte");

  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(() => location.replace("#/registro/correo")),
    crearTitulosDeCuenta({
      paso: "PASO 3 DE 3",
      titulo: "Crea tu cuenta",
      descripcion: "Completa tus datos y elige el búho que será tu perfil.",
    }),
    crearFormularioDeCuenta(
      () => {
        const vacios = campos.filter((campo) => !registro[campo.clave].trim());
        // TODO: Figma no define estos mensajes
        vacios.forEach((campo) => campo.marcarError(`Escribe tu ${campo.etiqueta.toLowerCase()}`));
        if (!vacios.length && registro.buho) {
          location.hash = "#/registro/terminar";
        }
      },
      [...campos.map((campo) => campo.elemento), tarjeta],
      registro.buho ? [registrar] : [nota, registrar],
    ),
  );
}

// Un búho de la cuadrícula (Figma 901:3528). Es un botón de opción.
function crearOpcionDeBuho(numero, elegido, alElegir) {
  const entrada = crearElemento("input", "opcion-buho__entrada");
  entrada.type = "radio";
  entrada.name = "buho";
  entrada.value = numero;
  entrada.checked = elegido;
  entrada.setAttribute("aria-label", `Búhi ${numero}`);
  entrada.addEventListener("change", () => alElegir(numero));
  const imagen = crearImagen("opcion-buho__imagen", `img/avatar-buho-${numero}.png`);
  const insignia = crearElemento("span", "opcion-buho__insignia");
  insignia.append(crearIconoSvg("opcion-buho__palomita", 14, ["M2.92 7.29L5.54 9.92L11.08 4.38"]));
  const opcion = crearElemento("label", "opcion-buho");
  opcion.append(entrada, crearElemento("span", "opcion-buho__circulo"), imagen, insignia);
  return opcion;
}

// 05 · Elige a tu búho
function dibujarRegistroBuho(contenedor) {
  if (faltaUnPaso(registro.verificado)) {
    return;
  }
  let elegido = registro.buho;
  const volverADatos = () => volverA("#/registro/datos");
  const vista = crearElemento("div", "vista-de-buho");
  vista.setAttribute("aria-live", "polite");
  const confirmar = crearBotonDeEnvio("Elegir este búho");
  const mostrarElegido = () => {
    confirmar.disabled = !elegido;
    if (!elegido) {
      // TODO: Figma no dibuja la vista previa sin búho; el texto es el de su nota
      vista.replaceChildren(
        crearElemento("p", "vista-de-buho__vacia", "Debes seleccionar un búho para continuar"),
      );
      return;
    }
    const grande = crearImagen("vista-de-buho__imagen", `img/buho-perfil-${elegido}.png`);
    vista.replaceChildren(grande,crearElemento("p", "vista-de-buho__nombre", `Búhi ${elegido}`));
  };

  const cuadricula = crearElemento("fieldset", "opciones-de-buho");
  // TODO: Figma no define el nombre del grupo para lectores de pantalla
  cuadricula.setAttribute("aria-label", "Búhos disponibles");
  cuadricula.append(
    ...Array.from({ length: CANTIDAD_DE_BUHOS }, (_, posicion) =>
      crearOpcionDeBuho(posicion + 1, elegido === posicion + 1, (numero) => {
        elegido = numero;
        mostrarElegido();
      }),
    ),
  );
  mostrarElegido();

  const formulario = crearFormularioDeCuenta(
    () => {
      if (elegido) {
        registro.buho = elegido;
        volverADatos();
      }
    },
    [vista, cuadricula],
    [confirmar],
  );
  formulario.classList.add("cuenta__formulario--buho");

  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(volverADatos),
    crearTitulosDeCuenta({
      paso: "PASO 3 DE 3",
      titulo: "Elige a tu búhi",
      descripcion: "Será tu foto de perfil en BúhoGondra.",
    }),
    formulario,
  );
}

// 07 · Términos y condiciones. Aquí se crea la cuenta.
function dibujarRegistroTerminar(contenedor) {
  if (faltaUnPaso(registro.verificado && registro.nombre && registro.apellido && registro.buho)) {
    return;
  }
  const enlace = crearElemento("button", "bienvenida__enlace", "Términos y Condiciones");
  enlace.type = "button";
  enlace.addEventListener("click", avisarPantallaPendiente);
  const texto = crearElemento(
    "p",
    "bienvenida__texto",
    "Te invitamos a revisar nuestras políticas de seguridad. Al presionar “Aceptar y continuar”, declaras tu conformidad con nuestros ",
  );
  texto.append(enlace, ".");
  const bienvenida = crearElemento("div", "bienvenida");
  bienvenida.append(
    crearImagen("bienvenida__imagen", "img/buho-taza.png"),
    crearElemento("h1", "bienvenida__titulo", "Bienvenid@ a BúhoGondra"),
    texto,
  );

  const aceptar = crearBotonDeEnvio("Aceptar y continuar");
  const formulario = crearFormularioDeCuenta(
    async () => {
      aceptar.disabled = true; // evita crear la cuenta dos veces
      const { correo, contraseña, buho, nombre, apellido } = registro;
      const resultado = await crearCuenta(correo, contraseña, buho, { nombre, apellido });
      if (!resultado.ok) {
        aceptar.disabled = false;
        // TODO: Figma no define este aviso
        mostrarAviso("error", "No se pudo crear tu cuenta");
        return;
      }
      registro = crearRegistroVacio();
      terminarEntrada();
    },
    [bienvenida],
    [aceptar],
  );

  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(() => volverA("#/registro/datos")),
    formulario,
  );
}

/* ---------- Splash (Figma 976:4524) ---------- */

const DURACION_DEL_SPLASH = 4500;
let relojDelSplash = null;

// "Búho" en naranja y "Gondra" en azul
function crearMarca(etiqueta) {
  const marca = crearElemento(etiqueta, "marca__nombre");
  marca.append(
    crearElemento("span", "marca__buho", "Búho"),
    crearElemento("span", "marca__gondra", "Gondra"),
  );
  return marca;
}

function crearImagen(clase, ruta, descripcion = "") {
  const imagen = crearElemento("img", clase);
  imagen.src = ruta;
  imagen.alt = descripcion;
  return imagen;
}

// Dura 4.5 segundos y no se puede saltar. Con sesión pasa al menú; sin ella, a 01.
function dibujarSplash(contenedor) {
  const splash = crearElemento("div", "splash");
  splash.append(
    crearElemento("div", "splash__franja"),
    crearImagen("splash__logo-uca", "img/logo-cafeteria-uca.png", "Cafetería UCA"),
    crearMarca("h1"),
    crearImagen("splash__humo", "img/splash-humo.svg"),
    crearImagen("splash__buho", "img/buho-taza.png"),
  );
  montarPantallaDeCuenta(contenedor, splash);
  clearTimeout(relojDelSplash);
  relojDelSplash = setTimeout(() => {
    if (location.hash === "#/splash") {
      location.replace(obtenerSesion() ? "#/menu" : "#/login");
    }
  }, DURACION_DEL_SPLASH);
}

/* ---------- Inicia sesión (Figma 940:4228 y 1412:9942) ---------- */

// Correo que llega ya escrito a "Inicia sesión"
let correoParaIniciar = "";
// Lo que hace la pantalla abierta cuando vuelve internet
let alVolverLaConexion = null;
window.addEventListener("online", () => alVolverLaConexion?.());

// Va a "Inicia sesión", con el correo ya escrito si se recibe.
function irAIniciarSesion(correo = "") {
  correoParaIniciar = correo;
  location.hash = "#/login";
}

// El aviso que va arriba del formulario según lo que falló.
function redactarErrorDeInicio({ motivo, intentos }) {
  if (motivo !== "credenciales") {
    // TODO: Figma no define el aviso de un error general
    return ["error", "No se pudo iniciar sesión"];
  }
  return intentos >= INTENTOS_PARA_AVISAR
    ? [
        "info",
        "¿Olvidaste tu contraseña?",
        `Llevas ${intentos} intentos. Puedes crear una nueva con tu correo UCA en un minuto.`,
      ]
    : ["error", "Correo o contraseña incorrectos", "Revisa los dos datos e inténtalo de nuevo."];
}

function dibujarLogin(contenedor) {
  if (obtenerSesion()) {
    location.replace("#/menu");
    return;
  }
  const correo = crearCampo({
    id: "inicio-correo",
    etiqueta: "Correo institucional",
    tipo: "email",
    ejemplo: "tucorreo@uca.edu.sv",
    autocompletar: "username",
    valor: correoParaIniciar,
  });
  const contraseña = crearCampo({
    id: "inicio-contrasena",
    etiqueta: "Contraseña",
    tipo: "password",
    ejemplo: "Escribe tu contraseña",
    autocompletar: "current-password",
  });
  correoParaIniciar = "";
  const espacio = crearElemento("div", "inicio__espacio");
  if (contraseñaRecienCambiada) {
    contraseñaRecienCambiada = false;
    // El logo baja para que el aviso de arriba no lo tape (11)
    espacio.classList.add("inicio__espacio--bajo-aviso");
    anunciarContraseñaActualizada(contraseña.entrada);
  }

  const olvidaste = crearBotonDeTexto("¿Olvidaste tu contraseña?", () =>
    irARecuperar(correo.entrada.value.trim()),
  );
  const filaOlvidaste = crearElemento("div", "inicio__olvidaste");
  filaOlvidaste.append(olvidaste);

  const entrar = crearBotonDeEnvio("Iniciar sesión");
  // N15b: si se venía a apartar, un aviso recuerda el platillo
  const paraApartar = regreso?.tipo === "apartar" ? regreso : null;
  const recordatorio =
    paraApartar &&
    crearAviso(
      "info",
      "Inicia sesión para apartar",
      `${paraApartar.platillo} te espera. Al entrar, regresas a ese platillo.`,
    );
  let aviso = null;
  const quitarAviso = () => {
    aviso?.remove();
    aviso = null;
    entrar.textContent = "Iniciar sesión";
    alVolverLaConexion = null;
    if (recordatorio && !recordatorio.isConnected) {
      formulario.before(recordatorio);
    }
  };
  const mostrarError = (...datos) => {
    quitarAviso();
    recordatorio?.remove();
    aviso = crearAviso(...datos);
    aviso.setAttribute("role", "alert");
    formulario.before(aviso);
  };

  const marca = crearElemento("div", "marca");
  const lema = crearElemento("p", "marca__lema", "El menú de las cafeterías UCA, en tu mano");
  marca.append(crearMarca("h1"), crearImagen("marca__imagen", "img/buho-taza.png"), lema);

  const comoInvitado = paraApartar
    ? crearBotonDeTexto("Volver al platillo", () => regresarA(paraApartar))
    : crearBotonDeTexto("Ver el menú como invitado", () => {
        location.hash = "#/menu";
      });
  const pie = crearPieDeCuenta("¿No tienes cuenta?", "Crea tu cuenta", () => {
    location.hash = "#/registro/correo";
  });

  const formulario = crearFormularioDeCuenta(
    async () => {
      quitarAviso();
      const escrito = correo.entrada.value.trim();
      // Con un campo vacío no se envía nada (01b)
      if (!escrito) {
        correo.marcarError("Escribe tu correo institucional");
      }
      if (!contraseña.entrada.value) {
        contraseña.marcarError("Escribe tu contraseña");
      }
      if (!escrito || !contraseña.entrada.value) {
        return;
      }
      if (navigator.onLine === false) {
        mostrarError(
          "error",
          "Sin conexión",
          "Revisa tu internet e inténtalo de nuevo. Tus datos siguen escritos.",
        );
        entrar.textContent = "Reintentar";
        alVolverLaConexion = quitarAviso;
        return;
      }
      entrar.disabled = true;
      const resultado = await iniciarSesion(escrito, contraseña.entrada.value);
      entrar.disabled = false;
      if (resultado.ok) {
        terminarEntrada();
        return;
      }
      mostrarError(...redactarErrorDeInicio(resultado));
      if (resultado.intentos >= INTENTOS_PARA_AVISAR) {
        olvidaste.textContent = "Crear una nueva contraseña";
      }
    },
    [correo.elemento, contraseña.elemento, filaOlvidaste],
    [entrar, comoInvitado, pie],
  );
  formulario.classList.add("inicio__formulario");
  // El aviso se quita al editar un campo
  formulario.addEventListener("input", quitarAviso);
  if (intentosFallidos >= INTENTOS_PARA_AVISAR) {
    olvidaste.textContent = "Crear una nueva contraseña";
  }

  montarPantallaDeCuenta(contenedor, espacio, marca, formulario);
  if (recordatorio) {
    formulario.before(recordatorio);
  }
  // Con el correo ya escrito tras cambiar la contraseña, el cursor queda en ella (11)
  if (enfocarContraseña) {
    enfocarContraseña = false;
    contraseña.entrada.focus();
  }
}

/* ---------- Recuperar contraseña (Figma, sección 1156:7059) ---------- */

const DURACION_DE_CONTRASEÑA_ACTUALIZADA = 5000;
// El correo que se está recuperando y si su código ya se verificó. Solo en memoria
let recuperacion = { correo: "", verificado: false };
let contraseñaRecienCambiada = false;
let enfocarContraseña = false;

function irARecuperar(correo) {
  recuperacion = { correo, verificado: false };
  location.hash = "#/recuperar";
}

// 11: aviso arriba de "Inicia sesión"; se va a los 5 s o al empezar a escribir.
function anunciarContraseñaActualizada(entrada) {
  const aviso = mostrarAviso(
    "exito",
    "Contraseña actualizada",
    "Entra con tu nueva contraseña.",
    DURACION_DE_CONTRASEÑA_ACTUALIZADA,
  );
  entrada.addEventListener("input", () => aviso.remove(), { once: true });
  enfocarContraseña = true;
}

function crearPantallaDeRecuperar(contenedor, alVolver, titulo, descripcion, formulario) {
  montarPantallaDeCuenta(
    contenedor,
    crearEncabezadoDeCuenta(alVolver, "Recuperar contraseña"),
    crearTitulosDeCuenta({ titulo, descripcion }),
    formulario,
  );
}

// 08 y 08b
function dibujarRecuperar(contenedor) {
  const correo = crearCampo({
    id: "recuperar-correo",
    etiqueta: "Correo institucional",
    tipo: "email",
    ejemplo: "tucorreo@uca.edu.sv",
    autocompletar: "email",
    valor: recuperacion.correo,
  });
  crearPantallaDeRecuperar(
    contenedor,
    () => volverA("#/login"),
    "¿Olvidaste tu contraseña?",
    "Escribe tu correo de la UCA y te enviaremos un código para crear una nueva.",
    crearFormularioDeCuenta(
      () => {
        const escrito = normalizarCorreo(correo.entrada.value);
        // Solo se revisa el formato: no se dice si el correo tiene cuenta
        if (detectarTipoCorreo(escrito) === "no-uca") {
          correo.marcarError("Revisa el correo: debe terminar en @uca.edu.sv");
          return;
        }
        recuperacion = { correo: escrito, verificado: false };
        enviarCodigoDeRecuperacion(escrito);
        codigoEnviadoEn = Date.now();
        location.hash = "#/recuperar/codigo";
      },
      [correo.elemento],
      [crearBotonDeEnvio("Enviar código")],
    ),
  );
}

// 09 y 09b
function dibujarRecuperarCodigo(contenedor) {
  if (!recuperacion.correo) {
    location.replace("#/recuperar");
    return;
  }
  const cambiarCorreo = () => volverA("#/recuperar");
  crearPantallaDeRecuperar(
    contenedor,
    cambiarCorreo,
    "Escribe el código",
    `Si ${recuperacion.correo} tiene una cuenta, te enviamos un código de 6 dígitos. Vence en 10 minutos.`,
    crearFormularioDeCodigo({
      textoBoton: "Continuar",
      alReenviar: () => enviarCodigoDeRecuperacion(recuperacion.correo),
      alCambiarCorreo: cambiarCorreo,
      alVerificar: (codigo) => {
        if (!verificarCodigo(codigo)) {
          return false;
        }
        recuperacion.verificado = true;
        location.hash = "#/recuperar/nueva";
        return true;
      },
    }),
  );
}

// 10 y 10b
function dibujarRecuperarNueva(contenedor) {
  if (!recuperacion.verificado) {
    location.replace("#/recuperar");
    return;
  }
  const nueva = crearCampo({
    id: "recuperar-nueva",
    etiqueta: "Nueva contraseña",
    tipo: "password",
    ayuda: "Mínimo 8 caracteres",
    autocompletar: "new-password",
  });
  const repetida = crearCampo({
    id: "recuperar-repetida",
    etiqueta: "Repite la nueva contraseña",
    tipo: "password",
    autocompletar: "new-password",
  });
  const guardar = crearBotonDeEnvio("Guardar contraseña");
  crearPantallaDeRecuperar(
    contenedor,
    () => location.replace("#/recuperar"),
    "Crea tu nueva contraseña",
    "Usa al menos 8 caracteres. Escríbela dos veces para confirmarla.",
    crearFormularioDeCuenta(
      async () => {
        if (nueva.entrada.value.length < MINIMO_CONTRASENA) {
          nueva.marcarError("Mínimo 8 caracteres");
          return;
        }
        if (repetida.entrada.value !== nueva.entrada.value) {
          repetida.marcarError("Las contraseñas no coinciden");
          return;
        }
        guardar.disabled = true;
        const { correo } = recuperacion;
        if (!(await restablecerContrasena(correo, nueva.entrada.value))) {
          guardar.disabled = false;
          // TODO: Figma no define este aviso
          mostrarAviso("error", "No se pudo guardar tu contraseña");
          return;
        }
        recuperacion = { correo: "", verificado: false };
        correoParaIniciar = correo;
        contraseñaRecienCambiada = true;
        location.replace("#/login");
      },
      [nueva.elemento, repetida.elemento],
      [guardar],
    ),
  );
}

/* ---------- Invitado (Figma 1003:4839 y sección 1429:10116) ---------- */

// A dónde se regresa al entrar: { hash, tipo }. Solo en memoria
let regreso = null;
// Lo que una persona invitada había elegido al tocar "Apartar"
let lineaDeInvitado = null;

// Única función que crea la ventana de invitado. Tocar fuera es "Ahora no": se queda
// en la pantalla.
function pedirCuenta(contenedor, { titulo, mensaje, destino }) {
  const ir = (ruta) => {
    regreso = destino;
    location.hash = ruta;
  };
  const ventana = crearVentana({
    tipo: "invitado",
    titulo,
    mensaje,
    textoBoton: "Iniciar sesión",
    alTocar: () => ir("#/login"),
    segundo: { texto: "Crear cuenta", alTocar: () => ir("#/registro/correo") },
    alCerrar: () => {
      ventana.close();
      ventana.remove();
    },
  });
  abrirDialogo(contenedor, ventana);
}

// N15a: "Inicia sesión para apartar"
function pedirCuentaParaApartar(platillo, linea) {
  lineaDeInvitado = linea;
  pedirCuenta(document.getElementById("contenido"), {
    titulo: "Inicia sesión para apartar",
    mensaje:
      "Necesitas tu cuenta UCA para apartar y recibir tu ticket con PIN. Después regresas a este platillo.",
    destino: { hash: location.hash, tipo: "apartar" },
  });
}

// Vuelve a la pantalla desde la que se pidió la cuenta
function regresarA({ hash }) {
  volverA(hash.split("?")[0], hash);
}

// Al salir de las pantallas de cuenta se olvida lo que quedó a medias
function salirDeCuenta() {
  regreso = null;
  registro = crearRegistroVacio();
  recuperacion = { correo: "", verificado: false };
}

/* ---------- Entrar a la app ---------- */

// Lo que pasa al iniciar sesión o crear la cuenta: va al menú, o regresa a donde se
// estaba si venía como invitado.
function terminarEntrada() {
  const destino = regreso;
  regreso = null;
  if (!destino) {
    location.replace("#/menu");
    return;
  }
  regresarA(destino);
  if (destino.tipo === "apartar") {
    // N15c
    // TODO: revisar con Figma, que nombra el platillo en este aviso
    mostrarAviso("exito", "Ya iniciaste sesión", "Ahora puedes apartar tu pedido.");
  }
}
