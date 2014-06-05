"""Providing "bag-of-chars" statistics.

Don't google bag-of-chars. I just made that up.
"""

import math
from time import sleep
from random import random

import databench


bagofchars = databench.Analysis('bagofchars', __name__)
bagofchars.description = __doc__
# bagofchars.thumbnail = 'bagofchars.png'

@bagofchars.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    bagofchars.signals.emit('log', {
        'backend': 'started and listening for signals from frontend'
    })

@bagofchars.signals.on('sentence')
def onsentence(json):
    """Takes a sentence and counts the characters."""
    sentence = json['sentence'].lower()

    counts = {}
    for c in sentence:
        if ord(c) < ord('a')  or  ord(c) > ord('z'):
            continue
        if c not in counts:
            counts[c] = sentence.count(c)

    bagofchars.signals.emit('log', counts)
