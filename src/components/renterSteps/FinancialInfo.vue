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
        <label for="income" class="form-label"
          >مقدار الدخل الشهرى (راتب ومداخيل اخرى)</label
        >
        <select
          class="form-select"
          id="income"
          v-model="financialInfo.income"
          :ref="(el) => (formElms.income = el)"
        >
          <option value="" selected disabled>اضغط هنا للاختيار ...</option>
          <template v-for="income in Incomes" :key="income">
            <option :value="income">{{ income }}</option>
          </template>
        </select>
        <div class="invalid-feedback">
          {{ v$.income.$invalid ? v$.income.$errors[0].$message : "" }}
        </div>
      </div>

      <div class="mb-3 text-start">
        <label for="salaryPerMonth" class="form-label">
          مقدار القسط الشهرى الذى يمكن ان تسدده
        </label>
        <select
          id="salaryPerMonth"
          class="form-select"
          v-model="financialInfo.salaryPerMonth"
          :ref="(el) => (formElms.salaryPerMonth = el)"
        >
          <option value="" selected disabled>اضغط هنا للاختيار ...</option>
          <template v-for="salary in Salaries" :key="salary">
            <option :value="salary">{{ salary }}</option>
          </template>
        </select>
        <div class="invalid-feedback">
          {{
            v$.salaryPerMonth.$invalid
              ? v$.salaryPerMonth.$errors[0].$message
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
import { ref, watchEffect } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { selectRequired } from "@/utils/validators";
export default {
  props: ["stepIndex", "data"],
  setup(props, context) {
    const Salaries = ["1000-2000", "2001-4000", "4001-6000", "أكثر من 6000"];
    const Incomes = [
      "اقل من 5000",
      "5001-8000",
      "8001-10000",
      "10001-12000",
      "12001-14000",
      "14001-16000",
      "16001-18000",
      "18001-20000",
      "أكثر من 20000",
    ];
    const financialInfo = ref({
      income: props.data ? props.data.income : "",
      salaryPerMonth: props.data ? props.data.salaryPerMonth : "",
    });
    const rules = {
      income: {
        selectRequired: helpers.withMessage("برجاء الاختيار", selectRequired),
      },
      salaryPerMonth: {
        selectRequired: helpers.withMessage("برجاء الاختيار", selectRequired),
      },
    };
    const formElms = ref({
      income: null,
      salaryPerMonth: null,
    });
    const v$ = useVuelidate(rules, financialInfo.value, {
      $autoDirty: true,
      $lazy: true,
    });

    // watching errors in v$ then make input custom invalid
    {
      watchEffect(
        () => {
          if (formElms.value.income !== null)
            v$.value.income.$invalid
              ? formElms.value.income.setCustomValidity("...")
              : formElms.value.income.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(
        () => {
          if (formElms.value.salaryPerMonth !== null)
            v$.value.salaryPerMonth.$invalid
              ? formElms.value.salaryPerMonth.setCustomValidity("...")
              : formElms.value.salaryPerMonth.setCustomValidity("");
        },
        { flush: "post" }
      );
    }

    const handleNext = () => {
      v$.value.$validate();
      if (!v$.value.$invalid) {
        context.emit("submit", {
          ...financialInfo.value,
          stepIndex: props.stepIndex,
        });
      }
    };
    return { financialInfo, handleNext, v$, formElms, Salaries, Incomes };
  },
};
</script>

<style scoped></style>
