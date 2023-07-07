import KeyPair from "../src/lib/keyPair";

describe("Wallet tests", () => {

    const exampleWIF = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ";

    let alice: KeyPair;

    beforeAll(() => {
        alice = new KeyPair();
    })

    test('Should generate wallet', () => {
        const wallet = new KeyPair();
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    })

    test('Should recover wallet (PK)', () => {
        const wallet = new KeyPair(alice.privateKey);
        expect(wallet.publicKey).toEqual(alice.publicKey);
    })

    test('Should recover wallet (WIF)', () => {
        const wallet = new KeyPair(exampleWIF);
        expect(wallet.publicKey).toBeTruthy();
        expect(wallet.privateKey).toBeTruthy();
    })
});