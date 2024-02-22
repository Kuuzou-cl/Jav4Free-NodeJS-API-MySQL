const express = require("express");
const app = express();
const port = 8080;
const javsRouter = require("./routes/javs");
const categoriesRouter = require("./routes/categories");
const idolsRouter = require("./routes/idols");
const usersRouter = require("./routes/users");
const searchesRouter = require("./routes/searches");
const cloudflareRouter = require("./routes/cloudflare");
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

app.use("/categories", categoriesRouter);

app.use("/idols", idolsRouter);

app.use("/users", usersRouter);

app.use("/search", searchesRouter);

app.use("/cloudflare", cloudflareRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});