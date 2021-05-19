import { ReactElement, FC, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import Box from '@material-ui/core/Box'

import { AppContext } from '../context/AppContext'

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selected: {
      color: 'white',
    },
  })
)

const Navigation: FC<any> = (): ReactElement => {
  const classes = useStyles()

  const { shoppingCartOpen, setShoppingCartOpen } = useContext(AppContext)

  const handleOpenShoppingCart = () => {
    localStorage.setItem('shoppingCartOpen', String(!shoppingCartOpen))
    setShoppingCartOpen(!shoppingCartOpen)
  }

  return (
    <Box>
      <Tooltip title={'Shopping Cart'} placement="right">
        <IconButton
          onClick={handleOpenShoppingCart}
          className={clsx({ [classes.selected]: shoppingCartOpen })}
        >
          <ShoppingCartIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Navigation
