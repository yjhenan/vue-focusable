import Vue, { VueConstructor, } from "vue"
import { NormalizedScopedSlot } from "vue/types/vnode";

import { FocusElement } from "./FocusElement";
import { NavigationService } from "./navigation.service";

const keyCodes = {
    "up": 38,
    "down": 40,
    "left": 37,
    "right": 39,
    "enter": 13
}
export const navigationService = new NavigationService(keyCodes);

const ElementName = "Focus-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);

// type NavigationServiceDirection = "Up" | "Down" | "Left" | "Right" | "Enter"


export type SpatialNavigationOptions = {
    tag: string;
    setupKeyBoardEvents: (eventType: NavigationService) => void;
}

export default {
    install(Vue: VueConstructor<Vue>, options: SpatialNavigationOptions): void {
        options.setupKeyBoardEvents(navigationService);
        Vue.component('Focus', {
            data() {
                return {
                    name: ElementName,
                    focusElement: null
                }
            },
            // props: {
            //     id: {
            //         default:keyCount++,
            //     }
            // },
            render(createElement) {
                
                // (this.$vnode.data?.scopedSlots?.default as NormalizedScopedSlot )({
                //     isDefault: false,
                //     isFocus: false
                // })
                return createElement(options.tag, [
                    (this.$scopedSlots.default as NormalizedScopedSlot)({
                        isDefault: this.$data.focusElement?.isDefault,
                        isFocus: this.$data.focusElement?.isFocus
                    })]);
            },
            mounted() {
                this.$data.focusElement = new FocusElement(this.$vnode)
                // console.log(this);

                navigationService.registerFocusElement(this.$data.focusElement);
            },
            destroyed() {
                if (this.$data.focusElement.id) {
                    const focusElement = navigationService.getFocusElementById(this.$data.focusElement.id);
                    if (focusElement) navigationService.deRegisterFocusElement(focusElement);
                    this.$data.focusElement = null;
                }
            }
        })
    }
}

