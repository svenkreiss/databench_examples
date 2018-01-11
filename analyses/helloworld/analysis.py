import databench


class HelloWorld(databench.Analysis):

    @databench.on
    def connected(self):
        """Run as soon as a browser connects to this."""
        self.set_state(status='Hello World')
