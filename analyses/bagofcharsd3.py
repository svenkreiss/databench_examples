"""Providing "bag-of-chars" statistics.

Don't google bag-of-chars. I just made that up.
"""

import math
from time import sleep
from random import random

import databench


bagofcharsd3 = databench.Analysis('bagofcharsd3', __name__)
bagofcharsd3.description = __doc__
bagofcharsd3.thumbnail = 'bagofcharsd3.png'

@bagofcharsd3.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""
    bagofcharsd3.signals.emit('log', {
        'backend': 'started and listening for signals from frontend'
    })

@bagofcharsd3.signals.on('sentence')
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

    bagofcharsd3.signals.emit('log', counts)
    bagofcharsd3.signals.emit('counts', counts)
