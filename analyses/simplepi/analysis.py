import databench

import math
import random
import tornado.gen


class SimplePi(databench.Analysis):

    @tornado.gen.coroutine
    def on_connect(self):
        """Run as soon as a browser connects to this."""

        inside = 0
        for draws in range(1, 10000):
            yield tornado.gen.sleep(0.001)

            # generate points and check whether they are inside the unit circle
            r1 = random.random()
            r2 = random.random()
            if r1*r1 + r2*r2 < 1.0:
                inside += 1

            # every 100 iterations, update status
            if draws % 100 != 0:
                continue

            # debug
            self.emit('log', {'draws': draws, 'inside': inside})

            # calculate pi and its uncertainty given the current draws
            p = float(inside)/draws
            uncertainty = 4.0*math.sqrt(draws*p*(1.0 - p)) / draws

            # send status to frontend
            self.data['pi'] = {
                'estimate': 4.0*inside/draws,
                'uncertainty': uncertainty,
            }

        self.emit('log', {'action': 'done'})


META = databench.Meta('simplepi', SimplePi)
