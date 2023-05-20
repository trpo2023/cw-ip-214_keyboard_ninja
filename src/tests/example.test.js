function sum(a, b) {
  return a + b;
}

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
  test("adds 5 + 5 to equal 10", () => {
    expect(sum(5, 5)).toBe(10);
  });
});
