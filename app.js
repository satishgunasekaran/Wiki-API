//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });


// Create Schema
const articleSchema = {
    title: String,
    content: String
};

// Create Model
const Article = mongoose.model("Article", articleSchema);


app.route("/articles")

    .get(async function (req, res) {
        var articles = await Article.find({});
        res.send(articles);
    })

    .post(async function (req, res) {
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        await newArticle.save();
        res.send("Successfully added a new article.");
    })

    .delete(async function (req, res) {
        await Article.deleteMany({});
        res.send("Successfully deleted all articles.");
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

app.route("/articles/:articleTitle")
    .get(async function (req, res) {
        var article = await Article.findOne({ title: req.params.articleTitle });

        if (article) {
            res.send(article);
        }
        else {
            res.send("No articles matching that title was found.");
        }
    })
    .put(async function (req, res) {
        await Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true }
        );
        res.send("Successfully updated article.");
    })
    .patch(async function (req, res) {
        await Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body }
        );
        res.send("Successfully updated article.");
    }
    )
    .delete(async function (req, res) {
        await Article.deleteOne({ title: req.params.articleTitle });
        res.send("Successfully deleted article.");
    }
    );
















