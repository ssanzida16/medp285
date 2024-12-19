document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const brushSizeInput = document.getElementById("brush-size");
    const brushColorInput = document.getElementById("brush-color");
    const brushTypeSelect = document.getElementById("brush-type");
    const eraserCheckbox = document.getElementById("eraser");
    const undoButton = document.getElementById("undo");
    const redoButton = document.getElementById("redo");
    const soundscapeSelect = document.getElementById("soundscape");
    const saveButton = document.getElementById("save");

    // Set canvas size
    canvas.width = window.innerWidth - 300; // Adjust for sidebar
    canvas.height = window.innerHeight;

    let drawing = false;
    let brushSize = brushSizeInput.value;
    let brushColor = brushColorInput.value;
    let brushType = brushTypeSelect.value;
    let eraserMode = false;

    // Store actions for undo/redo
    const actions = [];
    let actionIndex = -1;

    // Soundscape
    let audio = null;

    // Start drawing
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Brush size, color, and type
    brushSizeInput.addEventListener("input", updateBrushSize);
    brushColorInput.addEventListener("input", updateBrushColor);
    brushTypeSelect.addEventListener("change", updateBrushType);

    // Eraser toggle
    eraserCheckbox.addEventListener("change", toggleEraser);

    // Undo and redo buttons
    undoButton.addEventListener("click", undo);
    redoButton.addEventListener("click", redo);

    // Soundscape selection
    soundscapeSelect.addEventListener("change", changeSoundscape);

    // Save the canvas as an image
    saveButton.addEventListener("click", saveCanvas);

    function startDrawing(e) {
        drawing = true;
        draw(e);
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        if (eraserMode) {
            erase(x, y);
        } else {
            if (brushType === "sparkle") {
                drawSparkle(x, y);
            } else if (brushType === "trail") {
                drawTrail(x, y);
            } else if (brushType === "drip") {
                drawDrip(x, y);
            }
        }

        storeAction();
    }

    function drawSparkle(x, y) {
        ctx.fillStyle = brushColor;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawTrail(x, y) {
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function drawDrip(x, y) {
        ctx.fillStyle = brushColor;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function erase(x, y) {
        ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    }

    function updateBrushSize() {
        brushSize = brushSizeInput.value;
    }

    function updateBrushColor() {
        brushColor = brushColorInput.value;
    }

    function updateBrushType() {
        brushType = brushTypeSelect.value;
    }

    function toggleEraser() {
        eraserMode = eraserCheckbox.checked;
    }

    function storeAction() {
        if (actionIndex < actions.length - 1) {
            actions.length = actionIndex + 1; // Discard actions after current index
        }
        actions.push(canvas.toDataURL());
        actionIndex++;
    }

    function undo() {
        if (actionIndex > 0) {
            actionIndex--;
            const img = new Image();
            img.src = actions[actionIndex];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    function redo() {
        if (actionIndex < actions.length - 1) {
            actionIndex++;
            const img = new Image();
            img.src = actions[actionIndex];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    function changeSoundscape() {
        if (audio) {
            audio.pause();
        }

        const soundscape = soundscapeSelect.value;

        if (soundscape === "rain") {
            audio = new Audio("rain-sound.mp3");
        } else if (soundscape === "ocean") {
            audio = new Audio("ocean-sound.mp3");
        } else if (soundscape === "forest") {
            audio = new Audio("forest-sound.mp3");
        } else {
            audio = null;
        }

        if (audio) {
            audio.loop = true;
            audio.play();
        }
    }

    function saveCanvas() {
        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "my-artwork.png";
        link.click();
    }
});
