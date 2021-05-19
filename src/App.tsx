// https://www.welcomedeveloper.com/react-typescript-material-design

import {
  unstable_createMuiStrictModeTheme as createMuiTheme, //temporary workourand for warning
  Theme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { CssBaseline } from '@material-ui/core'

// components
import Layout from './components/Layout'

// constants
import { APP_TITLE } from './shared/constants'

// app context
import AppContextProvider from './context/AppContext'

function App() {
  // define custom theme
  let theme: Theme = createMuiTheme()
  theme = responsiveFontSizes(theme)

  return (
    <HelmetProvider>
      <CssBaseline />

      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <Layout />
        </ThemeProvider>
      </AppContextProvider>
    </HelmetProvider>
  )
}

export default App
