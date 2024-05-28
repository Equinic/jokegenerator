import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app= express()
const port=3000;
const API_URL = "https://v2.jokeapi.dev/joke/"
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req,res) =>{
    res.render("index.ejs")
})
app.get("/index.ejs", (req,res) =>{
    res.render("index.ejs")
})
app.get("/postajoke", (req,res) =>{
    res.render("postajoke.ejs")
})
app.post("/submit", async(req,res) =>{
    const selectedCategory = req.body.category;
    const selectedType = req.body.type;
    const selectedName = req.body.name
    let optedOut = req.body.optout
    if(optedOut==undefined)
    {
        optedOut = " ";
    }

    const response = await axios.get(API_URL+selectedCategory+"?type="+selectedType+"&contains="+selectedName+"&blacklistFlags="+optedOut)
    console.log(response)
    console.log(selectedType)
    const result = JSON.parse(JSON.stringify(response.data));
   if(selectedType=="single")
   {
    res.render("index.ejs", {
        tjoke:result.joke,
        tsetup: undefined,
        tdelivery: undefined
    })
    //console.log(result.joke)
   }
   else
   {
    res.render("index.ejs", {
        tsetup:result.setup,
        tdelivery:result.delivery,
        tjoke: undefined
    })
    //console.log(result.setup)
    //console.log(result.delivery)
   }
    
  
})
app.get("/safemode", async(req,res) =>{
    res.render("safemode.ejs")

})

app.get("/safe", async(req,res) => {
    const response = await axios.get(API_URL+"Any?safe-mode");
    const result = JSON.parse(JSON.stringify(response.data));

    if(result.type=="single")
   {
    res.render("safemode.ejs", {
        tjoke:result.joke,
        tsetup: undefined,
        tdelivery: undefined
    })
    //console.log(result.joke)
   }
   else
   {
    res.render("safemode.ejs", {
        tsetup:result.setup,
        tdelivery:result.delivery,
        tjoke: undefined
    })
    //console.log(result.setup)
    //console.log(result.delivery)
   }
    
    
})

app.post("/getjoke", async(req,res)=>{
    try{
        const data = req.body;
        const JSONdata = JSON.stringify(data);
        console.log(JSONdata)
        const response = axios.post("https://v2.jokeapi.dev/submit", JSONdata)
        res.status(200).send("Joke sent succesfully!")
    } catch(err)
    {
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

