<template>
  <div class="card">
    <div class="container">
      <div class="row justify-content-center">
        <div class="card-header fs-3">
          <i class="bi bi-ui-checks me-3"></i>
          {{
            formType === "owner"
              ? " استطلاع الرأى كمالك"
              : " استطلاع الرأى كمستأجر"
          }}

          <template v-if="!isFormValid">
            <hr />
            <p class="fs-5 text-start">
              الخطوة {{ currentStep }} من {{ steps.length }}
              :
              {{ steps[currentStep - 1].stepName }}
            </p>
            <div class="progress">
              <div
                class="progress-bar progress-bar-striped"
                role="progressbar"
                :style="`width: ${processBar}`"
              ></div></div
          ></template>
        </div>
      </div>
      <component
        v-if="!isFormValid"
        :stepIndex="steps[currentStep - 1].stepIndex"
        :is="steps[currentStep - 1].comp"
        @submit="handleStepSubmit"
        :data="steps[currentStep - 1].data"
        :socialStatus="
          steps[currentStep - 1].stepName === 'بيانات الإقامة'
            ? steps[0].data.socialStatus
            : null
        "
      />

      <div v-if="isFormValid && !submitDone">
        <div class="row justify-content-center mt-3">
          <button
            v-if="!docLoading && !fileLoading"
            class="btn btn-primary col col-10 col-lg-5 fs-5 m-1"
            @click="handleSubmit"
          >
            <i class="bi bi-send-fill me-2"></i>
            تسجيل الاستبيان
          </button>

          <button
            v-if="docLoading || fileLoading"
            class="btn btn-primary col col-10 fs-5 m-1"
            disabled
          >
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>

          <button
            v-if="!docLoading && !fileLoading"
            class="btn btn-secondary col col-10 col-lg-5 fs-5 m-1"
            @click="handleUpdate"
          >
            <i class="bi bi-pencil-fill me-2"></i>
            تعديل
          </button>
        </div>
        <hr />
        <ViewRenterData v-if="formType === 'renter'" :data="renterData" />
        <ViewOwnerData v-if="formType === 'owner'" :data="ownerData" />

        <div class="text-danger text-center m-3" v-if="docError || fileError">
          <p>{{ fileError }}</p>
          <p>{{ docError }}</p>
        </div>
      </div>
      <div v-if="submitDone" class="row-justify-content-center">
        <p class="text-success fs-2">
          شكرا لاتمام عملية الاستبيان

          <i
            class="bi bi-check2-square d-block display-1"
            style="font-size: 200px"
          ></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { timestamp } from "@/firebase/config";

import PersonalInfo from "./renterSteps/PersonalInfo.vue";
import PapersInfo from "./renterSteps/PapersInfo.vue";
import FinancialInfo from "./renterSteps/FinancialInfo.vue";
import ResidenceInfo from "./renterSteps/ResidenceInfo.vue";
import ViewRenterData from "./renterSteps/ViewRenterData.vue";
import ViewOwnerData from "./ownerSteps/ViewOwnerData.vue";

import useStorage from "@/composables/useStorage";
import useCollection from "@/composables/useCollection";

import OwnerPersonalInfo from "@/components/ownerSteps/OwnerPersonalInfo.vue";
import OwnerRealEstateInfo from "@/components/ownerSteps/OwnerRealEstateInfo.vue";

export default {
  components: {
    PersonalInfo,
    PapersInfo,
    FinancialInfo,
    ResidenceInfo,
    ViewRenterData,
    ViewOwnerData,
  },
  props: ["formType"],
  setup(props) {
    const renterSteps = [
      {
        comp: PersonalInfo,
        stepName: "البيانات الشخصية",
        isValid: false,
        data: null,
        stepIndex: 0,
      },
      {
        comp: PapersInfo,
        stepName: "الاوراق الرسمية",
        isValid: false,
        data: null,
        stepIndex: 1,
      },
      {
        comp: FinancialInfo,
        stepName: "البيانات المالية",
        isValid: false,
        data: null,
        stepIndex: 2,
      },
      {
        comp: ResidenceInfo,
        stepName: "بيانات الإقامة",
        isValid: false,
        data: null,
        stepIndex: 3,
      },
    ];

    const ownerSteps = [
      {
        comp: OwnerPersonalInfo,
        stepName: "البيانات الشخصية",
        isValid: false,
        data: null,
        stepIndex: 0,
      },
      {
        comp: OwnerRealEstateInfo,
        stepName: "بيانات الممتلكات",
        isValid: false,
        data: null,
        stepIndex: 1,
      },
    ];
    const steps = (() => {
      switch (props.formType) {
        case "renter":
          return renterSteps;
        case "owner":
          return ownerSteps;
      }
    })();

    const renterData = ref({ type: "renter" });
    const ownerData = ref({ type: "owner" });

    const isFormValid = ref(false);

    const handleStepSubmit = (data) => {
      steps[data.stepIndex].isValid = true;
      steps[data.stepIndex].data = data;
      if (currentStep.value < steps.length) {
        currentStep.value += 1;
      } else if (currentStep.value === steps.length) {
        switch (props.formType) {
          case "renter":
            for (const stepIndex in renterSteps) {
              renterData.value = {
                ...renterData.value,
                ...steps[stepIndex].data,
              };
            }
            break;
          case "owner":
            for (const stepIndex in ownerSteps) {
              ownerData.value = {
                ...ownerData.value,
                ...steps[stepIndex].data,
              };
            }
            break;
        }
        isFormValid.value = true;
      }
    };
    const {
      error: fileError,
      filePath,
      url,
      loading: fileLoading,
      uploadFile,
    } = useStorage();
    const {
      addDoc,
      error: docError,
      loading: docLoading,
    } = useCollection("people");
    const submitDone = ref(false);
    const handleSubmit = async () => {
      switch (props.formType) {
        case "renter":
          await uploadFile(renterData.value.phone, renterData.value.semaFile);
          if (fileError.value) break;
          renterData.value.semaFile = {
            filePath: filePath.value,
            url: url.value,
          };
          await uploadFile(
            renterData.value.phone,
            renterData.value.certificateFile
          );
          if (fileError.value) break;
          renterData.value.certificateFile = {
            filePath: filePath.value,
            url: url.value,
          };
          await addDoc({ ...renterData.value, createdAt: timestamp() });
          if (docError.value) break;
          submitDone.value = true;
          break;
        case "owner":
          await addDoc({ ...ownerData.value, createdAt: timestamp() });
          if (docError.value) break;
          submitDone.value = true;
          break;
      }
    };

    const handleUpdate = () => {
      currentStep.value = 1;
      isFormValid.value = false;
    };

    const currentStep = ref(1);
    const processBar = computed(() => {
      return `${(currentStep.value / steps.length) * 100}%`;
    });
    return {
      steps,
      currentStep,
      processBar,
      isFormValid,
      handleStepSubmit,
      handleUpdate,
      handleSubmit,
      renterData,
      ownerData,
      docLoading,
      fileLoading,
      submitDone,
      fileError,
      docError,
    };
  },
};
</script>

<style>
.btn {
  font-family: CairoBold;
}
</style>
