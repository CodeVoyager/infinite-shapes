const { draw, drawToString } = require("./modules/draw");

const ACTION = 0;
const WIDTH = 1;
const HEIGHT = 2;
const PADDING = 3;
const args = process.argv.slice(2);

/**
 * Module front function
 *
 * @param { { action: string, width: number, height: number, padding: number }}
 * @returns {{isOk: boolean, value: any, err: Error}}
 */
function handleRequest({ action, width, height, padding }) {
    if ("number" !== typeof width || width !== width) {
        return { isOk: false, err: Error("Width must be number"), value: null };
    }
    if ("number" !== typeof height || height !== height) {
        return {
            isOk: false,
            err: Error("Height must be number")
        };
    }
    if ("number" !== typeof padding || padding !== padding) {
        return {
            isOk: false,
            err: Error("Padding must be number")
        };
    }
    try {
        switch (action) {
            case "draw": {
                return {
                    isOk: true,
                    value: draw(width, height, padding)
                };
            }
            case "print": {
                return {
                    isOk: true,
                    value: drawToString(draw(width, height, padding))
                };
            }

            default: {
                return {
                    isOk: false,
                    err: new Error("Unknown action specified")
                };
            }
        }
    } catch (e) {
        return {
            isOk: false,
            err: e
        };
    }
}

const action = args[ACTION];
const width = args[WIDTH];
const height = args[HEIGHT];
const padding = args[PADDING];

if (require.main === module) {
    if (undefined === action) {
        throw new Error("Action not specified");
    }
    if (undefined === width) {
        throw new Error("Width not specified");
    }
    if (undefined === height) {
        throw new Error("Height not specified");
    }
    if (undefined === padding) {
        throw new Error("Padding not specified");
    }
    const result = handleRequest({
        action,
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        padding: parseInt(padding, 10)
    });

    if (result.isOk) {
        console.log(result.value);
    } else {
        throw result.err;
    }
} else {
    module.exports = {
        draw,
        drawToString,
        handleRequest
    };
}
