import { ReactElement, FC, useState, useEffect, useContext } from 'react'
import { Stage, Layer, Shape as KonvaShape } from 'react-konva'
import Konva from 'konva'
import inverseHorse from '../assets/paths/inverseHorse'
import paths from '../assets/paths/paths'
import { AppContext } from '../context/AppContext'

// interfaces
import Shape from '../shared/interfaces/Shape.interface'

interface Coordinate2D {
  x: number
  y: number
}

const INITIAL_CANVAS_WIDTH = 800
const INITIAL_CANVAS_HEIGHT = 800
const INITIAL_CANVAS_OFFSET_X = -145
const INITIAL_CANVAS_OFFSET_Y = -140
const INITIAL_CANVAS_SCALE = 1.4

let checkerboardPattern: JSX.Element[] = []
const squaresPerRow = 35
const squareWidth = INITIAL_CANVAS_WIDTH / squaresPerRow / 2
const squaresPerColumn = INITIAL_CANVAS_HEIGHT / squareWidth
for (let i = 0; i < squaresPerRow; i++) {
  for (let j = 0; j < squaresPerColumn; j++) {
    let xOffset = 0
    if (j % 2) {
      xOffset = squareWidth
    }

    checkerboardPattern.push(
      <KonvaShape
        key={`${i}-${j}`}
        fill="#ccc"
        sceneFunc={(ctx: any, shape: any) => {
          ctx.beginPath()
          ctx.moveTo(xOffset + squareWidth * 2 * i, 0 + squareWidth * j)
          ctx.lineTo(
            xOffset + squareWidth + squareWidth * 2 * i,
            0 + squareWidth * j
          )
          ctx.lineTo(
            xOffset + squareWidth + squareWidth * 2 * i,
            squareWidth + squareWidth * j
          )
          ctx.lineTo(
            xOffset + squareWidth * 2 * i,
            squareWidth + squareWidth * j
          )
          ctx.lineTo(xOffset + squareWidth * 2 * i, 0 + squareWidth * j)
          ctx.fillStrokeShape(shape)
        }}
      />
    )
  }
}

interface Props {
  eyeDropperActive: boolean
  handleClickWithEyedropper: (shapeId: number) => void
}

const Canvas: FC<Props> = (props): ReactElement => {
  const [stageScale, setStageScale] = useState(INITIAL_CANVAS_SCALE)
  const [stageX, setStageX] = useState(INITIAL_CANVAS_OFFSET_X)
  const [stageY, setStageY] = useState(INITIAL_CANVAS_OFFSET_Y)
  const [stageWidth, setStageWidth] = useState(INITIAL_CANVAS_WIDTH)
  const [stageHeight, setStageHeight] = useState(INITIAL_CANVAS_HEIGHT)
  const [isZooming, setIsZooming] = useState(false)
  const [isResized, setIsResized] = useState(false)

  const {
    shapes,
    setShapes,
    activeColorId,
    undoSteps,
    setUndoSteps,
    setRedoSteps,
    paletteColors,
  } = useContext(AppContext)

  useEffect(() => {
    const fitStageIntoStageParent = () => {
      setTimeout(() => {
        let stageParent = document.querySelector<HTMLElement>(
          '#editor-stage-parent'
        )

        if (stageParent !== null) {
          let stageParentWidth = stageParent.offsetWidth
          let stageParentHeight = stageParent.offsetHeight
          let xOffset = 0
          let yOffset = 0

          console.log(stageParentHeight)

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
      }, 50)
    }

    // need a little delay here for the browser to have time to render
    // #stage-parent at the correct height before we grab this value and resize the canvas
    setTimeout(() => {
      fitStageIntoStageParent()
    }, 1)

    // adapt the stage on window resize
    window.addEventListener('resize', fitStageIntoStageParent)

    return () => {
      window.removeEventListener('resize', fitStageIntoStageParent)
    }
  }, [])

  const handleClickOrTapShape = (id: number) => {
    if (props.eyeDropperActive) {
      props.handleClickWithEyedropper(id)
    } else {
      let newUndoSteps = [...undoSteps]

      for (const shape of shapes) {
        if (shape.shapeId === id) {
          if (shape.colorId !== activeColorId) {
            newUndoSteps.push({
              shapeId: id,
              colorId: shape.colorId,
            })

            setRedoSteps([])
          }
        }
      }
      setUndoSteps(newUndoSteps)

      setShapes(
        shapes.map((oldShape: Shape) => {
          return id === oldShape.shapeId
            ? { ...oldShape, colorId: activeColorId }
            : oldShape
        })
      )
    }
  }

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const scaleBy = 1.2
    const stage = e.target.getStage()
    if (stage !== null) {
      const oldScale = stage.scaleX()
      const pointerPosition = stage.getPointerPosition()
      if (pointerPosition !== null) {
        const mousePointTo = {
          x: pointerPosition.x / oldScale - stage.x() / oldScale,
          y: pointerPosition.y / oldScale - stage.y() / oldScale,
        }

        const newScale =
          e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy

        setStageScale(newScale)
        setStageX(-(mousePointTo.x - pointerPosition.x / newScale) * newScale)
        setStageY(-(mousePointTo.y - pointerPosition.y / newScale) * newScale)
      }
    }
  }

  function getDistance(p1: Coordinate2D, p2: Coordinate2D) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }

  function getCenter(p1: Coordinate2D, p2: Coordinate2D) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    }
  }

  let lastCenter: Coordinate2D | null = null
  let lastDist = 0

  const handleMultiTouch = (e: Konva.KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault()
    let touch1 = e.evt.touches[0]
    let touch2 = e.evt.touches[1]

    const stage = e.target.getStage()

    if (touch1 && touch2) {
      setIsZooming(true)

      // get the offset of the stage in order to calculate the correct center coordinates
      if (stage !== null) {
        const leftOffset = stage.attrs.container.offsetLeft
        const topOffset = stage.attrs.container.offsetTop

        let p1 = {
          x: touch1.clientX - leftOffset,
          y: touch1.clientY - topOffset,
        }
        let p2 = {
          x: touch2.clientX - leftOffset,
          y: touch2.clientY - topOffset,
        }

        if (!lastCenter) {
          lastCenter = getCenter(p1, p2)
          return
        }
        let newCenter = getCenter(p1, p2)

        let dist = getDistance(p1, p2)

        if (!lastDist) {
          lastDist = dist
        }

        // local coordinates of center point
        let pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        }

        let scale = stage.scaleX() * (dist / lastDist)

        stage.scaleX(scale)
        stage.scaleY(scale)

        // calculate new position of the stage
        let dx = newCenter.x - lastCenter.x
        let dy = newCenter.y - lastCenter.y

        let newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        }

        stage.position(newPos)
        stage.batchDraw()

        lastDist = dist
        lastCenter = newCenter
      }
    }
  }

  const multiTouchEnd = () => {
    lastCenter = null
    lastDist = 0
    setIsZooming(false)
  }

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage()
    if (isZooming && stage !== null) {
      stage.stopDrag()
    }
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // store position in state
    // console.log(e);
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // store position in state
    // console.log(e);
  }

  let shapesToRender = shapes.map((shape: Shape) => {
    const id = shape.shapeId
    if (shape.colorId === null) {
      return (
        <KonvaShape
          key={id}
          fill={undefined}
          stroke="#333"
          strokeWidth={1}
          sceneFunc={paths[id]}
          onClick={() => handleClickOrTapShape(id)}
          onTap={() => handleClickOrTapShape(id)}
        />
      )
    } else {
      return (
        <KonvaShape
          key={id}
          fill={`hsl(${paletteColors[shape.colorId].h}, ${
            paletteColors[shape.colorId].s
          }%, ${paletteColors[shape.colorId].l}%)`}
          stroke="#333"
          strokeWidth={1}
          sceneFunc={paths[id]}
          onClick={() => handleClickOrTapShape(id)}
          onTap={() => handleClickOrTapShape(id)}
        />
      )
    }
  })

  return (
    <div
      id="editor-stage-parent"
      style={{
        width: '100%',
        margin: '0 auto',
        flex: '1',
        position: 'relative',
      }}
    >
      {isResized ? (
        <div
          id="container"
          style={{
            backgroundColor: '#DDD',
            display: 'flex',
            position: 'absolute',
          }}
        >
          <Stage
            draggable={true}
            width={stageWidth}
            height={stageHeight}
            onWheel={handleWheel}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            _
            onDragEnd={handleDragEnd}
            onTouchMove={handleMultiTouch}
            onTouchEnd={multiTouchEnd}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stageX}
            y={stageY}
          >
            <Layer>
              {checkerboardPattern}
              <KonvaShape
                stroke="#333"
                strokeWidth={1}
                sceneFunc={inverseHorse}
              />
              {shapesToRender}
            </Layer>
          </Stage>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Canvas
