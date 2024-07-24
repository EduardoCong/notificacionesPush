import express, { json } from "express";
import { PORT } from "./config.js";
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import cors from "cors";
import pool from "./db.js"
const app = express();
app.use(express.json());

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
);

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

initializeApp({
    credential: applicationDefault(),
    projectId: "pushnotis-50040",
});


app.post("/send-notification", async (req, res) => {
    const clientId = req.body.clientId;
    const turno = req.body.turno;
    const modulo = req.body.modulo;

    try {
        const [devices] = await pool.execute(
            "SELECT token_dispositivo FROM db_dispositivos_notificaciones WHERE cliente_id = ?", 
            [clientId]
        );

        if (devices.length === 0) {
            return res.status(404).json({ message: "No devices found for client" });
        }

        const messaging = getMessaging();
        const message = {
            notification: {
                title: `¡Es tu turno: ${turno}!`,
                body: `¡Pase al andén: ${modulo}!`, 
            },
        };

        const promises = devices.map(device => {
            message.token = device.token_dispositivo;
            return messaging.send(message);
        });

        const results = await Promise.allSettled(promises);

        const successfulSends = results.filter(result => result.status === "fulfilled");
        res.status(200).json({
            message: "Messages sent successfully",
            successfulSends: successfulSends.length,
            totalDevices: devices.length
        });

    } catch (error) {
        res.status(500).json({ message: "Error sending messages", error: error.message });
        console.error("Error sending messages:", error);
    }
});

app.listen(PORT, () => {
    console.log("server on port", PORT);
});
