# Execution Order

When the application needs to process something a few actions are first done.
Firstly, the module service ensures there is a module that has this action registered. Either as an event, timer or
interaction.

*Note: The configuration is done during initialization, we are just checking here.*

An instance of the database source and service is created as well as the module that handles the task. The database is
connected to and passed along to any containers that need it.

The actual task function is invoked now.

Once the function has finished execution regardless if it fails or not the datasource connection is killed and all
instances are destroyed.
