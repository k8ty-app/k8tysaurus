module.exports = {
    title: 'K8TY.APP',
    tagline: '< Tech Blog | Project Documentation >',
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
            title: 'K8TY.APP',
            logo: {
                alt: 'My Site Logo',
                src: 'img/k8ty.png',
            },
            items: [
                {
                    to: '/',
                    label: 'Blog',
                    position: 'left',
                    activeBaseRegex: '^/$',
                },
                {
                    to: '/docs',
                    label: 'Docs',
                    position: 'left',
                },
                {
                    to: '/about',
                    label: 'About',
                    position: 'left'
                },
                {
                    to: '/account',
                    label: 'Account',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
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
                    routeBasePath: '/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
    plugins: [
        [
            'docusaurus2-dotenv',
            {
                path: "./.env.local",
                systemvars: true
            }
        ]
    ]
};
