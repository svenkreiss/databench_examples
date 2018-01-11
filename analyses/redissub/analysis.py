import databench
import tornado.gen

from analyses.redispub.analysis import redis_creator


class RedisSub(databench.Analysis):

    def __init__(self):
        # create a connection to redis
        self.redis_client = redis_creator().pubsub()
        self.redis_client.subscribe('someStatsProvider')
        self.periodic_callback = tornado.ioloop.PeriodicCallback(
            self.check_redis, 100
        )

    @databench.on
    def connected(self):
        """Run as soon as a browser connects to this."""
        self.periodic_callback.start()
        yield self.emit('log', 'backend started')

    @databench.on
    def disconnected(self):
        self.periodic_callback.stop()

    @databench.on
    def check_redis(self):
        while True:
            m = self.redis_client.get_message()
            if not m:
                return

            print(m)
            if m and \
                    ('type' in m) and \
                    (m['type'] == 'message') and \
                    ('data' in m):
                yield self.emit('status', m['data'].decode('utf8'))
