
export default class View {
    #btnSearch = document.querySelector('#btnSearch')
    #btnClear = document.querySelector('#btnClear')
    #filter = document.querySelector('#filter')
    #container = document.querySelector('#container')
    #btnNewUser = document.querySelector('#btnNewUser')
    #firstRender = true

    #onRemove = function(){}
    #onCreate = async function(){}
    #onUpdate = async function(){}
    #onGetById = async function(){}

    constructor() {}

    configureOnClearClick(onClear) {
        this.#btnClear.addEventListener('click', () => {
            this.#filter.value = ''
            onClear()
        })
    }

    configureOnSearchClick(onSearch) {
        this.#btnSearch.addEventListener('click', () => {
            onSearch(this.#filter.value)
        })
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

    #renderModal(data) {
        return  `
            <div id="create-modal" class="d-flex flex-column gap-2">
                <p class="font-weight-bold">${data?.id ? `Editando usuário <b>${data?.name}</b>` : "Cadastro de usuário"}</p>
                <input type="hidden" id="user-id" name="new-name" ${data?.id && `value="${data?.id}"`}>
                <input type="text" class="form-control" aria-label="Default" id="new-name" name="new-name" placeholder="Type user name" ${data?.name && `value="${data?.name}"`}>
                <input type="number" class="form-control" aria-label="Default" id="new-age" name="new-age" placeholder="Type user age" ${data?.age && `value="${data?.age}"`}>
                <input type="mail" class="form-control" aria-label="Default" id="new-email" name="new-email" placeholder="Type user email" ${data?.email && `value="${data?.email}"`}>
                <input type="text" class="form-control" aria-label="Default" id="new-phone" name="new-phone" placeholder="Type user phone" ${data?.phone && `value="${data?.phone}"`}>
                <input type="text" class="form-control" aria-label="Default" id="new-vehicle" name="new-vehicle" placeholder="Type user vehicle" ${data?.vehicle && `value="${data?.vehicle}"`}>
                <div id="modal-action-buttons">
                    <button type="submit" id="btnSubmit" class="btn btn-primary mb-3" style="width: 50%;">Submit</button>
                    <button type="button" id="btnCancel" class="btn btn-secondary mb-3" style="width: 50%;">Cancel</button>
                </div>
            </div>    
        `;
    }

    #buildModal() {
        // TODO: make click on overlay close the modal
        // createModal.addEventListener("click", function() {
        //     const createModal = document.getElementById("create-modal-overlay")
        //     createModal.classList.add("d-none")
        // })

        this.#btnNewUser.addEventListener('click', () => {
            const createModal = document.getElementById("create-modal-overlay")
            createModal.innerHTML = this.#renderModal()

            document.querySelector("#btnCancel").addEventListener("click", function() {
                const createModal = document.getElementById("create-modal-overlay")
                createModal.classList.add("d-none")
            })
    
            const onCreate = this.#onCreate
            document.querySelector("#btnSubmit").addEventListener("click", async function(event) {
                event.preventDefault()
                event.stopPropagation()
        
                const name = document.getElementById("new-name").value
                const age = document.getElementById("new-age").value
                const email = document.getElementById("new-email").value
                const phone = document.getElementById("new-phone").value
                const vehicle = document.getElementById("new-vehicle").value
                
                const data = {
                    name,
                    age,
                    email,
                    phone,
                    vehicle
                }
                const response = await onCreate(data)
                if(response?.status === 200) {
                    createModal.classList.add("d-none")
                } else {
                  console.error("Ocorreu um erro ao tentar criar usuário!")
                }   
            })

            createModal.classList.remove("d-none")
        })
    }

    #buildTableHeader(data) {
        const [firstItem] = data
        const tHeaders = Object.keys(firstItem ?? {})
            .map(text => `<th scope=col>${text}</th>`)

            const template = `
        <table id="table" class="table">
            <thead>
                <tr>${tHeaders.join('')}<th scope=col></th></tr>
            </thead>
            <tbody id="tbody">
            </tbody>
        </table>
        `

        return template
    }

    #updateTableBody({ data = [], cleanFirst = false }) {
        const tBodyValues = data
            .map(item => Object.values(item))
            .map(item => item.map(value => `<td>${value}</td>`))
            .map(tds => {                
                return (`
                <tr>
                    ${tds.join('')}
                    <td>
                        <button type="button" id="btnRemove" class="btn btn-danger mb-3">Remover</button>
                        <button type="button" id="btnEdit" class="btn btn-primary mb-3">Editar</button>
                    </td>
                </tr>`);
            })


        const tbody = document.getElementById('tbody')
        if (cleanFirst) tbody.innerHTML = ''

        tbody.innerHTML += tBodyValues.join('')

        document.querySelectorAll("#btnRemove").forEach(element => {
            element.addEventListener('click', (event) => {
                const userId = event.target.parentElement.parentElement.firstElementChild.textContent
                this.#onRemove(userId)
            })
        })

        document.querySelectorAll("#btnEdit").forEach(element => {
            element.addEventListener('click', (event) => {
                const userId = event.target.parentElement.parentElement.firstElementChild.textContent
                this.#onGetById(userId).then(data => {
                    const createModal = document.getElementById("create-modal-overlay")
                    createModal.innerHTML = this.#renderModal(data)

                    document.querySelector("#btnCancel").addEventListener("click", function() {
                        const createModal = document.getElementById("create-modal-overlay")
                        createModal.classList.add("d-none")
                    })

                    const onUpdate = this.#onUpdate
                    document.querySelector("#btnSubmit").addEventListener("click", async function(event) {
                        event.preventDefault()
                        event.stopPropagation()
                
                        const name = document.getElementById("new-name").value
                        const age = document.getElementById("new-age").value
                        const email = document.getElementById("new-email").value
                        const phone = document.getElementById("new-phone").value
                        const vehicle = document.getElementById("new-vehicle").value
                        const id = document.getElementById("user-id").value
                        
                        const data = {
                            id,
                            name,
                            age,
                            email,
                            phone,
                            vehicle
                        }
                        
                        const response = await onUpdate(data)
                        if(response?.status === 200) {
                            createModal.classList.add("d-none")
                        } else {
                            console.error("Ocorreu um erro ao tentar atualizar usuário!")
                        }
                    })

                    createModal.classList.remove("d-none")
                })
            })
        })
    }


    render(data) {
        this.#buildModal()

        const isArray = Array.isArray(data)
        const items = isArray ? data : [data]

        if (this.#firstRender || isArray) {
            const tableHeader = items && this.#buildTableHeader(items)
            this.#container.innerHTML = tableHeader
            this.#firstRender = false
        }
        
        this.#updateTableBody({
            data: items,
            cleanFirst: isArray
        })

        return
    }
}