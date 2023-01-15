export namespace ByteCode {
  export abstract class Instruction {}

  // Store the accumulator into a register
  export class StoreReg extends Instruction {
    constructor(private _reg: Register) {
      super();
    }
  }

  // Load a register into the accumulator
  export class LoadReg extends Instruction {
    constructor(private _reg: Register) {
      super();
    }
  }

  // Load an integer into the accumulator
  export class LoadInt extends Instruction {
    constructor(private _value: number) {
      super();
    }
  }

  export class LoadFloat extends Instruction {
    constructor(private _value: number) {
      super();
    }
  }

  export class LoadString extends Instruction {
    constructor(private _value: string) {
      super();
    }
  }

  export class LoadVar extends Instruction {
    constructor(private _value: string) {
      super();
    }
  }

  // Arithmetic Instructions
  export class AddReg extends Instruction {
    constructor(private _reg: Register) {
      super();
    }
  }

  export class SubReg extends Instruction {
    constructor(private _reg: Register) {
      super();
    }
  }

  export class MulReg extends Instruction {
    constructor(private _reg: Register) {
      super();
    }
  }

  export class DivReg extends Instruction {
    constructor(private _reg: Register) {
      super();
    }
  }

  export class ModReg extends Instruction {
    constructor(private _reg: Register) {
      super();
    }
  }

  // Arithmetic Negate
  export class Neg extends Instruction {
    constructor() {
      super();
    }
  }

  // Logical Negate
  export class LogNeg extends Instruction {
    constructor() {
      super();
    }
  }

  export class Decrement extends Instruction {
    constructor() {
      super();
    }
  }

  export class Increment extends Instruction {
    constructor() {
      super();
    }
  }

  // Memory Instructions
  // Store an integer inside memory
  export class StoreInt extends Instruction {
    constructor(private _name: string) {
      super();
    }
  }

  // Evaluate the accumulator, jump if it's falsey
  export class Jump extends Instruction {
    constructor(private _address: number) {
      super();
    }

    set(address: number) {
      this._address = address;
    }
  }
  // Evaluate the accumulator, jump if it's falsey
  export class JumpFalse extends Jump {}
}

export class Register {
  static id(name: number) {
    return new Register(name);
  }
  constructor(private _name: number) {}

  name() {
    return this._name;
  }
}
