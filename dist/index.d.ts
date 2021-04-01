import Vue, { VueConstructor } from "vue";
import NavigationService from "./NavigationService";
export { NavigationServiceDirection } from "./NavigationService";
export declare let navigationService: NavigationService;
export declare type SpatialNavigationOptions = {
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
};
declare const _default: {
    install(Vue: VueConstructor<Vue>, options: SpatialNavigationOptions): void;
};
export default _default;
