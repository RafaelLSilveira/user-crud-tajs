export default class Controller {
    #view
    #service
    constructor({ view, service }) {
        this.#view = view
        this.#service = service
    }
    static async init(deps) {
        const instance = new Controller(deps)
        await instance.#init()
        return instance
    }

    #onClear() {
        this.#view.render(this.#service.searchLocallyByName())
    }

    #onSearch(search) {
        this.#view.render(this.#service.searchLocallyByName(search))
    }

    async #onRemove(userId) {
        const response = await this.#service.deleteUser(userId)
        if(response?.status === 200) {
            this.#init()
        }
    }

    async #onCreate(data) {
        const response = await this.#service.insertUser(data)
        if(response?.status === 200) {
            this.#init()
        }
    }

    async #onUpdate(data) {
        const response = await this.#service.updateUser(data)
        if(response?.status === 200) {
            this.#init()
        }

        return response;
    }

    async #onGetById(userId) {
        let response = []
        for await (const item of this.#service.getData(userId)) {
            response = item
        }
        return response[0];
    }

    async #init() {
        this.#view.configureOnSearchClick(this.#onSearch.bind(this))
        this.#view.configureOnClearClick(this.#onClear.bind(this))
        this.#view.configureOnRemoveClick(this.#onRemove.bind(this))
        this.#view.configureOnCreateClick(this.#onCreate.bind(this))
        this.#view.configureOnUpdateClick(this.#onUpdate.bind(this))
        this.#view.configureOnGetByIdClick(this.#onGetById.bind(this))
        
        for await (const item of this.#service.getData()) {
            this.#view.render(item)
        }
    }
}