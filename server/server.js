require('dotenv').config();// load environment file and copy key/val

const express = require("express");//load express
const cors = require("cors"); //meed coors cause dif ports
const {MongoClient} = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);//create obj, load conn string
const db = client.db("pa2")//set db
const users = db.collection("users");//where we store users
const app = express();//make express instance

app.use(express.json());//parses json into req.body =
app.use(cors());//add cors to let browser cross origin fetch

app.get("/",(req, res)=>{//if someone accesses '/' respond with server running, if runnign
    res.json({
        message: "server running"
    });
});

//signup request
app.post("/signup", async(req,res)=>{
    const {f_name,l_name,username,password } = req.body;//grab 4 fields from request

    if (!f_name||!l_name||!username||!password){//if any blank, return code 400 and msg, "missing field"
        return res.status(400).json({ message: "Missing field" });
    }

    try{//do db work, hit catch if fails
        const existingUser = await users.findOne({username: username})//check for user
        if (existingUser){//if yes, return taken
            return res.status(409).json({
                message: "Username taken"
            });
        }
        await users.insertOne({//if not taken, create user in db.
            f_name: f_name,
            l_name: l_name,
            username: username,
            password: password
        });
        res.status(201).json({//if worked, success code
            message: "Sign up successful",
        });
    }
    catch (error){//if anything fails serverside, return this
        console.log(error);
        res.status(500).json({
            message: "server error"
        });
    }
});

app.post("/login", async (req,res) =>{
    const {username, password} = req.body; //grab username and pass from request
    if (!username || !password){//if blank
        return res.status(400).json({
            message: "Missing field" });//say its blank
    }
    try{//db try catch
        const user = await users.findOne({username: username});//find user

        //incorrect/correct state checks
        if (!user){
            return res.status(401).json({
                message: "usename does not exist"
            });
        }

        if(user.password !== password){
            return res.status(401).json({
                message: "wrong password"
            });
        }

        res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error"
        });
    }
});


async function connectDatabase(){//open connection to db
    try {
        await client.connect();//open client we made earlier
        console.log("Connected");
    } catch(error){//it broke
        console.error("could not connect to MongoDB");
        console.error(error);
    }
}

connectDatabase();

app.listen(9000, () => {
    console.log("Server running on port 9000");
});