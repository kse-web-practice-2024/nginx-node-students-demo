import Fastify from 'fastify';
import fs from 'fs';
import jwt from 'jsonwebtoken'
import sqlite3 from 'sqlite3';
import {getAuthInfo} from "./get-auth-info.js";
import {JWT_SECRET} from "./secrets.js";
import {getCats} from "./get-cats.js";


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


const API_KEY = "live_qNGmmIapMgENtt7DfBD9VQVqohCHDu4AepQDIW3LfFQ0BhJ1wyV77I6cnM6aRfRn";


fastify.get('/api', async (req, reply) => {
    const authHeader = req.headers.authorization;

    const user = getAuthInfo(authHeader, JWT_SECRET)
    if (!user) {
        reply.code(401)
        return reply.send('Not authorized')
    }

    const cats = await getCats(fetch, API_KEY)

    reply.type('application/json')

    return reply.send(cats)
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
