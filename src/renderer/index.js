export const STATUS_STOPPED = 0;
export const STATUS_RUNNING = 1;
export const STATUS_STOPPING = 1;

export default class Renderer {
    constructor(canvas) {
        this.cvs = canvas;
        this.ctx = canvas.getContext("2d");
        this.status = STATUS_STOPPED;
        this._stopCallback = null;
    }

    start(fps = 0, frameCount, frameCallback) {
        let resolvePromise;

        let realTime = !fps;

        let startTime = Date.now();
        let delta = 0;
        let angle = 0;
        let r = 10;

        // start
        let renderFrame = () => {
            // calculate the delta time
            if(realTime) {
                let newStartTime = Date.now();
                delta = (newStartTime - startTime) / 1000;
                startTime = newStartTime;
            } else {
                // constant delta
                delta = 1 / fps;
            }

            angle += Math.PI * delta;
            r += 10 * delta;

            this.ctx.fillStyle = "#222222";
            this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);

            this.ctx.strokeStyle = "red";
            this.ctx.lineWidth = 2;

            this.ctx.save();
            this.ctx.translate(this.cvs.width / 2, this.cvs.height / 2);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            this.ctx.stroke();
            this.ctx.restore();

            if(typeof frameCallback === "function") {
                frameCallback();
            }

            if(typeof frameCount === "number") {
                frameCount--;

                if(frameCount <= 0) {
                    this.status = STATUS_STOPPING;
                }
            }

            if(this.status === STATUS_STOPPING) {
                resolvePromise();

                if(this._stopCallback) {
                    this._stopCallback();
                }

                this.status = STATUS_STOPPED;
            } else {
                if(realTime) {
                    // render in real time
                    requestAnimationFrame(renderFrame);
                } else {
                    // render as fast as possible
                    setTimeout(renderFrame, 0);
                }
            }
        };

        renderFrame();

        return new Promise(resolve => {
            resolvePromise = resolve;
        });
    }

    stop() {
        return new Promise(resolve => {
            this._stopCallback = resolve;
            this.status = STATUS_STOPPING;
        });
    }
}
