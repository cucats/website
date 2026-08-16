<script lang="ts">
  let div: HTMLDivElement;

  const cellSize = 32;
  const tick = 100;
  const respawnDelay = 2;
  const trailClasses = [
    "bg-secondary-600 opacity-55",
    "bg-secondary-600 opacity-45",
    "bg-secondary-600 opacity-35",
    "bg-secondary-700 opacity-30",
    "bg-secondary-700 opacity-25",
    "bg-secondary-700 opacity-20",
    "bg-secondary-700 opacity-15",
    "bg-secondary-800 opacity-10",
    "bg-secondary-800 opacity-10",
    "bg-secondary-800 opacity-5",
    "bg-secondary-900 opacity-5",
    "bg-secondary-900 opacity-5",
  ];
  let gridSizeX = $state(0);
  let gridSizeY = $state(0);
  let heads = $state<number[]>([]);
  let trails = $state<number[]>([]);

  function randomTrail(): number {
    return 5 + Math.floor(Math.random() * (trailClasses.length - 4));
  }

  function initDrops() {
    heads = Array.from(
      { length: gridSizeX },
      () => -Math.floor(Math.random() * gridSizeY * (1 + respawnDelay)),
    );
    trails = Array.from({ length: gridSizeX }, randomTrail);
  }

  function calculateGrid() {
    const rect = div.getBoundingClientRect();
    gridSizeX = Math.ceil(rect.width / cellSize);
    gridSizeY = Math.ceil(rect.height / cellSize);
    initDrops();
  }

  function step() {
    heads = heads.map((h, i) => {
      if (h - trails[i] > gridSizeY) {
        trails[i] = randomTrail();
        return -Math.floor(Math.random() * gridSizeY * respawnDelay);
      }
      return h + 1;
    });
  }

  function getCellClass(x: number, y: number): string {
    const d = heads[x] - y;
    if (d < 0 || d >= trailClasses.length || d > trails[x]) return "opacity-0";
    return trailClasses[d];
  }

  $effect(() => {
    calculateGrid();

    const interval = window.setInterval(step, tick);

    window.addEventListener("resize", calculateGrid);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", calculateGrid);
    };
  });
</script>

<div
  bind:this={div}
  class="grid h-full overflow-clip"
  style="grid-template-columns: repeat({gridSizeX}, {cellSize}px); grid-template-rows: repeat({gridSizeY}, {cellSize}px);"
>
  {#each { length: gridSizeY } as _, y}
    {#each { length: gridSizeX } as _, x}
      <div class={getCellClass(x, y)}></div>
    {/each}
  {/each}
</div>
