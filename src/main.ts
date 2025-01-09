import { createApp } from "vue"
import App from "./main/app/App.vue"
import router from "./main/router/router"

createApp(App).use(router).mount("#app")
