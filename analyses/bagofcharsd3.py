"""Providing "bag-of-chars" statistics.

Don't google bag-of-chars. I just made that up.
"""

import databench


ANALYSIS = databench.Analysis('bagofcharsd3', __name__)
ANALYSIS.description = __doc__
ANALYSIS.thumbnail = 'bagofcharsd3.png'

@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    ANALYSIS.signals.emit('log', {
        'backend': 'started and listening for signals from frontend'
    })

@ANALYSIS.signals.on('sentence')
def onsentence(json):
    """Takes a sentence and counts the characters."""
    if 'sentence' not in json:
        return
    sentence = json['sentence'].lower()

    counts = {}
    for c in sentence:
        if ord(c) < ord('a')  or  ord(c) > ord('z'):
            continue
        if c not in counts:
            counts[c] = sentence.count(c)

    ANALYSIS.signals.emit('log', counts)
    ANALYSIS.signals.emit('counts', counts)
