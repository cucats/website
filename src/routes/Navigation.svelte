<script lang="ts">
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';

	const email = $page.data.session?.user?.email;
</script>

<a class="nav-link" href="/about">About Us</a>
<a class="nav-link" href="/sponsors">Sponsors</a>

<!-- Disable for now
{#if email}
	<button
		class="btn btn-sm variant-outline-primary"
		on:click={() => signOut()}
		aria-label="Sign out"
	>
		{email}
	</button>
{:else}
	<button
		class="btn btn-sm variant-outline-primary"
		on:click={() => signIn('google')}
		aria-label="Sign in"
	>
		Sign In with Raven
	</button>
{/if}
-->

<style>
	.nav-link {
		@apply btn btn-sm variant-ghost-surface hover:variant-filled-primary;
	}
</style>
