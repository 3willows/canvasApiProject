const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const unitLength = width / cells;
const wallThickness = unitLength / 20;

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
  Bodies.rectangle(width / 2, 0, width, wallThickness, {
    isStatic: true
  }),
  Bodies.rectangle(width / 2, height, width, wallThickness, {
    isStatic: true
  }),
  Bodies.rectangle(0, height / 2, wallThickness, height, {
    isStatic: true
  }),
  Bodies.rectangle(width, height / 2, wallThickness, height, {
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

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false))

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
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"]
  ]);

  // console.log(neighbours);
  // check neighbour is out of bounds

  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;
    if (nextRow < 0 || nextRow >= cells ||
      nextColumn < 0 || nextColumn >= cells) {
      continue;
    }

    // if we have visited the neighbours, continue to the next neighbour
    if (gridSpaces[nextRow][nextColumn]) {
      continue;
    }
    // console.log([nextRow], [nextColumn], direction);
    // remove wall

    if (direction === "left") {
      verticals[row][column - 1] = true;
    }
    if (direction === "right") {
      verticals[row][column] = true;
    }
    if (direction === "up") {
      horizontals[row - 1][column] = true;
    }
    if (direction === "down") {
      horizontals[row][column] = true;
    }

    // return [nextRow, nextColumn];
    stepThroughCell(nextRow, nextColumn);

  }
  // visit the next cell 
}

//call stepThroughCell again

stepThroughCell(startRow, startColumn)

console.log(gridSpaces);
console.log(verticals, horizontals);

horizontals.forEach((row, rowIndex) => {
  // console.log(row);
  row.forEach((truthValue, columIndex) => {
    if (truthValue === true) {
      return;
    }
    const wall = Bodies.rectangle(unitLength / 2 + columIndex * unitLength, unitLength * (rowIndex + 1), unitLength, wallThickness, {
      isStatic: true
    });
    World.add(world, wall);
  })
})

verticals.forEach((row, rowIndex) => {
  console.log(row);
  row.forEach((truthValue, columIndex) => {
    if (truthValue === true) {
      return
    }
    const wall = Bodies.rectangle(
      unitLength + unitLength * columIndex,
      unitLength / 2 + unitLength * rowIndex, wallThickness,
      unitLength,
      {
        isStatic: true
      });
    World.add(world, wall);
  })
})

//example to help with my bearings shape

// const horizontalWall = Bodies.rectangle(unitLength/2 , unitLength , unitLength, 30, {
//   isStatic: true
// });
// World.add(world, horizontalWall);

const goalX = unitLength / 2 + unitLength * (Math.floor(Math.random() * cells));
const goalY = unitLength / 2 + unitLength * (Math.floor(Math.random() * cells));

const goal = Bodies.rectangle(goalX, goalY, unitLength/2, unitLength/2, {
  isStatic: true,
  wireframe: false
});

World.add(world, goal);

const ballX = unitLength / 2 + unitLength * (Math.floor(Math.random() * cells));
const ballY = unitLength / 2 + unitLength * (Math.floor(Math.random() * cells));

const ball = Bodies.circle(ballX, ballY, unitLength / 4, {
  isStatic: true,
  wireframe: false
});

World.add(world, ball);