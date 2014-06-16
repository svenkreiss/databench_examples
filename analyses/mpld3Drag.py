"""Testing a custom mpld3 plugin to drag points.

Based on the heart_path example in the mpld3 gallery.
"""


import mpld3
import matplotlib as mpl

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


ANALYSIS = databench.Analysis('mpld3Drag', __name__)
ANALYSIS.thumbnail = 'mpld3Drag.png'
ANALYSIS.description = __doc__

@ANALYSIS.signals.on('connect')
def onconnect():
    """Run as soon as a browser connects to this."""

    # initialize plot
    fig, ax = mpl.pyplot.subplots()

    # create plot elements
    path_data = [
        (mpl.path.Path.MOVETO, (1.58, -2.57)),
        (mpl.path.Path.CURVE4, (0.35, -1.1)),
        (mpl.path.Path.CURVE4, (-1.75, 2.0)),
        (mpl.path.Path.CURVE4, (0.375, 2.0)),
        (mpl.path.Path.LINETO, (0.85, 1.15)),
        (mpl.path.Path.CURVE4, (2.2, 3.2)),
        (mpl.path.Path.CURVE4, (3, 0.05)),
        (mpl.path.Path.CURVE4, (2.0, -0.5)),
        (mpl.path.Path.CLOSEPOLY, (1.58, -2.57)),
    ]
    codes, verts = zip(*path_data)
    path = mpl.path.Path(verts, codes)
    patch = mpl.patches.PathPatch(path, facecolor='r', alpha=0.5)
    ax.add_patch(patch)

    # plot control points and connecting lines
    x, y = zip(*path.vertices[:-1])
    points = ax.plot(x, y, 'go', ms=10)
    line = ax.plot(x, y, '-k')

    ax.grid(True, color='gray', alpha=0.5)
    ax.axis('equal')
    ax.set_title("Drag Points to Change Path", fontsize=18)

    # enable custom plugin
    mpld3.plugins.connect(fig, LinkedDragPlugin(points[0], line[0], patch))
    # send plot to frontend
    ANALYSIS.signals.emit('mpld3canvas', mpld3.fig_to_dict(fig))

    ANALYSIS.signals.emit('log', {'action': 'done'})
