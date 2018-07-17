import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './routes/router.js'
import TreeView from 'vue-json-tree-view'
import global from './global/global'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(TreeView);
Vue.prototype.GLOBAL = global;

router.beforeEach((to, from, next) =>{
  console.log("to.path:",to.path);
  console.log("from.path:",from.path);
  if(to.path !== '/login'){
    let token = localStorage.getItem("token");
    let uid = localStorage.getItem("uid");
    let nick = localStorage.getItem("nick");
    if(!token || !uid || !nick){
      next("/login");
    }
    else {
      let role = localStorage.getItem("role");
      console.log("role:",role);
      if(role === "ROLE_USER"){
        next("/login");
      }
    }
  }
  console.log("next!");
  next();
});
new Vue({
  render: h => h(App),
  router
}).$mount('#app')

