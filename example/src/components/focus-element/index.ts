import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import template from "./focus-element.vue";

@Component({
  mixins: [template],
  components: {
  }
})
export default class FocusElement extends Vue {

}
