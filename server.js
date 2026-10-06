const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "juancarlosmoreno356@gmail.com",
        pass: "CONTRASEÑA_DE_APLICACION"
    }
});


app.post("/contacto", async (req, res) => {

    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios."
        });
    }

    try {

        await transporter.sendMail({
            from: "juancarlosmoreno356@gmail.com",
            to: "juancarlosmoreno356@gmail.com",
            replyTo: email,
            subject: `Nuevo mensaje de ${nombre} - ByteCore`,
            text: `
Nuevo mensaje recibido desde ByteCore IA Solutions

Nombre: ${nombre}
Correo: ${email}

Mensaje:
${mensaje}
            `
        });

        res.json({
            success: true,
            message: "Mensaje enviado correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "No se pudo enviar el mensaje."
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor ByteCore ejecutándose en http://localhost:3000");
});