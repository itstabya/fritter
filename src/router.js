import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// implemented with slots 
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('./views/Main.vue'),
      props: true
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./views/Account.vue'),
      props: true
    },
    {
      path: '/:username',
      name: 'user',
      component: () => import('./views/User.vue'),
      props: true
    },
  ],
})
