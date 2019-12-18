import createStore from "storeon";

declare namespace StoreonSessionStorage {
  export interface Config {
    key?: string;
  }
}

/**
 * Storeon module to persist state to session storage
 *
 * @param {String[]} paths The keys of state object
 *    that will be store in session storage
 * @param {Config} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in session storage
 */
declare function persistState<State>(
  paths?: string[],
  config?: StoreonSessionStorage.Config
): createStore.Module<State>;

export = persistState;
