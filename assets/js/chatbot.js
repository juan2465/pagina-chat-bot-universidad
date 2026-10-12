/* Cora - demo comercial de ByteCore.
 * Los catálogos, inventarios, sedes y tarifas de envío de este archivo son de ejemplo.
 * El PIN verifica el correo; no procesa pagos ni confirma pedidos reales.
 */
let chatbotState = "negocio";
let negocioActual = "";
let productoSeleccionado = null;
let productosVisibles = [];
let clienteCora = { nombre: "", email: "" };
let pinEnviado = false;
let pedidoActual = { cantidad: 1, entrega: "", direccion: "", zona: "", envio: 0 };

const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSend = document.getElementById("chatbot-send");

// Inventario ilustrativo. En una versión real se conectará al inventario del negocio.
const catalogos = {
    restaurante: [
        { id: "r1", nombre: "Hamburguesa Clásica", precio: 18000, descripcion: "Carne, queso, vegetales y salsa de la casa.", stock: 8, tipo: "plato" },
        { id: "r2", nombre: "Hamburguesa BBQ", precio: 22000, descripcion: "Hamburguesa con salsa BBQ.", stock: 5, tipo: "plato" },
        { id: "r3", nombre: "Hamburguesa Especial", precio: 25000, descripcion: "Una opción más completa.", stock: 0, tipo: "plato", alternativa: "r1" },
        { id: "r4", nombre: "Combo Clásico", precio: 25000, descripcion: "Hamburguesa clásica, papas y bebida.", stock: 6, tipo: "combo" },
        { id: "r5", nombre: "Combo BBQ", precio: 29000, descripcion: "Hamburguesa BBQ, papas y bebida.", stock: 0, tipo: "combo", alternativa: "r2" },
        { id: "r6", nombre: "Combo para compartir", precio: 52000, descripcion: "Dos hamburguesas clásicas, dos papas y dos bebidas.", stock: 3, tipo: "combo" }
    ],
    gimnasio: [
        { id: "g1", nombre: "Plan semanal", precio: 25000, descripcion: "Acceso durante siete días.", stock: 20, tipo: "membresia" },
        { id: "g2", nombre: "Plan mensual Básico", precio: 60000, descripcion: "Acceso al gimnasio durante un mes.", stock: 20, tipo: "membresia" },
        { id: "g3", nombre: "Plan mensual Plus", precio: 80000, descripcion: "Acceso y clases grupales durante un mes.", stock: 12, tipo: "membresia" },
        { id: "g4", nombre: "Plan mensual Premium", precio: 110000, descripcion: "Acceso, clases y asesoría personalizada.", stock: 5, tipo: "membresia" },
        { id: "g5", nombre: "Proteína deportiva", precio: 120000, descripcion: "Producto de ejemplo; consulta presentación y sabor en la sede.", stock: 4, tipo: "producto" },
        { id: "g6", nombre: "Botella deportiva", precio: 35000, descripcion: "Botella reutilizable para entrenamientos.", stock: 0, tipo: "producto", alternativa: "g7" },
        { id: "g7", nombre: "Camiseta deportiva", precio: 55000, descripcion: "Camiseta deportiva de ejemplo.", stock: 7, tipo: "producto" },
        { id: "g8", nombre: "Guantes de entrenamiento", precio: 40000, descripcion: "Guantes para entrenar.", stock: 2, tipo: "producto" },
        { id: "g9", nombre: "Combo de entrenamiento", precio: 75000, descripcion: "Camiseta deportiva y guantes de entrenamiento.", stock: 3, tipo: "combo" }
    ],
    muebles: [
        { id: "m1", nombre: "Sofá de 2 puestos", precio: 890000, descripcion: "Medidas: 160 × 85 × 82 cm. Color gris.", stock: 3, tipo: "mueble" },
        { id: "m2", nombre: "Sofá de 3 puestos", precio: 1390000, descripcion: "Medidas: 210 × 90 × 85 cm. Color beige.", stock: 0, tipo: "mueble", alternativa: "m1" },
        { id: "m3", nombre: "Mesa de comedor", precio: 650000, descripcion: "Medidas: 120 × 80 × 75 cm. Madera tono natural.", stock: 4, tipo: "mueble" },
        { id: "m4", nombre: "Escritorio compacto", precio: 320000, descripcion: "Medidas: 100 × 50 × 75 cm. Color roble.", stock: 6, tipo: "mueble" },
        { id: "m5", nombre: "Armario de 2 puertas", precio: 780000, descripcion: "Medidas: 100 × 55 × 180 cm. Color blanco.", stock: 0, tipo: "mueble", alternativa: "m4" },
        { id: "m6", nombre: "Combo sala", precio: 1450000, descripcion: "Sofá de 2 puestos y mesa auxiliar. Medidas del sofá: 160 × 85 × 82 cm.", stock: 2, tipo: "combo" }
    ]
};

const nombresNegocio = { restaurante: "BurgerByte", gimnasio: "GymByte", muebles: "MueblesByte" };
// Sedes ficticias para mostrar el flujo. Sustituir por direcciones reales antes de publicar.
const sedesDemo = [
    { nombre: "Sede Centro (demo)", zona: "Centro", direccion: "Dirección de ejemplo por configurar" },
    { nombre: "Sede Norte (demo)", zona: "Norte", direccion: "Dirección de ejemplo por configurar" },
    { nombre: "Sede Sur (demo)", zona: "Sur", direccion: "Dirección de ejemplo por configurar" }
];

function normalizeText(text) {
    return String(text).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function escapeHTML(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function formatPrice(value) {
    return Number(value).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}
function scrollChat() { if (chatbotMessages) chatbotMessages.scrollTop = chatbotMessages.scrollHeight; }
function addUserMessage(message) {
    if (!chatbotMessages) return;
    const element = document.createElement("div"); element.className = "chatbot-message user";
    const content = document.createElement("div"); content.className = "message-content"; content.textContent = message;
    element.appendChild(content); chatbotMessages.appendChild(element); scrollChat();
}
function addBotMessage(message) {
    if (!chatbotMessages) return;
    const element = document.createElement("div"); element.className = "chatbot-message bot";
    const content = document.createElement("div"); content.className = "message-content"; content.innerHTML = message;
    element.appendChild(content); chatbotMessages.appendChild(element); scrollChat();
}
function sendChatMessage() {
    if (!chatbotInput) return;
    const message = chatbotInput.value.trim(); if (!message) return;
    addUserMessage(message); chatbotInput.value = ""; processMessage(message);
}
function sendQuickMessage(message) { addUserMessage(message); processMessage(message); }

function resetOrder() {
    productoSeleccionado = null;
    pedidoActual = { cantidad: 1, entrega: "", direccion: "", zona: "", envio: 0 };
    clienteCora = { nombre: "", email: "" };
    pinEnviado = false;
}
function showBusinessMenu() {
    chatbotState = "negocio"; negocioActual = ""; resetOrder(); productosVisibles = [];
    addBotMessage(`<strong>¡Hola! 👋 Soy Cora, la asistente virtual de ByteCore.</strong><br><br>Puedo ayudarte a consultar productos, combos, existencias, membresías y opciones de entrega.<br><br><strong>¿Qué negocio quieres explorar?</strong><br><br>🍔 <strong>1.</strong> BurgerByte — Restaurante<br>🏋️ <strong>2.</strong> GymByte — Gimnasio<br>🛋️ <strong>3.</strong> MueblesByte — Tienda de muebles<br><br>Escribe <strong>1, 2 o 3</strong>. Escribe <strong>0</strong> para volver al inicio.`);
}
function showMainMenu() {
    chatbotState = "menu-principal";
    const menus = {
        restaurante: `<strong>🍔 BurgerByte</strong><br><br>Consulta platos, combos, disponibilidad y entrega.<br><br><strong>1.</strong> Ver menú y combos<br><strong>2.</strong> Ver solo combos<br><strong>3.</strong> Ver qué hay disponible<br><strong>4.</strong> Elegir domicilio o recoger<br><strong>5.</strong> Ver sedes de ejemplo<br><strong>6.</strong> Contactar con ByteCore`,
        gimnasio: `<strong>🏋️ GymByte</strong><br><br>Consulta membresías, productos deportivos y disponibilidad.<br><br><strong>1.</strong> Ver membresías<br><strong>2.</strong> Ver productos y combos<br><strong>3.</strong> Ver todo el catálogo<br><strong>4.</strong> Ver sedes de ejemplo<br><strong>5.</strong> Contactar con ByteCore`,
        muebles: `<strong>🛋️ MueblesByte</strong><br><br>Consulta precios, medidas y existencias antes de visitar la tienda.<br><br><strong>1.</strong> Ver muebles disponibles y agotados<br><strong>2.</strong> Ver combos<br><strong>3.</strong> Buscar por medida o presupuesto<br><strong>4.</strong> Consultar sedes y entrega<br><strong>5.</strong> Contactar con ByteCore`
    };
    addBotMessage(`${menus[negocioActual] || "Elige un negocio para comenzar."}<br><br><strong>0.</strong> Elegir otro negocio`);
}
function processMessage(message) {
    const text = normalizeText(message);
    if (text === "0" || text === "volver al inicio" || text === "reiniciar") { showBusinessMenu(); return; }
    switch (chatbotState) {
        case "negocio":
            if (text === "1" || text.includes("burger") || text.includes("restaurante")) negocioActual = "restaurante";
            else if (text === "2" || text.includes("gym") || text.includes("gimnasio")) negocioActual = "gimnasio";
            else if (text === "3" || text.includes("mueble")) negocioActual = "muebles";
            else { addBotMessage("Elige <strong>1</strong> para restaurante, <strong>2</strong> para gimnasio o <strong>3</strong> para muebles."); return; }
            showMainMenu(); break;
        case "menu-principal": handleMainMenu(text); break;
        case "catalogo": handleCatalogSelection(text); break;
        case "buscar-mueble": buscarMueble(text); break;
        case "cantidad": handleCantidad(text); break;
        case "entrega": handleEntrega(text); break;
        case "zona-domicilio": pedidoActual.zona = message.trim();
            if (pedidoActual.zona.length < 2 || pedidoActual.zona.length > 100) { addBotMessage("Escribe un barrio o zona válida (máximo 100 caracteres)."); break; }
            chatbotState = "direccion-domicilio"; addBotMessage("Ahora escribe la dirección de entrega, incluyendo número o indicaciones útiles. La dirección solo se solicita si eliges domicilio."); break;
        case "direccion-domicilio":
            if (message.trim().length < 5 || message.trim().length > 180) { addBotMessage("Escribe una dirección más completa (entre 5 y 180 caracteres)."); break; }
            pedidoActual.direccion = message.trim();
            // Tarifa ilustrativa; la cobertura y tarifa reales deben venir del negocio.
            pedidoActual.envio = negocioActual === "muebles" ? 45000 : 7000;
            mostrarResumenPedido(); break;
        case "sede-zona": mostrarSedes(message.trim()); break;
        case "confirmar-pedido":
            if (text === "1" || text.includes("continuar") || text === "si" || text === "sí") pedirNombre();
            else if (text === "2" || text.includes("cambiar") || text.includes("menu")) showMainMenu();
            else addBotMessage("Escribe <strong>1</strong> para continuar con la demostración o <strong>2</strong> para volver al menú.");
            break;
        case "nombre-compra":
            if (message.trim().length < 2 || message.trim().length > 80) { addBotMessage("Escribe un nombre válido de entre 2 y 80 caracteres."); break; }
            clienteCora.nombre = message.trim(); chatbotState = "correo-compra";
            addBotMessage(`Gracias, ${escapeHTML(clienteCora.nombre)}. Escribe tu correo para enviarte un PIN de verificación. <br><br><em>El PIN verifica tu correo; no es una contraseña bancaria ni realiza el pago.</em>`); break;
        case "correo-compra": solicitarPinCora(message.trim()); break;
        case "verificar-pin": verificarPinCora(message.trim()); break;
        case "contacto": addBotMessage(`Puedes utilizar el formulario de contacto de la página para comunicarte con ByteCore.<br><br><strong>0.</strong> Volver al inicio`); break;
        case "fin":
            if (text === "1" || text.includes("explorar")) showMainMenu();
            else if (text === "2" || text.includes("otro negocio") || text.includes("cambiar")) showBusinessMenu();
            else addBotMessage(`<strong>¿Qué quieres hacer ahora?</strong><br><br><strong>1.</strong> Explorar este negocio<br><strong>2.</strong> Elegir otro negocio<br><strong>0.</strong> Volver al inicio`);
            break;
        default: showBusinessMenu();
    }
}
function handleMainMenu(text) {
    if (text.includes("contacto")) { showContact(); return; }
    if (negocioActual === "restaurante") {
        if (text === "1" || text.includes("menu") || text.includes("menú")) showCatalog("todos");
        else if (text === "2" || text.includes("combo")) showCatalog("combos");
        else if (text === "3" || text.includes("disponible") || text.includes("stock")) showCatalog("disponibles");
        else if (text === "4" || text.includes("domicilio") || text.includes("recoger")) { addBotMessage("Primero elige el plato o combo que quieres pedir. Después Cora te preguntará si prefieres domicilio o recogerlo."); showCatalog("todos"); }
        else if (text === "5" || text.includes("sede") || text.includes("cerca")) preguntarZonaSedes();
        else respuestaMenu();
    } else if (negocioActual === "gimnasio") {
        if (text === "1" || text.includes("membresia") || text.includes("plan")) showCatalog("membresias");
        else if (text === "2" || text.includes("producto") || text.includes("combo")) showCatalog("productos");
        else if (text === "3" || text.includes("todo")) showCatalog("todos");
        else if (text === "4" || text.includes("sede") || text.includes("cerca")) preguntarZonaSedes();
        else respuestaMenu();
    } else if (negocioActual === "muebles") {
        if (text === "1" || text.includes("mueble") || text.includes("disponible") || text.includes("stock")) showCatalog("muebles");
        else if (text === "2" || text.includes("combo")) showCatalog("combos");
        else if (text === "3" || text.includes("medida") || text.includes("presupuesto") || text.includes("buscar")) { chatbotState = "buscar-mueble"; addBotMessage("Escribe una medida máxima o presupuesto para filtrar el catálogo. Ejemplos: <strong>180 cm</strong>, <strong>menos de 500000</strong> o <strong>sofá</strong>."); }
        else if (text === "4" || text.includes("entrega") || text.includes("sede") || text.includes("domicilio")) { addBotMessage("Para consultar opciones de visita o entrega, primero elige un mueble del catálogo. También puedes escribir <strong>1</strong> para ver los muebles."); }
        else respuestaMenu();
    }
}
function respuestaMenu() { addBotMessage("Elige una de las opciones del menú o escribe <strong>0</strong> para cambiar de negocio."); }
function showCatalog(tipo) {
    const productos = catalogos[negocioActual] || [];
    productosVisibles = productos.filter(p => {
        if (tipo === "todos") return true;
        if (tipo === "combos") return p.tipo === "combo";
        if (tipo === "disponibles") return p.stock > 0;
        if (tipo === "membresias") return p.tipo === "membresia";
        if (tipo === "productos") return ["producto", "combo"].includes(p.tipo);
        if (tipo === "muebles") return p.tipo === "mueble" || p.tipo === "combo";
        return true;
    });
    chatbotState = "catalogo";
    const titulos = { restaurante: "🍔 MENÚ Y COMBOS", gimnasio: "🏋️ MEMBRESÍAS Y PRODUCTOS", muebles: "🛋️ CATÁLOGO DE MUEBLES" };
    let lista = "";
    productosVisibles.forEach((p, i) => {
        const estado = p.stock > 0 ? `✅ Disponible (${p.stock} en esta demo)` : "❌ Agotado en esta demo";
        lista += `<strong>${i + 1}. ${escapeHTML(p.nombre)}</strong> — <strong>${formatPrice(p.precio)}</strong><br>${escapeHTML(p.descripcion)}<br><small>${estado}</small><br><br>`;
    });
    addBotMessage(`<strong>${titulos[negocioActual]}</strong><br><br>${lista || "No hay opciones en esta categoría."}Escribe el número para consultar una opción, incluso si aparece agotada, y te mostraré alternativas cuando existan.<br><br><strong>0.</strong> Volver al menú`);
}
function handleCatalogSelection(text) {
    const n = Number(text);
    if (!Number.isInteger(n) || n < 1 || n > productosVisibles.length) { addBotMessage(`Escribe un número entre 1 y ${productosVisibles.length}, o 0 para volver.`); return; }
    const producto = productosVisibles[n - 1];
    if (producto.stock <= 0) {
        const alternativa = producto.alternativa && catalogos[negocioActual].find(p => p.id === producto.alternativa);
        addBotMessage(`<strong>${escapeHTML(producto.nombre)}</strong> aparece agotado en el inventario de demostración.<br><br>${alternativa && alternativa.stock > 0 ? `Puedes considerar <strong>${escapeHTML(alternativa.nombre)}</strong> por ${formatPrice(alternativa.precio)}. Escribe <strong>1</strong> para ver esa alternativa o <strong>2</strong> para volver al catálogo.` : "No hay una alternativa disponible registrada por ahora."}`);
        chatbotState = alternativa && alternativa.stock > 0 ? "alternativa" : "catalogo";
        if (chatbotState === "alternativa") { window.coraAlternativa = alternativa; }
        return;
    }
    showRecommendation(producto);
}
function showRecommendation(producto) {
    productoSeleccionado = producto;
    chatbotState = "confirmar-producto";
    const extra = negocioActual === "muebles" ? `<br><br><em>Verifica medidas y existencias con la tienda antes de desplazarte. Los datos son de demostración.</em>` : "";
    addBotMessage(`<strong>✨ ${escapeHTML(producto.nombre)}</strong><br><br>${escapeHTML(producto.descripcion)}<br><br>Precio de referencia: <strong>${formatPrice(producto.precio)}</strong><br>Disponibilidad en esta demo: <strong>${producto.stock > 0 ? `${producto.stock} unidades` : "agotado"}</strong>${extra}<br><br><strong>1.</strong> Continuar<br><strong>2.</strong> Volver al catálogo`);
}
function preguntarCantidad() {
    chatbotState = "cantidad";
    addBotMessage(`¿Cuántas unidades de <strong>${escapeHTML(productoSeleccionado.nombre)}</strong> quieres? Escribe un número del 1 al ${Math.min(productoSeleccionado.stock, 10)}.`);
}
function handleCantidad(text) {
    const cantidad = Number(text);
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > Math.min(productoSeleccionado.stock, 10)) { addBotMessage(`Escribe una cantidad entre 1 y ${Math.min(productoSeleccionado.stock, 10)}.`); return; }
    pedidoActual.cantidad = cantidad;
    if (negocioActual === "gimnasio" && productoSeleccionado.tipo === "membresia") {
        chatbotState = "entrega";
        addBotMessage(`<strong>¿Cómo quieres continuar con tu membresía?</strong><br><br><strong>1.</strong> Consultar una sede cercana y activarla allí<br><strong>2.</strong> Continuar con la solicitud de membresía por correo<br><br>La activación y el pago real deben confirmarse con el gimnasio.`);
    } else preguntarEntrega();
}
function preguntarEntrega() {
    chatbotState = "entrega";
    const opciones = negocioActual === "restaurante"
        ? `<strong>1.</strong> Domicilio<br><strong>2.</strong> Recoger en el restaurante<br><strong>3.</strong> Ver sedes de ejemplo`
        : negocioActual === "gimnasio"
            ? `<strong>1.</strong> Envío por la empresa (producto)<br><strong>2.</strong> Recoger en una sede<br><strong>3.</strong> Ver sedes de ejemplo`
            : `<strong>1.</strong> Solicitar entrega a domicilio<br><strong>2.</strong> Visitar una tienda<br><strong>3.</strong> Ver sedes de ejemplo`;
    addBotMessage(`<strong>¿Qué opción prefieres?</strong><br><br>${opciones}<br><br>El PIN solo verificará tu correo. El pago y la confirmación reales no están habilitados en esta demostración.`);
}
function handleEntrega(text) {
    if (negocioActual === "gimnasio" && productoSeleccionado && productoSeleccionado.tipo === "membresia") {
        if (text === "1" || text.includes("sede") || text.includes("cerca")) { preguntarZonaSedes(); }
        else if (text === "2" || text.includes("correo") || text.includes("continuar")) mostrarResumenPedido();
        else addBotMessage("Elige 1 para consultar una sede o 2 para continuar con la solicitud por correo.");
        return;
    }
    if (text === "1" || text.includes("domicilio") || text.includes("envio") || text.includes("envío")) {
        pedidoActual.entrega = "Domicilio / envío de la empresa"; chatbotState = "zona-domicilio";
        addBotMessage("¿En qué barrio, sector o municipio sería la entrega? Con esa información el negocio tendría que comprobar la cobertura antes de aceptar el pedido.");
    } else if (text === "2" || text.includes("recoger") || text.includes("visitar") || text.includes("tienda") || text.includes("sede")) {
        pedidoActual.entrega = negocioActual === "restaurante" ? "Recoger en restaurante" : "Recoger en sede / visitar tienda";
        pedidoActual.envio = 0; mostrarResumenPedido();
    } else if (text === "3" || text.includes("sede") || text.includes("cerca")) preguntarZonaSedes();
    else addBotMessage("Elige 1 para domicilio/envío, 2 para recoger o visitar una sede, o 3 para consultar sedes.");
}
function preguntarZonaSedes() {
    chatbotState = "sede-zona";
    addBotMessage("Escribe tu barrio o zona para orientarte sobre una sede cercana. Esta demo muestra sedes ficticias y no usa tu ubicación automática; confirma las direcciones reales con el negocio.");
}
function mostrarSedes(zona) {
    const z = normalizeText(zona);
    const sugerida = z.includes("norte") ? sedesDemo[1] : z.includes("sur") ? sedesDemo[2] : sedesDemo[0];
    chatbotState = "menu-principal";
    addBotMessage(`Para la zona <strong>${escapeHTML(zona)}</strong>, esta demo sugiere consultar: <strong>${escapeHTML(sugerida.nombre)}</strong>.<br>${escapeHTML(sugerida.direccion)}<br><br>Estas sedes son ficticias y deben reemplazarse por ubicaciones reales; Cora no puede garantizar proximidad con estos datos.<br><br>Escribe <strong>1</strong> para volver al menú.`);
}
function buscarMueble(text) {
    const t = normalizeText(text);
    const muebles = catalogos.muebles.filter(p => {
        const precioMatch = t.match(/(?:menos de|hasta|maximo|maximo de)\s*(\d+)/);
        const cmMatch = t.match(/(\d+)\s*cm/);
        const porPrecio = precioMatch ? p.precio <= Number(precioMatch[1]) : true;
        const porNombre = /sofa|mesa|armario|escritorio|combo/.test(t) ? t.split(/\s+/).some(w => w.length > 3 && normalizeText(p.nombre).includes(w)) : true;
        const ancho = p.descripcion.match(/(?:Medidas: )?(\d+)\s*[×x]/i);
        const porMedida = cmMatch && ancho ? Number(ancho[1]) <= Number(cmMatch[1]) : true;
        return porPrecio && porNombre && porMedida;
    });
    productosVisibles = muebles; chatbotState = "catalogo";
    if (!muebles.length) { addBotMessage("No encontré coincidencias con ese criterio en el catálogo de ejemplo. Prueba con ‘sofá’, ‘mesa’, ‘menos de 500000’ o ‘180 cm’. Escribe 0 para volver."); return; }
    let lista = "";
    muebles.forEach((p, i) => { lista += `<strong>${i + 1}. ${escapeHTML(p.nombre)}</strong> — ${formatPrice(p.precio)}<br>${escapeHTML(p.descripcion)}<br><small>${p.stock > 0 ? "Disponible en esta demo" : "Agotado en esta demo"}</small><br><br>`; });
    addBotMessage(`<strong>Resultados de ejemplo</strong><br><br>${lista}Escribe el número del producto que quieres consultar, o 0 para volver.`);
}
function mostrarResumenPedido() {
    chatbotState = "confirmar-pedido";
    const subtotal = productoSeleccionado.precio * pedidoActual.cantidad;
    const total = subtotal + pedidoActual.envio;
    const direccion = pedidoActual.direccion ? `<br>Zona: ${escapeHTML(pedidoActual.zona)}<br>Dirección: ${escapeHTML(pedidoActual.direccion)}` : "";
    const envio = pedidoActual.envio ? formatPrice(pedidoActual.envio) : "Sin costo de envío en esta simulación";
    addBotMessage(`<strong>🧾 Resumen de tu solicitud</strong><br><br>Negocio: ${escapeHTML(nombresNegocio[negocioActual])}<br>Opción: ${escapeHTML(productoSeleccionado.nombre)}<br>Cantidad: ${pedidoActual.cantidad}<br>Subtotal: ${formatPrice(subtotal)}<br>Entrega: ${escapeHTML(pedidoActual.entrega || "Solicitud de membresía")}<br>Envío estimado de demostración: ${envio}${direccion}<br><br><strong>Total estimado: ${formatPrice(total)}</strong><br><br>La tarifa, cobertura y existencias son de ejemplo. No se ha creado un pedido ni cobrado dinero.<br><br><strong>1.</strong> Continuar y verificar correo<br><strong>2.</strong> Volver al menú`);
}
function pedirNombre() {
    chatbotState = "nombre-compra";
    addBotMessage("Escribe tu nombre para incluirlo en el resumen de esta demostración. No escribas contraseñas ni datos bancarios.");
}
function showContact() {
    chatbotState = "contacto";
    addBotMessage(`<strong>📞 Contacto ByteCore</strong><br><br>¿Te interesa adaptar Cora a tu restaurante, gimnasio o tienda de muebles? Utiliza el formulario de contacto de la página para contarnos tu necesidad.<br><br><strong>0.</strong> Volver al inicio`);
}
function resetChatbot() { showBusinessMenu(); }
if (chatbotInput) chatbotInput.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); sendChatMessage(); } });
if (chatbotSend) chatbotSend.addEventListener("click", sendChatMessage);
if (chatbotMessages) { chatbotMessages.innerHTML = ""; showBusinessMenu(); }
else console.error("Cora no encontró #chatbot-messages. Revisa los IDs del HTML.");
if (!chatbotInput) console.error("Cora no encontró #chatbot-input.");
if (!chatbotSend) console.error("Cora no encontró #chatbot-send.");

// Alternativa de producto agotado, y acción inicial tras seleccionar un producto disponible.
const processMessageOriginal = processMessage;
processMessage = function(message) {
    const text = normalizeText(message);
    if (chatbotState === "alternativa") {
        if ((text === "1" || text.includes("alternativa")) && window.coraAlternativa) { const p = window.coraAlternativa; window.coraAlternativa = null; showRecommendation(p); return; }
        if (text === "2" || text.includes("catalogo") || text.includes("volver")) { window.coraAlternativa = null; showCatalog("todos"); return; }
        addBotMessage("Escribe 1 para ver la alternativa o 2 para volver al catálogo."); return;
    }
    if (chatbotState === "confirmar-producto") {
        if (text === "1" || text.includes("continuar") || text === "si" || text === "sí") { preguntarCantidad(); return; }
        if (text === "2" || text.includes("catalogo") || text.includes("volver")) { showCatalog("todos"); return; }
        addBotMessage("Escribe 1 para continuar o 2 para volver al catálogo."); return;
    }
    processMessageOriginal(message);
};

async function solicitarPinCora(email) {
    const correo = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { addBotMessage("Ese correo no parece válido. Escríbelo de nuevo."); return; }
    if (!productoSeleccionado) { addBotMessage("No encuentro la selección. Volvamos al menú."); showMainMenu(); return; }
    clienteCora.email = correo;
    addBotMessage("Estoy solicitando tu código de verificación... ✉️");
    try {
        const respuesta = await fetch("/api/enviar-pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: clienteCora.nombre, email: clienteCora.email }) });
        const resultado = await respuesta.json();
        if (!respuesta.ok || !resultado.success) { addBotMessage(escapeHTML(resultado.message || "No fue posible enviar el PIN.")); return; }
        pinEnviado = true; chatbotState = "verificar-pin";
        addBotMessage(`<strong>📩 Código solicitado</strong><br><br>${escapeHTML(resultado.message)}<br><br>Revisa tu bandeja de entrada y spam. Escribe aquí el PIN de seis dígitos. Caduca en 10 minutos.<br><br><em>Verificar el correo no equivale a pagar ni confirmar un pedido real.</em>`);
    } catch (error) {
        console.error("Error solicitando PIN:", error);
        addBotMessage("No pude conectar con el servidor. Comprueba que Node.js esté ejecutándose e inténtalo de nuevo.");
    }
    // Importante: conservar nombre, correo y pinEnviado hasta terminar la verificación.
}
async function verificarPinCora(pin) {
    if (!pinEnviado) { addBotMessage("Primero solicita un PIN para tu correo."); return; }
    if (!/^\d{6}$/.test(pin)) { addBotMessage("Escribe el PIN de seis dígitos que recibiste por correo."); return; }
    addBotMessage("Verificando el código... 🔐");
    try {
        const respuesta = await fetch("/api/verificar-pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: clienteCora.email, pin }) });
        const resultado = await respuesta.json();
        if (!respuesta.ok || !resultado.success) { addBotMessage(escapeHTML(resultado.message || "No se pudo verificar el código.")); return; }
        finalizarCompraDemoVerificada();
    } catch (error) { console.error("Error verificando PIN:", error); addBotMessage("No pude conectar con el servidor para verificar el PIN. Inténtalo de nuevo."); }
}
function finalizarCompraDemoVerificada() {
    if (!productoSeleccionado) { showMainMenu(); return; }
    const subtotal = productoSeleccionado.precio * pedidoActual.cantidad;
    const record = {
        negocio: nombresNegocio[negocioActual], cliente: clienteCora.nombre, email: clienteCora.email,
        producto: productoSeleccionado.nombre, cantidad: pedidoActual.cantidad, subtotal,
        entrega: pedidoActual.entrega, zona: pedidoActual.zona, direccion: pedidoActual.direccion,
        envioEstimado: pedidoActual.envio, totalEstimado: subtotal + pedidoActual.envio,
        estado: "DEMO - NO PAGADO", correoVerificado: true, fecha: new Date().toISOString()
    };
    try {
        // Guardar solo datos no identificables en el navegador; no persistir correo ni dirección.
        const guardadas = localStorage.getItem("cora_compras_demo"); const compras = guardadas ? JSON.parse(guardadas) : [];
        const registroAnonimo = {
            negocio: record.negocio, producto: record.producto, cantidad: record.cantidad,
            subtotal: record.subtotal, entrega: record.entrega, envioEstimado: record.envioEstimado,
            totalEstimado: record.totalEstimado, estado: record.estado, fecha: record.fecha
        };
        if (Array.isArray(compras)) { compras.push(registroAnonimo); localStorage.setItem("cora_compras_demo", JSON.stringify(compras)); }
    } catch (error) { console.warn("No fue posible guardar el registro de demostración:", error); }
    pinEnviado = false; chatbotState = "fin";
    addBotMessage(`<strong>✅ Correo verificado</strong><br><br>Cliente: ${escapeHTML(record.cliente)}<br>Correo: ${escapeHTML(record.email)}<br>Negocio: ${escapeHTML(record.negocio)}<br>Selección: ${escapeHTML(record.producto)} × ${record.cantidad}<br>Entrega: ${escapeHTML(record.entrega || "Solicitud de membresía")}<br>Subtotal: ${formatPrice(record.subtotal)}<br>Envío estimado: ${formatPrice(record.envioEstimado)}<br><strong>Total estimado: ${formatPrice(record.totalEstimado)}</strong><br><br><strong>Estado: DEMOSTRACIÓN — NO PAGADO</strong><br>El correo quedó verificado, pero no se realizó un cobro ni se envió un pedido al comercio. Para pagos reales habrá que integrar una pasarela de pago y un backend de pedidos.<br><br><strong>1.</strong> Explorar este negocio<br><strong>2.</strong> Elegir otro negocio<br><strong>0.</strong> Volver al inicio`);
}
