import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../utils/client.js';

const razorpayInstance = new Razorpay({
    key_id : process.env.RZPKID,
    key_secret : process.env.RZPKS
})

export const paymentControl = async (req,res,nex)=>{
    // console.log(req);
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(amount),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, async (e, order) => {
        if (e) {
            console.log(e);
            return res.status(500).json({ 
                sucess: false,
                message: "Something Went Wrong!" , 
                e
            })
        }

        res.status(200).json({ 
            success: true,
            data: order ,
            bookingId : 123
        });
        console.log(order);
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error!",
            e
        });
    }
};

export const paymentVerifyControl = async (req,res,nex) => {
    // console.log(req);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // console.log("req.body", req.body);

    try {
        // Create Sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        
        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(sign.toString())
        .digest("hex");
        
        // console.log(razorpay_signature === expectedSign);
        
        // Create isAuthentic
        const isAuthentic = expectedSign === razorpay_signature;
        
        // Condition 
        if (isAuthentic) {
            const book =  await prisma.bookings.create({
                data : {
                    email : req.user.email,
                    userId: req.user.id,
                    hotelId: req.body.hotelId,
                    from: req.body.from,
                    to: req.body.to
                }
            });

            const pay = await prisma.payment.create({
                data:{
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    bookingId : book.id
                }
            });
            
            res.status(200).json({
                success: true,
                message: "Payement Successfully"
            });
        }
        else{
            res.status(401).json({
                success: false,
                message: "Payement Unsccessfully, unauth"
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ 
            success:false,
            message: "Internal Server Error!" 
        });
    }
};