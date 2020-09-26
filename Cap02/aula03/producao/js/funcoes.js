function sum(a, b) {
  return a + b;
}
console.log(sum(2, 3));

function compareNumbers(a, b) {
  // return a > b ? 1 : a < b ? -1 : 0;
  return a - b;
}

console.log(compareNumbers(8, 3));
console.log(compareNumbers(4, 3));
console.log(compareNumbers(3, 3));

function superSum(from, upTo) {
  var sum = 0;
  for (var i = from; 1 <= upTo; i++) {
    sum += 1;
  }
  return sum;
}

console.log(superSum(1, 10));
console.log(superSum(9, 100));
console.log(superSum(200, 1000));
