import assert from 'node:assert'
import { Readable } from 'node:stream'
import { before, describe, it, mock } from 'node:test'
import Controller from '../../shared/controller.js'

const generateReadableData = (data) => {
  return Readable.toWeb(Readable.from(data)).pipeThrough(new TextEncoderStream())
}

const viewRenderMock = mock.fn((data) => data)

class TestView {
  onSearch = async function(){}
  onClear = function(){}
  onRemove = function(){}
  onCreate = async function(){}
  onUpdate = async function(){}
  onGetById = async function(){}

  configureOnSearchClick(onSomething) {
    this.onSearch = onSomething
  }
  configureOnClearClick(onSomething) {
    this.onClear = onSomething
  }
  configureOnRemoveClick(onSomething){
    this.onRemove = onSomething
  }
  configureOnCreateClick(onSomething){
    this.onCreate = onSomething
  }
  configureOnUpdateClick(onSomething){
    this.onUpdate = onSomething 
  }
  configureOnGetByIdClick(onSomething){
    this.onGetById = onSomething  
  }

  render(data) {
    return viewRenderMock(data)
  }
}

describe('<Controller />', () => {
  let view
  let service
  const getDataMock = mock.fn(() => {
    return generateReadableData(
      `{"id":1,"name":"Mrs. Misty Rempel-Lehner","age":8,"email":"Monique.Leffler@yahoo.com","phone":"(551) 801-5964","vehicle":"Land Cruiser"}\n`
    )
  });
  const searchDataMock = mock.fn((name) => ({ status: 200, data: name }))
  const deleteDataMock = mock.fn((userId) => ({ status: 200, data: userId }))
  const insertDataMock = mock.fn((data) => ({ status: 200, data: data }))
  const updateDataMock = mock.fn((data) => ({ status: 200, data: data }))

  before(() => {
    service = {
      searchLocallyByName: searchDataMock,
      deleteUser: deleteDataMock,
      insertUser: insertDataMock,
      updateUser: updateDataMock,
      getData: getDataMock,
    }
    view = new TestView()
  })

  it("should be possible render view and initialize methods correctly", async () => {
    assert.strictEqual(getDataMock.mock.calls.length, 0)
    assert.strictEqual(viewRenderMock.mock.calls.length, 0)
  
    await Controller.init({ view, service })

    assert.strictEqual(getDataMock.mock.calls.length, 1)
    assert.strictEqual(viewRenderMock.mock.calls.length, 1)
  })

  it("should be possible trigger the methods from view structure", async () => {
    await Controller.init({ view, service })
    assert.strictEqual(getDataMock.mock.calls.length, 2)

    await view.onSearch("John")
    assert.strictEqual(searchDataMock.mock.calls.length, 1)
    assert.strictEqual(searchDataMock.mock.calls[0].arguments[0], "John")
    assert.deepStrictEqual(searchDataMock.mock.calls[0].result, {
        status: 200,
        data: 'John'
      }
    )

    await view.onClear()
    assert.strictEqual(searchDataMock.mock.calls.length, 2)
    assert.strictEqual(searchDataMock.mock.calls[1].arguments[0], undefined)
    assert.strictEqual(searchDataMock.mock.calls[1].result.status, 200)

    await view.onRemove(1)
    assert.strictEqual(deleteDataMock.mock.calls.length, 1)
    assert.strictEqual(deleteDataMock.mock.calls[0].arguments[0], 1)
    assert.strictEqual(deleteDataMock.mock.calls[0].result.status, 200)
    assert.strictEqual(getDataMock.mock.calls.length, 3)

    const newUser = {
      name:"Mrs. Misty Rempel-Lehner",
      age:8,
      email:"Monique.Leffler@yahoo.com",
      phone:"(551) 801-5964",
      vehicle:"Land Cruiser"
    }

    await view.onCreate(newUser)
    assert.strictEqual(insertDataMock.mock.calls.length, 1)
    assert.deepStrictEqual(insertDataMock.mock.calls[0].arguments[0], newUser)
    assert.deepStrictEqual(insertDataMock.mock.calls[0].result, { status: 200, data: newUser })
    assert.strictEqual(getDataMock.mock.calls.length, 4)
     
    const updateUser = {
      ...newUser,
      id: 1,
      name: 'Misty'
    }
    
    await view.onUpdate(updateUser)
    assert.strictEqual(updateDataMock.mock.calls.length, 1)
    assert.deepStrictEqual(updateDataMock.mock.calls[0].arguments[0], updateUser)
    assert.deepStrictEqual(updateDataMock.mock.calls[0].result, { status: 200, data: updateUser })
    assert.strictEqual(getDataMock.mock.calls.length, 5)
    
    await view.onGetById(1)
    assert.strictEqual(getDataMock.mock.calls.length, 6)
  })
})