import express  from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";

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
app.get('/status', (req, res, next) =>{
    res.json({
        length: blockchain.chain.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
})

/**
 * Return block by index or hash
 */
app.get('/blocks/:indexOrHash', (req, res, next) =>{
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
app.post('/blocks', (req, res, next) =>{
    // skip
    if(req.body.index === undefined || 
       req.body.previousHash === undefined|| 
       req.body.data === undefined) return res.sendStatus(422) // Unprocessable Content 

       console.log('body:', req.body);
    // add block
    const block: Block = new Block(req.body.index, 
                                   req.body.previousHash, 
                                   req.body.data);
    // fake mine
    block.mine(1, "fakeMiner");
    
    const validation = blockchain.addBlock(block);
    // skip
    if(!validation.success){
        res.status(400).json(validation);
    }
    else{
        res.status(201).json(block);
    }
})

//
export {
    app
}