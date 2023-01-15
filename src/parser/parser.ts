import { AST } from "../ast/ast";
import { Token, TokenType } from "../scanner/token";

export class Parser {
  private cursor: number = 0;

  constructor(private tokens: Token[]) {}

  parse(): AST.Program {
    const nodes = [];
    while (this.isEOF() === false) {
      nodes.push(this.statement());
    }

    return new AST.Program(nodes);
  }

  statement(): AST.Statement {
    if (this.match(TokenType.INT, TokenType.FLOAT)) {
      return this.variableDeclarationOrDefinition();
    } else if (this.match(TokenType.IF)) {
      return this.conditional();
    } else if (this.match(TokenType.WHILE)) {
      return this.whileLoop();
    } else if (this.check(TokenType.IDENTIFIER)) {
      if (
        this.checkAt(
          1,
          TokenType.EQUAL,
          TokenType.PLUS_EQUAL,
          TokenType.MINUS_EQUAL,
          TokenType.STAR_EQUAL,
          TokenType.SLASH_EQUAL,
          TokenType.MODULO_EQUAL
        )
      ) {
        this.match(TokenType.IDENTIFIER);
        return this.assignment();
      }
    }

    return this.expressionStatement();
  }

  variableDeclarationOrDefinition() {
    const type = this.previous();
    const name = this.consume(TokenType.IDENTIFIER);

    if (this.match(TokenType.EQUAL)) {
      const expr = this.expression();
      this.consume(TokenType.SEMICOLON);
      return new AST.VariableDefinition(type!.lexeme, name!.lexeme, expr);
    }

    this.consume(TokenType.SEMICOLON);
    return new AST.VariableDeclaration(type!.lexeme, name!.lexeme);
  }

  conditional(): AST.Conditional {
    this.consume(TokenType.PAREN_LEFT);
    const expr = this.expression();
    this.consume(TokenType.PAREN_RIGHT);
    this.consume(TokenType.BRACE_LEFT);

    const statements: AST.Statement[] = [];
    while (!this.match(TokenType.BRACE_RIGHT)) {
      statements.push(this.statement());
    }

    if (this.previous().type !== TokenType.BRACE_RIGHT) {
      this.reportError("Expected '}' at the end of conditional.");
    }

    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      if (this.match(TokenType.IF)) {
        elseBranch = this.conditional();
      } else {
        this.consume(TokenType.BRACE_LEFT);

        const statements = [];
        while (!this.match(TokenType.BRACE_RIGHT)) {
          statements.push(this.statement());
        }

        elseBranch = new AST.Block(statements);
      }
    }

    return new AST.Conditional(expr, new AST.Block(statements), elseBranch);
  }

  whileLoop(): AST.WhileLoop {
    this.consume(TokenType.PAREN_LEFT);
    const expr = this.expression();
    this.consume(TokenType.PAREN_RIGHT);
    this.consume(TokenType.BRACE_LEFT);

    const statements: AST.Statement[] = [];
    while (!this.match(TokenType.BRACE_RIGHT)) {
      statements.push(this.statement());
    }

    if (this.previous().type !== TokenType.BRACE_RIGHT) {
      this.reportError("Expected '}' at the end of conditional.");
    }

    return new AST.WhileLoop(expr, new AST.Block(statements));
  }

  assignment() {
    const identifier = this.previous();
    this.match(
      TokenType.EQUAL,
      TokenType.PLUS_EQUAL,
      TokenType.MINUS_EQUAL,
      TokenType.STAR_EQUAL,
      TokenType.SLASH_EQUAL,
      TokenType.MODULO_EQUAL
    );

    const type: AST.AssignmentType = this.previous().type as AST.AssignmentType;
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON);

    return new AST.VariableAssignment(identifier!.lexeme, type, expr);
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
        const identifier = AST.IdentifierValue.fromToken(previous);
        if (this.match(TokenType.PLUS_PLUS, TokenType.MINUS_MINUS)) {
          const type = this.previous().type;
          return new AST.PostfixIncrement(
            identifier,
            AST.tokenToPostfixIncrement(type)
          );
        }

        return identifier;
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
    if (this.check(...types)) {
      this.advance();
      return true;
    }
  }

  private consume(token: TokenType, message?: string) {
    if (this.lookahead().type === token) {
      return this.advance();
    }

    this.reportError(message ?? "Expected token " + token + ".");
  }

  private check(...types: TokenType[]) {
    return this.checkAt(0, ...types);
  }

  private checkAt(at: number, ...types: TokenType[]) {
    if (this.isEOF()) {
      return false;
    }

    for (let type of types) {
      if (this.lookahead(at).type === type) {
        return true;
      }
    }

    return false;
  }

  private lookahead(at = 0) {
    return this.tokens[this.cursor + at];
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
