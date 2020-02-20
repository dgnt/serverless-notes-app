import { calculateCost } from "../libs/billing-lib";

test("Lowest tier", () => {
  const storage = 10;

  const expectedCost = 4000;

  expect(expectedCost).toEqual(calculateCost(storage));
});

test("Middle tier", () => {
  const storage = 100;

  const expectedCost = 20000;

  expect(expectedCost).toEqual(calculateCost(storage));
});

test("Highest tier", () => {
  const storage = 101;

  const expectedCost = 10100;

  expect(expectedCost).toEqual(calculateCost(storage));
});