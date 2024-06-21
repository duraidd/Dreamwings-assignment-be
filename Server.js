import morgan from "morgan";
import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import router from './Router.js';
import adminrouter from './adminRouter.js'
import { rateLimit } from 'express-rate-limit'

const app = express();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 5, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
	
})


app.use(limiter)



mongoose.connect("mongodb://localhost/dreamwingdb").then(() => {
    console.log("DB connected");
}).catch((err) => {
    console.log("DB not connected");
});
app.use(morgan('common'));
app.listen(8005);

app.use('/user', router);
app.use('/admin', adminrouter);

app.get('/', (req, res) => {
    res.json({ status: true, msg: "Welcomefdss to my world" });
});

export default app;