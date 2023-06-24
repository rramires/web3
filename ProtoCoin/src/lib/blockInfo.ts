/**
 * The BlockInfo interface
 */
export default interface BlockInfo {
    nextIndex: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty: number;
    feePerTx: number;
    data: string;
}