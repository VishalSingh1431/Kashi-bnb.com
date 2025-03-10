import express from 'express';
import userRouter from './routes/user.js';

const app = express();

app.use('/api/v1/user',userRouter);
// app.use('/api/v1/restr');
// app.use('/api/v1/hotel');

app.listen(3000,()=>{
    console.log("app running on");
})