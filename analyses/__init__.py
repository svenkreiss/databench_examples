"""Databench is a tool that connects a Python analysis to a custom html
frontend. Check out the code for these examples on GitHub:
[github.com/svenkreiss/databench_examples](https://github.com/svenkreiss/databench_examples).

Databench user guide and API:
[databench.trivial.io](http://databench.trivial.io)"""

__version__ = "0.4.0"


from .flowers import analysis as  flowers_a
from .mpld3pi import analysis as mpld3pi_a
from .fastpi import analysis as fastpi_a
from .simplepi import analysis as simplepi_a
from .angular import analysis as angular_a
from .bagofcharsd3 import analysis as bagofcharsd3_a
from .mpld3Drag import analysis as mpld3Drag_a
from .mpld3PointLabel import analysis as mpld3PointLabel_a
from .redispub import analysis as redispub_a
from .redissub import analysis as redissub_a
from .helloworld import analysis as helloworld_a
from .tutorial import analysis as tutorial_a
