(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;



    function ready(element, options) {
        var item = options && options.item ? options.item : data.items.getAt(0);
        element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
        element.querySelector("article .item-title").textContent = item.title;
        element.querySelector("article .item-subtitle").textContent = item.subtitle;
        if (!!(item.attachments[0]) && item.attachments[0].picture) {
            element.querySelector("article .item-image").src = item.backgroundImage;
        } else {
            element.querySelector("article .item-image").style.display = "none";
        }
        element.querySelector("article .item-image").alt = item.subtitle;
        element.querySelector("article .item-content").innerHTML = item.content;

        //从页面上获得控件实体
        var listView = element.querySelector(".item-comment-wrapper").winControl;

        //为组件绑定数据和事件
        ui.setOptions(listView, {
            itemDataSource: data.comments.dataSource,
            itemTemplate: element.querySelector(".item-comment")
        });

        //关于跳转
        //if (appView.value === appViewState.snapped) {
        //    listView.layout = new ui.ListLayout();
        //} else {
        //    listView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
        //}
    }

   
    ui.Pages.define("/html/itemDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: ready
    })
})();
