const express = require("express");
const router = express.Router();

// gey user request
router.get("/",(req,res)=>{
    res.send("Get post");
})
// get post by id
router.get("/:id",(req,res)=>{
    res.send(`Get from post ${req.params.id}`);
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