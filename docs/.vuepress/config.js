const canonicalBaseURL = 'https://drand.love'

// .vuepress/config.js
module.exports = {
  base: '/',
  port: 8082,
  head: require('./head'),
  locales: {
    '/': {
      lang: 'en-US',
      title: 'drand - Distributed Randomness Beacon.',
      description: 'drand Documentation'
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
    defaultImage: '/images/social-card.png',
    search: true,
    searchMaxSuggestions: 10,
    author: {
      name: 'drand Team',
      twitter: ''
    },
    keywords:
      'drand, randomness, protocol, entropy, league, league of entropy, decentralized, random, Protocol Labs, VRF, Verifiable Random Function, loe, randamu',
    domain: canonicalBaseURL,
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
          '/about/': [
            {
              title: 'About',
              path: '/about/'
            },
            'community',
            'contributing',
            {
              title: 'Blog',
              path: 'https://docs.drand.love/blog/'
            },
            {
              title: 'Status',
              path: 'https://drand.statuspage.io/'
            }
          ],

        }
      }
    },
    displayAllHeaders: true
  },
  plugins: [
    [
      'sitemap',
      {
        hostname: 'https://drand.love',
        changefreq: 'weekly',
      },
    ],
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
      'seo',
      {
        siteTitle: (_, $site) => $site.title,
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
        baseURL: canonicalBaseURL
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
    ],
  ],
  extraWatchFiles: ['.vuepress/nav/en.js'],
  configureWebpack: (config, isServer) => {
    if (!isServer) {
      config.entry = {
        app: ['./docs/.vuepress/public-path.js', config.entry.app[0]]
      }
    }
    config.module.rules.push({
      test: /\.js$/,
      loader: require.resolve('@open-wc/webpack-import-meta-loader')
    })
  },
  evergreen: true
}
