import { VNode } from "vue";
import { Vue } from "vue/types/vue";
export declare class FocusElement {
    static AutoFocus: string;
    private _listeners;
    id: string;
    parentId: string;
    isFocus: boolean;
    isSelect: boolean;
    /**
     * 是否为父节点
     *
     * @memberof FocusElement
     */
    isParent: boolean;
    constructor(vnode: VNode);
    /**
     * 获取`dom`的引用
     *
     * @readonly
     * @private
     * @type {(HTMLElement | null)}
     * @memberof FocusElement
     */
    private get $el();
    /**
     * 获取所对应的 VNode
     *
     * @readonly
     * @type {(Vue | null)}
     * @memberof FocusElement
     */
    private get $node();
    /**
     * 是否为默认
     *
     * @readonly
     * @private
     * @memberof FocusElement
     */
    get isDefault(): boolean;
    /**
     * 响应`left`事件时所要跳转的元素 `ID`
     */
    private get _left();
    /**
     * 响应`right`事件时所要跳转的元素 `ID`
     */
    private get _right();
    /**
     * 响应`up`事件时所要跳转的元素 `ID`
     */
    private get _up();
    /**
     * 响应`down`事件时所要跳转的元素 `ID`
     */
    private get _down();
    destroy(): void;
    focus(): void;
    blur(): void;
    /**
     * 将焦点从此元素移到 左边
     */
    left(): void;
    right(): void;
    up(): void;
    down(): void;
    enter(): void;
    /**
     * 触发监听器事件
     * @param type 触发类型
     */
    private triggerListener;
    getFocusElementNextById(el?: Vue | undefined): FocusElement | undefined;
    getFocusElementPrevById(el?: Vue | undefined): FocusElement | undefined;
    /**
     * 下一个默认焦点
     */
    private defaultFocusNext;
    /**
     * 上一个默认焦点
     */
    private defaultFocusPrevious;
    /**
     * 将`ID`对应的焦点组件设置为焦点
     * @param id
     */
    private doFocusElement;
    /**
     * 检测焦点组件是否是父组件，既容器组件
     * @param el 需要检测的组件
     * @returns 是否是父组件
     */
    private isParentFocusElement;
    /**
     * 查找指定父组件内的第一个子组件
     * @param parentElement 父组件
     * @returns 第一个子组件
     */
    private getParentElementChildrenFirst;
    /**
     * 查找指定父组件内的最后一个子组件
     * @param parentElement 父组件
     * @returns 最后一个子组件
     */
    private getParentElementChildrenLast;
}
