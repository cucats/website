<script lang="ts">
    interface Props {
        name: string;
        role: string;
    }

    let { name, role }: Props = $props();
</script>

<div class="min-w-40 md:min-w-64">
    <div class="text-sm md:text-base">
        <span class="mr-2 block font-bold lowercase md:inline">{role}</span><span
            class="inline text-gray-300 opacity-60">@cucats.org</span
        >
    </div>
    <div class="text-xl font-medium tracking-tight md:text-3xl">{name}</div>
</div>
