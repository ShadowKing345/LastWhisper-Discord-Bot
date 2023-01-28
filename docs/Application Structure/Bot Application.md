# Bot application

The second entry point is for the main bot application. This is a class called `Bot` found in
the [`bot.ts`](src/objects/bot.ts) file. Found inside this class is the init, run, and stop functions.

These functions control the general actions of the application.

`init` will perform all the actions needed to ensure the application can run and handle Discord requests. This includes
registering the various event handles and timers as well as what commands will be used by the application.

The `run` function simply runs the bot. This is all it does.

Finally, `stop` as the name implies stops the application from running and begins the teardown procedure. Meaning all
timers are stopped and any database instances if running are killed. Generally speaking NodeJs should be able to clearly
exit after this command has been ran.