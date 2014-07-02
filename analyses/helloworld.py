"""Hello World for Databench."""

import databench


ANALYSIS = databench.Analysis('helloworld', __name__)
ANALYSIS.description = __doc__


@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    ANALYSIS.signals.emit('status', {'message': 'Hello World'})
