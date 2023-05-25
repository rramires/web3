import Block from "./block";

const block1:Block = new Block(1, "000aabbcc");
//block1.index = 1;
//block1.hash = "000aabbcc";

console.log(block1, block1.isValid());
