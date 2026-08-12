# Algo

The very classical Fizz Buzz.


Display numbers between **1** and **N** by following the rules:

- if number can be divided by 3: display **Fizz** ;
- if number can be divided by 5: display **Buzz** ;
- if number can be divided by 3 **AND** 5 : display **FizzBuzz** ;
- else: display the number.

## Usage

```bash
npm test

# npm start -- [from] <to>
npm start -- 20
npm start -- 10 20
```

If no argument is provided, the CLI prints the sequence from 1 to 100.

## Implementation choices

### Code clarity

The goal is to keep the business rules from the exercice readable and explicit.

For example, we keep the separate divisibility checks for 3 and 5 instead of collapsing the logic into a `% 15` shortcut.

Named booleans in the conditions help convey the intent directly, as advised by Clean Code practice.

### Scalability for N

The algorithm time complexity is O(N) over the requested range because each number must be processed once.

The memory complexity is O(N) over the requested range because the implementation stores the produced values in an array.

My interpretation of "Scalability of the algorithm" is the ability to compute values for large numbers or large intervals without depending on the full sequence from 1.

The `from` parameter allows the caller to evaluate any sub-range directly.

For example, computing FizzBuzz at 1 billion does not require recomputing the sequence from 1 first.

This also lets the caller process large intervals by chunks when needed.


