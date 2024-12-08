import Fastify from 'fastify';
import fs from 'fs';
import jwt from 'jsonwebtoken'
import sqlite3 from 'sqlite3';

const JWT_SECRET = 'SOME_SECRET_HERE'

const fastify = Fastify({ logger: true });


// fastify.get('*', async (req, reply) => {
//     const file = fs.readFileSync(`./static${req.url}`);
//     if (req.url.endsWith('.png')) {
//         reply.type('image/png');
//     }
//
//     if (req.url.endsWith('.html')) {
//         reply.type('text/html');
//     }
//
//     if (req.url.endsWith('.css')) {
//         reply.type('text/css');
//     }
//
//     if (req.url.endsWith('.js')) {
//         reply.type('text/javascript');
//     }
//
//     return reply.send(file)
// });

const URL = 'https://api.thecatapi.com/v1/breeds'
const API_KEY = "live_qNGmmIapMgENtt7DfBD9VQVqohCHDu4AepQDIW3LfFQ0BhJ1wyV77I6cnM6aRfRn";

fastify.get('/api', async (req, reply) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    try {
        const decodedData = jwt.verify(token, JWT_SECRET)

        const currentTime = Date.now() / 1000
        console.log(decodedData, decodedData.iat, currentTime)
        if (decodedData.iat < currentTime - 25 * 60 * 1000) {
            reply.code(401)
            return reply.send('Not authorized')
        }
    } catch(e) {
        console.log(e)
        return reply.code(500).send(e)
    }


    const res = await fetch(URL, {
        headers: new Headers({
            "x-api-key": API_KEY
        })
    })
    const data = await res.json()

    reply.type('application/json')

    return reply.send(data)
});


fastify.post('/auth', async (request, reply) => {
    const { login, password } = request.body
    try {
        const user = await getUser(login, password)
        return jwt.sign({
            id: 1, //auto generated
            login: user.login,
        }, JWT_SECRET)
    } catch (err) {
        reply.code(401)
        return reply.send(err)
    }

})

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Server listening on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
// initDB();

function getUser(user, password) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db');
        const query = `SELECT * from users where login='${user}' and password='${password}' LIMIT 1`
        db.get(query, (error, data) => {
            if (error) {
                reject(error)
                return
            }

            return resolve(data)
        })
    })
}

async function initDB() {
    const db = new sqlite3.Database('./database.db');
    db.serialize(() => {
        db.run("CREATE TABLE users (id INTEGER, login TEXT, password TEXT)");

        const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)");
        stmt.run(1, "user", "pass");
        stmt.finalize();
    });
}
