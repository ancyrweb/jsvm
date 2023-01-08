import { Chunk } from "../src/chunk";
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
    const vm = new VirtualMachine([Chunk.eof()]);

    const result = vm.run();
    expect(result.output).toBe(null);
  });

  it("should assign variables", () => {
    const vm = new VirtualMachine([
      Chunk.constant(1),
      Chunk.assign("x"),
      Chunk.constant("hello world"),
      Chunk.assign("y"),
      Chunk.eof(),
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
        Chunk.load("a"),
        Chunk.load("b"),
        Chunk.add(),
        Chunk.assign("c"),
        Chunk.eof(),
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
      Chunk.constant(1),
      Chunk.negate(),
      Chunk.assign("x"),
      Chunk.eof(),
    ]);

    const result = vm.run();
    expect(result.output).toBe(null);
    expect(result.memoryDump).toEqual({
      x: -1,
    });
  });

  it("should add two constants", () => {
    const vm = new VirtualMachine([
      Chunk.constant(1),
      Chunk.constant(2),
      Chunk.add(),
      Chunk.assign("x"),
      Chunk.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 3,
    });
  });
  it("should substract two constants", () => {
    const vm = new VirtualMachine([
      Chunk.constant(1),
      Chunk.constant(2),
      Chunk.subtract(),
      Chunk.assign("x"),
      Chunk.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: -1,
    });
  });
  it("should multiply two constants", () => {
    const vm = new VirtualMachine([
      Chunk.constant(3),
      Chunk.constant(3),
      Chunk.multiply(),
      Chunk.assign("x"),
      Chunk.eof(),
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 9,
    });
  });
  it("should divide two constants", () => {
    const vm = new VirtualMachine([
      Chunk.constant(90),
      Chunk.constant(3),
      Chunk.divide(),
      Chunk.assign("x"),
      Chunk.eof(),
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
      Chunk.constant("I am "),
      Chunk.constant(21),
      Chunk.add(),
      Chunk.constant(" years old."),
      Chunk.add(),
      Chunk.assign("x"),
      Chunk.eof(),
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
      Chunk.constant(21), // 0
      Chunk.constant(21), // 1
      Chunk.compareEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle equality when they are NOT equal", () => {
    const vm = new VirtualMachine([
      Chunk.constant(21), // 0
      Chunk.constant(22), // 1
      Chunk.compareEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle difference when its true", () => {
    const vm = new VirtualMachine([
      Chunk.constant(5), // 0
      Chunk.constant(100), // 1
      Chunk.compareNotEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle difference when its false", () => {
    const vm = new VirtualMachine([
      Chunk.constant(5), // 0
      Chunk.constant(5), // 1
      Chunk.compareNotEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
    expect(result.stackDump).toEqual([]);
  });

  it("handle greater when true", () => {
    const vm = new VirtualMachine([
      Chunk.constant(100), // 0
      Chunk.constant(5), // 1
      Chunk.compareGreater(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle greater when false", () => {
    const vm = new VirtualMachine([
      Chunk.constant(5), // 0
      Chunk.constant(100), // 1
      Chunk.compareGreater(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });
  it("handle greaterEqual when true", () => {
    const vm = new VirtualMachine([
      Chunk.constant(5), // 0
      Chunk.constant(5), // 1
      Chunk.compareGreaterEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
  });
  it("handle greaterEqual when false", () => {
    const vm = new VirtualMachine([
      Chunk.constant(5), // 0
      Chunk.constant(100), // 1
      Chunk.compareGreaterEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });

  it("handle lower when true", () => {
    const vm = new VirtualMachine([
      Chunk.constant(5), // 0
      Chunk.constant(100), // 1
      Chunk.compareLower(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
    expect(result.stackDump).toEqual([]);
  });
  it("handle lower when false", () => {
    const vm = new VirtualMachine([
      Chunk.constant(100), // 0
      Chunk.constant(5), // 1
      Chunk.compareLower(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });
  it("handle lowerEqual when true", () => {
    const vm = new VirtualMachine([
      Chunk.constant(5), // 0
      Chunk.constant(5), // 1
      Chunk.compareLowerEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 1,
    });
  });
  it("handle lowerEqual when false", () => {
    const vm = new VirtualMachine([
      Chunk.constant(100), // 0
      Chunk.constant(5), // 1
      Chunk.compareLowerEqual(), // 2
      Chunk.jumpIfFalse(3), // 3
      Chunk.constant(1), // 4
      Chunk.assign("x"), // 5
      Chunk.jump(2), // 6
      Chunk.constant(2), // 7
      Chunk.assign("x"), // 8
      Chunk.eof(), // 9
    ]);

    const result = vm.run();
    expect(result.memoryDump).toEqual({
      x: 2,
    });
  });
});

describe("functions", () => {
  it("should run the function", () => {
    const fn = new VMFunction([
      Chunk.load("a"),
      Chunk.constant(10),
      Chunk.multiply(),
      Chunk.ret(),
      Chunk.eof(),
    ]);

    const instance = fn.instance(
      new Scope({
        a: new VMVariable(10),
      })
    );

    const result = instance.run();
    expect(result.returnValue).toEqual(100);
  });
});
