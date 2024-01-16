"use strict";
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const buttonElement = document.querySelector("button");
const add = (num1, num2) => num1 + num2;
buttonElement === null || buttonElement === void 0 ? void 0 : buttonElement.addEventListener("click", () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const sum = add(+num1, +num2);
    console.log(sum);
});
