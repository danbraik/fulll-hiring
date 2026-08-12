import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";

import { fizzbuzz } from "../src/fizzbuzz.js";

test("returns the expected FizzBuzz sequence", () => {
  assert.deepEqual(fizzbuzz({ to: 15 }), [
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz"
  ]);
});

test("returns the expected FizzBuzz sequence", () => {
  assert.deepEqual(fizzbuzz({ from: 30, to: 30 }), [
    "FizzBuzz"
  ]);
});

test("supports a custom range", () => {
  assert.deepEqual(fizzbuzz({ from: 14, to: 16 }), ["14", "FizzBuzz", "16"]);
});

test("throws on invalid ranges", () => {
  assert.throws(() => fizzbuzz({ from: -1, to: 5 }), /'from' must be a positive integer/);
  assert.throws(() => fizzbuzz({ from: 0, to: 5 }), /'from' must be a positive integer/);
  assert.throws(() => fizzbuzz({ from: 1.5, to: 5 }), /'from' must be a positive integer/);
  assert.throws(() => fizzbuzz({ from: 1, to: 0 }), /'to' must be a positive integer/);
  assert.throws(() => fizzbuzz({ from: 1, to: 5.5 }), /'to' must be a positive integer/);
  assert.throws(() => fizzbuzz({ from: 5, to: 4 }), /'from' must be less than or equal to 'to'/);
});

test("processes the 1B to 1B range in less than 1 ms", () => {
  const start = performance.now();
  const result = fizzbuzz({ from: 1_000_000_000, to: 1_000_000_000 });
  const duration = performance.now() - start;

  assert.deepEqual(result, ["Buzz"]);
  assert.ok(duration < 1, `Expected duration < 1 ms, received ${duration} ms`);
});
