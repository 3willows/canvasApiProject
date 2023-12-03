const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const engine = Engine.create();
const { world } = engine;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframe: true,
    width: width,
    height: height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

//wall
const walls = [
  Bodies.rectangle(width / 2, 0, width, 50, {
    isStatic: true
  }),
  Bodies.rectangle(width / 2, height, width, 50, {
    isStatic: true
  }),
  Bodies.rectangle(0, height / 2, 50, height, {
    isStatic: true
  }),
  Bodies.rectangle(width, height / 2, 50, height, {
    isStatic: true
  })
];

World.add(world, walls);

// Maze generation

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;

    const temp = arr[0];
    arr[0] = arr[index];
    arr[index] = temp;
  }
  return arr;
}

const gridSpaces = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false))

// console.log(gridSpaces);

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false))

// console.log(verticals);

const horizontals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false))

// console.log(horizontals);

const startRow = Math.floor((Math.random()) * cells);
const startColumn = Math.floor((Math.random()) * cells);

// console.log(startRow, startColumn);

const stepThroughCell = (row, column) => {
  // return if I had visited before
  if (gridSpaces[row][column]) {
    return;
  }
  // mark cell as visited
  gridSpaces[row][column] = true;
  // For each neighbour
  const neighbours = shuffle([
    [row + 1, column],
    [row - 1, column],
    [row, column + 1],
    [row, column - 1]
  ]);

  console.log(neighbours);
  // check neighbour is out of bounds

  // if we have visited the neighbours, continue to the next neighbour

  // remove wall

  // visit the next cell 

}

stepThroughCell(1, 1)

// console.log(gridSpaces);