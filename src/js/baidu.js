module.exports = function baidu(context, options) {
    return {
        name: 'baidu', injectHtmlTags() {
            return {
                headTags: [{
                    tagName: 'script',
                    innerHTML: `
                        var _hmt = _hmt || [];
                        (function () {
                            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                var hm = document.createElement("script");
                                // gitlab-k8s.xuxiaowei.com.cn：2173e1f7d3ce3dce80b34490272e7b79
                                hm.src = "https://hm.baidu.com/hm.js?2173e1f7d3ce3dce80b34490272e7b79";
                                var s = document.getElementsByTagName("script")[0];
                                s.parentNode.insertBefore(hm, s);
                            }
                        })();
                    `,
                },],
            };
        },
    };
};
