// animators
const dropAnimator = new Animator({ min: 0, max: window.innerHeight, val: 1, step: 1, type: "oneway" });
const xRandomAnimator = new Animator({ min: -10, max: 10, val: 0, step: .05, type: "random" });
const yRandomAnimator = new Animator({ min: -10, max: 10, val: 0, step: .05, type: "random" });
// scale values
const xScale = 4;
const yScale = 6;
// boolean triggers for timeouts/oneshot
let setTimeouts = false;
let tenSecondDelay = false;

function setOneShots(ctx) {
    setTimeout(() => {
        tenSecondDelay = true;
    }, 10000);
    return true;
};

function drawLonelyHeart(ctx, x, y) {
    ctx.save();
    ctx.font = '48px Monoton';
    ctx.fillText('💔', x, y);
    ctx.restore();
};

const drawFn = (canvasContext) => {
    setTimeouts = setTimeouts ? true : setOneShots(canvasContext);
    drawLonelyHeart(canvasContext, window.innerWidth / 2 + (xScale * xRandomAnimator.val), dropAnimator.val + (yScale * yRandomAnimator.val));
    if(tenSecondDelay) {
        drawLonelyHeart(canvasContext, window.innerWidth / 2 + 10 * xRandomAnimator.val, window.innerHeight / 2 + 10 * yRandomAnimator.val);
    }
};

const canvas = new Canva$({ fileName: 'TRU LUV.mp3', drawFn: drawFn });

