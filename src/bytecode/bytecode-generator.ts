import { AST } from "../ast/ast";
import { ByteCode, Register } from "./instructions";

export class BytecodeGenerator {
  private allocator = new RegisterAllocator();

  private instructions: ByteCode.Instruction[] = [];

  private currentIndex = 0;

  constructor(private ast: AST.Program) {}

  // Utils
  private advance() {
    return this.ast.at(this.currentIndex++);
  }

  private isEOF() {
    return this.currentIndex >= this.ast.nodesLength();
  }

  private previous() {
    return this.ast.at(this.currentIndex - 1);
  }

  private add(...instructions: ByteCode.Instruction[]) {
    this.instructions.push(...instructions);
  }

  generate() {
    while (!this.isEOF()) {
      const current = this.advance();
      this.handle(current);
    }

    return this.instructions;
  }

  private handle(node: AST.ASTNode) {
    if (node instanceof AST.VariableDefinition) {
      this.variableDefinition(node);
    } else if (node instanceof AST.Expression) {
      this.expressionStatement(node);
    } else if (node instanceof AST.Conditional) {
      this.conditional(node);
    } else if (node instanceof AST.WhileLoop) {
      this.whileLoop(node);
    }
  }

  private expressionStatement(node: AST.Expression) {
    const reg = this.expression(node);
    this.allocator.release(reg);
  }

  private variableDefinition(node: AST.VariableDefinition) {
    const reg = this.expression(node.expr());
    this.instructions.push(
      new ByteCode.LoadReg(reg),
      new ByteCode.StoreInt(node.name())
    );
    this.allocator.release(reg);
  }

  private expression(node: AST.Expression): Register {
    if (node instanceof AST.BinaryExpression) {
      const reg1 = this.expression(node.left());
      const reg2 = this.expression(node.right());

      this.instructions.push(new ByteCode.LoadReg(reg1));
      switch (node.operator()) {
        case AST.BinaryOperationType.ADD: {
          this.instructions.push(new ByteCode.AddReg(reg2));
          break;
        }
        case AST.BinaryOperationType.SUBTRACT: {
          this.instructions.push(new ByteCode.SubReg(reg2));
          break;
        }
        case AST.BinaryOperationType.MULTIPLY: {
          this.instructions.push(new ByteCode.MulReg(reg2));
          break;
        }
        case AST.BinaryOperationType.DIVIDE: {
          this.instructions.push(new ByteCode.DivReg(reg2));
          break;
        }
        case AST.BinaryOperationType.MODULO: {
          this.instructions.push(new ByteCode.ModReg(reg2));
          break;
        }
      }

      this.allocator.release(reg1);
      this.allocator.release(reg2);

      const reg = this.allocator.alloc();
      this.instructions.push(new ByteCode.StoreReg(reg));
      return reg;
    } else if (node instanceof AST.IntValue) {
      const reg = this.allocator.alloc();
      this.instructions.push(
        new ByteCode.LoadInt(node.unfold()),
        new ByteCode.StoreReg(reg)
      );

      return reg;
    } else if (node instanceof AST.FloatValue) {
      const reg = this.allocator.alloc();
      this.instructions.push(
        new ByteCode.LoadFloat(node.unfold()),
        new ByteCode.StoreReg(reg)
      );

      return reg;
    } else if (node instanceof AST.StringValue) {
      const reg = this.allocator.alloc();
      this.instructions.push(
        new ByteCode.LoadString(node.unfold()),
        new ByteCode.StoreReg(reg)
      );

      return reg;
    } else if (node instanceof AST.IdentifierValue) {
      const reg = this.allocator.alloc();
      this.instructions.push(
        new ByteCode.LoadVar(node.unfold()),
        new ByteCode.StoreReg(reg)
      );

      return reg;
    } else if (node instanceof AST.PrefixExpression) {
      const reg = this.expression(node.expr());
      this.add(new ByteCode.LoadReg(reg));

      switch (node.operator()) {
        case AST.PrefixOperator.ARITHMETIC_NEGATE: {
          this.add(new ByteCode.Neg());
          break;
        }
        case AST.PrefixOperator.LOGICAL_NEGATE: {
          this.add(new ByteCode.LogNeg());
          break;
        }
        case AST.PrefixOperator.INCREMENT: {
          this.add(new ByteCode.Increment());
          break;
        }
        case AST.PrefixOperator.DECREMENT: {
          this.add(new ByteCode.Decrement());
          break;
        }
      }

      this.add(new ByteCode.StoreReg(reg));
      return reg;
    } else if (node instanceof AST.PostfixIncrement) {
      this.add(new ByteCode.LoadVar(node.identifier().unfold()))
      const reg = this.allocator.alloc()
      this.add(new ByteCode.StoreReg(reg), new ByteCode.LoadReg(reg));

      switch (node.type()) {
        case AST.PostfixIncrementType.INCREMENT: {
          this.add(new ByteCode.Increment());
          break;
        }
        case AST.PostfixIncrementType.DECREMENT: {
          this.add(new ByteCode.Decrement());
          break;
        }
      }

      this.add(new ByteCode.StoreReg(reg));
      return reg;
    }

    throw new Error("Unreachable");
  }

  private conditional(node: AST.Conditional) {
    const reg = this.expression(node.expr());
    this.instructions.push(new ByteCode.LoadReg(reg));
    this.allocator.release(reg);

    const jump = new ByteCode.JumpFalse(-1);
    this.instructions.push(jump);
    this.block(node.ifBranch());
    jump.set(this.instructions.length + 1);
  }

  private whileLoop(node: AST.WhileLoop) {
    // Storing current position so we can go back to it
    // and reevaluate the loop
    const currentPos = this.instructions.length;

    const reg = this.expression(node.expr());
    this.instructions.push(new ByteCode.LoadReg(reg));
    this.allocator.release(reg);

    const jump = new ByteCode.JumpFalse(-1);
    this.instructions.push(jump);
    this.block(node.block());
    this.instructions.push(new ByteCode.Jump(currentPos));
    jump.set(this.instructions.length + 1);
  }

  private block(node: AST.Block) {
    for (let i = 0; i < node.nodesLength(); i++) {
      this.handle(node.at(i));
    }
  }
}

class RegisterAllocator {
  private current = 0;
  alloc() {
    this.current++;
    return Register.id(this.current - 1);
  }
  release(register: Register) {
    this.current--;
  }
}
