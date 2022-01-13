const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");

const api = process.env.API_URL;
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

// Enable CORS Policy
app.use(cors());
app.options("*", cors());

// Those are middlewares
app.use(express.json()); // Here we parse the body from the request.
app.use(morgan("tiny"));
app.use(authJWT()); // Auth Token
app.use("/public/uploads", express.static(__dirname + "/public/uploads")); // Define the static folder of our app
app.use(errorHandler);

// Routes
const productsRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

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
