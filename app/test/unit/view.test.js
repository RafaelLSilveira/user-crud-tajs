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
    createMock = mock.fn()
    updateMock = mock.fn()
    getByIdMock = mock.fn()

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

  it("should be possible render view web without problem", async () => {    
    //console.log( prettyDOM(document.body))
    // console.log("\n")
    // console.log(prettyDOM(getByText(document.body, "Mrs. Misty Rempel-Lehner")))

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

  it("should be possible search an user", async () => {
    assert.strictEqual(searchMock.mock.calls.length, 0)

    const filterInput = document.getElementById("filter")
    await fireEvent.change(filterInput, { target: { value: "John" } })

    const btnSearch = document.getElementById("btnSearch")
    await fireEvent.click(btnSearch)
   
    assert.strictEqual(searchMock.mock.calls[0].arguments[0], "John")
    assert.strictEqual(searchMock.mock.calls.length, 1)
  })

  it("should be possible clear filter input when search an user", async () => {
    assert.strictEqual(searchMock.mock.calls.length, 0)

    const filterInput = document.getElementById("filter")
    await fireEvent.change(filterInput, { target: { value: "John" } })

    const btnSearch = document.getElementById("btnSearch")
    await fireEvent.click(btnSearch)
   
    assert.strictEqual(searchMock.mock.calls[0].arguments[0], "John")
    assert.strictEqual(searchMock.mock.calls.length, 1)

    const btnClear = document.getElementById("btnClear")
    await fireEvent.click(btnClear)

    assert.strictEqual(clearMock.mock.calls[0].arguments[0], undefined)
    assert.strictEqual(clearMock.mock.calls.length, 1)
  })
})
