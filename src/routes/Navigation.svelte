<script lang="ts">
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';

	const email = $page.data.session?.user?.email;
</script>

<a class="btn btn-sm variant-ghost-surface" href="/about">About Us</a>
<a class="btn btn-sm variant-ghost-surface" href="/sponsors">Sponsors</a>
{#if email}
	<button class="btn btn-sm variant-outline-primary" on:click={() => signOut()}>{email}</button>
{:else}
	<button class="btn btn-sm variant-outline-primary" on:click={() => signIn('google')}>
		Sign In with Raven
	</button>
{/if}
