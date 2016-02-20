import databench

import mpld3
import matplotlib as mpl


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


class Analysis(databench.Analysis):

    def __init__(self):
        # initialize plot
        self.fig, self.ax = mpl.pyplot.subplots()

    def on_connect(self):
        """Run as soon as a browser connects to this."""

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
        self.update_plot(path_data)

        self.emit('log', {'action': 'done'})

    def update_plot(self, path_data):
        codes, verts = zip(*path_data)
        path = mpl.path.Path(verts, codes)
        patch = mpl.patches.PathPatch(path, facecolor='r', alpha=0.5)
        self.ax.add_patch(patch)

        # plot control points and connecting lines
        x, y = zip(*path.vertices[:-1])
        points = self.ax.plot(x, y, 'go', ms=10)
        line = self.ax.plot(x, y, '-k')

        self.ax.grid(True, color='gray', alpha=0.5)
        self.ax.axis('equal')
        self.ax.set_title("Drag Points to Change Path", fontsize=18)

        # enable custom plugin
        mpld3.plugins.connect(self.fig,
                              LinkedDragPlugin(points[0], line[0], patch))
        # send plot to frontend
        self.emit('mpld3canvas', mpld3.fig_to_dict(self.fig))


META = databench.Meta('mpld3Drag', Analysis)
