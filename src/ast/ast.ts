/*
Let's define our language 

Program -> Statements
Statements -> Block | ExpressionStatement | Declaration | VariableDefinition | Conditional | Loop

Block -> LEFT_BRACKET (Statements)* RIGHT_BRACKET

ExpressionStatement -> Expression SEMICOLON

Expression -> LogicalOr
LogicalOr -> LogicalAnd | LogicalAnd OR LogicalAnd
LogicalAnd -> Re | Re AND Re
RelationalEquity (Re) -> Rd | Rd EQUAL_EQUAL Rd | Rd BANG_EQUAL Rd
RelationalDifference (Rd) -> Term | Term LOWER Term | Term LOWER_EQUAL Term | Term GREATER Term | Term GREATER_EQUAL Term
Term -> Factor | Factor PLUS Factor | Factor MINUS Factor
Factor -> PrefixUnary | PrefixUnary STAR PrefixUnary | PrefixUnary SLASH PrefixUnary | PrefixUnary MODULO PrefixUnary
PrefixUnary -> (MINUS | BANG | PLUS_PLUS | MINUS_MINUS)? Grouping
Grouping -> Literal | LEFT_PAREN Expression RIGHT_PAREN
Primary -> IDENTIFIER | STRING_LITERAL | NUMBER_LITERAL | FLOAT_LITERAL

VariableType -> INT
VariableDeclaration -> (CONST)? VariableType IDENTIFIER
VariableDefinition -> VariableDeclaration (EQUAL Expression)?
VariableAssignment -> IDENTIFIER (EQUAL | PLUS_EQUAL | MINUS_EQUAL | TIMES_EQUAL | SLASH_EQUAL) Expression

Declaration -> FunctionDeclaration (later, add StructDeclaration)
FunctionDeclaration -> VariableType IDENTIFIER PAREN_LEFT (VariableDeclaration (, VariableDeclaration)*)? PAREN_RIGHT Block

Conditional -> IF LEFT_PAREN (Expression) (Block) (ELSE (Conditional | (Block)))

ForLoop -> FOR LEFT_PAREN ((VariableDefinition)* SEMICOLON (Expression)* SEMICOLON (VariableAssignment)*) RIGHT_PAREN BLOCK
WhileLoop -> WHILE LEFT_PAREN (Expression) RIGHT_PAREN (Block)
DoWhileLoop -> DO (Block) WHILE LEFT_PAREN (Expression) RIGHT_PAREN

Loop -> ForLoop | WhileLoop | DoWhileLoop
*/

import { Token, TokenType } from "../scanner/token";

export namespace AST {
  export abstract class ASTNode {}

  export class Program {
    private nodes: ASTNode[];
    constructor(nodes?: ASTNode[]) {
      this.nodes = nodes || [];
    }

    at<T extends ASTNode>(index: number): T {
      if (index >= this.nodes.length) {
        throw new Error("Out of bounds");
      }

      return this.nodes[index] as T;
    }

    nodesLength() {
      return this.nodes.length;
    }

    toString() {
      return this.nodes.map((n) => n.toString()).join("\n");
    }
  }

  export abstract class Statement extends ASTNode {}

  export abstract class Expression extends ASTNode {
    toString() {
      return "Expression";
    }
  }

  export enum BinaryOperationType {
    ADD = "addition",
    SUBTRACT = "substraction",
    MULTIPLY = "multiplication",
    DIVIDE = "division",
    MODULO = "modulo",

    EQUAL = "equal",
    NOT_EQUAL = "not_equal",
    LOWER = "lower",
    LOWER_EQUAL = "lower_equal",
    GREATER = "greater",
    GREATER_EQUAL = "greater_equal",

    AND = "and",
    OR = "or",
  }

  export const tokenToBinOp = (type: TokenType) => {
    switch (type) {
      case TokenType.PLUS:
        return BinaryOperationType.ADD;
      case TokenType.MINUS:
        return BinaryOperationType.SUBTRACT;
      case TokenType.STAR:
        return BinaryOperationType.MULTIPLY;
      case TokenType.SLASH:
        return BinaryOperationType.DIVIDE;
      case TokenType.MODULO:
        return BinaryOperationType.MODULO;

      case TokenType.EQUAL_EQUAL:
        return BinaryOperationType.EQUAL;
      case TokenType.BANG_EQUAL:
        return BinaryOperationType.NOT_EQUAL;
      case TokenType.LOWER:
        return BinaryOperationType.LOWER;
      case TokenType.LOWER_EQUAL:
        return BinaryOperationType.LOWER_EQUAL;
      case TokenType.GREATER:
        return BinaryOperationType.GREATER;
      case TokenType.GREATER_EQUAL:
        return BinaryOperationType.GREATER_EQUAL;

      case TokenType.AND:
        return BinaryOperationType.AND;
      case TokenType.OR:
        return BinaryOperationType.OR;
    }

    throw new Error("Unrecognized binop type " + type + ".");
  };

  export enum PrefixOperator {
    ARITHMETIC_NEGATE = "arithmetic_negate",
    LOGICAL_NEGATE = "logical_negate",
    INCREMENT = "increment",
    DECREMENT = "decrement",
  }

  export const tokenToPrefixOp = (type: TokenType) => {
    switch (type) {
      case TokenType.BANG:
        return PrefixOperator.LOGICAL_NEGATE;
      case TokenType.MINUS:
        return PrefixOperator.ARITHMETIC_NEGATE;
      case TokenType.PLUS_PLUS:
        return PrefixOperator.INCREMENT;
      case TokenType.MINUS_MINUS:
        return PrefixOperator.DECREMENT;
    }

    throw new Error("Unrecognized prefix type " + type + ".");
  };

  export class PrefixExpression extends Expression {
    constructor(
      private _expression: Grouping | Literal<any>,
      private _operator: PrefixOperator
    ) {
      super();
    }

    expr<T = Grouping | Literal<any>>() {
      return this._expression as T;
    }

    operator() {
      return this._operator;
    }

    toString(): string {
      return `PrefixExpr([${this._operator}] (${this._expression.toString()}))`;
    }
  }

  export class BinaryExpression extends Expression {
    constructor(
      private _left: Expression,
      private _right: Expression,
      private _operator: BinaryOperationType
    ) {
      super();
    }

    left<T extends Expression>(): T {
      return this._left as T;
    }

    right<T extends Expression>(): T {
      return this._right as T;
    }

    operator() {
      return this._operator;
    }

    toString(): string {
      return `BinOp(${this._left.toString()} [${
        this._operator
      }] ${this._right.toString()})`;
    }
  }

  export class Grouping<T extends Expression = Expression> {
    constructor(private _expression: T) {}

    expr() {
      return this._expression;
    }

    toString() {
      return `Grouping(${this._expression.toString()})`;
    }
  }

  export abstract class Literal<T> extends Expression {
    abstract unfold(): T;
  }

  export class IntValue extends Literal<number> {
    static fromToken(token: Token) {
      return new IntValue(parseInt(token.lexeme, 10));
    }

    constructor(private value: number) {
      super();
    }

    unfold(): number {
      return this.value;
    }

    toString(): string {
      return this.value.toString();
    }
  }

  export class FloatValue extends Literal<number> {
    static fromToken(token: Token) {
      return new FloatValue(parseFloat(token.lexeme));
    }

    constructor(private value: number) {
      super();
    }

    unfold(): number {
      return this.value;
    }

    toString(): string {
      return this.value.toString();
    }
  }

  export class StringValue extends Literal<string> {
    static fromToken(token: Token) {
      return new StringValue(token.lexeme);
    }

    constructor(private value: string) {
      super();
    }

    unfold() {
      return this.value;
    }

    toString(): string {
      return this.value.toString();
    }
  }

  export class IdentifierValue extends Literal<string> {
    static fromToken(token: Token) {
      return new IdentifierValue(token.lexeme);
    }

    constructor(private value: string) {
      super();
    }

    unfold() {
      return this.value;
    }

    toString(): string {
      return `IDENTIFIER(${this.value.toString()})`;
    }
  }
}