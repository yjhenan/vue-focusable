import Vue from "vue";
import { Component } from "vue-property-decorator";

import template from "./home.vue";

import { navigationService } from "../../lib/focus.directive";
import FocusElement from "../../components/focus-element";

@Component({
  mixins: [template],
  components: {
    FocusElement
  }
})
export default class Home extends Vue {
    current = "";

    componentFunctionRight() {
      const el = navigationService.getFocusElementById("button6");
      if (el) el.focus();
    }

    componentFunctionLeft() {
      const el = navigationService.getFocusElementById("button1");
      if (el) el.focus();
    }

    componentFunctionClicked() {
      const el = navigationService.getFocusElementInFocus();
      if (el) this.current = `${el.id}`;
    }
}
