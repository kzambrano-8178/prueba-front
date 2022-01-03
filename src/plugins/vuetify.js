import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import i18n from '@/i18n'
import '@/sass/overrides.sass'

Vue.use(Vuetify)

const theme = {
  primary: '#00d1b2',
  secondary: '#9C27b0',
  error: '#FF5252',
  accent: '#82B1FF',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
  card: '#e4e4e4',
  cards: '#FAFAFA',
  error2: '#F6CECE',
}

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  theme: {
    themes: {
      light: theme,
    },
  },
})
