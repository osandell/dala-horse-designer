import { ReactElement, FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

// interfaces
import Color from '../../../shared/interfaces/Color.interface'

// define css-in-js
const useStyles = makeStyles<Theme, ColorPickerProps>((theme: Theme) =>
  createStyles({
    paletteColor: (props) => ({
      marginRight: 10,
      minWidth: 54,
      height: 54,
      borderRadius: 27,
      borderStyle: 'solid',
      borderWidth: 2,
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `
                     hsl(${props.initialColor.h}, 
                         ${props.initialColor.s}%, 
                         ${props.initialColor.l}% )
                     `,
      borderColor: `
                     hsl(${props.initialColor.h}, 
                         ${props.initialColor.s}%, 
                         ${
                           props.initialColor.l > 90
                             ? props.initialColor.l - 20
                             : props.initialColor.l - 5
                         }% )
                     `,
    }),
    outerCircle: (props) => ({
      display: 'block',
      width: 50,
      height: 50,
      borderRadius: 25,
      borderStyle: 'solid',
      borderWidth: 5.5,
      boxSizing: 'border-box',
      backgroundColor: `
                hsl(${props.initialColor.h}, 
                    ${props.initialColor.s}%, 
                    ${props.initialColor.l}% )
                `,
      borderColor:
        props.initialColor.l > 90
          ? `
                     hsl(${props.initialColor.h}, 
                         ${props.initialColor.s}%, 
                         ${props.initialColor.l - 20}% )
                         `
          : '#faf6f6',
    }),
  })
)

interface ColorPickerProps {
  id: number
  active: boolean
  initialColor: Color
  handlePickClick: (id: number, initialColor: Color) => void
}

const ColorPicker: FC<ColorPickerProps> = (props): ReactElement => {
  const classes = useStyles(props)

  return (
    <div
      onClick={() => props.handlePickClick(props.id, props.initialColor)}
      className={classes.paletteColor}
    >
      {props.active && <span className={classes.outerCircle}></span>}
    </div>
  )
}

export default ColorPicker
