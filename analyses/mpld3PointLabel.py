import math
from time import sleep
from random import random

import numpy as np
import matplotlib.pyplot as plt, mpld3

import databench



signals = databench.Signals('mpld3PointLabel')

@signals.on('connect')
def onconnect():
	fig, ax = plt.subplots()
	points = ax.scatter(np.random.rand(40), np.random.rand(40),
	                    s=300, alpha=0.3)

	labels = ["Point {0}".format(i) for i in range(40)]
	tooltip = mpld3.plugins.PointLabelTooltip(points, labels)

	mpld3.plugins.connect(fig, tooltip)
	signals.emit('mpld3canvas', mpld3.fig_to_dict(fig))
	signals.emit('log', {'action': 'done'})


mpld3PointLabel = databench.Analysis('mpld3PointLabel', __name__, signals)
mpld3PointLabel.description = "Testing the PointLabelTooltip plugin of mpld3."
