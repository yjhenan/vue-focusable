import Vue, { Component, ComponentOptions, FunctionalComponentOptions, VueConstructor, } from "vue"

import { FocusElement } from "./focus.directive";
import { NavigationService } from "./navigation.service";

const keyCodes = {
    "up": 38,
    "down": 40,
    "left": 37,
    "right": 39,
    "enter": 13
}
const navigationService = new NavigationService(keyCodes);

const ElementName = "Focus-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
let keyCount = 0;

// type NavigationServiceDirection = "Up" | "Down" | "Left" | "Right" | "Enter"


export type FocusOptions = {
    tag: string;
    event: (eventType: NavigationService) => void;
}

export default {
    install(Vue: VueConstructor<Vue>, options: FocusOptions) {
        options.event(navigationService);
        Vue.component('Focus', {
            data() {
                return {
                    name: ElementName,
                }
            },
            // props: {
            //     id: {
            //         default:keyCount++,
            //     }
            // },
            render(createElement, hack) {
             
                return createElement(options.tag, {}, this.$vnode.componentOptions?.children);
            },
            mounted() {
                const focusElement = new FocusElement(this.$vnode)
                console.log(this);
                
                navigationService.registerFocusElement(focusElement);
                // 设置默认
                if (focusElement.isDefault && !navigationService.getFocusElementInFocus()) {
                    focusElement.focus();
                }
            },
            destroyed() {
                // if (this.id) {
                //     let focusElement = navigationService.getFocusElementById(String(this.id));
                //     if (focusElement) navigationService.deRegisterFocusElement(focusElement);
                //   }
            }
        })
    }
}

