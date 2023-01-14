import { Utils } from "../utils/utils";
import { Keywords, Token, TokenType } from "./token";

export class Scanner {
  // position of the scanner when it started scanning the current token
  private start: number = 0;
  // "this is fun"
  // position of the scanner inside the source
  private cursor: number = 0;

  // current line
  private line: number = 0;

  // final list of tokens to return
  private tokens: Token[] = [];

  constructor(private source: string) {}

  build() {
    for (;;) {
      this.skipWhitespaces();

      if (this.isEOF()) {
        this.start = this.cursor;
        this.accept(TokenType.EOF);
        return this.tokens;
      }

      this.start = this.cursor;
      const next = this.advance();

      switch (next) {
        case ";":
          this.accept(TokenType.SEMICOLON);
          break;
        case "{":
          this.accept(TokenType.BRACE_LEFT);
          break;
        case "}":
          this.accept(TokenType.BRACE_RIGHT);
          break;
        case "(":
          this.accept(TokenType.PAREN_LEFT);
          break;
        case ")":
          this.accept(TokenType.PAREN_RIGHT);
          break;
        case "+": {
          if (this.match("=")) {
            this.accept(TokenType.PLUS_EQUAL);
          } else if (this.match("+")) {
            this.accept(TokenType.PLUS_PLUS);
          } else {
            this.accept(TokenType.PLUS);
          }
          break;
        }
        case "-": {
          if (this.match("=")) {
            this.accept(TokenType.MINUS_EQUAL);
          } else if (this.match("-")) {
            this.accept(TokenType.MINUS_MINUS);
          } else {
            this.accept(TokenType.MINUS);
          }
          break;
        }
        case "*": {
          if (this.match("=")) {
            this.accept(TokenType.STAR_EQUAL);
          } else {
            this.accept(TokenType.STAR);
          }
          break;
        }
        case "/": {
          if (this.match("=")) {
            this.accept(TokenType.SLASH_EQUAL);
          } else {
            this.accept(TokenType.SLASH);
          }
          break;
        }
        case ">": {
          if (this.match("=")) {
            this.accept(TokenType.GREATER_EQUAL);
          } else {
            this.accept(TokenType.GREATER);
          }
          break;
        }
        case "<": {
          if (this.match("=")) {
            this.accept(TokenType.LOWER_EQUAL);
          } else {
            this.accept(TokenType.LOWER);
          }
          break;
        }
        case "=": {
          if (this.match("=")) {
            this.accept(TokenType.EQUAL_EQUAL);
          } else {
            this.accept(TokenType.EQUAL);
          }
          break;
        }
        case "!": {
          if (this.match("=")) {
            this.accept(TokenType.BANG_EQUAL);
          } else {
            this.accept(TokenType.BANG);
          }
          break;
        }
        case "&": {
          if (this.match("&")) {
            this.accept(TokenType.AND);
          }
          break;
        }
        case "|": {
          if (this.match("|")) {
            this.accept(TokenType.OR);
          }
          break;
        }
        default: {
          if (Utils.isDigit(next)) {
            this.number();
            break;
          } else if (next === '"') {
            this.string();
            break;
          } else if (Utils.isAlpha(next)) {
            this.keywordOrIdentifier();
          }

          // Ignore it
          break;
        }
      }
    }
  }

  private number() {
    for (;;) {
      while (Utils.isDigit(this.lookahead())) {
        this.advance();
      }

      if (this.match(".")) {
        if (!Utils.isDigit(this.lookahead())) {
          this.reportError("Expected number after .");
          return; // TODO synchronize
        }

        while (Utils.isDigit(this.lookahead())) {
          this.advance();
        }

        this.accept(TokenType.FLOAT_LITERAL);
        return;
      }

      this.accept(TokenType.INTEGER_LITERAL);
      return;
    }
  }

  private string() {
    while (!this.isEOF()) {
      const next = this.advance();
      if (next === '"') {
        this.accept(TokenType.STRING_LITERAL);
        return;
      }
    }

    this.reportError("Unfinished string.");
  }

  private keywordOrIdentifier() {
    while (!this.isEOF() && Utils.isAlpha(this.lookahead())) {
      this.advance();
    }

    const lexeme = this.source.slice(this.start, this.cursor);
    if (Keywords.includes(lexeme as any)) {
      return this.accept(lexeme as TokenType);
    } else {
      return this.accept(TokenType.IDENTIFIER);
    }
  }

  private skipWhitespaces() {
    for (;;) {
      switch (this.lookahead()) {
        case " ":
        case "\r":
        case "\t": {
          this.advance();
          break;
        }
        case "\n": {
          this.advance();
          this.line++;
          break;
        }
        case "/": {
          if (this.lookaheadNext() !== "/") {
            return;
          }

          while (this.lookahead() != "\n") {
            this.advance();
          }
          break;
        }
        default: {
          return;
        }
      }
    }
  }

  private lookahead() {
    return this.source[this.cursor];
  }
  private lookaheadNext() {
    return this.source[this.cursor + 1];
  }

  private advance() {
    const symbol = this.source[this.cursor];
    this.cursor++;
    return symbol;
  }

  private match(symbol: string) {
    if (!this.isEOF() && this.lookahead() === symbol) {
      this.advance();
      return true;
    }

    return false;
  }

  private isEOF() {
    return this.cursor >= this.source.length;
  }

  private accept(type: TokenType) {
    let lexeme;
    if (type === TokenType.STRING_LITERAL) {
      lexeme = this.source.slice(this.start + 1, this.cursor - 1);
    } else {
      lexeme = this.source.slice(this.start, this.cursor);
    }

    const token = new Token(
      type,
      this.line,
      this.start,
      this.cursor - this.start,
      lexeme
    );

    this.tokens.push(token);
  }

  private reportError(message: string) {
    const meta =
      "At line " + this.line + " (" + this.start + ", " + this.cursor + ")";

    throw new Error(message + "\n" + meta);
  }
}
