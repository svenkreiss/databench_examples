"""Testing publishing to a redis channel."""

import databench

import os
import redis
import urlparse


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


class Analysis(databench.Analysis):

    def __init__(self):
        self.redis_client = redis_creator()

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.emit('log', {'action': 'backend started'})

    def on_stats(self, msg):
        """Listens for new messages from frontend and pushes to
        redis channel."""
        self.redis_client.publish('someStatsProvider', msg)


META = databench.Meta('redispub', __name__, __doc__, Analysis)
