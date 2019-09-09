const dropAnimator = new Animator({ min: 0, max: window.innerHeight, val: 1, step: 1, oneWay: true });

function drawLonelyHeart(ctx, droppingY) {
    ctx.save();
    ctx.font = '48px Monoton';
    ctx.fillText('💔', window.innerWidth / 2 - 24, droppingY);
    ctx.restore();
};

function setIntervalsFn() {
    setInterval(() => {
        dropAnimator.update();
    }, 40);
};

const drawFn =(canvasContext) => {
    drawLonelyHeart(canvasContext, dropAnimator.val);
};

const canvas = new Canva$({ fileName: 'TRU LUV.mp3', setIntervalsFn, drawFn: drawFn });
