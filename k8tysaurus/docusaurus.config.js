module.exports = {
    title: 'k8ty',
    tagline: 'Bringing the void straight to you!',
    url: 'https://k8ty.app',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/favicon.png',
    organizationName: 'k8ty-app', // Usually your GitHub org/user name.
    projectName: 'k8tysaurus', // Usually your repo name.
    themeConfig: {
        colorMode: {
            defaultMode: 'dark',
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: 'k8ty',
            logo: {
                alt: 'My Site Logo',
                src: 'img/k8ty.png',
            },
            items: [
                {
                    to: 'docs/',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'left',
                },
                {to: 'blog', label: 'Blog', position: 'left'},
                {
                    href: 'https://github.com/k8ty-app',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Docs',
                            to: 'docs',
                        },
                    ],
                },
                {
                    title: 'Here',
                    items: [
                        {
                            label: 'Blog',
                            to: 'blog',
                        },
                    ],
                },
                {
                    title: 'Elsewhere',
                    items: [
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/alterationx10',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Mark Rudolph.`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    path: process.env.NO_PREPROCESS ? 'mdocs' : 'docs',
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl:
                        'https://github.com/k8ty-app/k8tysaurus/k8tysaurus/edit/master/',
                },
                blog: {
                    path: process.env.NO_PREPROCESS ? 'mblog' : 'blog',
                    showReadingTime: true,
                    editUrl:
                        'https://github.com/k8ty-app/k8tysaurus/k8tysaurus/edit/master/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
