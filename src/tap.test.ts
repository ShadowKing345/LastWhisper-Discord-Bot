import tap from "tap";

function myAwesomeFunction(x: number): string {
  if(x % 2 === 0) {
    return "even";
  } else if(x % 2 === 1) {
    return "odd";
  } else if(x > 100) {
    return "big";
  } else if(x < 0) {
    return "negative";
  }

  throw new Error();
}

tap.pass("Hello World");

tap.equal(myAwesomeFunction(1), "odd");
tap.equal(myAwesomeFunction(2), "even");
tap.equal(myAwesomeFunction(200), "big");
tap.equal(myAwesomeFunction(-10), "negative");