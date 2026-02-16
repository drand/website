export default ({ router }) => {
  router.addRoutes([{ path: '/partner-with-us/', redirect: '/loe/' }])

  const docsRedirects = [
    ['/developer', 'https://docs.drand.love/developer'],
    ['/docs', 'https://docs.drand.love/docs'],
    ['/operator', 'https://docs.drand.love/operator']
  ]

  router.beforeEach((to, from, next) => {
    const redirectTarget = docsRedirects.find(([prefix]) =>
      to.path === prefix || to.path.startsWith(`${prefix}/`)
    )

    if (!redirectTarget) {
      next()
      return
    }

    const [prefix, targetBase] = redirectTarget
    const suffix = to.path.slice(prefix.length).replace(/^\/+/, '')
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const target = suffix
      ? `${targetBase}/${suffix}${search}${hash}`
      : `${targetBase}${search}${hash}`

    if (typeof window !== 'undefined') {
      window.location.replace(target)
      return
    }

    next(false)
  })
}