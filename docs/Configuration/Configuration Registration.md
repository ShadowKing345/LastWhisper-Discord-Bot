# Configuration Registration

This class provides a collection of functions to register a configuration from the main configuration file into the
dependency injection system.

When called, providing a key and object type, the class will get the configuration key value pair from the main file and
attempt a merge of the object and config values. Finally, it registers it.

This method allows for defaults values and methods inside the configuration object class to be preserved while only
overriding what is necessary.

The registered configuration is provided in a IOptional class object. Assuming there was not a critical fault when
building the configuration but the configuration was not found the value of this class should be empty.

Due to the limitation of ts and the dependency injection system when attempting to call a configuration class you must
call it as such.
`IOptional<{ObjectClassName}>` where ObjectClassName can be the static `.name` value of a class.