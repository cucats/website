<script lang="ts">
  let { name }: { name: string } = $props();

  const SIZE = 8;

  function hash(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed: number) {
    return () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const pixels = $derived.by(() => {
    const rand = mulberry32(hash(name));
    const hue1 = Math.floor(rand() * 360);
    const hue2 = (hue1 + 45) % 360;
    const waves = Array.from({ length: 4 }, () => ({
      fx: rand(),
      fy: rand(),
      phase: rand() * Math.PI * 2,
      amp: 0.5 + rand(),
    }));
    const total = waves.reduce((sum, w) => sum + w.amp, 0);
    return {
      hue1,
      hue2,
      cells: Array.from({ length: SIZE * SIZE }, (_, i) => {
        const x = i % SIZE;
        const y = Math.floor(i / SIZE);
        const v = waves.reduce(
          (sum, w) => sum + w.amp * Math.sin(w.fx * x + w.fy * y + w.phase),
          0,
        );
        return (v / total + 1) / 2;
      }),
    };
  });
</script>

<div class="grid size-full" style="grid-template-columns: repeat({SIZE}, 1fr);">
  {#each pixels.cells as v}
    <div
      style="background-color: color-mix(in hsl, hsl({pixels.hue1} 60% 50%), hsl({pixels.hue2} 60% 50%) {v *
        100}%);"
    ></div>
  {/each}
</div>
