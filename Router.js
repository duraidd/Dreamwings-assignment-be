import express from "express";
import modal from "./Model.js";
const router = express.Router();
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'asdgasdgHGHSGFDFSD';
import nodemailer from 'nodemailer';

router.post('/login', (req, res) => {
    let info = req.body;
    let obj = {
        email: info.email,
        password: info.password
    }

    var now = new Date();
    now.setMinutes(now.getMinutes() + 5); // timestamp
    now = Math.floor(now.getTime() / 1000 / 60) * 60; // Date object



    const token = jwt.sign(
        { email: info.email },
        SECRET_KEY,
        { expiresIn: '300s' });


    var a = Math.floor(1000 + Math.random() * 9000);

    obj.otp = a;
    obj.otpExpireTime = now;

    console.log(token, "token")




    modal.find({ email: info.email, password: info.password }).then((resdata1) => {

        if (resdata1.length != 0) {
            sendMail(info, a, token);
            modal.updateOne({ email: info.email }, { $set: { otp: a } }).then(() => {
                res.json({ status: 200, msg: "OTP has been sent to your Email address", otpToken: token });
            })
        } else {
            res.json({ status: 400, msg: "Invalid User" });
        }
    })




});

async function sendMail(datamail, otpdata, tdata) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'duraiessakimuthu@gmail.com',
            pass: 'gxcc jnwm cjff olli'
        }
    });

    var mailOptions = {
        from: 'duraiessakimuthu@gmail.com',
        to: datamail.email,
        subject: 'OTP',
        text: "Your OTP : " + otpdata.toString() + "this OTP will be valid for 3 mins only"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}

router.post('/verify', async (req, res) => {
    try {
        var info = req.headers;
        console.log("info", info);
        var decode = jwt.verify(info.authorization, SECRET_KEY, function (err, decoded) {
            if (decoded) {
                console.log("working")
                modal.find({ email: decoded.email, otp: Number(req.body.otp) }).then(async (response) => {
                    if (response.length > 0) {
                        await modal.updateOne({ email: decoded.email }, { $set: { otp: 0, otpExpireTime: 0 } }, { $inc: { tryCount: 1 } }).then(() => {
                            const accessToken = jwt.sign(
                                { email: decoded.email },
                                SECRET_KEY,
                                { expiresIn: '1d' });
                            res.json({ status: 200, msg: "Successfully verified", token: accessToken });
                        })
                    } else {
                        res.json({ status: 400, msg: "Invalid OTP" });
                    }
                })
            } else {
                res.json({ status: 400, msg: "Your token has been expired" });
            }
        });
    } catch (error) {

    }
})


router.get('/gettime', (req, res) => {
    try {
        var token = req.headers.authorization;
        var decode = jwt.verify(token, SECRET_KEY, function (err, decoded) {
            if (decoded) {
                res.json({ status: 200, data: new Date() })
            } else {
                res.json({ status: 400, msg: "Access Denied" });
            }
        })

    } catch (error) {

    }
})



export default router;