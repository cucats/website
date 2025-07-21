export type EventData = {
    title: string;
    date: Date[];
    description: string;
    website?: string;
    logo?: string;
};

export const events: EventData[] = [
    {
        title: "CUCaTS × Anthropic Speaker Event + Hackathon",
        date: [new Date("2025-06-18")],
        description:
            "AI alignment talk by Hoagy Cunningham, free food provided by Aromi, Claude demo with Greg Feingold, and a fast-paced, informal hackathon. All participants will receive $50 of free Anthropic API Credits, with additional prizes for winners.",
        website: "https://forms.gle/5BNss8APeFZdZEgG9",
    },
    {
        title: "Speaker event + Dinner",
        date: [new Date("2025-05-29")],
        description:
            "Sunoo Park: Two Tales of End-to-End Encryption. This talk explores two emerging threats to end-to-end encryption, including government and commercial circumvention. It examines the Encrochat hack, as well as the risks posed by the growing integration of AI into communication platforms. There will be a free dinner at Pho afterwards.",
        website: "https://forms.gle/mNsgPnroizzu7NvbA",
    },
    {
        title: "CUES × CUCATS AI Hackathon",
        date: [new Date("2025-03-08"), new Date("2025-03-09")],
        description:
            "Supported by Arm and Anthropic. Join for an exciting opportunity to build innovative AI agent applications.",
        website: "https://www.cues.org.uk/event/cues-x-cucats-ai-hackathon-2025",
        logo: "./events/cues.png",
    },
    {
        title: "Cambridge Game Jam 2025",
        date: [new Date("2025-02-07"), new Date("2025-02-09")],
        description:
            "The Game Jam is similar to a hackathon: you have 48h to develop a game that fits a specific theme (revealed at the beginning of the event).",
        website: "https://camgamejam.com",
        logo: "./events/jam.png",
    },
    {
        title: "CUCaTS Advent of Code",
        date: [new Date("2024-12-01"), new Date("2024-12-25")],
        description:
            "Inspired by the global Advent of Code, our version adds a CUCaTS twist! Each day at 12:00 p.m., a new challenge will be posted for you to solve and earn points.",
        website: "https://aoc.cucats.org/about",
    },
    {
        title: "Cam Hack 2024",
        date: [new Date("2024-11-02"), new Date("2024-11-03")],
        description:
            "Cam Hack is a 32 hour hackathon for the innovative minds at the University of Cambridge. Over an action-packed weekend, students come together to design and build technology projects from the ground up.",
        website: "https://camhack.org",
        logo: "./events/camhack.png",
    },
];
