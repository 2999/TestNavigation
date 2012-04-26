(function () {
    "use strict";

    //function linkClickEventHandler(eventInfo) {
    //    eventInfo.preventDefault(); //阻止 超级连接的默认行为
    //    var link = eventInfo.target; //获取连接
    //    WinJS.Navigation.navigate(link.href);//调用跳转
    //}

    function login2page2(eventTarget) {
        var link = "/html/groupedItemsPage.html";
        WinJS.Navigation.navigate(link);
    }

    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        // TODO: Initialize the fragment here.
        //WinJS.Utilities.query("a").listen("click", linkClickEventHandler, false);
        document.querySelector("#btnLogin").addEventListener("click", login2page2, false);
    }

    

    WinJS.UI.Pages.define("/html/homePage.html", {
        ready: ready
    });
})();
