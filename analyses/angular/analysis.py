"""Calculating \\(\\pi\\) the simple way with angular.js interface."""

import databench

import math
import time
import random


class Analysis(databench.Analysis):

    def on_connect(self):
        """Run as soon as a browser connects to this."""

        inside = 0
        for i in xrange(10000):
            time.sleep(0.001)

            # generate points and check whether they are inside the unit circle
            r1 = random.random()
            r2 = random.random()
            if r1*r1 + r2*r2 < 1.0:
                inside += 1

            # every 100 iterations, update status
            if (i+1) % 100 == 0:
                draws = i+1

                # debug
                self.emit('log', {'draws': draws, 'inside': inside})

                # calculate pi and its uncertainty given the current draws
                p = float(inside)/draws
                uncertainty = 4.0*math.sqrt(draws*p*(1.0 - p)) / draws

                # send status to frontend
                self.emit('status', {
                    'pi-estimate': 4.0*inside/draws,
                    'pi-uncertainty': uncertainty
                })

        self.emit('log', {'action': 'done'})


META = databench.Meta('angular', __name__, __doc__, Analysis)
