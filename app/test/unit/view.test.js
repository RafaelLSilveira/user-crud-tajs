import { fireEvent, getByText } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import assert from "node:assert";
import { afterEach, before, beforeEach, describe, it, mock } from "node:test";
import View from "../../platforms/web/view.js";

const environment = new JSDOM(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Abstraction Factory | Erick Wendel e Rafael Silveira</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous" />
    <link rel="stylesheet" href="./styles.css">    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"
        crossorigin="anonymous"></script>
</head>
  </html>`
);

globalThis.document = environment.window.document

describe("<View />", () => {
  let searchMock
  let clearMock
  let removeMock
  let createMock
  let updateMock
  let getByIdMock

  const generateReadableData = () => {
    return [{"id":1,"name":"Mrs. Misty Rempel-Lehner","age":8,"email":"Monique.Leffler@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"}]
  }

  let view
  before(() => {
    document.body.innerHTML = 
      `<body class="container-fluid">
        <br>
        <div class="row g-3" >
            <div class="col-auto">
                <label for="filter" class="visually-hidden">Filter</label>
                <input type="text" class="form-control" id="filter" placeholder="search a name">
            </div>
            <div class="col-auto">
                <button type="button" id="btnSearch" class="btn btn-primary mb-3">Search</button>
                <button type="button" id="btnClear" class="btn btn-danger mb-3">Clear</button>
                <button type="button" id="btnNewUser" class="btn btn-secondary mb-3">New User</button>
            </div>
        </div>
        <div id="container"></div>
        <div id="create-modal-overlay" class="d-none"></div>
        <script type="module" src="./index.js"></script>
      </body>`
  })

  beforeEach(() => {
    searchMock = mock.fn()
    clearMock = mock.fn()
    removeMock = mock.fn()
    createMock = mock.fn(() => ({ status: 200 }))
    updateMock = mock.fn()
    getByIdMock = mock.fn(() => ({
      then: (func) => func({ 
          "id":1,"name":"Mrs. Misty Rempel-Lehner","age":8,"email":"Monique.Leffler@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"
      })
    }))

    view = new View()
    view.configureOnSearchClick(searchMock)
    view.configureOnClearClick(clearMock)
    view.configureOnRemoveClick(removeMock)
    view.configureOnCreateClick(createMock)
    view.configureOnUpdateClick(updateMock)
    view.configureOnGetByIdClick(getByIdMock)
    view.render(generateReadableData())
  })

  afterEach(() => {
    mock.reset()
    mock.restoreAll()
  })

  it("should be possible render view web without problem", () => {    
    //console.log( prettyDOM(document.body))
    
    const filterInput = document.getElementById("filter")
    const btnSearch = document.getElementById("btnSearch")
    const btnClear = document.getElementById("btnClear")
    const btnNewUser = document.getElementById("btnNewUser")
    const btnRemove = document.getElementById("btnRemove")
    const btnEdit = document.getElementById("btnEdit")
    const overlayModal = document.getElementById("create-modal-overlay")

    assert.strictEqual(!!filterInput, true)
    assert.strictEqual(!!btnSearch, true)
    assert.strictEqual(!!btnClear, true)
    assert.strictEqual(!!btnNewUser, true)
    assert.strictEqual(!!btnRemove, true)
    assert.strictEqual(!!btnEdit, true)
    assert.strictEqual(!!overlayModal, true)

    assert.strictEqual(!!getByText(document.body, "Mrs. Misty Rempel-Lehner"), true)
    assert.strictEqual(!!getByText(document.body, "(551) 801-5964"), true)
    assert.strictEqual(!!getByText(document.body, "Monique.Leffler@yahoo.com"), true)
    assert.strictEqual(!!getByText(document.body, "Land Cruiser"), true)
  })

  it("should be possible search an user", () => {
    assert.strictEqual(searchMock.mock.calls.length, 0)

    const filterInput = document.getElementById("filter")
    fireEvent.change(filterInput, { target: { value: "John" } })

    const btnSearch = document.getElementById("btnSearch")
    fireEvent.click(btnSearch)
   
    assert.strictEqual(searchMock.mock.calls[0].arguments[0], "John")
    assert.strictEqual(searchMock.mock.calls.length, 1)
  })

  it("should be possible clear filter input when search an user", () => {
    assert.strictEqual(searchMock.mock.calls.length, 0)

    const filterInput = document.getElementById("filter")
    fireEvent.change(filterInput, { target: { value: "John" } })

    const btnSearch = document.getElementById("btnSearch")
    fireEvent.click(btnSearch)
   
    assert.strictEqual(searchMock.mock.calls[0].arguments[0], "John")
    assert.strictEqual(searchMock.mock.calls.length, 1)

    const btnClear = document.getElementById("btnClear")
    fireEvent.click(btnClear)

    assert.strictEqual(clearMock.mock.calls[0].arguments[0], undefined)
    assert.strictEqual(clearMock.mock.calls.length, 1)
  })

  it("should be possible remove an user", () => {
    assert.strictEqual(searchMock.mock.calls.length, 0)

    const btnRemove = document.getElementById("btnRemove")
    fireEvent.click(btnRemove)
   
    assert.strictEqual(removeMock.mock.calls[0].arguments[0], "1")
    assert.strictEqual(removeMock.mock.calls.length, 1)
  })

  it("should be possible create an user", async () => {
    const btnNewUser = document.getElementById("btnNewUser")
    fireEvent.click(btnNewUser)
    
    const modalCreateUpdate = document.getElementById("create-modal-overlay")
    const btnCancel = document.getElementById("btnCancel")

    assert.strictEqual(modalCreateUpdate.className, "")
    
    fireEvent.click(btnCancel)
    assert.strictEqual(modalCreateUpdate.className, "d-none")

    fireEvent.click(btnNewUser)

    const newNameInput = document.getElementById("new-name")
    const newAgeInput = document.getElementById("new-age")
    const newEmailInput = document.getElementById("new-email")
    const newPhoneInput = document.getElementById("new-phone")
    const newVehicleInput = document.getElementById("new-vehicle")

    fireEvent.change(newNameInput, { target: { value: "Mark Silvester" }})
    assert.strictEqual(newNameInput.value, "Mark Silvester")

    fireEvent.change(newAgeInput, { target: { value: 20 }})
    assert.strictEqual(newAgeInput.value, "20")
    
    fireEvent.change(newEmailInput, { target: { value: "mark@bol.com" }})
    assert.strictEqual(newEmailInput.value, "mark@bol.com")

    fireEvent.change(newPhoneInput, { target: { value: "(55) 99999-9999" }})
    assert.strictEqual(newPhoneInput.value, "(55) 99999-9999")

    fireEvent.change(newVehicleInput, { target: { value: "Opala" }})
    assert.strictEqual(newVehicleInput.value, "Opala")

    const btnSubmit = document.getElementById("btnSubmit")
    fireEvent.click(btnSubmit)
    
    assert.strictEqual(createMock.mock.calls.length, 1)
    assert.deepStrictEqual(createMock.mock.calls[0].arguments[0], { 
      name: 'Mark Silvester', 
      age: '20', 
      email: 'mark@bol.com',
      phone: '(55) 99999-9999',
      vehicle: 'Opala'
    })
  })

  it("should be possible update an user", async () => {

    const modalCreateUpdate = document.getElementById("create-modal-overlay")
    const btnCancel = document.getElementById("btnCancel")
    const btnEdit = document.getElementById("btnEdit")

    fireEvent.click(btnEdit)

    assert.strictEqual(getByIdMock.mock.calls.length, 1)
    assert.strictEqual(getByIdMock.mock.calls[0].arguments[0], "1")
    assert.strictEqual(modalCreateUpdate.className, "")
    
    fireEvent.click(btnCancel)

    assert.strictEqual(modalCreateUpdate.className, "d-none")

    fireEvent.click(btnEdit)

    assert.strictEqual(getByIdMock.mock.calls.length, 2)
    assert.strictEqual(getByIdMock.mock.calls[1].arguments[0], "1")

    const newNameInput = document.getElementById("new-name")
    const newAgeInput = document.getElementById("new-age")
    const newEmailInput = document.getElementById("new-email")
    const newPhoneInput = document.getElementById("new-phone")
    const newVehicleInput = document.getElementById("new-vehicle")
    const userId = document.getElementById("user-id")

    assert.strictEqual(modalCreateUpdate.className, "")
    assert.strictEqual(userId.value, "1")
    assert.strictEqual(newNameInput.value, "Mrs. Misty Rempel-Lehner")
    assert.strictEqual(newAgeInput.value, "8")
    assert.strictEqual(newEmailInput.value, "Monique.Leffler@yahoo.com")
    assert.strictEqual(newPhoneInput.value, "(551) 801-5964")
    assert.strictEqual(newVehicleInput.value, "Land Cruiser")

    fireEvent.change(newNameInput, { target: { value: "M. Rempel-Lehner" }})
    assert.strictEqual(newNameInput.value, "M. Rempel-Lehner")

    const btnSubmit = document.getElementById("btnSubmit")
    fireEvent.click(btnSubmit)

    assert.strictEqual(updateMock.mock.calls.length, 1)
    assert.deepEqual(updateMock.mock.calls[0].arguments[0],  {
      age: '8',
      email: 'Monique.Leffler@yahoo.com',
      id: '1',
      name: 'M. Rempel-Lehner',
      phone: '(551) 801-5964',
      vehicle: 'Land Cruiser'
    })
  })
})
