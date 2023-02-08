const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const users = require("./routers/users");

//using static middleware
app.use(express.static(path.join(__dirname, "public")));

//users resource
app.use("/users", users);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
