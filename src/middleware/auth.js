const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "hellothisiskeyforjsonwebtokenthankyou")
        // console.log(verifyUser);

        const user = await Register.findOne({ _id: verifyUser._id });
        // console.log(user);

        req.token = token;
        req.user = user;
        next();
    }

    catch (error) {
        res.status(401).send(`<div style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;"><div style="display: flex; justify-content: center; align-items: center; flex-direction:column; border:2px solid #e65100; background-color:#fff; border-radius: 1rem;"><h2 style="margin:1rem 1.5rem;">please login</h2> <a href="/login" style="text-decoration : none;"><button style=" cursor:pointer; display: flex; justify-content: center; align-items: center; flex-direction:column; border:2px solid #e65100; background-color:#ff7c35; border-radius: 1rem; padding:1rem 1.5rem; margin:0.5rem 0 0.5rem 0; color:#fff;">Sign in</button></a></div></div>`);

    }

}

module.exports = auth;