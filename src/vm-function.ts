import { Chunk } from "./chunk";
import { Scope } from "./scope";
import { VirtualMachine } from "./virtual-machine";

export class VMFunction {
  constructor(private _chunks: Chunk[]) {}

  instance(scope: Scope) {
    return new VirtualMachine(this._chunks, {
      scope,
    });
  }
}
