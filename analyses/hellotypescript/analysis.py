import databench


class Hellotypescript(databench.Analysis):

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.data['status'] = 'Hello World'
