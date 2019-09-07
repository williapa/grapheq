// here's where it all started: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
// properties to be animated at interval or one shot instead of based on frequency levels
// a few do have rules to behave differently after the drop (aka a certain volume threshold is broken for one eq band)
let xOffset = -48;
let spin = 7 * Math.PI / 4;
let opacity = .02;
let change = false;
let shadowOpacity = .01;
let warmUpColor = 0;
let arr = ["😔", "🍃", "🥺", "⏲️", "👨‍🍳", "🏫", "🚬", "🖥️", "🙌", "💸"];
let printOne = false;
let droppingY = window.innerHeight / 2;
let charIndex = 0;
let pretty = false;
let keyvalue = '🔑';

function Animator(obj) {
    this.min = obj.min;
    this.max = obj.max;
    this.val = obj.val;
    this.step = obj.step;
    const oscillate = () => {
        if (this.val >= this.max || this.val <= this.min) {
            this.step = -this.step;
        }
        this.val = this.val + this.step;
        return this.val;
    };
    const oneWay = () => {
        if (this.val < this.max) {
            this.val = this.val + this.step;
        }
        return this.val;
    }
    this.update = obj.hasOwnProperty('oneWay') ? oneWay : oscillate; 
};

const opacityAnimator = new Animator({ min: 0.01, max: .45, val: opacity, step: .01 });
// the spin sends the equalizer around the center ring but it caused too much lag, I'd rather have more EQ bars (fftSize)
// const spinAnimator = new Animator({ min: 0, max: 2 * Math.PI, val: spin, step: Math.PI / 360 });
const xAnimator = new Animator({ min: -96, max: 0, val: xOffset, step: .25 });
const shadowAnimator = new Animator({ min: 0, max: .8, val: shadowOpacity, step: .001, oneWay: true });
const warmUpColorAnimator = new Animator({ min: 0, max: 255, val: warmUpColor, step: .1, oneWay: true });

function drawEllipse(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.fillStyle = 'rgb(' + Math.floor(height + 100) + ', 50, 50)';
    ctx.ellipse(x + 1, y, width, height, Math.PI / 2, Math.PI, 0);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
};

function drawEqualizerBars(dataArray, bufferLength, spaceFromOrigin, barWidth, rotationBetweenBars, canvasCtx) {
    const ellipseWidthConstant = barWidth;
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = '#666';
    canvasCtx.rotate(spin);
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] + 80) > 0 ? Math.pow((dataArray[i] + 80), 2) / 25 : 0;
        const bw = (barHeight / 80) * ellipseWidthConstant;
        drawEllipse(canvasCtx, spaceFromOrigin, 0, bw, barHeight);
        canvasCtx.rotate(rotationBetweenBars);
    }
    canvasCtx.rotate(-spin);
};

function drawLonelyHeart(ctx) {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 1;
    ctx.font = '48px Monoton';
    ctx.fillText('💔', window.innerWidth / 2 - 36, droppingY);
    droppingY = droppingY + 1;
};

function drawMoneyPrint(dataArray, bufferLength, canvasCtx, characterPrint) {
    const widthCoefficient = window.innerWidth / window.innerHeight;
    const yDimension = Math.floor(Math.sqrt(bufferLength / widthCoefficient));
    const xDimension = Math.floor(yDimension * widthCoefficient);
    const padding = 100;
    const paddingAdj = 2.7;
    const xSpacing = ((window.innerWidth - padding * 2) / xDimension * 1.5);
    const ySpacing = (window.innerHeight - padding * 2) / yDimension;
    let x = padding * paddingAdj;
    let y = 32;
    canvasCtx.font = '24px Monoton';
    let z = 1;
    for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i] + 200;
        // TODO: make the shadows gray until the drop.
        const r = change ? value * value % 256 : 250;
        const g = change ? value * 69 % 256 : 250;
        const b = change ? value % 256 : 77; // don't have to do this value is never over 256... maybe someday though (super loud bro)
        const finalOpacity = change ? 1 : shadowOpacity;
        canvasCtx.shadowColor = 'rgb(' + r + ',' + g + ',' + b + ',' + finalOpacity + ')';
        canvasCtx.shadowOffsetX = value / 2;
        canvasCtx.shadowOffsetY = z * 16;
        // was 100, 10 was also cool
        canvasCtx.shadowBlur = value / 3;
        canvasCtx.globalAlpha = opacity;
        // const index = i % (characterPrint.length);
        // this could now be moved out of the for loop in addition to setting globalAlpha
        const charac = characterPrint[(charIndex % characterPrint.length)]; //[index];
        canvasCtx.fillText(charac, x + xOffset, y);
        if (i > 0 && (i + 1) % yDimension === 0) {
            y += (ySpacing * .95);
            x = padding * paddingAdj;
            z++;
        } else {
            x = x + xSpacing;
        }
    }
    opacity = opacityAnimator.update();
    if (opacity <= .01) {
        charIndex++;
    }
    xOffset = xAnimator.update();
    shadowOpacity = shadowAnimator.update();
    canvasCtx.shadoOffsetX = 0;
    canvasCtx.shadowOffsetY = 0;
    canvasCtx.globalAlpha = 1;
};

function startAnimation() {
    const audioCtx = new AudioContext();
    const audioElement = new Audio();
    audioElement.src = 'TRU LUV.mp3';
    audioElement.autoplay = true;
    audioElement.preload = 'auto';
    const audioSourceNode = audioCtx.createMediaElementSource(audioElement);
    const analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 128;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    audioSourceNode.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    function drawFrame() {
        requestAnimationFrame(drawFrame);
        analyserNode.getFloatFrequencyData(dataArray);
        canvasContext.fillStyle = 'rgb(' + warmUpColor + ',' + warmUpColor + ',' + warmUpColor + ')';
        warmUpColor = warmUpColorAnimator.update();
        if (dataArray[1] > -25) { 
            change = true;
        }
        if (change) {
            canvasContext.fillStyle = "darkred";
        }
        if (dataArray[1] > -30) {
            canvasContext.fillStyle = 'rgb(234, 219, 232)'; //"white"; changed to purple tint
        }
        if (change && dataArray[1] < -70) {
            canvasContext.fillStyle = "black";
        }
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.fillStyle = "rgb(0, 0, 0)";
        const originX = canvas.width / 2;
        const originY = canvas.height / 2;
        const barWidth = 6;
        const spaceFromOrigin = barWidth * 30;
        const rotation = (2 / bufferLength) * Math.PI;
        canvasContext.beginPath();
        canvasContext.arc(originX, originY, spaceFromOrigin, 0, 2 * Math.PI);
        canvasContext.fill();
        // draw graphic equalizer relative to the origin
        canvasContext.translate(originX, originY);
        drawEqualizerBars(dataArray, bufferLength, spaceFromOrigin, barWidth, rotation, canvasContext);
        // spin = spinAnimator.update();
        const topaz = (dataArray[0] + 100);
        canvasContext.font = topaz + 'px Monoton';
        canvasContext.fillText(keyvalue, -topaz / 2, topaz / 2);
        // for the guccemoji print we will move back to 0,0
        canvasContext.translate(-originX, -originY);
        canvasContext.font = '24px Monoton';
        canvasContext.shadowBlur = 0;
        canvasContext.shadowOffsetY = 25;
        canvasContext.shadowColor = "rgb(0,0,0,.65)";
        canvasContext.fillText('Key:Value', 50, 50);
        canvasContext.fillText('TRU LUV', canvas.width - 225, 50);
        printOne ? drawLonelyHeart(canvasContext) : drawMoneyPrint(dataArray, bufferLength, canvasContext, arr);
        if (pretty) {
            canvasContext.font = '12px exo';
            canvasContext.fillText('soundcloud.com/keyvalue', window.innerWidth / 4 - 24, window.innerHeight /2);
            canvasContext.shadowColor = 'rgb(210, 90, 92)';
            canvasContext.shadowOffsetX = -200;
            canvasContext.shadowOffsetY = 60;
        }
    };
    // todo: create mechanism to better orchestrate these timed changes
    setTimeout(function() {
        charIndex = 0;
        arr = [ "🌞", "💸", "👔", "👦", "👟", "📽️", "🍺", "👩‍🦰"];
    }, 36600);

    setTimeout(function() {
        charIndex = 0;
        arr = ["💏", "🥰", "🍂", "🍨", "❤️", "🦍", "🎉", "🎙️"];
    }, 70600);
    
    setTimeout(function () {
        arr = [''];
    }, 96300);

    setTimeout(function() {
        charIndex = 0;
        arr =  ["💔", "💔"];
    }, 99600);

    setTimeout(function() {
        charIndex = 0;
        arr = ["💔", "😢", "❄️", "🌨️", "💸"];
    }, 108000);

    setTimeout(function () {
        printOne = true;
    }, 120500);

    setTimeout(function () {
        keyvalue = '🔑💸';
        pretty = true;
    }, 132800);

    drawFrame();
};
