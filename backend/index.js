import express from 'express';
<<<<<<< HEAD

const app = express();

app.use(cors());
 
app.get("hel",(req,res)=>{
    return res.send("fine");
})

app.listen(3000);
=======
import userRouter from './routes/user.js';

const app = express();

app.use('/api/v1/user',userRouter);
// app.use('/api/v1/restr');
// app.use('/api/v1/hotel');

app.listen(3000,()=>{
    console.log("app running on");
})
>>>>>>> 4b6c9129b9df2a2a425c0e3b6406c0eeff87f412
