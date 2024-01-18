import { RouterContext } from "https://deno.land/x/oak@v12.6.2/mod.ts";

import Todo from "../models/todo.ts";

let todos: Todo[] = [];

const index = (ctx: RouterContext<string>) => {
  const { response } = ctx;
  response.status = 200;
  response.body = { todos };
};

const create = async (ctx: RouterContext<string>) => {
  const { request, response } = ctx;
  const data = await request.body().value;

  const newTodo: Todo = {
    _id: Date.now().toString(),
    text: data.text,
  };

  todos.push(newTodo);
  response.status = 201;
  response.body = { message: "Todo item created!", todo: newTodo };
};

const update = async (ctx: RouterContext<string>) => {
  const { request, response, params } = ctx;
  const todoId = params.todoId;
  const data = await request.body().value;

  const todoIndex = todos.findIndex((todoItem) => todoItem._id === todoId);
  if (todoIndex === -1) {
    response.status = 404;
    response.body = { message: "Todo item not found!" };
    return;
  }

  const updatedTodo: Todo = {
    _id: todos[todoIndex]._id,
    text: data.text,
  };

  todos[todoIndex] = updatedTodo;
  response.status = 200;
  response.body = { message: "Todo item updated!", todo: updatedTodo };
};

const destroy = (ctx: RouterContext<string>) => {
  const { response, params } = ctx;
  const todoId = params.todoId;

  const todoIndex = todos.findIndex((todoItem) => todoItem._id === todoId);
  if (todoIndex === -1) {
    response.status = 404;
    response.body = { message: "Todo item not found!" };
    return;
  }

  todos = todos.filter((todoItem) => todoItem._id !== todoId);

  response.status = 200;
  response.body = { message: "Todo item deleted!", todos };
};

export default { index, create, update, destroy };
