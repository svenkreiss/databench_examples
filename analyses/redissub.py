"""Testing async subscription to redis channel."""

import databench

import gevent
from analyses.redispub import redis_creator
from flask import copy_current_request_context


ANALYSIS = databench.Analysis('redissub', __name__, __doc__)
ANALYSIS.thumbnail = 'redissub.png'


@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""

    ANALYSIS.signals.emit('log', {'action': 'backend started'})

    # create a connection to redis
    redis_client = redis_creator().pubsub()

    # asynchronously listen to a redis channel
    @copy_current_request_context
    def listener():
        """Runs inside a spawned greenlet to asynchronously listen."""

        redis_client.subscribe('someStatsProvider')
        for m in redis_client.listen():
            ANALYSIS.signals.emit('log', m)
            if ('type' in m) and (m['type'] == 'message') and ('data' in m):
                ANALYSIS.signals.emit('status', m['data'])
    greenlet = gevent.Greenlet.spawn(listener)

    @ANALYSIS.signals.on('disconnect')
    def ondisconnect():
        """Cleanup greenlet."""

        greenlet.join()
