<script lang="ts">
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

<main class="text-neutral-100">
  {#if committee && committee.length}
    <section class="bg-primary-900 pt-40">
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
                  src="$lib/assets/default-profile.webp"
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
            class="mx-auto mb-4 grid grid-cols-2 justify-evenly gap-x-4 gap-y-8 rounded-lg px-4 py-8 sm:grid-cols-3 md:justify-center md:gap-8 md:p-8 lg:grid-cols-4"
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
