const express =  require('express');
const cors = require("cors");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

require("./Config/Database").connect();

const user = require("./Routes/UserRoutes");
app.use("/api/v1", user);

app.listen(PORT,() => {
    console.log("Server is running at",PORT,"port number.");
})

// app.get("/", (req,res) => {
//     res.send("<h1>Auth App</h1>")
// });