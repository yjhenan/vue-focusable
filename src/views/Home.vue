<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div class="df fw yellow">
        <focus down="left1"  class="item blueviolet">{{0}}</focus>
        <focus v-for="i in 5" :key="i" class="item blueviolet" default>{{i}}</focus>
    </div>
    <focus id="f1" class="df crimson">
      <!-- <template>
        <div :style="{'color':scope.isFocus?'red':'#333'}">1111111{{scope}}</div>
      </template> -->
          <focus class="blue">
              <focus id="left0" right="right2"  class="item red">{{0}}</focus>
              <focus :id="'left' + i" right="right2" v-for="i in 5" :key="i" class="item red">{{i}}</focus>
          </focus>
           <focus class="df dfc red">
               <div>
                <focus class="df fw blueviolet">
                    <focus left="AUTOFOCUS" down="AUTOFOCUS" class="item blue">{{0}}</focus>
                    <div v-for="i in 10" :key="i">
                        <focus :id="'right' + i" v-if="i%2 == 0" class="item blue">{{i}}</focus>
                        <div  v-if="i%2 != 0" class="item crimson">{{i}}</div>
                    </div>
                </focus>
               </div>
               <focus class="df fw red">
                   <focus v-for="i in 10" :key="i" class="item yellow" default>{{i}}</focus>
               </focus>
           </focus>
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
  open(data: unknown): void {
    console.log(data);
  }
}
</script>
<style scoped>
.df {
  display: flex;
}
.dfc {
  flex-direction: column;
}
.fw{
    flex-wrap: wrap;
}
.item {
  margin: 10px;
  height: 100px;
  width: 100px;
}
.red {
  background-color: red;
}
.blue{
    background-color: blue;
}
.yellow{
    background-color: yellow;
}
.blueviolet{
    background-color: blueviolet;
}
.crimson{
    background-color: crimson;
}
.focus{
    box-sizing: border-box;
    opacity: .5;
    border: 1px dashed mediumvioletred;
    box-shadow: 5px 5px;
}
</style>
