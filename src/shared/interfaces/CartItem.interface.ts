import Color from './Color.interface'
import Shape from './Shape.interface'
import CartItemSize from '../types/CartItemSize.type'

interface CartItem {
  paletteColors: Array<Color>
  shapes: Array<Shape>
  quantity: number
  size: CartItemSize
  price: number
}

export default CartItem
