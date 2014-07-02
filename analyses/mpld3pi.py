"""Calculating \\(\\pi\\) the simple way, but with mpld3."""

import databench

import math
from time import sleep
from random import random

import mpld3
import matplotlib.pyplot as plt


ANALYSIS = databench.Analysis('mpld3pi', __name__, __doc__)
ANALYSIS.thumbnail = 'mpld3pi.png'


@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""

    inside = 0
    rnd_draws = []

    # initialize the figure with two subplots
    fig = plt.figure(figsize=(8, 4))
    ax1 = fig.add_subplot(121)
    ax2 = fig.add_subplot(122)

    for i in xrange(10000):
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
            ANALYSIS.signals.emit('log', {
                'draws': draws,
                'inside': inside,
                'r1': r1,
                'r2': r2
            })

            # calculate pi and its uncertainty given the current draws
            p = float(inside)/draws
            uncertainty = 4.0*math.sqrt(draws*p*(1.0 - p)) / draws
            ANALYSIS.signals.emit('status', {
                'pi-estimate': 4.0*inside/draws,
                'pi-uncertainty': uncertainty
            })

            # regenerate matplotlib plot
            ax1.cla()
            ax1.set_xlabel('r1')
            ax1.set_ylabel('Normalized Distribtuion')
            ax1.set_xlim(0, 1)
            ax1.set_ylim(0, 1.5)
            ax1.grid(True)
            ax1.hist(
                [r[0] for r in rnd_draws], 50,
                normed=1, facecolor='green', alpha=0.75
            )
            ax2.cla()
            ax2.set_xlabel('r2')
            ax2.set_ylabel('Normalized Distribtuion')
            ax2.set_xlim(0, 1)
            ax2.set_ylim(0, 1.5)
            ax2.grid(True)
            ax2.hist(
                [r[1] for r in rnd_draws], 50,
                normed=1, facecolor='blue', alpha=0.75
            )

            # send new matplotlib plots to frontend
            ANALYSIS.signals.emit('mpld3canvas', mpld3.fig_to_dict(fig))

    plt.close(fig)
    ANALYSIS.signals.emit('log', {'action': 'done'})
