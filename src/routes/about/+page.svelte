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
  <title>About Us | CUCaTS</title>
  <meta name="robots" content="noindex, nofollow, noarchive" />
</svelte:head>

<main class="bg-primary-950 text-neutral-100">
  <section class="pt-40 pb-8">
    <div class="c-4 mx-auto max-w-7xl p-4">
      <h1 class="h1 mb-4 font-bold">About Us</h1>
      <p class="p max-w-2xl">
        Cambridge University Computing and Technology Society (<strong
          >CUCaTS</strong
        >) is the primary student-run computing society at Cambridge. We aim to
        provide a platform for students to explore and engage with technology,
        regardless of their degree or experience level.
      </p>
      <p class="p max-w-2xl">
        With hundreds of members, the society has a thriving community to run
        both its own events and programmes, whilst providing resources and
        funding to others with similar goals.
      </p>

      <h2 class="h2 mt-24 font-bold">Aims</h2>

      {#snippet aim(
        image: string,
        alt: string,
        title: string,
        description: string,
      )}
        <div
          class="bg-primary-950 flex items-center gap-4 border-y border-neutral-700 px-4 py-8"
        >
          <img src={image} class="pixel bg-primary-700 m-4 size-16" {alt} />

          <div class="text-neutral-100">
            <p class="mb-2 text-xl font-bold uppercase">{title}</p>
            <p class="p">{description}</p>
          </div>
        </div>
      {/snippet}

      <div class="grid grid-cols-1 text-neutral-200 md:grid-cols-2">
        {@render aim(
          "assets/icons/graph.svg",
          "graph",
          "Build connections",
          "Provide members and potential employers with networking opportunities",
        )}
        {@render aim(
          "assets/icons/loudspeaker.svg",
          "loudspeaker",
          "Promote interest",
          "Spark curiosity in computing amongst members and the general public",
        )}
        {@render aim(
          "assets/icons/steps.svg",
          "steps",
          "Support members",
          "Help and fund members host events that align with our mission",
        )}
        {@render aim(
          "assets/icons/text.svg",
          "text",
          "Encourage discussion",
          "Provide a forum to discuss topics and issues concerning computing and IT",
        )}
      </div>
    </div>
  </section>

  {#if committee.length}
    <section class="bg-primary-900 mt-24 pt-8">
      <div class="c-4 mx-auto max-w-7xl p-4">
        <h2 class="h2 mx-auto mb-8 font-bold">Committee</h2>

        {#snippet committeeMember(member: any)}
          <div class="max-w-32 md:max-w-48">
            <div
              class="bg-primary-900 size-32 overflow-hidden rounded-lg select-none md:size-48"
            >
              {#if member.image}
                <img
                  class="size-full object-cover"
                  src={member.image}
                  alt="Default portrait"
                />
              {:else}
                <enhanced:img
                  class="size-full opacity-80"
                  src={DefaultProfile}
                  alt={`${member.name}'s portrait`}
                />
              {/if}
            </div>

            <div class="py-4">
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
          <h3 class="h3 mx-auto font-bold">{group.title}</h3>
          <div
            class="mb-4 flex flex-wrap justify-evenly gap-x-4 gap-y-8 rounded-lg px-4 py-8 md:justify-center md:gap-8 md:p-8"
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
