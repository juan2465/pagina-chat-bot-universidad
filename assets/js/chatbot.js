
let chatbotState = "negocio";
let negocioActual = "";
let productoSeleccionado = null;
let productosVisibles = [];
let clienteCora = {
    nombre: "",
    email: ""
};

let pinEnviado = false;

const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSend = document.getElementById("chatbot-send");

const catalogos = {
    restaurante: [
        {
            nombre: "Hamburguesa Clásica",
            precio: 18000,
            descripcion: "Una hamburguesa tradicional y sencilla."
        },
        {
            nombre: "Hamburguesa BBQ",
            precio: 22000,
            descripcion: "Una hamburguesa con salsa BBQ para un sabor diferente."
        },
        {
            nombre: "Hamburguesa Especial",
            precio: 25000,
            descripcion: "Una opción más completa para una experiencia especial."
        },
        {
            nombre: "Combo Clásico",
            precio: 25000,
            descripcion: "Hamburguesa clásica acompañada de papas y bebida."
        },
        {
            nombre: "Combo BBQ",
            precio: 29000,
            descripcion: "Hamburguesa BBQ acompañada de papas y bebida."
        }
    ],

    gimnasio: [
        {
            nombre: "Plan semanal",
            precio: 25000,
            descripcion: "Acceso al gimnasio durante siete días.",
            tipo: "plan"
        },
        {
            nombre: "Plan mensual Básico",
            precio: 60000,
            descripcion: "Acceso al gimnasio durante un mes.",
            tipo: "plan"
        },
        {
            nombre: "Plan mensual Plus",
            precio: 80000,
            descripcion: "Acceso al gimnasio y clases grupales durante un mes.",
            tipo: "plan"
        },
        {
            nombre: "Plan mensual Premium",
            precio: 110000,
            descripcion: "Acceso al gimnasio, clases y asesoría personalizada durante un mes.",
            tipo: "plan"
        },
        {
            nombre: "Proteína deportiva",
            precio: 120000,
            descripcion: "Producto deportivo de ejemplo.",
            tipo: "producto"
        },
        {
            nombre: "Botella deportiva",
            precio: 35000,
            descripcion: "Botella reutilizable para tus entrenamientos.",
            tipo: "producto"
        },
        {
            nombre: "Camiseta deportiva",
            precio: 55000,
            descripcion: "Camiseta deportiva de ejemplo.",
            tipo: "producto"
        },
        {
            nombre: "Guantes de entrenamiento",
            precio: 40000,
            descripcion: "Guantes para entrenar.",
            tipo: "producto"
        }
    ]
};



function normalizeText(text) {
    return String(text)
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatPrice(value) {
    return Number(value).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

function scrollChat() {
    if (chatbotMessages) {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
}

function addUserMessage(message) {
    if (!chatbotMessages) return;

    const element = document.createElement("div");
    element.className = "chatbot-message user";

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message;

    element.appendChild(content);
    chatbotMessages.appendChild(element);

    scrollChat();
}

function addBotMessage(message) {
    if (!chatbotMessages) return;

    const element = document.createElement("div");
    element.className = "chatbot-message bot";

    const content = document.createElement("div");
    content.className = "message-content";

    content.innerHTML = message;

    element.appendChild(content);
    chatbotMessages.appendChild(element);

    scrollChat();
}

function sendChatMessage() {
    if (!chatbotInput) return;

    const message = chatbotInput.value.trim();

    if (!message) return;

    addUserMessage(message);
    chatbotInput.value = "";

    processMessage(message);
}

function sendQuickMessage(message) {
    addUserMessage(message);
    processMessage(message);
}




function showBusinessMenu() {
    chatbotState = "inicio-cora";
    negocioActual = "";
    productoSeleccionado = null;
    productosVisibles = [];

    addBotMessage(`
        <strong>¡Hola! 👋 Soy Cora, la asistente virtual de ByteCore.</strong>
        <br><br>
        Ayudamos a pequeños negocios a mejorar la atención
        de sus clientes mediante páginas web y asistentes virtuales.
        <br><br>
        <strong>¿Cómo puedo ayudarte hoy?</strong>
        <br><br>
        <strong>1.</strong> Probar una demostración interactiva
        <br>
        <strong>2.</strong> Quiero una solución para mi negocio
        <br><br>
        <em>Escribe 1 o 2 para continuar.</em>
    `);
}

function showDemoMenu() {
    chatbotState = "negocio";

    addBotMessage(`
        <strong>¡Explora lo que Cora puede hacer!</strong>
        <br><br>
        <strong>1.</strong> 🍔 BurgerByte — Restaurante
        <br>
        <strong>2.</strong> 🏋️ GymByte — Gimnasio
        <br><br>
        Podrás consultar productos, precios y opciones
        en estos negocios de demostración.
        <br><br>
        Escribe <strong>0</strong> para volver al inicio.
    `);
}


function showMainMenu() {
    chatbotState = "menu-principal";

    const esGimnasio = negocioActual === "gimnasio";

    addBotMessage(`
        <strong>${esGimnasio ? "🏋️ Bienvenido a GymByte" : "🍔 Bienvenido a BurgerByte"}</strong>
        <br><br>
        ${
            esGimnasio
                ? "Consulta planes de entrenamiento o explora productos deportivos."
                : "Puedo recomendarte una hamburguesa o ayudarte a revisar el menú."
        }
        <br><br>
        ${
            esGimnasio
                ? `
                    <strong>1.</strong> Ver planes semanales y mensuales<br>
                    <strong>2.</strong> Ver productos deportivos<br>
                    <strong>3.</strong> Ver todas las opciones<br>
                `
                : `
                    <strong>1.</strong> Recomiéndame algo<br>
                    <strong>2.</strong> Quiero algo económico<br>
                    <strong>3.</strong> Quiero algo especial<br>
                    <strong>4.</strong> Ver menú<br>
                `
        }
        <strong>5.</strong> Contactar con ByteCore
        <br><br>
        <strong>0.</strong> Elegir otro negocio
    `);
}



function processMessage(message) {
    const text = normalizeText(message);

    if (
        text === "0" ||
        text === "volver al inicio" ||
        text === "reiniciar"
    ) {
        showBusinessMenu();
        return;
    }

    switch (chatbotState) {
        
        case "inicio-cora":
            if (text === "1" || text.includes("demo")) {
                showDemoMenu();
            } else if (
                text === "2" ||
                text.includes("negocio") ||
                text.includes("solucion") ||
                text.includes("servicio")
            ) {
                chatbotState = "lead-tipo";

                addBotMessage(`
                    <strong>¡Hablemos de tu negocio!</strong>
                    <br><br>
                    ¿A qué tipo de negocio quieres ayudar
                    a mejorar su atención?
                    <br><br>
                    Por ejemplo: restaurante, gimnasio,
                    tienda, emprendimiento o servicios profesionales.
                `);
            } else {
                addBotMessage(
                    "Escribe 1 para probar una demo o 2 para conocer la solución para tu negocio."
                );
            }
            break;

        case "lead-tipo":
            if (message.trim().length < 2) {
                addBotMessage(
                    "Cuéntame qué tipo de negocio tienes o administras."
                );
                break;
            }

            clienteCora.tipoNegocio = message.trim().slice(0, 100);
            chatbotState = "lead-necesidad";

            addBotMessage(`
                ¿Qué te gustaría mejorar primero?
                <br><br>
                Por ejemplo: responder preguntas frecuentes,
                mostrar servicios y precios, recibir solicitudes
                o facilitar el contacto con tus clientes.
            `);
            break;

        case "lead-necesidad":
            if (message.trim().length < 5) {
                addBotMessage(
                    "Cuéntame un poco más sobre lo que necesitas."
                );
                break;
            }

            clienteCora.necesidad = message.trim().slice(0, 1000);
            chatbotState = "lead-nombre";

            addBotMessage(
                "¿Cómo te llamas? Así podremos identificar tu solicitud."
            );
            break;

        case "lead-nombre":
            if (message.trim().length < 2) {
                addBotMessage("Escribe tu nombre para continuar.");
                break;
            }

            clienteCora.nombre = message.trim().slice(0, 100);
            chatbotState = "lead-email";

            addBotMessage(
                "¿Cuál es tu correo electrónico de contacto?"
            );
            break;

        case "lead-email":
            enviarSolicitudComercial(message.trim());
            break;

        case "negocio":
            if (
                text === "1" ||
                text.includes("burger") ||
                text.includes("restaurante")
            ) {
                negocioActual = "restaurante";
                showMainMenu();
            } else if (
                text === "2" ||
                text.includes("gym") ||
                text.includes("gimnasio")
            ) {
                negocioActual = "gimnasio";
                showMainMenu();
            } else {
                addBotMessage(
                    "Elige <strong>1</strong> para BurgerByte o <strong>2</strong> para GymByte."
                );
            }
            break;

        case "menu-principal":
            handleMainMenu(text);
            break;

        case "preferencia":
            handlePreference(text);
            break;

        case "catalogo":
            handleCatalogSelection(text);
            break;

        case "confirmar-compra":
            if (
                text === "1" ||
                text.includes("continuar") ||
                text === "si"
            ) {
                chatbotState = "nombre-compra";

                addBotMessage(`
                    Perfecto. Escribe el nombre que quieres mostrar en el comprobante de demostración.
                    <br><br>
                    <em>No escribas contraseñas ni datos bancarios.</em>
                `);
            } else if (
                text === "2" ||
                text.includes("otro") ||
                text.includes("menu")
            ) {
                showMainMenu();
            } else {
                addBotMessage(
                    "Escribe <strong>1</strong> para continuar con la simulación o <strong>2</strong> para volver al menú."
                );
            }
            break;

       
case "nombre-compra": {
    const nombre = message.trim();

    if (nombre.length < 2 || nombre.length > 80) {
        addBotMessage("Escribe un nombre válido de entre 2 y 80 caracteres.");
        break;
    }

    clienteCora.nombre = nombre;
    chatbotState = "correo-compra";

    addBotMessage(`
        ¡Gracias, ${escapeHTML(nombre)}! 😊
        <br><br>
        Ahora escribe tu correo electrónico para enviarte un PIN de verificación.
        <br><br>
        <em>Esta compra continúa siendo una demostración sin pago real.</em>
    `);
    break;
}

case "correo-compra":
    solicitarPinCora(message.trim());
    break;

case "verificar-pin":
    verificarPinCora(message.trim());
    break;


        case "contacto":
            addBotMessage(`
                Puedes utilizar el formulario de contacto de esta página para comunicarte con ByteCore.
                <br><br>
                Escribe <strong>0</strong> para volver al inicio.
            `);
            break;

        case "fin":
            if (text === "1" || text.includes("explorar")) {
                showMainMenu();
            } else if (
                text === "2" ||
                text.includes("otro negocio") ||
                text.includes("cambiar")
            ) {
                showBusinessMenu();
            } else {
                addBotMessage(`
                    <strong>¿Qué quieres hacer ahora?</strong>
                    <br><br>
                    <strong>1.</strong> Explorar este negocio
                    <br>
                    <strong>2.</strong> Elegir otro negocio
                    <br>
                    <strong>0.</strong> Volver al inicio
                `);
            }
            break;

        default:
            showBusinessMenu();
    }
}



function handleMainMenu(text) {
    if (negocioActual === "gimnasio") {
        if (
            text === "1" ||
            text.includes("plan") ||
            text.includes("mensual") ||
            text.includes("semanal")
        ) {
            showCatalog("planes");
        } else if (
            text === "2" ||
            text.includes("producto")
        ) {
            showCatalog("productos");
        } else if (
            text === "3" ||
            text.includes("todas")
        ) {
            showCatalog("todos");
        } else if (
            text === "5" ||
            text.includes("contacto")
        ) {
            showContact();
        } else {
            addBotMessage(
                "Selecciona una opción del 1 al 3, escribe 5 para contacto o 0 para volver."
            );
        }

        return;
    }

    if (text === "1" || text.includes("recomienda")) {
        startRecommendation();
    } else if (
        text === "2" ||
        text.includes("economico") ||
        text.includes("barato")
    ) {
        showRecommendation(catalogos.restaurante[0]);
    } else if (
        text === "3" ||
        text.includes("especial")
    ) {
        showRecommendation(catalogos.restaurante[2]);
    } else if (
        text === "4" ||
        text.includes("menu")
    ) {
        showCatalog("todos");
    } else if (
        text === "5" ||
        text.includes("contacto")
    ) {
        showContact();
    } else {
        addBotMessage(
            "Selecciona una opción del menú o escribe <strong>0</strong> para elegir otro negocio."
        );
    }
}


function startRecommendation() {
    chatbotState = "preferencia";

    addBotMessage(`
        ¡Vamos a encontrar algo para ti! 😋
        <br><br>
        ¿Qué prefieres?
        <br><br>
        <strong>1.</strong> Algo clásico y económico
        <br>
        <strong>2.</strong> Algo con sabor BBQ
        <br>
        <strong>3.</strong> Algo más especial
        <br>
        <strong>4.</strong> Un combo
        <br><br>
        <strong>0.</strong> Volver al inicio
    `);
}

function handlePreference(text) {
    if (text === "1") {
        showRecommendation(catalogos.restaurante[0]);
    } else if (text === "2") {
        showRecommendation(catalogos.restaurante[1]);
    } else if (text === "3") {
        showRecommendation(catalogos.restaurante[2]);
    } else if (text === "4") {
        showRecommendation(catalogos.restaurante[4]);
    } else {
        addBotMessage(
            "Elige 1 para clásico, 2 para BBQ, 3 para especial o 4 para un combo."
        );
    }
}



function showCatalog(tipo) {
    const productos = catalogos[negocioActual] || [];

    productosVisibles = productos.filter(producto => {
        if (tipo === "todos") {
            return true;
        }

        if (negocioActual === "gimnasio") {
            return producto.tipo === (
                tipo === "planes" ? "plan" : "producto"
            );
        }

        return true;
    });

    chatbotState = "catalogo";

    let titulo;

    if (negocioActual === "gimnasio") {
        if (tipo === "planes") {
            titulo = "📅 PLANES DEL GIMNASIO";
        } else if (tipo === "productos") {
            titulo = "🛍️ PRODUCTOS DEPORTIVOS";
        } else {
            titulo = "🏋️ PLANES Y PRODUCTOS";
        }
    } else {
        titulo = "🍔 MENÚ BURGERBYTE";
    }

    let lista = "";

    productosVisibles.forEach((producto, index) => {
        lista += `
            <strong>${index + 1}.</strong>
            ${escapeHTML(producto.nombre)}
            — <strong>${formatPrice(producto.precio)}</strong>
            <br>
            <small>${escapeHTML(producto.descripcion)}</small>
            <br><br>
        `;
    });

    addBotMessage(`
        <strong>${titulo}</strong>
        <br><br>
        ${lista}
        Escribe el número de la opción que te interesa.
        <br><br>
        <strong>0.</strong> Volver al inicio
    `);
}

function handleCatalogSelection(text) {
    const numero = Number(text);

    if (
        Number.isInteger(numero) &&
        numero >= 1 &&
        numero <= productosVisibles.length
    ) {
        showRecommendation(productosVisibles[numero - 1]);
    } else {
        addBotMessage(
            `Escribe un número entre 1 y ${productosVisibles.length} para seleccionar una opción.`
        );
    }
}


function showRecommendation(producto) {
    productoSeleccionado = producto;
    chatbotState = "confirmar-compra";

    addBotMessage(`
        <strong>✨ Esta es tu selección</strong>
        <br><br>
        <strong>${escapeHTML(producto.nombre)}</strong>
        <br>
        ${escapeHTML(producto.descripcion)}
        <br><br>
        Precio de referencia:
        <strong>${formatPrice(producto.precio)}</strong>
        <br><br>
        ¿Quieres continuar con una compra simulada?
        <br><br>
        <strong>1.</strong> Sí, continuar
        <br>
        <strong>2.</strong> Volver al menú
        <br><br>
        <em>Esta demostración no procesa pagos reales.</em>
    `);
}


function showContact() {
    chatbotState = "contacto";

    addBotMessage(`
        <strong>📞 Contacto ByteCore</strong>
        <br><br>
        ¿Te interesa adaptar un asistente como Cora a tu negocio?
        <br><br>
        Puedes utilizar el formulario de contacto de esta página para enviar tu consulta.
        <br><br>
        <strong>0.</strong> Volver al inicio
    `);
}




function resetChatbot() {
    showBusinessMenu();
}

if (chatbotInput) {
    chatbotInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendChatMessage();
        }
    });
}


if (chatbotSend) {
    chatbotSend.addEventListener("click", sendChatMessage);
}

if (chatbotMessages) {
    chatbotMessages.innerHTML = "";
    showBusinessMenu();
} else {
    console.error(
        "Cora no encontró el elemento #chatbot-messages. Revisa los IDs del HTML."
    );
}

if (!chatbotInput) {
    console.error(
        "Cora no encontró el elemento #chatbot-input. Revisa el ID del campo de texto."
    );
}

if (!chatbotSend) {
    console.error(
        "Cora no encontró el elemento #chatbot-send. Revisa el ID del botón de envío."
    );
}


async function enviarSolicitudComercial(email) {
    const correo = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        addBotMessage(
            "Ese correo no parece válido. Escríbelo de nuevo."
        );
        return;
    }

    if (
        !clienteCora.nombre ||
        !clienteCora.tipoNegocio ||
        !clienteCora.necesidad
    ) {
        addBotMessage(
            "Faltan algunos datos. Escribe 0 para volver al inicio."
        );
        return;
    }

    addBotMessage("Estoy enviando tu solicitud a ByteCore...");

    try {
        const respuesta = await fetch("/contacto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: clienteCora.nombre,
                email: correo,
                negocio: clienteCora.tipoNegocio,
                tipoNegocio: clienteCora.tipoNegocio,
                mensaje: clienteCora.necesidad
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
            addBotMessage(
                "No pudimos enviar tu solicitud. Puedes intentarlo de nuevo o utilizar el formulario de contacto."
            );
            return;
        }

        addBotMessage(`
            <strong>¡Gracias por contactar a ByteCore! ✨</strong>
            <br><br>
            Tu solicitud se ha enviado correctamente.
            Revisaremos la información para conocer mejor
            las necesidades de tu negocio.
            <br><br>
            <strong>¿Qué quieres hacer ahora?</strong>
            <br><br>
            <strong>1.</strong> Explorar una demostración
            <br>
            <strong>0.</strong> Volver al inicio
        `);

        clienteCora.email = correo;
        chatbotState = "fin";
    } catch (error) {
        console.error("Error enviando solicitud comercial:", error);

        addBotMessage(
            "No pude conectar con el servidor. Comprueba que esté ejecutándose e inténtalo de nuevo."
        );
    }
}


async function solicitarPinCora(email) {
    const correo = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        addBotMessage("Ese correo no parece válido. Escríbelo de nuevo.");
        return;
    }

    if (!productoSeleccionado) {
        addBotMessage("No encuentro la selección. Volvamos al menú.");
        showMainMenu();
        return;
    }

    clienteCora.email = correo;
    addBotMessage("Estoy solicitando tu código de verificación... ✉️");

    try {
        const respuesta = await fetch("/api/enviar-pin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: clienteCora.nombre,
                email: clienteCora.email
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
            addBotMessage(
                escapeHTML(resultado.message || "No fue posible enviar el PIN.")
            );
            return;
        }

        pinEnviado = true;
        chatbotState = "verificar-pin";

        addBotMessage(`
            <strong>📩 ¡Código solicitado!</strong>
            <br><br>
            ${escapeHTML(resultado.message)}
            <br><br>
            Revisa tu bandeja de entrada y la carpeta de spam.
            Escribe aquí el PIN de seis dígitos que recibiste.
            <br><br>
            <em>El código caduca en 10 minutos.</em>
        `);
    } catch (error) {
        console.error("Error solicitando PIN:", error);
        addBotMessage(
            "No pude conectar con el servidor. Comprueba que Node.js esté ejecutándose e inténtalo de nuevo."
        );
    }

}

async function verificarPinCora(pin) {
    if (!pinEnviado) {
        addBotMessage("Primero solicita un PIN para tu correo.");
        return;
    }

    if (!/^\d{6}$/.test(pin)) {
        addBotMessage("Escribe el PIN de seis dígitos que recibiste por correo.");
        return;
    }

    addBotMessage("Verificando el código... 🔐");

    try {
        const respuesta = await fetch("/api/verificar-pin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: clienteCora.email,
                pin
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
            addBotMessage(
                escapeHTML(resultado.message || "No se pudo verificar el código.")
            );
            return;
        }

        finalizarCompraDemoVerificada();
    } catch (error) {
        console.error("Error verificando PIN:", error);
        addBotMessage(
            "No pude conectar con el servidor para verificar el PIN. Inténtalo de nuevo."
        );
    }
}

function finalizarCompraDemoVerificada() {
    if (!productoSeleccionado) {
        showMainMenu();
        return;
    }

    const record = {
        negocio: negocioActual === "gimnasio" ? "GymByte" : "BurgerByte",
        cliente: clienteCora.nombre,
        email: clienteCora.email,
        producto: productoSeleccionado.nombre,
        valor: productoSeleccionado.precio,
        estado: "DEMO - NO PAGADO",
        correoVerificado: true,
        fecha: new Date().toISOString()
    };

    try {
        const guardadas = localStorage.getItem("cora_compras_demo");
        const compras = guardadas ? JSON.parse(guardadas) : [];

        if (Array.isArray(compras)) {
            compras.push(record);
            localStorage.setItem("cora_compras_demo", JSON.stringify(compras));
        }
    } catch (error) {
        console.warn("No fue posible guardar el registro de demostración:", error);
    }

    pinEnviado = false;
    chatbotState = "fin";

    addBotMessage(`
        <strong>✅ Correo verificado correctamente</strong>
        <br><br>
        Cliente: ${escapeHTML(record.cliente)}
        <br>
        Correo: ${escapeHTML(record.email)}
        <br>
        Negocio: ${escapeHTML(record.negocio)}
        <br>
        Selección: ${escapeHTML(record.producto)}
        <br>
        Valor de referencia: <strong>${formatPrice(record.valor)}</strong>
        <br><br>
        <strong>Estado: DEMOSTRACIÓN — NO PAGADO</strong>
        <br><br>
        Tu correo fue verificado. Este prototipo no procesa pagos ni genera pedidos reales.
        <br><br>
        <strong>1.</strong> Explorar este negocio
        <br>
        <strong>2.</strong> Elegir otro negocio
        <br><br>
        <strong>0.</strong> Volver al inicio
    `);
    
}
