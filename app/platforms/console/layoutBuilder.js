import blessed from 'blessed'
import contrib from 'blessed-contrib'

export default class LayoutBuilder {
    #screen
    #layout
    #input
    #table
    #menu

    #baseComponent() {
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollboard: {
                ch: ' ',
                inverse: true
            },
            tags: true
        }
    }

    setLayoutComponent() {
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%',
        })

        return this
    }

    setSearchComponent(onSearch) {
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 2,
            height: '15%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535'
            }
        })

        input.key('enter', onSearch(input))
        this.#input = input

        this.#input.focus()

        return this
    }

    setScreen({ title }) {
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        })

        this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

        this.#screen.key('1', function() { 
            console.log("1")
        })

        return this
    }

    setTable(template) {
        const columnWidth = template.data[0].map(header => String(header).length + 10)
        this.#table = contrib.table(
            {
                ...this.#baseComponent(),
                parent: this.#layout,
                keys: true,
                fg: 'white',
                selectedFg: 'white',
                selectedBg: 'blue',
                interactive: true,
                label: 'Users',
                width: '100%',
                height: '75%',
                padding: {
                    bottom: -1,
                },
                bottom: 1,
                border: { type: "line", fg: "cyan" },
                columnSpacing: 10,
                columnWidth
            })

        this.#table.setData(template)

        return this
    }

    setMenu(onSearch, onCreate, onRemove, onUpdate) {
        const menu = blessed.listbar(
            {
                parent: this.#table,
                items: ["search", "add", "remove", "update"],
                clickable: true,
                mouse: true,
                keys: true,
                shrink: true,
                bottom: 0,
                left: 0,
            }
        )

        menu.key('enter', function() { 
            this.setSearchComponent(onSearch)
        })

        this.#menu = menu

        return this
    }

    build() {
        const components = {
            screen: this.#screen,
            input: this.#input,
            table: this.#table,
            menu: this.#menu,
        }

        // this.#input.focus()
        this.#table.focus()
        this.#screen.render()

        return components
    }

}