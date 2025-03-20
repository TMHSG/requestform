import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _49df5322 = () => interopDefault(import('..\\pages\\editphieuyeucau.vue' /* webpackChunkName: "pages/editphieuyeucau" */))
const _44f63d9a = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _d6e57a8e = () => interopDefault(import('..\\pages\\phieuyeucau.vue' /* webpackChunkName: "pages/phieuyeucau" */))
const _259b52bf = () => interopDefault(import('..\\pages\\taokhachhang.vue' /* webpackChunkName: "pages/taokhachhang" */))
const _bef8a7a2 = () => interopDefault(import('..\\pages\\taotaikhoan.vue' /* webpackChunkName: "pages/taotaikhoan" */))
const _ee2918e4 = () => interopDefault(import('..\\pages\\thongtintaikhoan.vue' /* webpackChunkName: "pages/thongtintaikhoan" */))
const _13dd3e1c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/editphieuyeucau",
    component: _49df5322,
    name: "editphieuyeucau"
  }, {
    path: "/login",
    component: _44f63d9a,
    name: "login"
  }, {
    path: "/phieuyeucau",
    component: _d6e57a8e,
    name: "phieuyeucau"
  }, {
    path: "/taokhachhang",
    component: _259b52bf,
    name: "taokhachhang"
  }, {
    path: "/taotaikhoan",
    component: _bef8a7a2,
    name: "taotaikhoan"
  }, {
    path: "/thongtintaikhoan",
    component: _ee2918e4,
    name: "thongtintaikhoan"
  }, {
    path: "/",
    component: _13dd3e1c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
