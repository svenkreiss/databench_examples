import databench


class HelloWorld(databench.Analysis):

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.emit('status', 'Hello World')


META = databench.Meta('helloworld', HelloWorld)
