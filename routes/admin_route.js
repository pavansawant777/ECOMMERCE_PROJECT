var express = require("express");
var exe = require("./../connection");
var router = express.Router();

function checkAdminLogin(req,res,next){
    if(req.session.admin_id == undefined)
        res.redirect("/admin_login");
    if(req.session.admin_id != undefined)
        next();
}

router.get("/",checkAdminLogin,async function(req,res){
    var admin = await exe(`SELECT * FROM admin_tbl`);
    second = 1*1000;
   minute = 60*second;
   hour = 60*minute;
   day = 24*hour;
   console.log(day); 
    
   var current_time = new Date().getTime();
    var arr =[];

    for(var i=0;i<7;i++){
    var date = new Date(current_time-day*i).toISOString().slice(0,10); 
    console.log(date);   
    var orders = (await exe(`SELECT COUNT(*) as ttl FROM order_tbl WHERE order_date ='${date}'`))[0].ttl;
    arr.push({
        "date":date,
        "orders":orders
    })
}
obj ={"last_week_orders":arr,"admin_info":admin};
    res.render("admin/index.ejs",obj);
});

router.get("/about_company",checkAdminLogin,async function(req,res)
{
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe('SELECT * FROM company');
    var obj = {"company_info":data[0],"admin_info":admin};
    res.render("admin/about_company.ejs",obj);
});
router.post("/save_company_details",checkAdminLogin,async function(req,res)
{
    var d = req.body;
    var sql = `UPDATE company SET company_name = '${d.company_name}', company_mobile = '${d.company_mobile}', company_email = '${d.company_email}',company_address = '${d.company_address}',instagram_link = '${d.instagram_link}',telegram_link = '${d.telegram_link}',twitter_link = '${d.twitter_link}',whatsapp_no = '${d.whatsapp_no}',youtube_link = '${d.youtube_link}'`;
    var data = await exe(sql); 
    // res.send(data);
    res.redirect("/admin/about_company");
});

router.get("/slider",checkAdminLogin,async function(req,res)
{
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe('SELECT * FROM slider');
    var obj = {"slides":data,"admin_info":admin};
    res.render("admin/slider.ejs",obj);
});

router.post("/save_slide",checkAdminLogin,async function(req,res){
    if(req.files)
    {
        req.body.slide_image = new Date().getTime() + req.files.slide_image.name;
        req.files.slide_image.mv("public/uploads/"+req.body.slide_image);
    
    var d = req.body;
    var sql = `INSERT INTO slider (slide_title,slide_details,button_link,button_text,slide_image) VALUES ('${d.slide_title}','${d.slide_details}','${d.button_link}','${d.button_text}','${d.slide_image}')`;
    var data = await exe(sql);
    }
    // res.send(data);
    res.redirect("/admin/slider");
});
router.get("/delete_slide/:id",checkAdminLogin,async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM slider WHERE slider_id = ${id}`;
    var data = await exe(sql);
    // res.send("sql");
    res.redirect("/admin/slider");
});

router.get("/edit_slide/:id", async function(req,res){
    var id = req.params.id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM slider WHERE slider_id = ${id}`);
    var obj = {"slide_info":data[0],"admin_info":admin};
    res.render("admin/edit_slider.ejs",obj);
});

router.post("/update_slide",checkAdminLogin,async function(req,res){
    var slide_image = new Date().getTime() + req.files.slide_image.name;
    req.files.slide_image.mv("public/uploads/"+slide_image);
    var d = req.body;
    var sql = `UPDATE slider SET slide_title = '${d.slide_title}',slide_details ='${d.slide_details}',button_link ='${d.button_link}',button_text ='${d.button_text}',slide_image ='${slide_image}' WHERE slider_id = '${d.slider_id}'`;
    var data = await exe(sql);
    res.redirect("/admin/slider");

});

router.get("/category",checkAdminLogin,async function(req,res){
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM category`);
    var obj = {"cats":data,"admin_info":admin};
    res.render("admin/category.ejs",obj);
});
router.post("/save_category",checkAdminLogin,async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO category (category_name) VALUES ('${d.category_name}')`;
    var data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/category");
});

router.get("/delete_category/:id",checkAdminLogin,async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM category WHERE category_id = ${id}`;
    var data = await exe(sql);
    // res.send("sql");
    res.redirect("/admin/category");
});

router.get("/edit_category/:id", async function(req,res){
    var id = req.params.id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM category WHERE category_id = ${id}`);
    var obj = {"cats_info":data,"admin_info":admin};
    // res.send(data)
    res.render("admin/edit_category.ejs",obj);
});
router.post("/update_category",checkAdminLogin,async function(req,res){
     var d = req.body;
    //  res.send(d)
     var sql = `UPDATE category SET category_name ='${d.category_name}' where category_id='${d.category_id}'`;
     var data = await exe(sql);
     res.redirect("/admin/category");
 
});
router.get("/add_product",checkAdminLogin,async function(req,res){
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM category`);
    var obj = {"cats":data,"admin_info":admin};
    res.render("admin/add_product.ejs",obj);
});

router.post("/save_product",checkAdminLogin,async function(req,res)
{
    if(req.files.product_image1)
    {
        req.body.product_image1 = new Date().getTime()+req.files.product_image1.name;
        req.files.product_image1.mv("public/uploads/"+req.body.product_image1);
    }
    if(req.files.product_image2)
    {
        req.body.product_image2 = new Date().getTime()+req.files.product_image2.name;
        req.files.product_image2.mv("public/uploads/"+req.body.product_image2);
    }
    if(req.files.product_image3)
    {
        req.body.product_image3 = new Date().getTime()+req.files.product_image3.name;
        req.files.product_image3.mv("public/uploads/"+req.body.product_image3);
    }
    else
    req.body.product_image3  = "";
    if(req.files.product_image4)
        {
            req.body.product_image4 = new Date().getTime()+req.files.product_image4.name;
            req.files.product_image4.mv("public/uploads/"+req.body.product_image4);
        }
        else
        req.body.product_image4  = "";
    var d = req.body;
    var sql = `
        INSERT INTO product(
        category_id,
        product_name,
        product_company,
        product_colors,
        product_label,
        product_details,
        product_image1,
        product_image2,
        product_image3,
        product_image4
        ) VALUES (
        '${d.category_id}',
        '${d.product_name}',
        '${d.product_company}',
        '${d.product_colors}',
        '${d.product_label}',
        '${d.product_details}',
        '${d.product_image1}',
        '${d.product_image2}',
        '${d.product_image3}',
        '${d.product_image4}'
        )
    `;
    var data = await exe(sql);
    var product_id = data.insertId;
    for(var i=0;i<d.product_size.length;i++)
    {
        var sql = `
            INSERT INTO product_pricing (product_id,product_size, product_price, product_duplicate_price) VALUES ('${product_id}','${d.product_size[i]}','${d.product_price[i]}','${d.product_duplicate_price[i]}')
        `;
        var data = await exe(sql);
    }

    // res.send(req.body);
    res.redirect("/admin/add_product");
});

router.get("/product_list",checkAdminLogin,async function (req,res){
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var sql = `SELECT *,
    (SELECT MIN(product_price) FROM product_pricing WHERE product_pricing.product_id = product.product_id AND product_price > 0) as min_price,

    (SELECT MAX(product_price) FROM product_pricing WHERE product_pricing.product_id = product.product_id AND product_price > 0) as max_price
    
    FROM product`;
    var data = await exe(sql);
    var obj = {"products":data,"admin_info":admin};
    res.render("admin/product_list.ejs",obj);
});

router.get("/view_product/:product_id",checkAdminLogin,async function(req,res){
    var id = req.params.product_id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var sql = `SELECT * FROM product WHERE product_id = '${id}'`;
    var data = await exe(sql);

    var sql2 = `SELECT * FROM product_pricing WHERE product_id = '${id}'`;
    var pricing = await exe(sql2);
    var obj = {"product_info":data[0],"pricing":pricing,"admin_info":admin};
   res.render("admin/view_product.ejs",obj);
});

router.get("/edit_product/:product_id",checkAdminLogin,async function(req,res){
    var id = req.params.product_id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var sql = `SELECT * FROM product WHERE product_id = '${id}'`;
    var data = await exe(sql);

    var sql2 = `SELECT * FROM product_pricing WHERE product_id = '${id}'`;
    var pricing = await exe(sql2);
    var obj = {"product_info":data[0],"pricing":pricing,"admin_info":admin};
   res.render("admin/edit_product.ejs",obj);
});

router.post("/update_product",checkAdminLogin,async function(req,res){

    var d = req.body;
    if(req.files){

    if(req.files.product_image1)
    {
        var product_image1 = new Date().getTime()+req.files.product_image1.name;
        req.files.product_image1.mv("public/uploads/"+product_image1);
        var isql1 = `UPDATE product SET product_image1 = '${product_image1}' WHERE product_id = '${d.product_id}'`;
        await exe(isql1);
    }
    if(req.files.product_image2)
    {
        var product_image2 = new Date().getTime()+req.files.product_image2.name;
        req.files.product_image2.mv("public/uploads/"+product_image2);
        var isql2 = `UPDATE product SET product_image2 = '${product_image2}' WHERE product_id = '${d.product_id}'`;
        await exe(isql2);
    }
    if(req.files.product_image3)
    {
        var product_image3 = new Date().getTime()+req.files.product_image3.name;
        req.files.product_image3.mv("public/uploads/"+product_image3);
        var isql3 = `UPDATE product SET product_image3 = '${product_image3}' WHERE product_id = '${d.product_id}'`;
        await exe(isql3);
    }
    if(req.files.product_image4)
    {
        var product_image4 = new Date().getTime()+req.files.product_image4.name;
        req.files.product_image4.mv("public/uploads/"+product_image4);
        var isql4 = `UPDATE product SET product_image4 = '${product_image4}' WHERE product_id = '${d.product_id}'`;
        await exe(isql4);
    }
}

    var sql = `UPDATE product SET 
        product_name = '${d.product_name}',
        product_company = '${d.product_company}',
        product_colors = '${d.product_colors}',
        product_label = '${d.product_label}',
        product_details = '${d.product_details}'
        WHERE product_id = '${d.product_id}'
    `;
    var data = await exe(sql);

    for(var i=0;i<d.product_pricing_id.length;i++)
    {
        var sql = `UPDATE product_pricing SET 
            product_size = '${d.product_size[i]}',
            product_price = '${d.product_price[i]}',
            product_duplicate_price = '${d.product_duplicate_price[i]}' WHERE product_pricing_id = '${d.product_pricing_id[i]}'
        `;
        var data = await exe(sql);
    }
    // res.send(req.body);
    res.redirect("/admin/product_list");
});

router.get("/delete_product/:id",checkAdminLogin,async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM product WHERE product_id = '${id}'`;
    var sql2 = `DELETE FROM product_pricing WHERE product_id = '${id}'`;
    var data = await exe(sql);
    var data2 = await exe(sql2);
    // res.send(data);
    res.redirect("/admin/product_list");
});

router.get("/orders/:status",checkAdminLogin,async function(req,res){
    var status = req.params.status;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var sql = `SELECT * FROM order_tbl WHERE order_status = '${status}'`;
    var data = await exe(sql);
    var obj = {"status":status,"orders":data,"admin_info":admin};
    res.render("admin/orders.ejs",obj);
});

router.get("/order_details/:order_id",checkAdminLogin,async function(req,res){
    var order_id = req.params.order_id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var order = await exe(`SELECT * FROM order_tbl WHERE order_id = '${order_id}'`);
    var order_products = await exe(`SELECT * FROM order_det WHERE order_id = '${order_id}'`);
    var obj = {"order":order[0],"order_products":order_products,"admin_info":admin};
    res.render("admin/order_details.ejs",obj);
});

router.get("/transfer_order/:status/:order_id",checkAdminLogin,async function(req,res){
    var status = req.params.status;
    var order_id = req.params.order_id;
    var today = new Date().toISOString().slice(0,10);
    if(status == 'dispatch')
        var sql = `UPDATE order_tbl SET order_status = 'dispatch',dispatched_date = '${today}' WHERE order_id = '${order_id}'`;
    else if(status == 'deliver')
        var sql = `UPDATE order_tbl SET order_status = 'deliver',delivered_date = '${today}' WHERE order_id = '${order_id}'`;
    else if(status == 'reject')
        var sql = `UPDATE order_tbl SET order_status = 'reject',rejected_date = '${today}' WHERE order_id = '${order_id}'`;
    else if(status == 'return')
        var sql = `UPDATE order_tbl SET order_status = 'return',returned_date = '${today}' WHERE order_id = '${order_id}'`;

    var data = await exe(sql);
    res.redirect("/admin/orders/"+status);
});

router.get("/blog",checkAdminLogin,async function(req,res)
{
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe('SELECT * FROM blog');
    var obj = {"blogs":data,"admin_info":admin};
    res.render("admin/blog.ejs",obj);
});

router.post("/save_blog",checkAdminLogin,async function(req,res){

    req.body.blog_image = new Date().getTime()+req.files.blog_image.name;
    req.files.blog_image.mv("public/uploads/"+req.body.blog_image);

    var d = req.body;
    var sql = `INSERT INTO blog (blog_title, blog_label, blog_date, blog_image) VALUES ('${d.blog_title}','${d.blog_label}','${d.blog_date}','${d.blog_image}')`;
    var data = await exe(sql);

    res.redirect("/admin/blog");
});
router.get("/delete_blog/:id",checkAdminLogin,async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM blog WHERE blog_id = ${id}`;
    var data = await exe(sql);
    // res.send("data");
    res.redirect("/admin/blog");
});

router.get("/edit_blog/:id", async function(req,res){
    var id = req.params.id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM blog WHERE blog_id = ${id}`);
    var obj = {"blog_info":data[0],"admin_info":admin};
    res.render("admin/edit_blog.ejs",obj);

});
router.post("/update_blog",checkAdminLogin,async function(req,res){
    req.body.blog_image = new Date().getTime()+req.files.blog_image.name;
    req.files.blog_image.mv("public/uploads/"+req.body.blog_image);
     var d = req.body;
    //  res.send(d)
     var sql = `UPDATE blog SET blog_title ='${d.blog_title}',blog_label ='${d.blog_label}',blog_date ='${d.blog_date}',blog_image ='${d.blog_image}' where blog_id='${d.blog_id}'`;
     var data = await exe(sql);
     res.redirect("/admin/blog");
});

router.get("/home_page",checkAdminLogin,async function(req,res)
{
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM collection`);
    var obj = {"collection":data,"admin_info":admin};
    res.render("admin/collection.ejs",obj);
});


router.post("/save_collection",checkAdminLogin,async function(req,res){
    req.body.collection_image = new Date().getTime()+req.files.collection_image.name;
    req.files.collection_image.mv("public/uploads/"+req.body.collection_image);
    var d = req.body;

    var sql = `INSERT INTO collection(collection_catrgory,collection_title,collection_details,collection_image) VALUES ('${d.collection_catrgory}','${d.collection_title}','${d.collection_details}','${d.collection_image}')`;

    var data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/home_page");
});

router.get("/delete_collection/:id",checkAdminLogin,async function (req,res){
    var id = req.params.id;
    var sql = `DELETE FROM collection WHERE collection_id = ${id}`;
    var data = await exe(sql);
    // res.send("data");
    res.redirect("/admin/home_page");
});

router.get("/edit_collection/:id", async function(req,res){
    var id = req.params.id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM collection WHERE collection_id = ${id}`);
    var obj = {"collection_info":data[0],"admin_info":admin};
    res.render("admin/edit_collection.ejs",obj);
});
router.post("/update_collection",checkAdminLogin,async function(req,res){
    req.body.collection_image = new Date().getTime()+req.files.collection_image.name;
    req.files.collection_image.mv("public/uploads/"+req.body.collection_image);
     var d = req.body;
    //  res.send(d)
     var sql = `UPDATE collection SET collection_catrgory ='${d.collection_catrgory}',collection_title ='${d.collection_title}',collection_details ='${d.collection_details}',collection_image ='${d.collection_image}' WHERE collection_id='${d.collection_id}'`;
     var data = await exe(sql);
    //  res.send(data);
     res.redirect("/admin/home_page");
});

router.get("/testimonial",checkAdminLogin,async function(req,res)
{
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM testimonial`);
    var obj = {"testimonial":data,"admin_info":admin};
    res.render("admin/testimonial.ejs",obj);
});

router.post("/save_testimonial",checkAdminLogin,async function (req,res){
    var d = req.body;
    var sql = `INSERT INTO testimonial(testimonial_details, testimonial_name) VALUES ('${d.testimonial_details}', '${d.testimonial_name}')`;
    var data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/testimonial");
});

router.get("/delete_testimonial/:id",checkAdminLogin,async function (req,res){
    var id = req.params.id;
    var sql = `DELETE FROM testimonial WHERE testimonial_id = ${id}`;
    var data = await exe(sql);
    // res.send("data");
    res.redirect("/admin/testimonial");
});

router.get("/edit_testimonial/:id", async function(req,res){
    var id = req.params.id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM testimonial WHERE testimonial_id = ${id}`);
    var obj = {"testimonial_info":data[0],"admin_info":admin};
    res.render("admin/edit_testimonial.ejs",obj);
});

router.post("/update_testimonial",checkAdminLogin,async function(req,res){
     var d = req.body;
     var sql = `UPDATE testimonial SET testimonial_details ='${d.testimonial_details}',testimonial_name ='${d.testimonial_name}' WHERE testimonial_id='${d.testimonial_id}'`;
     var data = await exe(sql);
    //  res.send(data);
     res.redirect("/admin/testimonial");
});

router.get("/about",checkAdminLogin,async function(req,res){
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM about`);
    var obj = {"about":data,"admin_info":admin};
    res.render("admin/about.ejs",obj);
});

router.post("/save_about",checkAdminLogin,async function (req,res){
    req.body.about_image = new Date().getTime()+req.files.about_image.name;
    req.files.about_image.mv("public/uploads/"+req.body.about_image);
    var d = req.body;
    var sql = `INSERT INTO about(about_title, about_details, about_image) VALUES ('${d.about_title}','${d.about_details}', '${d.about_image}')`;
    var data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/about");
});


router.get("/delete_about/:id",checkAdminLogin,async function (req,res){
    var id = req.params.id;
    var sql = `DELETE FROM about WHERE about_id = ${id}`;
    var data = await exe(sql);
    // res.send("data");
    res.redirect("/admin/about");
});


router.get("/edit_about/:id", async function(req,res){
    var id = req.params.id;
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM about WHERE about_id = ${id}`);
    var obj = {"about_info":data[0],"admin_info":admin};
    res.render("admin/edit_about.ejs",obj);
});

router.post("/update_about",checkAdminLogin,async function(req,res){
    req.body.about_image = new Date().getTime()+req.files.about_image.name;
    req.files.about_image.mv("public/uploads/"+req.body.about_image);
     var d = req.body;
     var sql = `UPDATE about SET about_title ='${d.about_title}', about_details ='${d.about_details}',about_image ='${d.about_image}' WHERE about_id='${d.about_id}'`;
     var data = await exe(sql);
    //  res.send(data);
     res.redirect("/admin/about");
});

router.get("/contact",checkAdminLogin,async function(req,res){
    var data = await exe(`SELECT * FROM contact`);
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var obj = {"contact":data,"admin_info":admin};
    res.render("admin/contact.ejs",obj);
});

router.get("/quote",checkAdminLogin,async function(req,res){
    var admin = await exe(`SELECT * FROM admin_tbl`);
    var data = await exe(`SELECT * FROM quote`);
    var obj = {"quote":data,"admin_info":admin};
    res.render("admin/quote.ejs",obj);
});

router.post("/save_quote",checkAdminLogin,async function(req,res){
    var d = req.body;
    var sql = `UPDATE quote SET quote_title ='${d.quote_title}', quote_details ='${d.quote_details}', quote_name ='${d.quote_name}'`;
    var data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/quote");
});

router.get("/logout",function(req,res){
    req.session.admin_id = undefined;
     res.redirect("/admin_login");
    });


module.exports = router;

// CREATE TABLE company (company_id INT PRIMARY KEY AUTO_INCREMENT, company_name VARCHAR(100), company_mobile VARCHAR(15), company_email VARCHAR(100), company_address TEXT, instagram_link TEXT, telegram_link TEXT, twitter_link TEXT, whatsapp_no VARCHAR(15), youtube_link TEXT)

// INSERT INTO company(company_name) VALUES('')

// CREATE TABLE slider (slide_id INT PRIMARY KEY AUTO_INCREMENT,slide_title VARCHAR(100), slide_details TEXT, button_link TEXT, button_text TEXT, slide_image TEXT)


// CREATE TABLE category (category_id INT PRIMARY KEY AUTO_INCREMENT, category_name VARCHAR(100))

// CREATE TABLE blog (blog_id INT PRIMARY KEY AUTO_INCREMENT, blog_title VARCHAR(100), blog_label VARCHAR(100), blog_date VARCHAR(20), blog_image TEXT)

// CREATE TABLE collection (collection_id INT PRIMARY KEY AUTO_INCREMENT, collection_catrgory VARCHAR(100),collection_title VARCHAR(100), collection_details TEXT, collection_image TEXT)

// CREATE TABLE testimonial (testimonial_id INT PRIMARY KEY AUTO_INCREMENT, testimonial_details TEXT, testimonial_name VARCHAR(100))

// CREATE TABLE about(about_id INT PRIMARY KEY AUTO_INCREMENT,about_title VARCHAR(100), about_details TEXT, about_image TEXT)

// CREATE TABLE quote(quote_id INT PRIMARY KEY AUTO_INCREMENT,quote_title VARCHAR(100), quote_details TEXT, quote_name VARCHAR(100))