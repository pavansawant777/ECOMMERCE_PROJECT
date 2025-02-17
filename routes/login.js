var express = require("express");
var router = express.Router();
var exe = require("./../connection");

router.get("/",async function(req,res){
    var data = await exe(`SELECT * FROM admin_tbl`);
    var obj = {"admin_info":data};
    res.render("login/login.ejs",obj);
});

router.post("/check_login",async function(req,res){
    var d = req.body;
    var sql = `SELECT * FROM admin_tbl WHERE admin_email = '${d.admin_name}' AND admin_password ='${d.admin_password}'`;
    var data = await exe(sql);
    if(data.length > 0){
         req.session['admin_id'] = data[0].admin_id;
        //  res.send("Login Success");
        res.redirect("/admin/");
    } 
    else
    {
        
    //   res.send("Login Failed");  
     res.redirect("/admin_login/");
        
     }

});

module.exports = router;

// CREATE TABLE admin_tbl(admin_id INT PRIMARY KEY AUTO_INCREMENT, admin_name VARCHAR(200), admin_email VARCHAR(100), admin_password TEXT)