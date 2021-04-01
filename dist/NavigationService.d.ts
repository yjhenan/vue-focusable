import { VNode } from "vue";
import { FocusElement } from "./FocusElement";
/**
 * 组件可以响应的事件
 *
 * @export
 * @enum {number}
 */
export declare enum NavigationServiceDirection {
    /**
     * 上
     */
    Up = "up",
    /**
     * 下
     */
    Down = "down",
    /**
     * 左
     */
    Left = "left",
    /**
     * 右
     */
    Right = "right",
    /**
     * 确认
     */
    Enter = "enter"
}
export default class NavigationService {
    /**
     * 所有焦点组件集合
     *
     * @type {Map<FocusElement,VNode>}
     * @memberof NavigationService
     */
    focusAbleElements: Map<FocusElement, VNode>;
    /**
     * 最后一个具有焦点的组件ID
     *
     * @memberof NavigationService
     */
    lastElementIdInFocus: string;
    blockAllSpatialNavigation: boolean;
    constructor(clickable?: boolean);
    setupMouseEvents(): void;
    findFocusable(target: Element): FocusElement | undefined;
    /**
     * 触发事件：进行导航
     * @param action 动作
     */
    spatialNavigationAction(action: NavigationServiceDirection): void;
    /**
     * 从集合中添加对应的组件
     * @param focusElement 所添加组件
     */
    registerFocusElement(focusElement: FocusElement, vnode: VNode): void;
    /**
     * 从集合中删除对应的组件
     * @param focusElement 所要删除组件
     */
    deRegisterFocusElement(focusElement: FocusElement): void;
    /**
     * 获取当前具有焦点的组件
     * @returns 当前焦点组件
     */
    getFocusElementInFocus(): FocusElement | undefined;
    /**
     * 根据 id 获取对应的组件
     * @param id 组件 id
     * @returns id 所对应的组件 `FocusElement`
     */
    getFocusElementById(id: string): FocusElement | undefined;
    /**
     * 根据`id`获取对应的`VNode`
     * @param id 组件 `id`
     * @returns id 所对应的`VNode`
     */
    getFocusElementVNodeById(id: string): VNode | undefined;
    /**
     * 获取默认的焦点组件
     * @returns 默认焦点组件
     */
    getFocusElementIsDefault(): FocusElement | undefined;
    /**
     * 获取下一个默认焦点元素
     *
     * @param {string} id 当前组件 ID
     * @returns {(FocusElement  | undefined)} 下一个组件
     * @memberof NavigationService
     */
    getDefaultFocusNextById(id: string): FocusElement | undefined;
    /**
     * 获取上一个默认焦点元素
     *
     * @param {string} id 当前组件 ID
     * @returns {(FocusElement  | undefined)} 上一个组件
     * @memberof NavigationService
     */
    getDefaultFocusPreviousById(id: string): FocusElement | undefined;
    /**
     * 清楚所有组件的焦点状态
     */
    blurAllFocusElements(): void;
}
