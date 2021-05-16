+++
title = "A comparative explanation of recursion in PostgreSQL"
date = "2018-09-22"
tags = [
	"postgres",
	]
+++

One of PostgreSQL features that I had the most trouble getting
my head around was the use of `WITH RECURSION`, particularly due
to the fact that this type of recursion doesn't resemble any of
the examples of this concept that I had previously encountered.
Even [Postgres' documentation][psql-doc] aknowledges this:

> Strictly speaking, this process is iteration not recursion, but RECURSIVE is the terminology chosen by the SQL standards committee.

Let's look at an example to see what we are talking about.
The following code takes the table `people` and lists all the
descendants of 'Frank Sinatra' using the `father` field.
It starts by selecting all of Sinatra's children and then all
of his children's children and so on until it reaches the point
where there are no more results.

```sql
WITH RECURSIVE descendants_of(name, father) AS (
		SELECT name, father
		FROM people
		WHERE father = 'Frank Sinatra'
	UNION ALL
		SELECT list.name, list.father
		FROM descendants_of AS working_table,
			people AS list
		WHERE list.father = working_table.name
	)
	SELECT name, father FROM descendants_of;
```

PostgreSQL does this by creating a temporary working table (`descendants_of`), populating it with the results of the first select and then using it to filter the results against the `people` table.

This might not seem like the traditional recursive function that we all know, but in a closer look, we can find some parallels with a recursive [tail call][tail-call]. Let's transform this code to Javascript to examine some similarities:

```javascript
// SELECT name, father FROM people WHERE father = 'Frank Sinatra'
with(
	people,
	people.filter( row => row.father === 'Frank Sinatra'),
	people.filter( row => row.father === 'Frank Sinatra')
)

function with(list, accumulator, workingTable) {
	//WHERE list.father = accumulator.name
	let children = list.filter(row => row.father === workingTable.name);
	// this check is implicit in WITH RECURSIVE
	if (children.length === 0) return accumulator;
	// recursive call to traverse the list
	return with(list, accumulator.concat(children), children);
}
```

Here, Javascript's `filter()` is akin to SQL's `WHERE`
while `concat()` acts as a replacement of `UNION ALL`.
The above function performs a recursive call and passes
itself the complete 'table' of family relationships as
first argument and, as second argument, the rows of the
table (or the objects in the array) which meet the
condition `row.father == workingTable.name`.

Both pieces of code make use of the same conceptual
understanding of recursion, comprised of **(i)** a data
structure akin to a linked list and **(ii)** an accumulator,
which stores the results in succesive iterations.

If we look at the manual, we read that this expression uses two
tables:

> For UNION (but not UNION ALL), discard duplicate rows and
rows that duplicate any previous result row. Include all
remaining rows in the result of the recursive query, and also place
them in a temporary intermediate table.

In the above code, the `children` variable acts as an intermediate
table in which the result of the query over the working table
is stored. In the next iteration, the intermediate table, as its
names indicates, becomes the working table.

[psql-doc]: https://www.postgresql.org/docs/9.1/static/queries-with.html#QUERIES-WITH-SELECT
[tail-call]: https://en.wikipedia.org/wiki/Tail_call
