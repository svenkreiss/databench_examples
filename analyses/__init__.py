"""Databench is a tool that connects a Python analysis to a custom html
frontend. It provides various handy tools like `markdown` and `MathJax` to
mark up the frontend. It also includes a connector from `matplotlib` to
`d3.js` using `mpld3`. It even allows for the frontend to make use of
`angular.js`. Check out the code for these examples on GitHub:
[github.com/svenkreiss/databench_examples](https://github.com/svenkreiss/databench_examples).

Databench user guide and API:
[svenkreiss.com/databench/](http://www.svenkreiss.com/databench/)"""

__version__ = "0.3.0"


import flowers.analysis
import mpld3pi.analysis
import fastpi.analysis
import simplepi.analysis
# import mpld3PointLabel.anslysis
# import mpld3Drag.analysis
# import bagofchars.analysis
import bagofcharsd3.analysis
import angular.analysis
# import redispub.analysis
# import redissub.analysis
import helloworld.analysis
