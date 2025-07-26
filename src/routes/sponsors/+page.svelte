<script lang="ts">
    import Sponsor from "./Sponsor.svelte";
</script>

<main class="bg-tertiary-700">
    <section class="from-secondary-700 to-tertiary-700 bg-gradient-to-br pt-24 text-neutral-100">
        <div class="c-4 p-4-8 mx-auto max-w-screen-lg">
            <h1 class="text-4xl font-bold sm:text-5xl">Sponsors</h1>

            <p>
                Our sponsors' support allows CUCaTS to continue running events. To see more
                information about a sponsor, click on the card.
            </p>

            <p>
                For sponsorship enquiries, please email <a href="mailto:president@cucats.org">
                    president@cucats.org
                </a>.
            </p>
        </div>
    </section>

    <section
        class="from-primary-800 via-secondary-800 to-tertiary-800 border-y-2 border-y-neutral-100 bg-gradient-to-br"
    >
        <div class="c-4 p-4-8 mx-auto max-w-screen-xl">
            <h2 class="my-8 text-center text-3xl font-bold text-neutral-100 md:text-4xl">Gold</h2>

            <div class="r-4 flex-wrap justify-center">
                <Sponsor tier="large" logo="/assets/sponsors/anthropic.png">
                    {#snippet name()}Anthropic{/snippet}
                    <div class="r-4">
                        <a class="btn primary sm font-bold" href="https://www.anthropic.com">
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

                <Sponsor tier="large" logo="/assets/sponsors/hrt.png">
                    {#snippet name()}Hudson River Trading{/snippet}
                    <p>
                        At Hudson River Trading (HRT) we are mathematicians, computer scientists,
                        statisticians, physicists and engineers. We research and develop automated
                        trading algorithms using advanced mathematical techniques. We have built one
                        of the world's most sophisticated compute environments, and our researchers
                        are at the forefront of innovation in the world of algorithmic trading and
                        machine learning.
                    </p>
                    <p>
                        HRT was founded in 2002 by computer scientists and mathematicians who
                        believed that math and technology could transform financial markets. They
                        developed the algorithms that became the foundation for HRT's continued
                        success across global asset classes. Today, we are global industry leaders,
                        and a leading voice for fair and open markets. Our trading creates stronger
                        markets for all investors, and all our work is built upon our rigorous code
                        of ethics.
                    </p>
                    <p>
                        We're a community of self-starters, critical thinkers, and eager
                        problem-solvers. Collaboration is at the heart of our success — from an
                        open-source code base to lively cross-team lunches in our cafe, a spirit of
                        openness underscores everything we do. We celebrate great ideas from HRT
                        veterans and new hires alike. We love solving the most complex problems in
                        trading and technology, and believe the best work can only be done together.
                    </p>
                    <div class="r-4">
                        <a
                            class="btn primary sm font-bold"
                            href="https://www.hudsonrivertrading.com">Website</a
                        >
                        <a
                            class="btn primary sm font-bold"
                            href="https://www.hudsonrivertrading.com/hrtbeat">Blog</a
                        >
                    </div>
                </Sponsor>

                <Sponsor tier="large" logo="/assets/sponsors/janestreet.png">
                    {#snippet name()}Jane Street{/snippet}
                    <p>
                        Our INSIGHT program is part of our commitment to give as many people as
                        possible the chance to learn more about what we do.
                    </p>
                    <p>
                        In this multi-day program, we invite women, transgender, and/or
                        gender-expansive individuals to learn about the roles within our firm and
                        how we solve challenges at Jane Street — including the specific concepts and
                        tools we use in our daily work.
                    </p>
                    <p>
                        As you explore opportunities within the program, you'll notice that event
                        topics and locations will vary. We offer classes and activities in three
                        separate tracks: software engineering, trading, and strategy and product.
                    </p>
                    <div class="r-4">
                        <a class="btn primary sm font-bold" href="https://www.janestreet.com">
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

                <Sponsor tier="large" logo="/assets/sponsors/qrt.svg">
                    {#snippet name()}Qube Research & Technologies{/snippet}
                    <p>
                        Qube Research & Technologies (QRT) is a global investment manager where we
                        deploy a diverse range of investment strategies across geographies, asset
                        classes and time frames. Combining data, research, technology and trading
                        expertise has shaped QRT's collaborative mindset which enables us to solve
                        the most complex challenges. QRT's culture of innovation continuously drives
                        our ambition to deliver high quality returns for our investors.
                    </p>
                    <div class="r-4">
                        <a class="btn primary sm font-bold" href="https://www.qube-rt.com">
                            Website
                        </a>
                        <a class="btn primary sm font-bold" href="https://www.qube-rt.com/careers/">
                            View opportunities
                        </a>
                    </div>
                </Sponsor>
            </div>

            <h2 class="my-8 text-center text-3xl font-bold text-neutral-100 md:text-4xl">Silver</h2>

            <div class="r-4 flex-wrap justify-center">
                <Sponsor tier="medium" logo="/assets/sponsors/iterate.svg">
                    {#snippet name()}Iterate{/snippet}
                    <p>
                        Iterate is building the future of autonomous companies. We believe one of
                        the most valuable uses of AGI will be to build startups. We're starting by
                        helping small teams automate their startups - today, we offer a
                        customizable, AI chief of staff that automates tedious ops processes like
                        filing invoices, onboarding new hires, requesting tax credits etc.
                    </p>
                    <p>
                        Founded by the former co-founder and CTO of Monzo, Iterate is backed by the
                        world's best investors, including OpenAI, Index Ventures, and the founders
                        behind Anthropic, Mistral, and other class-leading companies.
                    </p>
                    <p>
                        We are a small, deeply technical team based out of London, driven by the
                        ambition to redefine what humans can build with AI.
                    </p>
                    <div class="r-4">
                        <a class="btn primary sm font-bold" href="https://iterate.com"> Website </a>
                        <a class="btn primary sm font-bold" href="https://www.iterate.com/careers">
                            View opportunities
                        </a>
                    </div>
                </Sponsor>

                <Sponsor tier="medium" logo="/assets/sponsors/optiver.png">
                    {#snippet name()}Optiver{/snippet}
                    <p>
                        Unlock the world of algorithmic trading with The Optiver & Cambridge Trading
                        Academy. Led by industry experts, this comprehensive 8-session course takes
                        you from options theory to hands-on Python algorithm design.
                    </p>
                    <p>
                        Test your skills on Optiver's 24/7 simulated market, Optibook, and compete
                        in pairs to win an exciting prize. Gain practical skills and knowledge
                        directly applicable to a career in finance and trading. Register to express
                        your interest in joining the academy and be the first to know when
                        applications open!
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

                <Sponsor tier="medium" logo="/assets/sponsors/quantco.png">
                    {#snippet name()}Quantco{/snippet}
                    <p>
                        We leverage expertise in data science, engineering, artificial intelligence,
                        and economics to help organizations turn data into decisions. Founded by 4
                        PhDs from Harvard and Stanford, we are now more than 200 professionals with
                        extensive quantitative, engineering, and business acumen.
                    </p>
                    <p>
                        Our teams apply cutting-edge research to solve real-world problems within
                        algorithmic pricing, fraud detection, and cancer diagnostics. Our customers
                        include some of the largest financial, retail, and healthcare organizations
                        in the US and Europe.
                    </p>
                    <p>
                        We're a rapidly scaling company that offers full-time and internship
                        opportunities in London, Zurich, Berlin, Munich, Karlsruhe, Cologne, Boston
                        and San Francisco.
                    </p>
                    <div class="r-4">
                        <a class="btn primary sm font-bold" href="https://www.quantco.com">
                            Website
                        </a>
                        <a class="btn primary sm font-bold" href="https://jobs.lever.co/quantco-">
                            View opportunities
                        </a>
                    </div>
                </Sponsor>
            </div>

            <h2 class="my-8 text-center text-3xl font-bold text-neutral-100 md:text-4xl">Bronze</h2>

            <div class="r-4 flex-wrap justify-center">
                <Sponsor tier="small" logo="/assets/sponsors/imc.png">
                    {#snippet name()}IMC Trading{/snippet}
                    <p>
                        IMC is a leading trading firm, known worldwide for our advanced, low-latency
                        technology and world-class execution capabilities. Over the past 35 years,
                        we've been a stabilizing force in the financial markets - providing the
                        essential liquidity our counterparties depend on. Across offices in the US,
                        Europe, and Asia Pacific, our talented employees are united by our
                        entrepreneurial spirit, exceptional culture, and commitment to giving back.
                        It's a strong foundation that allows us to grow and add new capabilities,
                        year after year. From entering dynamic new markets, to developing a
                        state-of-the-art research environment and diversifying our trading
                        strategies, we dare to imagine what could be and work together to make it
                        happen.
                    </p>
                    <div class="r-4">
                        <a class="btn primary sm font-bold" href="https://www.imc.com/eu">
                            Website
                        </a>
                        <a class="btn primary sm font-bold" href="https://grnh.se/863b7422teu">
                            View opportunities
                        </a>
                    </div>
                </Sponsor>

                <Sponsor tier="small" logo="/assets/sponsors/tpp.png">
                    {#snippet name()}TPP{/snippet}
                    <p>
                        TPP is a global digital health company. With over 7,000 organisations using
                        our solutions to care for over 50 million patients, our software is used
                        across all health and social care settings, including GPs, emergency
                        departments, hospitals and mental health services. This means that wherever
                        and whenever a patient needs care, a detailed and up-to-date record is
                        available. No other company has a digital healthcare solution on this scale.
                        Our database is one of the largest in the world. It processes a billion
                        transactions daily – more than the London Stock Exchange and Visa combined.
                    </p>
                    <p>
                        We are always looking for talented and motivated students to join our team.
                        If you are interested in functional programming, compilers, programming
                        languages, or distributed systems, we would love to hear from you. We offer
                        internships, summer projects, and PhD positions.
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
