<script lang="ts">
  let { sections }: { sections: Array<{ slug: string; title: string }> } =
    $props();

  let activeSlug = $state("");

  $effect(() => {
    activeSlug = sections[0]?.slug ?? "";

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("h2[id]"),
    );
    if (headings.length === 0) return;

    // Recompute in document order from a batch of entries: entry order
    // within a batch is not guaranteed, so reacting to entries
    // individually can set a stale section.
    const update = () => {
      const line = window.innerHeight * 0.25;
      let current: HTMLElement | undefined;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading;
      }
      activeSlug = current?.id ?? headings[0].id;
    };

    const observer = new IntersectionObserver(update, {
      rootMargin: "0px 0px -75% 0px",
    });

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  });
</script>

{#if sections.length > 0}
  <aside
    class="sticky top-28 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto xl:block"
  >
    <nav aria-label="Table of contents">
      <h2 class="mb-3 text-sm font-semibold text-neutral-400">
        Table of contents
      </h2>
      <ul class="border-l border-neutral-700">
        {#each sections as section}
          <li>
            <a
              href="#{section.slug}"
              class="-ml-px block border-l py-1 pr-2 pl-4 text-sm transition-colors {activeSlug ===
              section.slug
                ? 'border-neutral-200 text-neutral-100'
                : 'border-transparent text-neutral-400 hover:text-neutral-100'}"
            >
              {section.title}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
{/if}
