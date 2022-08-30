<template>
  <nav class="navbar navbar-dark navbar-expand-sm bg-dark" dir="ltr">
    <div class="container-fluid">
      <router-link class="navbar-brand w-50" :to="{ name: 'takeSurvey' }">
        <img
          :src="require(`@/assets/img/logo.jpeg`)"
          class="rounded-5 navBarImg"
      /></router-link>

      <button
        class="navbar-toggler m-1"
        type="button"
        v-if="user && !loading"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse justify-content-center"
        v-if="user && !loading"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link text-light" :to="{ name: 'voters' }">
              لوحة التحكم</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              v-if="user && !loading"
              class="nav-link text-light"
              :to="{ name: 'takeSurvey' }"
            >
              الاستبيان</router-link
            >
          </li>
        </ul>
        <button
          v-if="user && !loading"
          class="btn btn-primary rounded-5"
          @click="handleLogout"
        >
          تسجيل خروج <i class="bi bi-door-closed me-1"></i>
        </button>
        <button
          v-if="user && loading && !logoutError"
          class="btn btn-primary mb-3 fs-5 mt-3 px-5"
          disabled
        >
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </div>
  </nav>
  <div class="text-danger fs-5 m-5" v-if="user && logoutError && !loading">
    {{ logoutError }}
  </div>
</template>

<script>
import useLogout from "@/composables/useLogout";
import { useRouter } from "vue-router";
import getUser from "@/composables/getUser";
export default {
  setup() {
    const router = useRouter();
    const user = getUser();
    const { error: logoutError, loading, logout } = useLogout();

    const handleLogout = async () => {
      await logout();
      if (!logoutError.value) {
        router.push({ name: "login" });
      }
    };
    return { logoutError, loading, handleLogout, user };
  },
};
</script>

<style scoped>
.navBarImg {
  height: 40px;
}
</style>
