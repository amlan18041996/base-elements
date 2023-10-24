<template>
    <div ref="container" @click="containerConfig" class="select-container">
        <select :name="name" :id="id" v-model="selectTagValues">
            <template v-if="evaluateOptions.length > 0">
                <option :key="index" :value="option.value" v-for="(option, index) in evaluateOptions">
                    {{ option.label }} 
                </option>
            </template>
        </select>
        <div :class="['selector-control', {show: openSelect}]" :data-size="size">
            <div class="selected">
                <slot>
                    <template v-if="evaluateSelectedOptions.length > 0">
                        <div 
                            :title="option.value" 
                            :id="option.value" 
                            :class="[{'singleselect-tag': !multiSelect}, {'multiselect-tag': multiSelect}]"
                            v-for="(option, index) in evaluateSelectedOptions" :key="index"
                        >
                            <template v-if="!multiSelect">{{ option.label }}</template>
                            <template v-if="multiSelect">
                                <span class="multiselect-content">{{ option.label }}</span>
                                <div class="multiselect-content-close" @click="unselectItem(option)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-else>{{ parentPlaceholder }}</template>
                </slot>
            </div>
            <div class="selected-actions flex gap-1">
                <span 
                    @click="clearAll" 
                    class="clear-items p-1 hover:text-red-700" 
                    v-if="!(Object.keys(selected).length <= 0 && multiSelected.length <= 0) && allClear"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4 transition transform hover:rotate-90" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </span>
                <span v-if="!(Object.keys(selected).length <= 0 && multiSelected.length <= 0) && allClear" class="vertical-divider w-px box-border my-px self-stretch bg-gray-300"></span>
                <span class="open-items hover:text-blue-700 z-10" @click="openSelect = !openSelect">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" :class="['w-4 h-4 transition', {'transform rotate-180': openSelect}]" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </span>
            </div>
        </div>
        <div class="selector-items-container" v-show="toggleSelect">
            <div class="flex flex-col gap-0.5 sticky top-0 mb-1" v-if="options.length > 0 && (searchable || addItem)">
                <base-input size="sm" @keyup="filterResults" v-model="searchedValue" :placeholder="childPlaceholder">
                    <span class="absolute inset-y-0 right-0 flex gap-1.5 items-center pr-2">
                        <span v-if="options.length > 0 && searchable" class="cursor-pointer hover:text-blue-700" title="Search">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </span>
                        <span v-if="addItem" @click="handleAddItem" class="cursor-pointer hover:text-blue-700" title="Add item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </span>
                    </span>
                </base-input>
                <small v-if="hintText" class="ml-1.5 text-gray-600 select-none border-b" style="font-size: 10px;">{{ hintText }}</small>
            </div>
            <div class="selector-items">
                <template v-if="evaluateOptions.length > 0">
                    <div 
                        class="item" 
                        :key="index" 
                        :id="option.value" 
                        @click="selectItem(option)" 
                        v-for="(option, index) in evaluateOptions"
                    >
                        {{ option.label }}
                        <slot checkedSign>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 text-orange-500" viewBox="0 0 16 16" v-if="option.checked">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                        </slot>
                    </div>
                </template>
                <div class="text-center" v-else><small>{{ evaluateNoOptions }}</small></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onClickOutside } from '@vueuse/core'
    import { defineProps, onMounted, computed, ref, defineEmits, watch } from 'vue'

    const props = defineProps({
        name:{
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        lists: {
            type: Array,
            required: false,
            default: () => []
        },
        multiSelect: {
            type: Boolean,
            required: false,
            default: false
        },
        noOptionsMessage: {
            type: String,
            required: false,
            default: "No options available"
        },
        noSearchMessage: {
            type: String,
            required: false,
            default: "No match found"
        },
        parentPlaceholder: {
            type: String,
            required: false,
            default: 'Please Select'
        },
        childPlaceholder: {
            type: String,
            required: false,
            default: ''
        },
        allClear: {
            type: Boolean,
            required: false,
            default: false
        },
        addItem: {
            type: Boolean,
            required: false,
            default: false
        },
        searchable: {
            type: Boolean,
            required: false,
            default: false
        }, 
        hintText: {
            type: String,
            required: false
        },
        size: {
            type: String,
            default: 'md'
        },
    });

    const container = ref(null);
    const selectTagValues = ref('');
    const emit = defineEmits(['update:modelValue']);
    
    const options = ref([]);
    const selected = ref({});
    const multiSelected = ref([]);
    const openSelect = ref(false);
    const searchedValue = ref('');
    const searchedOptions = ref([]);
    const openSubRootSearch = ref(false);

    const toggleSelect = computed(() => openSelect.value || openSubRootSearch.value);
    const evaluateOptions = computed(() => searchedValue.value.trim() === '' ? options.value : searchedOptions.value);
    const evaluateSelectedOptions = computed(() => options.value.filter(data => data.checked === true));
    const evaluateNoOptions = computed(() => searchedValue.value.trim() === '' ? props.noOptionsMessage : props.noSearchMessage);

    onClickOutside(container, (event) => {
        if (openSelect.value) {
            searchedValue.value = '';
            openSelect.value = false;
        }
    });

    function containerConfig() {
        openSelect.value = true;
    }

    function filterResults() {
        if (searchedValue.value.trim() !== "") {
            searchedOptions.value = options.value.filter(data => data.label.toLowerCase().match(searchedValue.value.toLowerCase()));
        } else {
            searchedOptions.value = [];
        }
    }

    function emitOptions() {
        const selectValues = options.value.filter(data => data.checked === true);
        // console.log(selectValues);
        selectTagValues.value = selectValues.length > 0 ? selectValues[0].value : '';
        emit('update:modelValue', selectValues);
    }
    
    function clearAll() {
        options.value = options.value.map(data => {
            return {...data, checked: false};
        });
        emitOptions();
    }

    function unselectItem(dataPack) {
        const findSelectedField = options.value.findIndex(data => data.value === dataPack.value);
        console.log(findSelectedField, options.value[findSelectedField]);
        if (findSelectedField !== -1) {
            options.value[findSelectedField].checked = false;
        }
        emitOptions();
    }

    function selectItem(dataPack) {
        options.value = options.value.map(data => {
            if (data.value === dataPack.value) return {...data, checked: !data.checked}
            else if (!props.multiSelect) return {...data, checked: false}
            else if (props.multiSelect) return data;
        });
        emitOptions();
    }

    function handleAddItem() {
        if (searchedValue.value.trim() !== "") {
            options.value.push({label: searchedValue.value, value: searchedValue.value});
            searchedValue.value = "";
        }
    }

    onMounted(() => {
        options.value = props.lists;
    });
</script>

<style scoped>
    .select-container {
        @apply w-full relative box-border;
    }
    .select-container select {
        @apply hidden;
    }
    .select-container:focus-visible, span.open-items, span.clear-items {
        @apply inline-flex outline-none;
    }
    span.open-items, span.clear-items svg {
        @apply my-auto;
    }
    .selector-control {
        @apply w-full 
            flex justify-between rounded 
            data-[size=sm]:py-1 
            data-[size=md]:py-1.5 
            data-[size=lg]:py-2 
            data-[size=sm]:text-sm 
            data-[size=md]:text-base 
            data-[size=lg]:text-lg 
            px-3 
            border border-solid border-gray-300 
            transition cursor-pointer;
    }
    .selector-control.show {
        @apply outline-none text-gray-700 border-blue-200;
    }

    .selector-control .selected {
        @apply h-full flex gap-1 self-center flex-wrap flex-row tracking-wider text-sm;
    }
    .selector-control .selected .multiselect-tag {
        @apply w-min h-full flex rounded-sm box-border justify-between bg-gray-300 py-0.5 pr-0.5 pl-1.5 select-none cursor-pointer;
        min-width: 60px;
        max-width: 90px;
    }
    .selector-control .selected .multiselect-content {
        @apply self-center font-bold truncate tracking-wider text-xs;
    }
    .selector-control .selected .multiselect-content-close {
        @apply items-center flex py-0 px-0.5 my-0 mx-0.5 box-border rounded-sm;
    }
    .selector-control .selected .multiselect-content-close:hover {
        @apply bg-orange-100 text-red-500;
    }

    .selector-items-container {
        @apply absolute inset-x-0 z-50 rounded mt-1 mb-0 mx-px py-1 px-2 bg-white border border-solid border-gray-300 shadow-lg;
    }
    .selector-items-container .select-items {
        @apply overflow-y-auto pr-2 max-h-[200px];
    }
    .selector-items-container .selector-items::-webkit-scrollbar {
        width: 3px;
    }
    .selector-items-container .selector-items::-webkit-scrollbar-track {
        @apply rounded-sm shadow-inner bg-gray-300;
    }
    .selector-items-container .selector-items::-webkit-scrollbar-thumb {
        @apply rounded bg-gray-400;
    }
    .selector-items-container .selector-items::-webkit-scrollbar-thumb:hover {
        @apply bg-gray-500;
    }
    .selector-items-container .selector-items .item {
        @apply w-full flex justify-between items-center cursor-pointer py-1 px-2 select-none text-sm font-normal rounded whitespace-nowrap transition-all;
    }
    .selector-items-container .selector-items .item:hover {
        @apply text-base font-sans text-blue-500 bg-gray-200;
    }
</style>