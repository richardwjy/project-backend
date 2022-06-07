const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const log4js = require('log4js');
log4js.configure({
    appenders: { auth: { type: "file", filename: `logs/auth.log` } },
    categories: { default: { appenders: ["auth"], level: "debug" } }
});

// const webRoute = require('./web/router');
app.use(cors({
    credentials: true,
    origin: true
    // allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept']
}))

// const oracledb = require('oracledb');
// const fs = require('fs');

// let libPath;
// if (process.platform == 'win32') {
//     libPath = 'C:\\oracle\\instantclient_21_3'
// } else if (process.platform === 'linux') {
//     libPath = './instantclient_21_5'
// }

// if (libPath && fs.existsSync(libPath)) {
//     oracledb.initOracleClient({ libDir: libPath });
// }

const PORT = process.env.PORT || 3000;

app.use(express.json());

// app.use('/v1/api', webRoute);

app.get('/', (req, res) => {
    return res.json({ message: "Hello World" });
})

app.get('/home', (req, res) => {
    return res.json({ message: "Home page!" });
})

app.get('/about', (req, res) => {
    return res.json({ message: "About page!" });
})

app.listen(PORT, () => {
    console.log(`Application is running on PORT : ${PORT}`);
})