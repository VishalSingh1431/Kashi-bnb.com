import express from 'express';

const app = express();

app.use(cors());
 
app.get("hel",(req,res)=>{
    return res.send("fine");
})

app.listen(3000);