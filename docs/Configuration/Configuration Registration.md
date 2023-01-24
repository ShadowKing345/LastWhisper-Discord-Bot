# Configuration Registration

The service class [`ConfigurationService`](/src/config/configurationService.ts) provides a collection of functions that
help managing configurations. It can register the configuration into the dependency injection container as well as
simply return the configuration if present.

The first thing the service does is create the configuration object before attempting to provide a response. This object
is a flattened map of the configuration file merged into one object.

The keys of this map are the configuration variable names joined by `.`. For example

```json
{
  "foo": {
    "fish": {
      "33": false
    }
  }
}
```

Would appear as `foo.fish.33 = false` inside object map.

This service also handles the combining of the developer config and the production config if the `NODE_ENV` environment variable has been set
to `development`.