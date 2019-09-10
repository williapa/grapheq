class Animator {
    constructor({ min, max, val, step = false, type = "oscillate" }) {
        this.min = min;
        this.max = max;
        this.val = val;
        this.step = step;
        this.type = type;
        if(window.hasOwnProperty('animators')) {
            window.animators.push(this);
        } else {
            window.animators = [this]; 
        }
    }

    oneWay() {
        this.val = (this.val < this.max && this.val > this.min) ? this.val + this.step : this.val;
    }

    oscillate() {
        if (this.headedOutOfBounds()) {
            this.step = -this.step;
        }
        this.val = this.val + this.step;
    };

    random() {
        // if random is greater than .5, switch the step direction
        const invert = Math.round(Math.random());
        if (invert) {
            this.step = -this.step;
        }
        // headed out of bounds accounts for the current step direction
        if (this.headedOutOfBounds()) {
            this.step = -this.step;
        } 
        this.val = this.val + this.step;
    }

    update() {
        // call update function based on animation type
        switch(this.type.toLowerCase()) {
            case 'oneway': 
                this.oneWay();
                break;
            case 'random':
                this.random();
            default:
                this.oscillate();
        }
    }

    headedOutOfBounds() {
        return (this.val >= this.max && this.step > 0) || (this.val <= this.min && this.step < 0);
    }
}