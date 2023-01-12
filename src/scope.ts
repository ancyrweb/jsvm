import { VMFunction } from "./vm-function";
import { VMVariable } from "./vm-variable";

export type Scopable = VMVariable | VMFunction;

export class Scope {
  private _map: Map<string, Scopable>;

  constructor(readonly data?: Record<string, Scopable>) {
    this._map = new Map(Object.entries(data ?? {}));
  }

  set(key: string, value: VMVariable | VMFunction) {
    this._map.set(key, value);
  }

  get(key: string) {
    return this._map.get(key);
  }

  has(key: string) {
    return this._map.has(key);
  }

  clear() {
    this._map.clear();
  }

  dump() {
    let out: Record<string, any> = {};

    let it = this._map.entries();
    let result = it.next();
    while (!result.done) {
      out[result.value[0]] = result.value[1].toString();
      result = it.next();
    }

    return out;
  }

  copy() {
    const newScope = new Scope();
    newScope._map = new Map(this._map);
    return newScope;
  }
}
