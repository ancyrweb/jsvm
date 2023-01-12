import { Instruction } from "./instruction";
import { Scope } from "./scope";
import { VirtualMachine } from "./virtual-machine";

export class VMFunction {
  constructor(private _chunks: Instruction[]) {}

  instance(data: { scope: Scope; arguments: Scope }) {
    return new VirtualMachine(this._chunks, {
      scope: data.scope,
      arguments: data.arguments,
    });
  }
}
