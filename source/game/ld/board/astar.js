import * as utils from 'ld/board/utils'

export default function(board, from, to, allowMountain=false) {
  let states = [{coord:from, cost:0, c1:0, c2:0, history:[]}]
  let visited = {}

  visited[states[0].coord] = true
  while (states.length) {
    let state = states.shift()

    // Goal condition
    if (state.coord[0] === to[0] && state.coord[1] === to[1]) {
      return state.history
    }

    // Add neighboors
    let neighboors = getNeighboors(board, state, to, allowMountain)

    for (let i=0; i<neighboors.length; i++) {
      let n = neighboors[i]
      if (visited[n.coord]) continue

      visited[n.coord] = true
      states.push(n)
    }

    // Sort the state list
    states.sort((a, b) => {
      return a.cost - b.cost
    })
  }
}

// multiple direction to vary similar paths
const directions = [
  ['NW', 'SW', 'W', 'NE', 'SE', 'E'],
  ['W', 'SW', 'NW', 'E', 'SE', 'NE'],
  ['SE', 'NE', 'E', 'SW', 'NW', 'W'],
  ['E', 'SW', 'NW', 'SE', 'NE', 'W']
]
function getNeighboors(board, state, to, allowMountain)  {
  let dirs = directions[parseInt(Math.random()*4)]
  let results = []

  for (let i=0; i<dirs.length; i++) {
    let dir = dirs[i]
    let coord = utils.next(state.coord, dir)
    let tile = board.tiles[coord]

    if (!tile) continue
    if (tile.type === 'lake') continue
    if (tile.type === 'mountain' && !allowMountain) continue

    let history = state.history.slice()
    history.push(dir)

    let c1 = state.c1 += 1
    let c2 = utils.distance(coord, to)
    let cost = c1 + c2

    results.push({coord, history, cost, c1, c2})
  }

  return results
}