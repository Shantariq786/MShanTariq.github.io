function initializeSolitonSimulation() {
    const canvas = document.getElementById('soliton-canvas');
    if (!canvas || canvas.dataset.initialized === 'true') return;

    const replayButton = document.getElementById('soliton-replay');
    const statusElement = document.getElementById('soliton-status');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.dataset.initialized = 'true';
    const config = {
        xMin: -34,
        xMax: 26,
        tMin: 0,
        tMax: 10,
        durationMs: 14000,
        samples: 640,
        k1: 0.55,
        k2: 0.92,
        x01: -8,
        x02: -20
    };

    let animationFrameId = null;
    let startTime = performance.now();
    let resizeRetryId = null;

    function resizeCanvas() {
        const bounds = canvas.getBoundingClientRect();
        if (bounds.width < 10 || bounds.height < 10) {
            resizeRetryId = window.setTimeout(resizeCanvas, 120);
            return;
        }

        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.max(1, Math.floor(bounds.width * dpr));
        canvas.height = Math.max(1, Math.floor(bounds.height * dpr));

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(dpr, dpr);

        if (resizeRetryId !== null) {
            window.clearTimeout(resizeRetryId);
            resizeRetryId = null;
        }
        if (animationFrameId !== null) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        render(performance.now());
    }

    function kdVTwoSoliton(x, t) {
        const { k1, k2, x01, x02 } = config;
        const eta1 = 2 * k1 * (x - 4 * k1 * k1 * t - x01);
        const eta2 = 2 * k2 * (x - 4 * k2 * k2 * t - x02);
        const a12 = ((k1 - k2) / (k1 + k2)) ** 2;

        const e1 = Math.exp(eta1);
        const e2 = Math.exp(eta2);
        const e12 = a12 * e1 * e2;
        const f = 1 + e1 + e2 + e12;
        const fx = 2 * k1 * e1 + 2 * k2 * e2 + 2 * (k1 + k2) * e12;
        const fxx = 4 * k1 * k1 * e1 + 4 * k2 * k2 * e2 + 4 * (k1 + k2) * (k1 + k2) * e12;

        return 2 * (fxx / f - (fx * fx) / (f * f));
    }

    function getStageLabel(t) {
        if (t < 3.7) return 'Separated Solitons';
        if (t < 6.2) return 'Collision in Progress';
        return 'Profiles Preserved After Collision';
    }

    function drawAxes(width, height, padding, yMax) {
        context.save();
        context.strokeStyle = 'rgba(148, 163, 184, 0.28)';
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(padding.left, height - padding.bottom);
        context.lineTo(width - padding.right, height - padding.bottom);
        context.stroke();

        context.beginPath();
        context.moveTo(padding.left, padding.top);
        context.lineTo(padding.left, height - padding.bottom);
        context.stroke();

        const tickCount = 5;
        context.fillStyle = 'rgba(226, 232, 240, 0.82)';
        context.font = '12px Nunito Sans, sans-serif';

        for (let i = 0; i <= tickCount; i += 1) {
            const tickX = padding.left + (i / tickCount) * (width - padding.left - padding.right);
            const value = config.xMin + (i / tickCount) * (config.xMax - config.xMin);

            context.beginPath();
            context.moveTo(tickX, height - padding.bottom);
            context.lineTo(tickX, height - padding.bottom + 6);
            context.stroke();
            context.fillText(value.toFixed(0), tickX - 10, height - padding.bottom + 20);
        }

        for (let i = 0; i <= 4; i += 1) {
            const tickY = height - padding.bottom - (i / 4) * (height - padding.top - padding.bottom);
            const value = (i / 4) * yMax;

            context.beginPath();
            context.moveTo(padding.left - 6, tickY);
            context.lineTo(padding.left, tickY);
            context.stroke();
            context.fillText(value.toFixed(1), padding.left - 34, tickY + 4);
        }

        context.restore();
    }

    function render(currentTime) {
        const bounds = canvas.getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;
        const padding = { top: 22, right: 16, bottom: 42, left: 46 };
        const elapsed = (currentTime - startTime) % config.durationMs;
        const t = config.tMin + (elapsed / config.durationMs) * (config.tMax - config.tMin);
        const yMax = 2.6;

        context.clearRect(0, 0, width, height);

        const background = context.createLinearGradient(0, 0, width, height);
        background.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
        background.addColorStop(1, 'rgba(30, 41, 59, 0.72)');
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);

        drawAxes(width, height, padding, yMax);

        const points = [];
        for (let i = 0; i < config.samples; i += 1) {
            const ratio = i / (config.samples - 1);
            const x = config.xMin + ratio * (config.xMax - config.xMin);
            const y = kdVTwoSoliton(x, t);
            points.push({ x, y });
        }

        const scaleX = (width - padding.left - padding.right) / (config.xMax - config.xMin);
        const scaleY = (height - padding.top - padding.bottom) / yMax;

        context.save();
        context.beginPath();
        points.forEach((point, index) => {
            const px = padding.left + (point.x - config.xMin) * scaleX;
            const py = height - padding.bottom - point.y * scaleY;
            if (index === 0) {
                context.moveTo(px, py);
            } else {
                context.lineTo(px, py);
            }
        });

        const fillGradient = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        fillGradient.addColorStop(0, 'rgba(125, 211, 252, 0.42)');
        fillGradient.addColorStop(1, 'rgba(96, 165, 250, 0.04)');

        context.lineTo(width - padding.right, height - padding.bottom);
        context.lineTo(padding.left, height - padding.bottom);
        context.closePath();
        context.fillStyle = fillGradient;
        context.fill();
        context.restore();

        context.save();
        context.beginPath();
        points.forEach((point, index) => {
            const px = padding.left + (point.x - config.xMin) * scaleX;
            const py = height - padding.bottom - point.y * scaleY;
            if (index === 0) {
                context.moveTo(px, py);
            } else {
                context.lineTo(px, py);
            }
        });
        context.strokeStyle = '#7dd3fc';
        context.lineWidth = 3;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.shadowColor = 'rgba(125, 211, 252, 0.35)';
        context.shadowBlur = 16;
        context.stroke();
        context.restore();

        context.fillStyle = 'rgba(226, 232, 240, 0.88)';
        context.font = '12px Montserrat, sans-serif';
        context.fillText(`time = ${t.toFixed(2)}`, width - 94, padding.top + 8);

        if (statusElement) {
            statusElement.textContent = getStageLabel(t);
        }

        animationFrameId = window.requestAnimationFrame(render);
    }

    if (replayButton) {
        replayButton.addEventListener('click', () => {
            startTime = performance.now();
        });
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('load', resizeCanvas, { once: true });
    resizeCanvas();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSolitonSimulation, { once: true });
} else {
    initializeSolitonSimulation();
}
