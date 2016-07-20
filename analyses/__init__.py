
from .angular.analysis import Angular
from .bagofcharsd3.analysis import BagOfChars
from .fastpi.analysis import FastPi
from .flowers.analysis import Flowers
from .helloworld.analysis import HelloWorld
from .redispub.analysis import RedisPub
from .redissub.analysis import RedisSub
from .simplepi.analysis import SimplePi
from .mplpi.analysis import MplPi

__version__ = "0.4.0"


analyses = [
    ('flowers', Flowers),
    ('bagofcharsd3', BagOfChars),
    ('angular', Angular),
    ('simplepi', SimplePi),
    ('mplpi', MplPi),
    ('fastpi', FastPi),
    ('redispub', RedisPub),
    ('redissub', RedisSub),
    ('helloworld', HelloWorld),
]
