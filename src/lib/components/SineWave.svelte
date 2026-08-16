<script lang="ts">
  let div: HTMLDivElement;

  const cellSize = 32;
  const tick = 100;
  let gridSizeX = $state(0);
  let gridSizeY = $state(0);
  let phase = $state(0);

  const cutoff = (x: number) =>
    gridSizeY -
    10 +
    Math.floor(
      2 * Math.sin(x / 8 + 2 + phase) +
        1 * Math.sin(x + phase) +
        1 * Math.sin(3 * x + 1 + phase) +
        1 * Math.sin(5 * x + 2 + phase) +
        2 * Math.sin(7 * x + 3 + phase) +
        2 * Math.sin(17 * x + 9 + phase),
    );

  function getCellClass(x: number, y: number): string {
    const ytop = cutoff(x);

    if (y < ytop - 3) return "opacity-40";
    if (y === ytop - 3) return "opacity-35";
    if (y === ytop - 2) return "opacity-30";
    if (y === ytop - 1) return "opacity-25";
    if (y === ytop + 0) return "opacity-20";
    if (y === ytop + 1) return "opacity-15";
    if (y === ytop + 2) return "opacity-10";
    if (y === ytop + 3) return "opacity-5";
    return "opacity-0";
  }

  function calculateGrid() {
    const rect = div.getBoundingClientRect();
    gridSizeX = Math.ceil(rect.width / cellSize);
    gridSizeY = Math.ceil(rect.height / cellSize);
  }

  $effect(() => {
    calculateGrid();

    const interval = window.setInterval(() => {
      phase += 0.15;
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
  class="grid h-full"
  style="grid-template-columns: repeat({gridSizeX}, {cellSize}px); grid-template-rows: repeat({gridSizeY}, {cellSize}px);"
>
  {#each { length: gridSizeY } as _, y}
    {#each { length: gridSizeX } as _, x}
      <div class="bg-primary-950 {getCellClass(x, y)}"></div>
    {/each}
  {/each}
</div>
