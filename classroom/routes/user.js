const express = require("express");
const router = express.Router();
const app = express();

// gey user request
router.get("/",(req,res)=>{
    res.send("Get Usere");
})
// get user by id
router.get("/:id",(req,res)=>{
    res.send(`Get from user ${req.params.id}`);
})
//Post req
router.post("/",(req,res)=>{
    console.log("This is the Post Request");
})
// Celete req

router.delete("/:id",(req,res)=>{
    console.log("Tjis is delete req");
})

module.exports = router;