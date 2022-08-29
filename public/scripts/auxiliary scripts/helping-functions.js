prototypeFunction(Array, 'shuffleArray', function () {
    let result = [];
    while (this.length != 0) {
        result.push(...this.splice(random(this), 1));
    }
    return result;

    function random(arr) {
        return Math.floor(Math.random() * arr.length);
    }
});
prototypeFunction(Array, 'randomElement', function () {
    return this[Math.floor(Math.random() * this.length)];
})
prototypeFunction(Array, 'randomIndex', function () {
    return Math.floor(Math.random() * this.length);
})

// AF stands for auxilary function

function AF_getTeamColors (amount) {
    let colorFraction = 345 / amount;
    let huesArray = [];
    for (let i = 0; i < amount; i++) {
        huesArray.push(Math.floor(colorFraction * i));
    }
    let rgbArray = [];
    let rgbInvertedArray = [];
    let s = 100, l = 70;
    for (let hueColor of huesArray) {
        let rgbColor = HSLToRGB(hueColor, s, l);
        rgbColor = rgbColor.map(num => Math.floor(num)).join(', ');
        rgbArray.push(rgbColor)

        let hslInverted = invertHSL(hueColor, 70, 70);
        let rgbInvertedColor = HSLToRGB(...hslInverted);
        rgbInvertedColor = rgbInvertedColor.map(num => Math.floor(num)).join(', ');
        rgbInvertedArray.push(rgbInvertedColor)
    }
    let colorsArray = [];
    for (let key in rgbArray) {
        let color = rgbArray[key];
        colorsArray.push([color, rgbInvertedArray[key]]);
    }
    return colorsArray;

    function HSLToRGB(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
          l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [255 * f(0), 255 * f(8), 255 * f(4)];
    };
    function invertHSL (h, s, l) {
        if (h < 180) {
            h += 180;
        } else {
            h -= 180;
        }
        return [h, s, l];
    }
}

function prototypeFunction (type, name, func) {
    Object.defineProperty(type['prototype'], name, {
        value: func
    });
}
