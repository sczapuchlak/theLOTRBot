var express = require('express');
var router = express.Router();

// Get about page/ The address is relative to /about/

router.get('/', function (req,res){
    res.render('about');
});

module.exports=router;