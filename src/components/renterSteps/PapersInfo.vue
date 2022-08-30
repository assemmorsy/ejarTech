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
        <div class="mb-3">
          <label for="formFile" class="form-label">تقرير سمة الإئتمانى</label>
          <input
            class="form-control"
            type="file"
            id="formFile"
            @change="handleFileChange('semaFile', $event)"
            :ref="(el) => (formElms.semaFile = el)"
          />
          <div class="invalid-feedback">
            {{ v$.semaFile.$invalid ? v$.semaFile.$errors[0].$message : "" }}
          </div>

          <div class="valid-feedback" v-if="paperInfo.semaFile !== null">
            الملف المحدد : {{ paperInfo.semaFile.name }}
          </div>
        </div>
      </div>
      <div class="mb-3 text-start">
        <div class="mb-3">
          <label for="formFileCerti" class="form-label"
            >شهادة التأمينات وتعريف العمل مع الراتب الشهرى</label
          >
          <input
            class="form-control"
            type="file"
            id="formFileCerti"
            @change="handleFileChange('certificateFile', $event)"
            :ref="(el) => (formElms.certificateFile = el)"
          />
          <div class="invalid-feedback">
            {{
              v$.certificateFile.$invalid
                ? v$.certificateFile.$errors[0].$message
                : ""
            }}
          </div>
          <div class="valid-feedback" v-if="paperInfo.certificateFile !== null">
            الملف المحدد : {{ paperInfo.certificateFile.name }}
          </div>
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
import { fileSize, fileTypeImgOrPDF, requiredFile } from "@/utils/validators";
export default {
  props: ["stepIndex", "data"],
  setup(props, context) {
    const paperInfo = ref({
      semaFile: props.data ? props.data.semaFile : null,
      certificateFile: props.data ? props.data.certificateFile : null,
    });

    const rules = {
      semaFile: {
        requiredFile: helpers.withMessage(
          "يرجى ادراج تقرير سمة الإئتمانى ",
          requiredFile
        ),
        fileTypeImgOrPDF: helpers.withMessage(
          "يحب ان يكون الملف صورة او pdf ",
          fileTypeImgOrPDF
        ),
        fileSize: helpers.withMessage(
          "يجب ان لا يتعدى  حجم الملف 1 MB",
          fileSize
        ),
      },
      certificateFile: {
        requiredFile: helpers.withMessage(
          "يرجى ادراج شهادة التأمينات وتعريف العمل مع الراتب الشهرى ",
          requiredFile
        ),
        fileTypeImgOrPDF: helpers.withMessage(
          "يحب ان يكون الملف صورة او pdf ",
          fileTypeImgOrPDF
        ),
        fileSize: helpers.withMessage(
          "يجب ان لا يتعدى  حجم الملف 1 MB",
          fileSize
        ),
      },
    };

    const handleFileChange = (name, e) => {
      const selected = e.target.files[0];
      switch (name) {
        case "semaFile":
          paperInfo.value.semaFile = selected;
          break;
        case "certificateFile":
          paperInfo.value.certificateFile = selected;
          break;
      }
    };

    const formElms = ref({
      semaFile: null,
      certificateFile: null,
    });

    const v$ = useVuelidate(rules, paperInfo.value, {
      $autoDirty: true,
      $lazy: true,
    });

    // watching errors in v$ then make input custom invalid
    {
      watchEffect(
        () => {
          if (formElms.value.semaFile !== null)
            v$.value.semaFile.$invalid
              ? formElms.value.semaFile.setCustomValidity("...")
              : formElms.value.semaFile.setCustomValidity("");
        },
        { flush: "post" }
      );

      watchEffect(
        () => {
          if (formElms.value.certificateFile !== null)
            v$.value.certificateFile.$invalid
              ? formElms.value.certificateFile.setCustomValidity("...")
              : formElms.value.certificateFile.setCustomValidity("");
        },
        { flush: "post" }
      );
    }

    const handleNext = () => {
      v$.value.$validate();
      if (!v$.value.$invalid) {
        context.emit("submit", {
          ...paperInfo.value,
          stepIndex: props.stepIndex,
        });
      }
    };
    return { paperInfo, handleNext, handleFileChange, v$, formElms };
  },
};
</script>

<style></style>
