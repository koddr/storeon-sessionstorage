let createStore = require('storeon')

let persistState = require('../')

afterEach(() => {
  sessionStorage.clear()
  jest.restoreAllMocks()
})

it('should update the sessionStorage', () => {
  let store = createStore([persistState()])
  store.on('test', () => {
    return { b: 1 }
  })
  store.dispatch('test')

  expect(sessionStorage.getItem('storeon')).toEqual(JSON.stringify({ b: 1 }))
})

it('should update the state after init', () => {
  let data = JSON.stringify({ a: 1, b: 2 })
  sessionStorage.setItem('storeon', data)

  createStore([persistState()])

  expect(sessionStorage.getItem('storeon')).toEqual(data)
})

it('should update the sessionStorage only white listed names', () => {
  let store = createStore([persistState(['a'])])

  store.on('test', () => {
    return { a: 1, b: 1 }
  })
  store.dispatch('test')

  expect(sessionStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should works with missed config key', () => {
  let store = createStore([persistState(['a'], {})])

  store.on('test', () => {
    return { a: 1 }
  })
  store.dispatch('test')

  expect(sessionStorage.getItem('storeon')).toEqual(JSON.stringify({ a: 1 }))
})

it('should hande non jsonable object in sessionStorage', () => {
  sessionStorage.setItem('storeon', 'test string')

  let store = createStore([persistState()])

  expect(store.get()).toEqual({})
})

it('should handle non jsonable object in state', () => {
  jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
    throw Error('mock error')
  })
  let store = createStore([persistState(['a'])])

  store.on('test', () => {
    return 'nonce'
  })

  expect(store.get()).toEqual({})
})

it('should not process @dispatch before @init', () => {
  sessionStorage.setItem('storeon', JSON.stringify({ a: 'foo' }))

  let store = createStore([
    // This module tries to trigger a save in the local storage module
    function (s) {
      s.on('@init', () => {
        s.dispatch('foo')
      })
    },

    persistState(['a'])
  ])

  // If a save was triggered by the first module, the state would now be blank
  expect(store.get()).toEqual({ a: 'foo' })
})
