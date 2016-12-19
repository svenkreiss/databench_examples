import databench
import tornado.gen

from analyses.redispub.analysis import redis_creator


class RedisSub(databench.Analysis):

    @tornado.gen.coroutine
    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.emit('log', 'backend started')

        # create a connection to redis
        redis_client = redis_creator().pubsub()
        redis_client.subscribe('someStatsProvider')

        while True:
            m = redis_client.get_message()
            if m:
                print(m)
            if m and \
                    ('type' in m) and \
                    (m['type'] == 'message') and \
                    ('data' in m):
                self.emit('status', m['data'].decode('utf8'))
            yield tornado.gen.sleep(0.01)
