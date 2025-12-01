import { createUnistorage } from "pinia-plugin-unistorage";
import { createSSRApp } from "vue";
import i18n from '@/locale'
import store from '@/store';
import App from "./App.vue";
import 'weapp-cookie';
import 'uno.css';
import '@partner-up-dev/design-uniapp/styles'

export function createApp() {
  const app = createSSRApp(App);

  const store_persistence = createUnistorage();
  store.use(store_persistence);

  app.use(i18n);
  app.use(store);

  return {
    app,
  };
}
