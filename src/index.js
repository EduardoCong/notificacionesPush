import express, { json } from "express";
import { PORT } from "./config.js";
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import cors from "cors";

process.env.GOOGLE_APPLICATIONS_CREDENTIALS;

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


app.post("/send", (req, res) => {
    const receivedToken = req.body.fcmToken;
    const message = {
        notification: {
            title: "¡Es tu su turno!",
            body: "Pase al ande 5",
        },
        token:
            "ca8t2w4dTeChqPwFE9rioy:APA91bEPnHeC4aLK3cSGGPfLqmQ7g5D3HFzmdHxNe44e725b44e_gJ-qid1Ro7EMdTg4L8YL7442o7UZHMO1tVCrfjHzUsRug21h2RnpkfIdBr93YaKTw18EneOywPN14rvz3WvNcICg",
    };

    getMessaging()
        .send(message)
        .then((response) => {
            res.status(200).json({
                message: "Mensaje enviado con exito",
                token: receivedToken,
            });
            console.log("Mensaje enviado", response);
        })
        .catch((error) => {
            res.status(400);
            res.send(error);
            console.log("Error al enviar mensaje", error);
        });
});

app.listen(PORT, () => {
    console.log("server on port", PORT);
});
