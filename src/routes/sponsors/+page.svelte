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
				class="btn variant-filled-primary">View Opportunities</a
			>
		</div>
	</section>
	<section class="sponsor-card">
		<img src="/sponsors/hrt.png" alt="Hudson River Trading" class="object-contain h-24 m-2" />
		<span>
			At Hudson River Trading (HRT) we are mathematicians, computer scientists, statisticians,
			physicists and engineers. We research and develop automated trading algorithms using advanced
			mathematical techniques. We have built one of the world's most sophisticated compute
			environments, and our researchers are at the forefront of innovation in the world of
			algorithmic trading and machine learning.
		</span>
		<span>
			HRT was founded in 2002 by computer scientists and mathematicians who believed that math and
			technology could transform financial markets. They developed the algorithms that became the
			foundation for HRT's continued success across global asset classes. Today, we are global
			industry leaders, and a leading voice for fair and open markets. Our trading creates stronger
			markets for all investors, and all our work is built upon our rigorous code of ethics.
		</span>
		<span>
			We're a community of self-starters, critical thinkers, and eager problem-solvers.
			Collaboration is at the heart of our success — from an open-source code base to lively
			cross-team lunches in our cafe, a spirit of openness underscores everything we do. We
			celebrate great ideas from HRT veterans and new hires alike. We love solving the most complex
			problems in trading and technology, and believe the best work can only be done together.
		</span>
		<div class="button-container">
			<a
				href="https://www.hudsonrivertrading.com/"
				class="btn variant-outline-primary"
				target="_blank">Website</a
			>
			<a href="https://www.hudsonrivertrading.com/hrtbeat" class="btn variant-outline-primary"
				>Blog</a
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
			<a
				href="https://optiver.com/recruitment-events/save-the-date-the-optiver-cambridge-trading-academy/"
				class="btn variant-outline-primary">Register Interest</a
			>
			<a
				href="https://optiver.com/working-at-optiver/career-opportunities/page/2/?search=internship"
				class="btn variant-filled-primary">View Opportunities</a
			>
		</div>
	</section>
	<h2 class="h2">Bronze</h2>
	<section class="sponsor-card">
		<img src="/sponsors/TPP.png" alt="TPP Logo" class="object-contain h-24 m-2" />
		<span>
			TPP is a global digital health company. With over 7,000 organisations using our solutions to
			care for over 50 million patients, our software is used across all health and social care
			settings, including GPs, emergency departments, hospitals and mental health services. This
			means that wherever and whenever a patient needs care, a detailed and up-to-date record is
			available. No other company has a digital healthcare solution on this scale. Our database is
			one of the largest in the world. It processes a billion transactions daily – more than the
			London Stock Exchange and Visa combined.</span
		>

		<span
			>Our technology helps improve people’s lives across the world, whether it is scheduling
			immunisations for millions of children, allowing doctors to manage complex care for elderly
			patients, helping governments with the prevention of outbreaks, or developing new machine
			learning algorithms for the early diagnosis of disease.</span
		>
		<span>
			TPP is committed to helping tackle global health challenges, working with governments to
			deliver the technology required for the future of healthcare.
		</span>
		<span>
			We are always looking for talented and motivated students to join our team. If you are
			interested in functional programming, compilers, programming languages, or distributed
			systems, we would love to hear from you. We offer internships, summer projects, and PhD
			positions.
		</span>
		<div class="button-container">
			<a href="https://tpp-careers.com/" class="btn variant-outline-primary">View Opportunities</a>
		</div>
	</section>
	<section class="sponsor-card">
		<img src="/sponsors/imc.png" alt="IMC Trading" class="object-contain h-24 m-2" />
		<span>
			IMC is a leading trading firm, known worldwide for our advanced, low-latency technology and
			world-class execution capabilities. Over the past 35 years, we’ve been a stabilizing force in
			the financial markets – providing the essential liquidity our counterparties depend on. Across
			offices in the US, Europe, and Asia Pacific, our talented employees are united by our
			entrepreneurial spirit, exceptional culture, and commitment to giving back. It's a strong
			foundation that allows us to grow and add new capabilities, year after year. From entering
			dynamic new markets, to developing a state-of-the-art research environment and diversifying
			our trading strategies, we dare to imagine what could be and work together to make it happen.
		</span>
		<div class="button-container">
			<a href="https://grnh.se/863b7422teu" class="btn variant-outline-primary"
				>View Opportunities</a
			>
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
		@apply flex justify-center w-full pt-4 gap-x-8 gap-y-4 flex-wrap;
	}
</style>
