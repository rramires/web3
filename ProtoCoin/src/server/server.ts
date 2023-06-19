import express  from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";

const PORT: number = 3000;

/**
 * Express Server
 */
const app = express();
// middlewares
app.use(morgan('tiny'));
app.use(express.json());


/**
 * Blockchain
 */
const blockchain = new Blockchain();


/**
 * Routes
 */

// return status
app.get('/status', (req, res, next) =>{
    res.json({
        length: blockchain.chain.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
})

// return block by index or hash
app.get('/blocks/:indexOrHash', (req, res, next) =>{
    let block;
    // verify if is number
    if(/^[0-9]+$/.test(req.params.indexOrHash)){
        // get by index
        block = blockchain.chain[parseInt(req.params.indexOrHash)];
        // skip
        if(!block) return res.sendStatus(404);
        // res
        res.json(block);
    }
    else{
        // get by hash
        block = blockchain.getBlock(req.params.indexOrHash);
        // skip
        if(!block) return res.sendStatus(404);
        // res
        res.json(block);
    }
})


// server start
app.listen(PORT, () =>{
    console.log(`Protocoin is running at ${PORT} port`);
});