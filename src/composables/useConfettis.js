import JSConfetti from 'js-confetti'

export function useConfetti() {

    const CANVAS_CLASS_NAME = 'confetti-canvas';

    function setCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.zIndex = '1000';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none'; // pour laisser cliquer au travers
        canvas.className = CANVAS_CLASS_NAME;
        document.body.appendChild(canvas);
        return canvas;
    }

    function removeCanvas(canvas) {
        canvas.remove();
    }

    async function displayConfettis() {
        const canvasConfettis = setCanvas();  // Création canvas pour confettis
        let jsConfetti = new JSConfetti({ canvas: canvasConfettis })
        
        await jsConfetti.addConfetti({
        confettiNumber: 500,
        confettiRadius: 10,
        });  // Affichage confettis
        await jsConfetti.addConfetti({
        emojis: ['🌈', '✨', '🌸'],
        emojiSize: 25
        });
        await jsConfetti.addConfetti({
        confettiNumber: 500
        });

        removeCanvas(canvasConfettis); // Qd confettis disparaisent, suppression canvas
    }

    return displayConfettis;
}