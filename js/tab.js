/**
 * phy_Tab —— 可复用 Tab 选项卡组件
 * 作者：潘贺杨 panheyang
 *
 * 用法：
 *   容器：  data-phy-tab-group="任意名称"
 *   按钮：  data-phy-tab="唯一标识"   class="phy_tab_item"
 *   面板：  data-phy-panel="对应标识"  class="phy_tab_panel"
 *
 * 自动扫描页面所有 tab 组并初始化，支持多组互不干扰。
 */
(function () {
    'use strict';

    /**
     * 初始化单个 tab 组
     * @param {HTMLElement} phy_container - 具有 data-phy-tab-group 的容器元素
     * 作者：潘贺杨
     */
    function phy_initTabGroup(phy_container) {
        // 找到当前容器内的所有 tab 按钮和内容面板
        var phy_navItems = phy_container.querySelectorAll('[data-phy-tab]');
        var phy_panels = phy_container.querySelectorAll('[data-phy-panel]');

        if (phy_navItems.length === 0) return;

        /**
         * 清除所有选项卡的选中状态
         * 作者：潘贺杨
         */
        function phy_clearAllActive() {
            phy_navItems.forEach(function (phy_item) {
                phy_item.classList.remove('phy_active');
            });
            phy_panels.forEach(function (phy_panel) {
                phy_panel.classList.remove('phy_active');
            });
        }

        /**
         * 设置当前选项卡为选中状态
         * @param {string} phy_target - 目标 tab 的 data-phy-tab 值
         * 作者：潘贺杨
         */
        function phy_setActive(phy_target) {
            // 先清除所有选项卡的选中状态
            phy_clearAllActive();

            // 再设置当前元素的选中状态
            var phy_activeNav = phy_container.querySelector('[data-phy-tab="' + phy_target + '"]');
            var phy_activePanel = phy_container.querySelector('[data-phy-panel="' + phy_target + '"]');

            if (phy_activeNav) phy_activeNav.classList.add('phy_active');
            if (phy_activePanel) phy_activePanel.classList.add('phy_active');
        }

        // 为每个 tab 按钮绑定点击事件监听
        phy_navItems.forEach(function (phy_item) {
            phy_item.addEventListener('click', function () {
                var phy_target = phy_item.getAttribute('data-phy-tab');
                phy_setActive(phy_target);
            });
        });

        // 初始化：确保 HTML 中默认 phy_active 的 tab 对应的面板也同步激活
        var phy_defaultActive = phy_container.querySelector('[data-phy-tab].phy_active');
        if (phy_defaultActive) {
            phy_setActive(phy_defaultActive.getAttribute('data-phy-tab'));
        }
    }

    /**
     * 扫描页面中所有 tab 组并逐一初始化
     * 作者：潘贺杨
     */
    function phy_initAllTabs() {
        var phy_groups = document.querySelectorAll('[data-phy-tab-group]');
        phy_groups.forEach(function (phy_group) {
            phy_initTabGroup(phy_group);
        });
    }

    // DOM 加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', phy_initAllTabs);
    } else {
        phy_initAllTabs();
    }

    // 暴露到全局，方便外部手动调用
    // 作者：潘贺杨
    window.phy_Tab = {
        init: phy_initAllTabs,
        initGroup: phy_initTabGroup
    };
})();
