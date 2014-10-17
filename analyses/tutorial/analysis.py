"""Tutorial analysis. Just a placeholder."""

import databench

import time
import random

import mpld3
import matplotlib.pyplot as plt


class Analysis(databench.Analysis):

    def __init__(self):
        self.sleep_duration = 3
        self.fig = plt.figure(figsize=(4, 4))
        self.ax = self.fig.add_subplot(111)

    def on_sleep_duration(self, duration_in_seconds):
        self.sleep_duration = duration_in_seconds

    def on_connect(self):
        """Run as soon as a browser connects to this."""
        self.emit('log', 'backend is connected and initialized')

    def on_run(self):
        """Run when button is pressed."""
        self.emit('log', 'Hi. The run button was pressed. Going to sleep.')
        time.sleep(self.sleep_duration)
        self.emit('log', 'Waking up again. Run is done.')

        # draw something on self.fig
        # regenerate matplotlib plot
        self.ax.cla()
        self.ax.set_xlabel('output of random.random()')
        self.ax.set_ylabel('normalized distribtuion of 100 trials')
        self.ax.set_xlim(0, 1)
        self.ax.set_ylim(0, 1.5)
        self.ax.grid(True)
        self.ax.hist(
            [random.random() for i in xrange(100)], 5,
            normed=1, facecolor='green', alpha=0.75
        )
        self.emit('mpld3canvas', mpld3.fig_to_dict(self.fig))

        # create the data for the Basic d3.js part
        data = [
            {'id': 1, 'x1': 0.1, 'y1': 0.1, 'x2': 0.8, 'y2': 0.5,
             'width': 0.05, 'color': 0.5},
            {'id': 2, 'x1': 0.1, 'y1': 0.3, 'x2': 0.8, 'y2': 0.7,
             'width': 0.05, 'color': 0.7},
            {'id': 3, 'x1': 0.1, 'y1': 0.5, 'x2': 0.8, 'y2': 0.9,
             'width': 0.05, 'color': 0.9},
        ]
        self.emit('update', data)
        # update with some new data after a short wait
        time.sleep(1)
        data2 = [
            {'id': 1, 'x1': 0.1, 'y1': 0.1, 'x2': 0.8, 'y2': 0.5,
             'width': 0.2, 'color': 0.5},
            {'id': 2, 'x1': 0.1, 'y1': 0.3, 'x2': 0.8, 'y2': 0.7,
             'width': 0.2, 'color': 0.7},
            {'id': 3, 'x1': 0.1, 'y1': 0.5, 'x2': 0.8, 'y2': 0.9,
             'width': 0.2, 'color': 0.9},
        ]
        self.emit('update', data2)


META = databench.Meta('tutorial', __name__, __doc__, Analysis)
