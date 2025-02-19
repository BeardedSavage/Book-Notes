import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port = 3000;

const app = express();

const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", async(req, res) => {
    try {
        const result = await axios.get(`${API_URL}/books`);
        res.render("index.ejs", {
            content: result.data,
        });
    } catch (error) {
        console.log(error.message);
    }
});

app.get("/add", (req, res) => {
    res.render("addBook.ejs");
});

app.get("/edit/:id", async (req, res) => {
    
    try {
        const result = await axios.get(`${API_URL}/edit/${req.params.id}`);
        res.render("addBook.ejs", {
            update: result.data,
        });
    } catch (error) {
        console.log(error.message);
    }
});

app.post("/submit", async (req, res) => {
    
    try {
        await axios.post(`${API_URL}/post`, req.body);
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }

});

app.post("/submit/:id", async (req, res) => {
    try {
        await axios.patch(`${API_URL}/submit/${req.params.id}`, req.body);
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
});

app.get("/delete/:id",  async (req, res) => {
    try {
        await axios.delete(`${API_URL}/post/${req.params.id}`);
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});