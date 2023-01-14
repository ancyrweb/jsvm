import { Scanner } from "./../src/scanner/scanner";
import { TokenType } from "./../src/scanner/token";
import { Parser } from "../src/parser/parser";
import { Token } from "../src/scanner/token";
import { AST } from "../src/ast/ast";

const tok = (type: TokenType, val: string) => new Token(type, 0, 0, 0, val);

const tint = () => tok(TokenType.INT, "int");
const tfloat = () => tok(TokenType.FLOAT, "float");

const tintlit = (val: string) => tok(TokenType.INTEGER_LITERAL, val);
const tfloatlit = (val: string) => tok(TokenType.FLOAT_LITERAL, val);
const tstringlit = (val: string) => tok(TokenType.STRING_LITERAL, val);
const tid = (val: string) => tok(TokenType.IDENTIFIER, val);
const eof = () => tok(TokenType.EOF, "");
const sc = () => tok(TokenType.SEMICOLON, ";");
const tif = () => tok(TokenType.IF, "if");
const telse = () => tok(TokenType.ELSE, "else");
const tparenleft = () => tok(TokenType.PAREN_LEFT, "(");
const tparenright = () => tok(TokenType.PAREN_RIGHT, ")");
const tbraceleft = () => tok(TokenType.BRACE_LEFT, "{");
const tbraceright = () => tok(TokenType.BRACE_RIGHT, "}");

describe("expressions", () => {
  describe("literals", () => {
    it("should parse an integer literal", () => {
      const parser = new Parser([tintlit("1"), sc(), eof()]);

      const program = parser.parse();
      const node = program.at<AST.Literal<number>>(0);
      expect(node.unfold()).toEqual(1);
    });
    it("should parse a floating literal", () => {
      const parser = new Parser([tfloatlit("10.50"), sc(), eof()]);

      const program = parser.parse();
      const node = program.at<AST.Literal<number>>(0);
      expect(node.unfold()).toEqual(10.5);
    });
    it("should parse a string literal", () => {
      const parser = new Parser([tstringlit("10.50"), sc(), eof()]);

      const program = parser.parse();
      const node = program.at<AST.Literal<string>>(0);
      expect(node.unfold()).toEqual("10.50");
    });
    it("should parse an identifier literal", () => {
      const parser = new Parser([tid("myVar"), sc(), eof()]);

      const program = parser.parse();
      const node = program.at<AST.Literal<string>>(0);
      expect(node.unfold()).toEqual("myVar");
    });
  });

  describe("grouping", () => {
    it("should parse a grouping", () => {
      const parser = new Parser([
        new Token(TokenType.PAREN_LEFT, 0, 0, 0, "("),
        tintlit("1"),
        new Token(TokenType.PLUS, 0, 0, 0, "+"),
        tintlit("2"),
        new Token(TokenType.PAREN_RIGHT, 0, 0, 0, ")"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.Literal<number>>(0);
      expect(node).toBeInstanceOf(AST.Grouping);
    });
  });

  describe("prefixUnaries", () => {
    it("should parse the logical negate", () => {
      const parser = new Parser([
        new Token(TokenType.BANG, 0, 0, 0, "!"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.PrefixExpression>(0);
      expect(node.expr<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.PrefixOperator.LOGICAL_NEGATE);
    });

    it("should parse the arithmetic negate", () => {
      const parser = new Parser([
        new Token(TokenType.MINUS, 0, 0, 0, "-"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.PrefixExpression>(0);
      expect(node.expr<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.PrefixOperator.ARITHMETIC_NEGATE);
    });

    it("should parse the increment", () => {
      const parser = new Parser([
        new Token(TokenType.PLUS_PLUS, 0, 0, 0, "++"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.PrefixExpression>(0);
      expect(node.expr<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.PrefixOperator.INCREMENT);
    });

    it("should parse the decrement", () => {
      const parser = new Parser([
        new Token(TokenType.MINUS_MINUS, 0, 0, 0, "-"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.PrefixExpression>(0);
      expect(node.expr<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.PrefixOperator.DECREMENT);
    });
  });

  describe("factors", () => {
    it("should parse the multiplication", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.STAR, 0, 0, 0, "+"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.MULTIPLY);
    });

    it("should parse the division", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.SLASH, 0, 0, 0, "+"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.DIVIDE);
    });

    it("should parse the long serie of factors", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.STAR, 0, 0, 0, "*"),
        tintlit("2"),
        new Token(TokenType.SLASH, 0, 0, 0, "/"),
        new Token(TokenType.INTEGER_LITERAL, 0, 0, 0, "3"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);

      const left = node.left<AST.BinaryExpression>();
      expect(left).toBeInstanceOf(AST.BinaryExpression);

      expect(left.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(left.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(left.operator()).toEqual(AST.BinaryOperationType.MULTIPLY);

      expect(node.right<AST.Literal<number>>().unfold()).toEqual(3);
      expect(node.operator()).toEqual(AST.BinaryOperationType.DIVIDE);
    });
  });
  describe("terms", () => {
    it("should parse the addition", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.PLUS, 0, 0, 0, "+"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.ADD);
    });

    it("should parse the substraction", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.MINUS, 0, 0, 0, "+"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.SUBTRACT);
    });

    it("should parse the long serie of terms", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.MINUS, 0, 0, 0, "-"),
        tintlit("2"),
        new Token(TokenType.PLUS, 0, 0, 0, "+"),
        new Token(TokenType.INTEGER_LITERAL, 0, 0, 0, "3"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);

      const left = node.left<AST.BinaryExpression>();
      expect(left).toBeInstanceOf(AST.BinaryExpression);

      expect(left.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(left.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(left.operator()).toEqual(AST.BinaryOperationType.SUBTRACT);

      expect(node.right<AST.Literal<number>>().unfold()).toEqual(3);
      expect(node.operator()).toEqual(AST.BinaryOperationType.ADD);
    });
  });

  describe("relational differences", () => {
    it("should parse the >", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.GREATER, 0, 0, 0, ">"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.GREATER);
    });

    it("should parse the >=", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.GREATER_EQUAL, 0, 0, 0, "+"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.GREATER_EQUAL);
    });
    it("should parse the <", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.LOWER, 0, 0, 0, "+"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.LOWER);
    });
    it("should parse the <=", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.LOWER_EQUAL, 0, 0, 0, "+"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.LOWER_EQUAL);
    });
  });

  describe("relational equality", () => {
    it("should parse the ==", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.EQUAL_EQUAL, 0, 0, 0, "=="),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.EQUAL);
    });

    it("should parse the !=", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.BANG_EQUAL, 0, 0, 0, "!="),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.NOT_EQUAL);
    });
  });
  describe("logical operations", () => {
    it("should parse &&", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.AND, 0, 0, 0, "&&"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.AND);
    });

    it("should parse ||", () => {
      const parser = new Parser([
        tintlit("1"),
        new Token(TokenType.OR, 0, 0, 0, "||"),
        tintlit("2"),
        sc(),
        eof(),
      ]);

      const program = parser.parse();
      const node = program.at<AST.BinaryExpression>(0);
      expect(node.left<AST.Literal<number>>().unfold()).toEqual(1);
      expect(node.right<AST.Literal<number>>().unfold()).toEqual(2);
      expect(node.operator()).toEqual(AST.BinaryOperationType.OR);
    });
  });
});

describe("variable declarations, definitions & assignments", () => {
  it("should parse a int variable declaration - `int myVar;`", () => {
    const parser = new Parser([tint(), tid("myVar"), sc(), eof()]);

    const program = parser.parse();
    const node = program.at<AST.VariableDeclaration>(0);
    expect(node.type()).toBe("int");
    expect(node.name()).toBe("myVar");
  });
  it("should parse a float variable declaration - `float myVar;`", () => {
    const parser = new Parser([tfloat(), tid("myVar"), sc(), eof()]);

    const program = parser.parse();
    const node = program.at<AST.VariableDeclaration>(0);
    expect(node.type()).toBe("float");
    expect(node.name()).toBe("myVar");
  });

  it("should parse a variable definition - `int myVar = 1;`", () => {
    const parser = new Parser([
      tint(),
      tid("myVar"),
      tok(TokenType.EQUAL, "="),
      tintlit("1"),
      sc(),
      eof(),
    ]);

    const program = parser.parse();
    const node = program.at<AST.VariableDefinition>(0);
    expect(node.type()).toBe("int");
    expect(node.name()).toBe("myVar");

    const expr = node.expr<AST.Literal<number>>();
    expect(expr.unfold()).toEqual(1);
  });
});

describe("conditionals", () => {
  it("if(1) { int myVar = 1; }", () => {
    const parser = new Parser([
      tif(),
      tparenleft(),
      tintlit("1"),
      tparenright(),
      tbraceleft(),
      // Content
      tint(),
      tid("myVar"),
      tok(TokenType.EQUAL, "="),
      tintlit("1"),
      sc(),
      // End Content,
      tbraceright(),
    ]);

    const program = parser.parse();
    const node = program.at<AST.Conditional>(0);

    const expr = node.expr<AST.Literal<number>>();
    expect(expr.unfold()).toEqual(1);

    const ifBranch = node.ifBranch();
    expect(ifBranch).toBeInstanceOf(AST.Block);
    expect(ifBranch.length()).toBe(1);

    const stmt = ifBranch.at<AST.VariableDefinition>(0);
    expect(stmt.type()).toBe("int");
    expect(stmt.name()).toBe("myVar");

    const stmtExpr = stmt.expr<AST.Literal<number>>();
    expect(stmtExpr.unfold()).toEqual(1);

    const elseBranch = node.elseBranch();
    expect(elseBranch).toBe(null);
  });

  it("if(1) { int myVar = 1; } else { int myVar2 = 2; }", () => {
    const parser = new Parser([
      tif(),
      tparenleft(),
      tintlit("1"),
      tparenright(),
      tbraceleft(),
      // Content
      tint(),
      tid("myVar"),
      tok(TokenType.EQUAL, "="),
      tintlit("1"),
      sc(),
      // End Content,
      tbraceright(),
      telse(),
      tbraceleft(),
      // Content
      tint(),
      tid("myVar2"),
      tok(TokenType.EQUAL, "="),
      tintlit("2"),
      sc(),
      // End Content,
      tbraceright(),
    ]);

    const program = parser.parse();
    const node = program.at<AST.Conditional>(0);

    const expr = node.expr<AST.Literal<number>>();
    expect(expr.unfold()).toEqual(1);

    const ifBranch = node.ifBranch();
    expect(ifBranch).toBeInstanceOf(AST.Block);
    expect(ifBranch.length()).toBe(1);

    const stmt = ifBranch.at<AST.VariableDefinition>(0);
    expect(stmt.type()).toBe("int");
    expect(stmt.name()).toBe("myVar");

    const stmtExpr = node.expr<AST.Literal<number>>();
    expect(stmtExpr.unfold()).toEqual(1);

    const elseBranch = node.elseBranch() as AST.Block;
    expect(elseBranch).toBeInstanceOf(AST.Block);
    expect(elseBranch.length()).toBe(1);

    const stmt2 = elseBranch.at<AST.VariableDefinition>(0);
    expect(stmt2.type()).toBe("int");
    expect(stmt2.name()).toBe("myVar2");

    const stmtExpr2 = stmt2.expr<AST.Literal<number>>();
    expect(stmtExpr2.unfold()).toEqual(2);
  });

  it("if(1) { int myVar = 1; } else if (2) { int myVar2 = 2; }", () => {
    const parser = new Parser([
      tif(),
      tparenleft(),
      tintlit("1"),
      tparenright(),
      tbraceleft(),
      // Content
      tint(),
      tid("myVar"),
      tok(TokenType.EQUAL, "="),
      tintlit("1"),
      sc(),
      // End Content,
      tbraceright(),
      telse(),
      tif(),
      tparenleft(),
      tintlit("2"),
      tparenright(),
      tbraceleft(),
      // Content
      tint(),
      tid("myVar2"),
      tok(TokenType.EQUAL, "="),
      tintlit("2"),
      sc(),
      // End Content,
      tbraceright(),
    ]);

    const program = parser.parse();
    const node = program.at<AST.Conditional>(0);

    const expr = node.expr<AST.Literal<number>>();
    expect(expr.unfold()).toEqual(1);

    const ifBranch = node.ifBranch();
    expect(ifBranch).toBeInstanceOf(AST.Block);
    expect(ifBranch.length()).toBe(1);

    const stmt = ifBranch.at<AST.VariableDefinition>(0);
    expect(stmt.type()).toBe("int");
    expect(stmt.name()).toBe("myVar");

    const stmtExpr = node.expr<AST.Literal<number>>();
    expect(stmtExpr.unfold()).toEqual(1);

    const elseBranch = node.elseBranch() as AST.Conditional;
    expect(elseBranch).toBeInstanceOf(AST.Conditional);
    expect(elseBranch.expr<AST.Literal<number>>().unfold()).toBe(2);

    const stmt2 = elseBranch.ifBranch().at<AST.VariableDefinition>(0);
    expect(stmt2.type()).toBe("int");
    expect(stmt2.name()).toBe("myVar2");

    const stmtExpr2 = stmt2.expr<AST.Literal<number>>();
    expect(stmtExpr2.unfold()).toEqual(2);

    expect(elseBranch.elseBranch()).toBe(null);
  });
});
describe("integration with scanner", () => {
  it("should parse a small expression", () => {
    const tokens = new Scanner("1 * (2 + 3) / 4 - 5;").build();
    const program = new Parser(tokens).parse();

    // console.log(program.toString());
  });
});
