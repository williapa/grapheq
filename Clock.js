defaultDimensions = {
    width: 2 * window.innerWidth / 3,
    height: 10,
};

defaultPosition = {
    x: window.innerWidth / 6,
    y: 5 * window.innerHeight / 6,
};

class Clock {
    constructor({ 
        songLength = 1, 
        clockStepSize = .1, 
        font = '24px arial', 
        fillColor = 'black', 
        backgroundColor = 'grey', 
        dimensions = defaultDimensions, 
        position = defaultPosition, 
        autoStart = false,
    }) {
        this.seconds = 0;
        this.completionRatio = 0;
        this.songLength = songLength;
        this.clockStepSize = clockStepSize;
        this.timeDisplay = '00:00';
        this.font = font;
        this.fillColor = fillColor;
        this.backgroundColor = backgroundColor;
        this.dimensions = dimensions;
        this.position = position;
        if (autoStart) this.start();
    };

    draw(ctx) {
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.position.x, this.position.y, this.dimensions.width + 1, this.dimensions.height);
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.position.x, this.position.y, this.dimensions.width * this.completionRatio, 10);
        ctx.fillText(this.timeDisplay, this.position.x, this.position.y + 40);
        ctx.restore();
    };

    updateTimeDisplay() {
        if (this.seconds < this.songLength) this.seconds = this.seconds + this.clockStepSize;
        const secondsFloor = Math.floor(this.seconds);
        const minutes = Math.floor(secondsFloor/60);
        const secondsMod = secondsFloor % 60;
        const secondHand = secondsMod < 10 ? `0${secondsMod}` : secondsMod;
        this.timeDisplay = `0${minutes}:${secondHand}`;
    };
    intervalFn() {
        this.completionRatio = this.seconds / this.songLength;
        this.updateTimeDisplay();
    };
    start() {
        setInterval(this.intervalFn.bind(this), this.clockStepSize * 1000);
    };
};