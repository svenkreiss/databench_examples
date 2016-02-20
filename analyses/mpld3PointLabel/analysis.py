import mpld3
import numpy as np
import matplotlib.pyplot as plt

import databench


class Analysis(databench.Analysis):

    def on_connect(self):
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
        self.emit('mpld3canvas', mpld3.fig_to_dict(fig))

        # done
        self.emit('log', {'action': 'done'})


META = databench.Meta('mpld3PointLabel', Analysis)
