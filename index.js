const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 5;
const cellsVertical = 5;
const speed = window.innerWidth / 200;

const unitLengthH = height / cellsHorizontal;
const unitLengthW = width / cellsVertical;
const wallThickness = (unitLengthH + unitLengthW) / 40;

const engine = Engine.create();
const { world } = engine;
engine.world.gravity.y = 0;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: width,
    height: height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

//wall
const walls = [
  Bodies.rectangle(width / 2, 0, width, wallThickness, {
    label: 'borders',
    isStatic: true
  }),
  Bodies.rectangle(width / 2, height, width, wallThickness, {
    label: 'borders',
    isStatic: true
  }),
  Bodies.rectangle(0, height / 2, wallThickness, height, {
    label: 'borders',
    isStatic: true
  }),
  Bodies.rectangle(width, height / 2, wallThickness, height, {
    label: 'borders',
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

const gridSpaces = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false))

// console.log(gridSpaces);

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false))

// console.log(verticals);

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false))

// console.log(horizontals);

const startRow = Math.floor((Math.random()) * cellsVertical);
const startColumn = Math.floor((Math.random()) * cellsHorizontal);

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
    if (nextRow < 0 || nextRow >= cellsVertical ||
      nextColumn < 0 || nextColumn >= cellsHorizontal) {
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

// console.log(gridSpaces);
// console.log(verticals, horizontals);

horizontals.forEach((row, rowIndex) => {
  // console.log(row);
  row.forEach((truthValue, columIndex) => {
    if (truthValue === true) {
      return;
    }
    const wall = Bodies.rectangle(unitLengthW / 2 + columIndex * unitLengthW, unitLengthH * (rowIndex + 1), unitLengthW, wallThickness, {
      render: { fillStyle: 'red' },
      label: 'wall',
      isStatic: true
    });
    World.add(world, wall);
  })
})

verticals.forEach((row, rowIndex) => {
  // console.log(row);
  row.forEach((truthValue, columIndex) => {
    if (truthValue === true) {
      return
    }
    const wall = Bodies.rectangle(
      unitLengthW + unitLengthW * columIndex,
      unitLengthH / 2 + unitLengthH * rowIndex, wallThickness,
      unitLengthH,
      {
        render: { fillStyle: 'yellow' },
        label: 'wall',
        isStatic: true
      });
    World.add(world, wall);
  })
})

const goalX = unitLengthW / 2 + unitLengthW * (Math.floor(Math.random() * cellsHorizontal));
const goalY = unitLengthH / 2 + unitLengthH * (Math.floor(Math.random() * cellsVertical));

const goal = Bodies.rectangle(goalX, goalY, unitLengthW / 2, unitLengthH / 2, {
  isStatic: true,
  render: { fillStyle: 'blue' },
  label: 'goal'
});

World.add(world, goal);

const ballX = unitLengthW / 2 + unitLengthW * (Math.floor(Math.random() * cellsVertical));
const ballY = unitLengthH / 2 + unitLengthH * (Math.floor(Math.random() * cellsHorizontal));

const ballRadius = Math.min(unitLengthW, unitLengthH) / 4;

const ball = Bodies.circle(ballX, ballY, ballRadius, {
  isStatic: false,
  render: { fillStyle: 'green' },
  label: 'ball'
});

World.add(world, ball);

document.addEventListener('keydown', e => {

  const { x, y } = ball.velocity;
  if (e.key === 'w' || e.key === 'ArrowUp') {
    Body.setVelocity(ball, { x: x, y: y - speed });
  }
  if (e.key === 's' || e.key === 'ArrowDown')
    Body.setVelocity(ball, { x: x, y: y + speed });
  if (e.key === 'a' || e.key === 'ArrowLeft')
    Body.setVelocity(ball, { x: x - speed, y: y + speed });
  if (e.key === 'd' || e.key === 'ArrowRight')
    Body.setVelocity(ball, { x: x + speed, y: y });
})

// Win Condition

Events.on(engine, 'collisionStart', event => {

  event.pairs.forEach((collision) => {
    const labels = ['ball', 'goal'];

    if (labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)) {
      console.log('User wins!');
      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      })
    }
  })
});