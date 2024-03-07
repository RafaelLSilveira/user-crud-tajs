import { once } from 'node:events'
import { createServer } from 'node:http'
import querystring from 'node:querystring'
import { deleteUser, getUsers, insertUser, updateUser } from './dbConnector.js'


async function analyticsRequest(req, res) {
    const { appId, ...args } = JSON.parse(await once(req, 'data'))
    console.log(`[app: ${appId}]`, args)

    res.writeHead(200)
    return res.end('ok');
}

async function possibleRoutes(req, res) {
    console.info("URL:", req.url)
    console.info("METODO:", req.method)
    try {
        if(req.url === "/" && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("<p>Server UP</p");
            return res.end();
        }

        if(req.url.includes('users') && req.method === 'GET') {
            // get limit and skip from query string or set default values
            const params = new URLSearchParams(req.url.split('?')[1])
            const limit = parseInt(params.get('limit')) || 10 // Default limit is 10
            const skip = parseInt(params.get('skip')) || 0   // Default skip is 0
            const search = params.get('search') || ''        // Default search is an empty string
            const id = parseInt(params.get('id')) || undefined      // User id to single search
    
            // Generate objects as an array with faker library
            res.writeHead(200, { 'Content-Type': 'application/json' })

            const data = await getUsers(limit, skip, search, id);
            res.write(JSON.stringify(data))
            return res.end()
        } 

        if(req.url.includes('users') && req.method === 'POST') {
            req.setEncoding('utf8');
            return await new Promise ((resolve) => {
                try {
                    req.on('data', async function (body) {
                        await insertUser(JSON.parse(body));
                        res.writeHead(200);
                        resolve(res.end('ok'));
                    }) 
                } catch (error) {
                    reject(new Error(error));
                }
            });
        }

        if(req.url.includes('users') && req.method === 'PUT') {
            req.setEncoding('utf8');
            return await new Promise ((resolve, reject) => {
                const userId = querystring.decode(req.url.split("?")[1])?.id;
                if(userId) {
                    try {
                        req.on('data', async function (body) {
                            await updateUser(userId, JSON.parse(body));
                        });
                        res.writeHead(200);
                        resolve(res.end('ok'));
                    } catch (error) {
                        reject(new Error(error));
                    }
                } else {
                    reject(new Error("Identificador do usuário não enviado"));
                }
            });
        }

        if(req.url.includes('users') && req.method === 'DELETE') {
            req.setEncoding('utf8');
            const userId = querystring.decode(req.url)["/users?id"];
            if(userId) {
                await deleteUser(userId);
            }
            res.writeHead(200);
            return res.end('ok');
        }

    } catch (error) {
        console.error("500 - erro inesperado", error);
        res.writeHead(500);
        return res.end();
    }
    
    console.error("404 - rota não encontrada")
    res.writeHead(404);
    return res.end();
}

createServer(async (req, res) => {
    // Allow CORS for all origins and methods
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')

    // Handling preflight requests
    if (req.method === 'OPTIONS') { 
        res.writeHead(200)
        res.end()
        return
    }

    if(req.url.includes('analytics') && req.method === 'POST') {
       return analyticsRequest(req, res);
    }

    return possibleRoutes(req, res);

}).listen(3000, () => console.log('Server is running at http://localhost:3000/'))
