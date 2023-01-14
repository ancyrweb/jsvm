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
Literal -> IDENTIFIER | STRING_LITERAL | NUMBER_LITERAL | FLOAT_LITERAL

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

export abstract class ASTNode {}

export class Program {
  private nodes: ASTNode[];
  constructor(nodes?: ASTNode[]) {
    this.nodes = nodes || [];
  }
}
