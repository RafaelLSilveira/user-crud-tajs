import { once } from 'node:events'
import { createServer } from 'node:http'
import querystring from 'node:querystring'
import { deleteUser, getUsers, initializeDb, insertUser, updateUser } from './dbConnector.js'


const PORT = 3000
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" }
const CONTENT_TYPE_HTML = { "Content-Type": "text/html" }
export const STATUS_CODE = {
    SUCCESS: 200,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500,
}

const sendResponse = (res, statusCode, data, contentType) => {
    res.writeHead(statusCode, contentType)
    if(data) {
        res.write(data)
    }
    
    res.end()
}

async function analyticsRequest(req, res) {
    const { appId, ...args } = JSON.parse(await once(req, 'data'))
    console.log(`[app: ${appId}]`, args)

    sendResponse(res, STATUS_CODE.SUCCESS,'ok')
}

async function possibleRoutes(req, res) {
    // console.info("URL:", req.url)
    // console.info("METODO:", req.method)
    try {
        if(req.url === "/" && req.method === 'GET') {
            sendResponse(res, STATUS_CODE.SUCCESS,"<b>==> API UP <==</b>", CONTENT_TYPE_HTML)
            return
        }

        if(req.url.includes('users') && req.method === 'GET') {
            const params = new URLSearchParams(req.url.split('?')[1])
            const limit = parseInt(params.get('limit'))
            const skip = parseInt(params.get('skip'))
            const search = params.get('search') || ''        // Default search is an empty string
            const id = parseInt(params.get('id')) || undefined      // User id to single search
    
            const data = await getUsers(limit, skip, search, id)
            sendResponse(res, STATUS_CODE.SUCCESS, JSON.stringify(data), CONTENT_TYPE_JSON)
            
            return
        } 

        if(req.url.includes('users') && req.method === 'POST') {
            req.setEncoding('utf8')

            let requestBody = ''
            req.on('data', (chunk) => {
                requestBody += chunk
            })

            req.on('end', async () => {
                await insertUser(JSON.parse(requestBody))
                sendResponse(res, STATUS_CODE.SUCCESS, 'ok')
            })

            return
        }

        if(req.url.includes('users') && req.method === 'PUT') {
            req.setEncoding('utf8')

            const userId = querystring.decode(req.url.split("?")[1])?.id
            if(userId) {
                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk;
                });
                
                req.on('end', async () => {
                    await updateUser(userId, JSON.parse(requestBody))
                    sendResponse(res, STATUS_CODE.SUCCESS,'ok')
                })
            } else {
                console.error('404 - userId não encontrado!')
                sendResponse(res, STATUS_CODE.NOT_FOUND_ERROR, JSON.stringify({ error: 'userId não encontrado!' }), CONTENT_TYPE_JSON)
            }

            return
        }

        if(req.url.includes('users') && req.method === 'DELETE') {
            req.setEncoding('utf8')
            const userId = querystring.decode(req.url)["/users?id"]
            if(userId) {
                await deleteUser(userId)
                sendResponse(res, STATUS_CODE.SUCCESS, 'ok')
            } else {
                console.error('404 - userId não encontrado!')
                sendResponse(res, STATUS_CODE.NOT_FOUND_ERROR, JSON.stringify({ error: 'userId não encontrado!' }), CONTENT_TYPE_JSON)
            }

            return
        }
    } catch (error) {
        console.error("500 - erro inesperado", error)
        sendResponse(res, STATUS_CODE.SERVER_ERROR)

        return
    }
    
    console.error("404 - rota não encontrada")
    sendResponse(res, STATUS_CODE.NOT_FOUND_ERROR, JSON.stringify({ error: 'rota não encontrada!' }), CONTENT_TYPE_JSON)
}

const api = createServer(async (req, res) => {
    // Allow CORS for all origins and methods
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')

    // Handling preflight requests
    if (req.method === 'OPTIONS') { 
        sendResponse(res, STATUS_CODE.SUCCESS)
        return
    }

    if(req.url.includes('analytics') && req.method === 'POST') {
       return analyticsRequest(req, res)
    }

    return possibleRoutes(req, res)
}).listen(PORT, async () =>  {
        // initialize DB
        await initializeDb()
        console.log(`Server is running at http://localhost:${PORT}`)
    }
)

export { api }
