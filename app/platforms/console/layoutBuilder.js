import blessed from 'blessed';
import contrib from 'blessed-contrib';
// import "../../../scripts/consoleToFile.js";

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

        return this
    }

    setScreen({ title }) {
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        })

        this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

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

    setMenu(onRemove) {
        const menu = blessed.listbar(
            {
                parent: this.#table,
                clickable: true,
                mouse: true,
                keys: true,
                shrink: true,
                bottom: 0,
                left: 0,
                commands: {
                    "search": {
                        "keys": "s"
                    },
                    "delete": {
                        "keys": "d"
                    },
                    "quit": {
                        "keys": ["escape"]
                    }
                }
            }
        )

        const input = this.#input
        this.#screen.key('s', function() { 
            input.focus()
        })

        const table = this.#table
        this.#screen.key('d', function() {
            const item = table.rows.ritems[table.rows.selected];
            const userData = item.replaceAll(/( {6,})/g, "_").split("_")
            onRemove(userData[0])
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

        this.#table.focus()
        this.#screen.render()

        return components
    }

}