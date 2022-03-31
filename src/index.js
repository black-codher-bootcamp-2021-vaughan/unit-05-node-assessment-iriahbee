require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const todoFilePath = process.env.BASE_JSON_PATH;
const errorStatus = 501;
const notFoundStatus= 404

//Read todos from todos.json into variable
let todos = require(__dirname + todoFilePath);

// app.use(express.urlencoded({ extended: true }));
 app.use(express.json());
// //app.use(express.raw());
// app.use(bodyParser.json());

app.use("/content", express.static( "public"));
console.log(path.join(__dirname, "public"))

//1. Get HTML page
app.get("/", (_, res) => { 
res.sendFile(path.join(__dirname, "public/index.html"));
});

//2. Get a list of todo's
app.get('/todos', (_req, res) => {
res.json(todos); 
return (todos);
});

//GET /todos/:id
app.get('/todos/:id', (req, res) => {
const filteredTodos = todos.filter(t => t.id === String(req.params.id));
const todo = filteredTodos[0]
if (!todo) res.status(notFoundStatus).send('Not found');
res.json(todo); 
});


//Add GET request with path '/todos/overdue'

//Add GET request with path '/todos/completed'

//Add POST request with path '/todos'

app.post('/todos', (req, res) => {
   var newTodo = (req.body);
   console.log(newTodo);
   if(!newTodo.name || !newTodo.due) {   
    return(err) => res.status(errorStatus).send(err);
      }
    todos.push(newTodo); 
   //Writing to Json Document
   fs.writeFile(__dirname + process.env.BASE_JSON_PATH, JSON.stringify(todos), err => {
    if (err) {
    console.error(err)
    return 
  }});
   //Return Successful resp.
   return res.status(200).send("YES! Todos updates");
    });
  
    


  //  Write New Todo into Json file
  //  fs.writeFile(__dirname + process.env.BASE_JSON_PATH,  content, err => {
  //     if (err) {
  //       console.error(err)
  //       return
  //     }
  // }
   
  //  if (!res.status(201).json(todos)) return(err) => {res.status(400).send(err); console.log("error")}

//Add PATCH request with path '/todos/:id

//Add POST request with path '/todos/:id/complete

//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id

app.listen(port, function () {
    console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;