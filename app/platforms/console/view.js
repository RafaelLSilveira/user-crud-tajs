import LayoutBuilder from "./layoutBuilder.js"

export default class View {
    #components
    #headers = []
    #firstRender = true
    #tableData = []

    #onSearch = () => { }
    #onRemove = function(){}
    #onCreate = function(){}
    #onUpdate = async function(){}
    #onGetById = async function(){}

    constructor() { }

    configureOnClearClick(onClear) {
    }

    configureOnSearchClick(onSearch) {
        this.#onSearch = (input) => {
            return () => {
                const message = input.getValue().trim()
                onSearch(message)
                input.clearValue()
                input.focus()
            }
        }
    }

    configureOnRemoveClick(onRemove) {
        this.#onRemove = onRemove
    }

    configureOnCreateClick(onCreate) {
        this.#onCreate = onCreate
    }

    configureOnUpdateClick(onUpdate) {
        this.#onUpdate = onUpdate
    }

    configureOnGetByIdClick(onGetById) {
        this.#onGetById = onGetById
    }

    #prepareData(data) {
        if (!data.length) {
            return {
                headers: this.#headers,
                data: []
            }
        }
        if (!this.#headers.length) {
            this.#headers = Object.keys(data[0]).slice(0, 3)
        }

        return {
            headers: this.#headers,
            data: data.map(item => Object.values(item).slice(0, 3))
        }
    }

    #updateTable({ data = [], cleanFirst = false }) {
        const template = this.#prepareData(data)
        if (cleanFirst) this.#tableData = []

        this.#tableData.push(...template.data)

        this.#components.table.setData({
            headers: template.headers,
            data: this.#tableData
        })
        this.#components.screen.render()
    }

    render(data) {
        const isArray = Array.isArray(data)
        const items = isArray ? data : [data]

        if (!this.#firstRender) {
            this.#updateTable({
                data: items,
                cleanFirst: isArray
            });
            return;
        }

        const template = this.#prepareData(items)
        this.#tableData.push(...template.data)

        const layout = new LayoutBuilder()

        this.#components = layout
            .setScreen({ title: 'Design Patterns with Erick Wendel and Rafael Silveira' })
            .setLayoutComponent()
            // .setSearchComponent(this.#onSearch)
            .setTable(template)
            .setMenu(this.#onSearch, this.#onCreate, this.#onRemove, this.#onUpdate)
            .build()

        this.#firstRender = false
    }
}
