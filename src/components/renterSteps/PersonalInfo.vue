<template>
  <div class="m-3">
    <!-- note that prevent.stop in event handler to stop event from emit twice
  https://stackoverflow.com/questions/67690803/event-is-triggerd-twice-by-child-and-parent -->
    <form
      @submit.prevent.stop="handleNext"
      novalidate
      :class="v$.$dirty || data !== null ? 'was-validated' : ''"
    >
      <div class="row justify-content-around align-items-center">
        <div class="mb-3 col-10 col-md-6 text-start">
          <label for="name" class="form-label"
            >الاسم رباعى باللغة العربية</label
          >
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
        <div class="mb-3 col-10 col-md-6 text-start">
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
      </div>
      <div class="row justify-content-around align-items-center">
        <div class="mb-3 col-10 col-md-12 text-start">
          <label for="isSaudi" class="form-label">الجنسية</label>
          <select
            class="form-select"
            id="isSaudi"
            v-model="personalInfo.isSaudi"
            :ref="(el) => (formElms.isSaudi = el)"
          >
            <option value="" selected disabled>اضغط هنا للاختيار ...</option>
            <option value="true">سعودي الجنسية</option>
            <option value="false">اجنبى مقيم بالسعودية</option>
          </select>
          <div class="invalid-feedback">
            {{ v$.isSaudi.$invalid ? v$.isSaudi.$errors[0].$message : "" }}
          </div>
        </div>
      </div>
      <div class="row justify-content-around align-items-center">
        <div class="mb-3 col-10 col-md-6 text-start">
          <label for="civilRegistry" class="form-label">{{
            personalInfo.isSaudi === "true" ? "رقم السجل المدنى" : "رقم الإقامة"
          }}</label>
          <input
            dir="ltr"
            type="text"
            class="form-control"
            id="civilRegistry"
            v-model="personalInfo.civilRegistry"
            :ref="(el) => (formElms.civilRegistry = el)"
          />
          <div class="invalid-feedback">
            {{
              v$.civilRegistry.$invalid
                ? v$.civilRegistry.$errors[0].$message
                : ""
            }}
          </div>
        </div>
        <div class="mb-3 col-10 col-md-6 text-start">
          <label for="birthDate" class="form-label">تاريخ الميلاد </label>
          <input
            type="date"
            id="birthDate"
            class="form-control"
            v-model="personalInfo.birthDate"
            :ref="(el) => (formElms.birthDate = el)"
          />
          <div class="invalid-feedback">
            {{ v$.birthDate.$invalid ? v$.birthDate.$errors[0].$message : "" }}
          </div>
        </div>
      </div>
      <div class="mb-3 text-start">
        <p class="d-inline me-3">الجنس :</p>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="gender"
            v-model="personalInfo.gender"
            id="male"
            value="ذكر"
            required
          />
          <label class="form-check-label" for="male">ذكر</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="gender"
            v-model="personalInfo.gender"
            id="female"
            value="انثى"
          />
          <label class="form-check-label" for="female">انثى</label>
          <div class="invalid-feedback">برجاء اختيار احد الجنسين</div>
        </div>
      </div>
      <div class="mb-3 text-start">
        <p class="d-inline me-3">الحالة الاجتماعية :</p>

        <template v-for="socialStatus in SocialStatuses" :key="socialStatus">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="socialStatus"
              v-model="personalInfo.socialStatus"
              :id="socialStatus"
              :value="socialStatus"
              required
            />
            <label class="form-check-label" :for="socialStatus">{{
              socialStatus
            }}</label>
          </div>
        </template>

        <div class="invalid-feedback mx-2">برجاء اختيار الحالة الاجتماعية</div>
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

        <div class="mb-3 text-center text-danger" v-if="error">
          حدث عطل ما برجاء المحاولة مرة اخرى بعد اعادة تحميل الصفحة
        </div>
        <div class="mb-3 text-center text-danger" v-if="phoneUsed">
          رقم الهاتف مستخدم من قبل برجاء استخدام رقم هاتف مختلف
        </div>
        <div class="mb-3 text-center text-danger" v-if="civilRegistryUsed">
          رقم السجل المدنى مستخدم من قبل برجاء استخدام رقم سجل مدنى مختلف
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";
import useCheck from "@/composables/useCheck";

import {
  arabicAlpha,
  saudiId,
  genderRequired,
  societyStatusRequired,
  birthDayRange,
  phoneNumber,
  selectRequired,
} from "@/utils/validators";
export default {
  props: ["stepIndex", "data"],
  setup(props, context) {
    const SocialStatuses = ["اعزب", "متزوج", "مطلق", "أرمل"];
    const personalInfo = ref({
      civilRegistry: props.data ? props.data.civilRegistry : "",
      name: props.data ? props.data.name : "",
      birthDate: props.data ? props.data.birthDate : "",
      gender: props.data ? props.data.gender : "",
      socialStatus: props.data ? props.data.socialStatus : "",
      phone: props.data ? props.data.phone : "",
      isSaudi: props.data ? props.data.isSaudi : "",
    });
    const rules = {
      civilRegistry: {
        required: helpers.withMessage("يرجى ادخال رقم صحيح ", required),
        maxLength: helpers.withMessage("يرجى ادخال رقم صحيح", maxLength(10)),
        saudiId: helpers.withMessage(
          "يرجى ادخال رقم صحيح",
          saudiId(personalInfo)
        ),
      },
      name: {
        required: helpers.withMessage("يرجى ادخال الاسم ", required),
        minLength: helpers.withMessage("يرجى ادخال اسم صحيح", minLength(10)),
        arabicAlpha: helpers.withMessage(
          "يرجى ادخال اسم بالغة العربية",
          arabicAlpha
        ),
      },
      birthDate: {
        required: helpers.withMessage("يرجى ادخال تاريخ الميلاد ", required),
        birthDayRange: helpers.withMessage(
          "يرجى ادخال تاريخ ميلاد صحيح",
          birthDayRange
        ),
      },
      gender: { genderRequired: genderRequired },
      socialStatus: {
        societyStatusRequired: societyStatusRequired(SocialStatuses),
      },
      phone: {
        required: helpers.withMessage("يرجى ادخال رقم الهاتف", required),
        phoneNumber: helpers.withMessage(
          "يرجى ادخال رقم الهاتف بشكل صحيح",
          phoneNumber
        ),
      },
      isSaudi: {
        selectRequired: helpers.withMessage("برجاء الاختيار", selectRequired),
      },
    };
    const formElms = ref({
      name: null,
      civilRegistry: null,
      birthDate: null,
      phone: null,
      isSaudi: null,
    });
    const v$ = useVuelidate(rules, personalInfo.value, {
      $autoDirty: true,
      $lazy: true,
    });

    // watching errors in v$ then make input custom invalid
    {
      watchEffect(
        () => {
          if (formElms.value.civilRegistry !== null)
            v$.value.civilRegistry.$invalid
              ? formElms.value.civilRegistry.setCustomValidity("...")
              : formElms.value.civilRegistry.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(
        () => {
          if (formElms.value.birthDate !== null)
            v$.value.birthDate.$invalid
              ? formElms.value.birthDate.setCustomValidity("...")
              : formElms.value.birthDate.setCustomValidity("");
        },
        { flush: "post" }
      );

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

      watchEffect(
        () => {
          if (formElms.value.isSaudi !== null)
            v$.value.isSaudi.$invalid
              ? formElms.value.isSaudi.setCustomValidity("...")
              : formElms.value.isSaudi.setCustomValidity("");
        },
        { flush: "post" }
      );
    }
    const { error, loading, check } = useCheck("people");

    const phoneUsed = ref(false);
    const civilRegistryUsed = ref(false);

    const handleNext = async () => {
      v$.value.$validate();
      if (!v$.value.$invalid) {
        let matchedPhoneDocs = await check([
          "phone",
          "==",
          personalInfo.value.phone,
        ]);
        phoneUsed.value = matchedPhoneDocs.length === 1;

        let matchedRegDocs = await check([
          "civilRegistry",
          "==",
          personalInfo.value.civilRegistry,
        ]);
        civilRegistryUsed.value = matchedRegDocs.length === 1;
        if (!error.value && !phoneUsed.value && !civilRegistryUsed.value) {
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
      loading,
      error,
      phoneUsed,
      civilRegistryUsed,
      SocialStatuses,
    };
  },
};
</script>

<style scoped></style>
