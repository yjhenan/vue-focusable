<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div class="df fw yellow">
        <Focusable down="left1"  class="item blueviolet">{{0}}</Focusable>
        <Focusable v-for="i in 5" :key="i" class="item blueviolet" default>{{i}}</Focusable>
    </div>
    <Focusable id="f1" class="df crimson">
      <!-- <template>
        <div :style="{'color':scope.isFocus?'red':'#333'}">1111111{{scope}}</div>
      </template> -->
          <Focusable class="blue">
              <Focusable id="left0" right="right2"  class="item red">{{0}}</Focusable>
              <Focusable :id="'left' + i" right="right2" v-for="i in 5" :key="i" class="item red">{{i}}</Focusable>
          </Focusable>
           <Focusable class="df dfc red">
               <div>
                <Focusable class="df fw blueviolet">
                    <Focusable left="AUTOFOCUS" down="AUTOFOCUS" class="item blue">{{0}}</Focusable>
                    <div v-for="i in 10" :key="i">
                        <Focusable :id="'right' + i" v-if="i%2 == 0" class="item blue">{{i}}</Focusable>
                        <div  v-if="i%2 != 0" class="item crimson">{{i}}</div>
                    </div>
                </Focusable>
               </div>
               <Focusable class="df fw red">
                   <Focusable v-for="i in 10" :key="i" class="item yellow" default>{{i}}</Focusable>
               </Focusable>
           </Focusable>
    </Focusable>
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
