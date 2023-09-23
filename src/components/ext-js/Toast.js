const DEFAULT_OPTIONS = {
    autoClose: 5000,
    position: "top-right",
    onClose: () => {},
    canClose: true,
    showProgress: true,
    width: '300px'
}

export default function Toast(options) {
    const createContainer = function(position) {
        const container = document.createElement("div");
        container.classList.add("toast-container");
        container.dataset.position = position;
        document.body.append(container);
        return container;
    }

    function update(options) {
        Object.entries(options).forEach(([key, value]) => checker[key] = value)
    }

    const checker = {
        toastElem: null,
        autoCloseInterval: null,
        progressInterval: null,
        removeBinded: null,
        unpause: null,
        isPaused: false,
        pause: null,
        shouldUnPause: null,
        visibilityChange: null,
        timeVisible: 0,
        autoCloseValue: null,
        onClose: () => {},
        remove: function() {
            cancelAnimationFrame(this.autoCloseInterval);
            cancelAnimationFrame(this.progressInterval);
            const container = this.toastElem.parentElement;
            this.toastElem.classList.remove("show");
            this.toastElem.addEventListener("transitionend", () => {
                this.toastElem.remove();
                if (container.hasChildNodes()) return;
                container.remove();
            });
            this.onClose();
        },
        set width(value) {
            const container = document.querySelector(`.toast-container`)
            container.style.setProperty("--width", value);
        },
        set autoClose(value) {
            this.timeVisible = 0;
            this.autoCloseValue = value;
            if (value === false) return;
            let lastTime;
            const func = time => {
                if (this.shouldUnPause) {
                    lastTime = null;
                    this.shouldUnPause = false;
                }
                if (lastTime == null) {
                    lastTime = time;
                    this.autoCloseInterval = requestAnimationFrame(func);
                    return;
                }
                if (!this.isPaused) {
                    this.timeVisible += time - lastTime;
                    if (this.timeVisible >= value) {
                        this.remove();
                        return;
                    }
                }
      
                lastTime = time;
                this.autoCloseInterval = requestAnimationFrame(func);
            }
            this.autoCloseInterval = requestAnimationFrame(func);
        },
        set position(value) {
            const currentContainer = this.toastElem.parentElement;
            const selector = `.toast-container[data-position="${value}"]`;
            const container = document.querySelector(selector) || createContainer(value);
            container.append(this.toastElem);
            if (currentContainer == null || currentContainer.hasChildNodes()) return;
            currentContainer.remove();
        },
        set text(value) {
            console.log('Text', value);
            // this.toastElem.textContent = JSON.parse(value)
            this.toastElem.innerHTML = JSON.parse(value)
        },
        set canClose(value) {
            this.toastElem.classList.toggle("can-close", value);
            if (value) this.toastElem.addEventListener("click", this.removeBinded);
            else this.toastElem.removeEventListener("click", this.removeBinded);
        },
        set showProgress(value) {
            this.toastElem.classList.toggle("progress", value);
            this.toastElem.style.setProperty("--progress", 1);
            this.toastElem.style.setProperty("--color", 'red');
      
            if (value) {
                const func = () => {
                    if (!this.isPaused) {
                        this.toastElem.style.setProperty(
                            "--progress",
                            1 - this.timeVisible / this.autoCloseValue
                        )
                    }
                    this.progressInterval = requestAnimationFrame(func)
                }
                this.progressInterval = requestAnimationFrame(func)
            }
        },
        set pauseOnHover(value) {
            if (value) {
                this.toastElem.addEventListener("mouseover", this.pause);
                this.toastElem.addEventListener("mouseleave", this.unpause);
            } else {
                this.toastElem.removeEventListener("mouseover", this.pause);
                this.toastElem.removeEventListener("mouseleave", this.unpause);
            }
        },
        set pauseOnFocusLoss(value) {
            if (value) document.addEventListener("visibilitychange", this.visibilityChange);
            else document.removeEventListener("visibilitychange", this.visibilityChange);
        }
    }
    
    console.log('Toast Initiated');
    checker.toastElem = document.createElement("div");
    checker.toastElem.classList.add("toast");
    requestAnimationFrame(() => checker.toastElem.classList.add("show"));
    checker.removeBinded = checker.remove.bind(checker);
    checker.unpause = () => (checker.isPaused = false);
    checker.pause = () => (checker.isPaused = true);
    checker.visibilityChange = () => (checker.shouldUnPause = document.visibilityState === "visible");
    update({ ...DEFAULT_OPTIONS, ...options });
}