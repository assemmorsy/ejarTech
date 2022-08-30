<template>
  <div class="m-3">
    <!-- note that prevent.stop in event handler to stop event from emit twice
  https://stackoverflow.com/questions/67690803/event-is-triggerd-twice-by-child-and-parent -->
    <form @submit.prevent.stop="handleNext" novalidate>
      <div class="mb-3 text-start">
        <div class="row">المدن التى تتوفر بها العقارات المملوكة</div>
        <template v-for="city in Cities" :key="city">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              :value="city"
              :id="city"
              v-model="realEstateInfo.realEstateCities"
            />
            <label class="form-check-label" :for="city">
              {{ city }}
            </label>
          </div>
        </template>
        <div class="text-danger" v-if="v$.realEstateCities.$invalid">
          {{
            v$.realEstateCities.$invalid
              ? v$.realEstateCities.$silentErrors[0].$message
              : ""
          }}
        </div>
      </div>
      <div class="mb-3 text-start">
        <div class="row">انواع العقارات المتوفرة</div>
        <template v-for="type in RealEstateTypes" :key="type">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              :value="type"
              :id="type"
              v-model="realEstateInfo.realEstateTypes"
            />
            <label class="form-check-label" :for="type">
              {{ type }}
            </label>
          </div>
        </template>
        <div class="text-danger" v-if="v$.realEstateTypes.$invalid">
          {{
            v$.realEstateTypes.$invalid
              ? v$.realEstateTypes.$silentErrors[0].$message
              : ""
          }}
        </div>
      </div>
      <div class="mb-3 text-start">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="rentAgree"
            v-model="realEstateInfo.rentAgree"
          />
          <label class="form-check-label" for="rentAgree">
            أوافق على التأجير من الباطن للمساهمة في عملية التأجير بالتقسيط
            الشهرى
          </label>
        </div>
      </div>
      <div class="mb-3 text-start" v-if="realEstateInfo.rentAgree">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="percentageAgree"
            v-model="realEstateInfo.percentageAgree"
          />
          <label class="form-check-label" for="percentageAgree">
            أقبل فكرة خصم نسبة ما من قيمة الللإيجار في حال دفع المؤجر من الباطن
            قيمة الإيجار مقدما لسنة كاملة
          </label>
        </div>
      </div>
      <div
        class="mb-3 text-start"
        v-if="realEstateInfo.percentageAgree && realEstateInfo.rentAgree"
      >
        <label for="percentage" class="form-label"
          >برجاء ادخال النسبة التي تراها مناسبة</label
        >
        <input
          id="percentage"
          type="text"
          class="form-control"
          v-model="realEstateInfo.percentage"
        />
        <div class="text-danger" v-if="v$.percentage.$invalid">
          {{ v$.percentage.$invalid ? v$.percentage.$errors[0].$message : "" }}
        </div>
      </div>

      <div class="mb-3 text-start" v-if="!v$.$invalid">
        <button class="btn btn-outline-primary px-5" type="submit">
          التالى
          <i class="bi bi-arrow-bar-left ms-2"></i>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { checkRequired } from "@/utils/validators";
export default {
  props: ["stepIndex", "data"],
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
      "أبها",
    ];
    const RealEstateTypes = ["شقة", "فيلا كاملة ", "دور فيلا", "عمارة سكنية"];

    const realEstateInfo = ref({
      realEstateCities: props.data ? props.data.realEstateCities : [],
      realEstateTypes: props.data ? props.data.realEstateTypes : [],
      rentAgree: props.data ? props.data.rentAgree : false,
      percentageAgree: props.data ? props.data.percentageAgree : false,
      percentage: props.data ? props.data.percentage : 10,
    });
    const rules = {
      realEstateCities: {
        checkRequired: helpers.withMessage(
          " ** برجاء اختيار المدينة ",
          checkRequired
        ),
      },
      realEstateTypes: {
        checkRequired: helpers.withMessage(
          " ** برجاء اختيار نوع العقار",
          checkRequired
        ),
      },
      percentage: {
        isPercent: helpers.withMessage(
          "يرجى ادخال نسبة مئوية صحيحة بين 5 % الي 15 %  ",
          (value) => {
            return value >= 5 && value <= 15;
          }
        ),
      },
    };

    const formElms = ref({
      percentage: null,
    });
    const v$ = useVuelidate(rules, realEstateInfo.value, {
      $autoDirty: true,
    });

    // watching errors in v$ then make input custom invalid
    {
      watchEffect(
        () => {
          if (formElms.value.percentage !== null)
            v$.value.percentage.$invalid
              ? formElms.value.percentage.setCustomValidity("...")
              : formElms.value.percentage.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(() => {
        if (!realEstateInfo.value.rentAgree) {
          realEstateInfo.value.percentageAgree = false;
          realEstateInfo.value.percentage = 0;
        }
        if (
          realEstateInfo.value.rentAgree &&
          !realEstateInfo.value.percentageAgree
        ) {
          realEstateInfo.value.percentage = 0;
        }
      });
    }

    const handleNext = () => {
      v$.value.$validate();
      if (!v$.value.$invalid) {
        context.emit("submit", {
          ...realEstateInfo.value,
          stepIndex: props.stepIndex,
        });
      }
    };
    return {
      realEstateInfo,
      handleNext,
      v$,
      formElms,
      Cities,
      RealEstateTypes,
    };
  },
};
</script>

<style scoped></style>
