import { AST } from "../ast/ast";
import { Token, TokenType } from "../scanner/token";

export class Parser {
  private cursor: number = 0;

  constructor(private tokens: Token[]) {}

  parse(): AST.Program {
    const next = this.expressionStatement();
    return new AST.Program([next]);
  }

  expressionStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON);
    return expr;
  }

  // #####################
  // ###  EXPRESSIONS  ###
  // #####################

  expression() {
    return this.or();
  }

  or() {
    let expr: AST.Expression = this.and();

    while (this.match(TokenType.OR)) {
      const operator = AST.tokenToBinOp(this.previous().type);
      const right = this.and();
      expr = new AST.BinaryExpression(expr, right, operator);
    }
    return expr;
  }

  and() {
    let expr: AST.Expression = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = AST.tokenToBinOp(this.previous().type);
      const right = this.equality();
      expr = new AST.BinaryExpression(expr, right, operator);
    }
    return expr;
  }

  equality() {
    let expr: AST.Expression = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = AST.tokenToBinOp(this.previous().type);
      const right = this.comparison();
      expr = new AST.BinaryExpression(expr, right, operator);
    }
    return expr;
  }

  comparison() {
    let expr: AST.Expression = this.term();

    while (
      this.match(
        TokenType.LOWER,
        TokenType.LOWER_EQUAL,
        TokenType.GREATER,
        TokenType.GREATER_EQUAL
      )
    ) {
      const operator = AST.tokenToBinOp(this.previous().type);
      const right = this.term();
      expr = new AST.BinaryExpression(expr, right, operator);
    }
    return expr;
  }

  term() {
    let expr: AST.Expression = this.factor();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = AST.tokenToBinOp(this.previous().type);
      const right = this.factor();
      expr = new AST.BinaryExpression(expr, right, operator);
    }
    return expr;
  }

  factor() {
    let expr: AST.Expression = this.prefixUnary();
    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator = AST.tokenToBinOp(this.previous().type);
      const right = this.prefixUnary();
      expr = new AST.BinaryExpression(expr, right, operator);
    }

    return expr;
  }

  prefixUnary() {
    if (
      this.match(
        TokenType.BANG,
        TokenType.MINUS,
        TokenType.PLUS_PLUS,
        TokenType.MINUS_MINUS
      )
    ) {
      const type = this.previous().type;
      const expr = new AST.PrefixExpression(
        this.grouping(),
        AST.tokenToPrefixOp(type)
      );
      return expr;
    }

    return this.grouping();
  }

  grouping() {
    if (this.match(TokenType.PAREN_LEFT)) {
      const expr = this.expression();
      this.consume(TokenType.PAREN_RIGHT);

      const grouping = new AST.Grouping(expr);
      return grouping;
    }

    return this.literal();
  }

  literal(): AST.Literal<any> {
    this.match(
      TokenType.INTEGER_LITERAL,
      TokenType.FLOAT_LITERAL,
      TokenType.STRING_LITERAL,
      TokenType.IDENTIFIER
    );

    const previous = this.previous();
    switch (previous.type) {
      case TokenType.INTEGER_LITERAL: {
        return AST.IntValue.fromToken(previous);
      }
      case TokenType.FLOAT_LITERAL: {
        return AST.FloatValue.fromToken(previous);
      }
      case TokenType.STRING_LITERAL: {
        return AST.StringValue.fromToken(previous);
      }
      case TokenType.IDENTIFIER: {
        return AST.IdentifierValue.fromToken(previous);
      }
      default: {
        throw new Error("Unreachable.");
      }
    }
  }

  // Utils
  private synchronize() {
    // TODO : drop all the parsed tokens until we reach a semicolon and restart
  }

  private reportError(message: string) {
    throw new Error(message);
  }

  private advance() {
    const token = this.tokens[this.cursor];
    this.cursor++;
    return token;
  }

  private match(...types: TokenType[]) {
    for (let type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
  }

  private consume(token: TokenType, message?: string) {
    if (this.lookahead().type === token) {
      this.advance();
      return;
    }

    this.reportError(message ?? "Expected token " + token + ".");
  }

  private check(type: TokenType) {
    if (this.isEOF()) {
      return false;
    }

    return this.lookahead().type === type;
  }

  private lookahead() {
    return this.tokens[this.cursor];
  }

  private isEOF() {
    if (this.cursor >= this.tokens.length) {
      return true;
    }

    return this.tokens[this.cursor].type === TokenType.EOF;
  }

  private previous() {
    return this.tokens[this.cursor - 1];
  }
}
