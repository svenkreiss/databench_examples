# Redis Subscription

You need an async listener to subscribe to a Redis channel. This can be done with a `gevent.Greenlet`. The listener forwards all incoming messages via `signals.emit()` to the frontend. In this demo, the frontend splits the message into a (key,value) pair and updates its internal data. It keeps track of when it received the last message and only keeps values that were received less than 1.5s ago. This data is handed to a custom `d3.js` element that handles the creation and deletion of status boxes and the update of the values in the Dashboard view.

You need something that publishes to the channel. The `redispub` demo does just that, so you need to run the two demos in two browser windows in parallel. All users subscribe to the same messages and publish to the same system.
