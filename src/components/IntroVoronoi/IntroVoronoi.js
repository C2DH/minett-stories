import booleanIntesects from '@turf/boolean-intersects'
import centroid from '@turf/centroid'
import { polygon } from '@turf/helpers'
import classNames from 'classnames'
import { Delaunay } from 'd3-delaunay'
import { curveBasisClosed, line } from 'd3-shape'
import clipper from 'js-clipper'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useComponentSize } from 'react-use-size'
import { getStoryType } from '../../utils'
import { generateReferencepPoints, repojectPoints } from '../../voronoiUtils'
import styles from './IntroVoronoi.module.css'
import get from "lodash/get"

const cornerRadius = 0.5
const cleanCornerRadius = 12
const isCornerRadiusAbsolute = false
const cellStrokeWidth = 3

const xline = line()
  .curve(curveBasisClosed)
  .x((d) => d[0])
  .y((d) => d[1])

function cleanPoly(path) {
  return clipper.JS.Clean(path, cleanCornerRadius)
}

function cleanPoints(points) {
  return cleanPoly(
    points.map((d) => {
      return { X: d[0], Y: d[1] }
    })
  ).map((d) => [d.X, d.Y])
}

function resample(points) {
  let i = -1
  let n = points.length
  let p0 = points[n - 1]
  let x0 = p0[0]
  let y0 = p0[1]
  let p1, x1, y1
  let points2 = []

  while (++i < n) {
    p1 = points[i]
    x1 = p1[0]
    y1 = p1[1]

    let finalRadius = 0

    if (isCornerRadiusAbsolute) {
      let distance = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
      let distFromPoint = cornerRadius / distance
      finalRadius = distFromPoint >= 0.5 ? 0.5 : distFromPoint
    } else {
      finalRadius = cornerRadius
    }

    points2.push(
      [x0 + (x1 - x0) * finalRadius, y0 + (y1 - y0) * finalRadius],
      [x0 + (x1 - x0) * (1 - finalRadius), y0 + (y1 - y0) * (1 - finalRadius)],
      p1
    )

    p0 = p1
    x0 = x1
    y0 = y1
  }
  return points2
}

function getOpacity(cellStep, step, progress) {
  // console.log("c", cellStep, step, progress)
  if (step >= cellStep) {
    return 1
  }

  if (cellStep === step + 1) {
    return progress
  }

  return 0
}

function VoronoiPath({
  index,
  controlPoints,
  cells,
  cellsClassification,
  step,
  progress,
  onMouseEnter,
  onMouseLeave,
  onClick,
  withHoverEffect,
  hovered,
  notHovered,
  className,
}) {
  return (
    <path
      key={index}
      d={xline(cells[index])}
      stroke={'var(--black)'}
      style={{
        strokeWidth: cellStrokeWidth,
        opacity: controlPoints.length
          ? getOpacity(cellsClassification[index], step, progress)
          : 1,
      }}
      fill={hovered ? `url(#clean-pic-${index})` : `url(#pic-${index})`}
      className={classNames(styles.voronoiPath, className, {
        [styles.voronoiPathWithHoverEffect]: withHoverEffect,
        [styles.vornoiPathHovered]: hovered,
        [styles.vornoiPathNotHovered]: notHovered,
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  )
}

export default function IntroVoronoi({
  stories,
  controlPoints = [],
  step,
  progress,
  withHoverEffect,
  onStoryHover,
  onStoryClick,
}) {
  const [cells, setCells] = useState([])
  const { ref, height, width } = useComponentSize()
  const [refPoints, setRefPoints] = useState()

  useEffect(() => {
    const existinPointsStr = window.sessionStorage.getItem('voronoiIntroPoints')
    if (!existinPointsStr) {
      //generate distribution points based on a fixed grid
      const localPoints = generateReferencepPoints(stories.length)
      window.sessionStorage.setItem(
        'voronoiIntroPoints',
        JSON.stringify(localPoints)
      )
      setRefPoints(localPoints)
    } else {
      setRefPoints(JSON.parse(existinPointsStr))
    }
  }, [stories.length])

  const points = useMemo(() => {
    return refPoints ? repojectPoints(refPoints, width, height) : []
  }, [height, refPoints, width])

  const [hoverIndex, setHoverIndex] = useState(null)

  useEffect(() => {
    const delaunay = Delaunay.from(points)
    const voronoi = delaunay.voronoi([0, 0, width, height])

    let polyCells = Array.from(voronoi.cellPolygons())
    const polys = polyCells.map((cell) => resample(cleanPoints(cell)))

    // const polys = polyCells.map((cell, i) => voronoi.renderCell(i));
    setCells(polys)
  }, [height, points, width])

  const controlAreas = useMemo(() => {
    const areas = controlPoints.map((areaPoints) => {
      const projected = areaPoints.map((point) => [
        (point[0] * width) / 100,
        (point[1] * height) / 100,
      ])
      const internalAreaPoints = [...projected, projected[0]]
      return polygon([internalAreaPoints])
    })

    return areas
  }, [controlPoints, height, width])

  const getAreasStep = useCallback(
    (path) => {
      const p = Array.from(path)
      if (p.length < 3) {
        return controlAreas.length
      }
      const pathPoly = polygon([[...p, p[0]]])
      for (let i = 0; i < controlAreas.length; i++) {
        const a = controlAreas[i]
        if (booleanIntesects(a, centroid(pathPoly))) {
          return i
        }
      }
      return controlAreas.length
    },
    [controlAreas]
  )

  const cellsClassification = useMemo(() => {
    //should return step for each point
    //step 1 => "under" the first control point
    //step 2 => "under" the second control point
    //step "last" => "over" the last control point

    return cells.map((c) => getAreasStep(c))
  }, [cells, getAreasStep])

  function handleHoverIndexChange(index) {
    setHoverIndex(index)
    if (typeof onStoryHover === 'function') {
      const deStory = index === null ? null : stories[index]
      onStoryHover(deStory)
    }
  }

  return (
    <div className="flex-1" ref={ref}>
      {stories && stories.length > 0 && (
        <svg
          className="bg-site-black"
          style={{ position: 'absolute', zIndex: 0 }}
          width={width}
          height={height}
          // onDrag={(e) => {
          //   console.log(e)
          // }}
        >
          <defs>
            {stories.map((story, i) => {
              const cover =
                story.covers &&
                story.covers.length > 0 &&
                story.covers[0].data.resolutions.preview.url

                const bbox = get(story, "data.background.bbox")
                const hasBbox = Array.isArray(bbox) && bbox.length > 0
                let w, h, x, y;
                if(hasBbox){
                  console.log("v", bbox, story, i)
                  w = `${bbox[2] - bbox[0]}%`
                  h = `${bbox[3] - bbox[1]}%`
                  x = `${-bbox[0]}%`
                  y = `${-bbox[1]}%`

                } else {
                  w = "100%"
                  h = "100%"
                  x = "-50%"
                  y = "-50%"
                }



              return (
                <Fragment key={i}>
                  <pattern
                    id={`pic-${i}`}
                    // patternUnits="userSpaceOnUse"
                    width="100%"
                    height="100%"
                  >
                    <image
                      href={cover}
                      width={w}
                      height={h}
                      x={x}
                      y={y}
                      preserveAspectRatio="xMidYMid slice"
                      style={{ filter: 'grayscale(1)' }}
                    />
                    <rect
                      width="100%"
                      height="100%"
                      fill={`var(--color-story-${getStoryType(story)})`}
                      style={{
                        mixBlendMode: 'overlay',
                      }}
                    />
                  </pattern>
                  <pattern
                    id={`clean-pic-${i}`}
                    width="100%"
                    height="100%"
                  >
                    <image
                      href={cover}
                      width={w}
                      height={h}
                      x={x}
                      y={y}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </pattern>
                </Fragment>
              )
            })}
          </defs>
          <g>
            {cells.map((cell, i) => {
              
              const hoverProps = withHoverEffect
                ? {
                    notHovered: hoverIndex !== i && hoverIndex !== null,
                    hovered: hoverIndex === i,
                  }
                : {}
              return (
                <VoronoiPath
                  key={i}
                  index={i}
                  cells={cells}
                  cellsClassification={cellsClassification}
                  controlPoints={controlPoints}
                  step={step}
                  progress={progress}
                  {...hoverProps}
                  withHoverEffect={withHoverEffect}
                  onMouseEnter={() => handleHoverIndexChange(i)}
                  onMouseLeave={() => {
                    handleHoverIndexChange(hoverIndex === i ? null : hoverIndex)
                  }}
                  onClick={
                    typeof onStoryClick === 'function'
                      ? () => onStoryClick(stories[i])
                      : undefined
                  }
                />
              )
            })}
          </g>
        </svg>
      )}
    </div>
  )
}
