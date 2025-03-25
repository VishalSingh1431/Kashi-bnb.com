import express from 'express';
import { limiter } from './middleware/auth.js';
import userRouter from './routes/user.js';
import cors from 'cors'

const app = express();

app.use(cors());
// app.use(limiter);
app.use(express.json());
app.use('/api/v1/user',userRouter);


app.get('/',(req,res)=>{
    return res.send("Apis for Kashi-BnB");
});

// app.use('/api/v1/restr');
// app.use('/api/v1/hotel');
// https://kashi-bnb-production.up.railway.app/

app.listen(3000,()=>{
    console.log("app running on");
})
