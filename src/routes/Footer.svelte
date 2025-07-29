<script lang="ts">
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: "Instagram",
            href: "https://www.instagram.com/cucats.cam",
            icon: "/assets/socials/instagram.svg",
        },
        {
            name: "Facebook",
            href: "https://www.facebook.com/CUCaTS",
            icon: "/assets/socials/facebook.png",
        },
        { name: "X", href: "https://x.com/cucatscam", icon: "/assets/socials/x.svg" },
    ];

    const quickLinks = [
        { name: "About", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Sponsors", href: "/sponsors" },
        { name: "Constitution", href: "/constitution" },
    ];
</script>

<footer class="bg-neutral-900">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div class="space-y-4">
            <div class="r-4 items-center">
                <img
                    src="/assets/logo/dark/logo-white-cat.svg"
                    alt="CUCaTS logo"
                    class="h-10 w-10"
                />
                <h3 class="text-2xl font-extrabold text-neutral-100">CUCaTS</h3>
            </div>
            <p class="text-sm leading-relaxed text-neutral-300">
                Cambridge University Computing and Technology Society
            </p>
        </div>

        <div class="space-y-4">
            <h4 class="text-lg font-bold text-neutral-100 uppercase">Quick Links</h4>
            <nav class="flex flex-col space-y-2">
                {#each quickLinks as link}
                    <a
                        href={link.href}
                        class="text-neutral-300 transition-colors hover:text-neutral-100"
                        >{link.name}</a
                    >
                {/each}
            </nav>
        </div>

        <div class="space-y-4">
            <h4 class="text-lg font-bold text-neutral-100 uppercase">Connect</h4>
            <div class="flex gap-4">
                {#each socialLinks as social}
                    <a
                        href={social.href}
                        class="block h-8 w-8 opacity-70 transition-opacity hover:opacity-100"
                        aria-label={social.name}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={social.icon} alt={social.name} class="h-full w-full" />
                    </a>
                {/each}
            </div>
        </div>
    </div>

    <div class="mx-auto max-w-7xl p-4 text-center">
        <p class="text-sm text-neutral-400">&copy; {currentYear} CUCaTS</p>
    </div>
</footer>
