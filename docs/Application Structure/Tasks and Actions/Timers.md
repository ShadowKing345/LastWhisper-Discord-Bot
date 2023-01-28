# Timers

Timers are tasks that relatively execute after a certain amount of time has passed.
To create a timer a [`Timer`](src/objects/timer.ts) object is registered.

The `Timer` object only has a few variables that need to be filled out. 

The first is the `name` of the timer. This has to
be unique for each timer to provide some method of referencing them (even tho the name parameter is never used outside
of storage).

The second is the `timeout number`. This is the same as a `setInterval` ms variable being the milliseconds between each
invocation of the callback.

Finally, is the `callback`. This is simpy the callback to be executed when the timer is invoked. The only parameter
provided here is the application object.

# Execution of Timers

During setup, the following occurs.

The `Module Service` first creates the `setInterval` callbacks for each timer registered. After this is done then all timers are invoked one. This is done because `setInterval` only executes the first timer after the amount has passed meaning if you cannot invoke a callback on 0ms past the point of creation.

`setInterval` will return an ID unique to itself. These IDs are stored to stop the timers during teardown of the application.