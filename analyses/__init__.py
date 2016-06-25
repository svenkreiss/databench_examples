
from .angular.analysis import Angular
from .bagofcharsd3.analysis import BagOfChars
from .fastpi.analysis import FastPi
from .flowers.analysis import Flowers
from .helloworld.analysis import HelloWorld
from .redispub.analysis import RedisPub
from .redissub.analysis import RedisSub
from .simplepi.analysis import SimplePi

__version__ = "0.4.0"


analyses = [
    ('flowers', Flowers),
    ('angular', Angular),
    ('fastpi', FastPi),
    ('simplepi', SimplePi),
    ('bagofcharsd3', BagOfChars),
    ('redispub', RedisPub),
    ('redissub', RedisSub),
    ('helloworld', HelloWorld),
]
