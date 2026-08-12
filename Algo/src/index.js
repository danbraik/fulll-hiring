import { fizzbuzz } from "./fizzbuzz.js";

const rawFrom = process.argv[3] === undefined ? "1" : process.argv[2];
const rawTo = process.argv[3] ?? process.argv[2] ?? "100";

const from = Number.parseInt(rawFrom, 10);
const to = Number.parseInt(rawTo, 10);

if (Number.isNaN(from) || Number.isNaN(to)) {
  console.error("Usage: npm start -- [from] <to>");
  process.exit(1);
}

for (const value of fizzbuzz({ from, to })) {
  console.log(value);
}
