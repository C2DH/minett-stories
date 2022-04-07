import { useState, useMemo, useEffect, useCallback } from 'react'
import { generateReferencepPoints, repojectPoints } from '../../voronoiUtils'
import { useComponentSize } from 'react-use-size'
import { line, curveBasis, curveBumpX, curveNatural } from 'd3-shape'
import { Delaunay } from 'd3-delaunay'
import random from 'lodash/random'
import styles from './IntroVoronoi.module.css'
import classNames from 'classnames'
import booleanIntesects from '@turf/boolean-intersects'
import { polygon } from '@turf/helpers'
import centroid from '@turf/centroid'

const xline = line()
  .curve(curveBasis)
  .x((d) => d[0])
  .y((d) => d[1])

export default function IntroVoronoi({ stories, controlPoints = [], step }) {
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

  useEffect(() => {
    const delaunay = Delaunay.from(points)
    const voronoi = delaunay.voronoi([0, 0, width, height])

    let polyCells = Array.from(voronoi.cellPolygons())

    const polys = polyCells.map((cell) => cell)

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
      console.log('x', path)
      const p = Array.from(path)
      if (p.length < 3) {
        return controlAreas.length
      }
      const pathPoly = polygon([[...p, p[0]]])
      for (let i = 0; i < controlAreas.length; i++) {
        const a = controlAreas[i]
        if (booleanIntesects(a, centroid(pathPoly))) {
          return i + 1
        }
      }
      return controlAreas.length + 1

      return random(1, controlPoints.length + 1)
    },
    [controlPoints.length, controlAreas]
  )

  const cellsClassification = useMemo(() => {
    //should return step for each point
    //step 1 => "under" the first control point
    //step 2 => "under" the second control point
    //step "last" => "over" the last control point

    return cells.map((c) => getAreasStep(c))
  }, [cells, getAreasStep])

  return (
    <div className="bg-info flex-1" ref={ref}>
      {stories && stories.length > 0 && (
        <svg
          style={{ position: 'absolute', zIndex: 0, background: '#000' }}
          width={width}
          height={height}
          onDrag={(e) => {
            console.log(e)
          }}
        >
          <defs>
            {stories.map((story, i) => {
              const cover = story.covers[0]
              return (
                <pattern
                  key={i}
                  id={`pic-${i}`}
                  // patternUnits="userSpaceOnUse"
                  width="100%"
                  height="100%"
                >
                  <image
                    href={cover.attachment}
                    width="80%"
                    height="80%"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              )
            })}
          </defs>
          {cells.map((cell, i) => {
            return (
              <path
                key={i}
                d={xline(cell)}
                // fill={`red`}
                stroke={'#000'}
                style={{ strokeWidth: 1 }}
                fill={`url(#pic-${i})`}
                className={classNames(styles.invisible, {
                  [styles.visible]:
                    !controlPoints.length || cellsClassification[i] <= step,
                })}
              ></path>
            )
          })}
          {/* {points.map((p, i) => (
            <circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r={10}
            ></circle>
            ))} */}
        </svg>
      )}
    </div>
  )
}
