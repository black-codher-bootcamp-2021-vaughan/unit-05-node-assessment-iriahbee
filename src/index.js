require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
const errorStatus = 501;
const notFoundStatus = 404;

//Read todos from todos.json into variable
let todos = require(__dirname + todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static("public"));
console.log(path.join(__dirname, "public"));

// GET /
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// GET /todos/
app.get("/todos", (_req, res) => {
  res.json(todos);
  return todos;
});

// GET /todos/:id
app.get("/todos/:id", (req, res) => {
  if (req.params.id !== undefined) {
    res.status(400).send("Bad Request");
  }
  const filteredTodos = todos.filter((t) => t.id === String(req.params.id));
  const todo = filteredTodos[0];
  if (!todo) res.status(notFoundStatus).send("Not found");
  res.json(todo);
});

//Add GET request with path '/todos/overdue'
app.get("/todos/overdue", (req, res) => {
  let currentDate = new Date().toISOString();
  const filteredTodos = todos.filter(
    (todos) => todos.due <= currentDate && todos.completed == false,
    todos
  );
  const todo = filteredTodos;
  if (!todo) res.send(todo.length[0]);
  res.json(todo);
});

//Add GET request with path '/todos/completed'
app.get("/todos/completed", (req, res) => {
  const filteredTodos = todos.filter((todos) => todos.completed == true);
  const todo = filteredTodos;
  if (!todo) res.send(todo.length[0]);
  res.json(todo);
});

//Add POST request with path '/todos'
app.post("/todos", (req, res) => {
  let newTodo = req.body;
  if (!newTodo.name || !newTodo.due) {
    return (err) => res.status(errorStatus).send(err);
  }
  todos.push(newTodo);
  //Writing to Json Document
  fs.writeFile(
    __dirname + process.env.BASE_JSON_PATH,
    JSON.stringify(todos),
    (err) => {
      if (err) {
        return res.status(errorStatus).send("Something is wrong");
      }
    }
  );
  //Return Successful resp.
  return res.status(201).send("YES! Todos updates");
});

//Add PATCH request with path '/todos/:id
app.patch("/todos/:id", (req, res) => {
  if (req.params.id !== undefined) {
    res.status(400).send("Bad Request");
  }
  //Function for going through elements and updating matching id
  const updatedTodos = todos.map((todo) => {
    if (todo.id === String(req.params.id)) {
      todo.name = req.body.name;
      todo.due = req.body.due;
    }
    return todo;
  });
  // Checking that todos do exist and are not empty
  if (updatedTodos !== null && updatedTodos !== "") {
    //Writing to Json Document
    fs.writeFile(
      __dirname + process.env.BASE_JSON_PATH,
      JSON.stringify(updatedTodos),
      (err) => {
        if (err) {
          return res.status(errorStatus).send("Something is wrong");
        }
      }
    );
  }
  //Return Successful resp.
  return res.status(200).send("YES! Todo updated");
});

//Add POST request with path '/todos/:id/complete
app.post("/todos/:id/complete", (req, res) => {
  if (req.params.id !== undefined) {
    res.status(400).send("Bad Request");
  }
  //Updating the todos
  const updatedTodos = todos.map((todo) => {
    if (todo.id === String(req.params.id)) {
      todo.completed = req.body.completed;
    }
    return todo;
  });
  //Writing to Json Document
  fs.writeFile(
    __dirname + process.env.BASE_JSON_PATH,
    JSON.stringify(updatedTodos),
    (err) => {
      if (err) {
        return res.status(errorStatus).send("Something is wrong");
      }
    }
  );
  return res.status(200).send("YES! Complete updated");
});

//Add POST request with path '/todos/:id/undo
app.post("/todos/:id/undo", (req, res) => {
  if (req.params.id !== undefined) {
    res.status(400).send("Bad Request");
  }
  //Updating the todos
  const updatedTodos = todos.map((todo) => {
    if (todo.id === String(req.params.id)) {
      todo.completed = req.body.completed;
    }
    return todo;
  });
  //Writing to Json Document
  fs.writeFile(
    __dirname + process.env.BASE_JSON_PATH,
    JSON.stringify(updatedTodos),
    (err) => {
      if (err) {
        return res.status(errorStatus).send("Something is wrong");
      }
    }
  );
  return res.status(200).send("YES! Complete updated");
});

//Add DELETE request with path '/todos/:id

app.delete("/todos/:id/", (req, res) => {
  if (req.params.id !== undefined) {
    res.status(400).send("Bad Request");
  }
  const filteredTodos = todos.filter(
    (todo) => todo.id !== String(req.params.id)
  );
  console.log(filteredTodos);

  fs.writeFile(
    __dirname + process.env.BASE_JSON_PATH,
    JSON.stringify(filteredTodos),
    (err) => {
      if (err) {
        return res.status(errorStatus).send("Something is wrong");
      }
    }
  );
  //Return Successful resp.
  return res.status(200).send("File has been deleted");
});

app.listen(port, function () {
  console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;
