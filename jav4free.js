const express = require("express");
const app = express();
const port = 3000;
const javsRouter = require("./routes/javs");
const idolsRouter = require("./routes/idols");
const categoriesRouter = require("./routes/categories");
const searchsRouter = require("./routes/searchs");
const usersRouter = require("./routes/users");
const cors = require('cors');

const config = require('./config');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors(
  config.cors.server
));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/javs", javsRouter);

app.use("/idols", idolsRouter);

app.use("/categories", categoriesRouter);

app.use("/search", searchsRouter);

app.use("/users", usersRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});