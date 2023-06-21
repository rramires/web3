import request from "supertest";
import { app } from "../src/server/server";

// mocks
jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

describe("Blockchain Server Tests", () => {


    test("GET /status", async () =>{
        const response = await request(app)
                                .get('/status/');

        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toEqual(true);
    })

    
})