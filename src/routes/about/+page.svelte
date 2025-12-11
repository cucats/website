<script lang="ts">
  import DefaultProfile from "$lib/assets/default-profile.webp";
  import { onMount } from "svelte";
  let committee: any[] = [];

  onMount(async () =>
    fetch("/data/committee.json")
      .then((res) => res.json())
      .then((res) => {
        committee = res;
      }),
  );
</script>

<main class="bg-secondary-900">
  <section class="bg-secondary-800 pt-24 text-neutral-300">
    <div class="c-4 mx-auto max-w-5xl p-4">
      <h1 class="text-4xl font-bold md:text-5xl">About Us</h1>
      <p>
        Cambridge University Computing and Technology Society (<strong
          >CUCaTS</strong
        >) is the primary student-run computing society at Cambridge. We aim to
        provide a platform for students to explore and engage with technology,
        regardless of their degree or experience level.
      </p>
      <p>
        With hundreds of members, the society has a thriving community to run
        both its own events and programmes, whilst providing resources and
        funding to others with similar goals.
      </p>
    </div>
  </section>

  <section class="bg-secondary-700 text-neutral-300">
    <div class="c-4 mx-auto max-w-5xl p-4">
      <h2 class="my-4 text-3xl font-bold md:text-4xl">Aims</h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="c-4 bg-opacity-40 rounded-lg bg-neutral-800 p-4">
          <div>
            <enhanced:img
              src="$lib/assets/icons/graph.png"
              class="pixel size-8"
              alt="Build connections"
            />
          </div>
          <div class="text-xl font-bold uppercase">Build connections</div>
          <p>
            Provide members and potential employers with networking
            opportunities
          </p>
        </div>
        <div class="c-4 bg-opacity-40 rounded-lg bg-neutral-800 p-4">
          <div>
            <enhanced:img
              src="$lib/assets/icons/loudspeaker.png"
              class="pixel size-8"
              alt="Promote interest"
            />
          </div>
          <div class="text-xl font-bold uppercase">Promote interest</div>
          <p>
            Spark curiosity in computing amongst members and the general public
          </p>
        </div>
        <div class="c-4 bg-opacity-40 rounded-lg bg-neutral-800 p-4">
          <div>
            <enhanced:img
              src="$lib/assets/icons/steps.png"
              class="pixel size-8"
              alt="Support members"
            />
          </div>
          <div class="text-xl font-bold uppercase">Support members</div>
          <p>Help and fund members host events that align with our mission</p>
        </div>
        <div class="c-4 bg-opacity-40 rounded-lg bg-neutral-800 p-4">
          <div>
            <enhanced:img
              src="$lib/assets/icons/text.png"
              class="pixel size-8"
              alt="Encourage discussion"
            />
          </div>
          <div class="text-xl font-bold uppercase">Encourage discussion</div>
          <p>
            Provide a forum to discuss topics and issues concerning computing
            and IT
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-secondary-900 text-neutral-300">
    <div class="c-4 mx-auto max-w-5xl p-4">
      <h2 class="my-4 text-3xl font-bold md:text-4xl">Committee</h2>

      {#snippet committeeMember(member: any)}
        <div class="w-32 overflow-hidden md:w-48">
          <div
            class="bg-secondary-900 size-32 overflow-hidden rounded-lg select-none md:size-48"
          >
            {#if member.image}
              <img src={member.image} alt={`${member.name}'s portrait`} />
            {:else}
              <enhanced:img
                class="opacity-80"
                src={DefaultProfile}
                alt={`${member.name}'s portrait`}
              />
            {/if}
          </div>

          <div class="mt-4">
            <div class="text-xs font-bold text-neutral-50 uppercase opacity-60">
              {member.role}
            </div>
            <div class="text-md font-bold text-neutral-50">{member.name}</div>

            <div class="mt-2 flex gap-3 select-none">
              {#if member.email}
                <a href={`mailto:${member.email}`}>
                  <img
                    class="size-6 opacity-70 hover:opacity-90"
                    src="assets/icons/mail.svg"
                    alt="Mail icon"
                  />
                </a>
              {/if}

              {#if member.linkedin}
                <a href={member.linkedin}>
                  <img
                    class="size-6 object-contain opacity-70 invert hover:opacity-90"
                    src="assets/socials/linkedin.png"
                    alt="LinkedIn logo"
                  />
                </a>
              {/if}

              {#if member.website}
                <a href={member.website}>
                  <img
                    class="size-6 opacity-70 hover:opacity-90"
                    src="assets/icons/globe.svg"
                    alt="Website icon"
                  />
                </a>
              {/if}
            </div>
          </div>
        </div>
      {/snippet}

      {#each committee as group}
        <h3 class="member-container-title">{group.title}</h3>
        <div class="member-container">
          {#each group.members as member}
            {@render committeeMember(member)}
          {/each}
        </div>
      {/each}
    </div>
  </section>
</main>

<style lang="postcss">
  @reference "../../app.css";

  .member-container-title {
    @apply text-2xl font-bold;
  }

  .member-container {
    @apply bg-secondary-600/20 mb-4 flex flex-wrap justify-center gap-x-4 gap-y-8 rounded-lg px-4 py-8 md:gap-8 md:p-8;
  }
</style>
