import { FC, ReactElement, useContext } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import CartItem from './CartItem/CartItem'
import { AppContext } from '../context/AppContext'

import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      backgroundColor: '#ddd',
      width: '100%',
      // height: '100%',
      // flex: 1,
    },
    backButton: {
      backgroundColor: '#ccc',
    },
    cartItems: {
      flex: '1',
      overflowY: 'auto',
    },
    totalPrice: {
      color: 'white',
    },
    bottomSection: {
      backgroundColor: '#3f51b5',
      // width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px 0 10px 0',
    },
    toolbar: {
      ...theme.mixins.toolbar,
    },
  })
)

const ShoppingCart: FC<{}> = (): ReactElement => {
  const classes = useStyles()

  const { cartItems } = useContext(AppContext)
  const { setShoppingCartOpen } = useContext(AppContext)
  const { setAlertProps } = useContext(AppContext)

  const handleCloseShoppingCart = () => {
    localStorage.setItem('shoppingCartOpen', String(false))
    setShoppingCartOpen(false)
  }

  const handleCheckOut = () => {
    setAlertProps({
      title: 'Not implemented',
      description: `This app is just for demonstration purposes and therefore it's not possible to purchase anything.`,
      alternative1: 'Ok',
    })
  }

  let totalPrice = 0
  let cartItemsToRender = cartItems.map((cartItem, cartItemIndex) => {
    totalPrice += cartItem.price * cartItem.quantity
    return (
      <div key={cartItemIndex}>
        <CartItem
          key={cartItemIndex}
          thisCartItemIndex={cartItemIndex}
          designPreviewShapes={cartItem.shapes}
          designPreviewPaletteColors={cartItem.paletteColors}
          initialQuantity={cartItem.quantity}
          initialSize={cartItem.size}
          initialPrice={cartItem.price}
        />
        <Divider variant="middle" />
      </div>
    )
  })

  return (
    <Box className={classes.root}>
      <div className={classes.toolbar} />
      <Button onClick={handleCloseShoppingCart} className={classes.backButton}>
        {' '}
        → Back to editor
      </Button>
      <Box className={classes.cartItems}>
        <Box>{cartItemsToRender}</Box>
      </Box>
      <Box className={classes.bottomSection}>
        <Typography variant="h6" className={classes.totalPrice}>
          Total amount: ${totalPrice}
        </Typography>
        <Box marginTop="10px" marginBottom="5px">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCheckOut}
          >
            Check Out
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
export default ShoppingCart
