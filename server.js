const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app=express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
      console.error('خطأ أثناء إدخال البيانات:', err);
      res.status(500).json({ message: 'خطأ في السيرفر' });
    } else {
      res.status(200).json({ message: 'تم استلام البيانات بنجاح' });
    }
  });
});


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});