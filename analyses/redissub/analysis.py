"""Testing async subscription to redis channel."""

import databench

from analyses.redispub.analysis import redis_creator


class Analysis(databench.Analysis):

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.emit('log', {'action': 'backend started'})

        # create a connection to redis
        redis_client = redis_creator().pubsub()
        redis_client.subscribe('someStatsProvider')
        for m in redis_client.listen():
            self.emit('log', m)
            if ('type' in m) and (m['type'] == 'message') and ('data' in m):
                self.emit('status', m['data'])


META = databench.Meta('redissub', __name__, __doc__, Analysis)
