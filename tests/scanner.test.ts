import { Token, TokenType } from "./../src/scanner/token";
import { Scanner } from "../src/scanner/scanner";

describe("symbols", () => {
  it("should parse symbols", () => {
    const source = `(){};---=-+++=+/=/*=* < <= > >= ! != = ==`;
    const scanner = new Scanner(source);
    const tokens = scanner.build();

    const expectedTokens = [
      new Token(TokenType.PAREN_LEFT, 0, 0, 1, "("),
      new Token(TokenType.PAREN_RIGHT, 0, 1, 1, ")"),
      new Token(TokenType.BRACE_LEFT, 0, 2, 1, "{"),
      new Token(TokenType.BRACE_RIGHT, 0, 3, 1, "}"),
      new Token(TokenType.SEMICOLON, 0, 4, 1, ";"),
      new Token(TokenType.MINUS_MINUS, 0, 5, 2, "--"),
      new Token(TokenType.MINUS_EQUAL, 0, 7, 2, "-="),
      new Token(TokenType.MINUS, 0, 9, 1, "-"),
      new Token(TokenType.PLUS_PLUS, 0, 10, 2, "++"),
      new Token(TokenType.PLUS_EQUAL, 0, 12, 2, "+="),
      new Token(TokenType.PLUS, 0, 14, 1, "+"),
      new Token(TokenType.SLASH_EQUAL, 0, 15, 2, "/="),
      new Token(TokenType.SLASH, 0, 17, 1, "/"),
      new Token(TokenType.STAR_EQUAL, 0, 18, 2, "*="),
      new Token(TokenType.STAR, 0, 20, 1, "*"),
      new Token(TokenType.LOWER, 0, 22, 1, "<"),
      new Token(TokenType.LOWER_EQUAL, 0, 24, 2, "<="),
      new Token(TokenType.GREATER, 0, 27, 1, ">"),
      new Token(TokenType.GREATER_EQUAL, 0, 29, 2, ">="),
      new Token(TokenType.BANG, 0, 32, 1, "!"),
      new Token(TokenType.BANG_EQUAL, 0, 34, 2, "!="),
      new Token(TokenType.EQUAL, 0, 37, 1, "="),
      new Token(TokenType.EQUAL_EQUAL, 0, 39, 2, "=="),
      new Token(TokenType.EOF, 0, 41, 0, ""),
    ];

    expect(tokens).toMatchObject(expectedTokens);
  });
  it("should parse logical ops", () => {
    const source = `&& ||`;
    const scanner = new Scanner(source);
    const tokens = scanner.build();

    const expectedTokens = [
      new Token(TokenType.AND, 0, 0, 2, "&&"),
      new Token(TokenType.OR, 0, 3, 2, "||"),
      new Token(TokenType.EOF, 0, 5, 0, ""),
    ];

    expect(tokens).toMatchObject(expectedTokens);
  });

  it("should parse numbers literals", () => {
    const source = `123456789 123.456789`;
    const scanner = new Scanner(source);
    const tokens = scanner.build();

    const expectedTokens = [
      new Token(TokenType.INTEGER_LITERAL, 0, 0, 9, "123456789"),
      new Token(TokenType.FLOAT_LITERAL, 0, 10, 10, "123.456789"),
      new Token(TokenType.EOF, 0, 20, 0, ""),
    ];

    expect(tokens).toMatchObject(expectedTokens);
  });
  it("should parse string literals", () => {
    const source = `"Hello world!"`;
    const scanner = new Scanner(source);
    const tokens = scanner.build();

    const expectedTokens = [
      new Token(TokenType.STRING_LITERAL, 0, 0, 14, "Hello world!"),
      new Token(TokenType.EOF, 0, 14, 0, ""),
    ];

    expect(tokens).toMatchObject(expectedTokens);
  });
  it("should parse keywords", () => {
    const source = `int const break continue while do if else return for float this_is_an_identifier`;
    const scanner = new Scanner(source);
    const tokens = scanner.build();

    const expectedTokens = [
      new Token(TokenType.INT, 0, 0, 3, "int"),
      new Token(TokenType.CONST, 0, 4, 5, "const"),
      new Token(TokenType.BREAK, 0, 10, 5, "break"),
      new Token(TokenType.CONTINUE, 0, 16, 8, "continue"),
      new Token(TokenType.WHILE, 0, 25, 5, "while"),
      new Token(TokenType.DO, 0, 31, 2, "do"),
      new Token(TokenType.IF, 0, 34, 2, "if"),
      new Token(TokenType.ELSE, 0, 37, 4, "else"),
      new Token(TokenType.RETURN, 0, 42, 6, "return"),
      new Token(TokenType.FOR, 0, 49, 3, "for"),
      new Token(TokenType.FLOAT, 0, 53, 5, "float"),
      new Token(TokenType.IDENTIFIER, 0, 59, 21, "this_is_an_identifier"),
      new Token(TokenType.EOF, 0, 80, 0, ""),
    ];

    expect(tokens).toMatchObject(expectedTokens);
  });
});
