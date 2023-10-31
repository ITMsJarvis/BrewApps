import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
export const SECRET = process.env.SECRET_CODE;

export const authenticateJwt = (req, res, next) => {
    let { token } = req.headers;
    if (token) {
        jwt.verify(token, SECRET, (err, data) => {
            if (err) {
                res.sendStatus(403)
            }
            if (data.profile == "user") {
                req.headers["profile"] = data.profile
                next()
            } else {
                res.json("Profile didn't match")
            }
        });
    } else {
        res.json({ message: "Please provide the auth" });
    }
};