import { ReactElement, FC, useState, useContext } from 'react'
import DesignPreview from '../../components/CartItem/DesignPreview/DesignPreview'
import IconButton from '@material-ui/core/IconButton'
import {
  makeStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles'

import { AppContext } from '../../context/AppContext'

// material-ui components
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputBase from '@material-ui/core/InputBase'

import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

// interfaces
import Shape from '../../shared/interfaces/Shape.interface'
import Color from '../../shared/interfaces/Color.interface'
import CartItemInterface from '../../shared/interfaces/CartItem.interface'

// types
import CartItemSize from '../../shared/types/CartItemSize.type'

interface CartItemProps {
  designPreviewShapes: Shape[]
  designPreviewPaletteColors: Color[]
  thisCartItemIndex: number
  initialQuantity: number
  initialSize: CartItemSize
  initialPrice: number
}

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // height: '400px',
      minWidth: 320,
      display: 'flex',
      justifyContent: 'space-between',
      // alignItems: 'center',
      padding: '15px 0 14px 10px',
      // backgroundColor: 'red',
    },
    designPreview: {
      // display: 'flex',
      // flexDirection: 'column',
      maxWidth: 150,
      // justifyContent: 'space-between',
      // margin: '0 15px 0 20px',

      flex: '1',
      // backgroundColor: 'red',
      // width: '80px',
      // height: '80px',

      // margin: '0 0 auto 7px',
    },
    midSection: {
      // backgroundColor: 'red',
      // height: '120px',
      maxWidth: 200,

      margin: '0 15px 0 10px',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },

    price: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 8,
      height: 48,
      // padding: 15,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      // display: 'block',
      // marginLeft: 14.5,
      // textAlign: 'center',
      // margin: '5px 12px 0 0',
    },
    quantityBox: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    quantityButton: {
      backgroundColor: '#eee',
      '&:hover': {
        backgroundColor: '#eee',
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: '#0000000a',
        },
      },
    },
    quantity: {
      // backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      borderRadius: 8,
      padding: 5,
      fontSize: 16,
      // fontWeight: 'bold',
      color: '#000000de',
      margin: '0 10px 0 10px',
    },
    rightSection: {
      // backgroundColor: 'red',
      // height: '100%',
      // flex: 1,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'stretch',
      justifyContent: 'space-between',
    },
    deleteButton: {
      // marginLeft: 'auto',
      display: 'block',
    },
  })
)

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    input: {
      // width: '100%',
      // margin: '10px',
      padding: '13px 13px',
      borderRadius: '8px',
      border: '1.5px solid #ccc',

      marginBottom: '5px',
      // backgroundColor: '#eaeaea',
      '&:focus': {
        borderRadius: '8px',
        backgroundColor: '#00000042',
      },
    },
  })
)(InputBase)

const CartItem: FC<CartItemProps> = ({
  designPreviewShapes,
  designPreviewPaletteColors,
  thisCartItemIndex,
  initialQuantity,
  initialSize,
  initialPrice,
}): ReactElement => {
  const classes = useStyles()
  const { setShapes } = useContext(AppContext)
  const { setPaletteColors } = useContext(AppContext)
  const { setIndexOfDesignBeingEdited } = useContext(AppContext)
  const { setAlertProps } = useContext(AppContext)
  const { setShoppingCartOpen } = useContext(AppContext)
  const { cartItems, setCartItems } = useContext(AppContext)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [size, setSize] = useState(initialSize)
  const [price, setPrice] = useState(initialPrice)

  console.log(initialQuantity)

  const handleChangeSize = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSize(event.target.value as CartItemSize)

    let newPrice = 0
    switch (event.target.value) {
      case '12 x 10 cm':
        newPrice = 12
        break
      case '24 x 20 cm':
        newPrice = 18
        break
      case '36 x 30 cm':
        newPrice = 26
        break
    }

    setPrice(newPrice)

    const newCartItems: Array<CartItemInterface> = cartItems.map(
      (cartItem, cartItemIndex) => {
        if (cartItemIndex === thisCartItemIndex) {
          return {
            ...cartItem,
            size: event.target.value as CartItemSize,
            price: newPrice,
          }
        } else {
          return cartItem
        }
      }
    )
    setCartItems(newCartItems)
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))

    // make sure it doesn't stay focused after selection
    setTimeout(() => {
      ;(document.activeElement as HTMLElement).blur()
    }, 1)
  }

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1)

    const newCartItems: Array<CartItemInterface> = cartItems.map(
      (cartItem, cartItemIndex) => {
        if (cartItemIndex === thisCartItemIndex) {
          return {
            ...cartItem,
            quantity: quantity + 1,
          }
        } else {
          return cartItem
        }
      }
    )
    setCartItems(newCartItems)
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))
  }

  const handleDecreaseQuantity = () => {
    console.log(quantity)

    if (quantity > 1) {
      setQuantity(quantity - 1)

      const newCartItems: Array<CartItemInterface> = cartItems.map(
        (cartItem, cartItemIndex) => {
          if (cartItemIndex === thisCartItemIndex) {
            return {
              ...cartItem,
              quantity: quantity - 1,
            }
          } else {
            return cartItem
          }
        }
      )
      setCartItems(newCartItems)
      localStorage.setItem('cartItems', JSON.stringify(newCartItems))
    } else {
      handleDeleteItem()
    }
  }

  const deleteItem = () => {
    const newCartItems: Array<CartItemInterface> = cartItems
      .slice(thisCartItemIndex)
      .concat(cartItems.slice(thisCartItemIndex + 1))

    setCartItems(newCartItems)
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))
  }

  const handleDeleteItem = () => {
    setAlertProps({
      title: 'Are you sure?',
      description: 'This will remove the item from the shopping cart.',
      alternative1: 'Cancel',
      alternative2: 'OK',
      alternative2Function: deleteItem,
    })
  }

  const startEditing = () => {
    setShapes([...designPreviewShapes])
    setPaletteColors([...designPreviewPaletteColors])
    setIndexOfDesignBeingEdited(thisCartItemIndex)
    localStorage.setItem('shoppingCartOpen', String(false))
    setShoppingCartOpen(false)
  }

  const handleEdit = () => {
    setAlertProps({
      title: 'Are you sure?',
      description: 'Any unsaved changes will be lost.',
      alternative1: 'Cancel',
      alternative2: 'OK',
      alternative2Function: startEditing,
    })
  }

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.designPreview}>
          <DesignPreview
            shapes={designPreviewShapes}
            paletteColors={designPreviewPaletteColors}
          />
        </Box>
        <Box className={classes.midSection}>
          <Box className={classes.quantityBox}>
            <IconButton
              aria-label="subtract"
              className={classes.quantityButton}
              onClick={handleDecreaseQuantity}
            >
              <RemoveIcon />
            </IconButton>
            <span className={classes.quantity}>{quantity}</span>
            <IconButton
              aria-label="add"
              className={classes.quantityButton}
              onClick={handleIncreaseQuantity}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <FormControl>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={size}
              onChange={handleChangeSize}
              input={<BootstrapInput />}
            >
              <MenuItem value="12 x 10 cm">12 x 10 cm</MenuItem>
              <MenuItem value="24 x 20 cm">24 x 20 cm</MenuItem>
              <MenuItem value="36 x 30 cm">36 x 30 cm</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Box>
              <span className={classes.price}>${price}</span>
            </Box>
          </Box>
        </Box>

        <Box className={classes.rightSection}>
          <IconButton
            aria-label="delete"
            className={classes.deleteButton}
            onClick={handleDeleteItem}
          >
            <CloseIcon />
          </IconButton>
          <IconButton aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}

export default CartItem
