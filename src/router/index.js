import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import register from '@/components/register'
import talk from '@/components/talk'
import write from '@/components/write'
import reply from '@/components/reply'
import publishArticle from '@/components/publishArticle'
import news from '@/components/new'
import userManage from '@/components/userManage'
import articleManage from '@/components/articleManage'
import publishPost from '@/components/publishPost'
import searchFind from '@/components/searchFind'
import userSetting from '@/components/userSetting'
import manageTalk from '@/components/manageTalk'
Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/userSetting',
      name: 'userSetting',
      component: userSetting
    },
    {
      path: '/',
      alias: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/talk',
      name: 'talk',
      component: talk
    },
    {
      path: '/write',
      name: 'write',
      component: write,
      children: [
        {
          path: '/publishArticle',
          name: 'publishArticle',
          component: publishArticle
        },
        {
          path: '/userManage',
          name: 'userManage',
          component: userManage
        },
        {
          path: '/articleManage',
          name: 'articleManage',
          component: articleManage
        },
        {
          path: '/manageTalk',
          name: 'manageTalk',
          component: manageTalk
        }
      ]
    },
    {
      path: '/reply/:id',
      name: 'reply',
      component: reply
    },
    {
      path: '/new/:_id/:count',
      name: 'new',
      component: news
    },
    {
      path: '/publishPost',
      name: 'publishPost',
      component: publishPost
    },
    {
      path: '/searchFind',
      name: 'searchFind',
      component: searchFind
    }
  ]
})
