<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<main class="p-4 flex flex-col gap-y-4 max-w-screen-lg mx-auto lg:pt-12 lg:gap-y-8" in:fade>
	<h1 class="h1 mb-4">Sponsors</h1>
	<h2 class="h2">Gold</h2>
	<section class="sponsor-card">
		<img
			src="/sponsors/js_stacked.png"
			alt="Jane Street Logo"
			class="invert object-contain h-24 m-2"
		/>
		<span>
			This September, Jane Street is excited to host our INSIGHT programme in London for students
			interested in roles in software engineering! We’re inviting students who identify as women,
			transgender and gender-expansive to spend four days in our office learning more about what we
			do and how we do it through a set of trading and programming classes and activities. Attendees
			will receive an in-depth look into the ways we use math and computer science across our firm
			to solve problems and foster collaborative thinking.
		</span>
		<span>
			Students will arrive in London on the evening of Sunday, 22nd September and will depart on the
			morning of Friday, 27th September. Jane Street will cover all travel to and from London,
			including meals, housing and a variety of social events.
		</span>
		<span>
			INSIGHT has one programme track that students can apply for, software engineering. Selected
			students will learn OCaml, the libraries and tools we use in our daily work and how to put
			them to use by building a computer game. Participants will also learn the fundamentals of
			electronic trading systems and write a programme that trades on a simulated stock exchange.</span
		>
		<div class="button-container">
			<a
				href="https://janestreet.com/apply-insight-ldn/?utm_source=program_email&utm_medium=email&utm_campaign=insight_ldn_program&utm_content=apply_button"
				class="btn variant-outline-primary">Apply here</a
			>
			<a
				href="https://www.janestreet.com/join-jane-street/open-roles/?type=internship&location=london"
				class="btn variant-filled-primary">Internship Opportunities</a
			>
		</div>
	</section>
	<h2 class="h2">Silver</h2>
	<section class="sponsor-card">
		<img src="/sponsors/optiver.png" alt="Optiver Logo" class="object-contain h-24 m-2" />
		<span>
			Unlock the world of algorithmic trading with The Optiver & Cambridge Trading Academy. Led by
			industry experts, this comprehensive 8-session course takes you from options theory to
			hands-on Python algorithm design.
		</span>
		<span>
			Test your skills on Optiver's 24/7 simulated market, Optibook, and compete in pairs to win an
			exciting prize. Gain practical skills and knowledge directly applicable to a career in finance
			and trading. <a
				href="https://optiver.com/recruitment-events/save-the-date-the-optiver-cambridge-trading-academy/"
				>Register</a
			> to express your interest in joining the academy and be the first to know when applications open!
		</span>
        <div class="button-container">
            <a href="https://optiver.com/recruitment-events/save-the-date-the-optiver-cambridge-trading-academy/" class="btn variant-outline-primary">Register Interest</a>
            <a href="https://optiver.com/working-at-optiver/career-opportunities/page/2/?search=internship" class="btn variant-filled-primary">Internship Opportunities</a>
        </div>
	</section>
</main>

<style lang="postcss">
	.sponsor-card {
		@apply flex flex-col w-full items-center gap-2 rounded-xl outline-primary-400 outline outline-1 bg-white bg-opacity-20 p-4;

        & a:not(.btn) {
            @apply text-primary-400 underline;
        }
	}

    .button-container {
        @apply flex justify-center w-full pt-4 gap-8;
    }
</style>
