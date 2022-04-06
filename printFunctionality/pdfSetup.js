const Path = require("path");
const fs = require('fs');
const ejs = require("ejs");

var myCss = {
    style : fs.readFileSync('./printFunctionality/template.css','utf8'),
};

async function setUpPdf(piaObject) {
    const htmlPath = Path.join(__dirname, "/printTemplate.ejs")
    try {
        let dataForPDF = await ejs.renderFile(htmlPath,{ 
            myCss: myCss,
            projectName: piaObject.pia.projectName, 
            sponsoringBusinessUnit: piaObject.pia.sponsoringBusinessUnit, 
            projectDescription: piaObject.pia.projectDescription ? piaObject.pia.projectDescription.replace(/['"]+/g, '') : '', 
            isCollected: Boolean(piaObject.pia.isCollected),
            personalInfo: piaObject.pia.personalInfo ?  piaObject.pia.personalInfo.replace(/['"]+/g, '')  : '',
            purpose: piaObject.pia.purpose,
            individualsInfo: piaObject.pia.individualsInfo ? piaObject.pia.individualsInfo.replace(/['"]+/g, '')  : '',
            date: piaObject.createdAt.slice(0, 10).toString(),
            isDisclosed: piaObject.pia.isDisclosed,
            disclosedInfo: piaObject.pia.disclosedInfo ? piaObject.pia.disclosedInfo.replace(/['"]+/g, '')    : '',
        },{async:true});
        
        var options = { 
            // height: '842px', width: '595px', 
            format: 'A4', type: "pdf",
            // "header": {"height": "10mm"}, 
            "footer": {"height": "10mm"} 
        };
    
        let pdfSpecs = {
            dataForPDF: dataForPDF,
            options: options
        }
        console.log(`pdf specs: ${pdfSpecs}`);
    
        return pdfSpecs;
    } catch (err) {
        return err;
    }  
}

module.exports = {
    setUpPdf
}