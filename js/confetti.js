let particleCount = 7;
let colors = ['#E1306C', '#F56040', '#FCAF45', '#405DE6', '#5851DB'];
let ticks = 150;

document.getElementById('more-confetti-toggle').addEventListener('change', function () {
    if (this.checked) {
        particleCount = 10;
        colors = [
            '#E1306C',
            '#F56040',
            '#FCAF45',
            '#405DE6',
            '#5851DB',
            '#1DB954',
            '#00C896',
            '#12CBC4',
            '#FF6EC7',
            '#FF9F1C',
            '#A259FF',
            '#FF3CAC'
        ];
        ticks = 200;
    } else {
        particleCount = 7;
        colors = ['#E1306C', '#F56040', '#FCAF45', '#405DE6', '#5851DB'];
        ticks = 150;
    }
});

document.getElementById('confetti-button').addEventListener('click', function () {

    if (this.disabled) return;
    this.disabled = true;
    this.classList.add('disabled');

    const duration = 2000;
    const end = Date.now() + duration;
    const button = this;

    function frame() {
        confetti({
            particleCount: particleCount,
            angle: 60,
            spread: 55,
            origin: {x: -0.1},
            gravity: 0.7,
            scalar: 0.7,
            drift: 0,
            ticks: ticks,
            colors: colors,
        });

        confetti({
            particleCount: particleCount,
            angle: 120,
            spread: 55,
            origin: {x: 1.1},
            y: 0,
            gravity: 0.7,
            scalar: 0.7,
            drift: 0,
            ticks: ticks,
            colors: colors,
        });

        confetti({
            particleCount: particleCount * 1.5,
            angle: 90,
            spread: 120,
            origin: {x: 0.5, y: -0.1},
            gravity: 1.5,
            scalar: 0.7,
            drift: 0,
            ticks: ticks,
            colors: colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        } else {
            setTimeout(function () {
                button.disabled = false;
                button.classList.remove('disabled');
            }, 550);

        }
    }

    frame();
});