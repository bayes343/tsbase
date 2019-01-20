import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/serializer',
      name: 'serializer',
      component: () => import(/* webpackChunkName: "serializer" */ './views/SerializerPage.vue'),
    },
    {
      path: '/repository',
      name: 'repository',
      component: () => import(/* webpackChunkName: "repository" */ './views/RepositoryPage.vue'),
    },
  ],
});
