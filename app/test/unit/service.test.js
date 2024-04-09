import assert from 'node:assert'
import { describe, it } from 'node:test'
import Service from '../../shared/service.js'
import fetch from './model/fetchResponse.js'

describe('Test Data Builder', () => {
    const service = new Service({ url: '' })

    it('shouldn\'t return error with valid response', async () => {
        const response = fetch.aResponse().build()
        global.fetch = (url) => response
        const results = []
        for await (const result of service.getData()) results.push(result)

        const expected = [
            {
                id: 1,
                name: 'Mrs. Misty Rempel-Lehner2',
                age: 8,
                email: 'Monique.Leffler@yahoo.com',
                phone: '(551) 801-5964',
                vehicle: 'Land Cruiser'
            }
        ]

        assert.deepStrictEqual(results, expected)
    })

    it("should return valid response when remove a valid user", async () => {
        const response = fetch.aResponse().build()
        global.fetch = (url) => response
       
       const result =  await service.deleteUser(1)
       const expected = {
        status: 200,
        statusText: "OK"
       }

       assert.deepEqual(result.status, expected.status)
       assert.deepEqual(result.statusText, expected.statusText)
    })

    it("should return valid response when update a valid user", async () => {
        const response = fetch.aResponse().build()
        global.fetch = (url) => response
       
        const data = [
            {
                id: 1,
                name: 'Mrs. Misty Rempel-Lehner',
                age: 8,
                email: 'Monique.Leffler@yahoo.com',
                phone: '(551) 801-5964',
                vehicle: 'Land Cruiser'
            }
        ]

        const result =  await service.updateUser(data)
        const expected = {
            status: 200,
            statusText: "OK"
        }

        assert.deepEqual(result.status, expected.status)
        assert.deepEqual(result.statusText, expected.statusText)
    })

    it("should return valid response when create a valid user", async () => {
        const response = fetch.aResponse().build()
        global.fetch = (url) => response
       
        const data = [
            {
                name: 'Mrs. Misty Rempel-Lehner',
                age: 8,
                email: 'Monique.Leffler@yahoo.com',
                phone: '(551) 801-5964',
                vehicle: 'Land Cruiser'
            }
        ]

        const result =  await service.insertUser(data)
        const expected = {
            status: 200,
            statusText: "OK"
        }

        assert.deepEqual(result.status, expected.status)
        assert.deepEqual(result.statusText, expected.statusText)
    })

    it.skip("should be possible search a user name", async () => {
        const response = fetch.aResponse().withSearch().build()
        global.fetch = (url) => response

        service.getData()
        const expected = [{
            "id":4,
            "name":"Bruce Wayne",
            "age":8,
            "email":"Monique.Leffler@yahoo.com",
            "phone":"(551) 801-5964",
            "vehicle":"Land Cruiser"
        }]

        const result = service.searchLocallyByName("Bru")
        assert.deepEqual(result, expected)
    })

    describe('Response Errors', () => {
        it('should not contain items when an internal server error happens', async () => {
            const response = fetch.aResponse().withStatus500().build()
            global.fetch = (url) => response
            
            const results = []
            for await (const result of service.getData()) results.push(result)
            const expected = []

            assert.deepStrictEqual(results, expected)
        })

        it('should not contain items when an not found error happens', async () => {
            const response = fetch.aResponse().withStatus404().build()
            global.fetch = (url) => response
            const results = []
            for await (const result of service.getData()) results.push(result)
            const expected = []
            assert.deepStrictEqual(results, expected)
        })

        it('should not throw if the body response is invalid', async () => {
            const response = fetch.aResponse().withInvalidBody().build()
            global.fetch = (url) => response
            const results = []
            for await (const result of service.getData()) results.push(result)
            const expected = []
            assert.deepStrictEqual(results, expected)
        })

        it('should not throw if the request payload is invalid when create', async () => {
            const response = fetch.aResponse().build()
            global.fetch = (url) => response

            const result =  await service.insertUser(undefined)          
            assert.deepStrictEqual(result.data, undefined)
        })

        it('should not throw if the request payload is invalid when update', async () => {
            const response = fetch.aResponse().build()
            global.fetch = (url) => response

            const result =  await service.updateUser(undefined)          
            assert.deepStrictEqual(result?.data, undefined)
        })
    })
})