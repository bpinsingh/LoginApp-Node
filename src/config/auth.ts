import * as jwt from "jwt-simple";

export class Auth
{
    secret ="!!@#$abc"
    async getToken(user: any, res: any)
    {
        try {
            const expires = this.expiresIn(1); // 1 day    
            const token = await this.encodeToken(user, expires);
    
            return token;
        } catch (err) {
            console.log("err", err);
            res.status(500).json({
                success: false,
                status: "error",
                message: "Error while generating token."
            });
        }
    }

    expiresIn(numDays: number)
    {
        const dateObj = new Date();
        return dateObj.setDate(dateObj.getMinutes() + numDays);
    }
    async encodeToken(user: any, expires: any)
    {
        return jwt.encode({
            agency: "Login token",
            user: {
                email: user.email,
                profile: user.profile,
            },
            exp: expires
        }, this.secret);
    }
    async decodeToken(token: any)
    {
        const decodedToken =  jwt.decode(token, this.secret);
        
        return decodedToken;
    }
}