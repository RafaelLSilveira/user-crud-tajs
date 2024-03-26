import { describe, it } from '@jest/globals'
import MockStdin from 'mock-stdin'
import View from '../../platforms/console/view.js'
import Controller from "../../shared/controller.js"
import Service from "../../shared/service.js"

describe("#App CLI", () => {
  let view
  let service
  let stdin
  let controller
  // let api 

  // beforeAll(async () => {
  //   api = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["run", "api"])
  //   await new Promise((resolve) => setTimeout(resolve, 1000))
  // })

  beforeEach(async () => {
    view = new View()
    service = new Service({ url: 'http://localhost:3000' })
    stdin = new MockStdin.stdin()
    controller = await Controller.init({ view, service })
  });

  afterEach(() => {
    stdin.restore()
  });

  it("should be loading app in mode cli without problems", async () => {    
    await new Promise((resolve) => setTimeout(resolve, 1000))
    expect(view.getTableSnapshot()).toMatchSnapshot();
  })

  it("should be possible search an user", async () => {    
    await new Promise((resolve) => setTimeout(resolve, 1000))

    stdin.send('s')

    await new Promise((resolve) => setTimeout(resolve, 1000))
   
    stdin.send('B');
    stdin.send('r');
    stdin.send('u');
    stdin.send('c');
    stdin.send('e');

    await new Promise((resolve) => setTimeout(resolve, 1000))

    stdin.send('\r')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(view.getTableSnapshot()).toMatchSnapshot();
  })
})