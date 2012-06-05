(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var API_DOMAIN = data.API_DOMAIN;
    var comments = new WinJS.Binding.List();

    function ready(element, options) {
        var item = options && options.item ? options.item : data.items.getAt(0);
        stuff(element, item);

        //从页面上获得控件实体
        var listView = element.querySelector(".item-comment-wrapper").winControl;
        ////return commentsList.createFiltered(function (c) { return c.item.id === item.id; });
        //var comments = data.getCommentsFromItem(item);
        
        //取50条评论，并放入comments数组中
        getComment(item.id, item.publisher.id, 50);

        //to do rebuild  2秒之后再展示数据，防止取不到评论
        setTimeout(function () {
            var commentList = comments.createGrouped(
                    function (c) { return item.id; },
                    function (c) { return item; }
                );

            //为组件绑定数据和事件
            ui.setOptions(listView, {
                itemDataSource: commentList.dataSource,// itemDataSource: pageList.dataSource,
                itemTemplate: element.querySelector(".item-comment")
            });
        }, 2000);
        
      

        //关于跳转
        //if (appView.value === appViewState.snapped) {
        //    listView.layout = new ui.ListLayout();
        //} else {
        //    listView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
        //}
    }

    //为该item(即：post)的相应标签填充数据
    function stuff(element, item) {
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
    }

    //获取某一条item(即：post)的评论
    function getComment(postid, publiserid, size) {
        $.ajax({
            global: false,
            url: API_DOMAIN + '/post/comment/list',
            type: 'GET',
            data: {
                'postId': postid,
                'publisher': publiserid,
                'size': size,
                'access_token': localStorage['access_token']
            },
            _success: function (_data) {
                if (_data.values && _data.values.length !== 0) {
                    _data.values.forEach(function (v) {
                        //v.item = item;
                        v.commentorLink = API_DOMAIN + "/u/" + v.commentor.id;
                        v.commentorAvatar = v.commentor.avatar;
                        v.commentorName = v.commentor.name;
                        v.commentCreatedAt = data.transformDate(v.createdAt);
                        v.comment = v.content;
                        comments.push(v);
                    });
                }
                //lock = false;
            }
        });       
    }
   
    ui.Pages.define("/html/itemDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: ready
    })
})();
