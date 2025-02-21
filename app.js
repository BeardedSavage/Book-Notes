import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();

const port = 4000;

let books = [];

env.congfig();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATA,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

db.query("SELECT * FROM book;", (err, res) => {
    if(err) {
        console.log("Error fetching data: ", err.stack);
    } else {
        books = res.rows;
    }
});

app.get("/books", (req, res) => {
    res.json(books);
});

app.get("/edit/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const findPost = books.find((book) => book.id === id);
    if (!findPost) return res.status(404).json({message: "This post does not exist"});

    res.json(findPost);
})

app.post("/post", async (req, res) => {
    const isbn = req.body.isbn;
    const title = req.body.title;
    const content = req.body.content;

    console.log(title);
    
    await db.query("INSERT INTO book(title, isbn, content) VALUES ($1, $2, $3);", 
        [
            title,
            isbn,
            content
        ]
    );

    res.json(books);

});

app.patch("/submit/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const editBook = req.body.content;

    try {
        await db.query("UPDATE book SET content = $1 WHERE id = $2;", 
            [
                editBook,
                id
            ]
        );
    } catch (eror) { 
        console.log(error.message);
    }

    res.json(books);
});

app.delete("/post/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await db.query("DELETE FROM book WHERE id = $1;", 
        [id]
    );

    res.json(books);
})

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});