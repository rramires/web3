import dotenv from 'dotenv';
dotenv.config();
//
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

const PORT: number = parseInt(`${process.env.PORT || 3001}`);


/**
 * Create Express Application
 */
const app = express();


/**
 * Middlewares
 */
app.use(morgan("tiny"));


/**
 * Routes
 */
app.post("/mint/:wallet", async (req: Request, res: Response, next: NextFunction) =>{
    // for test
    res.json({"Wallet: ": req.params.wallet});
});


/**
 * Run app
 */
app.listen(PORT, () => {
    console.log("Server running at port: " + PORT);
});