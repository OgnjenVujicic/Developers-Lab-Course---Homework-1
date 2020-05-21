/*var docxConverter = require('docx-pdf');

docxConverter('./uploads/example.docx','./uploads/output.pdf',function(err,result){
  if(err){
    console.log(err);
  }
  console.log('result'+result);
}); */  // za jednostavan konvertor koji konvertuje prvo u html pa u pdf

const libre = require('libreoffice-convert'); //potreban libreoffice
const fs = require('fs');
 
const extend = '.pdf'

function convertWordtoPDF(name){

const FilePath = './uploads/' + name;
const outputPath = './uploads/' + name + " - converted" + extend;
 
const enterFile = fs.readFileSync(FilePath);

return new Promise((resolve, reject) => {
  libre.convert(enterFile, extend, undefined, (err, done) => {
    if (err) {
      console.log(`Error converting file: ${err}`);
      reject(err);
    }
    fs.writeFileSync(outputPath, done);
    console.log('File converted and saved in: ' + outputPath)
    resolve(outputPath);
});
});
}

module.exports = {
    convertWordtoPDF
};