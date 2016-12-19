import databench


class HelloReact(databench.Analysis):

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.data['status'] = 'Hello World'

    def on_ack(self, message):
        """process 'ack' action"""
        self.emit('log', 'ack received {}'.format(message))
