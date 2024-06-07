// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as directives from 'vuetify/directives';
import { VTreeview } from 'vuetify/labs/VTreeview'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  components: {
    VTreeview,
  },
  directives
});