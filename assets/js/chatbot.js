
let chatbotState = "negocio";
let negocioActual = "";
let productoSeleccionado = null;
let productosVisibles = [];

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
    chatbotState = "negocio";
    negocioActual = "";
    productoSeleccionado = null;
    productosVisibles = [];

    addBotMessage(`
        <strong>¡Hola! 👋 Soy Cora, la recepcionista digital de ByteCore.</strong>
        <br><br>
        Puedo orientar a tus clientes, mostrar opciones y acompañarlos durante una compra de demostración.
        <br><br>
        <strong>¿Qué negocio quieres explorar?</strong>
        <br><br>
        🍔 <strong>1.</strong> BurgerByte — Restaurante
        <br>
        🏋️ <strong>2.</strong> GymByte — Gimnasio
        <br><br>
        Escribe <strong>1</strong> o <strong>2</strong>.
        <br>
        Escribe <strong>0</strong> para volver a este menú.
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

        case "nombre-compra":
            finishDemoPurchase(message.trim());
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



function finishDemoPurchase(name) {
    if (!name) {
        addBotMessage(
            "Escribe un nombre para el comprobante de demostración."
        );
        return;
    }

    if (!productoSeleccionado) {
        showMainMenu();
        return;
    }

    const pin = String(
        Math.floor(100000 + Math.random() * 900000)
    );

    const record = {
        negocio: negocioActual === "gimnasio"
            ? "GymByte"
            : "BurgerByte",
        cliente: name.slice(0, 80),
        producto: productoSeleccionado.nombre,
        valor: productoSeleccionado.precio,
        pin: pin,
        estado: "DEMO - NO PAGADO",
        fecha: new Date().toISOString()
    };


    try {
        const guardadas = localStorage.getItem("cora_compras_demo");
        const compras = guardadas ? JSON.parse(guardadas) : [];

        if (Array.isArray(compras)) {
            compras.push(record);
            localStorage.setItem(
                "cora_compras_demo",
                JSON.stringify(compras)
            );
        }
    } catch (error) {
        console.warn(
            "No fue posible guardar el comprobante local:",
            error
        );
    }

    chatbotState = "fin";

    addBotMessage(`
        <strong>✅ Comprobante de demostración</strong>
        <br><br>
        Cliente: ${escapeHTML(record.cliente)}
        <br>
        Negocio: ${escapeHTML(record.negocio)}
        <br>
        Producto: ${escapeHTML(record.producto)}
        <br>
        Valor de referencia:
        <strong>${formatPrice(record.valor)}</strong>
        <br><br>
        <strong>PIN DE PRUEBA: ${pin}</strong>
        <br><br>
        <strong>Estado: DEMOSTRACIÓN — NO PAGADO</strong>
        <br><br>
        Este PIN se genera localmente. No se envió por correo, no verifica un pago y no habilita acceso.
        <br><br>
        <strong>1.</strong> Explorar este negocio
        <br>
        <strong>2.</strong> Elegir otro negocio
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