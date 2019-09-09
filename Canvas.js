defaultPos = {
    x: 0,
    y: 0,
};
defaultDim = {
    width: window.innerWidth,
    height: window.innerHeight,
};

class Canva$ {
    // drawFn is user supplied to be called at the end of drawFrame() args: canvasContext, analyserNode, dataArray, bufferLength
    constructor({fileName, fftSize = 128, pos = defaultPos, dim = defaultDim, drawFn, setIntervalsFn, useClock = true, autoStart = false }) {
        this.drawFn = drawFn;
        this.pos = pos;
        // buncha shit to set up the analyser node
        this.audioCtx = new AudioContext();
        this.audioElement = new Audio();
        this.audioElement.src = fileName;
        this.audioElement.autoplay = true;
        this.audioElement.preload = 'auto';
        this.audioSourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
        this.analyserNode = this.audioCtx.createAnalyser();
        this.analyserNode.fftSize = fftSize;
        this.bufferLength = this.analyserNode.frequencyBinCount;
        this.dataArray = new Float32Array(this.bufferLength);
        // create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = pos.x;
        this.canvas.style.left = pos.y;
        this.canvas.width = dim.width;
        this.canvas.height = dim.height;
        // songLength, clockStepSize, font, fillColor, backgroundColor, dimensions, position, autoStart, contextRules
        this.clock = useClock ? new Clock({ songLength: 144, autoStart: autoStart }) : false;
        autoStart? this.onStart() : this.drawPlayButton();
    }

    drawFrame() {
        const self = this;
        this.canvasContext.clearRect(this.pos.x, this.pos.y, this.canvas.width, this.canvas.height);
        requestAnimationFrame(self.drawFrame.bind(self));
        if (this.clock) {
            this.clock.draw(this.canvasContext);
        } 
        this.drawFn(this.canvasContext);
    }

    onStart() {
        this.audioSourceNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
        if (this.playButton) document.body.removeChild(this.playButton);
        document.body.appendChild(this.canvas);
        this.canvasContext = this.canvas.getContext('2d');
        setIntervalsFn();
        this.clock.start();
        this.drawFrame();
    }
    
    drawPlayButton() {
        this.playButton = document.createElement('div');
        this.playButton.innerHTML = '<p id="playButton" style="text-align:center;">&#9658;</p>'
        this.playButton.style.margin = 'auto';
        this.playButton.style.width = '50%';
        this.playButton.style.fontSize = '60px';
        this.playButton.onclick = this.onStart.bind(this)
        document.body.appendChild(this.playButton);
        var css = '#playButton:hover{ cursor: pointer; }';
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}