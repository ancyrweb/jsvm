import { Instruction } from "../src/instruction";
import { Scope } from "../src/scope";
import { VirtualMachine } from "../src/virtual-machine";
import { VMFunction } from "../src/vm-function";
import { VMVariable } from "../src/vm-variable";

describe("core", () => {
  it("should throw when no EOF", () => {
    const vm = new VirtualMachine([]);

    expect(() => vm.run()).toThrow("Expected EOF.");
  });

  it("should run an EOF program", () => {
    const vm = new VirtualMachine([Instruction.eof()]);

    const result = vm.run();
    expect(result.output).toBe(null);
  });

  it("should assign variables", () => {
    const vm = new VirtualMachine([
      Instruction.constant(1),
      Instruction.assign("x"),
      Instruction.constant("hello world"),
      Instruction.assign("y"),
      Instruction.eof(),
    ]);

    const result = vm.run();
    expect(result.output).toBe(null);
    expect(result.memoryDump).toEqual({
      x: 1,
      y: "hello world",
    });
  });
  it("should run using input variables", () => {
    const vm = new VirtualMachine(
      [
        Instruction.load("a"),
        Instruction.load("b"),
        Instruction.add(),
        Instruction.assign("c"),
        Instruction.eof(),
      ],
      {
        scope: new Scope({
          a: new VMVariable(1),
          b: new VMVariable(2),
        }),
      }
    );

    const result = vm.run();
    expect(result.output).toBe(null);
    expect(result.memoryDump).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});

describe("math", () => {
  it("should negate a constant", () => {
    const vm = new VirtualMachine([
      Instruction.constant(1),
      Instruction.negate(),
      Instruction.assign("x"),
      Instruction.eof(),
    ]);

    const result = vm.run();
    expect(result.output).toBe(null);
    expect(result.memoryDump).toEqual({
      x: -1,
    });
  });

  it("should add two constants", () => {
    const vm = new VirtualMachine([
      Instruction.constant(1),
      Instruction.constant(2),
      Instruction.add(),
      Instruction.assign("x"),
      Instruction.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 3,
    });
  });
  it("should substract two constants", () => {
    const vm = new VirtualMachine([
      Instruction.constant(1),
      Instruction.constant(2),
      Instruction.subtract(),
      Instruction.assign("x"),
      Instruction.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: -1,
    });
  });
  it("should multiply two constants", () => {
    const vm = new VirtualMachine([
      Instruction.constant(3),
      Instruction.constant(3),
      Instruction.multiply(),
      Instruction.assign("x"),
      Instruction.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 9,
    });
  });
  it("should divide two constants", () => {
    const vm = new VirtualMachine([
      Instruction.constant(90),
      Instruction.constant(3),
      Instruction.divide(),
      Instruction.assign("x"),
      Instruction.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 30,
    });
    expect(result.stackDump).toEqual([]);
  });
});

describe("strings", () => {
  it("should divide two constants", () => {
    const vm = new VirtualMachine([
      Instruction.constant("I am "),
      Instruction.constant(21),
      Instruction.add(),
      Instruction.constant(" years old."),
      Instruction.add(),
      Instruction.assign("x"),
      Instruction.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: "I am 21 years old.",
    });
    expect(result.stackDump).toEqual([]);
  });
});

describe("comparisons", () => {
  it("handle equality when they are equal", () => {
    const vm = new VirtualMachine([
      Instruction.constant(21), // 0
      Instruction.constant(21), // 1
      Instruction.compareEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle equality when they are NOT equal", () => {
    const vm = new VirtualMachine([
      Instruction.constant(21), // 0
      Instruction.constant(22), // 1
      Instruction.compareEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle difference when its true", () => {
    const vm = new VirtualMachine([
      Instruction.constant(5), // 0
      Instruction.constant(100), // 1
      Instruction.compareNotEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle difference when its false", () => {
    const vm = new VirtualMachine([
      Instruction.constant(5), // 0
      Instruction.constant(5), // 1
      Instruction.compareNotEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
    expect(result.stackDump).toEqual([]);
  });

  it("handle greater when true", () => {
    const vm = new VirtualMachine([
      Instruction.constant(100), // 0
      Instruction.constant(5), // 1
      Instruction.compareGreater(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle greater when false", () => {
    const vm = new VirtualMachine([
      Instruction.constant(5), // 0
      Instruction.constant(100), // 1
      Instruction.compareGreater(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });
  it("handle greaterEqual when true", () => {
    const vm = new VirtualMachine([
      Instruction.constant(5), // 0
      Instruction.constant(5), // 1
      Instruction.compareGreaterEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
  });
  it("handle greaterEqual when false", () => {
    const vm = new VirtualMachine([
      Instruction.constant(5), // 0
      Instruction.constant(100), // 1
      Instruction.compareGreaterEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });

  it("handle lower when true", () => {
    const vm = new VirtualMachine([
      Instruction.constant(5), // 0
      Instruction.constant(100), // 1
      Instruction.compareLower(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle lower when false", () => {
    const vm = new VirtualMachine([
      Instruction.constant(100), // 0
      Instruction.constant(5), // 1
      Instruction.compareLower(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });
  it("handle lowerEqual when true", () => {
    const vm = new VirtualMachine([
      Instruction.constant(5), // 0
      Instruction.constant(5), // 1
      Instruction.compareLowerEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
  });
  it("handle lowerEqual when false", () => {
    const vm = new VirtualMachine([
      Instruction.constant(100), // 0
      Instruction.constant(5), // 1
      Instruction.compareLowerEqual(), // 2
      Instruction.jumpIfFalse(3), // 3
      Instruction.constant(1), // 4
      Instruction.assign("x"), // 5
      Instruction.jump(2), // 6
      Instruction.constant(2), // 7
      Instruction.assign("x"), // 8
      Instruction.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });
});

describe("functions", () => {
  it("should run the function", () => {
    const multiply = new VMFunction([
      Instruction.loadArg("x"),
      Instruction.constant(10),
      Instruction.multiply(),
      Instruction.ret(),
      Instruction.eof(),
    ]);

    const vm = new VirtualMachine(
      [
        Instruction.constant(10),
        Instruction.storeArg("x"),
        Instruction.callFunction("multiply"),
        Instruction.assign("x"),
        Instruction.eof(),
      ],
      {
        scope: new Scope({
          multiply,
        }),
      }
    );

    const result = vm.run();
    expect(result.memoryDump).toMatchObject({
      x: 100,
    });
  });

});
