(function (exports) {
    "use strict";

    var __DOMAIN__ = 'http://laiwang.com';
    var __API_DOMAIN__ = 'http://api.laiwang.com/v1';
    var __LENGTH__ = 25;

    
    // These three strings encode placeholder images. You will want to set the backgroundImage property in your real data to be URLs to images.     
    var lightGray = "../images/item_bac01.jpg"; //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
    var mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";
    var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
    
    // Each of these sample groups must have a unique key to be displayed
    //对以上的group进行了具体定义：laiwang：来往主墙；event：在一起；friend：好友
    var Groups = [
        { key: "laiwang", title: "laiwang Feeds", subtitle: "laiwang subtitle title", backgroundImage: darkGray, description: "this is the laiwang brief wall." },
        { key: "event", title: "event lists", subtitle: "event subtitle title", backgroundImage: darkGray, description: "this is the event lists." },
        { key: "friend", title: "all friend", subtitle: "friend subtitle title", backgroundImage: darkGray, description: "this is the all friend." }
    ]

    function groupKeySelector(item) {
        return item.group.key;
    }

    function groupDataSelector(item) {
        return item.group;
    }

    // This function returns a WinJS.Binding.List containing only the items that belong to the provided group.
    //从list中，根据group获取它所包含的item
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    //取出item中的评论
    //function getCommentsFromItem(item) {
    //    //var items = getItemsFromGroup(item.group);
    //    return commentsList.createFiltered(function (c) { return c.item.id === item.id; });        
    //}

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    //sampleItems.forEach(function (item) {
    //    list.push(item);
    //});

    //重新设置jQuery的ajax
    function ajaxSet() {
        $.ajaxSetup({
            cache: false,
            dataType: 'json',
            data: {},
            beforeSend: function (jqXHR, settings) {
                if (typeof this.data === 'string') {
                    this.data = this.data.replace(/%[0-1][0-9a-f]/g, '%20');
                    this.data += '&access_token=' + localStorage['access_token'];
                } else if (typeof this.data === 'object') {
                    this.data['access_token'] = localStorage['access_token'];
                }
                this._beforeSend && this._beforeSend(jqXHR, settings);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                this._error && this._error(jqXHR, textStatus, errorThrown);
                this._failure && this._failure(jqXHR, textStatus, errorThrown);

                var errorObject = $.parseJSON(jqXHR.responseText);

                if (errorObject.error === "invalid_token" || errorObject.error === "expired_token" || errorObject.error === "invalid_grant") {
                    authentication.refreshAccessToken(function () {
                        //babylon.init();//?????????????????????????
                        //$('#index').trigger('click');
                    }, function () {
                        authentication.toAuthorizePage();
                    });
                }
            },
            success: function (data, textStatus, jqXHR) {
                if (!data) return;
                this._success && this._success(data, textStatus, jqXHR);
            }
        });
    }

    //根据id获得某人的主墙
    //没有id也行
    function getStream(id) {
        ajaxSet();
        var id = id || '';
        //var subUri = {
        //    stream: '/feed/post/main/list',
        //    incoming: '/feed/post/incoming/list',
        //    group: '/feed/post/circle/list'
        //};
        var postData = {
            'cursor': 0,
            'size': __LENGTH__,
            'access_token': localStorage['access_token']
        };
        $.ajax({
            global: false,
            url: __API_DOMAIN__ + '/feed/post/main/list',  //获取laiwang主墙
            type: 'GET',
            data: postData,
            _success: function (data) {

                data = data.values;
                
                //如果取得的值为空
                if (data.length === 0) {
                    return;
                }
                for (var index in data) {
                    data[index].content = data[index].content.replace(/\n/gi, '<br/>');
                }
                data.forEach(function (item) {//to do rebuild

                    // Each of these sample items should have a reference to a particular group.
                    item.group = Groups[0];//通过上面的ajax请求获取到的都是laiwang主墙信息，所以取Groups数组中的第0项：laiwang

                    //item.key = item.id;
                    item.itemPublisherAvatar = item.publisher.avatar;
                    item.title = item.publisher.name;
                    item.subtitle = transformDate(item.createdAt);
                    item.description = item.content.substr(0, 100);
                    item.content = item.content;
                    item.backgroundImage = (!!(item.attachments[0]) && item.attachments[0].picture) ? item.attachments[0].picture : lightGray;
                    //如果用户没有发图片，就要用内容代替图片
                    item.imageReplacer = (!item.attachments[0] || !item.attachments[0].picture) ? item.description : "";
                    //关于评论
                    //if (!!item.commentCount && item.commentCount !== 0) {
                    //    //commentsList = [];
                    //    item.comments.forEach(function (v) {
                    //        v.item = item;
                    //        //v.item.key = item.id;
                    //        v.commentorLink = __API_DOMAIN__ + "/u/" + v.commentor.id;
                    //        v.commentorAvatar = v.commentor.avatar;
                    //        v.commentorName = v.commentor.name;
                    //        v.commentCreatedAt = transformDate(v.createdAt);
                    //        v.comment = v.content;
                    //        commentsList.push(v);
                    //    });
                    //    //item.comments = commentsList;
                    //}
                    list.push(item);
                });
            }
        });
    }

   

    //转换时间格式：毫秒-->yyyy-MM-dd HH:mm:ss
    function transformDate(ms) {
        var sDate = new Date(ms);
        sDate = sDate.getFullYear() + "-" + (sDate.getMonth() + 1) + "-" + sDate.getDate() + " " + sDate.getHours() + ":" + sDate.getMinutes() + ":" + sDate.getSeconds();
        return sDate;
    }

    var list = new WinJS.Binding.List();
    //var commentsList = new WinJS.Binding.List();
    getStream();

    //取出所有的item。是经过“组化”的item。“组化”就是“组化”，一种特殊的数据结构，我也说不清
    var groupedItems = list.createGrouped(groupKeySelector, groupDataSelector);

    //取出所有的group。由上面“经过组化的item”提取而来，是与上面相同的一种特殊的数据结构
    //貌似是一种由下级到上级的“逆向工程”
    //var groups = groupedItems.groups;
    
    //存放每个item的评论
    //var comments = commentsList.createGrouped(groupKeySelector, groupDataSelector);

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

            // Display title
            //var title = document.createElement("h4");
            //title.innerText = currentItem.data.title;
            //body.appendChild(title);

            return result;
        });
    }

    exports.groupInfo = groupInfo;
    exports.MyCellSpanningJSTemplate = MyCellSpanningJSTemplate;

    WinJS.Namespace.define("data", {
        API_DOMAIN: __API_DOMAIN__,
        DOMAIN:__DOMAIN__,
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup,
        //getCommentsFromItem: getCommentsFromItem,
        transformDate: transformDate
    });
})(Window);


