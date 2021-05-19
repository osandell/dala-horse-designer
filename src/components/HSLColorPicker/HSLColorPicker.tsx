import { ReactElement, FC, ChangeEvent } from "react"
import ColorSlider from "./ColorSlider/ColorSlider"
import Box from "@material-ui/core/Box"

// interfaces
import Color from "../../shared/interfaces/Color.interface"

interface ConfigProp {
  label: string
  thumbColor: string
  sliderPos: number
  background: string
  changeHandler:
    | ((event: ChangeEvent<{}>, val: number | number[]) => void)
    | null
}

interface Config {
  hue: ConfigProp
  saturation: ConfigProp
  lightness: ConfigProp
}

interface HSLColorPickerProps {
  disabled: true | false
  color: Color | null
  handleChange: (color: Color) => void
}

const HSLColorPicker: FC<HSLColorPickerProps> = (props): ReactElement => {
  let config: Config
  if (props.color === null) {
    config = {
      hue: {
        label: "Hue:",
        thumbColor: `#888`,
        sliderPos: 0,
        background: "linear-gradient(to right, #888, #888)",
        changeHandler: null,
      },
      saturation: {
        label: "Saturation:",
        thumbColor: `#888`,
        sliderPos: 0,
        background: "linear-gradient(to right, #888, #888)",
        changeHandler: null,
      },
      lightness: {
        label: "Lightness:",
        thumbColor: `#888`,
        sliderPos: 0,
        background: "linear-gradient(to right, #888, #888)",
        changeHandler: null,
      },
    }
  } else {
    const handleHueChange = (
      event: ChangeEvent<{}>,
      value: number | number[]
    ) => {
      if (typeof value === "number" && props.color !== null) {
        let hue = (value / 100) * 360
        props.handleChange({ h: hue, s: props.color.s, l: props.color.l })
      }
    }

    const handleSaturationChange = (
      event: ChangeEvent<{}>,
      value: number | number[]
    ) => {
      if (typeof value === "number" && props.color !== null) {
        let saturation = value
        props.handleChange({
          h: props.color.h,
          s: saturation,
          l: props.color.l,
        })
      }
    }

    const handleLightnessChange = (
      event: ChangeEvent<{}>,
      value: number | number[]
    ) => {
      if (typeof value === "number" && props.color !== null) {
        let lightness = value
        props.handleChange({ h: props.color.h, s: props.color.s, l: lightness })
      }
    }

    config = {
      hue: {
        label: "Hue:",
        thumbColor: `hsl(${props.color.h}, 100%, 50%)`,
        sliderPos: (props.color.h / 360) * 100,
        background:
          "linear-gradient(to right,  rgb(255,0,0), rgb(255,255,0), rgb(0,255,0),rgb(0,255,255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))",
        changeHandler: handleHueChange,
      },
      saturation: {
        label: "Saturation:",
        thumbColor: `hsl(${props.color.h}, ${props.color.s}%, 50%)`,
        sliderPos: props.color.s,
        background: `linear-gradient(to right,  hsl(${props.color.h}, 0%, 50%), hsl(${props.color.h}, 100%, 50%))`,
        changeHandler: handleSaturationChange,
      },
      lightness: {
        label: "Lightness:",
        thumbColor: `hsl(${props.color.h}, 100%, ${props.color.l}%)`,
        sliderPos: props.color.l,
        background: `linear-gradient(to right,  hsl(${props.color.h}, 100%, 0%), hsl(${props.color.h}, 100%, 50%), hsl(${props.color.h}, 100%, 100%))`,
        changeHandler: handleLightnessChange,
      },
    }
  }

  let sliders = []
  // we need to make the type of key more specific than the default 'string'
  let key: keyof typeof config
  for (key in config) {
    sliders.push(
      <ColorSlider
        key={key}
        label={config[key].label}
        thumbColor={config[key].thumbColor}
        background={config[key].background}
        sliderPos={config[key].sliderPos}
        handleChange={config[key].changeHandler}
      />
    )
  }

  return (
    <Box display="flex" flexDirection="column" padding="0 1em 0 0">
      {sliders}
    </Box>
  )
}

export default HSLColorPicker
