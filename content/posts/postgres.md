+++
title = "A comparative explanation of recursion in PostgreSQL"
date = "2018-09-22"
+++

One of PostgreSQL features that I had the most trouble getting my head around was the use of `WITH RECURSION`, particularly due to the fact that this type of recursion doesn't resemble any of the examples of this concept that I had previously encountered. Even [Postgres' documentation][psql-doc] aknowledges this:

> Strictly speaking, this process is iteration not recursion, but RECURSIVE is the terminology chosen by the SQL standards committee.

Let's look at an example to see what we are talking about. The following code takes the table `people` and lists all the descendants of 'Frank Sinatra' using the `father` field . It starts by selecting all of Sinatra's children and then all of his children's children and so on until it reaches the point where there are no more results. 

```sql
WITH RECURSIVE descendants_of(name, father) AS (
		SELECT name, father
		FROM people
		WHERE father = 'Frank Sinatra'
	UNION ALL
		SELECT list.name, list.father
		FROM descendants_of AS accumulator, 
			people AS list 
		WHERE list.father = accumulator.name
	)
	SELECT name, father FROM descendants_of;
```

PostgreSQL does this by creating a temporary working table (`descendants_of`), populating it with the results of the first select and then using it to filter the results against the `people` table. 

This might not seem like the traditional recursive function that we all know, but in a closer look, we can find some parallels with a recursive [tail call][tail-call]. Let's transform this code to Javascript to examine some similarities:

```javascript 
// SELECT name, father FROM people WHERE father = 'Frank Sinatra'
with(people, people.filter( row => row.father === 'Frank Sinatra'))

function with(list, accumulator) {
	//WHERE list.father = accumulator.name
	let children = list.filter(row => row.father === accumulator.name);
	// this check is implicit in WITH RECURSIVE
	if (children.length === 0) return accumulator;
	// recursive call to traverse the list
	return with(list, accumulator.concat(children));
}
```

Here, Javascript's `filter()` is akin to SQL's `WHERE` while `concat()` acts as a replacement of `UNION ALL`. The above function performs a recursive call and passes itself the complete 'table' of family relationships as first argument and, as second argument, the rows of the table (or the objects in the array) which meet the condition `row.father == accumulator.name`.

Both pieces of code make use of the same conceptual understanding of recursion, comprised of a data structure like a linked list and an accumulator, which stores the results in the succesive iterations.

[psql-doc]: https://www.postgresql.org/docs/9.1/static/queries-with.html#QUERIES-WITH-SELECT
[tail-call]: https://en.wikipedia.org/wiki/Tail_call

