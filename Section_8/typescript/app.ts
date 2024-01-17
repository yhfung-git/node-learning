const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button");

const numResults: number[] = [];
const textResults: string[] = [];

const add = (num1: number | string, num2: number | string): number | string => {
  if (typeof num1 === "number" && typeof num2 === "number") {
    return num1 + num2;
  } else if (typeof num1 === "string" && typeof num2 === "string") {
    return `${num1} + ${num2}`;
  }
  return +num1 + +num2;
};

const printResult = (resultObj: { value: number; timestamp: Date }) => {
  console.log(resultObj);
  console.log(resultObj.value);
  console.log(resultObj.timestamp);
};

buttonElement?.addEventListener("click", () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;

  const sum = add(+num1, +num2);
  const string = add(num1, num2);

  numResults.push(sum as number);
  textResults.push(string as string);

  printResult({ value: sum as number, timestamp: new Date() });

  console.log(numResults, textResults);
});
