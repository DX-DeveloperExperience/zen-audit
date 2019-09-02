module.exports = {
  title: 'ZenAudit',
  description: 'Make your projects audits a breeze',
  dest: 'docs_build',
  base: '/zen-audit/',
  themeConfig: {
    logo: '/logotype.png',
    title: false,
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Custom Rules and Stacks',
        link: '/custom/',
      },
      {
        text: 'Included Stacks and Rules',
        link: '/included/',
      },
      {
        text: 'API',
        link: '/API/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/DX-DeveloperExperience/project-starter',
      },
    ],
    sidebar: 'auto',
  },
};
