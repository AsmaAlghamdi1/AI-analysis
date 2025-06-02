const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const multer = require("multer");
const fs = require("fs");

dotenv.config();

const app=express();
const PORT = process.env.PORT || 3000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("./frontend")); 

const db = mysql.createConnection(process.env.DATABASE_URL);
db.connect((err)=>{
    if(err){
        console.error("Database connection error:", err);
    }else{
        console.log("Connected to database");
    }
});


app.post('/contact',(req,res)=>{
    const fullname = req.body.fullname;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    const query = 'INSERT INTO contacts(fullname,email,subject,message) VALUES (?,?,?,?)';
    db.query(query, [fullname, email, subject, message], (err, result) => {
    if (err) {
      console.error('Error while entering data:', err);
      res.status(500).json({ message: 'Server error' });
    } else {
      res.status(200).json({ message: 'The data has been received successfully.' });
    }
  });
});


const genAI = new GoogleGenerativeAI(process.env.API); 

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToBase64(filePath) {
  const fileData = fs.readFileSync(filePath);
  return fileData.toString("base64");
}

app.post('/analyze', upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  const prompt = req.body.prompt;

  try {
    console.log("Received file:", req.file);
    const base64Image = fs.readFileSync(imagePath).toString("base64");

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const text = await response.text(); 

    fs.unlinkSync(imagePath); 

    res.json({ result: text });

  } catch (err) {
    console.error("Error in /analyze:", err.message, err.stack);
    res.status(500).json({ error: "Failed to analyze image." });
  }
});


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});