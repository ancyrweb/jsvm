import { AST } from "../src/ast/ast";
import { BytecodeGenerator } from "../src/bytecode/bytecode-generator";
import { ByteCode, Register } from "../src/bytecode/instructions";

describe("arithmetic", () => {
  describe("literals", () => {
    it("should load a int value", () => {
      const program = new AST.Program([new AST.IntValue(1)]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadInt(1),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });

    it("should load a float value", () => {
      const program = new AST.Program([new AST.FloatValue(1)]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadFloat(1),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });

    it("should load a string value", () => {
      const program = new AST.Program([new AST.StringValue("Hello World!")]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadString("Hello World!"),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });
    it("should load a variable", () => {
      const program = new AST.Program([new AST.IdentifierValue("myVar")]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadVar("myVar"),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });
  });

  describe("prefix expressions", () => {
    it("should arithmetic negate a int value", () => {
      const program = new AST.Program([
        new AST.PrefixExpression(
          new AST.IntValue(1),
          AST.PrefixOperator.ARITHMETIC_NEGATE
        ),
      ]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadInt(1),
        new ByteCode.StoreReg(Register.id(0)),

        new ByteCode.LoadReg(Register.id(0)),
        new ByteCode.Neg(),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });
    it("should logical negate a int value", () => {
      const program = new AST.Program([
        new AST.PrefixExpression(
          new AST.IntValue(1),
          AST.PrefixOperator.LOGICAL_NEGATE
        ),
      ]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadInt(1),
        new ByteCode.StoreReg(Register.id(0)),

        new ByteCode.LoadReg(Register.id(0)),
        new ByteCode.LogNeg(),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });
    it("should increment a int value", () => {
      const program = new AST.Program([
        new AST.PrefixExpression(
          new AST.IntValue(1),
          AST.PrefixOperator.INCREMENT
        ),
      ]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadInt(1),
        new ByteCode.StoreReg(Register.id(0)),

        new ByteCode.LoadReg(Register.id(0)),
        new ByteCode.Increment(),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });
    it("should decrement a int value", () => {
      const program = new AST.Program([
        new AST.PrefixExpression(
          new AST.IntValue(1),
          AST.PrefixOperator.DECREMENT
        ),
      ]);

      const instructions = new BytecodeGenerator(program).generate();
      expect(instructions).toMatchObject([
        new ByteCode.LoadInt(1),
        new ByteCode.StoreReg(Register.id(0)),

        new ByteCode.LoadReg(Register.id(0)),
        new ByteCode.Decrement(),
        new ByteCode.StoreReg(Register.id(0)),
      ]);
    });
  });

  it("should parse an addition", () => {
    const program = new AST.Program([
      new AST.BinaryExpression(
        new AST.IntValue(1),
        new AST.IntValue(2),
        AST.BinaryOperationType.ADD
      ),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.AddReg(Register.id(1)),

      new ByteCode.StoreReg(Register.id(0)),
    ]);
  });

  it("should parse a subtraction", () => {
    const program = new AST.Program([
      new AST.BinaryExpression(
        new AST.IntValue(1),
        new AST.IntValue(2),
        AST.BinaryOperationType.SUBTRACT
      ),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.SubReg(Register.id(1)),

      new ByteCode.StoreReg(Register.id(0)),
    ]);
  });
  it("should parse a multiplication", () => {
    const program = new AST.Program([
      new AST.BinaryExpression(
        new AST.IntValue(1),
        new AST.IntValue(2),
        AST.BinaryOperationType.MULTIPLY
      ),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.MulReg(Register.id(1)),

      new ByteCode.StoreReg(Register.id(0)),
    ]);
  });

  it("should parse a division", () => {
    const program = new AST.Program([
      new AST.BinaryExpression(
        new AST.IntValue(1),
        new AST.IntValue(2),
        AST.BinaryOperationType.DIVIDE
      ),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.DivReg(Register.id(1)),

      new ByteCode.StoreReg(Register.id(0)),
    ]);
  });

  it("should parse a modulo", () => {
    const program = new AST.Program([
      new AST.BinaryExpression(
        new AST.IntValue(1),
        new AST.IntValue(2),
        AST.BinaryOperationType.MULTIPLY
      ),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.ModReg(Register.id(1)),

      new ByteCode.StoreReg(Register.id(0)),
    ]);
  });
  it("should parse simple assignment", () => {
    const program = new AST.Program([
      new AST.VariableDefinition("int", "myVar", new AST.IntValue(1)),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.StoreInt("myVar"),
    ]);
  });
  it("should parse an simple assignment addition", () => {
    const program = new AST.Program([
      new AST.VariableDefinition(
        "int",
        "myVar",
        new AST.BinaryExpression(
          new AST.IntValue(1),
          new AST.IntValue(2),
          AST.BinaryOperationType.ADD
        )
      ),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.AddReg(Register.id(1)),
      new ByteCode.StoreReg(Register.id(0)),

      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.StoreInt("myVar"),
    ]);
  });

  it("should parse a longer addition", () => {
    const program = new AST.Program([
      new AST.VariableDefinition(
        "int",
        "myVar",
        new AST.BinaryExpression(
          new AST.BinaryExpression(
            new AST.IntValue(1),
            new AST.IntValue(2),
            AST.BinaryOperationType.ADD
          ),
          new AST.IntValue(3),
          AST.BinaryOperationType.ADD
        )
      ),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      // Store 1
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),
      // Store 2
      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),
      // Compute 1 + 2 and put the result into acc
      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.AddReg(Register.id(1)),
      // Store result of previous computation in register 0
      new ByteCode.StoreReg(Register.id(0)),

      // Load 3 into register 1
      new ByteCode.LoadInt(3),
      new ByteCode.StoreReg(Register.id(1)),

      // Compute the sum of register 0 and 1
      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.AddReg(Register.id(1)),
      new ByteCode.StoreReg(Register.id(0)),

      // Store into myVar
      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.StoreInt("myVar"),
    ]);
  });
});

describe("conditional", () => {
  it("should handle simple if", () => {
    const program = new AST.Program([
      new AST.Conditional(
        new AST.IntValue(1),
        new AST.Block([
          new AST.BinaryExpression(
            new AST.IntValue(1),
            new AST.IntValue(2),
            AST.BinaryOperationType.ADD
          ),
        ]),
        null
      ),
      new AST.IntValue(3),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),
      new ByteCode.LoadReg(Register.id(0)),

      new ByteCode.JumpFalse(12),
      // Content of the IF branch
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),
      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),
      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.AddReg(Register.id(1)),
      new ByteCode.StoreReg(Register.id(0)),

      // After the IF branch
      new ByteCode.LoadInt(3),
      new ByteCode.StoreReg(Register.id(0)),
    ]);
  });
});

describe("loop", () => {
  it("should handle simple while", () => {
    const program = new AST.Program([
      new AST.WhileLoop(
        new AST.IntValue(1),
        new AST.Block([
          new AST.BinaryExpression(
            new AST.IntValue(1),
            new AST.IntValue(2),
            AST.BinaryOperationType.ADD
          ),
        ])
      ),
      new AST.IntValue(3),
    ]);

    const instructions = new BytecodeGenerator(program).generate();
    expect(instructions).toMatchObject([
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),
      new ByteCode.LoadReg(Register.id(0)),

      new ByteCode.JumpFalse(13),
      // Content of the loop
      new ByteCode.LoadInt(1),
      new ByteCode.StoreReg(Register.id(0)),
      new ByteCode.LoadInt(2),
      new ByteCode.StoreReg(Register.id(1)),
      new ByteCode.LoadReg(Register.id(0)),
      new ByteCode.AddReg(Register.id(1)),
      new ByteCode.StoreReg(Register.id(0)),
      // Reevaluate the loop
      new ByteCode.Jump(0),

      // After the IF branch
      new ByteCode.LoadInt(3),
      new ByteCode.StoreReg(Register.id(0)),
    ]);
  });
});
