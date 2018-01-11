import databench
import math
import random


class Angular(databench.Analysis):

    @databench.on
    def connected(self):
        """Run as soon as a browser connects to this."""

        inside = 0
        for draws in range(1, 10000):
            # generate points and check whether they are inside the unit circle
            r1 = random.random()
            r2 = random.random()
            if r1 ** 2 + r2 ** 2 < 1.0:
                inside += 1

            # every 100 iterations, update status
            if draws % 100 != 0:
                continue

            # debug
            yield self.emit('log', {'draws': draws, 'inside': inside})

            # calculate pi and its uncertainty given the current draws
            p = inside / draws
            uncertainty = 4.0 * math.sqrt(draws * p * (1.0 - p)) / draws

            # send status to frontend
            yield self.set_state(pi={
                'estimate': 4.0 * inside / draws,
                'uncertainty': uncertainty,
            })

        yield self.emit('log', {'action': 'done'})
