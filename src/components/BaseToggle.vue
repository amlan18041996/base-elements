<template>
    <div class="toggle-wrapper" :style="'--container-width: '+dimensions+';--rounder-corner: '+rounderCorner+';--background-color: '+backgroundColor+';--slider-color: '+sliderColor+';'">
        <input type="checkbox" class="toggle-checkbox" v-model="active" />
        <div class="toggle-container">
            <div :class="['toggle-button', {'active': active}, {'left-0': !active}]">
                <slot name="signs"></slot>
            </div>
            <!-- <span>ON</span> -->
            <!-- <span>OFF</span> -->
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref, defineProps, defineExpose } from 'vue'

    const props = defineProps({
        value: {
            type: Boolean,
            default: false
        },
        dimensions: {
            type: String,
            default: '3em'
        },
        rounderCorner: {
            type: String,
            default: '9999px'
        },
        backgroundColor: {
            type: String,
            default: '#ddd'
        },
        sliderColor: {
            type: String,
            default: '#fff'
        }
    });
    const active = ref(false);
    onMounted(() => {
        console.log('Toggle mount');
        active.value = props.value;
    });
    defineExpose({ active });
</script>

<style scoped lang="scss">
    .toggle-wrapper {
        @apply relative inline-flex justify-center items-center py-0.5 px-1.5 shadow;
        border-radius: var(--rounder-corner);
        background-color: var(--background-color);
    }
    .toggle-checkbox {
        @apply w-full h-full absolute appearance-none opacity-0 cursor-pointer z-[1];
    }
    .toggle-checkbox:checked + .toggle-container .toggle-button{
        @apply right-0;
    }
    .toggle-container {
        @apply relative flex items-center transition-all;
        border-radius: var(--rounder-corner);
        min-width: var(--container-width);
        height: calc((var(--container-width)/2));
        background-color: transparent;
        .toggle-button {
            @apply absolute flex justify-center items-center transition-all;
            background-color: var(--slider-color);
            border-radius: var(--rounder-corner);
            width: calc(((var(--container-width)/2) - 0.125em));
            height: calc(((var(--container-width)/2) - 0.125em));
        }
    }
</style>