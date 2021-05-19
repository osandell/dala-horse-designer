import { ReactElement, FC } from 'react'
import { Box } from '@material-ui/core'

import PaletteColor from './PaletteColor/PaletteColor'

// interfaces
import Color from '../../shared/interfaces/Color.interface'

interface PaletteProps {
  paletteColors: Color[]
  activeColorId: number | null
  handlePickClick: (id: number) => void
}

const Palette: FC<PaletteProps> = (props): ReactElement => {
  let PaletteColors = []

  for (let i = 0; i < props.paletteColors.length; i++) {
    PaletteColors.push(
      <PaletteColor
        key={i}
        id={i}
        active={props.activeColorId === i}
        handlePickClick={(id: number, color: Color) =>
          props.handlePickClick(id)
        }
        initialColor={props.paletteColors[i]}
      />
    )
  }

  return (
    <Box
      display="flex"
      overflow="auto"
      marginTop="10px"
      paddingBottom="5px"
      justifyContent="space-between"
    >
      {PaletteColors}
    </Box>
  )
}

export default Palette
