# Configuration Registration

This class provides a collection of functions to register a configuration from the main configuration file into the
dependency injection system.

When called, providing a key and object type, the class will get the configuration key value pair from the main file and
attempt a merge of the object and config values. Finally, it registers it.

This method allows for defaults values and methods inside the configuration object class to be preserved while only
overriding what is necessary.