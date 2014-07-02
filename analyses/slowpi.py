"""Calculating \\(\\pi\\) the redis-queue way ... yes, in parallel."""

import databench

import math
from time import sleep
from random import random

from redis import Redis
from rq import Queue


ANALYSIS = databench.Analysis('slowpi', __name__, __doc__)
ANALYSIS.thumbnail = 'slowpi.png'


def inside(job, draws=100):
    inside = 0
    for i in range(draws):
        sleep(0.001)
        r1, r2 = (random(), random())
        if r1*r1 + r2*r2 < 1.0:
            inside += 1
    return (job, inside, draws)


@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""

    q = Queue(connection=Redis())

    jobs = []
    for i in range(100):
        jobs.append(q.enqueue(inside, i))
        ANALYSIS.signals.emit('log', {'enqueued_job': i})

    draws_count = 0
    inside_count = 0
    while jobs:
        new_job_list = []
        for j in jobs:
            if j.result:
                draws_count += j.result[2]
                inside_count += j.result[1]
                ANALYSIS.signals.emit('log', {
                    'result': j.result,
                    'draws': draws_count,
                    'inside': inside_count,
                })

                uncertainty = 4.0*math.sqrt(
                    draws_count*inside_count/draws_count *
                    (1.0 - inside_count/draws_count)
                ) / draws_count
                ANALYSIS.signals.emit('status', {
                    'pi-estimate': 4.0*inside_count/draws_count,
                    'pi-uncertainty': uncertainty,
                })
            else:
                new_job_list.append(j)
        jobs = new_job_list
        sleep(0.1)

    ANALYSIS.signals.emit('log', {'action': 'done'})
