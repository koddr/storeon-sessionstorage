# Storeon sessionStorage

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

Tiny module for [Storeon] to store and sync state to `sessionStorage`. It restores state from `sessionStorage` during page loading and saves state on every change.

The methods are the same of `localStorage`, **but there are significant limitations:**

- `sessionStorage` exists only within current browser tab.
  - Another tab with the same page will have a different storage.
  - But it's divided between `iframe` on the same tab (provided that they are from the same source).
- Data continues to exist after reloading the page, but not after closing/opening browser tab.

It is just 172 bytes module (it uses [Size Limit] to control the size) without any dependencies.

_Please note: this module is a fork of [localStorage] by [Ivan Menshykov]. Because of this, init version of module is `v0.6.3` (latest version of `@storeon/localstorage` when fork)._

[size limit]: https://github.com/ai/size-limit
[storeon]: https://github.com/storeon/storeon
[localstorage]: https://github.com/storeon/localstorage
[ivan menshykov]: https://github.com/polemius

## Installation

```console
npm install --save @storeon/sessionstorage
```

## Usage

If you want to store and sync state to `sessionStorage` you should import the `persistState` from `@storeon/sessionstorage` and add this module to `createStore`.

```js
import createStore from "storeon"
import persistState from "@storeon/sessionstorage"

let name = store => {
  store.on("@init", () => ({ name: "" }))
  store.on("save", (state, name) => ({ name: name }))
};

const store = createStore([name, persistState(["name"])])
```

Here you can see that the form ask user the name and after that show this name.

```js
import useStoreon from "storeon/react" // or storeon/preact for Preact
import StoreContext from "storeon/react/context" // or storeon/preact/context for Preact

const Form = () => {
  const { dispatch, name } = useStoreon("name")

  return (
    <React.Fragment>
      {name !== "" && <h3>Hello {name}!</h3>}
      {name === "" && (
        <div>
          <label>Name</label>
          <input type="text" id="name" />
          <br />
          <button
            onClick={() =>
              dispatch("save", document.getElementById("name").value)
            }
          >
            Save
          </button>
        </div>
      )}
    </React.Fragment>
  )
}
```

Event after refresh the page the state is updating from `sessionStorage`. And user see the greeting message.

![Example of store state to local storage](example.gif)

### persistState(paths, config)

```js
type paths = Void | Array<String>
```

If no pass the `paths` value then `persistState` store in local storage all state.

```js
type config.key = String
```

Default value of `config.key` is `storeon`. This key is using to store data in local storage.

## Acknowledgments

This module based on [@storeon/localstorage](https://github.com/storeon/localstorage).

## LICENSE

MIT
