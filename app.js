const serverPort = "8000";

const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode');
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const { response } = require('express');
const SESSION_FILE_PATH = './session.json';

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });

var ready = false;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
})

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

io.on("connection", function(socket) {
    socket.emit("message", " Connection started...");
    if (ready) {
        socket.emit("ready", " Whatsapp Status Ready!");
    }

    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            socket.emit("message", " QR Code Ready, Waiting Autentication !!");
            ready = true;
        });
    });

    client.on('ready', () => {
        socket.emit("ready", " Whatsapp Status Ready!");
        socket.emit("message", " Whatsapp Status Ready!");
        ready = true;
    });

    client.on('authenticated', (session) => {
        socket.emit("authenticated", " Whatsapp Status Ready!");
        socket.emit("message", " Whatsapp Authenticated!");
        ready = true;
        console.log('AUTHENTICATED', session);
        sessionCfg = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
            if (err) {
                console.error(err);
            }
        });
    });
})

app.post('/send', (req, res) => {
    var number = req.body.number,
        msg = req.body.message;

    client.sendMessage(number + "@c.us", msg).then(response => {
        res.status(200).json({
            status: true,
            response: response
        });
    }).catch(err => {
        res.status(500).json({
            status: false,
            response: err
        });
    });
})

server.listen(serverPort, function() {
    console.log("App running on localhost:" + serverPort);
})

client.initialize();