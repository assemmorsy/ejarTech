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
        <label for="liveAt" class="form-label"
          >المدينة التى تقيم بها حاليا ...</label
        >
        <select
          class="form-select"
          id="liveAt"
          v-model="residenceInfo.liveAt"
          :ref="(el) => (formElms.liveAt = el)"
        >
          <option value="" selected disabled>اضغط هنا للاختيار ...</option>
          <template v-for="city in Cities" :key="city">
            <option :value="city">{{ city }}</option>
          </template>
        </select>
        <div class="invalid-feedback">
          {{ v$.liveAt.$invalid ? v$.liveAt.$errors[0].$message : "" }}
        </div>
      </div>
      <div class="mb-3 text-start">
        <label for="searchFor" class="form-label">
          المدينة التى تبحث عن سكن بها ...
        </label>
        <select
          id="searchFor"
          class="form-select"
          v-model="residenceInfo.searchFor"
          :ref="(el) => (formElms.searchFor = el)"
        >
          <option value="" selected disabled>اضغط هنا للاختيار ...</option>
          <template v-for="city in Cities" :key="city">
            <option :value="city">{{ city }}</option>
          </template>
        </select>
        <div class="invalid-feedback">
          {{ v$.searchFor.$invalid ? v$.searchFor.$errors[0].$message : "" }}
        </div>
      </div>
      <div class="mb-3 text-start">
        <label for="realEstateType" class="form-label">
          نوع العقار الذى تبحث عن الإيجار فيه ...
        </label>
        <select
          id="realEstateType"
          class="form-select"
          v-model="residenceInfo.realEstateType"
          :ref="(el) => (formElms.realEstateType = el)"
        >
          <option value="" selected disabled>اضغط هنا للاختيار ...</option>
          <template
            v-for="realEstateType in RealEstateTypes"
            :key="realEstateType"
          >
            <option :value="realEstateType">{{ realEstateType }}</option>
          </template>
        </select>
        <div class="invalid-feedback">
          {{
            v$.realEstateType.$invalid
              ? v$.realEstateType.$errors[0].$message
              : ""
          }}
        </div>
      </div>
      <div class="mb-3 text-start" v-if="showFamilyQuestions">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="familyResidence"
            v-model="residenceInfo.familyResidence"
          />
          <label class="form-check-label" for="familyResidence">
            سيسكن افراد الاسرة معى
          </label>
        </div>
      </div>
      <div
        class="mb-3 text-start"
        v-if="showFamilyQuestions && residenceInfo.familyResidence"
      >
        <label for="familyMembersCount" class="form-label">
          عدد أفراد الأسرة
        </label>
        <select
          id="familyMembersCount"
          class="form-select"
          v-model="residenceInfo.familyMembersCount"
          :ref="(el) => (formElms.familyMembersCount = el)"
        >
          <option value="" selected disabled>اضغط هنا للاختيار ...</option>
          <template v-for="count in FamilyMembersCounts" :key="count">
            <option :value="count">{{ count }}</option>
          </template>
        </select>
        <div class="invalid-feedback">
          {{
            residenceInfo.familyResidence && v$.familyMembersCount.$invalid
              ? v$.familyMembersCount.$errors[0].$message
              : ""
          }}
        </div>
      </div>

      <div
        class="mb-3 text-start"
        v-if="data === null ? v$.$dirty && !v$.$invalid : !v$.$invalid"
      >
        <button class="btn btn-outline-primary px-5" type="submit">
          التالى
          <i class="bi bi-arrow-bar-left ms-2"></i>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { computed, ref, onMounted, watchEffect } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { selectRequired, selectRequiredInCondition } from "@/utils/validators";
export default {
  props: ["stepIndex", "data", "socialStatus"],
  setup(props, context) {
    const Cities = [
      "الرياض",
      "جدة",
      "الدمام",
      "الخبر",
      "الظهران",
      "مكة المكرمة",
      "المدينة المنورة",
      "جيزان",
    ];
    const RealEstateTypes = ["شقة", "فيلا كاملة ", "دور فيلا", "غير محدد"];
    const FamilyMembersCounts = ["1-3", "4-6", ">6"];
    const residenceInfo = ref({
      liveAt: props.data ? props.data.liveAt : "",
      searchFor: props.data ? props.data.searchFor : "",
      realEstateType: props.data ? props.data.realEstateType : "",
      familyResidence: props.data ? props.data.familyResidence : false,
      familyMembersCount: props.data ? props.data.familyMembersCount : "",
    });
    onMounted(() => {
      v$.value.familyMembersCount.$touch();
      if (props.socialStatus === "اعزب") {
        residenceInfo.value.familyResidence = false;
        residenceInfo.value.familyMembersCount = "";
      }
    });
    const rules = {
      liveAt: {
        selectRequired: helpers.withMessage("برجاء الاختيار", selectRequired),
      },
      searchFor: {
        selectRequired: helpers.withMessage("برجاء الاختيار", selectRequired),
      },
      realEstateType: {
        selectRequired: helpers.withMessage("برجاء الاختيار", selectRequired),
      },
      familyMembersCount: {
        selectRequired: helpers.withMessage(
          "برجاء الاختيار",
          selectRequiredInCondition(residenceInfo)
        ),
      },
    };
    const showFamilyQuestions = computed(() => {
      return ["متزوج", "أرمل", "مطلق"].includes(props.socialStatus);
    });

    const formElms = ref({
      liveAt: null,
      searchFor: null,
      realEstateType: null,
      familyMembersCount: null,
    });
    const v$ = useVuelidate(rules, residenceInfo.value, {
      $autoDirty: true,
      $lazy: true,
    });

    // watching errors in v$ then make input custom invalid
    {
      watchEffect(
        () => {
          if (formElms.value.liveAt !== null)
            v$.value.liveAt.$invalid
              ? formElms.value.liveAt.setCustomValidity("...")
              : formElms.value.liveAt.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(
        () => {
          if (formElms.value.searchFor !== null)
            v$.value.searchFor.$invalid
              ? formElms.value.searchFor.setCustomValidity("...")
              : formElms.value.searchFor.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(
        () => {
          if (formElms.value.realEstateType !== null)
            v$.value.realEstateType.$invalid
              ? formElms.value.realEstateType.setCustomValidity("...")
              : formElms.value.realEstateType.setCustomValidity("");
        },
        { flush: "post" }
      );
      watchEffect(
        () => {
          if (formElms.value.familyMembersCount !== null)
            v$.value.familyMembersCount.$invalid
              ? formElms.value.familyMembersCount.setCustomValidity("...")
              : formElms.value.familyMembersCount.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(
        () => {
          if (!residenceInfo.value.familyResidence)
            residenceInfo.value.familyMembersCount = "";
        },
        { flush: "post" }
      );
    }

    const handleNext = () => {
      v$.value.$validate();
      if (!v$.value.$invalid) {
        context.emit("submit", {
          ...residenceInfo.value,
          stepIndex: props.stepIndex,
        });
      }
    };
    return {
      residenceInfo,
      handleNext,
      FamilyMembersCounts,
      v$,
      formElms,
      Cities,
      showFamilyQuestions,
      RealEstateTypes,
    };
  },
};
</script>

<style scoped></style>
