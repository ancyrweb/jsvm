# JSVM
A simple program to demonstrate and guess who to build a Virtual Machine that
reads byte codes.

The end-goal is to convert a program, convert it into bytecode and run.

## Demonstration Program
```
function square(int a) : int {
  return a * a;
}

int a = 0;
int b = 1 + a; // 1
int c = 2 * a; // 2
int d = 10 / a; // 5
int e = 29 % d; // 4

for (int i = 0; i < 5; i++) {
  print("the new value is " + i);
}

int j = 5;
if (j < 1) {
  print("j is below 1");
} else if (j <= 2) {
  print("j is below or equal to 2");
} else if (j == 3) {
  print("j is equal to 3")
} else if (j > 4) {
  print("j is over 4");
} else if (j >= 5) {
  print("j is over or greater than 5");
} else {
  print("we don't know what j is")
}

print(square(a + b + c + d * e));
```