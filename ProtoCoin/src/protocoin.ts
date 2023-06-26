import dotenv from "dotenv";
dotenv.config();
//
import { app } from "./server/server";
//
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT}`);
//
// server start
app.listen(PORT, () =>{
    console.log(`Protocoin is running at ${PORT} port`);
});