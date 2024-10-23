import express, { Request, Response} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const router = express.Router();


// /api/users/register
router.post("/register",[
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email","Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
        min:6,
    }),
], async (req : Request, res : Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({message: errors.array()});
        return
    }
     try{
        let user = await User.findOne({
            email: req.body.email,
        });
        if(user){
            res.status(401).json({message: "User already exists"})
            return
        }
        user = new User(req.body)
        await user.save();

        //create token for jwt auth
        const token=jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn:"1d",
            }
        );
        
        res.cookie("auth_token",token,{
            httpOnly: true,
            secure:  process.env.NODE_ENV === "production", //for production: https(true) for development: http(false)
            maxAge: 86400000, //same as expiresIn but in millisec
        })
        
        res.status(200).send({ message: "User registered OK" });
        return
     }catch(error){
        console.log(error)
        res.status(500).send({messge: "Something went wrong"});
     }
})

export default router
