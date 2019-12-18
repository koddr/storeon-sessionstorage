/**
 * Storeon module to persist state to session storage
 *
 * @param {String[]} paths The keys of state object
 *    that will be store in session storage
 * @param {Object} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in session storage
 */
var persistState = function (paths, config) {
  config = config || {}
  paths = paths || []

  var key = config.key || 'storeon'

  return function (store) {
    var initialized = false

    store.on('@init', function () {
      initialized = true

      try {
        var savedState = sessionStorage.getItem(key)
        if (savedState !== null) {
          return JSON.parse(savedState)
        }
      } catch (err) {}
    })
    store.on('@dispatch', function (state) {
      if (!initialized) {
        return
      }

      var stateToStore = {}
      if (paths.length === 0) {
        stateToStore = state
      } else {
        paths.forEach(function (p) {
          stateToStore[p] = state[p]
        })
      }

      try {
        var saveState = JSON.stringify(stateToStore)
        sessionStorage.setItem(key, saveState)
      } catch (err) {}
    })
  }
}

module.exports = persistState
