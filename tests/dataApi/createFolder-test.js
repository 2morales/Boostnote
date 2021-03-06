const test = require('ava')
const createFolder = require('browser/main/lib/dataApi/createFolder')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = (window.localStorage = global.localStorage = new Storage(
  null,
  { strict: true }
))
const path = require('path')
const _ = require('lodash')
const TestDummy = require('../fixtures/TestDummy')
const sander = require('sander')
const os = require('os')
const CSON = require('@rokt33r/season')

const storagePath = path.join(os.tmpdir(), 'test/create-folder')

test.beforeEach(t => {
  t.context.storage = TestDummy.dummyStorage(storagePath)
  localStorage.setItem('storages', JSON.stringify([t.context.storage.cache]))
})

test.serial('Create a folder', t => {
  const storageKey = t.context.storage.cache.key
  const input = {
    name: 'created',
    color: '#ff5555'
  }
  return Promise.resolve()
    .then(function doTest() {
      return createFolder(storageKey, input)
    })
    .then(function assert(data) {
      t.true(_.find(data.storage.folders, input) != null)
      const jsonData = CSON.readFileSync(
        path.join(data.storage.path, 'boostnote.json')
      )
      console.log(path.join(data.storage.path, 'boostnote.json'))
      t.true(_.find(jsonData.folders, input) != null)
    })
})

test.after(function after() {
  localStorage.clear()
  sander.rimrafSync(storagePath)
})
