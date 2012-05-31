// For an introduction to the HTML Fragment template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    //function ready(element, options) {
    //    // TODO: 在此处初始化片段。
    //    var holder = document.querySelector("#datePlaceholder");
    //    var calender = new Windows.Globalization.Calendar();
    //    holder.innerText = calender.dayOfWeekAsString();
    //}

    //function updateLayout(element, viewState) {
    //    // TODO: Respond to changes in viewState.
    //}

    //WinJS.UI.Pages.define("/html/page2.html", {
    //    ready: ready,
    //    updateLayout: updateLayout
    //});


    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var __DOMAIN__ = 'http://laiwang.com';
    var __API_DOMAIN__ = 'https://api.laiwang.com/v1';
    var __LENGTH__ = 25;

    //当某项被调用时发生作用
    //如果snapped，转到某分组详细页面
    //如果正常跳转，转到某项的详细页面
    function itemInvoked(eventObject) {
        if (appView.value === appViewState.snapped) {
            // If the page is snapped, the user invoked a group.
            var group = data.groups.getAt(eventObject.detail.itemIndex);
            nav.navigate("/html/groupDetailPage.html", { group: group });
        } else {
            // If the page is not snapped, the user invoked an item.
            var item = data.items.getAt(eventObject.detail.itemIndex);
            nav.navigate("/html/itemDetailPage.html", { item: item });
        }
    }

    function groupDataSelector(item){
        return {
            title: item.group.title,
            click: function () {
                nav.navigate("/html/groupDetailPage.html", { group: item.group });
            }
        }
    }

    function groupKeySelector(item) {
        return item.group.key;
    }

    //刷新当前页面，展示groupedIem列表
    function updateLayout(element, viewState) {

        //从页面上获得控件实体
        var listView = element.querySelector(".groupeditemslist").winControl;

        if (viewState === appViewState.snapped) {
            // If the page is snapped, display a list of groups.
            ui.setOptions(listView, {
                itemDataSource: data.groups.dataSource,
                groupDataSource: null,
                layout: new ui.ListLayout()
            });
        } else {
            // If the page is not snapped, display a grid of grouped items.
            var groupDataSource = data.items.createGrouped(groupKeySelector, groupDataSelector).groups;//？？？？？？？？？？？

            ui.setOptions(listView, {
                itemDataSource: data.items.dataSource,
                groupDataSource: groupDataSource.dataSource,
                layout: new ui.GridLayout({ groupHeaderPosition: "top" })
            });
        }
    }

    function ready(element, options) {
        //ajaxSet()

        //从页面上获得控件实体
        var listView = element.querySelector(".groupeditemslist").winControl;

        //对控件包含的各个item赋值、赋方法
        ui.setOptions(listView, {
            groupHeaderTemplate: element.querySelector(".headerTemplate"),//to do rebuild
            itemTemplate: element.querySelector(".itemtemplate"),//to do rebuild
            oniteminvoked: itemInvoked.bind(this)
        });

        //刷新当前页面，展示groupedIem列表
        updateLayout(element, appView.value);
    }

   

    ui.Pages.define("/html/groupedItemsPage.html", {
        // This function is used in updateLayout to select the data to display
        // from an item's group.
        groupDataSelector: groupDataSelector,

        // This function is used in updateLayout to select an item's group key.
        groupKeySelector: groupKeySelector,

        itemInvoked: itemInvoked,

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: ready,

        // This function updates the page layout in response to viewState changes.
        updateLayout: updateLayout

    });


})();
