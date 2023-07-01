import express, { Request, Response, NextFunction }  from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";
import Transaction from "../lib/transaction";

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


/****************
 * Routes
 ****************/ 

/**
 * Return status
 */
app.get('/status', (req: Request, res: Response, next:NextFunction) =>{
    res.json({
        mempool: blockchain.mempool.length,
        blocks: blockchain.chain.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
})

/**
 * Return next block info
 */
app.get('/blocks/next', (req: Request, res: Response, next:NextFunction) =>{
    res.json(blockchain.getNextBlock());
})

/**
 * Return block by index or hash
 */
app.get('/blocks/:indexOrHash', (req: Request, res: Response, next:NextFunction) =>{
    let block;
    // verify if is number
    if(/^[0-9]+$/.test(req.params.indexOrHash)){
        // get by index
        block = blockchain.chain[parseInt(req.params.indexOrHash)];
        // skip
        if(!block) return res.sendStatus(404); // Not Found
        // res
        res.json(block);
    }
    else{
        // get by hash
        block = blockchain.getBlock(req.params.indexOrHash);
        // skip
        if(!block) return res.sendStatus(404); // Not Found
        // res
        res.json(block);
    }
})

/**
 * Add block
 */
app.post('/blocks', (req: Request, res: Response, next:NextFunction) =>{
    // skip
    if(req.body.index === undefined || 
       req.body.previousHash === undefined || 
       req.body.hash === undefined) return res.sendStatus(422) // Unprocessable Content 
    // add block
    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);
    // skip
    if(!validation.success){
        res.status(400).json(validation);
    }
    else{
        res.status(201).json(block);
    }
})

/**
 * Get transactions - optional hash param
 */
app.get('/transactions/:hash?', (req: Request, res: Response, next:NextFunction) => {
    // search by hash
    if(req.params.hash){
        res.json(blockchain.getTransaction(req.params.hash));
    }
    else{
        // get next block transactions 
        res.json({
            next: blockchain.mempool.slice(0, Blockchain.TXS_PER_BLOCK),
            total: blockchain.mempool.length
        });
    }
})

/**
 * Add transaction
 */
app.post('/transactions', (req: Request, res: Response, next:NextFunction) => {
    // skip
    if (req.body.data === undefined) return res.sendStatus(422);
    // add block transaction
    const tx = new Transaction(req.body as Transaction);

    const validation = blockchain.addTransaction(tx);
    // skip
    if(!validation.success){
        res.status(400).json(validation);
    }
    else{
        res.status(201).json(tx);
    }
})
//
export {
    app
}