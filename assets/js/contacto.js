document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("message").value.trim();

    if (!nombre || !email || !mensaje) {
        alert("Por favor completa todos los campos.");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/contacto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                mensaje: mensaje
            })
        });

        const resultado = await respuesta.json();

        if (resultado.success) {
            alert("¡Mensaje enviado correctamente! Gracias por contactarnos.");
            document.getElementById("contact-form").reset();
        } else {
            alert(resultado.message || "No se pudo enviar el mensaje.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor. Verifica que Node.js esté ejecutándose.");
    }
});