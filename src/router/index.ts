import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Book/BookView.vue';
// import Home from '../views/Invite/QRCode.vue';
// import Home from '../views/Invite/InviteView.vue';
// import Home from '../views/Invite/LoginView.vue';
// import Home from '../views/Review/ReviewView.vue';
// import Home from '../views/Review/LoginReview.vue';
// import Home from '../views/Review/ReviewDetail.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/bookInfo',
    name: 'bookInfo',
    component: () => import('@/views/Book/BookInfo.vue'),
    props: true
  },
  {
    path: '/inviteView',
    name: 'inviteView',
    component: () => import('@/views/Invite/InviteView.vue')
  },
  {
    path: '/inviteInfo',
    name: 'inviteInfo',
    component: () => import('@/views/Invite/InviteInfo.vue'),
    props: true
  },
  {
    path: '/loginView',
    name: 'loginView',
    component: () => import('@/views/Invite/LoginView.vue'),
    props: true
  },
  {
    path: '/reviewView',
    name: 'reviewView',
    component: () => import('@/views/Review/ReviewView.vue')
  },
  {
    path: '/reviewDetail/:reviewInfo',
    name: 'reviewDetail',
    component: () => import('@/views/Review/ReviewDetail.vue')
  },
  {
    path: '/loginReview',
    name: 'loginReview',
    component: () => import('@/views/Review/LoginReview.vue')
  },
  {
    path: '/QRCode',
    name: 'QRCode',
    component: () => import('@/views/Invite/QRCode.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
