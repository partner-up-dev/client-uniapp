<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { Account } from "./business/account/base";
onLaunch(() => {
  console.log("App Launch");
  Account.login(false);
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
body::-webkit-scrollbar {
  display: none;
}
</style>

<style lang="scss">
@use "@/styles/main.scss" as *;

.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -100;
  background-color: $pu-color-surface;
  color: $pu-color-on-surface;
}
</style>
