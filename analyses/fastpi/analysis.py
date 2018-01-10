import databench
import math
import random
from redis import Redis
from rq import Queue
import subprocess
import time


def inside(job, draws=100):
    """The function that will be run on the workers."""
    inside = 0
    for i in range(draws):
        time.sleep(0.001)
        r1 = random.random()
        r2 = random.random()
        if r1 ** 2 + r2 ** 2 < 1.0:
            inside += 1
    return (job, inside, draws)


class FastPi(databench.Analysis):

    @databench.on
    def workers(self, num_workers):
        """Spawns and terminates rqworkers as necessary."""

        while num_workers > len(self.active_workers):
            self.active_workers.append(subprocess.Popen(['rqworker']))

        while num_workers < len(self.active_workers):
            self.active_workers.pop().terminate()

        yield self.emit('log', {'workers': len(self.active_workers)})

    @databench.on
    def connected(self):
        """Run as soon as a browser connects to this."""

        self.active_workers = []
        yield self.workers(12)
        q = Queue(connection=Redis())

        jobs = [q.enqueue(inside, i) for i in range(100)]
        yield self.emit('log', 'enqueued {} jobs'.format(len(jobs)))

        draws_count = 0
        inside_count = 0
        while jobs:
            finished_jobs = [j for j in jobs if j.result]
            for j in finished_jobs:
                draws_count += j.result[2]
                inside_count += j.result[1]
                yield self.emit('log', {
                    'result': j.result,
                    'draws': draws_count,
                    'inside': inside_count,
                })

                p = inside_count / draws_count
                uncertainty = (4.0 * math.sqrt(draws_count * p * (1.0 - p)) /
                               draws_count)
                yield self.set_state(pi={
                    'estimate': 4.0 * p,
                    'uncertainty': uncertainty,
                })

                jobs.remove(j)

            yield None

        yield self.emit('log', {'action': 'done'})

    @databench.on
    def disconnected(self):
        # terminate all workers
        yield self.workers(0)
