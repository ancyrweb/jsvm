import { TokenType } from "./../src/scanner/token";
import { Parser } from "../src/parser/parser";
import { Token } from "../src/scanner/token";

describe("parser", () => {
  it("should parse the expression", () => {
    const parser = new Parser([new Token(TokenType.EOF, 0, 0, 0, "")]);
    const tree = parser.parse();
    expect(tree).not.toBe(null);
  });
});
