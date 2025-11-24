import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 定义需要保护的路由（需要登录才能访问）
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/history(.*)',
])

export default clerkMiddleware((auth, req) => {
  // 如果是受保护的路由，要求用户登录
  if (isProtectedRoute(req)) {
    auth.protect()
  }
})

export const config = {
  matcher: [
    // 跳过 Next.js 内部路径和静态文件
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 总是运行在 API 路由上
    '/(api|trpc)(.*)',
  ],
}
