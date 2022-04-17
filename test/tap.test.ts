import dayjs from "dayjs";
import { useFakeTimers } from "sinon";
import { pass, test } from "tap";

pass("Tap is working fine.");

function sum(a: number, b: number): number {
    return a + b;
}

test("Should be able to", async t => {
    await t.test("do basic function test.", t => {
        t.equal(sum(1, 1), 2);
        t.not(sum(1, 3), 2);
        t.end();
    });

    await t.test("mock now.", async t => {
        const clock = useFakeTimers();
        const now = dayjs();
        t.same(now.unix(), dayjs().unix(), "Should be same time.");

        clock.restore();
        t.end();
    });
});