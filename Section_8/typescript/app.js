"use strict";
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const buttonElement = document.querySelector("button");
const numResults = [];
const textResults = [];
const add = (num1, num2) => typeof num1 === "string" && typeof num2 === "string"
    ? `${num1} + ${num2}`
    : +num1 + +num2;
const printResult = (resultObj) => {
    console.log(resultObj);
    console.log(resultObj.value);
    console.log(resultObj.timestamp);
};
buttonElement === null || buttonElement === void 0 ? void 0 : buttonElement.addEventListener("click", () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const sum = add(+num1, +num2);
    const string = add(num1, num2);
    numResults.push(sum);
    textResults.push(string);
    printResult({ value: sum, timestamp: new Date() });
    console.log(numResults, textResults);
});
