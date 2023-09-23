<template>
    <template v-if="onError">
        <div class="w-full p-4 text-center font-semibold rounded shadow">{{ log.message }}</div>
    </template>
    <template v-if="loader">
        <template v-if="$slots.load">
            <slot name="load"></slot>
        </template>
        <template v-else>
            <div class="w-full p-4 text-center font-semibold rounded loading">Loading...</div>
        </template>
    </template>
    <template v-else>
        <slot></slot>
    </template>
</template>

<script setup>
    import VueCookies from 'vue-cookies'
    import { defineProps, onErrorCaptured, onMounted, ref } from 'vue'

    const props = defineProps({
        checkToken: {
            type: Boolean,
            default: false
        },
        loader: {
            type: Boolean,
            default: false
        }
    });

    const onError = ref(false);
    const log = ref({message: '', internalMessage: ''});
    const modal = ref({status: '', mode: false, message: '', tokenExpire: false});
    
    function closeModal() {
        setTimeout(() => modal.value = {mode: false,status: '',message: '',tokenExpire: false}, 1000);
    }

    onErrorCaptured((err, vm, info) => {
        console.log(err, vm, info);
        const errRes = {
            mode: true,
            status: 'Error',
            message: 'Something went wrong!',
            tokenExpire: false
        }
        log.value.message = 'Something went wrong!';
        log.value.internalMessage = info;
        setTimeout(() => modal.value = errRes, 1000);
    });

    onMounted(() => {
        if (checkToken.value) {
            try {
                const { rationalized_id } = VueCookies.get('ProfileData');
            } catch (error) {
                console.log(error);
                const errRes = {
                    mode: true,
                    status: 'Error',
                    message: 'Unable to fetch information. Kindly try login again.',
                    tokenExpire: true
                }
                onError.value = true;
                log.value.message = log.value.internalMessage = 'Unable to fetch information. Kindly try login again.';
                setTimeout(() => modal.value = errRes, 1000);
            }
        }
    });
</script>