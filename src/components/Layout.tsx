import { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Div100vh from 'react-div-100vh'
import Home from '../pages/Home'

// components
import Header from './Header'

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: 1,
      // zIndex: -1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },

    toolbar: {
      ...theme.mixins.toolbar,
    },
  })
)

// functional component
const Layout: FC = () => {
  const classes = useStyles()
  return (
    <Div100vh className={classes.root}>
      <Header />
      <div className={classes.toolbar} />
      <div className={classes.content}>
        <Home />
      </div>
    </Div100vh>
  )
}

export default Layout
