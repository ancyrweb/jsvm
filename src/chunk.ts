type ChunkType =
  // VALUES
  | "OP_ASSIGN"
  | "OP_CONSTANT"
  | "OP_LOAD"
  // MATH
  | "OP_NEGATE"
  // BINOP
  | "OP_ADD"
  | "OP_SUBTRACT"
  | "OP_MULTIPLY"
  | "OP_DIVIDE"
  // COMPARES
  | "OP_COMPARE_EQUAL"
  | "OP_COMPARE_NOT_EQUAL"
  | "OP_COMPARE_GREATER"
  | "OP_COMPARE_GREATER_EQUAL"
  | "OP_COMPARE_LOWER"
  | "OP_COMPARE_LOWER_EQUAL"
  // JUMPS
  | "OP_JUMP_IF_FALSE"
  | "OP_JUMP"
  // EOF
  | "OP_RET"
  | "OP_EOF";

export class Chunk<T = any> {
  // Static factories

  // VALUES
  static assign(name: string) {
    return new Chunk("OP_ASSIGN", name);
  }
  static constant(value: number | string) {
    return new Chunk("OP_CONSTANT", value);
  }
  static load(name: string) {
    return new Chunk("OP_LOAD", name);
  }

  // MATH
  static negate() {
    return new Chunk("OP_NEGATE");
  }

  // BINOP
  static add() {
    return new Chunk("OP_ADD");
  }
  static subtract() {
    return new Chunk("OP_SUBTRACT");
  }
  static multiply() {
    return new Chunk("OP_MULTIPLY");
  }
  static divide() {
    return new Chunk("OP_DIVIDE");
  }

  // COMPARES
  static compareEqual() {
    return new Chunk("OP_COMPARE_EQUAL");
  }
  static compareNotEqual() {
    return new Chunk("OP_COMPARE_NOT_EQUAL");
  }
  static compareGreater() {
    return new Chunk("OP_COMPARE_GREATER");
  }
  static compareGreaterEqual() {
    return new Chunk("OP_COMPARE_GREATER_EQUAL");
  }
  static compareLower() {
    return new Chunk("OP_COMPARE_LOWER");
  }
  static compareLowerEqual() {
    return new Chunk("OP_COMPARE_LOWER_EQUAL");
  }

  // JUMPS
  static jumpIfFalse(steps: number) {
    return new Chunk("OP_JUMP_IF_FALSE", steps);
  }
  static jump(steps: number) {
    return new Chunk("OP_JUMP", steps);
  }

  // EOF
  static ret() {
    return new Chunk("OP_RET");
  }
  static eof() {
    return new Chunk("OP_EOF");
  }

  // Core
  constructor(private _type: ChunkType, private _value?: T) {}

  type() {
    return this._type;
  }

  value<T>() {
    return this._value;
  }
}
