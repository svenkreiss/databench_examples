"""Testing publishing to a redis channel."""

import databench

import os
import redis
import urlparse


ANALYSIS = databench.Analysis('redispub', __name__, __doc__)
ANALYSIS.thumbnail = 'redispub.png'


def redis_creator():
    """Checks enironment for certatin redis providers and creates
    a redis client."""

    rediscloudenv = os.environ.get('REDISCLOUD_URL')
    if rediscloudenv:
        url = urlparse.urlparse(rediscloudenv)
        r = redis.Redis(host=url.hostname, port=url.port,
                        password=url.password)
    else:
        r = redis.StrictRedis()

    return r


@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    ANALYSIS.signals.emit('log', {'action': 'backend started'})

    redis_client = redis_creator()

    @ANALYSIS.signals.on('stats')
    def onstats(msg):
        """Listens for new messages from frontend and pushes to
        redis channel."""

        redis_client.publish('someStatsProvider', msg)
