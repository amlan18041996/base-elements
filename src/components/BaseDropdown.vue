<template>
    <div class="dropdown" ref="dropdownCore">
        <button type="button" :class="['btn', togglerClass]" @click="dropdown = !dropdown">{{ name }}</button>
        <div v-if="dropdown" :class="['shell', displayClass]">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, ref } from 'vue';
    import { onClickOutside } from '@vueuse/core';

    const props = defineProps({
        name: {
            type: String,
            default: 'Toggle'
        },
        preventOutsideClose: {
            type: Boolean,
            default: false
        },
        togglerClass: {
            type: String,
            default: ''
        },
        displayClass: {
            type: String,
            default: ''
        }
    });

    const dropdown = ref(false);
    const dropdownCore = ref(null);

    onClickOutside(dropdownCore, (event) => {
        console.log("Close dropdown outside click", event);
        if (!props.preventOutsideClose) dropdown.value = false;
    });
</script>

<style lang="scss">
    .dropdown {
        @apply relative block space-y-3;
        .shell {
            @apply absolute flex gap-3 z-40;
        }
    }
</style>