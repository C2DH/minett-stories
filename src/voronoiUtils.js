import { Delaunay } from 'd3-delaunay'
import range from 'lodash/range'
import random from 'lodash/random'
import groupBy from 'lodash/groupBy'
import mean from 'lodash/mean'
import { scaleLinear } from 'd3-scale'

function randomPoint(width, height) {
  return [random(0, width), random(0, height)]
}

function randomPoints(num, width, height) {
  return range(num).map(() => randomPoint(width, height))
}

function getCenter(points) {
  const x = mean(points.map((p) => p[0]))
  const y = mean(points.map((p) => p[1]))

  return [x, y]
}

function generateGrid(width, height) {
  const gridFactor = 80
  const deltaX = width / gridFactor
  const deltaY = height / gridFactor
  let out = []
  for (let i = 0; i < gridFactor; i++) {
    const x = i * deltaX
    for (let j = 0; j < gridFactor; j++) {
      const y = j * deltaY
      const point = [x, y]
      out.push(point)
    }
  }
  return out
}

// https://math.stackexchange.com/questions/366474/find-coordinates-of-n-points-uniformly-distributed-in-a-rectangle
function distributeEven(numPoints, width, height) {
  //   const testPoints = randomPoints(numPoints * 100, width, height);
  const testPoints = generateGrid(width, height)
  let points = randomPoints(numPoints, width, height)
  const delaunay = Delaunay.from(points)
  //const voronoi = delaunay.voronoi([0, 0, width, height])

  for (let i = 0; i < 50; i++) {
    const closestPoints = testPoints.map((p, i) => ({
      site: delaunay.find(...p),
      density: i,
    }))
    const byIndex = groupBy(closestPoints, 'site')
    //move points to baricenters
    points = points.map((p, i) => {
      const candidates = byIndex[i].map((idx) => testPoints[idx.density])
      return getCenter(candidates)
    })
  }
  return points
}

// const movePoint = function (points, index, deltaX, deltaY) {
//   let newPoints = [...points]
//   newPoints[index] = [
//     newPoints[index][0] + deltaX,
//     newPoints[index][1] + deltaY,
//   ]
//   return newPoints
// }

// const availableCurves = {
//   curveBasis,
//   curveBumpY,
//   curveBumpX,
//   curveBundle,
//   curveCardinal,
//   curveLinear,
//   curveMonotoneX,
//   curveMonotoneY,
//   curveNatural,
//   curveStep,
// };

const REFERENCE_GRID_WIDTH = 300
const REFERENCE_GRID_HEIGHT = 300

export function generateReferencepPoints(numPoints) {
  return distributeEven(numPoints, REFERENCE_GRID_WIDTH, REFERENCE_GRID_HEIGHT)
}

export function repojectPoints(points, width, height) {
  const xScale = scaleLinear()
    .domain([0, REFERENCE_GRID_WIDTH])
    .range([0, width])
  const yScale = scaleLinear()
    .domain([0, REFERENCE_GRID_HEIGHT])
    .range([0, height])
  return points.map((p) => {
    return [xScale(p[0]), yScale(p[1])]
  })
}
