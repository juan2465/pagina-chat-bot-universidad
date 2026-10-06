// ==============================
// CHATBOT CORA - BYTECORE
// ==============================

let chatbotState = "inicio";

let solicitud = {
    servicio: "",
    nombre: "",
    correo: "",
    telefono: "",
    descripcion: ""
};


// ==============================
// ELEMENTOS DEL CHAT
// ==============================

const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input");


// ==============================
// ENVIAR MENSAJE
// ==============================

function sendChatMessage() {

    const message = chatbotInput.value.trim();

    if (message === "") {
        return;
    }

    addUserMessage(message);

    chatbotInput.value = "";

    processMessage(message);
}


// ==============================
// MENSAJES RÁPIDOS
// ==============================

function sendQuickMessage(message) {

    addUserMessage(message);

    processMessage(message);
}


// ==============================
// MOSTRAR MENSAJE DEL USUARIO
// ==============================

function addUserMessage(message) {

    const messageElement = document.createElement("div");

    messageElement.className = "chatbot-message user";

    messageElement.innerHTML = `
        <div class="message-content">
            ${escapeHTML(message)}
        </div>
    `;

    chatbotMessages.appendChild(messageElement);

    scrollChat();
}


// ==============================
// MOSTRAR MENSAJE DE CORA
// ==============================

function addBotMessage(message) {

    const messageElement = document.createElement("div");

    messageElement.className = "chatbot-message bot";

    messageElement.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
    `;

    chatbotMessages.appendChild(messageElement);

    scrollChat();
}


// ==============================
// PROCESAR MENSAJE
// ==============================

function processMessage(message) {

    const text = normalizeText(message);

    // --------------------------------
    // VOLVER AL INICIO DESDE CUALQUIER PARTE
    // --------------------------------

    if (
        text === "0" ||
        text === "volver" ||
        text === "atras" ||
        text === "atrás" ||
        text === "menu" ||
        text === "menú" ||
        text === "inicio"
    ) {

        resetChatbot();

        return;
    }


    // --------------------------------
    // MENÚ PRINCIPAL
    // --------------------------------

    if (chatbotState === "inicio") {

        handleMainMenu(text);

        return;
    }


    // --------------------------------
    // MENÚ DE SERVICIOS
    // --------------------------------

    if (chatbotState === "servicios") {

        handleServicesMenu(text);

        return;
    }


    // --------------------------------
    // INFORMACIÓN DEL SERVICIO
    // --------------------------------

    if (chatbotState === "detalle-servicio") {

        handleServiceDetail(text);

        return;
    }


    // --------------------------------
    // SOLICITUD DE SERVICIO
    // --------------------------------

    if (chatbotState === "solicitar-servicio") {

        handleRequestService(text);

        return;
    }


    // --------------------------------
    // NOMBRE
    // --------------------------------

    if (chatbotState === "nombre") {

        solicitud.nombre = message.trim();

        chatbotState = "correo";

        addBotMessage(`
            Perfecto, ${escapeHTML(solicitud.nombre)}. 👍
            <br><br>
            Ahora escribe tu correo electrónico.
            <br><br>
            <strong>0.</strong> Volver al inicio
        `);

        return;
    }


    // --------------------------------
    // CORREO
    // --------------------------------

    if (chatbotState === "correo") {

        if (!isValidEmail(message)) {

            addBotMessage(`
                El correo no parece válido. 📧
                <br><br>
                Por favor, escribe un correo como:
                <strong>ejemplo@correo.com</strong>
                <br><br>
                <strong>0.</strong> Volver al inicio
            `);

            return;
        }

        solicitud.correo = message.trim();

        chatbotState = "telefono";

        addBotMessage(`
            Gracias. 👍
            <br><br>
            Ahora escribe tu número de teléfono.
            <br><br>
            <strong>0.</strong> Volver al inicio
        `);

        return;
    }


    // --------------------------------
    // TELÉFONO
    // --------------------------------

    if (chatbotState === "telefono") {

        solicitud.telefono = message.trim();

        chatbotState = "descripcion";

        addBotMessage(`
            Perfecto. 📱
            <br><br>
            Cuéntame brevemente qué necesitas o qué proyecto tienes en mente.
            <br><br>
            <strong>0.</strong> Volver al inicio
        `);

        return;
    }


    // --------------------------------
    // DESCRIPCIÓN
    // --------------------------------

    if (chatbotState === "descripcion") {

        solicitud.descripcion = message.trim();

        chatbotState = "confirmacion";

        showSummary();

        return;
    }


    // --------------------------------
    // CONFIRMACIÓN
    // --------------------------------

    if (chatbotState === "confirmacion") {

        handleConfirmation(text);

        return;
    }


    // --------------------------------
    // RESPUESTA POR DEFECTO
    // --------------------------------

    addBotMessage(`
        No estoy segura de haber entendido. 🤔
        <br><br>
        Puedes escribir <strong>0</strong> para volver al inicio.
    `);
}


// ==============================
// MENÚ PRINCIPAL
// ==============================

function handleMainMenu(text) {

    if (
        text === "1" ||
        text.includes("servicio") ||
        text.includes("servicios")
    ) {

        showServices();

        return;
    }


    if (
        text === "2" ||
        text.includes("contacto") ||
        text.includes("correo") ||
        text.includes("telefono") ||
        text.includes("teléfono") ||
        text.includes("celular")
    ) {

        showContact();

        return;
    }


    if (
        text === "3" ||
        text.includes("solicitar") ||
        text.includes("contratar") ||
        text.includes("cotizacion") ||
        text.includes("cotización")
    ) {

        startServiceRequest();

        return;
    }


    addBotMessage(`
        Selecciona una de las siguientes opciones:
        <br><br>

        <strong>1.</strong> Conocer nuestros servicios<br>
        <strong>2.</strong> Información de contacto<br>
        <strong>3.</strong> Solicitar un servicio<br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// MOSTRAR SERVICIOS
// ==============================

function showServices() {

    chatbotState = "servicios";

    addBotMessage(`
        Estos son nuestros servicios:
        <br><br>

        <strong>1.</strong> Desarrollo Web<br>
        <strong>2.</strong> Programación<br>
        <strong>3.</strong> Desarrollo Android<br>
        <strong>4.</strong> Python<br>
        <strong>5.</strong> Bases de datos<br>
        <strong>6.</strong> Inteligencia Artificial<br><br>

        Escribe el número del servicio que deseas conocer.
        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// MENÚ DE SERVICIOS
// ==============================

function handleServicesMenu(text) {

    const services = {
        "1": "Desarrollo Web",
        "2": "Programación",
        "3": "Desarrollo Android",
        "4": "Python",
        "5": "Bases de datos",
        "6": "Inteligencia Artificial"
    };


    if (services[text]) {

        solicitud.servicio = services[text];

        chatbotState = "detalle-servicio";

        showServiceDescription(text);

        return;
    }


    addBotMessage(`
        Por favor, selecciona un número del <strong>1 al 6</strong>.
        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// DESCRIPCIÓN DE SERVICIOS
// ==============================

function showServiceDescription(option) {

    let description = "";

    switch (option) {

        case "1":
            description = `
                <strong>Desarrollo Web</strong>
                <br><br>
                Creamos sitios y aplicaciones web adaptadas a las necesidades
                de cada proyecto.
            `;
            break;

        case "2":
            description = `
                <strong>Programación</strong>
                <br><br>
                Desarrollamos soluciones de software utilizando diferentes
                tecnologías de programación.
            `;
            break;

        case "3":
            description = `
                <strong>Desarrollo Android</strong>
                <br><br>
                Creamos aplicaciones móviles para dispositivos Android.
            `;
            break;

        case "4":
            description = `
                <strong>Python</strong>
                <br><br>
                Utilizamos Python para desarrollar soluciones, automatizaciones
                y diferentes proyectos de software.
            `;
            break;

        case "5":
            description = `
                <strong>Bases de datos</strong>
                <br><br>
                Diseñamos y gestionamos bases de datos para organizar y
                administrar información de diferentes proyectos.
            `;
            break;

        case "6":
            description = `
                <strong>Inteligencia Artificial</strong>
                <br><br>
                Desarrollamos soluciones que utilizan inteligencia artificial
                y automatización.
            `;
            break;
    }


    addBotMessage(`
        ${description}

        <br><br>

        ¿Deseas solicitar este servicio?

        <br><br>

        <strong>1.</strong> Sí, solicitar servicio<br>
        <strong>2.</strong> No, volver a servicios<br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// DETALLE DEL SERVICIO
// ==============================

function handleServiceDetail(text) {

    if (text === "1" || text.includes("si") || text.includes("sí")) {

        startServiceRequest();

        return;
    }


    if (text === "2" || text.includes("no")) {

        showServices();

        return;
    }


    addBotMessage(`
        Selecciona una opción:
        <br><br>

        <strong>1.</strong> Sí, solicitar servicio<br>
        <strong>2.</strong> No, volver a servicios<br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// INICIAR SOLICITUD
// ==============================

function startServiceRequest() {

    chatbotState = "solicitar-servicio";

    addBotMessage(`
        Claro. Vamos a registrar tu solicitud. 👍
        <br><br>

        ¿Qué servicio necesitas?
        <br><br>

        <strong>1.</strong> Desarrollo Web<br>
        <strong>2.</strong> Programación<br>
        <strong>3.</strong> Desarrollo Android<br>
        <strong>4.</strong> Python<br>
        <strong>5.</strong> Bases de datos<br>
        <strong>6.</strong> Inteligencia Artificial<br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// SELECCIÓN DEL SERVICIO
// ==============================

function handleRequestService(text) {

    const services = {
        "1": "Desarrollo Web",
        "2": "Programación",
        "3": "Desarrollo Android",
        "4": "Python",
        "5": "Bases de datos",
        "6": "Inteligencia Artificial"
    };


    if (services[text]) {

        solicitud.servicio = services[text];

        chatbotState = "nombre";

        addBotMessage(`
            Has seleccionado:
            <strong>${escapeHTML(solicitud.servicio)}</strong>
            <br><br>

            Para continuar, dime tu nombre.
            <br><br>

            <strong>0.</strong> Volver al inicio
        `);

        return;
    }


    addBotMessage(`
        Selecciona un servicio escribiendo un número del
        <strong>1 al 6</strong>.
        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// MOSTRAR RESUMEN
// ==============================

function showSummary() {

    addBotMessage(`
        <strong>Resumen de tu solicitud</strong>
        <br><br>

        <strong>Servicio:</strong>
        ${escapeHTML(solicitud.servicio)}
        <br>

        <strong>Nombre:</strong>
        ${escapeHTML(solicitud.nombre)}
        <br>

        <strong>Correo:</strong>
        ${escapeHTML(solicitud.correo)}
        <br>

        <strong>Teléfono:</strong>
        ${escapeHTML(solicitud.telefono)}
        <br>

        <strong>Descripción:</strong>
        ${escapeHTML(solicitud.descripcion)}

        <br><br>

        ¿Deseas confirmar esta solicitud?

        <br><br>

        <strong>1.</strong> Sí, confirmar<br>
        <strong>2.</strong> No, cancelar<br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// CONFIRMACIÓN
// ==============================

function handleConfirmation(text) {

    if (text === "1" || text.includes("si") || text.includes("sí")) {

        saveRequest();

        chatbotState = "inicio";

        addBotMessage(`
            ¡Solicitud registrada correctamente! ✅
            <br><br>

            Gracias por contactarnos, ${escapeHTML(solicitud.nombre)}.
            Nuestro equipo podrá comunicarse contigo utilizando los datos
            proporcionados.
            <br><br>

            Escribe <strong>0</strong> para volver al inicio.
        `);

        return;
    }


    if (text === "2" || text.includes("no") || text.includes("cancelar")) {

        resetChatbot();

        return;
    }


    addBotMessage(`
        Por favor selecciona:
        <br><br>

        <strong>1.</strong> Sí, confirmar<br>
        <strong>2.</strong> No, cancelar<br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// CONTACTO
// ==============================

function showContact() {

    chatbotState = "contacto";

    addBotMessage(`
        Puedes contactar directamente con nuestro equipo:
        <br><br>

        📱 <strong>Celular:</strong> 313 851 5868
        <br>

        📧 <strong>Correo:</strong>
        Kevin.velez@uniminuto.edu.co

        <br><br>

        Puedes llamarnos o escribirnos directamente.
        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// GUARDAR SOLICITUD
// ==============================

function saveRequest() {

    let requests = JSON.parse(
        localStorage.getItem("bytecore_leads") || "[]"
    );

    requests.push({
        servicio: solicitud.servicio,
        nombre: solicitud.nombre,
        correo: solicitud.correo,
        telefono: solicitud.telefono,
        descripcion: solicitud.descripcion,
        fecha: new Date().toLocaleString()
    });

    localStorage.setItem(
        "bytecore_leads",
        JSON.stringify(requests)
    );
}


// ==============================
// REINICIAR CHATBOT
// ==============================

function resetChatbot() {

    chatbotState = "inicio";

    solicitud = {
        servicio: "",
        nombre: "",
        correo: "",
        telefono: "",
        descripcion: ""
    };

    addBotMessage(`
        Volvamos al inicio. 👋
        <br><br>

        ¿En qué puedo ayudarte?

        <br><br>

        <strong>1.</strong> Conocer nuestros servicios<br>
        <strong>2.</strong> Información de contacto<br>
        <strong>3.</strong> Solicitar un servicio<br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


// ==============================
// VALIDAR CORREO
// ==============================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ==============================
// NORMALIZAR TEXTO
// ==============================

function normalizeText(text) {

    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// ==============================
// PROTEGER TEXTO DEL USUARIO
// ==============================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==============================
// BAJAR EL CHAT AUTOMÁTICAMENTE
// ==============================

function scrollChat() {

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}


// ==============================
// ENTER PARA ENVIAR
// ==============================

chatbotInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendChatMessage();
    }

});