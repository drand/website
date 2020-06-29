// .vuepress/config.js
module.exports = {
  base: '/',
  head: require('./head'),
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Drand - Distributed Randomness Beacon.',
      description: 'Drand Documentation'
    }
  },
  markdown: {
    extendMarkdown: md => {
      md.set({
        breaks: false
      })
      md.use(require('markdown-it-video'))
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-task-lists'))
      md.use(require('markdown-it-deflist'))
    }
  },
  themeConfig: {
    algolia: {
      apiKey: 'fcaf3b4aca77fcfeff32616ec6e35a86',
      indexName: 'drand'
    },
    defaultImage: '/images/social-card.png',
    author: {
      name: 'Drand Team',
      twitter: ''
    },
    keywords:
      'drand, randomness, protocol, entropy, league, league of entropy, decentralized, random, documentation, docs, Protocol Labs',
    domain: 'https://docs.drand.love',
    docsRepo: 'drand/website',
    docsDir: 'docs',
    docsBranch: 'master',
    feedbackWidget: {
      docsRepoIssue: 'drand/website'
    },
    editLinks: false,
    // page nav
    nextLinks: false,
    prevLinks: false,
    // ui/ux
    logo: '/images/logo-drand-text-right-dark.png',
    repo: 'http://github.com/drand/drand',
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
        sidebar: {
          '/concepts/': [
            'overview',
            'cryptography',
            'security-model',
            'specification'
          ],
          '/docs/': ['drand-js'],
          '/operate/': ['deploy', 'metrics', 'drand-cli'],
          '/about/': [
            'community',
            'contributing',
            {
              title: 'Status',
              path: 'https://drand.statuspage.io/'
            }
          ]
          // '/blog/': ['20200527-test-blog-post']
        }
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
    ],
    [
      'vuepress-plugin-mathjax',
      {
        target: 'svg',
        macros: {
          '*': '\\times'
        }
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
