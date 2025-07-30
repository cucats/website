<script lang="ts">
  import { onMount } from "svelte";

  let gridSizeX: number;
  let gridSizeY: number;

  let div: HTMLDivElement;

  const cellSize = 32;
  const tick = 160; // milliseconds
  let grid: boolean[][] = [];

  const initGrid = (f: (x: number, y: number) => boolean) =>
    Array.from({ length: gridSizeY }, (_, y) =>
      Array.from({ length: gridSizeX }, (_, x) => f(x, y)),
    );

  const cutoff = (x: number) =>
    gridSizeY -
    10 +
    Math.floor(
      2 * Math.sin(x / 8 + 2) +
        1 * Math.sin(x) +
        1 * Math.sin(3 * x + 1) +
        1 * Math.sin(5 * x + 2) +
        2 * Math.sin(7 * x + 3) +
        2 * Math.sin(17 * x + 9),
    );

  const nextGrid = (grid: boolean[][]) =>
    initGrid((x, y) => {
      const ytop = cutoff(x);

      // Stop updating cells above the cutoff + transition zone
      if (y > ytop + 3) {
        return grid[y][x];
      }

      // Gradually reduce update probability near cutoff
      if (y > ytop - 4) {
        const distance = y - (ytop - 4);
        const updateProbability = 1 - distance / 7;
        if (Math.random() > updateProbability) {
          return grid[y][x];
        }
      }

      // Neighbours
      let nb = 0;

      for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;

          // Check boundaries
          if (0 <= nx && nx < gridSizeX && 0 <= ny && ny < gridSizeY) {
            if (grid[ny][nx]) {
              nb++;
            }
          }
        }
      }

      return !grid[y][x] ? nb === 3 || nb === 4 : nb === 3 || nb === 4;
    });

  function getCellClass(x: number, y: number): string {
    const ytop = cutoff(x);

    if (y < ytop - 3) return grid[y][x] ? "opacity-40" : "opacity-35";
    if (y === ytop - 3) return grid[y][x] ? "opacity-35" : "opacity-35";
    if (y === ytop - 2) return grid[y][x] ? "opacity-30" : "opacity-25";
    if (y === ytop - 1) return grid[y][x] ? "opacity-25" : "opacity-20";
    if (y === ytop + 0) return grid[y][x] ? "opacity-20" : "opacity-15";
    if (y === ytop + 1) return grid[y][x] ? "opacity-15" : "opacity-10";
    if (y === ytop + 2) return grid[y][x] ? "opacity-10" : "opacity-5";
    if (y === ytop + 3) return grid[y][x] ? "opacity-5" : "opacity-0";
    return "opacity-0";
  }

  /**
   * Calculate grid dimensions based on container
   */
  function calculateGrid() {
    const rect = div.getBoundingClientRect();
    const newSizeX = Math.ceil(rect.width / cellSize);
    const newSizeY = Math.ceil(rect.height / cellSize);

    // If this is the first time, initialize the grid
    if (!grid.length) {
      gridSizeX = newSizeX;
      gridSizeY = newSizeY;
      grid = initGrid(() => Math.random() < 0.2);
      return;
    }

    // Initialize new grid with random values
    const newGrid: boolean[][] = Array.from({ length: newSizeY }, () =>
      Array.from({ length: newSizeX }, () => Math.random() < 0.25),
    );

    // Copy existing cells to center of new grid, overwriting the random values
    const offsetX = Math.floor((newSizeX - gridSizeX) / 2);
    const offsetY = Math.floor((newSizeY - gridSizeY) / 2);

    for (let y = 0; y < Math.min(gridSizeY, newSizeY); y++) {
      for (let x = 0; x < Math.min(gridSizeX, newSizeX); x++) {
        const newX = x + (offsetX > 0 ? offsetX : 0);
        const newY = y + (offsetY > 0 ? offsetY : 0);
        const oldX = x + (offsetX < 0 ? -offsetX : 0);
        const oldY = y + (offsetY < 0 ? -offsetY : 0);

        if (
          oldX < gridSizeX &&
          oldY < gridSizeY &&
          newX < newSizeX &&
          newY < newSizeY
        ) {
          newGrid[newY][newX] = grid[oldY][oldX];
        }
      }
    }

    gridSizeX = newSizeX;
    gridSizeY = newSizeY;
    grid = newGrid;
  }

  onMount(() => {
    calculateGrid();

    const interval = window.setInterval(() => {
      grid = nextGrid(grid);
    }, tick);

    window.addEventListener("resize", calculateGrid);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", calculateGrid);
    };
  });
</script>

<div
  bind:this={div}
  class="grid h-full duration-100"
  style="grid-template-columns: repeat({gridSizeX}, {cellSize}px); grid-template-rows: repeat({gridSizeY}, {cellSize}px);"
>
  {#each grid as row, y}
    {#each row as _, x}
      <div class="bg-primary-950 {getCellClass(x, y)}"></div>
    {/each}
  {/each}
</div>
