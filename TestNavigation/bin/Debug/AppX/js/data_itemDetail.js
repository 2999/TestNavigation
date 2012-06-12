(function (exports) {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var API_DOMAIN = data.API_DOMAIN;
    //全局变量
    var comments;


    function ready(element, options) {
        comments = new WinJS.Binding.List();//每次请求时都要重新new WinJS.Binding.List()，否则所有的评论数据都会被push到其中
        var item = options && options.item ? options.item : data.items.getAt(0);

        stuff(element, options);
        //取50条评论，并放入comments数组中
        getComment(item, 50);

        //to do rebuild  .5秒之后再展示数据，防止取不到评论
        setTimeout(function () {

            //如果没有评论，就让“评论”二字隐藏
            if (comments.length === 0) {
                //element.querySelector(".item-comment-title").style.display = "none";

                comments = new WinJS.Binding.List([{ item: item, commentorLink: "", commentorAvatar: "", commentorName: "", commentCreatedAt: "", comment: "", type: "smallListIconTextItem" }]);

                //element.querySelector(".commentor-avatar").style.display = "none";

            } else { }
            //element.querySelector(".item-comment-title").textContent = "评论(" + comments.length + ")";

            exports.myCellSpanningData = comments;
            exports.groupInfo = groupInfo;
            exports.MyCellSpanningJSTemplate = MyCellSpanningJSTemplate;

            element.querySelector("#commentlistView").winControl.forceLayout();

        }, 500);
    }

    //填充post的内容
    var stuff = function (element, options) {
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
        element.querySelector(".content").focus();
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
                        v.type = "smallListIconTextItem";//这里或许可以根据判断字数来确定到底是大、中、小哪种模板
                        comments.push(v);
                    });
                }
                //lock = false;
            }
        });

    }

    var groupInfo = function groupInfo() {
        return {
            enableCellSpanning: true,
            cellWidth: 472,
            cellHeight: 110
        };
    }

    var MyCellSpanningJSTemplate = function MyCellSpanningJSTemplate(itemPromise) {
        return itemPromise.then(function (currentItem) {
            var result = document.createElement("div");

            // Use source data to decide what size to make the
            // ListView item
            result.className = currentItem.data.type;
            result.style.overflow = "hidden";

            // Display image
            var image = document.createElement("img");
            image.className = "commentor-avatar ";
            image.src = currentItem.data.commentorAvatar;
            result.appendChild(image);

            var name = document.createElement("div");
            name.className = "commentor-name";
            name.innerText = currentItem.data.commentorName;
            result.appendChild(name);

            var time = document.createElement("div");
            time.className = "comment-time";
            time.innerText = currentItem.data.commentCreatedAt;
            result.appendChild(time);

            var content = document.createElement("div");
            content.className = "comment-content";
            //content.style.overflow = "hidden";
            content.innerText = currentItem.data.comment;
            result.appendChild(content);

            return result;
        });
    }

})(Window);
