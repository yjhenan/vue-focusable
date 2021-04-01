import { VNode } from "vue";
import { FocusElement } from "./FocusElement";

/**
 * 组件可以响应的事件
 *
 * @export
 * @enum {number}
 */
export enum NavigationServiceDirection {
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
    focusAbleElements: Map<FocusElement, VNode> = new Map<FocusElement, VNode>();
    /**
     * 最后一个具有焦点的组件ID
     *
     * @memberof NavigationService
     */
    lastElementIdInFocus = "";
    blockAllSpatialNavigation = false;

    constructor(clickable = false) {
        if (clickable) {
            this.setupMouseEvents();
        }
    }
    setupMouseEvents(): void {
        // enable mouseover event
        document.addEventListener("mouseover", (e: MouseEvent) => {
            if (this.blockAllSpatialNavigation) return false;

            const el = this.findFocusable(<HTMLElement>e.target);
            if (el) el.focus();
        });

        // enable mouseout event
        document.addEventListener("mouseout", (e: MouseEvent) => {
            if (this.blockAllSpatialNavigation) return false;

            const el = this.findFocusable(<HTMLElement>e.target);
            if (el) el.blur();
        });


        // enable click event
        document.addEventListener("click", (e: MouseEvent) => {
            if (this.blockAllSpatialNavigation) return false;
            const el = this.findFocusable(<HTMLElement>e.target);
            if (el) el.enter();
        });

    }

    // try to find focusable element on mouse hover or click
    findFocusable(target: Element): FocusElement | undefined {
        // inside loop search for focusable element
        // we need this if the focusable element has children inside
        // so e.target can point to child or grandchild of focusable element
        while (target) {
            if (target.id) {
                const focusEl = this.getFocusElementById(target.id);
                if (focusEl) return focusEl;
            }
            if (!target.parentNode) return undefined;
            target = <Element>target.parentNode;
        }
        return undefined;
    }

    /**
     * 触发事件：进行导航
     * @param action 动作
     */
    spatialNavigationAction(action: NavigationServiceDirection): void {
        const el = this.getFocusElementInFocus();

        // let keyValue = NavigationServiceDirection[action];

        // initiate focus action if we have active element
        if (el) {
            switch (action) {
                case NavigationServiceDirection.Up:
                    el.up();
                    break;
                case NavigationServiceDirection.Down:
                    el.down();
                    break;
                case NavigationServiceDirection.Left:
                    el.left();
                    break;
                case NavigationServiceDirection.Right:
                    el.right();
                    break;
                case NavigationServiceDirection.Enter:
                    el.enter();
                    break;
            }

            // if there is no active element, try to find last element in focus
        } else if (this.getFocusElementById(this.lastElementIdInFocus)) {
            const el = this.getFocusElementById(this.lastElementIdInFocus);
            if (el) el.focus();

            // as a last resort, try to find a default focus element to 'reset' focus
        } else {
            const el = this.getFocusElementIsDefault();
            if (el) el.focus();
        }
    }

    /**
     * 从集合中添加对应的组件
     * @param focusElement 所添加组件
     */
    registerFocusElement(focusElement: FocusElement, vnode: VNode): void {
        this.focusAbleElements.set(focusElement, vnode);
        // 如果没有活动焦点且当前元素为默认值，则设置初始焦点
        if (focusElement.isDefault && !this.getFocusElementInFocus()) {
            focusElement.focus();
        }
    }

    /**
     * 从集合中删除对应的组件
     * @param focusElement 所要删除组件
     */
    deRegisterFocusElement(focusElement: FocusElement): void {
        focusElement.destroy();
        this.focusAbleElements.delete(focusElement);
    }

    /**
     * 获取当前具有焦点的组件
     * @returns 当前焦点组件
     */
    getFocusElementInFocus(): FocusElement | undefined {
        for (const [el] of this.focusAbleElements) {
            if (el.isFocus) return el;
        }
    }

    /**
     * 根据 id 获取对应的组件
     * @param id 组件 id
     * @returns id 所对应的组件 `FocusElement`
     */
    getFocusElementById(id: string): FocusElement | undefined {
        for (const [el] of this.focusAbleElements) {
            if (el.id === id) return el;
        }
    }
    /**
     * 根据`id`获取对应的`VNode`
     * @param id 组件 `id`
     * @returns id 所对应的`VNode`
     */
    getFocusElementVNodeById(id: string): VNode | undefined {
        for (const [el, vnode] of this.focusAbleElements) {
            if (el.id === id) return vnode;
        }
    }

    /**
     * 获取默认的焦点组件
     * @returns 默认焦点组件
     */
    getFocusElementIsDefault(): FocusElement | undefined {
        for (const [el] of this.focusAbleElements) {
            if (el.isDefault) return el;
        }
    }
    /**
     * 获取下一个默认焦点元素
     *
     * @param {string} id 当前组件 ID
     * @returns {(FocusElement  | undefined)} 下一个组件
     * @memberof NavigationService
     */
    getDefaultFocusNextById(id: string): FocusElement  | undefined {
        let flag = false;
        for (const [el] of this.focusAbleElements) {
            if (el.id === id) flag = true;
            if (flag && el.isDefault) return el;
        }
    }
    /**
     * 获取上一个默认焦点元素
     *
     * @param {string} id 当前组件 ID
     * @returns {(FocusElement  | undefined)} 上一个组件
     * @memberof NavigationService
     */
    getDefaultFocusPreviousById(id: string): FocusElement | undefined {
        const focusElements:Array<FocusElement> = [];
        this.focusAbleElements.forEach((value, key) => {
            if (key.isDefault) {
                focusElements.push(key)
            }
            if (key.id == id) return;
        });
        return focusElements.pop();
    }
    /**
     * 清楚所有组件的焦点状态
     */
    blurAllFocusElements(): void {
        for (const [el] of this.focusAbleElements) {
            if (el.isFocus) el.blur();
        }
    }
}
