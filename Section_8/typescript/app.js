"use strict";
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const buttonElement = document.querySelector("button");
const add = (num1, num2) => {
  if (typeof num1 === "number" && typeof num2 === "number") {
    return num1 + num2;
  } else if (typeof num1 === "string" && typeof num2 === "string") {
    return `${num1} --- ${num2}`;
  }
  return +num1 + +num2;
};
buttonElement === null || buttonElement === void 0
  ? void 0
  : buttonElement.addEventListener("click", () => {
      const num1 = num1Element.value;
      const num2 = num2Element.value;
      const sum = add(+num1, +num2);
      const string = add(num1, num2);
      console.log(sum);
      console.log(string);
    });
