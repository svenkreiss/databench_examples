import databench


class Reactandtypescript(databench.Analysis):

    @databench.on('connected')
    def connected_action(self):
        """Run as soon as a browser connects to this."""
        self.data['status'] = 'Hello World'
        yield self.emit('log', 'Set the status to "Hello World".')
