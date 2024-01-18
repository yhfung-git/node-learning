const express = require("express");

const router = express.Router();

let todos = [];

router.get("/", (req, res, next) => {
  res.status(200).json({ todos });
});

router.post("/todos", (req, res, next) => {
  const newTodo = {
    _id: Date.now().toString(),
    text: req.body.text,
  };

  todos.push(newTodo);
  res.status(201).json({ message: "New todo item created!", todo: newTodo });
});

router.put("/todos/:todoId", (req, res, next) => {
  const { todoId } = req.params;

  const todoIndex = todos.findIndex((todoItem) => todoItem._id === todoId);
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo item not found!" });
  }

  const updatedTodo = {
    _id: todos[todoIndex]._id,
    text: req.body.text,
  };

  todos[todoIndex] = updatedTodo;
  res.status(200).json({ message: "Todo item updated!", todo: updatedTodo });
});

router.delete("/todos/:todoId", (req, res, next) => {
  const { todoId } = req.params;

  const todoIndex = todos.findIndex((todoItem) => todoItem._id === todoId);
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo item not found!" });
  }

  todos = todos.filter((todoItem) => todoItem._id !== todoId);
  res.status(200).json({ message: "Todo item deleted!", todos });
});

module.exports = router;
