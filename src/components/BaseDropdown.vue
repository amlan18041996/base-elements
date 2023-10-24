<template>
    <div class="dropdown" ref="dropdownCore" :id="customParentId">
        <button type="button" :class="['btn', togglerClass]" @click="dropdown = !dropdown">{{ name }}</button>
        <div v-show="dropdown" :class="['shell', displayClass]">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, ref, onMounted } from 'vue';
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
        },
        customParentId: {
            type: String,
            required: false
        },
        onReady: {
            type: Function,
            default: () => {}
        }
    });

    const dropdown = ref(false);
    const dropdownCore = ref(null);

    onClickOutside(dropdownCore, (event) => {
        if (!props.preventOutsideClose) dropdown.value = false;
    });

    onMounted(() => props.onReady());
</script>

<style lang="scss">
    .dropdown {
        @apply relative block space-y-3;
        .shell {
            @apply absolute flex gap-3 z-40;
        }
    }
</style>