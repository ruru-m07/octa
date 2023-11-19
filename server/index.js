const connectToMongo = require("./db");
var cors = require("cors");
const express = require("express");
const UserRoutes = require('./routes/UserRoutes')

// ** connect to mongoDB server
connectToMongo();

const port = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// ** Routers
app.use("/user", UserRoutes);

app.listen(port, () =>
  console.log(`app listening on http://localhost:${port} ✨`)
);
