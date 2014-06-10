"""Testing publishing to a redis channel."""

import gevent
from redis import StrictRedis
from flask import copy_current_request_context

import databench


redispub = databench.Analysis('redispub', __name__)
redispub.description = __doc__
# redispub.thumbnail = 'redispub.png'

@redispub.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    redispub.signals.emit('log', {'action': 'backend started'})

    redis_client = StrictRedis()
    redis_sub = StrictRedis().pubsub()

    # listen for new messages from front end and push to redis channel
    @redispub.signals.on('stats')
    def onstats(msg):
        redis_client.publish('someStatsProvider', msg['passingUnitTests'])
