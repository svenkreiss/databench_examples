"""Providing "bag-of-chars" statistics."""

import databench


ANALYSIS = databench.Analysis('bagofchars', __name__, __doc__)
ANALYSIS.thumbnail = 'bagofchars.png'


@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    ANALYSIS.signals.emit('log', {
        'backend': 'started and listening for signals from frontend'
    })


@ANALYSIS.signals.on('sentence')
def onsentence(json):
    """Takes a sentence and counts the characters."""
    sentence = json['sentence'].lower()

    counts = {}
    for c in sentence:
        if ord(c) < ord('a') or \
           ord(c) > ord('z'):
            continue
        if c not in counts:
            counts[c] = sentence.count(c)

    ANALYSIS.signals.emit('log', counts)
