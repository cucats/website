<script lang="ts">
  import Event from "./ArchiveEvent.svelte";
  import Calendar from "./Calendar.svelte";

  const formatDateRange = (dates: Date[]) => {
    if (dates.length === 0) return "";
    if (dates.length === 1) {
      return dates[0].toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    const start = dates[0];
    const end = dates[dates.length - 1];

    return `${start.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })} – ${end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };
</script>

<main class="bg-tertiary-800">
  <section class="bg-tertiary-800 pt-24 text-neutral-300">
    <div class="c-4 mx-auto max-w-7xl p-4">
      <h1 class="text-4xl font-bold md:text-5xl">Events</h1>
      <p>
        Check our private Discord for up-to-date information and announcements.
      </p>
    </div>
  </section>

  <section class="bg-tertiary-900 text-neutral-300">
    <div class="mx-auto max-w-7xl p-4">
      <Calendar />
    </div>
  </section>

  <section class="bg-tertiary-800 text-neutral-300">
    <div class="c-4 mx-auto max-w-5xl p-4">
      <h2 class="text-3xl font-bold md:text-4xl">Archive</h2>

      <div class="c-4">
        <!-- CUCaTS × Anthropic Event -->
        <Event website="https://forms.gle/5BNss8APeFZdZEgG9">
          {#snippet title()}CUCaTS × Anthropic Speaker Event + Hackathon{/snippet}
          {#snippet date()}{formatDateRange([new Date("2025-06-18")])}{/snippet}
          {#snippet description()}
            AI alignment talk by Hoagy Cunningham, free food provided by Aromi,
            Claude demo with Greg Feingold, and a fast-paced, informal
            hackathon. All participants will receive $50 of free Anthropic API
            Credits, with additional prizes for winners.
          {/snippet}
        </Event>

        <!-- Speaker event + Dinner -->
        <Event website="https://forms.gle/mNsgPnroizzu7NvbA">
          {#snippet title()}Speaker event + Dinner{/snippet}
          {#snippet date()}{formatDateRange([new Date("2025-05-29")])}{/snippet}
          {#snippet description()}
            Sunoo Park: Two Tales of End-to-End Encryption. This talk explores
            two emerging threats to end-to-end encryption, including government
            and commercial circumvention. It examines the Encrochat hack, as
            well as the risks posed by the growing integration of AI into
            communication platforms. There will be a free dinner at Pho
            afterwards.
          {/snippet}
        </Event>

        <!-- CUES × CUCATS AI Hackathon -->
        <Event
          website="https://www.cues.org.uk/event/cues-x-cucats-ai-hackathon-2025"
          logo="/assets/events/cues.png"
        >
          {#snippet title()}CUES × CUCATS AI Hackathon{/snippet}
          {#snippet date()}{formatDateRange([
              new Date("2025-03-08"),
              new Date("2025-03-09"),
            ])}{/snippet}
          {#snippet description()}
            Supported by Arm and Anthropic. Join for an exciting opportunity to
            build innovative AI agent applications.
          {/snippet}
        </Event>

        <!-- Cambridge Game Jam 2025 -->
        <Event website="https://camgamejam.com" logo="/assets/events/jam.png">
          {#snippet title()}Cambridge Game Jam 2025{/snippet}
          {#snippet date()}{formatDateRange([
              new Date("2025-02-07"),
              new Date("2025-02-09"),
            ])}{/snippet}
          {#snippet description()}
            The Game Jam is similar to a hackathon: you have 48h to develop a
            game that fits a specific theme (revealed at the beginning of the
            event).
          {/snippet}
        </Event>

        <!-- CUCaTS Advent of Code -->
        <Event website="https://aoc.cucats.org/about">
          {#snippet title()}CUCaTS Advent of Code{/snippet}
          {#snippet date()}{formatDateRange([
              new Date("2024-12-01"),
              new Date("2024-12-25"),
            ])}{/snippet}
          {#snippet description()}
            Inspired by the global Advent of Code, our version adds a CUCaTS
            twist! Each day at 12:00 p.m., a new challenge will be posted for
            you to solve and earn points.
          {/snippet}
        </Event>

        <!-- Cam Hack 2024 -->
        <Event website="https://camhack.org" logo="/assets/events/camhack.png">
          {#snippet title()}Cam Hack 2024{/snippet}
          {#snippet date()}{formatDateRange([
              new Date("2024-11-02"),
              new Date("2024-11-03"),
            ])}{/snippet}
          {#snippet description()}
            Cam Hack is a 32 hour hackathon for the innovative minds at the
            University of Cambridge. Over an action-packed weekend, students
            come together to design and build technology projects from the
            ground up.
          {/snippet}
        </Event>
      </div>
    </div>
  </section>
</main>
