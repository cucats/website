<script lang="ts">
    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement = $state()!;
    let context: CanvasRenderingContext2D | null = null;

    let gridSizeX: number;
    let gridSizeY: number;
    const cellSize = 16;
    const animationDelay = 100; // in ms
    const liveCellOpacity = 0.1;
    const deadCellOpacity = 0.0;
    let grid: number[][] = [];

    /**
     * Initialize the grid with random live (1) and dead (0) cells
     */
    function initializeGrid(): void {
        grid = Array.from({ length: gridSizeY }, () =>
            Array.from({ length: gridSizeX }, () => (Math.random() > 0.8 ? 1 : 0)),
        );
    }

    /**
     * Compute the next state of the grid
     */
    function computeNextState(): void {
        const nextGrid = grid.map((row) => [...row]); // Create a copy of the grid

        for (let y = 0; y < gridSizeY; y++) {
            for (let x = 0; x < gridSizeX; x++) {
                let neighbors = 0;

                // Count live neighbors
                for (let dy of [-1, 0, 1]) {
                    for (let dx of [-1, 0, 1]) {
                        if (dx === 0 && dy === 0) continue; // Skip the current cell
                        const nx = x + dx;
                        const ny = y + dy;

                        // Check boundaries
                        if (nx >= 0 && ny >= 0 && nx < gridSizeX && ny < gridSizeY) {
                            neighbors += grid[ny][nx];
                        }
                    }
                }

                if (grid[y][x] === 1) {
                    nextGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
                } else {
                    nextGrid[y][x] = neighbors === 3 ? 1 : 0;
                }
            }
        }

        grid = nextGrid;
    }

    /**
     * Draw the grid on the canvas
     */
    function drawGrid(): void {
        if (!context) return;
        if (!canvas) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < gridSizeY; y++) {
            for (let x = 0; x < gridSizeX; x++) {
                if (grid[y][x] === 1) {
                    // Live cells
                    context.fillStyle = `rgba(52, 152, 219, ${liveCellOpacity})`;
                } else {
                    // Dead cells
                    context.fillStyle = `rgba(236, 240, 241, ${deadCellOpacity})`;
                }
                context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }

    /**
     * Animation loop with delay
     */
    function animate(): void {
        setTimeout(() => {
            computeNextState();
            drawGrid();
            animate();
        }, animationDelay);
    }

    /**
     * Resize canvas to fit the screen
     */
    function resizeCanvas(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Calculate grid dimensions based on the screen size
        gridSizeX = Math.floor(width / cellSize);
        gridSizeY = Math.floor(height / cellSize);

        canvas.width = gridSizeX * cellSize;
        canvas.height = gridSizeY * cellSize;

        initializeGrid();
        drawGrid();
    }

    /**
     * Toggle cell state on mouse click
     */
    function toggleCell(event: MouseEvent): void {
        const rect = canvas.getBoundingClientRect(); // Get canvas position

        // calculate clicked cell coordinates
        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);

        if (x >= 0 && y >= 0 && x < gridSizeX && y < gridSizeY) {
            grid[y][x] = grid[y][x] === 1 ? 0 : 1;
            drawGrid();
        }
    }

    onMount(() => {
        context = canvas.getContext("2d");
        if (!context) {
            console.error("Failed to get canvas context");
            return;
        }

        resizeCanvas();
        animate();

        canvas.addEventListener("click", toggleCell);

        window.addEventListener("resize", resizeCanvas);
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            canvas.removeEventListener("click", toggleCell);
        };
    });
</script>

<canvas bind:this={canvas} style="position: fixed; top: 0; left: 0; z-index: 0; cursor: pointer;"
></canvas>
