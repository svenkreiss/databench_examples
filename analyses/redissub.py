"""Testing async subscription to redis channel."""

import gevent
from redis import StrictRedis
from flask import copy_current_request_context

import databench


redissub = databench.Analysis('redissub', __name__)
redissub.description = __doc__
# redissub.thumbnail = 'redissub.png'

@redissub.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    redissub.signals.emit('log', {'action': 'backend started'})

    redis_client = StrictRedis()
    redis_sub = StrictRedis().pubsub()


    @copy_current_request_context
    def listener():
        redis_sub.subscribe('someStatsProvider')
        for m in redis_sub.listen():
            redissub.signals.emit('log', m)
            if 'type' in m  and  m['type'] == 'message'  and  'data' in m:
                redissub.signals.emit('status', m['data'])
    greenlet = gevent.Greenlet.spawn(listener)


    @redissub.signals.on('disconnect')
    def ondisconnect():
        greenlet.join()
