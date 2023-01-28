# Events

There are many Discord events. You can listen to the same event for multiple classes or just have one listen to it. As a
result of this to simplify the process events are grouped together and executed all at one go.

The way this is done is with the [`EventListener`](src/objects/eventListener.ts) class that has some variables that need
to be filled out. The first is the key which is just the Discord event to listen to. The second is the callback to be
called when the event fires. The arguments of the event is passed along to this callback to be used how the provider
sees fit.

## How Events are Executed

During setup, all event listeners are combined into a single array by event type. Then for each event type registered a
single callback is registered instead of each one from the listeners.

Whenever this callback is invoked all the arguments passed along to it will be passed along asynchronously to each
actual event. Once all promises have been settled the callback will simply check for any errors, print them then exit.
Since no event type uses a returned object they are simply ignored.