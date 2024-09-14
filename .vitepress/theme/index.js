import DefaultTheme from 'vitepress/theme'
import Redirect from '../components/Redirect.vue'
import GitLabRunnerTrustCertificate from '../components/GitLabRunnerTrustCertificate.vue'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('Redirect', Redirect)
        app.component('GitLabRunnerTrustCertificate', GitLabRunnerTrustCertificate)
    },
}
