# Redis Publishing

This demo generates numbers and publishes them to a Redis channel. The name of the entity these numbers are generated for is chosen at random and shown next to the _Generator_ headline below. You can interactively change the speed at which the generated numbers change.

Publishing numbers is the easy part. The interesting part happens in the `redissub` demo while keeping this demo open in another browser window. Or even more interesting, keep a few of these open.
