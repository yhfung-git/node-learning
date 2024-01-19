import { RouterContext } from "https://deno.land/x/oak@v12.6.2/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import Todo from "../models/todo.ts";
import { getDb } from "../helpers/db_client.ts";

const index = async (ctx: RouterContext<string>) => {
  const { response } = ctx;

  try {
    const todos = await getDb().collection("todos").find().toArray();
    const transformedTodos = todos.map(
      (todo: { _id: ObjectId; text: string }) => {
        return { _id: todo._id.toString(), text: todo.text };
      }
    );

    response.status = 200;
    response.body = { todos: transformedTodos };
  } catch (error) {
    console.error("Error fetching todos:", error);
    response.status = 500;
    response.body = { error: "Internal Server Error" };
  }
};

const create = async (ctx: RouterContext<string>) => {
  const { request, response } = ctx;

  try {
    const data = await request.body().value;

    const newTodo: Todo = { text: data.text };

    const id = await getDb().collection("todos").insertOne(newTodo);
    newTodo._id = id.toString();

    response.status = 201;
    response.body = { message: "Todo item created!", todo: newTodo };
  } catch (error) {
    console.error("Error creating todos:", error);
    response.status = 500;
    response.body = { error: "Internal Server Error" };
  }
};

const update = async (ctx: RouterContext<string>) => {
  const { request, response, params } = ctx;

  try {
    const todoId = params.todoId;
    const data = await request.body().value;
    const todosDb = getDb().collection("todos");

    const todo = await todosDb.findOne({ _id: new ObjectId(todoId) });
    if (!todo) {
      response.status = 404;
      response.body = { message: "Todo item not found!" };
      return;
    }

    const updatedTodo: Todo = { text: data.text };
    await todosDb.updateOne({ _id: todo._id }, { $set: updatedTodo });

    response.status = 200;
    response.body = { message: "Todo item updated!", todo: updatedTodo };
  } catch (error) {
    console.error("Error updating todos:", error);
    response.status = 500;
    response.body = { error: "Internal Server Error" };
  }
};

const destroy = async (ctx: RouterContext<string>) => {
  const { response, params } = ctx;

  try {
    const todoId = params.todoId;
    const todosDb = getDb().collection("todos");

    const todo = await todosDb.findOne({ _id: new ObjectId(todoId) });
    if (!todo) {
      response.status = 404;
      response.body = { message: "Todo item not found!" };
      return;
    }

    await todosDb.deleteOne({ _id: todo._id });

    response.status = 200;
    response.body = { message: "Todo item deleted!" };
  } catch (error) {
    console.error("Error deleting todos:", error);
    response.status = 500;
    response.body = { error: "Internal Server Error" };
  }
};

export default { index, create, update, destroy };
