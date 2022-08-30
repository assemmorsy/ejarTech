<template>
  <div class="container mt-2">
    <div>
      <h5 class="bolder">البيانات الشخصية للمستأجر</h5>

      <p>
        <span class="normal"> الاسم :</span>
        {{ data.name }}
      </p>
      <p>
        <span class="normal">
          {{ data.isSaudi === "true" ? "رقم السجل المدنى" : "رقم الإقامة" }}
        </span>
        {{ data.civilRegistry }}
      </p>

      <p>
        <span class="normal"> رقم الجوال : </span>
        {{ data.phone }}
      </p>
      <p>
        <span class="normal"> تاريخ الميلاد : </span>
        {{ data.birthDate }}
      </p>
      <p>
        <span class="normal"> الجنس : </span>
        {{ data.gender }}
      </p>
      <p>
        <span class="normal"> الحالة الاجتماعية : </span>
        {{ data.socialStatus }}
      </p>
    </div>

    <div>
      <h5 class="bolder">الاوراق الرسمية</h5>
      <p>
        <span class="normal"> تقرير سمة الإئتمانى : </span>
        {{ data.semaFile && data.semaFile.name ? data.semaFile.name : "" }}

        <a
          class="btn btn-outline-success rounded-circle mx-3"
          target="_blank"
          :href="data.semaFile.url"
          v-if="data.semaFile && data.semaFile.url"
          ><i class="bi bi-folder2-open"></i>
        </a>
      </p>
      <p>
        <span class="normal">
          رقم السجل المدنى شهادة التأمينات وتعريف العمل مع الراتب الشهرى:
        </span>
        {{
          data.certificateFile && data.certificateFile.name
            ? data.certificateFile.name
            : ""
        }}
        <a
          class="btn btn-outline-success rounded-circle mx-3"
          target="_blank"
          :href="data.certificateFile.url"
          v-if="data.certificateFile && data.certificateFile.url"
          ><i class="bi bi-folder2-open"></i>
        </a>
      </p>
    </div>

    <div>
      <h5 class="bolder">البيانات المالية</h5>
      <p>
        <span class="normal"> مقدار الدخل الشهرى (راتب ومداخيل اخرى) : </span>
        {{ data.income }}
      </p>
      <p>
        <span class="normal"> مقدار القسط الشهرى الذى يمكن ان تسدده : </span>
        {{ data.salaryPerMonth }}
      </p>
    </div>

    <div>
      <h5 class="bolder">بيانات الإقامة</h5>
      <p>
        <span class="normal"> المدينة التى تقيم بها حاليا: </span>
        {{ data.liveAt }}
      </p>
      <p>
        <span class="normal"> المدينة التى تبحث عن سكن بها : </span>
        {{ data.searchFor }}
      </p>
      <p>
        <span class="normal"> نوع العقار الذى تبحث عن الإيجار فيه : </span>
        {{ data.realEstateType }}
      </p>
      <p v-if="data.socialStatus !== 'اعزب'">
        <span class="normal">
          {{
            data.familyResidence
              ? " سيسكن افراد الاسرة معى"
              : " لن يسكن افراد الاسرة معى"
          }}
        </span>
      </p>
      <p v-if="data.familyMembersCount !== ''">
        <span class="normal"> عدد أفراد الأسرة : </span>
        {{ data.familyMembersCount }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data"],
  setup() {
    return;
  },
};
</script>

<style>
.bolder {
  font-family: CairoBold;
}
.normal {
  font-family: CairoNormal;
}
</style>
