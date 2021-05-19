import { ReactElement, FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar } from '@material-ui/core'
import logo from '../assets/svg/logo.svg'
import Navigation from './Navigation'

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: 2000,
    },
  })
)

const Header: FC = (): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar color="primary">
        <Toolbar
          style={{
            minWidth: 320,
            justifyContent: 'space-between',
          }}
        >
          <img
            style={{ height: 40, marginRight: 17 }}
            alt="logo"
            src={logo}
          ></img>
          <Navigation />
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
