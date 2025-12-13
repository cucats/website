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

<svelte:head>
  <title>About Us</title>
  <meta name="robots" content="noindex, nofollow, noarchive" />
</svelte:head>

<main class="bg-primary-800 text-neutral-200">
  <section class="pt-32 pb-8">
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

      <h2 class="mt-8 text-3xl font-bold md:text-4xl">Aims</h2>

      {#snippet aim(image: string, title: string, description: string)}
        <div class="c-4 bg-tertiary-900 rounded-lg p-4">
          <div>
            <img src={image} class="pixel size-8" alt="" />
          </div>
          <h3 class="text-xl font-bold uppercase">{title}</h3>
          <p>{description}</p>
        </div>
      {/snippet}

      <div class="grid grid-cols-1 gap-4 text-neutral-300 md:grid-cols-2">
        {@render aim(
          "assets/icons/graph.svg",
          "Build connections",
          "Provide members and potential employers with networking opportunities",
        )}
        {@render aim(
          "assets/icons/loudspeaker.svg",
          "Promote interest",
          "Spark curiosity in computing amongst members and the general public",
        )}
        {@render aim(
          "assets/icons/steps.svg",
          "Support members",
          "Help and fund members host events that align with our mission",
        )}
        {@render aim(
          "assets/icons/text.svg",
          "Encourage discussion",
          "Provide a forum to discuss topics and issues concerning computing and IT",
        )}
      </div>
    </div>
  </section>

  {#if committee.length}
    <section class="bg-tertiary-900 pt-8 text-neutral-300">
      <div class="c-4 mx-auto max-w-5xl p-4">
        <h2 class="mb-4 text-3xl font-bold md:text-4xl">Committee</h2>

        {#snippet committeeMember(member: any)}
          <div class="w-32 overflow-hidden md:w-48">
            <div
              class="bg-tertiary-900 size-32 overflow-hidden rounded-lg select-none md:size-48"
            >
              {#if member.image}
                <img
                  class="size-full object-cover"
                  src={member.image}
                  alt={`${member.name}'s portrait`}
                />
              {:else}
                <enhanced:img
                  class="opacity-80"
                  src={DefaultProfile}
                  alt={`${member.name}'s portrait`}
                />
              {/if}
            </div>

            <div class="mt-4">
              <div
                class="text-xs font-bold text-neutral-50 uppercase opacity-60"
              >
                {member.role}
              </div>
              <div class="text-md font-bold text-neutral-50">{member.name}</div>

              <div class="mt-2 flex gap-3 select-none">
                {#if member.email}
                  <a href={`mailto:${member.email}`}>
                    <img
                      class="size-6 opacity-70 hover:opacity-90"
                      src="/assets/icons/mail.svg"
                      alt="Mail icon"
                    />
                  </a>
                {/if}

                {#if member.linkedin}
                  <a href={member.linkedin}>
                    <img
                      class="size-6 object-contain opacity-70 invert hover:opacity-90"
                      src="/assets/socials/linkedin.png"
                      alt="LinkedIn logo"
                    />
                  </a>
                {/if}

                {#if member.website}
                  <a href={member.website}>
                    <img
                      class="size-6 opacity-70 hover:opacity-90"
                      src="/assets/icons/globe.svg"
                      alt="Website icon"
                    />
                  </a>
                {/if}
              </div>
            </div>
          </div>
        {/snippet}

        {#each committee as group}
          <h3 class="text-2xl font-bold">{group.title}</h3>
          <div
            class="bg-primary-600/20 mb-4 flex flex-wrap justify-center gap-x-4 gap-y-8 rounded-lg px-4 py-8 md:gap-8 md:p-8"
          >
            {#each group.members as member}
              {@render committeeMember(member)}
            {/each}
          </div>
        {/each}
      </div>
    </section>
  {/if}
</main>
