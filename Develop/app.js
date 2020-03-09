//imports
const express = require("express");
const fs = require("fs");
const util = require("util");
var path = require("path");

//file read/write var
fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);

//server listen 
var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//routing:
//default / index page
app.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
//notes page
app.get("/notes", (req,res)=> {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.post("/api/notes", async function(req, res){
    let file = await fs.readFile("./db/db.json" , "utf8");

    console.log(file);

    const postFile = JSON.parse(file);

    const lastNote = postFile[postFile.length -1].id
    req.body.id = lastNote + 1 || 1
    postFile.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(postFile)).then(
        function (){
            console.log("success - file written")
            res.json(req.body);
        }
    ).catch(err => console.log(err));


});

app.get("/api/notes", async(req,res) => {
    let file = await fs.readFile("./db/db.json","utf8");
    console.log("Got file: " + file)
    res.json(JSON.parse(file));
});

app.delete("/api/notes/:id", async function (res, req){
    let id = res.params.id;

    id = JSON.parse(id);

    let file = await fs.readFile("./db/db.json","utf8");

    let newFile = JSON.parse(file).filter((item) => item.id !== id);

    fs.writeFile("./db/db.json", JSON.stringify(newFile)).then(
        ()=> {
            req.json(newFile);
        }
    ).catch(err => console.log(err));
    


});

app.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT);
});
