export enum TokenType {
  INT = "int",
  CONST = "const",
  BREAK = "break",
  CONTINUE = "continue",
  WHILE = "while",
  DO = "do",
  IF = "if",
  ELSE = "else",
  RETURN = "return",
  FOR = "for",

  // Single Character Tokens
  BRACE_LEFT = "brace_left",
  BRACE_RIGHT = "brace_right",
  PAREN_LEFT = "paren_left",
  PAREN_RIGHT = "paren_right",
  SEMICOLON = "semicolon",

  // Binary Ops
  PLUS = "plus",
  MINUS = "minus",
  STAR = "star",
  SLASH = "slash",
  MODULO = "modulo",

  // Comparisons
  LOWER = "lower",
  LOWER_EQUAL = "lower_equal",
  GREATER = "greater",
  GREATER_EQUAL = "greater_equal",
  EQUAL_EQUAL = "equal_equal",
  BANG_EQUAL = "bang_equal",
  EQUAL = "equal",
  BANG = "bang",

  // Unary Ops
  PLUS_EQUAL = "plus_equal",
  MINUS_EQUAL = "minus_equal",
  STAR_EQUAL = "star_equal",
  SLASH_EQUAL = "slash_equal",
  MODULO_EQUAL = "modulo_equal",
  PLUS_PLUS = "plus_plus",
  MINUS_MINUS = "minus_minus",

  // Literals
  STRING_LITERAL = "string_literal",
  INTEGER_LITERAL = "integer_literal",
  FLOAT_LITERAL = "float_literal",
  IDENTIFIER = "identifier",

  EOF = "end_of_file",
}

export const Keywords = [
  TokenType.INT,
  TokenType.CONST,
  TokenType.BREAK,
  TokenType.CONTINUE,
  TokenType.WHILE,
  TokenType.DO,
  TokenType.IF,
  TokenType.ELSE,
  TokenType.RETURN,
  TokenType.FOR,
];

export class Token {
  constructor(
    public type: TokenType,
    public line: number,
    public start: number,
    public length: number,
    public lexeme: string
  ) {}
}
