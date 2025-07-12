export type SponsorData = {
    name: string;
    logo: string;
    tier: "bronze" | "silver" | "gold";
    paragraphs: string[];
    links: {
        text: string;
        url: string;
    }[];
};

export const sponsors: SponsorData[] = [
    {
        name: "Anthropic",
        logo: "/assets/sponsors/anthropic.png",
        tier: "gold",
        paragraphs: [],
        links: [
            { text: "website", url: "https://www.anthropic.com" },
            { text: "opportunities", url: "https://www.anthropic.com/careers" },
        ],
    },

    {
        name: "HRT",
        logo: "/assets/sponsors/hrt.png",
        tier: "gold",
        paragraphs: [
            "At Hudson River Trading (HRT) we are mathematicians, computer scientists, statisticians, physicists and engineers. We research and develop automated trading algorithms using advanced mathematical techniques. We have built one of the world's most sophisticated compute environments, and our researchers are at the forefront of innovation in the world of algorithmic trading and machine learning.",
            "HRT was founded in 2002 by computer scientists and mathematicians who believed that math and technology could transform financial markets. They developed the algorithms that became the foundation for HRT's continued success across global asset classes. Today, we are global industry leaders, and a leading voice for fair and open markets. Our trading creates stronger markets for all investors, and all our work is built upon our rigorous code of ethics.",
            "We're a community of self-starters, critical thinkers, and eager problem-solvers. Collaboration is at the heart of our success — from an open-source code base to lively cross-team lunches in our cafe, a spirit of openness underscores everything we do. We celebrate great ideas from HRT veterans and new hires alike. We love solving the most complex problems in trading and technology, and believe the best work can only be done together.",
        ],
        links: [
            { text: "website", url: "https://www.hudsonrivertrading.com" },
            { text: "blog", url: "https://www.hudsonrivertrading.com/hrtbeat" },
        ],
    },

    {
        name: "Jane Street",
        logo: "/assets/sponsors/js_stacked.png",
        tier: "gold",
        paragraphs: [
            "Our INSIGHT program is part of our commitment to give as many people as possible the chance to learn more about what we do.",
            "In this multi-day program, we invite women, transgender, and/or gender-expansive individuals to learn about the roles within our firm and how we solve challenges at Jane Street — including the specific concepts and tools we use in our daily work.",
            "As you explore opportunities within the program, you'll notice that event topics and locations will vary. We offer classes and activities in three separate tracks: software engineering, trading, and strategy and product.",
        ],
        links: [
            {
                text: "website",
                url: "https://janestreet.com",
            },
            {
                text: "view opportunities",
                url: "https://www.janestreet.com/join-jane-street/open-roles/?type=internship&location=london",
            },
        ],
    },

    {
        name: "QRT",
        logo: "/assets/sponsors/qrt.svg",
        tier: "gold",
        paragraphs: [
            "Qube Research & Technologies (QRT) is a global investment manager where we deploy a diverse range of investment strategies across geographies, asset classes and time frames. Combining data, research, technology and trading expertise has shaped QRT's collaborative mindset which enables us to solve the most complex challenges. QRT's culture of innovation continuously drives our ambition to deliver high quality returns for our investors.",
        ],
        links: [
            { text: "website", url: "https://www.qube-rt.com" },
            { text: "view opportunities", url: "https://www.qube-rt.com/careers/" },
        ],
    },

    {
        name: "Nustom",
        logo: "/assets/sponsors/nustom.svg",
        tier: "silver",
        paragraphs: [
            "We're a startup that makes startups! We use AI to minimise the cost of building, operating and growing startups. Previously, we helped build Monzo. We're founded in March 2024 by former Monzo Co-Founder and CTO and backed by some of the world's best investors (Garry Tan, Naval Ravikant, Tom Blomfield, Accel, Index Ventures, OpenAI, founders of Anthropic, Perplexity, etc).",
            "In a few years' time, we believe that the majority of software will be made by people with no technical background, collaborating with an AI. What today takes weeks or months and a team of specialists will be accessible to everyone, take only minutes, and cost very little. Instead of one-size-fits-all products, everyone will be making their own tools, customized to their needs.",
            "Come spend 3 or 6 months with us to build and launch a revenue generating startup! You can build whatever you like. The only catch is that you have to use our AI generator to build your startup from human language input. And if it's not able to do so, you first need to improve the generator to make it generatable.",
        ],
        links: [
            {
                text: "website",
                url: "https://nustom.com",
            },
            {
                text: "apply now",
                url: "https://nustom.notion.site/150622a338eb802aa204efb2997f7202",
            },
        ],
    },

    {
        name: "Optiver",
        logo: "/assets/sponsors/optiver.png",
        tier: "silver",
        paragraphs: [
            "Unlock the world of algorithmic trading with The Optiver & Cambridge Trading Academy. Led by industry experts, this comprehensive 8-session course takes you from options theory to hands-on Python algorithm design.",
            "Test your skills on Optiver's 24/7 simulated market, Optibook, and compete in pairs to win an exciting prize. Gain practical skills and knowledge directly applicable to a career in finance and trading. Register to express your interest in joining the academy and be the first to know when applications open!",
        ],
        links: [
            {
                text: "register interest",
                url: "https://optiver.com/recruitment-events/save-the-date-the-optiver-cambridge-trading-academy/",
            },
            {
                text: "view opportunities",
                url: "https://optiver.com/working-at-optiver/career-opportunities/page/2/?search=internship",
            },
        ],
    },

    {
        name: "Quantco",
        logo: "/assets/sponsors/quantco.png",
        tier: "silver",
        paragraphs: [
            "We leverage expertise in data science, engineering, artificial intelligence, and economics to help organizations turn data into decisions. Founded by 4 PhDs from Harvard and Stanford, we are now more than 200 professionals with extensive quantitative, engineering, and business acumen.",
            "Our teams apply cutting-edge research to solve real-world problems within algorithmic pricing, fraud detection, and cancer diagnostics. Our customers include some of the largest financial, retail, and healthcare organizations in the US and Europe.",
            "We're a rapidly scaling company that offers full-time and internship opportunities in London, Zurich, Berlin, Munich, Karlsruhe, Cologne, Boston and San Francisco.",
        ],
        links: [
            { text: "website", url: "https://www.quantco.com" },
            { text: "view opportunities", url: "https://jobs.lever.co/quantco-" },
        ],
    },

    {
        name: "IMC Trading",
        logo: "/assets/sponsors/imc.png",
        tier: "bronze",
        paragraphs: [
            "IMC is a leading trading firm, known worldwide for our advanced, low-latency technology and world-class execution capabilities. Over the past 35 years, we've been a stabilizing force in the financial markets - providing the essential liquidity our counterparties depend on. Across offices in the US, Europe, and Asia Pacific, our talented employees are united by our entrepreneurial spirit, exceptional culture, and commitment to giving back. It's a strong foundation that allows us to grow and add new capabilities, year after year. From entering dynamic new markets, to developing a state-of-the-art research environment and diversifying our trading strategies, we dare to imagine what could be and work together to make it happen.",
        ],
        links: [{ text: "view opportunities", url: "https://grnh.se/863b7422teu" }],
    },

    {
        name: "TPP",
        logo: "/assets/sponsors/TPP.png",
        tier: "bronze",
        paragraphs: [
            "TPP is a global digital health company. With over 7,000 organisations using our solutions to care for over 50 million patients, our software is used across all health and social care settings, including GPs, emergency departments, hospitals and mental health services. This means that wherever and whenever a patient needs care, a detailed and up-to-date record is available. No other company has a digital healthcare solution on this scale. Our database is one of the largest in the world. It processes a billion transactions daily – more than the London Stock Exchange and Visa combined.",
            "We are always looking for talented and motivated students to join our team. If you are interested in functional programming, compilers, programming languages, or distributed systems, we would love to hear from you. We offer internships, summer projects, and PhD positions.",
        ],
        links: [
            {
                text: "view opportunities",
                url: "https://tpp-careers.com",
            },
            {
                text: "graduate roles",
                url: "https://tpp-careers.com/roles/graduate-software-developer",
            },
        ],
    },
];
