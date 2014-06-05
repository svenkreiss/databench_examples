"""Calculating \(\pi\) the simple way, but with mpld3."""

import math
from time import sleep
from random import random

import matplotlib.pyplot as plt, mpld3

import databench


mpld3pi = databench.Analysis('mpld3pi', __name__)
mpld3pi.thumbnail = 'mpld3pi.png'
mpld3pi.description = __doc__

@mpld3pi.signals.on('connect')
def onconnect():
    inside = 0
    allR1 = []
    allR2 = []

    fig = plt.figure(figsize=(8,4))
    ax1 = fig.add_subplot(121)
    # histogram
    n, bins, patches = ax1.hist([0.5], 50, normed=1, facecolor='green', alpha=0.75)
    bincenters = 0.5*(bins[1:]+bins[:-1])

    ax2 = fig.add_subplot(122)
    # histogram
    n, bins, patches = ax2.hist([0.5], 50, normed=1, facecolor='blue', alpha=0.75)
    bincenters = 0.5*(bins[1:]+bins[:-1])

    for i in range(10000):
        sleep(0.001)
        r1, r2 = (random(), random())
        if r1*r1 + r2*r2 < 1.0: 
            inside += 1

        allR1.append(r1)
        allR2.append(r2)
        if (i+1)%100 == 0:
            draws = i+1
            mpld3pi.signals.emit('log', {
                'draws':draws, 
                'inside':inside, 
                'r1':r1, 
                'r2':r2
            })

            p = float(inside)/draws
            uncertainty = 4.0*math.sqrt(draws*p*(1.0 - p)) / draws
            mpld3pi.signals.emit('status', {
                'pi-estimate': 4.0*inside/draws,
                'pi-uncertainty': uncertainty
            })

            ax1.cla()
            ax1.set_xlabel('r1')
            ax1.set_ylabel('Normalized Distribtuion')
            ax1.set_xlim(0, 1)
            ax1.set_ylim(0, 1.5)
            ax1.grid(True)
            ax1.hist(allR1, 50, normed=1, facecolor='green', alpha=0.75)

            ax2.cla()
            ax2.set_xlabel('r2')
            ax2.set_ylabel('Normalized Distribtuion')
            ax2.set_xlim(0, 1)
            ax2.set_ylim(0, 1.5)
            ax2.grid(True)
            ax2.hist(allR2, 50, normed=1, facecolor='blue', alpha=0.75)
            mpld3pi.signals.emit('mpld3canvas', mpld3.fig_to_dict(fig))

    plt.close(fig)
    mpld3pi.signals.emit('log', {'action': 'done'})
