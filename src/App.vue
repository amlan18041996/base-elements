<template>
    <div class="container mx-auto my-4 space-y-5 px-4">
        <div class="grid grid-cols-9 border grid-flow-col">
            <div class="hidden md:block col-span-2 card gap-3">
                <div class="card-header text-center font-semibold tracking-wider">Select PAGE</div>
                <div class="card-body flex flex-col gap-2">
                    <button class="btn" @click="show = 'table'">Data Table</button>
                    <button class="btn" @click="show = 'modal'">Modal</button>
                    <button class="btn" @click="show = 'dropdown'">Dropdown</button>
                    <button class="btn" @click="show = 'form-inputs'">Input</button>
                    <button class="btn" @click="show = 'toggle'">Toggle</button>
                </div>
            </div>
            <div class="col-span-full md:col-span-7 card">
                <div class="card-header text-center font-semibold tracking-wider">Try out components</div>
                <div class="card-body" id="bod">
                    <template v-if="show === 'table'">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <base-select v-model="method" :lists="allMethods" name="method" id="method"></base-select>
                            <base-input 
                                label-style="floated" 
                                label-name="URL" 
                                label-for="url" 
                                size="sm" 
                                v-model="url"
                            ></base-input>
                            <base-input 
                                label-style="floated" 
                                label-name="Parameters" 
                                label-for="parameters" 
                                size="sm" 
                                v-model="params"
                            ></base-input>
                            <button class="btn btn-sm btn-outline-primary font-semibold" @click="service.execute">Fetch User Details</button>
                        </div>
                        <base-handler 
                            ref="service" 
                            :base-url="url" 
                            :api-method="method.length > 0 ? method[0].value : method" 
                            :parameters="params" 
                            :before-request="alterRequest" 
                            :after-request="alterResponse" 
                            :save-session="{mode: 'local', key: 'allValue'}"
                        >
                            <template #load>
                                <div class="w-full p-4 text-xl text-blue-500 text-center font-semibold tracking-wider rounded shadow">Please wait, retrieving user details...</div>
                            </template>
                            <template #requested="request">
                                <base-table :response="request.response[0]"></base-table>
                            </template>
                            <template #default>Search something</template>
                        </base-handler>
                    </template>
                    <template v-if="show === 'modal'">
                        <button class="btn" @click="modal=true">Open Modal</button>
                        <base-modal :show="modal" display-head display-footer port="bod">
                            <template #header>
                                <div class="flex">Dummy Modal</div>
                            </template>
                            <template #body>
                                Welcome to base-components package
                            </template>
                            <template #footer>
                                <button class="btn btn-primary" @click="modal=false">Okay</button>
                            </template>
                        </base-modal>
                    </template>
                    <template v-if="show === 'dropdown'">
                        <div class="">
                            <base-dropdown name="Filters" toggler-class="btn-sm btn-outline-primary rounded-sm" display-class="w-64 flex-col p-4 bg-white rounded border shadow">
                                <input type="text" class="form-input form-input-sm" />
                                <input type="text" class="form-input form-input-sm" />
                                <div class="flex gap-3">
                                    <button class="btn btn-sm btn-warning w-full font-semibold tracking-widest">APPLY</button>
                                    <button class="btn btn-sm btn-outline-warning w-full font-semibold tracking-widest">RESET</button>
                                </div>
                            </base-dropdown>
                        </div>
                    </template>
                    <template v-if="show === 'form-inputs'">
                        <form :onsubmit="e => e.preventDefault()">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <base-input label-style="floated" :value="firstName" v-model="firstName" label-name="First Name" label-for="first_name" size="md"></base-input>
                                <base-input label-style="floated" label-name="Address" label-for="address" size="md"></base-input>
                                <base-input label-style="floated" label-name="Web Address" label-for="web_address" size="md"></base-input>
                                <base-input label-style="floated" label-name="Email" label-for="email" size="md"></base-input>
                                <base-input label-style="floated" label-name="Description" label-for="description" size="md"></base-input>
                                <base-input label-style="floated" label-name="Last Name" label-for="last_name" size="md"></base-input>
                                <base-select v-model="method" :lists="allMethods" name="method" id="method"></base-select>
                            </div>
                            <div class="flex gap-3 mt-4">
                                <button class="btn btn-sm btn-primary" type="submit">Submit Details</button>
                                <button class="btn btn-sm btn-primary" type="reset">Reset</button>
                            </div>
                        </form>
                    </template>
                    <template v-if="show === 'toggle'">
                        <div class="flex justify-between">
                            <span>Email Preferences</span>
                            <base-toggle ref="emailPrefer" dimensions="3em" rounder-corner="2px" :value="false">
                                <template #signs>
                                    <svg v-if="emailPrefer && !emailPrefer.active" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                                    </svg>
                                </template>
                            </base-toggle>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import Toast from './components/ext-js/Toast.js'

    const firstName = ref('');
    const service = ref(null);
    const method = ref('GET');
    const show = ref('form-inputs');
    const modal = ref(false);
    const emailPrefer = ref(null);
    const params = ref('?id=7237&name=bob&age=33');
    const url = ref('https://971dbe15-5a27-4e6c-9e76-bdeafe344147.mock.pstmn.io/v2/order-list');
    const allMethods = [
        {label: 'Please Select', value: ''},
        {label: 'GET', value: 'get'}, 
        {label: 'POST', value: 'post'}, 
        {label: 'PUT', value: 'put'}, 
        {label: 'DELETE', value: 'delete'}
    ];

    function alterRequest(options) {
        // console.log(options);
        return options;
    }

    function alterResponse(data) {
        console.log(data);
        new Toast({
            text: JSON.stringify("\
                <div class='flex flex-col divide-y' style='width: calc(100% - 0px);'>\
                    <div class='font-semibold'>Success</div>\
                    <div class='text-sm pt-2'>Table values fetched successfully</div>\
                </div>\
            "),
            position: "top-center",
            pauseOnHover: true,
            pauseOnFocusLoss: true,
            showProgress: false,
            autoClose: false,
            width: '300px'
        })
        return data;
    }
</script>