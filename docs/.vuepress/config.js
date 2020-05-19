// .vuepress/config.js
module.exports = {
  base: '/',
  head: require('./head'),
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Drand Docs',
      description: 'Drand Documentation'
    }
  },
  markdown: {
    extendMarkdown: md => {
      md.set({
        breaks: true
      })
      md.use(require('markdown-it-video'))
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-task-lists'))
      md.use(require('markdown-it-deflist'))
    }
  },
  themeConfig: {
    //   TODO: create Algolia account for Drand an throw API key into here.
    // algolia: {
    //   apiKey: 'e6dcd48beb5db629bf77c892d38fa091',
    //   indexName: 'drand'
    // },
    defaultImage: '/images/social-card.png',
    author: {
      name: 'Drand Team',
      twitter: ''
    },
    keywords:
      'drand, randomness, protocol, entropy, league, league of entropy, decentralized, random, documentation, docs, Protocol Labs',
    domain: 'https://docs.drand.love',
    docsRepo: 'drand/drand-docs',
    docsDir: 'docs',
    docsBranch: 'master',
    feedbackWidget: {
      docsRepoIssue: 'drand/drand-docs'
    },
    editLinks: false,
    // page nav
    nextLinks: false,
    prevLinks: false,
    // ui/ux
    logo: '/images/drand-logo.svg',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Select language',
        editLinkText: 'Edit this page',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh'
          }
        },
        nav: require('./nav/en'),
        sidebar: [
          {
            title: 'Home',
            path: '/'
          },
          {
            title: 'Main dropdown',
            path: '/main-dropdown/',
            children: [
              {
                title: 'Sub Label',
                sidebarDepth: 1,
                collapsable: false,
                children: [
                  '/main-dropdown/sub-label/page-a',
                  '/main-dropdown/sub-label/page-b',
                  '/main-dropdown/sub-label/page-c'
                ]
              },
              {
                title: 'Another Sub label',
                sidebarDepth: 1,
                collapsable: false,
                children: [
                  '/main-dropdown/another-sub-label/page-a',
                  '/main-dropdown/another-sub-label/page-b',
                  '/main-dropdown/another-sub-label/page-c'
                ]
              }
            ]
          }
        ]
      }
    }
  },
  plugins: [
    ['@vuepress/plugin-back-to-top', true],
    [
      '@vuepress/active-header-links',
      {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor',
        headerTopOffset: 120
      }
    ],
    '@vuepress/plugin-last-updated',
    [
      'vuepress-plugin-clean-urls',
      {
        normalSuffix: '/',
        indexSuffix: '/',
        notFoundPath: '/404/'
      }
    ],
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-96910779-15'
      }
    ],
    [
      'vuepress-plugin-seo',
      {
        siteTitle: ($page, $site) => $site.title,
        title: $page => $page.title,
        description: $page => $page.frontmatter.description,
        author: ($page, $site) =>
          $page.frontmatter.author || $site.themeConfig.author,
        tags: $page => $page.frontmatter.tags,
        twitterCard: _ => 'summary_large_image',
        type: $page =>
          ['articles', 'posts', 'blog'].some(folder =>
            $page.regularPath.startsWith('/' + folder)
          )
            ? 'article'
            : 'website',
        url: ($page, $site, path) => ($site.themeConfig.domain || '') + path,
        image: ($page, $site) =>
          $page.frontmatter.image
            ? ($site.themeConfig.domain || '') + $page.frontmatter.image
            : ($site.themeConfig.domain || '') + $site.themeConfig.defaultImage,
        publishedAt: $page =>
          $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
        customMeta: (add, context) => {
          const { $site, image } = context
          add(
            'twitter:site',
            ($site.themeConfig.author && $site.themeConfig.author.twitter) || ''
          )
          add('image', image)
          add('keywords', $site.themeConfig.keywords)
        }
      }
    ],
    [
      'vuepress-plugin-canonical',
      {
        // add <link rel="canonical" header (https://tools.ietf.org/html/rfc6596)
        // to deduplicate SEO across all copies loaded from various public gateways
        baseURL: 'https://docs.drand.love'
      }
    ]
  ],
  extraWatchFiles: ['.vuepress/nav/en.js'],
  configureWebpack: (config, isServer) => {
    if (!isServer) {
      config.entry = {
        app: ['./docs/.vuepress/public-path.js', config.entry.app[0]]
      }
    }
  }
}
