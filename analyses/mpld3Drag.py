"""
This is based on http://mpld3.github.io/examples/heart_path.html.
"""

import math
from time import sleep
from random import random

import numpy as np
import matplotlib.pyplot as plt, mpld3
import matplotlib as mpl
import matplotlib.path as mpath
import matplotlib.patches as mpatches

import databench


class LinkedDragPlugin(mpld3.plugins.PluginBase):

    def __init__(self, points, line, patch):
        if isinstance(points, mpl.lines.Line2D):
            suffix = "pts"
        else:
            suffix = None

        self.dict_ = {"type": "drag",
                      "idpts": mpld3.utils.get_id(points, suffix),
                      "idline": mpld3.utils.get_id(line),
                      "idpatch": mpld3.utils.get_id(patch)}



signals = databench.Signals('mpld3Drag')

@signals.on('connect')
def onconnect():
	fig, ax = plt.subplots()

	Path = mpath.Path
	path_data = [
	    (Path.MOVETO, (1.58, -2.57)),
	    (Path.CURVE4, (0.35, -1.1)),
	    (Path.CURVE4, (-1.75, 2.0)),
	    (Path.CURVE4, (0.375, 2.0)),
	    (Path.LINETO, (0.85, 1.15)),
	    (Path.CURVE4, (2.2, 3.2)),
	    (Path.CURVE4, (3, 0.05)),
	    (Path.CURVE4, (2.0, -0.5)),
	    (Path.CLOSEPOLY, (1.58, -2.57)),
	    ]
	codes, verts = zip(*path_data)
	path = mpath.Path(verts, codes)
	patch = mpatches.PathPatch(path, facecolor='r', alpha=0.5)
	ax.add_patch(patch)

	# plot control points and connecting lines
	x, y = zip(*path.vertices[:-1])
	points = ax.plot(x, y, 'go', ms=10)
	line = ax.plot(x, y, '-k')

	ax.grid(True, color='gray', alpha=0.5)
	ax.axis('equal')
	ax.set_title("Drag Points to Change Path", fontsize=18)

	mpld3.plugins.connect(fig, LinkedDragPlugin(points[0], line[0], patch))

	signals.emit('mpld3canvas', mpld3.fig_to_dict(fig))
	signals.emit('log', {'action': 'done'})


mpld3Drag = databench.Analysis('mpld3Drag', __name__, signals)
mpld3Drag.thumbnail = 'mpld3Drag.png'
mpld3Drag.description = "Testing a custom mpld3 plugin to drag points. Based on the heart_path example in the mpld3 gallery."
