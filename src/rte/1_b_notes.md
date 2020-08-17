# RTE: An Improvement on Promise

First, let's talk about Promise...


Promise<User>

Consider the type `Promise<User>`.
  - It represents an asynchronous task that will return a `User`.
  - In what ways can this task fail?
  - what types of errors can it raise? 
  - What dependencies does this task need in order to execute?
  - Can we swap those dependencies at runtime, to make testing easier with mocks, 
  - or change the underlying behavior in different envrionments?

