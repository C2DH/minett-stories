import { useStories, useStoryWithChapters } from '@c2dh/react-miller'
import { useEffect, useMemo, useState } from 'react'
import { useComponentSize } from 'react-use-size'
import LangLink from '../components/LangLink'
import { generateReferencepPoints, repojectPoints } from '../voronoiUtils'
import Layout from '../components/Layout'
import { Delaunay } from 'd3-delaunay'
import { line, curveBasis, curveCatmullRom , curveNatural} from 'd3-shape'

export default function StoriesIntro() {
  const { ref, height, width } = useComponentSize()

  const [introStory] = useStoryWithChapters('intro')
  const [storiesList] = useStories({
    params: {
      limit: 1000,
      filters: {
        tags__slug__in: ['theme'],
      },
      exclude: {
        tags__slug__in: ['intro'],
      },
    },
  })

  const [cells, setCells] = useState([])

  const points = useMemo(() => {
    if (!storiesList || !storiesList.results.length) {
      return []
    }
    let points
    const existinPointsStr = window.sessionStorage.getItem('voronoiIntroPoints')
    if (!existinPointsStr) {
      //generate distribution points based on a fixed grid
      const refPoints = generateReferencepPoints(storiesList.results.length)
      window.sessionStorage.setItem(
        'voronoiIntroPoints',
        JSON.stringify(refPoints)
      )
      points = refPoints
    } else {
      points = JSON.parse(existinPointsStr)
    }
    return repojectPoints(points, width, height)
  }, [height, storiesList, width])

  useEffect(() => {
    const delaunay = Delaunay.from(points)
    const voronoi = delaunay.voronoi([0, 0, width, height])

    let polyCells = Array.from(voronoi.cellPolygons())
    const xline = line()
      .curve(curveBasis)
      .x((d) => d[0])
      .y((d) => d[1])

    const polys = polyCells.map((cell) => xline(cell))

    // const polys = polyCells.map((cell, i) => voronoi.renderCell(i));
    setCells(polys)
  }, [height, points, width])

  return (
    <Layout>
      <div className="padding-top-bar h-100">
        <div className="h-100  d-flex flex-column">
          <LangLink to="/stories/voronoi">Skip</LangLink>
          <div className="bg-info flex-1" ref={ref}>
            {storiesList && storiesList.results.length > 0 && (
              <svg
                style={{ position: 'absolute', zIndex: 0, background: '#000' }}
                width={width}
                height={height}
                onDrag={(e) => {
                  console.log(e)
                }}
              >
                <defs>
                  {storiesList.results.map((story, i) => {
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
                          width="50%"
                          height="50%"
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
                      d={cell}
                      // fill={`red`}
                      stroke={'#000'}
                      style={{ strokeWidth: 3 }}
                      fill={`url(#pic-${i})`}
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
        </div>
      </div>
    </Layout>
  )
}
