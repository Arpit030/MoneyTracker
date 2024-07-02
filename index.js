const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000; // Changed port to avoid conflicts
const username = process.env.MONGODB_Username;
const password = process.env.MONGODB_Password;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.f976wkg.mongodb.net/Money`, {});
const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to the Database"));
db.once('open', () => console.log("Connected to Database"));



// Route to add data
app.post("/add", async (req, res) => {
    
    try{
        const { category_select, amount_input, info, date_input } = req.body;

        const data = {
            Category: String(category_select),
            Amount: Number(amount_input),
            Info: String(info),
            Date: (date_input)
        };
        db.collection('users').insertOne((data), (err, collection) => {
            if(err){
                console.log("Error inserting record");
                res.status(500).send("Error Inserting record");
            }
            console.log("Data inserted successfully");
            res.status(200).send("Data inserted successfully");
        });
        
    }
    catch(error){
        console.log(error);
        res.redirect('/');
    }
});


// Route to serve the main page
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});