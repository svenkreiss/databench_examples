"""Generate flowers. Parameters can be adjusted while the generation is
running."""

import databench

import math
import time
import random


def g(params):
    """Shorthand for random.gauss()."""
    return random.gauss(params[0], params[1])


class BranchConfig:
    def __init__(self):
        self.init_size = 0.03
        self.init_length = 0.05
        self.init_color = 0.1

        self.size_delta = (0.99, 0.02)
        self.length_delta = (0.99, 0.02)
        self.color_delta = (0.5, 0.1)
        self.angle_delta = (0.0, 5.0/57.0)
        self.branch_prob_per_unit = 5.0
        self.branch_angle = 10.0/57.0


class Branch:
    def __init__(self, size=None, length=None, color=None, angle=0.0,
                 config=None):
        if not size:
            size = config.init_size
        if not length:
            length = config.init_length
        if not color:
            color = config.init_color

        self.key = random.randint(0, 0xffffff)
        self.size = size
        self.length = length
        self.color = color
        self.angle = angle
        self.config = config

        if self.size < 0.001:
            self.size = 0.001
        if self.length < 0.001:
            self.length = 0.001
        if self.color < 0.0:
            self.color = 0.0
        if self.color > 1.0:
            self.color = 1.0
        if self.angle < -270.0/57.0:
            self.angle = -270.0/57.0
        if self.angle > 270.0/57.0:
            self.angle = 270.0/57.0

        self.left = None
        self.right = None
        self.terminal = True

    def new_branch(self):
        return Branch(
            self.size * g(self.config.size_delta),
            self.length * g(self.config.length_delta),
            self.color + g(self.config.color_delta)*self.length,
            self.angle + g(self.config.angle_delta),
            self.config
        )

    def generate(self):
        if not self.terminal:
            if self.right is not None and random.random() > 0.5:
                self.right.generate()
            else:
                self.left.generate()
            return

        self.terminal = False

        # creating a new branch on the left ...
        self.left = self.new_branch()
        # ... on optionally also on the right
        if random.random() < self.config.branch_prob_per_unit*self.length:
            self.right = self.new_branch()

            # Left and right are just the abstract tree structure. In real
            # space, we need to randomize whether the dominant (self.left)
            # branch is on the left or right.
            factor = 1.0
            if random.random() < 0.5:
                factor = -1.0
            self.left.angle -= factor*self.config.branch_angle/2.0
            self.right.angle += factor*self.config.branch_angle/2.0

    def lines(self, x=0.0, y=0.0):
        new_x = x + self.length*math.sin(self.angle)
        new_y = y + self.length*math.cos(self.angle)
        lines = [(self.key, x, y, new_x, new_y, self.size, self.color)]

        if self.left is not None:
            lines += self.left.lines(new_x, new_y)
        if self.right is not None:
            lines += self.right.lines(new_x, new_y)

        return lines

    def ends(self, x=0.0, y=0.0):
        x += self.length*math.sin(self.angle)
        y += self.length*math.cos(self.angle)
        if self.terminal:
            return [(x, y)]
        elif self.right:
            return self.left.ends(x, y) + self.right.ends(x, y)
        else:
            return self.left.ends(x, y)


class Analysis(databench.Analysis):

    def __init__(self):
        self.number_of_flowers = 3
        self.max_height = 0.9
        self.max_width = 0.3
        self.config = BranchConfig()
        self.flowers = []

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.emit('log', {'action': 'start'})
        self.generate_flowers()

    def init_flowers(self):
        while len(self.flowers) < self.number_of_flowers:
            new_x = 0.1+0.8*random.random()
            if self.flowers:
                while min([abs(f['x']-new_x) for f in self.flowers]) < 0.03:
                    new_x = 0.1+0.8*random.random()
            self.flowers.append({
                'x': 0.1+0.8*random.random(),
                'trunk': Branch(config=self.config)
            })

    def output(self):
        lines = []
        for f in self.flowers:
            lines += f['trunk'].lines(f['x'])
        return lines

    def generate_flowers(self):
        while True:
            self.init_flowers()

            # remove flowers that are larger than self.max_height
            heights = [max([e[1] for e in f['trunk'].ends(f['x'])])
                       for f in self.flowers]
            self.flowers = [f for f, h in zip(self.flowers, heights)
                            if h < self.max_height]
            # remove flowers that are wider than self.max_width
            lefts = [min([e[0] for e in f['trunk'].ends(f['x'])])
                     for f in self.flowers]
            rights = [max([e[0] for e in f['trunk'].ends(f['x'])])
                      for f in self.flowers]
            widths = [r-l for l, r in zip(lefts, rights)]
            self.flowers = [f for f, w in zip(self.flowers, widths)
                            if w < self.max_width]

            for f in self.flowers:
                f['trunk'].generate()

            self.emit('update', self.output())
            time.sleep(0.15)

    """Adjust parameters."""

    def on_number_of_flowers(self, flowers):
        self.number_of_flowers = flowers

    def on_branch_angle(self, angle_in_degrees):
        self.config.branch_angle = angle_in_degrees/57.0

    def on_init_size(self, size):
        self.config.init_size = size

    def on_init_length(self, length):
        self.config.init_length = length

    def on_init_color(self, color):
        self.config.init_color = color


META = databench.Meta('flowers', __name__, __doc__, Analysis)
