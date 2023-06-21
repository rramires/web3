import { app } from "./server/server";
//
const PORT: number = 3000;
//
// server start
app.listen(PORT, () =>{
    console.log(`Protocoin is running at ${PORT} port`);
});