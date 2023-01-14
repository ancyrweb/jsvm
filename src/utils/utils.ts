export class Utils {
  static isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  static isDigit(c: string) {
    return c >= "0" && c <= "9";
  }
}
