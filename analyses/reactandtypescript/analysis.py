import databench


class Reactandtypescript(databench.Analysis):

    @databench.on
    def connected(self):
        """Run as soon as a browser connects to this."""
        yield self.data.init({'status': 'Hello World'})
        yield self.emit('log', 'Set the status to "Hello World".')
