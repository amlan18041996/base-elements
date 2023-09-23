<template>
    <div class="handle-service">
        <slot v-if="isFetching && !isFinished" name="load">
            <div class="w-full p-4 text-xl text-blue-500 text-center font-semibold rounded shadow">Loading...</div>
        </slot>
        <template v-else-if="!isFetching && isFinished">
            <slot v-if="error" name="error" :code="statusCode" :logs="log">
                <div class="w-full p-4 text-center font-semibold rounded shadow">{{ log.message }}</div>
            </slot>
            <slot v-else name="requested" :response="response">With response</slot>
        </template>
        <template v-else>
            <slot name="error" v-if="onError"></slot>
            <slot v-else></slot>
        </template>
    </div>
</template>

<script setup>
    import request from '../service.js'
    import { useCookies } from '@vueuse/integrations/useCookies'
    import { onMounted, defineProps, onErrorCaptured, ref, defineExpose } from 'vue';

    const props = defineProps({
        baseUrl: {
            type: String,
            required: false
        },
        parameters: {
            type: String,
            required: false
        },
        apiMethod: {
            type: String,
            default: 'GET'
        },
        checkToken: {
            type: Boolean, 
            default: false
        }, 
        beforeRequest: {
            type: Function,
            default: () => {}
        }, 
        afterRequest: {
            type: Function,
            default: () => {}
        }, 
        saveSession: {
            type: Object,
            required: false
        },
    });

    const cookies = useCookies(['locale']);
    const onError = ref(false);
    const response = ref(null);
    const log = ref({
        message: "", 
        internalMessage: ""
    });

    // SAMPLE TEST URLS: https://dummyjson.com/carts || https://www.google.com:81 || http://httpstat.us/{any-status-code}

    const { 
        execute, onFetchError, onFetchResponse, data, error, statusCode, isFetching, isFinished 
    } = request(
        props.baseUrl, 
        {
            beforeFetch: ({ url, options }) => {
                options.method = props.apiMethod;
                if (props.parameters) {
                    if (props.apiMethod === 'GET') {
                        url = `${props.baseUrl}${props.apiMethod === 'GET' ? props.parameters : ''}`;
                    } else {
                        let formData = new FormData();
                        const fullParams = props.parameters.replace('?', '').split('&');
                        fullParams.forEach(param => formData.append(param.split('=')[0], param.split('=')[1]));
                        options.body = formData;
                    }
                }
                if (props.beforeRequest) options = props.beforeRequest(options);
                return options;
            }
        }
    ).json();

    onFetchResponse(res => {
        let edited = data.value;
        if (props.afterRequest) edited = props.afterRequest(data.value);
        response.value = edited;
        if (props.saveSession) {
            if (props.saveSession.mode === 'local') localStorage.setItem(props.saveSession.key, JSON.stringify(edited));
            else sessionStorage.setItem(props.saveSession.key, JSON.stringify(edited));
        }
    });

    onFetchError(() => {
        console.log("Error:", error.value);
        log.value.message = 'Something went wrong during fetching results!';
        log.value.internalMessage = error.value;
    });

    onErrorCaptured((err, vm, info) => {
        console.log("Error Captured: ", err, vm, info);
        onError.value = true;
        log.value.message = 'Something went wrong!';
        log.value.internalMessage = info;
        return false;
    });

    onMounted(() => {
        console.log("Base Handler, mounted", props.saveSession, !['', null].includes(props.saveSession));
        try {
            if (props.checkToken) {
                const { rationalized_id } = cookies.get('ProfileData');
            }
            if (!['', null].includes(props.saveSession)) {
                const sessionValue = (props.saveSession.mode === 'local' ? localStorage.getItem(props.saveSession.key) : sessionStorage.getItem(props.saveSession.key));
                if (sessionValue !== '') response.value = JSON.parse(sessionValue);
                isFetching.value = false;
                isFinished.value = true;
            }
        } catch (error) {
            console.log(error);
        }
    });

    defineExpose({ execute });
</script>