module.exports = function beian(context, options) {
    return {
        name: 'beian', injectHtmlTags() {
            return {
                headTags: [{
                    tagName: 'script',
                    innerHTML: `
                        window.onload = function () {
                            if (location.host.includes('xuxiaowei.com.cn')) {
                                var footer__copyright_class = document.getElementsByClassName('footer__copyright');
                                console.log(footer__copyright_class);
                                if (footer__copyright_class.length > 0) {
                    
                                    var spanTag = document.createElement('span');
                                    spanTag.innerHTML = '&nbsp;&nbsp;'
                                    footer__copyright_class[0].appendChild(spanTag);
                    
                                    var aTag = document.createElement('a');
                                    aTag.href = "http://beian.miit.gov.cn";
                                    aTag.innerHTML = "鲁ICP备19009036号-1";
                                    footer__copyright_class[0].appendChild(aTag);
                                }
                            }
                        }
                    `,
                },],
            };
        },
    };
};
