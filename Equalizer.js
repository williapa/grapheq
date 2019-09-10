const barWidthConstant = 10;
// fft returns a value between -100 and 0 for db for the band so in order to display this, add 100. You can adjust this to kill quiet parts, increase tension etc. 
const dbToPixelsAdjustment = 150;
const layout = {
    type: 'line', 
    x: window.innerWidth / 3,
    xEnd: 2 * window.innerWidth / 3,
    y: 3 * window.innerHeight / 4,
    // circle: radius, start, end
};
const barWidth = (db) => {
    return barWidthConstant;
};
// TODO: look at analyserNode min and max decibels to avoid directional change / fluttery peaks
const barHeight = (db) => {
    return -(db + dbToPixelsAdjustment);
};
// line or circle
// line: start, end, barWidth
// circle: radius (dist from origin)
// circle start (radian position)
// circle end (radian position)
class Equalizer {
    constructor({ barShape = 'rectangle', barWidthFn = barWidth, barHeightFn = barHeight, analyserNode, eqBands = 32, eqLayout = layout }) { //fftSize / 2 = eq bands
        this.barShape = barShape;
        this.barWidthFn = barWidthFn;
        this.barHeightFn = barHeightFn;
        this.analyserNode = analyserNode;
        this.analyserNode.fftSize = eqBands;
        this.eqLayout = this.validateEqLayout(eqLayout)? eqLayout : layout;
        this.dataArray = new Float32Array(this.analyserNode.frequencyBinCount);
    }

    draw(ctx) {
        this.analyserNode.getFloatFrequencyData(this.dataArray);
        switch(this.eqLayout.type.toLowerCase()) {
            case 'circle':
                // TODO: implement
                break;
            default: // line
                this.drawLinearEq(ctx);
        }
    }

    drawLinearEq(ctx) {
        let x = this.eqLayout.x;
        const xEnd = this.eqLayout.xEnd;
        // you could also just use the calculated bar width but then it might spill out of frame and may not be uniform (depending on barWidthFn)
        const xStep = (xEnd - x) / this.dataArray.length;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#666';
        ctx.fillStyle = "red";
        for (var i = 0; i < this.dataArray.length; i++) {
            const val = this.dataArray[i];
            // set styles for rectangle before switch - todo: make configurable from obj
            
            switch(this.barShape.toLowerCase()) {
                case 'ellipse':
                    // TODO
                    break;
                case 'parabola':
                    // TODO
                    break;
                default: // rectangle
                    ctx.fillRect(x, this.eqLayout.y, this.barWidthFn(val), this.barHeightFn(val));
            }
            x += xStep;
        }
        ctx.restore();
    }

    validateEqLayout(l) {
        if (layout === l) return true;
        if (!l.hasOwnProperty('type')) {
            return false;
        }
        const n = 'number';
        if (l.type.toLowerCase() === 'line') {
            return l.hasOwnProperty('x') && typeof l.x === n &&
            l.hasOwnProperty('xEnd') && typeof l.xEnd === n &&
            l.hasOwnProperty('y') && typeof l === n;
        } 
        return l.type === "circle" && l.hasOwnProperty('radius') && 
            typeof l.radius === n && l.hasOwnProperty(start) && 
            typeof l.start === n && l.hasOwnProperty('end') && typeof l.end === n;
    }
}