import { VMVariable } from "./vm-variable";
import { Chunk } from "./chunk";
import { Scope } from "./scope";

type VMState =
  | {
      type: "RUNNING";
    }
  | {
      type: "EOF";
      result: any;
    };

export class VirtualMachine {
  private _current = 0;
  private _state: VMState = {
    type: "RUNNING",
  };

  private _initialScope: Scope;
  private _scope = new Scope();
  private _stack: any[] = [];
  private _compareResult: boolean | null = null;
  private _returnValue: any;

  constructor(
    private _chunks: Chunk[],
    config?: {
      scope?: Scope;
    }
  ) {
    this._initialScope = config?.scope ?? this._scope;
  }

  run() {
    // Reinitialize state
    this.reset();

    // Main loop
    while (this._current < this._chunks.length) {
      this.next();

      // Check the state of the machine
      if (this._state.type !== "RUNNING") {
        switch (this._state.type) {
          case "EOF": {
            return this._state.result;
          }
          default: {
            throw new Error("Unexpected state.");
          }
        }
      }
    }

    throw new Error("Expected EOF.");
  }

  reset() {
    this._current = 0;
    this._state = {
      type: "RUNNING",
    } as VMState;
    this._scope = this._initialScope.copy();
    this._stack = [];
  }

  next() {
    const chunk = this._chunks[this._current];
    switch (chunk.type()) {
      case "OP_EOF": {
        this._state = {
          type: "EOF",
          result: {
            output: null,
            memoryDump: this._scope.dump(),
            stackDump: this._stack.slice(),
            returnValue: this._returnValue,
          },
        };
        break;
      }
      case "OP_ASSIGN": {
        const value = this.pop();
        this._scope.set(chunk.value<string>(), new VMVariable(value));
        break;
      }
      case "OP_LOAD": {
        this.push(this._scope.get(chunk.value<string>()));
        break;
      }
      case "OP_NEGATE": {
        this.push(-this.pop());
        break;
      }
      case "OP_ADD": {
        const b = this.pop();
        const a = this.pop();
        this.push(a + b);
        break;
      }
      case "OP_SUBTRACT": {
        const b = this.pop();
        const a = this.pop();
        this.push(a - b);
        break;
      }
      case "OP_MULTIPLY": {
        const b = this.pop();
        const a = this.pop();
        this.push(a * b);
        break;
      }
      case "OP_DIVIDE": {
        const b = this.pop();
        const a = this.pop();
        this.push(a / b);
        break;
      }
      case "OP_CONSTANT": {
        this._stack.push(chunk.value<number>());
        break;
      }
      case "OP_COMPARE_EQUAL": {
        const b = this.pop();
        const a = this.pop();
        this._compareResult = a === b;
        break;
      }
      case "OP_COMPARE_NOT_EQUAL": {
        const b = this.pop();
        const a = this.pop();
        this._compareResult = a !== b;
        break;
      }
      case "OP_COMPARE_GREATER": {
        const b = this.pop();
        const a = this.pop();
        this._compareResult = a > b;
        break;
      }
      case "OP_COMPARE_GREATER_EQUAL": {
        const b = this.pop();
        const a = this.pop();
        this._compareResult = a >= b;
        break;
      }
      case "OP_COMPARE_LOWER": {
        const b = this.pop();
        const a = this.pop();
        this._compareResult = a < b;
        break;
      }
      case "OP_COMPARE_LOWER_EQUAL": {
        const b = this.pop();
        const a = this.pop();
        this._compareResult = a <= b;
        break;
      }
      case "OP_JUMP": {
        this._current += chunk.value<number>();
        break;
      }
      case "OP_JUMP_IF_FALSE": {
        if (this._compareResult === false) {
          this._current += chunk.value<number>();
          this._compareResult = null;
        }

        break;
      }
      case "OP_RET": {
        this._returnValue = this.pop();
        break;
      }
    }

    this._current++;
  }

  private pop() {
    return this._stack.pop();
  }

  private push(value: any) {
    return this._stack.push(value);
  }
}
