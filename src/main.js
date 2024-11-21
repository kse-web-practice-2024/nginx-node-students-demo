import Fastify from 'fastify';
import fs from 'fs';

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

    const res = await fetch(URL, {
        headers: new Headers({
            "x-api-key": API_KEY
        })
    })
    const data = await res.json()

    reply.type('application/json')

    return reply.send(data)
});

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
