const { time } = require("console");
var express = require("express");
var app = express();
var path = require("path");
var mysql = require("mysql");

app.listen(3006, function () {
    console.log("Server Started");
})

app.use(express.static("public"));
app.get("/home", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})
app.get("/admin", function (req, res) {
    res.sendFile(__dirname + "/public/dash-admin.html");
})
var fileup = require("express-fileupload");
app.use(fileup());
var dbConfig = {
    host: "0.0.0.0",
    user: "root",
    password: "",
    database: "projectnodejs"
}
var dbcon = mysql.createConnection(dbConfig);
dbcon.connect(function (err) {
    if (err)
        console.log(err.message);
    else
        console.log("Connected...");
})
app.use(express.urlencoded({ extended: true }));
app.post("/signup", function (req, resp) {
    var curd = new Date();
    var dos = curd.getFullYear() + "-" + (curd.getMonth() + 1) + "-" + curd.getDate();
    req.body.dos = dos;
    //resp.send(req.body);

    var data = [req.body.email, req.body.pswd, req.body.type, req.body.dos];
    dbcon.query("insert into users values(?,?,?,?)", data, function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.send("Signup....");
    })

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gavishjain123@gmail.com',
            pass: 'gj@8005585713'
        }
    });

    var mailOptions = {
        from: 'gavishjain123@gmail.com',
        to: req.body.email,
        subject: 'Event Planner',
        text: 'Welcome To Our Website....'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
})
app.use(express.urlencoded({ extended: true }));
app.post("/submit", function (req, resp) {
    if (req.files == null) {
        //var filename = "";
        req.body.picname = "4051934-middle.png";
        //filename = req.body.jasoos;
    }
    else {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);
        //filename = req.files.ppic.name;
    }
    var data = [req.files.ppic.name, req.body.name, req.body.email, req.body.city, req.body.contact, req.body.address];
    dbcon.query("insert into client values(?,?,?,?,?,?)", data, function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.send("Record Saved");
    })
})
app.post("/update", function (req, resp) {
    var filename = "";
    if (req.files == null) {
        //console.log("***************" + req.body.jasoos);
        filename = req.body.jasoos;
    }
    else {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);
        filename = req.files.ppic.name;
    }
    var data = [filename, req.body.name, req.body.city, req.body.contact, req.body.address, req.body.email];
    dbcon.query("update client set ppic=?,name=?,city=?,contact=?,address=? where email=?", data, function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result.affectedRows + "Record Updated");
    })
})
app.use(express.urlencoded({ extended: true }));
app.post("/submit2", function (req, resp) {
    if (req.files == null) {
        //var filename = "";
        req.body.picname = "4051934-middle.png";
        //filename = req.body.jasoos;
    }
    else {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);
        //filename = req.files.ppic.name;
    }
    var data = [req.body.email, req.body.name, req.body.contact, req.body.firmname, req.body.estd, req.body.firmadd, req.body.city, req.body.aadhar, req.files.ppic.name, req.body.selservices, req.body.otherinfo];
    dbcon.query("insert into vendor values(?,?,?,?,?,?,?,?,?,?,?)", data, function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.send("Record Saved");
    })
})
app.post("/update2", function (req, resp) {
    var filename = "";
    if (req.files == null) {
        //console.log("***************" + req.body.jasoos);
        filename = req.body.jasoos;
    }
    else {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);
        filename = req.files.ppic.name;
    }
    var data = [req.body.name, req.body.contact, req.body.firmname, req.body.estd, req.body.firmadd, req.body.city, req.body.aadhar, filename, req.body.selservices, req.body.otherinfo, req.body.email];
    dbcon.query("update vendor set name=?,contact=?,firmname=?,estd=?,firmadd=?,city=?,adhrno=?,ppic=?,selser=?,otherinfo=? where email=?", data, function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result.affectedRows + "Record Updated");
    })
})
//--------------------------------------------------------
app.get("/chk-user-in-table1", function (req, resp) {
    //resp.send("Bale Bale of " + req.query.thisuser);
    dbcon.query("select * from vendor where email=?", [req.query.thisuser], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})
app.get("/chk-user-in-table", function (req, resp) {
    //resp.send("Bale Bale of " + req.query.thisuser);
    dbcon.query("select * from client where email=?", [req.query.thisuser], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})
app.get("/fetch-all", function (req, resp) {
    dbcon.query("select * from vendor", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/user-del", function (req, resp) {
    var data = [req.query.uidx];
    dbcon.query("delete from vendor where email=?", data, function (err, res) {
        if (err)
            resp.send(err.message);
        else
            resp.send(res.affectedRows + "Record Deleted");
    })
})
app.get("/fetch-all2", function (req, resp) {
    dbcon.query("select * from client", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/user-del2", function (req, resp) {
    var data = [req.query.uidx];
    dbcon.query("delete from client where email=?", data, function (err, res) {
        if (err)
            resp.send(err.message);
        else
            resp.send(res.affectedRows + "Record Deleted");
    })
})
// -----------------------------login click ------------------//
app.get("/login", function (req, resp) {
    var data = [req.query.thisuser, req.query.thispwd];
    dbcon.query("select * from users where email=? and pswd=?", data, function (err, result) {

        if (err)
            resp.send(err.message);
        else

            resp.send(result);
    })

})

app.get("/fetch-city", function (req, resp) {
    dbcon.query("select distinct city from vendor", function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})
app.get("/fetch-selser", function (req, resp) {
    dbcon.query("select selser from vendor", function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})
app.get("/do-fetch-all", function (req, resp) {
        dbcon.query("select * from vendor where city=? and selser like ?", [req.query.thiscity,"%"+req.query.thisservices+"%"], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})
app.post("/updateclient",function(req,resp){
    var data = [req.body.pswd,req.body.email];
    dbcon.query("update users set pswd=? where email=?", data, function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result.affectedRows + "Record Updated");
    })
})
app.post("/updatevendor",function(req,resp){
    var data = [req.body.pswd,req.body.email];
    dbcon.query("update users set pswd=? where email=?", data, function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result.affectedRows + "Record Updated");
    })
})
