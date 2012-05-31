(function () {
    "use strict";

    //function linkClickEventHandler(eventInfo) {
    //    eventInfo.preventDefault(); //阻止 超级连接的默认行为
    //    var link = eventInfo.target; //获取连接
    //    WinJS.Navigation.navigate(link.href);//调用跳转
    //}

    window.authentication = {
        init: function () {
            var __API_DOMAIN__ = 'https://api.laiwang.com';

            this.ACCESS_TOKEN_URL = __API_DOMAIN__ + "/oauth/access_token";
            this.AUTHORIZATION_URL = __API_DOMAIN__ + "/oauth/authorize";
            this.CLIENT_ID = "7308008019538234612";
            this.CLIENT_SECRET = "0707d875eba340268f0d09a54a47fcbe";
            // this.CLIENT_ID = "112233445566778899";
            // this.CLIENT_SECRET = "112233445566778899";
            this.REDIRECT_URL = "http://laiwang.com/";
            this.SCOPES = [];
        },

        //toAuthorizePage: function () {
        //    chrome.tabs.create({
        //        url: 'src/html/options.html',
        //        selected: true
        //    });
        //    return;
        //},

        login: function (username, password, callback, error_callback) {
            $.ajax({
                global: false,
                dataType: 'json',
                url: this.ACCESS_TOKEN_URL,
                type: 'POST',
                data: {
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    grant_type: 'password',
                    username: username,
                    password: password
                },
                success: function (data) {
                    localStorage['access_token'] = data['access_token'];
                    localStorage['refresh_token'] = data['refresh_token'];
                    callback && callback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error_callback && error_callback(jqXHR);
                }
            });
        },

        checkLogin: function () { },

        refreshAccessToken: function (callback, error_callback) {
            var _this = this;
            //if (!localStorage['refresh_token']) {
            //    _this.toAuthorizePage();
            //} else {
                $.ajax({
                    global: false,
                    dataType: 'json',
                    url: this.ACCESS_TOKEN_URL,
                    type: 'POST',
                    data: {
                        client_id: _this.CLIENT_ID,
                        client_secret: _this.CLIENT_SECRET,
                        grant_type: 'refresh_token',
                        refresh_token: localStorage['refresh_token'],
                    },
                    success: function (ds) {
                        localStorage['access_token'] = ds['access_token'];
                        localStorage['refresh_token'] = ds['refresh_token'];
                        callback && callback(ds);
                    },
                    error: function (ds) {
                        //_this.toAuthorizePage();
                        //error_callback && error_callback(data);
                        document.querySelector("#your_info").textContent = "error!";//to do rebuild
                    }
                });
            }
        //}
    }
       



    function login2groupedItemspage(ds) {
        document.querySelector("#your_info").textContent = ds['refresh_token'];
        var link = "/html/groupedItemsPage.html";
        WinJS.Navigation.navigate(link);        
    }

    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        // TODO: Initialize the fragment here.
        //WinJS.Utilities.query("a").listen("click", linkClickEventHandler, false);
        authentication.init();        

        var toLogin = function () {
            var name = document.querySelector("#inputName").value;//to do rebuild
            var password = document.querySelector("#inputPassword").value;//to do rebuild
            authentication.login(name, password, login2groupedItemspage);//to do rebuild
        }

        document.querySelector("#btnLogin").addEventListener("click", toLogin, false);//to do rebuild
    }

    WinJS.UI.Pages.define("/html/homePage.html", {
        ready: ready
    });
})();