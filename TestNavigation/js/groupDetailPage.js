(function () {
    "use strict";

    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var group;
    var items;

    function ready(element, options) {
        group = (options && options.group) ? options.group : data.groups.getAt(0);
        items = data.getItemsFromGroup(group);
        var pageList = items.createGrouped(
            function (item) { return group.key; },
            function (item) { return group; }
            );
        var groupDataSource = pageList.groups.dataSource;

        element.querySelector("header[role=banner] .pagetitle").textContent = group.title;

        var listView = element.querySelector(".grouplist").winControl;

        ui.setOptions(listView, {
            itemDataSource: pageList.dataSource,
            itemTemplate: element.querySelector(".itemtemplate"),
            groupDataSource: pageList.groups.dataSource,
            groupHeaderTemplate: element.querySelector(".headerTemplate"),
            oniteminvoked: this.itemInvoked.bind(this)
        });
        this.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value);
    }

    function updateLayout(element, viewState) {

        var listView = element.querySelector(".grouplist").winControl;

        if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
            listView.layout = new ui.ListLayout();
        } else {
            listView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
        }
    }

    function itemInvoked(eventObject) {
        var item = items.getAt(eventObject.detail.itemIndex);
        if (item.group.key === "laiwang1") {
            nav.navigate("/html/itemDetailPage.html", { item: item });
        }
    }

    ui.Pages.define("/html/groupDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: ready,

        // This function updates the page layout in response to viewState changes.
        updateLayout: updateLayout,

        itemInvoked: itemInvoked
    });
})();
