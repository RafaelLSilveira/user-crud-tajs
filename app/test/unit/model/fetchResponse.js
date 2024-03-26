import { Readable } from 'node:stream';
const generateReadableData = (data) => {
    return Readable.toWeb(Readable.from(data)).pipeThrough(new TextEncoderStream())
}

export default class FetchResponseDataBuilder {
    // by default all data is valid
    #responseData = {
        status: '200',
        statusText: 'OK',
        body: generateReadableData(
            `{"id":1,"name":"Mrs. Misty Rempel-Lehner","age":8,"email":"Monique.Leffler@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"}\n`
        )
    }

    static aResponse() {
        return new FetchResponseDataBuilder()
    }

    withStatus500() {
        this.#responseData = {
            ...this.#responseData,
            status: 500,
            statusText: 'Internal Server Error',
            body: generateReadableData(``)
        }

        return this
    }

    withStatus404() {
        this.#responseData = {
            ...this.#responseData,
            status: 404,
            statusText: 'Not Found',
            body: generateReadableData(``)
        }

        return this
    }

    withInvalidBody() {
        this.#responseData = {
            ...this.#responseData,
            body: generateReadableData('{"id":1,"name":')

        }

        return this
    }

    withSearch() {
        const data = [
            {"id":1,"name":"Mrs. Misty Rempel-Lehner","age":8,"email":"Monique.Leffler@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"},
            {"id":2,"name":"John Doe","age":18,"email":"john-doe@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"},
            {"id":3,"name":"Mary Jane","age":8,"email":"Monique.Leffler@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"},
            {"id":4,"name":"Bruce Wayne","age":8,"email":"Monique.Leffler@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"}
        ]

        this.#responseData = {
            ...this.#responseData,
            body: generateReadableData([JSON.stringify(data)])
        }

        return this
    }

    build() {
        return Promise.resolve(this.#responseData)
    }

}

