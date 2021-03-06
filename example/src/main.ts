import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// import VueFocus from "./lib/focus.directive";

// Vue.use(VueFocus);

import Focusable, { SpatialNavigationOptions ,NavigationServiceDirection } from "../../dist/"
Vue.use(Focusable, <SpatialNavigationOptions>{
  tag: "div",
  clickable: true,
  setupKeyBoardEvents(el) {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      // 查找
      const keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
      if (el) {
        switch (keyCode) {
          case 38:
            el.spatialNavigationAction(NavigationServiceDirection.Up)
            break;
          case 40:
            el.spatialNavigationAction(NavigationServiceDirection.Down)
            break;
          case 37:
            el.spatialNavigationAction(NavigationServiceDirection.Left)
            break;
          case 39:
            el.spatialNavigationAction(NavigationServiceDirection.Right)
            break;
          case 13:
            el.spatialNavigationAction(NavigationServiceDirection.Enter)
            break;
        }
      }
    });
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
