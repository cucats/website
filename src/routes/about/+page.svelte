<script lang="ts"></script>

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

      {#snippet committeeMember(role: string, name: string)}
        <div class="bg-secondary-800 w-50 overflow-hidden rounded-lg">
          <div class="bg-secondary-900 h-50">
            <!-- Image goes here when uploaded -->
          </div>
          <div class="p-4">
            <div class="mb-1 text-sm uppercase">
              <span class="font-bold text-neutral-300 opacity-80">{role}</span>
            </div>
            <div class="text-xl font-bold text-neutral-50">{name}</div>
          </div>
        </div>
      {/snippet}

      <h3 class="member-container-title">Executive</h3>
      <div class="member-container">
        {@render committeeMember("president", "Martina King")}
        {@render committeeMember("vice-president", "Jonathon Sun")}
        {@render committeeMember("treasurer", "Kkabir Bhalla")}
        {@render committeeMember("secretary", "Steven Wang")}
      </div>

      <h3 class="member-container-title">Socials</h3>
      <div class="member-container">
        {@render committeeMember("socials director", "Emily Kelt")}
        {@render committeeMember("part IA", "Lucas Evans")}
        {@render committeeMember("part IA", "Amey Gupta")}
        {@render committeeMember("part IB", "Emily Kelt")}
        {@render committeeMember("part II", "Tom Brennan")}
        {@render committeeMember("part II", "James Leung")}
        {@render committeeMember("part III", "Yasith Disanayakage")}
      </div>

      <h3 class="member-container-title">Events</h3>
      <div class="member-container">
        {@render committeeMember("event officer", "Amey Gupta")}
        {@render committeeMember("event officer", "Alex Pylypenko")}
        {@render committeeMember("event officer", "Andy Wu")}
      </div>

      <h3 class="member-container-title">Tech</h3>
      <div class="member-container">
        {@render committeeMember("tech director", "Steven Wang")}
        {@render committeeMember("webmaster", "Xi Nan Shu")}
        {@render committeeMember("tech officer", "Arya Golkari")}
        {@render committeeMember("tech officer", "John Williams")}
      </div>
    </div>
  </section>
</main>

<style lang="postcss">
  @reference "../../app.css";

  .member-container-title {
    @apply text-2xl font-bold;
  }

  .member-container {
    @apply bg-secondary-800/20 mb-4 flex flex-wrap justify-center gap-4 rounded-lg p-4;
  }
</style>
