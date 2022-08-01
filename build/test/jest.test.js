function sum(a, b) {
    return a + b;
}
describe("Should be able to", () => {
    describe("do basic function tests such as", () => {
        test("1 + 1 = 2", () => {
            expect(sum(1, 1)).toEqual(2);
        });
        test("1 + 2 != 2", () => {
            expect(sum(1, 2)).not.toEqual(2);
        });
    });
    // test("mock now.", async t => {
    //     // const clock = useFakeTimers();
    //     // const now = DateTime.now().toUnixInteger();
    //     // t.same(now, DateTime.now().toUnixInteger(), "Should be same time.");
    //     //
    //     // clock.restore();
    //     // t.end();
    // });
});
//# sourceMappingURL=jest.test.js.map