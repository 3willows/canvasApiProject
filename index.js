const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 5;
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

const gridSpaces = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false))

console.log(gridSpaces);

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells-1).fill(false))

console.log(verticals);

const horizontals = Array(cells)
  .fill(null)
  .map(() => Array(cells-1).fill(false))

console.log(horizontals);