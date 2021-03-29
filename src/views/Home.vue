<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <focus id="f1">
      <div>1111</div>
      <focus data-attr="a1">
        <div>
          <focus @open="open" @open2="open">
            <div>3333</div>
          </focus>
        </div>
        <div>2222</div>
        <focus>
          <focus v="11">
            <div>3333</div>
          </focus>
          <focus>
            <div>3333</div>
          </focus>
        </focus>
        <div>2222</div>
      </focus>
      <div>1111</div>
    </focus>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
// import focus from "@/focus/focus"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  open(data: any):void{
    console.log(data);
    
  }
}
</script>
