# Optional

Optional classes are classes that simply check if the object they are assigned to is null or not.
The reason for this class to exist is to be more specific when a return value is null.

An optional class implements the IOptional interface and has the following where T is the value type generic and G is a
new value type generic:

| Method Definition              | Description                                                                                                                                                                                          |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| hasValue() -> bool             | Returns if the value is null or not.                                                                                                                                                                 |
| getValue() -> T                | Returns the value or throws if it's null.                                                                                                                                                            |
| map((T) -> G) -> IOptional\<G> | Attempts to map the value object to a different object with the mapper function returning another optional class. Note this method should not throw but provide a object will the value set to null. |

An optional object does not need to be applied to an array as array will be of size 0 if there are no object stored in
them. There can be arrays of IOptionals hover if the need arises.