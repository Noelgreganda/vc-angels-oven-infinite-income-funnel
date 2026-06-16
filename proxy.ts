import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const RESERVED = new Set(['api', '_next', 'static', 'offline', 'login', 'favicon.ico'])

function resolveTenantSlug(req: NextRequest): string | null {
  const host = req.headers.get('host') ?? ''
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
  if (host !== root && host.endsWith(`.${root}`)) {
    const sub = host.slice(0, host.length - root.length - 1)
    if (sub && sub !== 'www') return sub
  }
  const [first] = req.nextUrl.pathname.split('/').filter(Boolean)
  return first && !RESERVED.has(first) ? first : null
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: new Headers(request.headers) } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  const slug = resolveTenantSlug(request)
  if (slug) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, status, subscription_active')
      .eq('slug', slug)
      .maybeSingle()

    const locked = !tenant || !tenant.subscription_active ||
      tenant.status === 'suspended' || tenant.status === 'cancelled'

    if (locked) {
      const url = request.nextUrl.clone()
      url.pathname = '/offline'
      url.searchParams.set('tenant', slug)
      return NextResponse.rewrite(url)
    }

    response.headers.set('x-tenant-slug', slug)
    if (tenant.id) response.headers.set('x-tenant-id', tenant.id)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|offline).*)'],
}
