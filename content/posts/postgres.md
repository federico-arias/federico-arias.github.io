---
title: "An explanation of list recursion in Postgres"
date: "2018-09-22"
---

A thing that has always puzzled me is the structure of recursive iteration in Postgres. Particulary, that th

{{< highlight sql >}}
WITH RECURSIVE descendants_of(name, father) AS (
		SELECT name, father
		FROM people
		WHERE father = 'Frank Sinatra'
	UNION ALL
		SELECT list.name, list.father
		FROM descendants_of AS accumulator, people list 
		WHERE list.father = accumulator.name
	)
	SELECT COUNT(*) AS 'Number of descendants';
{{< / highlight >}}

Maybe translating this expression to another language like Javascript might shed some light on the recursive iteration that is operated on this data structure:

{{< highlight javascript >}}
let descendantsOf = [ {name:"John", parent:"Paul"}, {}];
descendantsOf.reduce( (accumulator, row, table) => {
	return accumulator.concat(table.filter)
}, descendantsOf.filter( el => el.name === 'Frank Sinatra');
{{< / highlight >}}

Here, `WHERE` is equivalent to `filter()`, `UNION` is equivalent to `concat()` and 

This shows how Postgres 


