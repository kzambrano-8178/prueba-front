import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({

  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   component: () => import('@/views/dashboard/Login'),
    // },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        // {
        //   name: 'Dashboard',
        //   path: '',
        //   component: () => import('@/views/dashboard/Dashboard'),
        // },
        // Pages
        {
          name: 'Empleados',
          path: '/pages/clientes',
          component: () => import('@/views/dashboard/pages/Clientes'),
          beforeEnter: (to, from, next) => {
            // if (existToken() === false) {
            //   next('/');
            // }
            next();
          }
        },
        {
          name: 'Cargos',
          path: '/pages/cargos',
          component: () => import('@/views/dashboard/pages/Cargos'),
          beforeEnter: (to, from, next) => {
            // if (existToken() === false) {
            //   next('/');
            // }
            next();
          }
        },
        {
          name: 'Contratos',
          path: '/pages/contratos',
          component: () => import('@/views/dashboard/pages/Contratos'),
          beforeEnter: (to, from, next) => {
            // if (existToken() === false) {
            //   next('/');
            // }
            next();
          }
        },



        // Upgrade
        {
          name: 'Upgrade',
          path: '/upgrade',
          component: () => import('@/views/dashboard/Upgrade'),
          beforeEnter: (to, from, next) => {
            // if (existToken() === false) {
            //   next('/');
            // }
            next();
          }
        },

      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/dashboard/pages/404'),
    },
  ],
})
function existToken() {
  return !!localStorage.token;
}


router.beforeEach((to, from, next) => {
  if (to.fullPath  === '/dashboard') {
    // if (existToken() === false) {
    //   next('/');
    // }
  }
  if (to.fullPath === '/') {
    // if (existToken()) {
    //   next('/dashboard');
    // }
  }
  next();
});
export default router

