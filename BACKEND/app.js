const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");

const api = process.env.API_URL;

const productsRouter = require("./routers/products");

app.use(cors());
app.options("*", cors());

// Those are middlewares
app.use(express.json()); // Here we parse the body from the request.
app.use(morgan("tiny"));

// Routers
app.use(`${api}/products`, productsRouter);

// Make connection to db before starting the server.
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop",
  })
  .then(() => {
    console.log("Db connection is ready~");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("server is runing http//localhost:3000");
});
