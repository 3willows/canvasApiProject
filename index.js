const { Engine, Render, Runner, World, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;
const width = 600;
const height = 600;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: width,
    height: height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

//wall
const walls = [
  Bodies.rectangle(width/2, 0, width, 50, {
    isStatic: true
  }),
  Bodies.rectangle(width/2, height, width, 50, {
    isStatic: true
  }),
  Bodies.rectangle(0, height/2, 50, height, {
    isStatic: true
  }),
  Bodies.rectangle(width, height/2, 50, height, {
    isStatic: true
  })
];

World.add(world, walls);

