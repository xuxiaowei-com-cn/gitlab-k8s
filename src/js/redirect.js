module.exports = function redirect(context, options) {
    return {
        name: 'redirect',
        injectHtmlTags() {
            return {
                headTags: [
                    {
                        tagName: 'script',
                        innerHTML: `if (window.location.pathname === '/') { window.location.href = '/gitlab-k8s/'; }`,
                    },
                ],
            };
        },
    };
};
