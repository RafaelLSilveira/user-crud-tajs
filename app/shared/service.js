export default class Service {
    #url
    #database = []
    constructor({ url }) {
        this.#url = url
    }

    #readChunks(reader) {
        return {
            async *[Symbol.asyncIterator]() {
                let readResult = await reader.read();
                while (!readResult.done) {
                    yield readResult.value;
                    readResult = await reader.read();
                }
            },
        };
    }

    async * getData(userId = undefined) {
        try {
            const response = await fetch(`${this.#url}/users?id=${userId}`, { cache: "no-cache" })
            const reader = response.body
            .pipeThrough(
                new TextDecoderStream()
            )
            .getReader()
            for await (const chunk of this.#readChunks(reader)) {
                const item = JSON.parse(chunk)
                this.#database = item;
                yield item
            }

        } catch (error) {
            console.error('error', error)
            return []
        }
    }

    async insertUser(data) {
        try {
            const response = await fetch(`${this.#url}/users`, {
                body: JSON.stringify(data),
                method: "POST"
            })
            return response;
        } catch (error) {
            console.error('error', error)
            return
        }
    }

    async updateUser(data) {
        try {
            const response = await fetch(`${this.#url}/users?id=${data.id}`, {
                body:  JSON.stringify(data),
                method: "PUT"
            })

            return response;
        } catch (error) {
            console.error('error', error)
            return
        }
    }

    async deleteUser(userId) {
        try {
            const response = await fetch(`${this.#url}/users?id=${userId}`, {
                method: "DELETE"
            })

            return response;
        } catch (error) {
            console.error('error', error)
            return
        }
    }

    searchLocallyByName(search = '') {
        return this.#database.filter(({ name }) => {
            return name.toLowerCase().includes(search.toLowerCase())
        })
    }
}