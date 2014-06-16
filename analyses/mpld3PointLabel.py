"""Testing the PointLabelTooltip plugin of mpld3."""

import mpld3
import numpy as np
import matplotlib.pyplot as plt

import databench


ANALYSIS = databench.Analysis('mpld3PointLabel', __name__)
ANALYSIS.thumbnail = 'mpld3PointLabel.png'
ANALYSIS.description = __doc__

@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""

    fig, ax = plt.subplots()
    points = ax.scatter(
        np.random.rand(40),
        np.random.rand(40),
        s=300,
        alpha=0.3,
    )

    # use the mpld3 tooltop plugin
    labels = ["Point {0}".format(i) for i in range(40)]
    tooltip = mpld3.plugins.PointLabelTooltip(points, labels)
    mpld3.plugins.connect(fig, tooltip)

    # send the plot to the frontend
    ANALYSIS.signals.emit('mpld3canvas', mpld3.fig_to_dict(fig))

    # done
    ANALYSIS.signals.emit('log', {'action': 'done'})
