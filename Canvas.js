const defaultPos = {
    x: 0,
    y: 0,
};
const defaultDim = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const defaultEqConfig = {};
class Canva$ {
    // drawFn is user supplied to be called at the end of drawFrame() args: canvasContext, analyserNode, dataArray, bufferLength
    // TODO: move fftSize into eq config
    constructor({fileName, fftSize = 128, pos = defaultPos, dim = defaultDim, drawFn, interval = 40, useClock = true, equalizerConfig = defaultEqConfig }) {
        this.drawFn = drawFn;
        this.pos = pos;
        this.fileName = fileName;
        this.fftSize = fftSize;
        this.interval = interval;
        // create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = pos.x;
        this.canvas.style.left = pos.y;
        this.canvas.width = dim.width;
        this.canvas.height = dim.height;
        this.clock = useClock ? new Clock({ songLength: 144 }) : false;
        this.equalizer = equalizerConfig;
        this.drawPlayButton();
    }

    drawFrame() {
        const self = this;
        this.canvasContext.clearRect(this.pos.x, this.pos.y, this.canvas.width, this.canvas.height);
        requestAnimationFrame(self.drawFrame.bind(self));
        // TODO: make clock, equalizer, spinner, spectrograph all extend class widget and build a global similar to animator that allows for all to be draw() in a loop
        if (this.clock) this.clock.draw(this.canvasContext);
        if (this.equalizer) this.equalizer.draw(this.canvasContext);      
        this.drawFn(this.canvasContext);
    }

    onStart() {
        this.audioCtx = new AudioContext();
        this.audioElement = new Audio();
        this.audioElement.src = this.fileName;
        this.audioElement.autoplay = true;
        this.audioElement.preload = 'auto';
        this.audioSourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
        this.analyserNode = this.audioCtx.createAnalyser();
        this.analyserNode.fftSize = this.fftSize;
        this.bufferLength = this.analyserNode.frequencyBinCount;
        this.dataArray = new Float32Array(this.bufferLength);
        this.audioSourceNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
        if(this.equalizer) {
            this.equalizer.analyserNode = this.analyserNode;
            this.equalizer = new Equalizer(this.equalizer);
        } 
        this.audioCtx.resume();
        if (this.playButton) document.body.removeChild(this.playButton);
        document.body.appendChild(this.canvas);
        this.canvasContext = this.canvas.getContext('2d');
        this.setIntervalsFn();
        this.clock.start();
        this.drawFrame();
    }

    setIntervalsFn() {
        setInterval(() => {
            if(window.animators) {
                window.animators.forEach(function(animator) {
                    animator.update();
                });
            }
        }, this.interval);
    }
    
    drawPlayButton() {
        this.playButton = document.createElement('div');
        this.playButton.innerHTML = '<p id="playButton" style="margin:0 auto;border-radius:50%;border: 2px solid black;height:100px;width:100px;padding:0px 0px 12px 12px;">&#9658;</p>'
        this.playButton.style.margin = '0 auto';
        this.playButton.style.width = '50%';
        this.playButton.style.marginTop = '20%';
        this.playButton.style.fontSize = '100px';
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