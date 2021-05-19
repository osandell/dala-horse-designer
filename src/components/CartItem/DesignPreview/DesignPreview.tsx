import { ReactElement, FC, useState, useEffect } from 'react'
import { Stage, Layer, Shape as KonvaShape } from 'react-konva'
import paths from '../../../assets/paths/paths'

// interfaces
import Shape from '../../../shared/interfaces/Shape.interface'
import Color from '../../../shared/interfaces/Color.interface'

interface DesignPreviewProps {
  shapes: Shape[]
  paletteColors: Color[]
}

const INITIAL_CANVAS_WIDTH = 800
const INITIAL_CANVAS_HEIGHT = 800
const INITIAL_CANVAS_OFFSET_X = -145
const INITIAL_CANVAS_OFFSET_Y = -140
const INITIAL_CANVAS_SCALE = 1.4

const DesignPreview: FC<DesignPreviewProps> = (props): ReactElement => {
  const [stageScale, setStageScale] = useState(INITIAL_CANVAS_SCALE)
  const [stageX, setStageX] = useState(INITIAL_CANVAS_OFFSET_X)
  const [stageY, setStageY] = useState(INITIAL_CANVAS_OFFSET_Y)
  const [stageWidth, setStageWidth] = useState(INITIAL_CANVAS_WIDTH)
  const [stageHeight, setStageHeight] = useState(INITIAL_CANVAS_HEIGHT)
  const [isResized, setIsResized] = useState(false)

  useEffect(() => {
    const fitStageIntoStageParent = () => {
      let stageParent = document.querySelector<HTMLElement>(
        '#preview-stage-parent'
      )

      if (stageParent !== null) {
        let stageParentWidth = stageParent.offsetWidth
        let stageParentHeight = stageParent.offsetWidth
        // let stageParentHeight = stageParent.offsetHeight
        let xOffset = 0
        let yOffset = 0

        let newScale
        if (stageParentHeight > stageParentWidth) {
          newScale = stageParentWidth / INITIAL_CANVAS_WIDTH
          yOffset = (stageParentHeight - stageParentWidth) / 2
        } else {
          newScale = stageParentHeight / INITIAL_CANVAS_HEIGHT
          xOffset = (stageParentWidth - stageParentHeight) / 2
        }

        setStageWidth(stageParentWidth)
        setStageHeight(stageParentHeight)

        setStageScale(newScale * INITIAL_CANVAS_SCALE)
        setStageX(newScale * INITIAL_CANVAS_OFFSET_X + xOffset)
        setStageY(newScale * INITIAL_CANVAS_OFFSET_Y + yOffset)

        setIsResized(true)
      }
    }

    fitStageIntoStageParent()

    // adapt the stage on window resize
    window.addEventListener('resize', fitStageIntoStageParent)
    setIsResized(true)

    return () => {
      window.removeEventListener('resize', fitStageIntoStageParent)
    }
  }, [])

  let shapesToRender = props.shapes.map((shape: Shape) => {
    const id = shape.shapeId

    if (shape.colorId === null) {
      return (
        <KonvaShape
          key={id}
          stroke="#333"
          strokeWidth={1}
          sceneFunc={paths[id]}
        />
      )
    } else {
      return (
        <KonvaShape
          key={id}
          fill={`hsl(${props.paletteColors[shape.colorId].h}, ${
            props.paletteColors[shape.colorId].s
          }%, ${props.paletteColors[shape.colorId].l}%)`}
          stroke="#333"
          strokeWidth={1}
          sceneFunc={paths[id]}
        />
      )
    }
  })

  return (
    <div
      id="preview-stage-parent"
      style={{
        width: '100%',
        height: '100%',
        margin: '0 auto',
        flex: '1',
        position: 'relative',
      }}
    >
      {isResized ? (
        <div
          id="container"
          style={{
            backgroundColor: '#ddd',
            display: 'flex',
            position: 'absolute',
            borderRadius: '10px',
          }}
        >
          <Stage
            draggable={false}
            width={stageWidth}
            height={stageHeight}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stageX}
            y={stageY}
          >
            <Layer>{shapesToRender}</Layer>
          </Stage>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default DesignPreview
