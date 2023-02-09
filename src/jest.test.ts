function sum(a: number, b: number): number {
  return a + b;
}

function badSum(a: number, b: number): number {
  return a - b;
}

describe("Testing a sum function", () => {
  test("Testing if jest is working.", () => {
    expect(true).toBe(true);
  });

  test("Working sub", () => {
    const result = sum(1, 1);

    expect(result).toBe(2);
  });

  test("Is not wrong sum", () => {
    const result = sum(1, 1);

    expect(result).not.toBe(0);
  });

  test("Broken sum", () => {
    const result = badSum(1, 1);

    expect(result).not.toBe(2);
  });
});