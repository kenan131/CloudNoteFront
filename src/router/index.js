import Vue from "vue";
import Router from "vue-router";
import { getToken } from "../utils/token.js";
Vue.use(Router);

const router =  new Router({
  routes: [
    {
      path: "/",
      name: "share",
      component: () => import("../views/Share.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue")
    },
    {
      path: "/shareBook",
      name: "shareBook",
      component: () => import("../views/ShareBook.vue")
    },
    {
      path: "/admin",
      name: "admin",
      meta:{
        requerLogin:true
      },
      component: () => import("../views/Admin.vue")
    },
    {
      path: "/home",
      name: "home",
      meta:{
        requerLogin:true
      },
      component: () => import("../views/Home.vue")
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/Register.vue")
    },
    {
      path: "/board",
      name: "board",
      component: () => import("../views/Board.vue")
    },
    {
      path: "/rePassword",
      name: "rePassword",
      component: () => import("../views/rePassword.vue")
    },
    {
      path:'/*',
      component:()=>import ('@/components/NotFound')
    }
  ],
  mode:"history"
});
router.beforeEach((to,from,next)=>{
  if(to.meta.requerLogin){
    if(getToken("token")){
      next();
    }else{
      next({
        path:'/',
        query:{redirect:to.fullPath}
      });
    }
  }else{
    next();
  }
});
export default router