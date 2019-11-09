const CHARACTER_MAP = [" ", "-", "|"];

function trampoline(f) {
    while ("function" === typeof f) {
        f = f();
    }

    return f;
}

function drawAux({ width, height, padding, acc, offsetLeft, offsetTop }) {
    // console.log(width, height, padding, offsetLeft, offsetTop);

    if (width < 2) {
        return acc;
    }
    if (height < 2) {
        return acc;
    }

    let i = offsetTop;
    let j = -1;

    while (++j < width) {
        acc[i][j + offsetLeft] = 1;
        acc[i + height - 1][j + offsetLeft] = 1;
    }

    i = 0;
    while (++i < height - 1) {
        acc[i + offsetTop][offsetLeft] = 2;
        acc[i + offsetTop][offsetLeft + width - 1] = 2;
    }

    const newWidth = width - padding - 2;
    const newHeigth = height - padding - 2;

    return () =>
        drawAux({
            width: newWidth,
            height: newHeigth,
            offsetLeft: offsetLeft + padding / 2 + 1,
            offsetTop: offsetTop + padding / 2 + 1,
            acc,
            padding
        });
}

/**
 *
 *
 * @param {number} width
 * @param {number} height
 * @param {number} padding
 * @returns number[][]
 */
function draw(width, height, padding) {
    const acc = [...Array(height)].map(() => [...Array(width)].map(() => 0));

    if (width < 20) {
        throw new Error("Width must larger than 20");
    }
    if (width % 2 !== 0) {
        throw new Error("Width must even");
    }
    if (height < 20) {
        throw new Error("Height must larger than 20");
    }
    if (height % 2 !== 0) {
        throw new Error("Height must even");
    }
    if (padding < 4) {
        throw new Error("Padding must larger than 4");
    }
    if (padding % 2 !== 0) {
        throw new Error("Padding must even");
    }

    return trampoline(
        drawAux({
            width,
            height,
            acc,
            padding,
            offsetTop: 0,
            offsetLeft: 0
        })
    );
}

/**
 * Draws array as string
 *
 * @param {number[][]} arr
 * @returns string
 */
function drawToString(arr) {
    return arr
        .map(subArray => subArray.map(n => CHARACTER_MAP[n]).join(""))
        .join("\n");
}

module.exports = {
    draw,
    drawToString
};
