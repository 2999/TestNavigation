(function () {
    "use strict";

    //function linkClickEventHandler(eventInfo) {
    //    eventInfo.preventDefault(); //阻止 超级连接的默认行为
    //    var link = eventInfo.target; //获取连接
    //    WinJS.Navigation.navigate(link.href);//调用跳转
    //}

    window.authentication = {
        init: function () {
            var __API_DOMAIN__ = 'http://lwurl.to/eg';

            this.ACCESS_TOKEN_URL = __API_DOMAIN__ + "/oauth/access_token";
            this.AUTHORIZATION_URL = __API_DOMAIN__ + "/oauth/authorize";
            this.CLIENT_ID = "10001";
            this.CLIENT_SECRET = "68d71cbc2a1c8dcbb770e44ee711676a";
            this.REDIRECT_URL = "http://lwurl.to/r";
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
                        document.querySelector("#your_info").textContent = "error!";
                    }
                });
            }
        //}
    }
       



    function login2groupedItemspage(ds) {
        //var link = "/html/groupedItemsPage.html";
        //WinJS.Navigation.navigate(link);
        document.querySelector("#your_info").textContent = ds['refresh_token'];
    }

    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        // TODO: Initialize the fragment here.
        //WinJS.Utilities.query("a").listen("click", linkClickEventHandler, false);
        authentication.init();        

        var toLogin = function () {
            var name = document.querySelector("#inputName").value;
            var password = document.querySelector("#inputPassword").value;
            authentication.login(name, password,login2groupedItemspage);
        }

        document.querySelector("#btnLogin").addEventListener("click", toLogin, false);
    }

    WinJS.UI.Pages.define("/html/homePage.html", {
        ready: ready
    });
})();