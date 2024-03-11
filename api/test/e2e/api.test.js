import { deepStrictEqual, strictEqual } from 'node:assert'
import { after, before, describe, it } from 'node:test'
import { STATUS_CODE } from '../../api.js'

const BASE_URL = 'http://localhost:3000'

describe('< API />', () => {
    let _server = {}

    before(async () => {
        _server = (await import('../../api.js')).api
    })

    after(done => _server.close(done))

    it("shouldn't be possible to access routes out of scope users",  async () => {
        const response = await fetch(`${BASE_URL}/people`)

        const errorMessage = await response.json()
        
        strictEqual(response.status, STATUS_CODE.NOT_FOUND_ERROR)
        deepStrictEqual(response.statusText, 'Not Found')
        deepStrictEqual(errorMessage, { error: 'rota não encontrada!' })
    })

    it("shouldn't be possible update an user without id",  async () => {
        const data = {
            "name": "You Doe Lee",
            "age": 40,
            "email": "you-doe@gmail.com",
            "phone": "(55) 9999-1111",
            "vehicle": "Cavalo"
          }

        const response = await fetch(`${BASE_URL}/users`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })
        const errorMessage = await response.json()
        
        strictEqual(response.status, STATUS_CODE.NOT_FOUND_ERROR)
        deepStrictEqual(response.statusText, 'Not Found')
        deepStrictEqual(errorMessage, { error: 'userId não encontrado!' })
    })

    it("shouldn't be possible delete an user without id",  async () => {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'DELETE'
        })
        const errorMessage = await response.json()

        strictEqual(response.status, STATUS_CODE.NOT_FOUND_ERROR)
        deepStrictEqual(response.statusText, 'Not Found')
        deepStrictEqual(errorMessage, { error: 'userId não encontrado!' })
    })

    it('should be possible create an user', async () => {
        const data = {
            "name": "You Doe Lee",
            "age": 40,
            "email": "you-doe@gmail.com",
            "phone": "(55) 9999-1111",
            "vehicle": "Cavalo"
          }

        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        strictEqual(response.status, STATUS_CODE.SUCCESS)
        deepStrictEqual(response.statusText, 'OK')
    })

    it('should be possible update an user', async () => {
        let response = await fetch(`${BASE_URL}/users?search=You Doe Lee`)
        let data =  await response.json()
        let user = data[0]

        strictEqual(response.status, STATUS_CODE.SUCCESS)
        deepStrictEqual(user.name, "You Doe Lee")

        response = await fetch(`${BASE_URL}/users?id=${user.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...data[0],
                name: "You D. Lee",
            })
        })

        strictEqual(response.status, STATUS_CODE.SUCCESS)
        deepStrictEqual(response.statusText, 'OK')

        response = await fetch(`${BASE_URL}/users?search=You D. Lee`)
        data =  await response.json()
        user = data[0]

        strictEqual(response.status, STATUS_CODE.SUCCESS)
        deepStrictEqual(user.name, "You D. Lee")
    })

    it('should be possible remove an user', async () => {
        let response = await fetch(`${BASE_URL}/users?search=You D. Lee`)
        let data =  await response.json()
        let user = data[0]

        strictEqual(response.status, STATUS_CODE.SUCCESS)
        deepStrictEqual(user.name, "You D. Lee")

        response = await fetch(`${BASE_URL}/users?id=${user.id}`, {
            method: 'DELETE'
        })
        strictEqual(response.status, STATUS_CODE.SUCCESS)

        response = await fetch(`${BASE_URL}/users?search=You D. Lee`)
        strictEqual((await response.json()).length, 0)

        strictEqual(response.status, STATUS_CODE.SUCCESS)
    })
})