const express = require("express");
const app = express();
const morgan = require("morgan");

morgan.token("content", function getContent(req) {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :content")
);
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Gino Gini",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people!</p>
    <p>${Date()}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000);

  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  return Math.max(maxId, randomId) + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const samePerson = persons.find((person) => person.name === body.name);

  if (samePerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
