//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { name } = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Sulimanshams-admin:191sulimanshams@cluster0.bdhiu.mongodb.net/TODoListSB?retryWrites=true&w=majority&appName=Cluster0/TODoListDB");
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to db");
})
db.on("error", (err) => {
  console.log(err);
})


const ItemsSchema = {
   name: String ,
}

const Item = mongoose.model("Item"  , ItemsSchema);


const Item1 = new Item ({
  name: "Welcome To Your ToDoList !"
});

const Item2 = new Item ({
  name: "Hit the + button to off a new Item ."
});

const Item3 = new Item ({
  name: "<-- Hit this to Delete an item."
});

const DefaulteItems=[Item1 , Item2 , Item3];

app.get("/", async function(req, res) {
  try {
    const foundItems = await Item.find({});
    
    if (foundItems.length === 0) {
      const existingItems = await Item.find({ name: { $in: ["Welcome To Your ToDoList !", "Hit the + button to off a new Item .", "<-- Hit this to Delete an item ."] } });

      if (existingItems.length === 0) {
        await Item.insertMany(DefaulteItems);
        console.log("Successfully saved to database");
      }
      
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
    const item = new Item({
      name: itemName
    });
    item.save();
    res.redirect("/")
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
