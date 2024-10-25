//login func not in users as register contacting directly with user entity

import express , {Request, Response} from 'express';
import { check, validationResult } from 'express-validator';
import verifyToken from '../middleware/auth';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


const router = express.Router();

router.post("/login",[
    check("email","Email is required").isString(),
    check("password", "Password with 6 or more characters required").isLength({
        min:6,
    }),
], async(req: Request, res:Response)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({message: errors.array()})
        return
    }

    const {email,password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({message: "Invalid credentials"})
            return 
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({message: "Invalid credentials"})
            return
        }

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn:"1d",
            },
        );

        res.cookie("auth_token",token,{
            httpOnly: true,
            secure:  process.env.NODE_ENV === "production", //for production: https(true) for development: http(false)
            maxAge: 86400000, //same as expiresIn but in millisec
        })

        res.status(200).json({userId: user._id})

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong" });
    }
});

//validate token endpoint, goes through verifyToken middleware if verified send res 200 with the userId
router.get("/validate-token", verifyToken, (req:Request, res: Response)=>{
    res.status(200).send({userId: req.userId})
});

router.post("/logout", (req: Request, res: Response)=>{
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});

export default router;