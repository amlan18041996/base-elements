import './styles/index.css'
import App from './App.vue'
import { createApp } from 'vue'
import BaseHandler from './components/BaseHandler.vue'
import BaseInput from './components/BaseInput.vue'
import BaseTable from './components/BaseTable.vue'
import BaseModal from './components/BaseModal.vue'
import BaseDropdown from './components/BaseDropdown.vue'
import BaseToggle from './components/BaseToggle.vue'
import BaseSelect from './components/BaseSelect.vue'

export { BaseInput, BaseTable, BaseHandler, BaseModal, BaseDropdown, BaseToggle, BaseSelect }

// export default {
//     install: (app) => {
//         app.component("base-input", BaseInput);
//         app.component("base-table", BaseTable);
//         app.component("base-handler", BaseHandler);
//         app.component("base-modal", BaseModal);
//         app.component("base-dropdown", BaseDropdown);
//         app.component("base-toggle", BaseToggle);
//         app.component("base-select", BaseSelect);
//     }
// }

const app = createApp(App);

app.component("base-input", BaseInput);
app.component("base-table", BaseTable);
app.component("base-handler", BaseHandler);
app.component("base-modal", BaseModal);
app.component("base-dropdown", BaseDropdown);
app.component("base-toggle", BaseToggle);
app.component("base-select", BaseSelect);

app.mount('#app');