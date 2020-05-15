import { Auth } from "../config/auth";
import { Request, Response, NextFunction } from "express";

export class ValidateRequests{
    async validate(req: Request, res: Response, next: NextFunction){
        const token  = req.headers.token;
        if(token)
        {
            console.log(" token ", token);
            try{
                const auth = new Auth();
                const decodedToken = await auth.decodeToken(token);                 
                if (decodedToken.exp <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "Token Expired",
                        "tokenExpired" : true
                    });
                    return;
                }
                else{
                    next();
                }
            }
            catch( exp)
            {
                res.send({
                    "status": 500,
                    "message": "Oops something went wrong",
                    "error": exp
                });
            }
        }
    }
}
