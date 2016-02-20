import databench

import math
from time import sleep
from random import random

import mpld3
import matplotlib.pyplot as plt


class Analysis(databench.Analysis):

    def __init__(self):
        # initialize the figure with two subplots
        self.fig = plt.figure(figsize=(8, 4))
        self.ax1 = self.fig.add_subplot(121)
        self.ax2 = self.fig.add_subplot(122)

    def on_connect(self):
        """Run as soon as a browser connects to this."""

        inside = 0
        rnd_draws = []

        for i in range(10000):
            sleep(0.001)

            # generate points and check whether they are inside the unit circle
            r1, r2 = (random(), random())
            if r1*r1 + r2*r2 < 1.0:
                inside += 1

            # keep history of generated points
            rnd_draws.append((r1, r2))

            # every 100 iterations, update status
            if (i+1) % 100 == 0:
                draws = i+1

                # debug
                self.emit('log', {
                    'draws': draws,
                    'inside': inside,
                    'r1': r1,
                    'r2': r2
                })

                # calculate pi and its uncertainty given the current draws
                p = float(inside)/draws
                uncertainty = 4.0*math.sqrt(draws*p*(1.0 - p)) / draws
                self.emit('status', {
                    'pi-estimate': 4.0*inside/draws,
                    'pi-uncertainty': uncertainty
                })

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

        # send new matplotlib plots to frontend
        self.emit('mpld3canvas', mpld3.fig_to_dict(self.fig))


META = databench.Meta('mpld3pi', Analysis)
