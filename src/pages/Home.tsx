import { FC, ReactElement, useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import Div100vh from 'react-div-100vh'

import RedoIcon from '@material-ui/icons/Redo'
import UndoIcon from '@material-ui/icons/Undo'
import ClearAllIcon from '@material-ui/icons/ClearAll'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import ColorizeIcon from '@material-ui/icons/Colorize'
import SaveIcon from '@material-ui/icons/Save'

import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Backdrop from '@material-ui/core/Backdrop'

import Canvas from '../components/Canvas'
import HSLColorPicker from '../components/HSLColorPicker/HSLColorPicker'
import Palette from '../components/Palette/Palette'
import { AppContext } from '../context/AppContext'
import AlertDialog from '../components/UI/AlertDialog'
import ShoppingCart from '../components/ShoppingCart'

import ColorizationStep from '../shared/interfaces/ColorizationStep'
import ColorModificationStep from '../shared/interfaces/ColorModificationStep.interface'

// constants
import { APP_TITLE, PAGE_TITLE_HOME } from '../shared/constants'

// interfaces
import Shape from '../shared/interfaces/Shape.interface'
import Color from '../shared/interfaces/Color.interface'
import CartItem from '../shared/interfaces/CartItem.interface'

// types
import CartItemSize from '../shared/types/CartItemSize.type'

// interfaces
interface ThemeProps {
  shoppingCartTranslateX: number
}

// define css-in-js
const useStyles = makeStyles<Theme, ThemeProps>((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
        flexDirection: 'row',
      },
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#eee',
      width: '100vw',
      overflow: 'hidden',
    },
    controls: {
      overflow: 'auto',
      // height: '100%',
      maxWidth: '1280px',
      padding: '15px 10px',
      [`${theme.breakpoints.up('md')}`]: {
        display: 'flex',
      },
      [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
        width: '50%',
      },
      // [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      //   width: '40%',
      // },
    },
    colorPickerSmallScreen: {
      // [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      //   width: '40%',
      // },
      [`${theme.breakpoints.up('md')}`]: {
        display: 'none',
      },
    },
    colorPickerLargeScreen: {
      width: '100%',
      marginLeft: 20,
    },
    leftSide: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      maxHeight: '260px',
    },
    rightSide: {
      width: '100%',
      marginLeft: 20,
      display: 'none',
      [`${theme.breakpoints.up('md')}`]: {
        display: 'flex',
      },
    },
    shoppingCartPanel: {
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'space-between',
      // zIndex: 1,
      // height: '100%',
      position: 'fixed',
      right: 0,
      top: 0,
      width: '100vw',
      maxWidth: 400,
      zIndex: 1300,
      transform: (props) => `translateX(${props.shoppingCartTranslateX}%)`,
      transition: '.3s ease-out',
    },
    toolbar: {
      ...theme.mixins.toolbar,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    rightDivider: {
      display: 'none',
      marginLeft: '20px',
      [`${theme.breakpoints.up('lg')}`]: {
        display: 'block',
      },
    },
  })
)

const Home: FC<{}> = (): ReactElement => {
  const [eyeDropperActive, setEyeDropperActive] = useState<boolean>(false)
  const [previousActiveColorId, setPreviousActiveColorId] = useState<
    number | null
  >(null)

  // const [alertConfirmFunction, setAlertConfirmFunction] = useState<
  //   (() => void) | null
  // >(null)

  const { alertProps, setAlertProps } = useContext(AppContext)
  const { shoppingCartOpen, setShoppingCartOpen } = useContext(AppContext)
  const { activeColorId, setActiveColorId } = useContext(AppContext)
  const { undoSteps, setUndoSteps } = useContext(AppContext)
  const { redoSteps, setRedoSteps } = useContext(AppContext)
  const { shapes, setShapes } = useContext(AppContext)
  const { paletteColors, setPaletteColors } = useContext(AppContext)
  const { cartItems, setCartItems } = useContext(AppContext)
  const { indexOfDesignBeingEdited, setIndexOfDesignBeingEdited } =
    useContext(AppContext)

  const classes = useStyles({
    shoppingCartTranslateX: shoppingCartOpen ? 0 : 100,
  })

  useEffect(() => {
    // retrieve data from local storage
    const prevShoppingCartOpen = localStorage.getItem('shoppingCartOpen')
    if (prevShoppingCartOpen !== null) {
      setShoppingCartOpen(prevShoppingCartOpen === 'true')
    }

    const prevCartItemsJson = localStorage.getItem('cartItems')
    if (prevCartItemsJson !== null) {
      const prevCartItems = JSON.parse(prevCartItemsJson)
      setCartItems(prevCartItems)
    }

    return () => {
      // if user activtates the eyedropper and leaves this component and comes back, then we need to
      // make sure the color id is not null
      setActiveColorId((prevActiveColorId: number | null) =>
        prevActiveColorId === null ? 0 : prevActiveColorId
      )
    }
  }, [setShoppingCartOpen, setCartItems, setActiveColorId])

  const handlePickClick = (id: number) => {
    setActiveColorId(id)
  }

  const isColorizationStep = (
    toBeDetermined: ColorizationStep | ColorModificationStep
  ): toBeDetermined is ColorizationStep => {
    return 'shapeId' in toBeDetermined
  }

  const handleUndo = () => {
    if (undoSteps.length < 1) return

    const previousStep: ColorizationStep | ColorModificationStep =
      undoSteps[undoSteps.length - 1]

    let newRedoSteps = [...redoSteps]
    if (isColorizationStep(previousStep)) {
      for (const shape of shapes) {
        previousStep.shapeId === shape.shapeId &&
          newRedoSteps.push({
            shapeId: previousStep.shapeId,
            colorId: shape.colorId,
          })
      }

      setShapes(
        shapes.map((oldShape: Shape) => {
          if (previousStep.shapeId === oldShape.shapeId) {
            return { ...oldShape, colorId: previousStep.colorId }
          } else {
            return oldShape
          }
        })
      )
    } else {
      // it's a ColorModificationStep

      newRedoSteps.push({
        colorId: previousStep.colorId,
        color: paletteColors[previousStep.colorId],
      })

      let newPaletteColors = [...paletteColors]
      newPaletteColors.splice(previousStep.colorId, 1, previousStep.color)
      setPaletteColors(newPaletteColors)
    }

    setRedoSteps(newRedoSteps)

    let newUndoSteps = [...undoSteps]
    newUndoSteps.splice(-1, 1)
    setUndoSteps(newUndoSteps)
  }

  const handleRedo = () => {
    if (redoSteps.length < 1) return

    const nextStep = redoSteps[redoSteps.length - 1]

    let newUndoSteps = [...undoSteps]
    if (isColorizationStep(nextStep)) {
      for (const shape of shapes) {
        nextStep.shapeId === shape.shapeId &&
          newUndoSteps.push({
            shapeId: nextStep.shapeId,
            colorId: shape.colorId,
          })
      }

      setShapes(
        shapes.map((oldShape: Shape) => {
          if (nextStep.shapeId === oldShape.shapeId) {
            return { ...oldShape, colorId: nextStep.colorId }
          } else {
            return oldShape
          }
        })
      )
    } else {
      // it's a ColorModificationStep

      newUndoSteps.push({
        colorId: nextStep.colorId,
        color: paletteColors[nextStep.colorId],
      })

      let newPaletteColors = [...paletteColors]
      newPaletteColors.splice(nextStep.colorId, 1, nextStep.color)
      setPaletteColors(newPaletteColors)
    }
    setUndoSteps(newUndoSteps)

    let newRedoSteps = [...redoSteps]
    newRedoSteps.splice(-1, 1)
    setRedoSteps(newRedoSteps)
  }

  const clearCanvas = () => {
    setShapes(
      shapes.map((oldShape: Shape) => {
        return { ...oldShape, colorId: null }
      })
    )
    setUndoSteps([])
    setRedoSteps([])
    setPaletteColors([
      { h: 240, s: 100, l: 50 },
      { h: 120, s: 100, l: 50 },
      { h: 60, s: 100, l: 50 },
      { h: 0, s: 100, l: 50 },
      { h: 0, s: 0, l: 0 },
      { h: 0, s: 0, l: 100 },
      { h: 300, s: 100, l: 50 },
      { h: 32, s: 100, l: 50 },
    ])
  }

  const handleClearCanvas = () => {
    setAlertProps({
      title: 'Are you sure?',
      description:
        'This will clear the canvas and reset the colors to default.',
      alternative1: 'Cancel',
      alternative2: 'OK',
      alternative2Function: clearCanvas,
    })
  }

  // previousActiveColorId is used to store the last active color id while the eye dropper tool is active
  // in order to be able to retrieve it if user decides not to pick a color
  const handleClickEyeDropperIcon = () => {
    setEyeDropperActive((prevEyeDropperActive) => {
      if (prevEyeDropperActive) {
        setActiveColorId(previousActiveColorId)
        return false
      } else {
        setPreviousActiveColorId(activeColorId)
        setActiveColorId(null)
        return true
      }
    })
  }

  const handleClickWithEyedropper = (shapeId: number) => {
    for (const shape of shapes) {
      if (shape.shapeId === shapeId) {
        setActiveColorId(shape.colorId)
      }
    }

    setEyeDropperActive(false)
  }

  const handleColorChange = (color: Color) => {
    if (activeColorId !== null) {
      if (undoSteps.length > 0) {
        const previousStep = undoSteps[undoSteps.length - 1]

        if (isColorizationStep(previousStep)) {
          let newUndoSteps = [...undoSteps]

          newUndoSteps.push({
            colorId: activeColorId,
            color: paletteColors[activeColorId],
          })

          setUndoSteps(newUndoSteps)
        } else {
          // it's a ColorModificationStep

          if (previousStep.colorId !== activeColorId) {
            let newUndoSteps = [...undoSteps]

            newUndoSteps.push({
              colorId: activeColorId,
              color: paletteColors[activeColorId],
            })

            setUndoSteps(newUndoSteps)
          }
        }
      } else {
        let newUndoSteps = [...undoSteps]

        newUndoSteps.push({
          colorId: activeColorId,
          color: paletteColors[activeColorId],
        })

        setUndoSteps(newUndoSteps)
      }

      setRedoSteps([])

      let newPaletteColors = [...paletteColors]
      newPaletteColors.splice(activeColorId, 1, color)
      setPaletteColors(newPaletteColors)
    }
  }

  const addToCart = () => {
    const newCartItems = [
      ...cartItems,
      {
        paletteColors: paletteColors,
        shapes: shapes,
        quantity: 1,
        size: '24 x 20 cm' as CartItemSize,
        price: 18,
      },
    ]
    setCartItems(newCartItems)
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))
  }

  const handleAddToShoppingCart = () => {
    let designCompleted = true
    for (const shape of shapes) {
      if (shape.colorId === null) {
        designCompleted = false
      }
    }

    if (designCompleted) {
      setAlertProps({
        title: 'Added to cart',

        alternative1: 'Create new',
        alternative1Function: () => {
          clearCanvas()
          addToCart()
        },
        alternative2: 'Open cart',
        alternative2Function: () => {
          clearCanvas()
          addToCart()
          localStorage.setItem('shoppingCartOpen', String(true))
          setShoppingCartOpen(true)
        },
      })
    } else {
      setAlertProps({
        title: 'Design not complete',
        description:
          'Please color all the fields before adding it to the cart.',
        alternative1: 'Ok',
      })
    }
  }

  const save = () => {
    const newCartItems: Array<CartItem> = cartItems.map(
      (cartItem, cartItemIndex) => {
        if (cartItemIndex === indexOfDesignBeingEdited) {
          return {
            ...cartItem,
            paletteColors: paletteColors,
            shapes: shapes,
          }
        } else {
          return cartItem
        }
      }
    )

    setCartItems(newCartItems)
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))
  }

  const handleSave = () => {
    setAlertProps({
      title: 'Saved',

      alternative1: 'Create new',
      alternative1Function: () => {
        clearCanvas()
        save()
        setIndexOfDesignBeingEdited(-1)
      },
      alternative2: 'Open cart',
      alternative2Function: () => {
        clearCanvas()
        save()
        localStorage.setItem('shoppingCartOpen', String(true))
        setShoppingCartOpen(true)
        setIndexOfDesignBeingEdited(-1)
      },
    })
  }

  const handleCloseShoppingCart = () => {
    setShoppingCartOpen(false)
    localStorage.setItem('shoppingCartOpen', String(false))
  }

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_HOME} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        {alertProps !== null && (
          <AlertDialog content={alertProps} setContent={setAlertProps} />
        )}
        {shoppingCartOpen && (
          <Backdrop
            className={classes.backdrop}
            open={true}
            onClick={handleCloseShoppingCart}
          ></Backdrop>
        )}
        <Div100vh className={classes.shoppingCartPanel}>
          <Paper
            onClick={(e) => e.stopPropagation()}
            style={{ height: '100%' }}
          >
            <ShoppingCart />
          </Paper>
        </Div100vh>
        <Canvas
          eyeDropperActive={eyeDropperActive}
          handleClickWithEyedropper={handleClickWithEyedropper}
        />
        <Box className={classes.controls}>
          <Box className={classes.leftSide}>
            <Box display="flex" justifyContent="space-between">
              <IconButton aria-label="undo" onClick={handleUndo}>
                <UndoIcon />
              </IconButton>
              <IconButton aria-label="redo" onClick={handleRedo}>
                <RedoIcon />
              </IconButton>
              <IconButton
                aria-label="eydrop"
                onClick={handleClickEyeDropperIcon}
                style={eyeDropperActive ? { color: '#3f51b5' } : {}}
              >
                <ColorizeIcon />
              </IconButton>
              <IconButton aria-label="clearCanvas" onClick={handleClearCanvas}>
                <ClearAllIcon />
              </IconButton>
              {indexOfDesignBeingEdited !== -1 ? (
                <IconButton aria-label="addToShoppingCart" onClick={handleSave}>
                  <SaveIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="addToShoppingCart"
                  onClick={handleAddToShoppingCart}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              )}
            </Box>
            <Box className={classes.colorPickerSmallScreen}>
              <HSLColorPicker
                disabled={eyeDropperActive ? true : false}
                color={
                  activeColorId !== null ? paletteColors[activeColorId] : null
                }
                handleChange={handleColorChange}
              />
            </Box>
            <Palette
              paletteColors={paletteColors}
              activeColorId={activeColorId}
              handlePickClick={handlePickClick}
            />
          </Box>
          <Box className={classes.rightSide}>
            <Divider orientation="vertical" />
            <Box className={classes.colorPickerLargeScreen}>
              <HSLColorPicker
                disabled={eyeDropperActive ? true : false}
                color={
                  activeColorId !== null ? paletteColors[activeColorId] : null
                }
                handleChange={handleColorChange}
              />
            </Box>
          </Box>
          <Divider orientation="vertical" className={classes.rightDivider} />
        </Box>
      </div>
    </>
  )
}

export default Home
