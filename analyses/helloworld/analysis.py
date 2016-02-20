import databench


class Analysis(databench.Analysis):

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.emit('status', {'message': 'Hello World'})


META = databench.Meta('helloworld', Analysis)
