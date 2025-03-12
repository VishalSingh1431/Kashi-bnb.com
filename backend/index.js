import express from 'express';

// const app = express();

// app.use(cors());
 
// app.get("hel",(req,res)=>{
//     return res.send("fine");
// })

// app.listen(3000);
import userRouter from './routes/user.js';

const app = express();
app.use(express.json());

app.use('/api/v1/user',userRouter);
// app.use('/api/v1/restr');
// app.use('/api/v1/hotel');

app.listen(3000,()=>{
    console.log("app running on");
})
