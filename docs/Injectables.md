## Table of Content
<!-- TOC -->
  * [Table of Content](#table-of-content)
  * [Using Injectables](#using-injectables)
<!-- TOC -->

## Using Injectables

Injectables or dependency injection is the method of providing some level of inversion of control to the application.
The general idea is separate dependencies in such a way that if you swap out a class for a different class that uses the
same interface or base class, classes that depend on it will not be able to tell something changed when attempting to
get the dependency.

The application uses [`tsyringe`](https://github.com/microsoft/tsyringe) as its dependency injector.
