const express = require("express");
const port = process.env.PORT || 8000;
const { connectDB } = require("./server/utils/db");
const userRouter = require("./server/routes/userRoutes");
const adminRouter = require("./server/routes/adminRoutes");
const path = require("path");
const cookieParser = require("cookie-parser");

connectDB();
const app = express();

app.use(express.urlencoded({ extended: true }));

//load static assets
app.use("/static", express.static(path.resolve(__dirname, "assets")));
app.set("view engine", "ejs");

app.use(cookieParser());

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(port || 8000, () => {
  console.log(`✅Listening on port ${port}. Visit http://localhost:${port}/`);
});
