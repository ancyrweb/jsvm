export class VMVariable<T = any> {
  constructor(private _value: T) {}

  toString() {
    return this._value;
  }
}
