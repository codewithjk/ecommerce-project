const express = require("express");
const port = process.env.PORT || 8000;
const { connectDB } = require("./server/utils/db");
const userRouter = require("./server/routes/userRoutes");
const adminRouter = require("./server/routes/adminRoutes");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nocache = require("nocache");
const morgan = require("morgan");

connectDB();
const app = express();

// app.use(cors());

require("./server/helper/OAuth");

//parse body data
app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));
console.log("this is the root directory ",__dirname,"  ",path.resolve(__dirname, "assets"))
//load static assets
app.use("/static", express.static(path.resolve(__dirname, "assets")));

app.set("view engine", "ejs");

app.use(cookieParser());

app.use(nocache());

app.use(morgan("common"));

app.use("/admin", adminRouter);
app.use("/", userRouter);

app.listen(port || 8000, () => {
  console.log(`✅Listening on port ${port}. Visit http://localhost:${port}/`);
});
