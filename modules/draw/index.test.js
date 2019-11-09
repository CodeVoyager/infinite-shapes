const path = require("path");
const fs = require("fs");
const { draw, drawToString } = require(".");

const DEFAULT_TEST_DATA = path.join(__dirname, "..", "..", "test-data.json");
const TEST_DATA_FILENAME = 0;
const args = process.argv.slice(2);
const SEPARATOR = "-------------";

/**
 * Reads and parses input test data file.
 */
function getTestData() {
    return new Promise((resolve, reject) => {
        /**
         * @type {string}
         */
        const testDataFilename = args[TEST_DATA_FILENAME] || DEFAULT_TEST_DATA;

        fs.readFile(testDataFilename, (err, data) => {
            if (err) {
                reject(err);
            }
            try {
                resolve(JSON.parse(data.toString()));
            } catch (e) {
                reject(new Error("Unable to parse input data"));
            }
        });
    });
}

/**
 * Main tests function
 */
async function main() {
    try {
        /**
         * @type {{input: string, pixelArrayJson: number[][]}[]}
         */
        const drawTestCases = await getTestData();
        const printTestCases = [
            { input: [[1, 1, 1]], expected: "---" },
            {
                input: [[1, 1, 1], [1, 2, 1], [0, 1, 0]],
                expected: "---\n-|-\n - "
            },
            { input: [], expected: "" }
        ];

        console.log(SEPARATOR);
        console.log("Testing: drawing");
        console.log(SEPARATOR);

        drawTestCases.forEach(testCase => {
            /**
             * @type {number[]}
             */
            const inputAsNumbers = testCase.input
                .split(",")
                .map(x => parseInt(x, 10));
            /**
             * @type {number[]}
             */
            const [width, height, padding] = inputAsNumbers;
            /**
             * @type {number[][]}
             */
            const expected = testCase.pixelArrayJson;
            /**
             * @type {number[][]}
             */
            const result = draw(width, height, padding);
            /**
             * NOTE: Benchmark showed that comparing values as strings
             * is faster than checking  all field individually.
             *
             * @type {boolean}
             */
            const isCorrect = JSON.stringify(result) === expected;

            console.log(
                `Width: ${width}, Height: ${height}, Padding: ${padding}, Result: ${
                    isCorrect ? "PASSED" : "FAILED"
                }`
            );
            console.log(SEPARATOR);

            if (!isCorrect) {
                process.exit(1);
            }
        });

        console.log(SEPARATOR);
        console.log("Testing: printing");
        console.log(SEPARATOR);

        printTestCases.forEach((testCase, i) => {
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
            const result = drawToString(input);
            /**
             * NOTE: Benchmark showed that comparing values as strings
             * is faster than checking  all field individually.
             *
             * @type {boolean}
             */
            const isCorrect = result === expected;

            console.log(
                `Input no: ${i + 1}, Result: ${isCorrect ? "PASSED" : "FAILED"}`
            );
            console.log(SEPARATOR);

            if (!isCorrect) {
                process.exit(1);
            }
        });
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

main();
