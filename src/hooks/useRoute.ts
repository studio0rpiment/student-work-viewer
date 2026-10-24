import { useCallback, useEffect, useState } from 'react'

/**
 * Tiny path router — no library needed for a handful of routes.
 *   /, /classes                 list of courses
 *   /classes/:course            a course: its showcases and links
 *   /classes/:course/:slug      a showcase
 *   /:slug                      a showcase (older links)
 *   /edit                       admin index (URL only, sign in required)
 *   /edit/new                   create a showcase
 *   /edit/:slug                 edit a showcase
 * Course segments are matched lowercase, so /classes/experimental-tools-F26 works too.
 */
export type Route =
  | { page: 'classes' }
  | { page: 'course'; course: string }
  | { page: 'gallery'; slug: string; course?: string }
  | { page: 'admin' }
  | { page: 'new' }
  | { page: 'edit'; slug: string }

export function parse(pathname: string): Route {
  const [a, b, c] = pathname.split('/').filter(Boolean)
  if (!a) return { page: 'classes' }
  if (a === 'classes') {
    if (!b) return { page: 'classes' }
    if (!c) return { page: 'course', course: b.toLowerCase() }
    return { page: 'gallery', slug: c, course: b.toLowerCase() }
  }
  if (a === 'edit') {
    if (!b) return { page: 'admin' }
    if (b === 'new') return { page: 'new' }
    return { page: 'edit', slug: b }
  }
  return { page: 'gallery', slug: a }
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(location.pathname))

  useEffect(() => {
    // Show the lowercase course address in the bar when it was typed with capitals.
    const [a, b] = location.pathname.split('/').filter(Boolean)
    if (a === 'classes' && b && b !== b.toLowerCase()) {
      history.replaceState(null, '', location.pathname.replace(b, b.toLowerCase()))
    }
    const onPop = () => setRoute(parse(location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((path: string) => {
    history.pushState(null, '', path)
    setRoute(parse(path))
  }, [])

  return { route, navigate }
}
