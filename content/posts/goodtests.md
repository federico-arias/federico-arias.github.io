+++
title = "A simpler approach at testing Redux middlewares"
description = ""
date = "2019-07-22"
draft = false
tags = "testing"
+++

One of the hardest parts of testing Redux components is having
to mock the store.  It seems that every project has 
its own idiosincratic way of simulating it, leaving
you with the task of understanding how they decided to
implement it. Usually, this means navigating through multiple
util packages to grok how everything was pierced together. 

Maybe that's why [this talk][bad test] made so much sense
to me. It basically claims that you should be able to understand
tests without having to read more code than what it is 
strictly necesary, even if this means duplicating your code.
That is, favor readability in spite of DRY-ness. 

In the spirit of this idea, I tried to simplify the way
I test middlewares and came up with this: 

```javascript
import api from '../middlewares/api';
import { API_REQUEST } from '../actions/api';
import fetchMock from 'fetchMock';

it('should trigger a call to fetch()', () => {
	const store = {
		getState: jest.fn(() => ({})),
		dispatch: jest.fn()
	}
	const next = jest.fn();
	const action = {type: API_REQUEST, meta: {}};

	api(store)(next)(action);
	expect(fetchMock.called).toBeTruthy;
});
```

Which, as you can see, mocks the whole store in a couple
of lines of code. Here, we are testing that the 
`API_REQUEST` action triggers a call to `fetch()`. 

This code is neither DRY nor it exposes an interface to 
enable reusability.  Probably, there are going to be 
cases when you are going to need a more complex store, 
and you'll end up writing multiple implementations for
each individual case. Writing code on a per-test basis 
might seem counter-intuitive
but you'll have to admit the readability of this line of 
code is a lot better than any obscure `mockStore()` function:

```javascript
api(store)(next)(action);
```

Which is immediately recognizable by anyone that knows
the signature of a Redux middleware function. Writing 
tests in this way ensures that whomever is reading
our code is going to immediately understang where 
we are going and doesn't need to spend a lot of time
understanding our really smart store implementation.

This might be one of the the better examples for the
old adage "clear is better than clever". 
Although I love reading clever 
code, because there is always something to
learn from it, reading it inside tests (where you
are supposed to understand what clever code is trying to
achieve) always feels like an overkill. 

[bad test]: https://www.youtube.com/watch?v=oO-FMAdjY68
