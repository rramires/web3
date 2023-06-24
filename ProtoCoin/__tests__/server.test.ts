import request from "supertest";
import { app } from "../src/server/server";
import Block from "../src/lib/block";

// mocks
jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

describe("Blockchain Server Tests", () => {

    test("GET /status - Should return status", async () =>{
        const response = await request(app)
                                .get('/status/');

        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toEqual(true);
    })


    test("GET /blocks/next - Should get next block", async () =>{
        const response = await request(app)
                                .get('/blocks/next');

        expect(response.status).toEqual(200);
        expect(response.body.nextIndex).toEqual(1);
    })

    test("GET /blocks/:indexOrHash - Should get block by index", async () =>{
        const response = await request(app)
                                .get('/blocks/0');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
    })

    test("GET /blocks/:indexOrHash - Should get block by hash", async () =>{
        const response = await request(app)
                                .get('/blocks/mockHash');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
    })

    test("GET /blocks/:indexOrHash - Should NOT get block by index", async () =>{
        const response = await request(app)
                                .get('/blocks/666'); // invalid index

        expect(response.status).toEqual(404);
    })

    test("GET /blocks/:indexOrHash - Should NOT get block by hash", async () =>{
        const response = await request(app)
                                .get('/blocks/invalidHash'); // invalid hash

        expect(response.status).toEqual(404);
    })

    test("POST /blocks/ - Should add a new block", async () =>{
        //
        const block = new Block({
                                index: 1,
                                previousHash: "mockHash",
                                data: "Block 1"
                            } as Block);

        const response = await request(app)
                                .post('/blocks/')
                                .send(block);

        expect(response.status).toEqual(201);
        expect(response.body.index).toEqual(1);
    })

    test("POST /blocks/ - Should NOT add a new block(400)", async () =>{
        //
        const block = new Block({
                                index: -1, // invalid index
                                previousHash: "mockHash",
                                data: "Block 1"
                            } as Block);

        const response = await request(app)
                                .post('/blocks/')
                                .send(block);

        expect(response.status).toEqual(400);
    })

    test("POST /blocks/ - Should NOT add a new block(422)", async () =>{
        
        const response = await request(app)
                                .post('/blocks/')
                                .send({});

        expect(response.status).toEqual(422);
    })
}) 