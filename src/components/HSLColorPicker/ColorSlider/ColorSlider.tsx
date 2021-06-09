import { ReactElement, FC, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// interfaces
interface ColorSliderProps {
  sliderPos: number
  label: string
  handleChange:
    | ((event: ChangeEvent<{}>, val: number | number[]) => void)
    | null
  background: string
  thumbColor: string
}

const useStyles = makeStyles<null, ColorSliderProps>({
  root: {
    height: '1em',
    padding: '0px',
    margin: '10px 0',
    '& .MuiSlider-thumb.Mui-focusVisible': {
      boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.75)',
    },
    '& .MuiSlider-thumb.MuiSlider-active': {
      width: '1.8em',
      height: '1.8em',
      marginLeft: '-0.9em',
      borderRadius: '0.9em',
      top: '-0.4em',
      boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.75)',
    },
  },
  rail: {
    background: (props) => props.background,
    borderRadius: '0.5em',

    height: '100%',
    top: '0',
    opacity: '1',
  },
  track: {
    background: 'transparent',
    height: '10px',
  },
  thumb: {
    color: (props) => props.thumbColor,
    borderRadius: '0.8em',
    top: '-0.3em',
    width: '1.6em',
    height: '1.6em',
    marginLeft: '-0.8em',
    marginTop: '0',
    border: '0.4em solid #faf6f6',
    boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.75)',
    '&:hover': {
      width: '1.8em',
      height: '1.8em',
      marginLeft: '-0.9em',
      borderRadius: '0.9em',
      top: '-0.4em',
      boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.75)',
    },
  },
})

const ColorSlider: FC<ColorSliderProps> = (props): ReactElement => {
  const classes = useStyles(props)

  let onChange = undefined
  if (props.handleChange !== null) {
    let test = props.handleChange
    onChange = (event: ChangeEvent<{}>, value: number | number[]) =>
      test(event, value)
  }

  return (
    <Box display="flex" alignItems="center">
      <Typography display="block" variant="caption" style={{ width: '100px' }}>
        {props.label}
      </Typography>
      <Slider
        classes={{
          root: classes.root,
          rail: classes.rail,
          track: classes.track,
          thumb: classes.thumb,
        }}
        value={props.sliderPos}
        onChange={onChange}
      />
    </Box>
  )
}

export default ColorSlider
