require('dotenv').config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoutes = require("./routes/user");
const blogRoute = require("./routes/blog");


const {  checkForAuthenticationCookie } = require("./middleware/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
.then((e)=> console.log("Mongodb connected"));

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));

app.get("/", async (req,res) => {
    const allBlogs = (await Blog.find({}));
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.get("/",(req,res)=>{
    res.render("home",{
        user: req.user,
    });
});

app.use("/user",userRoutes);
app.use("/blog",blogRoute);


app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));