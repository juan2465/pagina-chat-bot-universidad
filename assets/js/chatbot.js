let chatbotState = "inicio";

let recomendacion = {
    presupuesto: "",
    preferencia: "",
    producto: ""
};




const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSend = document.getElementById("chatbot-send");




function sendChatMessage() {

    const message = chatbotInput.value.trim();

    if (message === "") {
        return;
    }

    addUserMessage(message);

    chatbotInput.value = "";

    processMessage(message);
}




function sendQuickMessage(message) {

    addUserMessage(message);

    processMessage(message);
}



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



function processMessage(message) {

    const text = normalizeText(message);


    if (
        text === "0" ||
        text === "volver" ||
        text === "atras" ||
        text === "menu" ||
        text === "inicio"
    ) {

        resetChatbot();

        return;
    }

    if (chatbotState === "inicio") {

        handleMainMenu(text);

        return;
    }



    if (chatbotState === "recomendacion") {

        handleRecommendation(text);

        return;
    }



    if (chatbotState === "presupuesto") {

        handleBudget(text);

        return;
    }




    if (chatbotState === "preferencia") {

        handlePreference(text);

        return;
    }




    if (chatbotState === "producto") {

        handleProduct(text);

        return;
    }




    if (chatbotState === "menu") {

        handleMenu(text);

        return;
    }



    if (chatbotState === "contacto") {

        showMainMenu();

        return;
    }


    if (chatbotState === "solicitud") {

        handleRequest(text);

        return;
    }



    addBotMessage(`
        No estoy segura de haber entendido. 🤔
        <br><br>

        Puedes escribir <strong>0</strong> para volver al inicio.
    `);
}



function handleMainMenu(text) {

    if (
        text === "1" ||
        text.includes("recomiendame") ||
        text.includes("recomienda") ||
        text.includes("recomendacion")
    ) {

        startRecommendation();

        return;
    }


    if (
        text === "2" ||
        text.includes("economico") ||
        text.includes("barato")
    ) {

        startBudget();

        return;
    }


    if (
        text === "3" ||
        text.includes("especial") ||
        text.includes("hambre")
    ) {

        recommendSpecial();

        return;
    }


    if (
        text === "4" ||
        text.includes("menu") ||
        text.includes("menú")
    ) {

        showMenu();

        return;
    }


    if (
        text === "5" ||
        text.includes("contacto")
    ) {

        showContact();

        return;
    }


    showMainMenu();
}


function showMainMenu() {

    chatbotState = "inicio";

    addBotMessage(`
        <strong>¡Hola! 👋 Soy Cora.</strong>

        <br><br>

        Soy la asistente virtual de demostración
        de <strong>ByteCore</strong>.

        <br><br>

        Puedo ayudarte a encontrar una opción
        según lo que estás buscando.

        <br><br>

        <strong>¿Qué deseas hacer?</strong>

        <br><br>

        🍔 <strong>1.</strong> Recomiéndame algo
        <br>

        💰 <strong>2.</strong> Quiero algo económico
        <br>

        🔥 <strong>3.</strong> Quiero algo especial
        <br>

        📋 <strong>4.</strong> Ver menú
        <br>

        📞 <strong>5.</strong> Contactar

        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


function startRecommendation() {

    chatbotState = "recomendacion";

    addBotMessage(`
        ¡Perfecto! 😋

        <br><br>

        Te voy a hacer un par de preguntas
        para recomendarte una opción.

        <br><br>

        ¿Qué estás buscando?

        <br><br>

        🍔 <strong>1.</strong> Una hamburguesa
        <br>

        🍟 <strong>2.</strong> Un combo

        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}



function handleRecommendation(text) {

    if (text === "1" || text.includes("hamburguesa")) {

        chatbotState = "presupuesto";

        recomendacion.preferencia = "hamburguesa";

        addBotMessage(`
            🍔 ¡Excelente elección!

            <br><br>

            ¿Cuánto quieres gastar aproximadamente?

            <br><br>

            💰 <strong>1.</strong> Hasta $20.000
            <br>

            💳 <strong>2.</strong> Entre $20.000 y $25.000
            <br>

            ⭐ <strong>3.</strong> No tengo límite

            <br><br>

            <strong>0.</strong> Volver al inicio
        `);

        return;
    }


    if (text === "2" || text.includes("combo")) {

        recomendacion.preferencia = "combo";

        recommendCombo();

        return;
    }


    startRecommendation();
}


function handleBudget(text) {

    if (text === "1") {

        recomendacion.presupuesto = "economico";

        showRecommendation(
            "Hamburguesa Clásica",
            "$18.000",
            "Una opción sencilla, completa y económica."
        );

        return;
    }


    if (text === "2") {

        recomendacion.presupuesto = "medio";

        chatbotState = "preferencia";

        addBotMessage(`
            Perfecto. 👍

            <br><br>

            Ahora dime qué prefieres:

            <br><br>

            🥓 <strong>1.</strong> Algo clásico
            <br>

            🔥 <strong>2.</strong> Algo con sabor BBQ
            <br>

            ⭐ <strong>3.</strong> Algo más especial

            <br><br>

            <strong>0.</strong> Volver al inicio
        `);

        return;
    }


    if (text === "3") {

        showRecommendation(
            "Hamburguesa Especial",
            "$25.000",
            "Una opción más completa para quienes buscan una experiencia diferente."
        );

        return;
    }


    addBotMessage(`
        Selecciona una opción:

        <br><br>

        <strong>1.</strong> Hasta $20.000
        <br>

        <strong>2.</strong> Entre $20.000 y $25.000
        <br>

        <strong>3.</strong> No tengo límite
    `);
}


function handlePreference(text) {

    if (text === "1") {

        showRecommendation(
            "Hamburguesa Clásica",
            "$18.000",
            "Una hamburguesa tradicional y sencilla."
        );

        return;
    }


    if (text === "2") {

        showRecommendation(
            "Hamburguesa BBQ",
            "$22.000",
            "Una opción con salsa BBQ para quienes buscan un sabor diferente."
        );

        return;
    }


    if (text === "3") {

        showRecommendation(
            "Hamburguesa Especial",
            "$25.000",
            "Nuestra opción más completa para una experiencia especial."
        );

        return;
    }


    addBotMessage(`
        Elige una opción:

        <br><br>

        <strong>1.</strong> Clásico
        <br>

        <strong>2.</strong> BBQ
        <br>

        <strong>3.</strong> Especial
    `);
}



function recommendSpecial() {

    showRecommendation(
        "Hamburguesa Especial",
        "$25.000",
        "Nuestra recomendación para quienes quieren probar algo diferente."
    );
}


function recommendCombo() {

    showRecommendation(
        "Combo BBQ",
        "$29.000",
        "Hamburguesa BBQ acompañada de papas y bebida."
    );
}


function showRecommendation(nombre, precio, descripcion) {

    chatbotState = "producto";

    recomendacion.producto = nombre;

    addBotMessage(`
        <strong>🎯 Tengo una recomendación para ti</strong>

        <br><br>

        🍔 <strong>${nombre}</strong>

        <br><br>

        ${descripcion}

        <br><br>

        💰 <strong>${precio}</strong>

        <br><br>

        Esta recomendación se basa en las
        preferencias que seleccionaste.

        <br><br>

        ¿Qué quieres hacer?

        <br><br>

        <strong>1.</strong> Me interesa
        <br>

        <strong>2.</strong> Ver el menú
        <br>

        <strong>3.</strong> Empezar de nuevo

        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}


function handleProduct(text) {

    if (text === "1" || text.includes("interesa")) {

        chatbotState = "solicitud";

        addBotMessage(`
            ¡Excelente! 😄

            <br><br>

            Has seleccionado:

            <br>

            🍔 <strong>${escapeHTML(recomendacion.producto)}</strong>

            <br><br>

            Para continuar con la demostración,
            escribe tu nombre.

            <br><br>

            <strong>0.</strong> Volver al inicio
        `);

        return;
    }


    if (text === "2" || text.includes("menu")) {

        showMenu();

        return;
    }


    if (text === "3") {

        resetChatbot();

        return;
    }


    addBotMessage(`
        Selecciona una opción:

        <br><br>

        <strong>1.</strong> Me interesa
        <br>

        <strong>2.</strong> Ver el menú
        <br>

        <strong>3.</strong> Empezar de nuevo
    `);
}



function handleRequest(text) {

    if (text === "") {

        addBotMessage(`
            Escribe tu nombre para continuar.
        `);

        return;
    }


    addBotMessage(`
        Gracias, <strong>${escapeHTML(text)}</strong>. 👍

        <br><br>

        En una versión completa,
        aquí podríamos solicitar los datos
        necesarios para enviar el pedido
        directamente al negocio.

        <br><br>

        Esta función se encuentra
        actualmente en desarrollo.

        <br><br>

        <strong>0.</strong> Volver al inicio
    `);

    chatbotState = "inicio";
}




function showMenu() {

    chatbotState = "menu";

    addBotMessage(`
        <strong>🍔 MENÚ BURGERBYTE</strong>

        <br><br>

        🍔 <strong>Hamburguesa Clásica</strong>
        <br>
        Carne, queso, lechuga y tomate.
        <br>
        <strong>$18.000</strong>

        <br><br>

        🔥 <strong>Hamburguesa BBQ</strong>
        <br>
        Hamburguesa con salsa BBQ.
        <br>
        <strong>$22.000</strong>

        <br><br>

        ⭐ <strong>Hamburguesa Especial</strong>
        <br>
        Nuestra opción más completa.
        <br>
        <strong>$25.000</strong>

        <br><br>

        🍟 <strong>Combo Clásico</strong>
        <br>
        Hamburguesa + papas + bebida.
        <br>
        <strong>$25.000</strong>

        <br><br>

        🔥 <strong>Combo BBQ</strong>
        <br>
        Hamburguesa BBQ + papas + bebida.
        <br>
        <strong>$29.000</strong>

        <br><br>

        ¿Quieres que Cora te recomiende una opción?

        <br><br>

        <strong>1.</strong> Sí, recomendarme algo
        <br>

        <strong>0.</strong> Volver al inicio
    `);
}




function handleMenu(text) {

    if (text === "1" || text.includes("si")) {

        startRecommendation();

        return;
    }


    showMenu();
}


function showContact() {

    chatbotState = "contacto";

    addBotMessage(`
        📞 <strong>Contacto ByteCore</strong>

        <br><br>

        Si quieres conocer cómo adaptar
        un asistente como Cora a tu negocio,
        puedes comunicarte con nuestro equipo.

        <br><br>

        📧 <strong>Correo:</strong>
        juancarlosmoreno356@gmail.com

        <br><br>

        También puedes utilizar el formulario
        de contacto de nuestra página.

        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}




function resetChatbot() {

    chatbotState = "inicio";

    recomendacion = {
        presupuesto: "",
        preferencia: "",
        producto: ""
    };

    addBotMessage(`
        Volvamos al inicio. 👋

        <br><br>

        Soy <strong>Cora</strong>,
        tu asistente virtual.

        <br><br>

        ¿Qué deseas hacer?

        <br><br>

        🍔 <strong>1.</strong> Recomiéndame algo
        <br>

        💰 <strong>2.</strong> Algo económico
        <br>

        🔥 <strong>3.</strong> Algo especial
        <br>

        📋 <strong>4.</strong> Ver menú
        <br>

        📞 <strong>5.</strong> Contactar

        <br><br>

        <strong>0.</strong> Volver al inicio
    `);
}



function normalizeText(text) {

    return text
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




function scrollChat() {

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}



chatbotInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendChatMessage();
    }

});



if (chatbotSend) {

    chatbotSend.addEventListener("click", function() {

        sendChatMessage();

    });

}


setTimeout(function() {

    if (chatbotMessages.children.length === 0) {

        showMainMenu();

    }

}, 300);