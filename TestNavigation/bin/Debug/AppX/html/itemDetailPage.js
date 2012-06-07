(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var API_DOMAIN = data.API_DOMAIN;
    var comments;

    function ready(element, options) {
        comments = new WinJS.Binding.List();//每次请求时都要重新new WinJS.Binding.List()，否则所有的评论数据都会被push到其中
        var item = options && options.item ? options.item : data.items.getAt(0);

        //var _item = data.items.createFiltered(function (it) { return it.id === item.id; });

        //stuff(element, item);

        //从页面上获得控件实体
        var listView = element.querySelector(".item-content-comments").winControl;

        
        //var comments = data.getCommentsFromItem(item);
        
        //取50条评论，并放入comments数组中
        getComment(item, 50);

        //to do rebuild  .5秒之后再展示数据，防止取不到评论
        setTimeout(function () {

            //var commentList = comments.createFiltered(
            //    function (c) { return c.item.id === item.id; }
            //    );

            //如果没有评论，就让“评论”二字隐藏
            if (comments.length === 0) {
                //element.querySelector(".item-comment-title").style.display = "none";
                

            } else {
                //element.querySelector(".item-comment-title").textContent = "评论(" + comments.length + ")";

                var groupedComments = comments.createGrouped(function (c) { return c.item.id; }, function (c) { return c.item; });
                var itemDataSourse = groupedComments.groups.dataSource;

                //为组件绑定数据和事件
                ui.setOptions(listView, {
                    //itemDataSource: commentList.dataSource,// itemDataSource: pageList.dataSource,
                    //itemTemplate: element.querySelector(".item-comment")
                    groupDataSource: itemDataSourse,
                    groupHeaderTemplate: element.querySelector(".item-detail"),
                    itemDataSource: groupedComments.dataSource,
                    itemTemplate: element.querySelector(".item-comment")
                });
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
            }

            

        }, 500);        
      

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
    function getComment(item, size) {        
        $.ajax({
            global: false,
            url: API_DOMAIN + '/post/comment/list',
            type: 'GET',
            data: {
                'postId': item.id,
                'publisher': item.publisher.id,
                'size': size,
                'access_token': localStorage['access_token']
            },
            _success: function (_data) {
                if (_data.values && _data.values.length !== 0) {
                    _data.values.forEach(function (v) {
                        v.item = item;
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



//说明：
//这里有两种取评论数据的方法
//一种是把ajax请求放到data.js组件中，并对外开放一个方法，此处调用。
//                  这种情况貌似是把所有的评论放到一个new WinJS.Binding.List()这样的数组中，在别处取用时要做createFiltered筛选
//另外一种方法是在本组件中发送ajax请求。
//                  但每次请求时都要重新new WinJS.Binding.List()，否则所有的评论数据都会被push到其中。