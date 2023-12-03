const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

const engine = Engine.create();
const { world } = engine;
const width = 800;
const height = 600;

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

World.add(world, MouseConstraint.create(engine, {
  mouse: Mouse.create(render.canvas)
}))

//wall
const walls = [
  Bodies.rectangle(400, 0, 800, 50, {
    isStatic: true
  }),
  Bodies.rectangle(400, 600, 800, 50, {
    isStatic: true
  }),
  Bodies.rectangle(0, 300, 50, 600, {
    isStatic: true
  }),
  Bodies.rectangle(800, 300, 50, 600, {
    isStatic: true
  })
];

World.add(world, walls);

//random shapes

for (let i = 0; i < 30; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(width * Math.random(), height * Math.random(), 50, 50));
  }
  else {
    World.add(
      world,
      Bodies.circle(width * Math.random(), height * Math.random(), 35,
        {
          // render: { fillStyle: 'red' }
        }));
  }
}
