<template>
  <div class="container">
    <div class="row justify-content-center align-items-center text-center">
      <div class="col col-12 col-lg-7 mt-3">
        <div v-if="!showForm">
          <h1 class="display-3">مرحبا بكل عملائنا الكرام</h1>
          <button
            class="btn btn-outline-primary col-10 mt-5 px-5"
            @click="
              showForm = !showForm;
              formType = 'owner';
            "
          >
            ابدأ استطلاع الرأى كمالك
          </button>

          <button
            class="btn btn-outline-primary col-10 mt-2 px-5"
            @click="
              showForm = !showForm;
              formType = 'renter';
            "
          >
            ابدأ استطلاع الرأى كمستأجر
          </button>
        </div>
        <div v-if="showForm">
          <MultiStepForm :formType="formType" />
        </div>
      </div>
      <img
        class="col col-8 col-lg-5"
        :src="require(`@/assets/img/surveyFeg.svg`)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import MultiStepForm from "@/components/MultiStepForm.vue";

export default {
  setup() {
    const showForm = ref(null);
    const formType = ref("");
    return { showForm, formType };
  },
  components: { MultiStepForm },
};
</script>

<style scoped>
.btn {
  font-family: CairoBold;
}
</style>
