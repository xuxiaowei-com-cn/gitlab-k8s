import DefaultTheme from 'vitepress/theme'
import Redirect from '../components/Redirect.vue'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('Redirect', Redirect)
    },
}
