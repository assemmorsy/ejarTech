<template>
  <div class="container mt-2">
    <div>
      <h5 class="bolder"> البيانات الشخصية للمالك</h5>
      
      <p>
        <span class="normal"> الاسم :</span>
        {{ data.name }}
      </p>

      <p>
        <span class="normal"> رقم الجوال : </span>
        {{ data.phone }}
      </p>

    </div>
    <div>
      <h5 class="bolder">بيانات العقارات</h5>
      <p>
        <span class="normal"> المدن التى تتوفر بها العقارات المملوكة </span>
        <p>
        <span class="mx-2" v-for="city in data.realEstateCities" :key="city">
          {{ city }}
        </span>
        </p>
      </p>
      <p>
        <span class="normal"> انواع العقارات المتوفرة </span>
         <p>
        <span class="mx-2" v-for="type in data.realEstateTypes" :key="type">
          {{ type }}
        </span>
        </p>
      </p>
    </div>

    <div>
      <p class="bolder">
        {{data.rentAgree ? "أوافق على التأجير من الباطن للمساهمة في عملية التأجير بالتقسيط الشهرى"
        : "لا أوافق على التأجير من الباطن للمساهمة في عملية التأجير بالتقسيط الشهرى "}}
      </p>
      <p class="bolder">
        {{data.percentageAgree ?  "أقبل فكرة خصم نسبة ما من قيمة الإيجار في حال دفع المؤجر من الباطن قيمة الإيجار مقدما لسنة كاملة ":
        "لا أقبل فكرة خصم نسبة ما من قيمة الإيجار في حال دفع المؤجر من الباطن قيمة الإيجار مقدما لسنة كاملة "}}
      </p>
      
       <p class="bolder">    النسبة التي أراها مناسبة : {{data.percentage}}     </p>
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
