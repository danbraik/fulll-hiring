export function fizzbuzz({ from = 1, to }) {
  if (!Number.isInteger(from) || from < 1) {
    throw new TypeError("'from' must be a positive integer");
  }

  if (!Number.isInteger(to) || to < 1) {
    throw new TypeError("'to' must be a positive integer");
  }

  if (from > to) {
    throw new RangeError("'from' must be less than or equal to 'to'");
  }

  const result = [];

  for (let i = from; i <= to; i++) {
    const isDivisibleByThree = i % 3 === 0;
    const isDivisibleByFive = i % 5 === 0;

    if (isDivisibleByThree && isDivisibleByFive) {
      result.push("FizzBuzz");
    } else if (isDivisibleByThree) {
      result.push("Fizz");
    } else if (isDivisibleByFive) {
      result.push("Buzz");
    } else {
      result.push(String(i));
    }
  }

  return result;
}
