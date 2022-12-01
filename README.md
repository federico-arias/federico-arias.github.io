# Working on

- Why interfaces are your friends (persistence Adapters on socket.io
	and casbin) example of my rabbit class



- Inheritance and Annotations to configure a DDD presentation layer


- Extensibility in Go: methods that extend a struct and allow it to
	conform to a library by implementing an interface, i.e. `Write()` or
	`ServeHTTP`, (akin to annotations?). How that happens in Scala
    with custom methods?

    Extend functionality with composition, other code can integrate
    with yours, but you do not depend on the forced implementation
    that you inherit from the parent class. You are only constrained
    by the method signature.  That is the difference between
    `implement` and `extends`. You can *implement* both a REST
    endpoint and a WebSocket Listener from a same class, b/c you are
    not tied to a parent class. In that way you separate your code
    from the details of the presentation layer. You can have a
    ServeHTTP method (Golang) or an annotation to modify your
    method signature to the expected code (Java).

    Decorators are an alternative to subclassing.


- DSL and AST for code generation. Simplify complexity by generating
	code, an intermediate layer, not run-time compilation.
	Source-to-source compiler, example of transpilers and static site
    generators


- an interface is a machine that manufactures behavior

# Atomicity, consistency and aggregation in NoSQL databases

Most NoSQL tutorials talk about data the nice parts of this
technology: data denormalization, faster reads, sharding, etc.

Also, most of them tell you how difficult it is to achieve some
features of traditional relational databases the atomicity consistency
and aggregation. Few of them explain how to effectively achieve this.
Here, we try to breach that gap.




# Ideas


- Example use case of async generators
- Another take on generics
- RabbitMQ reconnection logic

# A use case for async generators

Async generators are a cool idea, but not one that immediately shows
where it could be used.


# Comparison between languages

Error handling/wrapping (err != nil; Result, Either, throw)
Null values (nil, type?, ?:)
Factories


# Success story: printing service

This project provided a REST endpoint that enabled clients to send
print jobs via CUPS. Before I took over the project, it wasn't able to
handle concurrent requests, it couldn't queue jobs and didn't provide
a way to retry failed jobs.

Aside from the bugs and missing functionality, the project had a
serious issue with code legibility. Here are some stats:

Lines of code
Average function length
Average number of parameters
Cyclomatic complexity

These isssues were impacting the ability of the team to make
modifications and fix bugs. Also, there was no way to test the project
locally or build it in one step.

The first thing I did was to setup end-to-end testing to reproduce the
bugs using a local PDF printer. I changed a legacy CUPS library and
started using the IPP protocol to queue jobs and manage concurrency. I
also integrated the build into a CI/CD pipeline to include all the
drivers in a Docker image.

After the project was completed, these were the stats:

Lines of code
Average function length
Average number of parameters
Average cyclomatic complexity

Here's a chart, to compare the before and after:

In summary, the resulting code had more functionality, legibility,
and had less than half of the lines of code of the original project.

git ls-files |  grep lib/ | xargs wc -l

# Success story: implementing CQRS in a microservice

Until this point, I had been wary of the CQRS pattern. I thought
it introduced unnecesary complexity to projects.

Aside from the bugs and missing functionality, the project had a
serious issue with code legibility. Here are some stats:

Lines of code
Average function length
Average number of parameters
Average cyclomatic complexity
