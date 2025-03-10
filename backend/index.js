import express from 'express';

const app = express();

app.use('/api/v1/user');
app.use('/api/v1/restr');
app.use('/api/v1/hotel');

app.listen(3000,()=>{
    console.log("app running on");
})