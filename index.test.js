const draw = require("./modules/draw");

const SEPARATOR = "-------------";

/**
 * Test mock
 */
draw.draw = function(width, ...rest) {
    if ("throw" === width) {
        throw new Error("ERROR FROM DRAW");
    }
    return [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
};
/**
 * Test mock
 */
draw.drawToString = function() {
    return "---\n-|-\n - ";
};

const { handleRequest } = require("./index");

function main() {
    const testCases = [
        {
            input: {
                action: "draw",
                width: 20,
                height: 20,
                padding: 6
            },
            expected: { isOk: true, value: draw.draw() }
        },
        {
            input: {
                action: "print",
                width: 20,
                height: 20,
                padding: 6
            },
            expected: { isOk: true, value: draw.drawToString() }
        },
        {
            input: {
                action: "UNEXPECTED",
                width: 20,
                height: 20,
                padding: 6
            },
            expected: { isOk: false }
        },
        {
            input: {
                action: "UNEXPECTED",
                width: 20,
                height: 20,
                padding: 6
            },
            expected: { isOk: false }
        },
        {
            input: {
                action: "UNEXPECTED",
                width: "20",
                height: 20,
                padding: 6
            },
            expected: { isOk: false }
        },
        {
            input: {
                action: "UNEXPECTED",
                width: 20,
                height: NaN,
                padding: 6
            },
            expected: { isOk: false }
        },
        {
            input: {
                action: "print",
                width: "throw",
                height: 20,
                padding: 6
            },
            expected: { isOk: false }
        },
        {
            input: {},
            expected: { isOk: false }
        }
    ];

    console.log(SEPARATOR);
    console.log("Testing: handleRequest");
    console.log(SEPARATOR);

    testCases.forEach((testCase, i) => {
        /**
         * @type {number[][]}
         */
        const input = testCase.input;
        /**
         * @type {string}
         */
        const expected = testCase.expected;
        /**
         * @type {string}
         */
        const result = handleRequest(input);
        /**
         * NOTE: Benchmark showed that comparing values as strings
         * is faster than checking  all field individually.
         *
         * @type {boolean}
         */
        const isCorrect =
            JSON.stringify([result.isOk, result.value]) ===
            JSON.stringify([expected.isOk, expected.value]);

        console.log(
            `Input no: ${i + 1}, Result: ${isCorrect ? "PASSED" : "FAILED"}`
        );
        console.log(SEPARATOR);

        if (!isCorrect) {
            process.exit(1);
        }
    });
}

main();
