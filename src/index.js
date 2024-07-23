import express, { json } from "express";
import { PORT } from "./config.js";
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import cors from "cors";
import { createPool } from "mysql";

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
            "fTYY4_tnQ9aKDM2MxD-GzW:APA91bG2SBSja5p1JlD8sgL16cunG1AsXfKiqBavvHWlxF0OngHxnbJoIw4tJY37R4vARb2-AwShLsBQbUoG1gF6a1Lv0vpO-_v0qp05DDi-VT1v9G_VO7EuVtJ20kPUJzwy3S-0sTzo",
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
