import Vue, { VueConstructor, } from "vue"
import { NormalizedScopedSlot } from "vue/types/vnode";

import { FocusElement } from "./FocusElement";
import { NavigationService } from "./navigation.service";


export let navigationService: NavigationService;

const ElementName = "Focus-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);

// type NavigationServiceDirection = "Up" | "Down" | "Left" | "Right" | "Enter"


export type SpatialNavigationOptions = {
    /**
     * 渲染标签
     */
    tag: string;
    /**
     * 是否开启点击模式：默认开启
     */
    clickable?: boolean;
    /**
     * 选中状态下的 class 样式名称
     */
    className?: string;
    /**
     * 设置键盘事件
     */
    setupKeyBoardEvents: (eventType: NavigationService) => void;
}

export default {
    install(Vue: VueConstructor<Vue>, options: SpatialNavigationOptions): void {
        navigationService = new NavigationService(options.clickable);
        options.setupKeyBoardEvents(navigationService);
        Vue.component('Focus', {
            data() {
                return {
                    id:null,
                    name: ElementName,
                    focusElement: null
                }
            },
            render(createElement) {
                return createElement(options.tag, {
                    class: {
                        [options.className || "focus"]:this.$data.focusElement?.isFocus
                    }
                }, [
                    (this.$scopedSlots.default as NormalizedScopedSlot)({
                        isDefault: this.$data.focusElement?.isDefault,
                        isFocus: this.$data.focusElement?.isFocus
                    })]);
            },
            mounted() {
                this.$data.focusElement = new FocusElement(this.$vnode);
                navigationService.registerFocusElement(this.$data.focusElement, this.$vnode);
                
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

