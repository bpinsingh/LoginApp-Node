import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { Auth } from "../config/auth";

export class UserController
{
    async getUser(req: Request, res: Response, next: NextFunction)
    {
        if(!req.params.userEmail)
        {
            return res.send({"Error": "Invalid Email id try again"});
        }
        const auth =  new Auth();

        const token = await auth.decodeToken(req.headers.token);
        console.log(" toekne for get ", token);
        User.findOne({email:req.params.userEmail} ,(err, existingUser) =>
        {
            if (err) 
            { 
                return next(err); 
            }
            else
            {
                res.send({status:200, message: "User data fetched successfully!!", data: existingUser});
            }
        });
    };

    async postUser(req: Request, res: Response, next: NextFunction)
    {
        const auth =  new Auth();
        const token = await auth.getToken(req.body, res);
        req.body.token = token;
        const user = new User(req.body);
        User.findOne({email:req.body.email} ,(err, existingUser) =>
        {
            if (err) 
            { 
                return next(err); 
            }
            else if(existingUser)
            {
                res.send({status:403, message: "User with this email already exists !!"});
            }
            else
            {
                user.save((err) => {
                    if (err) 
                    { 
                        return next(err); 
                    }
                    else
                    {
                        res.send({status:200, message: "User data added successfully!!"});
                    }
                });
            }
        });
    };

    async login(req: Request, res: Response, next: NextFunction)
    {
        const auth =  new Auth();
        const token = await auth.getToken(req.body, res);
        req.body.token = token;
        
        User.findOne({email:req.body.email, password:req.body.password},(err, existingUser) =>
        {
            if(err)
            {
                return next(err);
            }
            else if(existingUser)
            {
                console.log("existingUser");
                User.findOneAndUpdate({email:req.body.email},{$set:{token:token}}, (err, userInfo) => 
                {
                    console.log("userInfo", userInfo);
                    if(err)
                    {
                        return next(err);
                    }
                    else{
                        res.send({status:200, message: "login success", userInfo: { profile: existingUser.profile, email: existingUser.email,token: userInfo.token}});
                    }
                });
            }
            else
            {
                res.send({status:404, message: "Invalid username and password"});
            }
        });
    }
}
