import { prisma } from '../utils/client.js';
import cryptoRandomString from 'crypto-random-string';
import { sendEmail, sendNotificationEmail } from '../utils/mail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { publishUserUpdate } from '../utils/events.js';

// Log in a user.
export const loginControl = async (req, res, nex) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please check your email or sign up."
            });
        }

        if (user.verified === false) {
            return res.status(403).json({
                success: false,
                message: "Email not verified. Please verify your email before logging in."
            });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password. Please try again."
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }
        const token = await jwt.sign(user, jwtSecret);
        user.password = null;
        user.token = null;
        return res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            token: `Bearer ${token}`,
            user
        });
    } catch (e) {
        console.error("Login error:", e);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in.",
            error: e.message || e
        });
    }
};

// Login with mobile and password
export const loginWithMobile = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "Mobile number and password are required"
            });
        }

        // Find user by mobile number
        const user = await prisma.users.findUnique({
            where: { mobile: mobile }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number or password"
            });
        }

        // Check if user has a password (not Google OAuth user)
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: "This account was created with Google. Please login with Google instead."
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number or password"
            });
        }

        // Check if user is verified
        if (!user.verified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your account before logging in"
            });
        }

        // Generate JWT token
        const jwtSecret2 = process.env.JWT_SECRET;
        if (!jwtSecret2) {
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                mobile: user.mobile,
                name: user.name, 
                first_name: user.first_name,
                last_name: user.last_name,
                verified: user.verified, 
                is_admin: user.is_admin, 
                has_hotel: user.has_hotel 
            },
            jwtSecret2,
            { expiresIn: '7d' }
        );

        // Update user token
        await prisma.users.update({
            where: { id: user.id },
            data: { token: token }
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                verified: user.verified,
                is_admin: user.is_admin,
                has_hotel: user.has_hotel
            }
        });

    } catch (e) {
        console.error("Login error:", e);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in.",
            error: e.message || e
        });
    }
};

export const verification = async (req,res,nex)=>{
    try{
        const token = req.query.token;
        const email = req.query.email;
        if(!token||!email){
            return res.status(411).json({
                success : false ,
                message:"no token",
            });
        }
        
        // console.log("token ver : ",token);

        const user = await prisma.users.findUnique({
            where : {
                email : email,
            }
        });
        
        // console.log(user);

        if(user.token === token){
            const user = await prisma.users.update({
                where : {
                    email : email,
                },
                data : {
                    token : null,
                    verified : true
                }
            });
            publishUserUpdate(user);
            
            return res.status(200).json({
                success : true,
                message : "verified login to continue",
                // user 
            });
        }
        else{
            return res.status(411).json({
                success : false ,
                message:"invalid token",
                e
            });
        }

    }
    catch(e){
        return res.status(411).json({
            success : false ,
            message:"cant verify",
            e
        });
    }
}


//  Register a new user.
export const signupControl = async (req,res,nex)=>{
    try{
        const { name, email, password, mobile } = req.body;
        
        if(!name || !email || !password){
            return res.status(411).json({
                success : false ,
                message : "Name, email and password are required"
            });
        }

        // Check if user exists with email
        let user = await prisma.users.findUnique({
            where:{
                email : email
            }
        });

        if((user)&&(user.verified===true)){
            return res.status(420).json({
                success : false ,
                message : "user already exist",
            })
        }

        // Check if user exists with Google ID (Google OAuth user)
        if(user && user.googleId){
            return res.status(409).json({
                success : false ,
                message : "An account with this email already exists via Google. Please login with Google instead.",
            })
        }

        // Check if mobile number is already taken by another user
        if(mobile) {
            const existingUserByMobile = await prisma.users.findUnique({
                where: {
                    mobile: mobile
                }
            });

            if(existingUserByMobile && existingUserByMobile.id !== user?.id){
                return res.status(409).json({
                    success : false ,
                    message : "Mobile number already exists"
                });
            }
        }

        const token = cryptoRandomString({length:15});
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Split name into first and last name
        const nameParts = name.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        if(!user){
            user = await prisma.users.create({
                data: {
                    name: name.trim(),
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                    mobile: mobile || null,
                    token: token,
                }
            });
        }
        else{
            await prisma.users.update({
                where:{
                    email: email
                },
                data:{
                    name: name.trim(),
                    first_name,
                    last_name,
                    password: hashedPassword,
                    mobile: mobile || null,
                    token: token,
                }
            })
        }

        await sendEmail(email, token);

        return res.status(201).json({
            success : true,
            message:"verify user to finish",
        })
    }
    catch(e){
        console.log(e);
        return res.status(411).json({
            success : false ,
            message:"unable to signup",
            e
        });
    }
}

// Simple route to check if the API is working.


export const checkControl = (req,res,nex)=>{
    return res.status(200).json({
        success : true,
        message:"route working"
    });
}

//  Request to become a hotel owner.

export const makeRequest = async (req, res, next) => {
    try {
        console.log('makeRequest called with:', { 
            body: req.body, 
            user: { id: req.user.id, email: req.user.email, has_hotel: req.user.has_hotel } 
        });

        if (req.user.has_hotel === true) {
            console.log(req.user.email, "already hoteler");
            return res.status(420).json({
                success: false,
                message: "User is already a hotel owner."
            });
        }

        // Validate required fields
        if (!req.body.phone || !req.body.email || !req.body.message) {
            console.log('Missing required fields:', req.body);
            return res.status(400).json({
                success: false,
                message: "Phone, email, and message are required"
            });
        }

        const existingRequest = await prisma.requests.findFirst({
            where: {
                userId: req.user.id,
                type: "hotelowner"
            }
        });

        if (existingRequest) {
            console.log(req.user.email, "already requested");
            return res.status(420).json({
                success: false,
                message: "request already exists"
            });
        }

        console.log('Creating new request with data:', {
            ...req.body,
            type: "hotelowner",
            userId: req.user.id
        });

        const newReq = await prisma.requests.create({
            data: {
                ...req.body,
                type: "hotelowner",
                userId: req.user.id
            }
        });

        console.log('Request created successfully:', newReq);

        return res.status(200).json({
            success: true,
            message: "request created",
            request: newReq
        });
    } catch (e) {
        console.error('Error in makeRequest:', e);
        console.error('Error stack:', e.stack);
        console.error('Error details:', {
            name: e.name,
            message: e.message,
            code: e.code,
            meta: e.meta
        });
        
        return res.status(500).json({
            success: false,
            message: "error creating request",
            error: e.message,
            details: process.env.NODE_ENV === 'development' ? {
                name: e.name,
                code: e.code,
                meta: e.meta,
                stack: e.stack
            } : undefined
        });
    }
};


// Get the logged-in user’s profile.

export const sendProfile = async (req,res,nex)=>{
    try{
        const reqId = req.params.uid;
        if(reqId!=req.user.id){
            return res.status(420).json({
                success : false ,
                message : "accessing different profile",
            })
        }
        const allData = await prisma.users.findUnique({
            where: {
              id: req.user.id
            },
            include: {
              bookings: true,
              hotels_name: {
                include: {
                  bookings: true,
                  images: {
                    take: 1, // Include the first image for display
                  }
                }
              },
              restr_name: true,
              blogs_name: true
            }
          });
        allData.password=null;
        allData.token=null;
        return res.status(200).json({
            success : true,
            message : "profile got",
            allData
        })
    }
    catch(e){
        console.log(e);
        return res.status(420).json({
            success : false ,
            message : "error getting profile",
            e
        })
    }
    
}

// Update the logged-in user’s profile.

export const updateProfile = async (req,res,nex)=>{
    try{
        console.log('Profile update request body:', req.body);
        console.log('User ID from token:', req.user.id);
        
        const updated = await prisma.users.update({
            where: {
              id: req.user.id
            },
            data:{
                ...req.body
            }
            
          });
        
        console.log('Profile updated successfully:', updated);
        publishUserUpdate(updated);
        
        return res.status(200).json({
            success : true,
            message : "profile updated",
            user: {
                id: updated.id,
                name: updated.name,
                first_name: updated.first_name,
                last_name: updated.last_name,
                email: updated.email,
                mobile: updated.mobile,
                verified: updated.verified,
                is_admin: updated.is_admin,
                has_hotel: updated.has_hotel
            }
        })
    }
    catch(e){
        console.log('Profile update error:', e);
        
        // Provide more specific error messages
        let errorMessage = "error updating profile";
        
        if (e.code === 'P2002') {
            errorMessage = "A user with this email or mobile number already exists";
        } else if (e.code === 'P2025') {
            errorMessage = "User not found";
        } else if (e.code === 'P2003') {
            errorMessage = "Invalid data provided";
        } else if (e.message) {
            errorMessage = e.message;
        }
        
        return res.status(420).json({
            success : false ,
            message : errorMessage,
            e: e.message
        })
    }
    
}

// Get current user (fresh from DB)
export const me = async (req, res) => {
    try {
        const user = await prisma.users.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        const { password, token, ...safe } = user;
        return res.status(200).json({ success: true, user: safe });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Error fetching user', error: e.message });
    }
};

// Server-Sent Events stream for real-time user updates
export const stream = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const userId = req.user.id;

    const send = (data) => {
        res.write(`event: user\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const onUpdate = (payload) => {
        if (payload?.id === userId) {
            send({ type: 'user:update', user: payload.user });
        }
    };

    publishUserUpdate({ id: userId }); // trigger initial
    const { appEvents } = await import('../utils/events.js');
    appEvents.on('user:update', onUpdate);

    req.on('close', () => {
        appEvents.off('user:update', onUpdate);
        res.end();
    });
};

// Send notification email for listing access requests
export const sendNotificationEmailController = async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        
        if (!to || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Email, subject, and message are required"
            });
        }

        const result = await sendNotificationEmail(to, subject, message);
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: "Notification email sent successfully"
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send notification email",
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error sending notification email:', error);
        return res.status(500).json({
            success: false,
            message: "Error sending notification email",
            error: error.message
        });
    }
};