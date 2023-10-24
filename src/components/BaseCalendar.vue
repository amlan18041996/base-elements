<template>
  <div class="base-calendar" ref="calendarCore">
    <input
      type="text"
      :name="customName"
      :id="customId"
      class="form-element"
      data-size="sm"
      @click="calendar = !calendar"
      :value="date"
      readonly
    />
    <div class="calendar-container calendar-show" v-show="calendar"></div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import Calendar from "./ext-js/Calendar";

const props = defineProps({
  customName: {
    type: String,
    default: "",
  },
  customId: {
    type: String,
    default: "",
  },
  defaultValue: {
    type: Number,
    default: new Date().getTime(),
  },
  minDate: {
    type: String,
    required: false,
  },
  maxDate: {
    type: String,
    required: false,
  },
});

const calendar = ref(false);
const calendarCore = ref(null);
const date = ref(null);
const emit = defineEmits(["update:modelValue"]);

function checkValue(val) {
  const newDate = new Date(val);
  let newDateText = `${String(newDate.getDate()).padStart(2, 0)}-${String(
    newDate.getMonth() + 1
  ).padStart(2, 0)}-${newDate.getFullYear()}`;
  date.value = newDateText;
  emit("update:modelValue", date.value);
}

onClickOutside(calendarCore, (event) => (calendar.value = false));

onMounted(() => {
  checkValue(props.defaultValue);
  new Calendar({
    minDate: props.minDate,
    maxDate: props.maxDate,
    value: props.defaultValue,
    onChange: checkValue,
  });
});
</script>

<style>
.base-calendar {
  @apply relative block;
}
.calendar-show {
  @apply absolute z-40;
}
</style>
