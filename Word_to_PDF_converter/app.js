const express = require('express');
const upload = require("express-fileupload");
const hbs = require("hbs");
const converter = require("./converter");
const fs = require("fs")
const mail_sender = require("./send-email")

const app = express();
app.use(upload())

app.set('view engine', 'hbs');

function readConvCounts(){
  counts = fs.readFileSync('counter.txt')
  return counts.toString()
}

function iterateConvCount(){
  curr = readConvCounts();
  next_count = parseInt(curr) + 1;
  fs.writeFileSync('counter.txt',next_count.toString());
}

app.get('/', function(req, res) {
  res.render("index.hbs", {
    status:"After upload click the button",
    button_status: "disabled",
    button_color: "none",
    counts: readConvCounts()
});
})

app.post('/upload', function(req, res) {
  
  //console.log(req.files);

  if(req.files.upfile && 
    ( req.files.upfile.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || req.files.upfile.mimetype == 'application/msword' )){

    const file = req.files.upfile;
    const name = file.name;

    const uploadpath = __dirname + '/uploads/' + name;

    file.mv(uploadpath,async function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded",name);
        file_loc = await converter.convertWordtoPDF(name); // da li ovdje try, catch block da ide ako dodje do grske? nisam mogao da izazovem gresku 
        iterateConvCount();
        mail_sender(req.body.email, file_loc);
        res.render("index.hbs", {
          status : 'File converted.',
          button_status: "enabled",
          button_color: "aquamarine",
          down_path: file_loc,
          counts: readConvCounts()
      });
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
})

app.get('/download', function(req, res){
  const file = req.query.path;
  res.download(file);
});

app.listen(3000, () => {
  console.log("Server Started at port 3000");
}); 

