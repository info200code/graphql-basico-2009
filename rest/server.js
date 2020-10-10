const express = require("express");
const faker = require("faker");
const bodyParser = require("body-parser");
const app = express();

const data = [
  {
    id: 1,
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  },
  {
    id: 2,
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  },
];

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ hello: "hello world" });
});

app.get("/users", (req, res) => {
  res.json({ data: data });
});

app.get("/users/:id", (req, res) => {
  const user = data.find((item) => item.id === parseInt(req.params.id));
  res.json(user);
});

app.post("/users", (req, res) => {
  data.push(req.body);
  res.json(req.body);
});

app.listen(3000, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("Servidor corriendo en el puerto 3000");
});
