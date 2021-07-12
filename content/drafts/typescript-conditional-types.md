+++
title = "Understanding conditional types in Typescript"
description = ""
date = "2020-06-15"
draft = true
[taxonomies]
  tag = "typescript"
+++

There is an [excellent article about conditional types in Typescript]
which I do not expect to repeat or improve. I just want to provide
another approach by giving an additional example once you have read the
documentation and the article above.

This example just proceduralizes the method for


```typescript
class Emitter extends EventEmmiter {

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


[excellent article about conditional types in Typescript]:
