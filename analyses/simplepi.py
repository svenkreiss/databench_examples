"""Calculating \\(\\pi\\) the simple way."""

import math
from time import sleep
from random import random

import databench


ANALYSIS = databench.Analysis('simplepi', __name__)
ANALYSIS.description = __doc__
ANALYSIS.thumbnail = 'simplepi.png'

@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""

    inside = 0
    for i in xrange(10000):
        sleep(0.001)

        # generate points and check whether they are inside the unit circle
        r1 = random()
        r2 = random()
        if r1*r1 + r2*r2 < 1.0:
            inside += 1

        # every 100 iterations, update status
        if (i+1)%100 == 0:
            draws = i+1

            # debug
            ANALYSIS.signals.emit('log', {'draws':draws, 'inside':inside})

            # calculate pi and its uncertainty given the current draws
            p = float(inside)/draws
            uncertainty = 4.0*math.sqrt(draws*p*(1.0 - p)) / draws

            # send status to frontend
            ANALYSIS.signals.emit('status', {
                'pi-estimate': 4.0*inside/draws,
                'pi-uncertainty': uncertainty
            })

    ANALYSIS.signals.emit('log', {'action': 'done'})
