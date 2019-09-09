function Animator({ min, max, val, step = false, oneway = false }) {
    this.min = min;
    this.max = max;
    this.val = val;
    this.step = step;
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
    this.update = oneway ? oneWay : oscillate; 
};