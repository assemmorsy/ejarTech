<template>
  <div class="container">
    <div
      class="row justify-content-around text-center mt-2"
      v-if="renters && owners"
    >
      <JsonCSV
        class="btn btn-outline-primary col col-10 col-md-5 mt-1"
        :data="computedRenters"
      >
        عدد المستأجرين : {{ renters.length }}
      </JsonCSV>
      <JsonCSV
        class="btn btn-outline-primary col col-10 col-md-5 mt-1"
        :data="computedOwners"
      >
        عدد الملاك : {{ owners.length }}
      </JsonCSV>
    </div>
    <div class="row justify-content-center mt-2">
      <input
        type="text"
        v-model="search"
        class="form-control col-8"
        placeholder="  اكتب رقم التعريف ..."
      />
    </div>
    <div class="row justify-content-center mt-2 text-center" v-if="searchRes">
      <ViewOwnerData :data="searchRes" v-if="searchRes.type === 'owner'" />
      <ViewRenterData :data="searchRes" v-if="searchRes.type === 'renter'" />
    </div>
    <div class="row justify-content-center text-center mt-3" v-if="!searchRes">
      <p class="fs-2 mb-0">لا يوجد نتائج لهذا البحث</p>
      <p class="fs-4 m-0">برجاء التأكد من رقم التعريف</p>
      <i class="bi bi-search display-1 m-3 d-block"></i>
    </div>

    <div class="text-danger" v-if="rentersError || ownersError">
      حدث خطأ ما اثناء تحميل البيانات برجاء اعادة المحاولة في وقت لاحق
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import getDocument from "@/composables/getDocument";

import JsonCSV from "vue-json-csv";
import ViewOwnerData from "@/components/ownerSteps/ViewOwnerData.vue";
import ViewRenterData from "@/components/renterSteps/ViewRenterData.vue";

export default {
  components: { JsonCSV, ViewOwnerData, ViewRenterData },
  setup() {
    const search = ref("");

    const {
      error: ownersError,
      docs: owners,
      getDoc: getOwnersDocs,
    } = getDocument("people");

    const {
      error: rentersError,
      docs: renters,
      getDoc: getRentersDocs,
    } = getDocument("people");
    const computedRenters = computed(() => {
      return renters.value.map((el) => {
        return {
          النوع: el.type,
          "رقم التعريف للنظام": el.id,
          الاسم: el.name,
          "رقم الهاتف": el.phone,
          "سعودي ؟": el.isSaudi,
          "رقم السجل المدنى": el.civilRegistry,
          "تاريخ الميلاد": el.birthDate,
          الجنس: el.gender,
          "الحالة الاجتماعية": el.socialStatus,
          "محل الاقامة": el.liveAt,
          "يبحث عن عقار في ": el.searchFor,
          "نوع العقار المطلوب": el.realEstateType,
          "الدخل الشهرى": el.income,
          "الايجار الشهري": el.salaryPerMonth,
          "السكن مع افراد الاسرة": el.familyResidence,
          "عدد افراد الاسرة": el.familyMembersCount,
          "رابط ملف سمة": el.semaFile.url,
          "رابط ملف شهادة الدخل": el.certificateFile.url,
        };
      });
    });
    const computedOwners = computed(() => {
      return owners.value.map((el) => {
        return {
          النوع: el.type,
          الاسم: el.name,
          "رقم الهاتف": el.phone,
          "المدن التى تتوفر بها عقارات": el.realEstateCities,
          "انواع العقارات المتوفرة": el.realEstateTypes,
          "اوافق علي الايجار من الباطن": el.rentAgree,
          "اوافق علي  خصم نسبة من قيمة الايجار ": el.percentageAgree,
          "نسبة الخصم من قيمة الايجار": el.percentage,
        };
      });
    });

    onMounted(async () => {
      await getRentersDocs(["type", "==", "renter"]);
      await getOwnersDocs(["type", "==", "owner"]);
      if (!rentersError.value && !ownersError.value) {
        // console.log(renters);
        // console.log(owners);
      }
    });

    const people = computed(() => {
      let result = {};
      if (owners.value) {
        owners.value.forEach((el) => {
          result[el.id] = el;
        });
      }
      if (renters.value)
        renters.value.forEach((el) => {
          result[el.id] = el;
        });
      return result;
    });
    const searchRes = computed(() => {
      return people.value[search.value];
    });

    return {
      search,
      searchRes,
      owners,
      renters,
      rentersError,
      ownersError,
      computedRenters,
      computedOwners,
    };
  },
};
</script>

<style></style>
