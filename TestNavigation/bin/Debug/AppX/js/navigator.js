(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var displayProps = Windows.Graphics.Display.DisplayProperties;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    WinJS.Namespace.define("LWDemo", {
        PageControlNavigator: WinJS.Class.define(
            // 为 PageControlNavigator 定义构造函数。
            function PageControlNavigator(element, options) {
                this.element = element || document.createElement("div");
                this.element.appendChild(this._createPageElement());

                this.home = options.home;
                this.lastViewstate = appView.value;

                nav.onnavigated = this._navigated.bind(this);
                window.onresize = this._resized.bind(this);

                document.body.onkeyup = this._keyupHandler.bind(this);
                document.body.onkeypress = this._keypressHandler.bind(this);
                document.body.onmspointerup = this._mspointerupHandler.bind(this);

                //LWDemo.navigator = this;
                nav.navigate(this.home);
            }, {
                /// <field domElement="true" />
                element: null,
                home: "",
                lastViewstate: 0,

                // 此功能为每个页创建新的容器。
                _createPageElement: function () {
                    var element = document.createElement("div");
                    element.style.width = "100%";
                    element.style.height = "100%";
                    return element;
                },

                // 此功能响应 keypresses 以仅在未使用 backspace 键时进行导航。
                _keypressHandler: function (args) {
                    if (args.key === "Backspace") {
                        nav.back();
                    }
                },

                // 此功能响应 keyup 以启用键盘导航。
                _keyupHandler: function (args) {
                    if ((args.key === "Left" && args.altKey) || (args.key === "BrowserBack")) {
                        nav.back();
                    } else if ((args.key === "Right" && args.altKey) || (args.key === "BrowserForward")) {
                        nav.forward();
                    }
                },

                _mspointerupHandler: function (args) {
                    if (args.button === 3) {
                        nav.back();
                    } else if (args.button === 4) {
                        nav.forward();
                    }
                },

                // 此功能通过向 DOM 添加新页面来响应导航。
                _navigated: function (args) {
                    var that = this;
                    var oldElement = that.pageElement;
                    var newElement = that._createPageElement();
                    var parentedComplete;
                    var parented = new WinJS.Promise(function (c) { parentedComplete = c; });

                    args.detail.setPromise(
                        WinJS.Promise.timeout().then(function () {
                            if (oldElement.winControl && oldElement.winControl.unload) {
                                oldElement.winControl.unload();
                            }
                            return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
                        }).then(function parentElement(control) {
                            that.element.appendChild(newElement);
                            that.element.removeChild(oldElement);
                            oldElement.innerText = "";
                            that.navigated();
                            parentedComplete();
                        })
                    );
                },

                _resized: function (args) {
                    if (this.pageControl && this.pageControl.updateLayout) {
                        this.pageControl.updateLayout.call(this.pageControl, this.pageElement, appView.value, this.lastViewstate);
                    }
                    this.lastViewstate = appView.value;
                },

                // 此功能在完成导航后更新应用程序控件。
                navigated: function () {
                    // 在此处执行特定的处于导航中的应用程序操作
                    var backButton = this.pageElement.querySelector("header[role=banner] .win-backbutton");
                    if (backButton) {
                        backButton.onclick = function () { nav.back(); };

                        if (nav.canGoBack) {
                            backButton.removeAttribute("disabled");
                        } else {
                            backButton.setAttribute("disabled", "disabled");
                        }
                    }
                },

                // 这是 PageControlNavigator 对象。
                pageControl: {
                    get: function () { return this.pageElement && this.pageElement.winControl; }
                },

                // 这是当前页的根元素。
                pageElement: {
                    get: function () { return this.element.firstElementChild; }
                }
            }
        )
    });
})();
