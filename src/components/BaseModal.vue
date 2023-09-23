<template>
    <Teleport :to="'#'+port">
        <Transition name="modal">
            <div v-if="show" class="modal-mask">
                <div class="modal-dialog" ref="outer">
                    <div class="modal-container m-2">
                        <div class="modal-header" v-if="displayHead">
                            <slot name="header">
                                <button v-if="displayClose" class="ml-auto font-semibold" @click="closeModal">X</button>
                            </slot>
                        </div>

                        <div class="modal-body" v-if="displayBody">
                            <slot name="body">
                                <template v-if="closeDialog">
                                    <button class="btn btn-info ml-auto mt-4" @click="closeModal">{{ closeDialog }}</button>
                                </template>
                            </slot>
                        </div>

                        <div class="modal-footer" v-if="displayFooter">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
    import { onClickOutside } from '@vueuse/core'
    import { ref, defineProps, defineEmits } from 'vue'

    const outer = ref(null);
    const emit = defineEmits(['close']);

    const props = defineProps({
        port: {
            type: String, 
            default: 'app'
        }, 
        show: {
            type: Boolean, 
            required: true
        }, 
        displayHead: {
            type: Boolean, 
            default: false
        }, 
        displayClose: {
            type: Boolean, 
            default: false
        }, 
        displayBody: {
            type: Boolean, 
            default: true
        }, 
        displayFooter: {
            type: Boolean, 
            default: false
        }, 
        closeDialog: {
            type: String, 
            default: 'Okay'
        }, 
    });

    onClickOutside(outer, (event) => {
        console.log("Close Modal outside click", event);
    });

    function closeModal() {
        emit('close');
    }
</script>

<style>
    .modal-mask {
        @apply absolute flex z-50 top-0 left-0 w-full h-full bg-gray-700 bg-opacity-60 transition;
    }

    .modal-dialog {
        @apply w-full m-auto;
        max-width: 500px;
    }

    .modal-container {
        @apply flex flex-col bg-white rounded shadow-md transition;
    }

    .modal-header {
        @apply flex flex-shrink-0 items-center py-3 px-3.5 border-b border-gray-200;
    }

    .modal-body {
        @apply relative flex flex-col flex-1 py-3 px-3.5;
    }

    .modal-footer {
        @apply flex flex-1 flex-shrink-0 flex-wrap items-center justify-end py-3 px-3.5 border-t border-gray-200;
    }

    .modal-default-button {
        float: right;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */
    .modal-enter-from {
        opacity: 0;
    }

    .modal-leave-to {
        opacity: 0;
    }

    .modal-enter-from .modal-container,
    .modal-leave-to .modal-container {
        -webkit-transform: scale(-1.25);
        transform: scale(-1.25);
    }
</style>