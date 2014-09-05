"""Calculating \\(\\pi\\) the redis-queue way ... yes, in parallel."""

import databench

import math
import time
import random
import subprocess

from redis import Redis
from rq import Queue


def inside(job, draws=100):
    """The function that will be run on the workers."""
    inside = 0
    for i in xrange(draws):
        time.sleep(0.001)
        r1 = random.random()
        r2 = random.random()
        if r1*r1 + r2*r2 < 1.0:
            inside += 1
    return (job, inside, draws)


class Analysis(databench.Analysis):

    def __init__(self):
        self.workers = []

    def on_workers(self, num_workers):
        """Spawns and terminates rqworkers as necessary."""

        while num_workers > len(self.workers):
            self.workers.append(subprocess.Popen(['rqworker']))

        while num_workers < len(self.workers):
            self.workers.pop().terminate()

        self.emit('log', {'workers': len(self.workers)})

    def on_connect(self):
        """Run as soon as a browser connects to this."""

        q = Queue(connection=Redis())

        jobs = []
        for i in xrange(100):
            jobs.append(q.enqueue(inside, i))
            self.emit('log', {'enqueued_job': i})

        draws_count = 0
        inside_count = 0
        while jobs:
            finished_jobs = [j for j in jobs if j.result]
            for j in finished_jobs:
                draws_count += j.result[2]
                inside_count += j.result[1]
                self.emit('log', {
                    'result': j.result,
                    'draws': draws_count,
                    'inside': inside_count,
                })

                uncertainty = 4.0*math.sqrt(
                    draws_count*inside_count/draws_count *
                    (1.0 - inside_count/draws_count)
                ) / draws_count
                self.emit('status', {
                    'pi-estimate': 4.0*inside_count/draws_count,
                    'pi-uncertainty': uncertainty,
                })

                jobs.remove(j)
            time.sleep(0.1)

        self.emit('log', {'action': 'done'})

    def on_disconnect(self):
        # terminate all workers
        self.on_workers(0)


META = databench.Meta('fastpi', __name__, __doc__, Analysis)
