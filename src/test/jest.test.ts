function testFunction(a: number, b: number): number {
    return a + b;
}

describe("Can run Jest as typescript", () => {
    it('should be able to run', function () {
        expect(true).toBe(true);
    });

    it('should be able to get 3 from that test function', function () {
        expect(testFunction(1, 2)).toBe(3);
    });

    it('should not get 4 from that test function', function () {
        expect(testFunction(1, 2)).not.toBe(4);
    });
});