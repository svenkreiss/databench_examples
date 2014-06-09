"""Hello World for Databench."""

import databench


helloworld = databench.Analysis('helloworld', __name__)
helloworld.description = __doc__

@helloworld.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""    
    helloworld.signals.emit('log', {'message': 'Hello World'})
