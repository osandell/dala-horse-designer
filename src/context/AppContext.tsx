import {
  ReactElement,
  FC,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import ColorizationStep from '../shared/interfaces/ColorizationStep'
import ColorModificationStep from '../shared/interfaces/ColorModificationStep.interface'
import Color from '../shared/interfaces/Color.interface'
import Shape from '../shared/interfaces/Shape.interface'
import CartItem from '../shared/interfaces/CartItem.interface'
import AlertProps from '../shared/interfaces/AlertProps.interface'

export interface AppContextProps {
  shoppingCartOpen: boolean
  setShoppingCartOpen: Dispatch<SetStateAction<boolean>>
  activeColorId: number | null
  setActiveColorId: Dispatch<SetStateAction<number | null>>
  undoSteps: (ColorizationStep | ColorModificationStep)[]
  setUndoSteps: Dispatch<
    SetStateAction<(ColorizationStep | ColorModificationStep)[]>
  >
  redoSteps: (ColorizationStep | ColorModificationStep)[]
  setRedoSteps: Dispatch<
    SetStateAction<(ColorizationStep | ColorModificationStep)[]>
  >
  shapes: Shape[]
  setShapes: Dispatch<SetStateAction<Shape[]>>
  paletteColors: Color[]
  setPaletteColors: Dispatch<SetStateAction<Color[]>>
  cartItems: CartItem[]
  setCartItems: Dispatch<SetStateAction<CartItem[]>>
  indexOfDesignBeingEdited: number
  setIndexOfDesignBeingEdited: Dispatch<SetStateAction<number>>
  alertProps: AlertProps | null
  setAlertProps: Dispatch<SetStateAction<AlertProps | null>>
}

let initialShapes: Shape[] = []
for (let i = 0; i < 18; i++) {
  initialShapes.push({
    shapeId: i,
    colorId: null,
  })
}

const appContextInitial: AppContextProps = {
  shoppingCartOpen: false,
  setShoppingCartOpen: (open) => null,
  activeColorId: 0,
  setActiveColorId: (colorId) => null,
  undoSteps: [],
  setUndoSteps: (undoSteps) => null,
  redoSteps: [],
  setRedoSteps: (redoSteps) => null,
  shapes: initialShapes,
  setShapes: (shapes) => null,
  paletteColors: [
    { h: 240, s: 100, l: 50 },
    { h: 120, s: 100, l: 50 },
    { h: 60, s: 100, l: 50 },
    { h: 0, s: 100, l: 50 },
    { h: 0, s: 0, l: 0 },
    { h: 0, s: 0, l: 100 },
    { h: 300, s: 100, l: 50 },
    { h: 32, s: 100, l: 50 },
  ],
  setPaletteColors: (colors) => null,
  cartItems: [
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 0 },
    //     { shapeId: 1, colorId: 0 },
    //     { shapeId: 2, colorId: 0 },
    //     { shapeId: 3, colorId: 0 },
    //     { shapeId: 4, colorId: 0 },
    //     { shapeId: 5, colorId: 0 },
    //     { shapeId: 6, colorId: 0 },
    //     { shapeId: 7, colorId: 1 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    //   quantity: 1,
    //   size: '12 x 10 cm' as CartItemSize,
    //   price: 12,
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
    // {
    //   paletteColors: [
    //     { h: 240, s: 100, l: 50 },
    //     { h: 120, s: 100, l: 50 },
    //     { h: 60, s: 100, l: 50 },
    //     { h: 0, s: 100, l: 50 },
    //     { h: 0, s: 0, l: 0 },
    //     { h: 0, s: 0, l: 100 },
    //     { h: 300, s: 100, l: 50 },
    //     { h: 32, s: 100, l: 50 },
    //   ],
    //   shapes: [
    //     { shapeId: 0, colorId: 5 },
    //     { shapeId: 1, colorId: 4 },
    //     { shapeId: 2, colorId: 3 },
    //     { shapeId: 3, colorId: 2 },
    //     { shapeId: 4, colorId: 1 },
    //     { shapeId: 5, colorId: 1 },
    //     { shapeId: 6, colorId: 1 },
    //     { shapeId: 7, colorId: 5 },
    //     { shapeId: 8, colorId: 2 },
    //     { shapeId: 9, colorId: 3 },
    //     { shapeId: 10, colorId: 4 },
    //     { shapeId: 11, colorId: 0 },
    //     { shapeId: 12, colorId: 0 },
    //     { shapeId: 13, colorId: 0 },
    //     { shapeId: 14, colorId: 0 },
    //     { shapeId: 15, colorId: 0 },
    //     { shapeId: 16, colorId: 0 },
    //     { shapeId: 17, colorId: 0 },
    //   ],
    // },
  ],
  setCartItems: (cartItems) => null,
  indexOfDesignBeingEdited: -1,
  setIndexOfDesignBeingEdited: (indexOfDesignBeingEdited) => null,
  alertProps: null,
  setAlertProps: (AlertProps) => null,
}

export const AppContext = createContext<AppContextProps>(appContextInitial)

const AppContextProvider: FC<{ children: React.ReactNode }> = (
  props
): ReactElement => {
  const [shoppingCartOpen, setShoppingCartOpen] = useState<boolean>(
    appContextInitial.shoppingCartOpen
  )

  const [activeColorId, setActiveColorId] = useState<number | null>(
    appContextInitial.activeColorId
  )
  const [undoSteps, setUndoSteps] = useState<
    (ColorizationStep | ColorModificationStep)[]
  >(appContextInitial.undoSteps)
  const [redoSteps, setRedoSteps] = useState<
    (ColorizationStep | ColorModificationStep)[]
  >(appContextInitial.redoSteps)
  const [shapes, setShapes] = useState<Shape[]>(appContextInitial.shapes)
  const [paletteColors, setPaletteColors] = useState<Color[]>(
    appContextInitial.paletteColors
  )
  const [cartItems, setCartItems] = useState<CartItem[]>(
    appContextInitial.cartItems
  )
  const [
    indexOfDesignBeingEdited,
    setIndexOfDesignBeingEdited,
  ] = useState<number>(appContextInitial.indexOfDesignBeingEdited)

  const [alertProps, setAlertProps] = useState<AlertProps | null>(null)

  return (
    <AppContext.Provider
      value={{
        shoppingCartOpen,
        setShoppingCartOpen,
        activeColorId,
        setActiveColorId,
        undoSteps,
        setUndoSteps,
        redoSteps,
        setRedoSteps,
        shapes,
        setShapes,
        paletteColors,
        setPaletteColors,
        cartItems,
        setCartItems,
        indexOfDesignBeingEdited,
        setIndexOfDesignBeingEdited,
        alertProps,
        setAlertProps,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
