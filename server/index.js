const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let contacts = [{ name: "Mindaugas", phone: "+37000000000" }];

const notEmpty = (value) => value != null;
const matchRegex = (regex) => (value) => !!regex && !!regex.test && regex.test(value);

app.get("/contacts", (req, res) => {
  setTimeout(() => {
    res.json(contacts);
  }, 2000);
});

app.post("/contacts", (req, res) => {
  setTimeout(() => {
    const { body } = req;
    console.log("What", body);
    const errors = [
      { key: "name", validations: [{ rule: notEmpty, message: "Name is Empty" }] },
      {
        key: "phone",
        validations: [
          { rule: notEmpty, message: "Phone is Empty" },
          { rule: matchRegex(/\+[0-9]{3}[0-9]{8}/), message: "Phone format not valid" },
        ],
      },
    ].reduce((result, { key, validations }) => {
      const error = !validations || validations.find(({ rule }) => !rule(body[key]));

      if (error) {
        return [...result, error.message];
      }

      return result;
    }, []);

    if (errors.length) {
      res.status(400).json({ error: true, messages: errors });
    } else {
      contacts = [...contacts, body];
      res.send(contacts);
    }
  }, 2000);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
