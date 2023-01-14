import { Scanner } from "./scanner/scanner";

function main() {
  const sampleProgram = `
  int square(int a) {
    return a * a;
  }
  
  const int a = 0;
  int b = 1 + a; // 1
  int c = 2 * a; // 2
  int d = 10 / a; // 5
  int e = 29 % d; // 4
  
  for (int i = 0; i < 5; i++) {
    int a = 10;
    printf("the new value is %d", i);
  }

  while(1) {
    break;
    continue;
  }

  do {

  } while (1);
  
  int j = 5;
  if (j < 1) {
    printf("j is below 1");
  } else if (j <= 2) {
    printf("j is below or equal to 2");
  } else if (j == 3) {
    printf("j is equal to 3")
  } else if (j > 4) {
    printf("j is over 4");
  } else if (j >= 5) {
    printf("j is over or greater than 5");
  } else if (j != 6) {
    printf("j is not equal to 6");
  }
  } else {
    printf("we don't know what j is")
  }
  
  printf("square is %d", square(a + b + c + d * e));
  `;

  const scanner = new Scanner(sampleProgram);
  const tokens = scanner.build();
  console.log(tokens);
}

main();
