/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#E50914',      
          secondary: '#010101ff',    
          accent: '#ffffff',       
          error: '#FF5252',        
          info: '#2196F3',         
          success: '#4CAF50',      
          warning: '#FB8C00',      
        },
      },
      dark: {
        colors: {
          primary: '#E50914',      
          secondary: '#141414',    
          accent: '#ffffff',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
})
