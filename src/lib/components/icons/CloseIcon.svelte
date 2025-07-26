<script lang="ts">
    interface Props {
        class?: string;
    }

    let { class: className }: Props = $props();
</script>

<svg class="size-6 {className ?? ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
    />
</svg>
