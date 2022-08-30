<template>
  <div class="m-3">
    <!-- note that prevent.stop in event handler to stop event from emit twice
  https://stackoverflow.com/questions/67690803/event-is-triggerd-twice-by-child-and-parent -->
    <form
      @submit.prevent.stop="handleNext"
      novalidate
      :class="v$.$dirty || data !== null ? 'was-validated' : ''"
    >
      <div class="mb-3 text-start">
        <label for="name" class="form-label">الاسم رباعى باللغة العربية</label>
        <input
          id="name"
          type="text"
          class="form-control"
          v-model="personalInfo.name"
          :ref="(el) => (formElms.name = el)"
        />
        <div class="invalid-feedback">
          {{ v$.name.$invalid ? v$.name.$errors[0].$message : "" }}
        </div>
      </div>
      <div class="mb-3 text-start">
        <label for="phone" class="form-label">رقم الجوال</label>
        <input
          id="phone"
          type="text"
          class="form-control"
          v-model="personalInfo.phone"
          :ref="(el) => (formElms.phone = el)"
        />
        <div class="invalid-feedback">
          {{ v$.phone.$invalid ? v$.phone.$errors[0].$message : "" }}
        </div>
      </div>

      <div
        class="mb-3 text-start"
        v-if="data === null ? v$.$dirty && !v$.$invalid : !v$.$invalid"
      >
        <button
          class="btn btn-outline-primary px-5"
          v-if="!loading"
          type="submit"
        >
          التالى
          <i class="bi bi-arrow-bar-left ms-2"></i>
        </button>
        <button v-if="loading" class="btn btn-outline-primary px-5" disabled>
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
      <div class="mb-3 text-center text-danger" v-if="error">
        حدث عطل ما برجاء المحاولة مرة اخرى بعد اعادة تحميل الصفحة
      </div>
      <div class="mb-3 text-center text-danger" v-if="phoneUsed">
        رقم الهاتف مستخدم من قبل برجاء استخدام رقم هاتف مختلف
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { arabicAlpha, phoneNumber } from "@/utils/validators";
import useCheck from "@/composables/useCheck";
export default {
  props: ["stepIndex", "data"],
  setup(props, context) {
    const personalInfo = ref({
      name: props.data ? props.data.name : "",
      phone: props.data ? props.data.phone : "",
    });
    const rules = {
      name: {
        required: helpers.withMessage("يرجى ادخال الاسم ", required),
        minLength: helpers.withMessage("يرجى ادخال اسم صحيح", minLength(10)),
        arabicAlpha: helpers.withMessage(
          "يرجى ادخال اسم بالغة العربية",
          arabicAlpha
        ),
      },
      phone: {
        required: helpers.withMessage("يرجى ادخال رقم الهاتف", required),
        phoneNumber: helpers.withMessage(
          "يرجى ادخال رقم الهاتف بشكل صحيح",
          phoneNumber
        ),
      },
    };
    const formElms = ref({
      name: null,
      phone: null,
    });
    const v$ = useVuelidate(rules, personalInfo.value, {
      $autoDirty: true,
      $lazy: true,
    });

    // watching errors in v$ then make input custom invalid
    {
      watchEffect(
        () => {
          if (formElms.value.name !== null)
            v$.value.name.$invalid
              ? formElms.value.name.setCustomValidity("...")
              : formElms.value.name.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(
        () => {
          if (formElms.value.phone !== null)
            v$.value.phone.$invalid
              ? formElms.value.phone.setCustomValidity("...")
              : formElms.value.phone.setCustomValidity("");
        },
        { flush: "post" }
      );
    }

    const { error, loading, check } = useCheck("people");
    const phoneUsed = ref(false);
    const handleNext = async () => {
      v$.value.$validate();
      if (!v$.value.$invalid) {
        const matchedDocs = await check([
          "phone",
          "==",
          personalInfo.value.phone,
        ]);
        phoneUsed.value = matchedDocs.length === 1;
        if (!error.value && !phoneUsed.value) {
          context.emit("submit", {
            ...personalInfo.value,
            stepIndex: props.stepIndex,
          });
        }
      }
    };
    return {
      personalInfo,
      handleNext,
      v$,
      formElms,
      error,
      loading,
      phoneUsed,
    };
  },
};
</script>

<style scoped></style>
