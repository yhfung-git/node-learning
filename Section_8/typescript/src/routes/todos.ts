import { Router, Request, Response } from "express";

import { Todo } from "../models/todo";

let todos: Todo[] = [];

interface ResponseData {
  message?: string;
  todo?: Todo;
  todos?: Todo[];
}
type CustomResponse = Response<ResponseData>;
type CustomRequest = Request<{ todoId: string }, any, { text: string }, any>;

const router = Router();

router.get("/", (req, res: CustomResponse, next) => {
  try {
    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/todo", async (req: CustomRequest, res: CustomResponse, next) => {
  try {
    const newTodo: Todo = {
      _id: new Date().toISOString(),
      text: req.body.text,
    };

    todos.push(newTodo);
    res.status(201).json({ message: "New todo added", todo: newTodo });
  } catch (error) {
    console.error("Error adding new todo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/todo/:todoId",
  async (req: CustomRequest, res: CustomResponse, next) => {
    try {
      const { todoId } = req.params;
      const todoIndex = todos.findIndex((todoItem) => todoItem._id === todoId);

      if (todoIndex === -1) {
        return res.status(404).json({ message: "Todo item not found" });
      }

      const updatedTodo: Todo = {
        _id: todos[todoIndex]._id,
        text: req.body.text,
      };

      todos[todoIndex] = updatedTodo;
      res.status(200).json({ message: "Todo updated", todo: updatedTodo });
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.delete(
  "/todo/:todoId",
  async (req: CustomRequest, res: CustomResponse, next) => {
    try {
      const { todoId } = req.params;
      const todoIndex = todos.findIndex((todoItem) => todoItem._id === todoId);

      if (todoIndex === -1) {
        return res.status(404).json({ message: "Todo item not found" });
      }

      todos = todos.filter((todoItem) => todoItem._id !== todoId);
      res.status(200).json({ message: "Todo item deleted", todos });
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
