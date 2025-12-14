<script lang="ts">
  import Sponsor from "./Sponsor.svelte";
</script>

<main class="bg-tertiary-700">
  <section
    class="from-secondary-700 to-tertiary-700 bg-linear-to-br pt-32 pb-8 text-neutral-100"
  >
    <div class="c-4 mx-auto max-w-5xl p-4">
      <h1 class="h1 font-bold">Sponsors</h1>

      <p class="p">
        Our sponsors' support allows CUCaTS to continue running events. To see
        more information about a sponsor, click on the card.
      </p>

      <p class="p">
        For sponsorship enquiries, please email <a
          class="smooth-underline"
          href="mailto:president@cucats.org"
        >
          president@cucats.org
        </a>.
      </p>
    </div>
  </section>

  <section
    class="from-primary-800 via-secondary-800 to-tertiary-800 bg-linear-to-br pb-8"
  >
    <div class="c-4 mx-auto max-w-7xl p-4">
      <h2 class="sponsor-tier-title">Gold</h2>

      <div class="r-4 flex-wrap justify-center">
        <Sponsor tier="gold" logo="/assets/sponsors/anthropic.png">
          {#snippet name()}Anthropic{/snippet}
          <div class="r-4">
            <a
              class="btn primary sm font-bold"
              href="https://www.anthropic.com"
            >
              Website
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://www.anthropic.com/careers"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>

        <Sponsor tier="gold" logo="/assets/sponsors/janestreet.png">
          {#snippet name()}Jane Street{/snippet}
          <p>
            Our INSIGHT program is part of our commitment to give as many people
            as possible the chance to learn more about what we do.
          </p>
          <p>
            In this multi-day program, we invite women, transgender, and/or
            gender-expansive individuals to learn about the roles within our
            firm and how we solve challenges at Jane Street — including the
            specific concepts and tools we use in our daily work.
          </p>
          <p>
            As you explore opportunities within the program, you'll notice that
            event topics and locations will vary. We offer classes and
            activities in three separate tracks: software engineering, trading,
            and strategy and product.
          </p>
          <div class="r-4">
            <a
              class="btn primary sm font-bold"
              href="https://www.janestreet.com"
            >
              Website
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://www.janestreet.com/join-jane-street/open-roles/?type=internship&location=london"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>

        <Sponsor tier="gold" logo="/assets/sponsors/qrt.svg">
          {#snippet name()}Qube Research & Technologies{/snippet}
          <p>
            Qube Research & Technologies (QRT) is a global investment manager
            where we deploy a diverse range of investment strategies across
            geographies, asset classes and time frames. Combining data,
            research, technology and trading expertise has shaped QRT's
            collaborative mindset which enables us to solve the most complex
            challenges. QRT's culture of innovation continuously drives our
            ambition to deliver high quality returns for our investors.
          </p>
          <div class="r-4">
            <a class="btn primary sm font-bold" href="https://www.qube-rt.com">
              Website
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://www.qube-rt.com/careers/"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>

        <Sponsor tier="gold" logo="/assets/sponsors/sierra.png">
          {#snippet name()}Sierra{/snippet}
          <p>
            Sierra was founded in 2023 by Bret Taylor (chairman of the OpenAI
            board, ex-CTO of Meta) and Clay Bavor (led Google AR/VR labs, Google
            docs and enterprise products). Our mission is to help businesses
            build better, more human customer experiences with AI, by enabling
            the creation of customer-facing AI agents. Our global company has
            over 300 employees, four offices including our European hub in
            London, and works across a variety of industry verticals.
          </p>
          <p>
            Our solution replaces scripted bots with agents that can operate
            with operational flexibility that truly understand customers.
            Through our Agent OS, SDK, voice products and Agent Studio, we power
            hundreds of millions of conversations for some of the largest brands
            in the world, and we're just getting started. Sierra is valued at
            $10B with $635M in funding through Benchmark, Greenoaks and Sequoia
            Capital.
          </p>
          <div class="r-4">
            <a class="btn primary sm font-bold" href="https://sierra.ai/">
              Website
            </a>
          </div>
        </Sponsor>
      </div>

      <h2 class="sponsor-tier-title">Silver</h2>

      <div class="r-4 flex-wrap justify-center">
        <Sponsor tier="silver" logo="/assets/sponsors/incident.io.png">
          {#snippet name()}incident.io{/snippet}
          <p>
            incident.io is the single place you go when things go wrong - backed
            by a $62m Series B and trusted by companies like OpenAI, Lovable,
            and Netflix. We help engineering teams respond to and learn from
            incidents, minimise downtime, and focus on solving the problems that
            matter.
          </p>
          <div class="r-4">
            <a class="btn primary sm font-bold" href="https://incident.io">
              Website
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://go.incident.io/cucats"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>

        <Sponsor tier="silver" logo="/assets/sponsors/iterate.svg">
          {#snippet name()}Iterate{/snippet}
          <p>
            Iterate is building the future of autonomous companies. We believe
            one of the most valuable uses of AGI will be to build startups.
            We're starting by helping small teams automate their startups -
            today, we offer a customizable, AI chief of staff that automates
            tedious ops processes like filing invoices, onboarding new hires,
            requesting tax credits etc.
          </p>
          <p>
            Founded by the former co-founder and CTO of Monzo, Iterate is backed
            by the world's best investors, including OpenAI, Index Ventures, and
            the founders behind Anthropic, Mistral, and other class-leading
            companies.
          </p>
          <p>
            We are a small, deeply technical team based out of London, driven by
            the ambition to redefine what humans can build with AI.
          </p>
          <div class="r-4">
            <a class="btn primary sm font-bold" href="https://iterate.com">
              Website
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://www.iterate.com/careers"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>

        <Sponsor tier="silver" logo="/assets/sponsors/mwam.png">
          {#snippet name()}Marshall Wace{/snippet}
          <p>
            Marshall Wace is a leading provider of alternative investment
            solutions.
          </p>
          <p>
            Operating as a single team across the globe, we are dedicated to
            creating long-term relationships with our clients built on trust and
            integrity. We define our culture as one of continuous innovation and
            a quest for improvement. We instinctively strive to do things
            differently, with fresh thinking that we believe enables us to
            create proprietary value and maximise the benefits to our clients.
          </p>
          <p>
            As a firm, we have a hunger to do more, chasing innovation and
            pushing the boundaries of what's possible.
          </p>
          <p>
            Technological innovation has long been the cornerstone of our
            business. We continuously invest in our systems, data,
            infrastructure and people in our efforts to maximise the alpha we
            deliver for our clients.
          </p>
          <p>
            We strive to stay at the forefront of advancements in technology and
            view this as a key competitive advantage. Our staff are constantly
            seeking new ways to automate and streamline complex processes using
            a diverse mix of cutting-edge tools. Every member of our staff is
            expected to seek out new opportunities and push for advancements to
            our platform.
          </p>
          <div class="r-4">
            <a class="btn primary sm font-bold" href="https://www.mwam.com">
              Website
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://www.mwam.com/technology-internship-programme"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>

        <Sponsor tier="silver" logo="/assets/sponsors/optiver.png">
          {#snippet name()}Optiver{/snippet}
          <p>
            Unlock the world of algorithmic trading with The Optiver & Cambridge
            Trading Academy. Led by industry experts, this comprehensive
            8-session course takes you from options theory to hands-on Python
            algorithm design.
          </p>
          <p>
            Test your skills on Optiver's 24/7 simulated market, Optibook, and
            compete in pairs to win an exciting prize. Gain practical skills and
            knowledge directly applicable to a career in finance and trading.
            Register to express your interest in joining the academy and be the
            first to know when applications open!
          </p>
          <div class="r-4">
            <a
              class="btn primary sm font-bold"
              href="https://optiver.com/recruitment-events/save-the-date-the-optiver-cambridge-trading-academy/"
            >
              Register interest
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://optiver.com/working-at-optiver/career-opportunities/page/2/?search=internship"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>

        <Sponsor tier="silver" logo="/assets/sponsors/visa.svg">
          {#snippet name()}Visa{/snippet}
          <p>
            Visa is a world leader in digital payments, facilitating more than
            276 billion payments transactions between consumers, merchants,
            financial institutions, and government entities across more than 200
            countries and territories each year. Our mission is to connect the
            world through the most innovative, convenient, reliable, and secure
            payments network, enabling individuals, businesses, and economies to
            thrive.
          </p>
          <p>
            When you join Visa, you join a culture of purpose and belonging –
            where your growth is priority, your identity is embraced, and the
            work you do matters. We believe that economies that include everyone
            everywhere, uplift everyone everywhere. Your work will have a direct
            impact on billions of people around the world – helping unlock
            financial access to enable the future of money movement.
          </p>

          <div class="r-4">
            <a
              class="btn primary sm font-bold"
              href="https://usa.visa.com/business.html"
            >
              Website
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://corporate.visa.com/en/careers/early-careers.html"
            >
              View opportunities
            </a>
          </div>
        </Sponsor>
      </div>

      <h2 class="sponsor-tier-title">Bronze</h2>

      <div class="r-4 flex-wrap justify-center">
        <Sponsor tier="bronze" logo="/assets/sponsors/tpp.png">
          {#snippet name()}TPP{/snippet}
          <p>
            TPP is a global digital health company. With over 7,000
            organisations using our solutions to care for over 50 million
            patients, our software is used across all health and social care
            settings, including GPs, emergency departments, hospitals and mental
            health services. This means that wherever and whenever a patient
            needs care, a detailed and up-to-date record is available. No other
            company has a digital healthcare solution on this scale. Our
            database is one of the largest in the world. It processes a billion
            transactions daily – more than the London Stock Exchange and Visa
            combined.
          </p>
          <p>
            We are always looking for talented and motivated students to join
            our team. If you are interested in functional programming,
            compilers, programming languages, or distributed systems, we would
            love to hear from you. We offer internships, summer projects, and
            PhD positions.
          </p>
          <div class="r-4">
            <a class="btn primary sm font-bold" href="https://tpp-careers.com">
              View opportunities
            </a>
            <a
              class="btn primary sm font-bold"
              href="https://tpp-careers.com/roles/graduate-software-developer"
            >
              Graduate roles
            </a>
          </div>
        </Sponsor>
      </div>
    </div>
  </section>
</main>

<style lang="postcss">
  @reference "tailwindcss";

  .sponsor-tier-title {
    @apply my-8 text-center text-3xl font-bold text-neutral-100 md:text-4xl;
  }
</style>
