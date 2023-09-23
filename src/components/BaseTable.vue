<template>
    <div :class="['table-container', overrideStyle]">
        <div class="controls">
            <select 
                id="perPage" 
                name="perPage" 
                v-if="enablePageLimit" 
                @change="detectPerPage" 
                class="rounded py-px px-1 border border-gray-300"
            >
                <option v-for="perPage in [5, 10, 15, 20]" :key="perPage" :value="perPage">{{ perPage }}</option>
            </select>
            <div class="flex gap-x-4">
                <base-dropdown name="Filters" toggler-class="btn-sm btn-outline-primary rounded-sm" display-class="w-64 flex-col p-4 bg-white rounded border shadow right-0">
                    <form :onsubmit="e => e.preventDefault()">
                        <template v-for="(headerObj, headerName, index) in headers" :key="index">
                            <template v-if="headerObj.filter.search !== undefined">
                                <base-input 
                                    label-style="vertical" 
                                    :label-name="headerObj.name" 
                                    :label-for="headerName" 
                                    size="sm" 
                                    v-model="headerObj.filter.search"
                                ></base-input>
                            </template>
                        </template>
                        <div class="flex gap-3">
                            <button class="btn btn-sm btn-warning w-full font-semibold tracking-widest" @click="filterSearched">APPLY</button>
                            <button class="btn btn-sm btn-outline-warning w-full font-semibold tracking-widest" @click="reseetSearched">RESET</button>
                        </div>
                    </form>
                </base-dropdown>
                <button class="btn btn-sm btn-primary rounded-sm space-x-2" v-if="downloadable">
                    <span>Download</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="wrapper">
            <table :class="['table', tableStyle]">
                <thead v-if="!disableHeading">
                    <tr>
                        <template v-for="(head, keyName, headIndex) in headers" :key="headIndex">
                            <th 
                                scope="col" 
                                :class="head.overideClass" 
                                v-if="head.show.toLowerCase() === 'true'"
                            >
                                <div class="head-wrapper flex items-center gap-2">
                                    {{ head.name }}
                                    <span 
                                        class="head-icon tooltip" 
                                        v-if="head.filter.sort !== undefined" 
                                        @click="applyFilters('sort', {keyName, sort: ['', 'dsc'].includes(head.filter.sort) ? 'asc' : 'dsc'})"
                                    >
                                        <slot name="headIcon" :filter="{key: keyName, ...head.filter}">
                                            <template v-if="head.type === 'string'">
                                                <svg v-if="['', 'dsc'].includes(head.filter.sort)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                                                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                                                </svg>
                                                <svg v-if="head.filter.sort === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down-alt" viewBox="0 0 16 16">
                                                    <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>
                                                    <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"/>
                                                    <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                                                </svg>
                                            </template>
                                            <template v-if="['number', 'date'].includes(head.type)">
                                                <svg v-if="['', 'dsc'].includes(head.filter.sort)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-4 h-4" viewBox="0 0 16 16">
                                                    <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
                                                    <path fill-rule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
                                                    <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                                                </svg>
                                                <svg v-if="head.filter.sort === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-numeric-down-alt" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M11.36 7.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.836 1.973-1.836 1.09 0 2.063.637 2.063 2.688 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
                                                    <path d="M12.438 8.668V14H11.39V9.684h-.051l-1.211.859v-.969l1.262-.906h1.046zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                                                </svg>
                                            </template>
                                        </slot>
                                    </span>
                                </div>
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="(Object.keys(searches).length > 0 && lists.filtered.length === 0) || lists.all.length === 0">
                        <tr>
                            <td :colspan="Object.keys(headers).length" class="text-center">
                                <slot name="errorMessage">No results found</slot>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <TransitionGroup 
                            name="list" 
                            tag="tr" 
                            @click="redirectPath(item)" 
                            class="group" 
                            v-for="(item, itemKey, itemIndex) in lists.pageLists" 
                            :key="itemIndex"
                        >
                            <template v-for="(head, keyName, headIndex) in headers" :key="headIndex">
                                <td v-if="head.show.toLowerCase() === 'true'">
                                    <template v-if="showItemName(keyName)">
                                        <slot :name="keyName" :itemName="item[keyName]"></slot>
                                    </template>
                                    <template v-else>
                                        <template v-if="head.type === 'date' && head.format">
                                            <div class="">{{ useDateFormat(Date.parse(item[keyName]), head.format).value }}</div>
                                        </template>
                                        <template v-else>
                                            <div class="">{{ item[keyName] }}</div>
                                        </template>
                                    </template>
                                </td>
                            </template>
                        </TransitionGroup>
                    </template>
                </tbody>
            </table>
        </div>
        <div id="table-navigation" v-if="lists.total > lists.perPage">
            <div class="showing">
                Showing <span class="hightlight">
                {{ ((lists.currentPageNumber * lists.perPage) - lists.perPage + 1) }} 
                to {{ (lists.currentPageNumber * lists.perPage) > lists.total ? lists.total : lists.currentPageNumber * lists.perPage }}
                </span> out of <span class="hightlight">{{ lists.total }} entries</span>
            </div>
            <div :class="['table-pagination', paginateDottedStyle]">
                <button 
                    :disabled="changedPageNumber === 1" 
                    @click="changePage(changedPageNumber - 1)"
                >Previous</button>
                <template v-if="paginateLinks === 'linear'">
                    <li class="page-item active">
                        <select 
                            type="text" 
                            @change="changePage" 
                            v-model="changedPageNumber" 
                            class="rounded py-px px-1 border border-gray-300"
                        >
                            <option 
                                v-for="pageNum in (Math.ceil(detectList.length / lists.perPage))" 
                                :key="pageNum" 
                                :value="pageNum"
                            >{{ pageNum }}</option>
                        </select>
                    </li>
                </template>
                <template v-else-if="paginateLinks === 'dotted'">
                    <template :key="pageNum" v-for="pageNum in lists.dottedPages">
                        <button 
                            :class="[{'active': pageNum === changedPageNumber}, {'never-active': pageNum === '...'}]" 
                            :disabled="pageNum === changedPageNumber" 
                            @click="changePage(pageNum)"
                        >{{ pageNum }}</button>
                    </template>
                </template>
                <button 
                    @click="changePage(changedPageNumber + 1)" 
                    :disabled="changedPageNumber >= (Math.ceil(detectList.length / lists.perPage))"
                >Next</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import utilMixin from '../utils.js'
    import { useDateFormat } from '@vueuse/core'
    import { ref, reactive, onMounted, onUnmounted, defineProps, defineExpose, useSlots, computed } from 'vue'

    const slots = useSlots();
    
    // Declaring Properties
    const props = defineProps({
        response: {
            type: Object, 
            default: () => {}
        },
        disableHeading: {
            type: Boolean, 
            default: false
        },
        downloadable: {
            type: Boolean, 
            default: true
        },
        enablePageLimit: {
            type: Boolean, 
            default: true
        },
        pageLimit: {
            type: Number,
            default: 5
        },
        paginateLinks: {
            type: String,
            default: 'dotted'
        },
        redirectPath: {
            type: Function, 
            required: false
        },
        saveSession: {
            type: Object,
            required: false
        },
        overrideStyle: {
            type: String, 
            default: ''
        },
        tableStyle: {
            type: String,
            default: 'default'
        },
        paginateDottedStyle: {
            type: String,
            default: 'classic'
        }
    });

    defineExpose({ applyFilters, exposeData });

    const { paginateList } = utilMixin();

    // Declaring component in-memory blocks
    let headers = ref({});
    let lists = reactive({
        all: [], 
        filtered: [], 
        total: 0, 
        pageLists: [], 
        currentPageNumber: 1, 
        perPage: 5, 
        activePage: 1, 
        dottedPages: []
    });
    const changedPageNumber = ref(1);

    const searches = ref({});

    const showItemName = slotName => !!slots[slotName];

    function changePage(num) {
        const items = Object.keys(searches).length > 0 && lists.filtered.length > 0 ? lists.filtered : lists.all;
        if ((num <= Math.ceil(items.length / lists.perPage)) || (num.type === 'change')) {
            const pageNum = num.type !== 'change' ? num : changedPageNumber.value;
            const {dotted, striped} = paginateList(items, pageNum, lists.perPage);
            lists.pageLists = striped;
            lists.dottedPages = dotted;
            lists.currentPageNumber = pageNum;
            if (num.type !== 'change') changedPageNumber.value = pageNum;
        }
    }

    function detectPerPage(e) {
        lists.currentPageNumber = 1;
        lists.perPage = parseInt(e.target.value);
        const {dotted, striped} = paginateList(lists.all, 1, lists.perPage);
        lists.pageLists = striped;
        lists.dottedPages = dotted;
    }

    function filterSearched() {
        Object.keys(headers.value).forEach(head => {
            if (headers.value[head].filter.search !== undefined) {
                if (head in searches.value && headers.value[head].filter.search === '') delete searches.value[head];
                else if (headers.value[head].filter.search !== '') searches.value = {...searches.value, [head]: headers.value[head].filter.search};
            }
        });
        evaluateSearch();
    }

    function reseetSearched() {
        Object.keys(headers.value).forEach(head => {
            if (headers.value[head].filter.search !== undefined) headers.value[head].filter.search = '';
            if (head in searches.value) delete searches.value[head];
        });
        evaluateSearch();
    }

    function applyFilters(action, data) {
        if (action === 'reset') resetFilters();

        if (action === 'search') {
            searches.value = {...searches.value, ...data};
            evaluateSearch();
        }

        if (action === 'delete') {
            Object.keys(data).forEach(dataInput => delete searches.value[dataInput]);
            evaluateSearch();
        }

        if (action === 'sort') {
            const clonedHeaders = Object.keys(headers.value).map(header => {
                if (typeof headers.value[header].filter.sort !== 'undefined') {
                    if (header === data.keyName) {
                        headers.value[header].active = true;
                        headers.value[header].filter.sort = data.sort;
                    } else {
                        delete headers.value[header].active;
                        headers.value[header].filter.sort = '';
                    }
                }
                return {[header]: headers.value[header]};
            });
            headers.value = Object.assign({}, ...clonedHeaders);
            evaluateSort();
        }
    }

    function evaluateSearch() {
        let listClone = lists.all;
        if (Object.keys(searches.value).length > 0) {
            listClone = listClone.filter(list => {
                let approvedCount = 0;
                let everyFilter = Object.keys(searches.value).every(val => {
                    if (typeof list[val] !== 'undefined' && typeof headers.value[val].filter.search !== 'undefined') {
                        if (['string', 'number'].includes(headers.value[val].type)) {
                            if (String(list[val]).toLowerCase().includes(String(searches.value[val]).toLowerCase())) {
                                approvedCount = approvedCount + 1;
                                return true;
                            }
                        } else if (headers.value[val].type === 'date') {
                            if (
                                (
                                    searches.value[val].dateFrom 
                                    && parseInt(Date.parse(searches.value[val].dateFrom)) <= parseInt(list[val])
                                ) && 
                                (
                                    searches.value[val].dateTo 
                                    && parseInt(Date.parse(searches.value[val].dateTo)) >= parseInt(list[val])
                                )
                            ) {
                                approvedCount = approvedCount + 1;
                                return true;
                            }
                            else if (
                                !searches.value[val].dateFrom 
                                && searches.value[val].dateTo 
                                && parseInt(Date.parse(searches.value[val].dateTo)) >= parseInt(list[val])
                            ) {
                                approvedCount = approvedCount + 1;
                                return true;
                            }
                            else if (
                                !searches.value[val].dateTo 
                                && searches.value[val].dateFrom 
                                && parseInt(Date.parse(searches.value[val].dateFrom)) <= parseInt(list[val])
                            ) {
                                approvedCount = approvedCount + 1;
                                return true;
                            }
                        }
                    } else if (val === "customSearch") {
                        let specialSearch = searches.value[val].id.split(";");
                        let orResult = specialSearch.filter(sp => String(list[sp]).toLowerCase().includes(String(searches.value[val].value).toLowerCase()));
                        if (orResult.length > 0) {
                            approvedCount = approvedCount + 1;
                            return true;
                        }
                    }
                });
                return approvedCount >= Object.keys(searches.value).length ? everyFilter : false;
            });
        }
        const results = listClone.length > 0 ? listClone : lists.all;
        const activePageNumber = Math.ceil(results.length/lists.perPage) === lists.currentPageNumber ? lists.currentPageNumber : 1;
        lists.filtered = listClone;
        lists.total = listClone.length;
        changedPageNumber.value = activePageNumber;
        const {dotted, striped} = paginateList(results, activePageNumber, lists.perPage);
        lists.pageLists = striped;
        lists.dottedPages = dotted;
    }

    function evaluateSort() {
        let listClone = lists.filtered.length > 0 ? lists.filtered : lists.all;
        const activeSort = Object.keys(headers.value).find(filter => headers.value[filter].active);
        if (
            typeof activeSort !== 'undefined' && 
            typeof headers.value[activeSort].filter.sort !== 'undefined' && 
            headers.value[activeSort].filter.sort.value !== ''
        ) {
            listClone = listClone.sort((x, y) => {
                if (['string'].includes(headers.value[activeSort].type)) 
                    return headers.value[activeSort].filter.sort === 'asc' ? x[activeSort].localeCompare(y[activeSort]) : y[activeSort].localeCompare(x[activeSort]);
                if (['number', 'date'].includes(headers.value[activeSort].type)) 
                    return headers.value[activeSort].filter.sort === 'asc' ? parseInt(x[activeSort]) - parseInt(y[activeSort]) : parseInt(y[activeSort]) - parseInt(x[activeSort]);
            });
        }
        const {dotted, striped} = paginateList(listClone, lists.currentPageNumber, lists.perPage);
        lists.pageLists = striped;
        lists.dottedPages = dotted;
    }

    function exposeData() {
        let clonedData;
        if (Object.keys(searches.value).length > 0) clonedData = lists.filtered;
        else clonedData = lists.all;
        return clonedData;
    }

    function resetFilters() {
        searches.value = {};
        lists.filtered = [];
        lists.total = lists.all.length;
        const {dotted, striped} = paginateList(lists.all, 1, lists.perPage);
        lists.pageLists = striped;
        lists.dottedPages = dotted;
    }

    function flushAll() {
        lists = {
            all: [], 
            filtered: [], 
            total: 0, 
            pageLists: [], 
            currentPageNumber: 1, 
            perPage: 5
        }
        searches.value = {};
        headers.value = {};
    }

    const detectList = computed(() => lists.filtered.length > 0 ? lists.filtered : lists.all);

    // Initial Phase
    onMounted(() => {
        const sessionValue = props.saveSession ? (props.saveSession.mode === 'local' ? localStorage.getItem(props.saveSession.key) : sessionStorage.getItem(props.saveSession.key)) : '';
        if (
            (props.response && Object.keys(props.response).length > 0) || 
            (props.saveSession && sessionValue && sessionValue !== '')
        ) {
            // console.log("[BaseTable] On Mount: ", props.response);
            let {headings, items, total=items.length} = props.response;
            headers.value = headings;
            lists.all = items;
            lists.total = total;
            lists.perPage = props.pageLimit;
            const {dotted, striped} = paginateList(items, lists.currentPageNumber, lists.perPage);
            lists.pageLists = striped;
            lists.dottedPages = dotted;
        }
    });

    onUnmounted(() => flushAll());
</script>

<style scoped lang="scss">
    .table-container {
        @apply relative shadow sm:rounded;
        .controls {
            @apply w-full flex justify-between gap-3 items-center text-sm px-2 py-2.5;
        }
        .wrapper {
            @apply relative overflow-x-auto overflow-y-hidden;
            .table {
                @apply w-full text-sm text-left text-gray-500 table-auto border-collapse;
                thead {
                    @apply text-sm text-gray-700 uppercase;
                    tr {
                        @apply divide-x divide-gray-300 divide-opacity-50;
                        th {
                            @apply px-4 py-2;
                            &:first-child {
                                @apply rounded-tl;
                            }
                            &:last-child {
                                @apply rounded-tr;
                            }
                            .head-wrapper {
                                @apply flex items-center;
                                .head-icon {
                                    @apply ml-auto cursor-pointer transition duration-300 transform text-gray-400 hover:text-gray-900 hover:scale-105;
                                }
                            }
                        }
                    }
                }
                tbody {
                    @apply divide-y divide-dashed;
                    tr {
                        @apply bg-white hover:bg-gray-50 cursor-pointer select-none;
                        th, td {
                            @apply px-5 py-3 font-medium text-sm break-all text-gray-700 whitespace-nowrap;
                        }
                    }
                }
                &.row-bordered {
                    tbody tr:nth-child(odd) {
                        @apply bg-gray-100;
                    }
                }
                &.row-bordered-even {
                    tbody tr:nth-child(even) {
                        @apply bg-gray-100;
                    }
                }
                &.row-bordered, &.row-bordered-even {
                    tbody tr {
                        @apply hover:bg-blue-50;
                    }
                }
                &.col-bordered {
                    tbody tr td:nth-child(odd) {
                        @apply bg-gray-100;
                    }
                }
                &.col-bordered-even {
                    tbody tr td:nth-child(even) {
                        @apply bg-gray-100;
                    }
                }
                &.col-bordered, &.col-bordered-even {
                    tbody tr td {
                        @apply hover:bg-blue-50;
                    }
                }
                &.default {
                    thead {
                        @apply bg-gray-200;
                    }
                }
                &.primary {
                    thead {
                        @apply bg-blue-200;
                    }
                }
                &.secondary {
                    thead {
                        @apply bg-gray-400;
                    }
                }
                &.success {
                    thead {
                        @apply bg-green-200;
                    }
                }
                &.danger {
                    thead {
                        @apply bg-red-200;
                    }
                }
            }
        }
        #table-navigation {
            @apply flex flex-col md:flex-row justify-between md:items-center gap-3 px-2 py-2.5 border-t;
            .showing {
                @apply text-sm font-medium font-serif tracking-wider;
                .hightlight {
                    @apply text-xs font-sans font-bold;
                }
            }
            .table-pagination {
                @apply  flex flex-row flex-wrap gap-1.5 items-center;
                button:not(.never-active) {
                    @apply btn btn-sm;
                }

                &.classic {
                    button:not(.never-active) {
                        @apply bg-white text-gray-700 font-medium border border-gray-300 hover:text-gray-900 hover:bg-gray-100;
                    }
                    button.active {
                        @apply bg-blue-200 border-0;
                    }
                }

                &.modern {
                    button:first-child, button:last-child {
                        @apply btn-info;
                    }
                    button.active {
                        @apply btn-primary;
                    }
                    button.never-active {
                        @apply bg-white hover:bg-white;
                    }
                    button:not(first-child), button:not(last-child) {
                        @apply bg-gray-100 hover:bg-gray-200 text-black;
                    }
                }
            }
        }
    }


    .list-move, /* apply transition to moving elements */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.1s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(3px);
    }

    /* ensure leaving items are taken out of layout flow so that moving
    animations can be calculated correctly. */
    .list-leave-active {
        position: absolute;
    }
</style>