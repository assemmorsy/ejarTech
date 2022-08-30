<template>
  <div class="container">
    <div class="row justify-content-center align-items-center text-center">
      <div class="col col-12 col-lg-6">
        <h1 class="display-5 mt-3 mb-4">تسجيل الدخول</h1>
        <form @submit.prevent="handleSubmit" class="mx-5">
          <div class="mb-3 text-start">
            <label for="email" class="form-label">البريد الالكترونى</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="user.email"
              required
              autocomplete="off"
            />
          </div>

          <div class="mb-3 text-start">
            <label for="password" class="form-label">كلمة المرور</label>
            <input
              type="password"
              class="form-control"
              id="exampleFormControlInput1"
              v-model="user.password"
              required
              dir="ltr"
              autocomplete="off"
            />
          </div>

          <div class="text-danger fs-5" v-if="loginError && !loading">
            {{ loginError }}
          </div>
          <button
            v-if="!loading"
            class="btn btn-primary mb-3 fs-5 mt-3 px-5"
            type="submit"
          >
            دخول
            <i class="bi bi-door-open"></i>
          </button>
          <button
            v-if="loading && !loginError"
            class="btn btn-primary mb-3 fs-5 mt-3 px-5"
            disabled
          >
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
        </form>
      </div>
      <img
        class="col col-12 col-lg-6"
        :src="require(`@/assets/img/loginFeg.jpg`)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import useLogin from "@/composables/useLogin";
import { useRouter } from "vue-router";
export default {
  setup() {
    const user = ref({
      email: "",
      password: "",
    });
    const router = useRouter();
    const { error: loginError, loading, login } = useLogin();
    const handleSubmit = async () => {
      await login(user.value);
      if (!loginError.value) {
        router.push({ name: "voters" });
      }
    };
    return { user, handleSubmit, loginError, loading };
  },
};
</script>

<style></style>
