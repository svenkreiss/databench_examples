import databench
import math
import random
import tornado.gen

import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt  # noqa: E402


class MplPi(databench.Analysis):

    def __init__(self, analysis_id):
        super(MplPi, self).__init__(analysis_id)

        # initialize the figure with two subplots
        self.fig = plt.figure(figsize=(8, 4))
        self.ax1 = self.fig.add_subplot(121)
        self.ax2 = self.fig.add_subplot(122)

    @tornado.gen.coroutine
    def on_connect(self):
        """Run as soon as a browser connects to this."""

        inside = 0
        rnd_draws = []
        for draws in range(1, 10000):
            yield tornado.gen.sleep(0.001)

            # generate points and check whether they are inside the unit circle
            r1 = random.random()
            r2 = random.random()
            if r1 ** 2 + r2 ** 2 < 1.0:
                inside += 1

            # keep history of generated points
            rnd_draws.append((r1, r2))

            # every 100 iterations, update status
            if draws % 100 != 0:
                continue

            # debug
            self.emit('log', {'draws': draws, 'inside': inside})

            # calculate pi and its uncertainty given the current draws
            p = inside / draws
            uncertainty = 4.0 * math.sqrt(draws * p * (1.0 - p)) / draws

            # send status to frontend
            self.data['pi'] = {
                'estimate': 4.0 * inside / draws,
                'uncertainty': uncertainty,
            }

            self.update_figure(rnd_draws)

        self.emit('log', {'action': 'done'})

    def update_figure(self, rnd_draws):
        # regenerate matplotlib plot
        self.ax1.cla()
        self.ax1.set_xlabel('r1')
        self.ax1.set_ylabel('Normalized Distribtuion')
        self.ax1.set_xlim(0, 1)
        self.ax1.set_ylim(0, 1.5)
        self.ax1.grid(True)
        self.ax1.hist(
            [r[0] for r in rnd_draws], 50,
            normed=1, facecolor='green', alpha=0.75
        )
        self.ax2.cla()
        self.ax2.set_xlabel('r2')
        self.ax2.set_ylabel('Normalized Distribtuion')
        self.ax2.set_xlim(0, 1)
        self.ax2.set_ylim(0, 1.5)
        self.ax2.grid(True)
        self.ax2.hist(
            [r[1] for r in rnd_draws], 50,
            normed=1, facecolor='blue', alpha=0.75
        )

        self.emit('mpl', databench.fig_to_src(self.fig, 'svg'))
