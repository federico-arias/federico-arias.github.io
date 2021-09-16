+++
title = "Typescript's conditional types: a use case"
description = ""
date = "2020-06-15"
draft = true
[taxonomies]
  tag = "typescript"
+++

https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/ipp

I recommend that you

since this example just proceduralizes the method for


```typescript
class Emitter<Events> extends EventEmmiter {

	emit<T>(event: string, payload: T) {
		super(event, payload)
	}

	on<T>(
}
```

The first step is to define a union of all the events:

```typescript

type CarEvents =
	GearShifted |
	EngineStarted |
	PedalPressed

type GearShifted = {
	name: "gear.shifted",
	from: "N",
	to: "D"
}

type EngineStarted  = {
	name: "engine.started"
}

type PedalPressed = {

}
```

Then, extract the types


[excellent article about conditional types in Typescript]: https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/
