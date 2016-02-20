import databench

import os
import redis
try:
    from urllib.parse import urlparse  # Python 3
except ImportError:
    from urlparse import urlparse  # Python 2


def redis_creator():
    """Checks enironment for certatin redis providers and creates
    a redis client."""

    rediscloudenv = os.getenv('REDISCLOUD_URL')
    if rediscloudenv:
        url = urlparse(rediscloudenv)
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


META = databench.Meta('redispub', Analysis)
