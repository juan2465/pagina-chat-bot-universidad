document.getElementById("contact-form").addEventListener("submit", async function (e) {

    e.preventDefault();

    const nombre = document.getElementById("name").value.trim();
    const negocio = document.getElementById("business").value.trim();
    const email = document.getElementById("email").value.trim();
    const tipoNegocio = document.getElementById("business-type").value.trim();
    const mensaje = document.getElementById("message").value.trim();

    if (!nombre || !email || !mensaje) {
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    try {

        const respuesta = await fetch("/contacto", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nombre: nombre,
                negocio: negocio,
                email: email,
                tipoNegocio: tipoNegocio,
                mensaje: mensaje
            })

        });


        const resultado = await respuesta.json();


        if (resultado.success) {

            alert(
                "¡Gracias por contactar a ByteCore!\n\n" +
                "Hemos recibido tu solicitud."
            );

            document.getElementById("contact-form").reset();

        } else {

            alert(
                resultado.message ||
                "No se pudo enviar la solicitud."
            );

        }

    } catch (error) {

        console.error("Error:", error);

        alert(
            "No se pudo conectar con el servidor.\n\n" +
            "Si estás realizando una demostración local, verifica que Node.js esté ejecutándose."
        );

    }

});