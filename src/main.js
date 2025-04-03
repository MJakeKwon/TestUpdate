import { createApp } from "vue";
import App from "./App.vue";
import socket from "./plugins/socket"; // ✅ 소켓 설정 불러오기
import router from './router';
import store from './store';

const app = createApp(App);

app.config.globalProperties.$socket = socket; // ✅ 글로벌 속성으로 설정
app.use(router);
app.use(store);

app.mount("#app");