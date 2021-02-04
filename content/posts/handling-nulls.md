+++
title = "Handling nulls and undefineds with Value Objects in Go"
description = ""
date = "2020-01-22"
draft = true
tags = ""
+++

Deserialization is one of the most everyday tasks in every programming
language.

In Go, it looks something like this: you have a data
structure like the following:

```go
type Person struct {
Name string `json:"name"`
Age int64 `json:"age"`
}
```

Then, you map these values to the fields in a JSON object (or some
other data format).

One of the shortcomings of this approach is that
primitive data types are not always the best containers for your data.
What happens if someone declares his/her age to be 1000 years? How do
you encapsulate that validation? Another big issue is that, in Go, its
primitive types are never null or undefined: they are zero-valued at
the moment of variable declaration. For example:

```go
var someInt int
fmt.Println(someInt == 0) // true
```

If we are not aware of this fact, we might
think there is a perfect correspondence between these values:

JSON | SQL  | Go
---  | ---  | ---
null | NULL | nil

This is not the case.

What happens then when we need to talk to systems that ***do
differentiate*** between null and zero values?  What do we need
to do to avoid that a null or undeclared field in
JSON ends up being stored as 0 or an empty string in our
database?

Let's take this struct:

```go
type Person struct {
Name string `json:"name"`
Age int64 `json:"age"`
}
```

In the common scenario in which a JSON payload is sent to the
server, we might find this representation of our Person entity:

```json
{
	"name": "John Snow"
}
```

To avoid reading the age field as 0, we have to create a custom
unmarshaler (an idea I stole from
[here](https://www.calhoun.io/how-to-determine-if-a-json-key-has-been-set-to-null-or-not-provided/)).

```go
type NullInt64 struct {
	Defined bool
	sql.NullInt64
}

func (i *NullInt64) UnmarshalJSON(data []byte) error {
	// If this method was called, the value was set.
	i.Defined = true

	if string(data) == "null" {
		// The JSON key was null
		i.Valid = false
		return nil
	}

	// The key isn't set to null
	var temp int64
	if err := json.Unmarshal(data, &temp); err != nil {
		return err
	}
	i.Int64 = temp
	i.Valid = true
	return nil
}
```

Notice that the NullInt64 struct inherits the properties of
`sql.NullInt64`, a struct that gives us a `Valid` field with which we
can represent if the field is null or not in a SQL database.  If we
store this value in Postgres, for example, the driver is going to
interpret this as `NULL` and store it accordingly. Here, we are using a
common vocabulary to translate between different serialization formats
and programming languages.

In the same vein, if we wanted to scan a `null` value, we
can't store it in one of Go's primitive types, we have to
create a new type that implements the `Marshal` interface:

```go
func (i NullInt64) MarshalJSON(data interface{}) (response []byte, err error) {
	if i.Valid == true{
		return json.Marshal(i.Int64)
	}
	return []byte("null"), nil
}
```

Notice that, in this case, **we don't use a pointer method
receiver**. This is because we do not pass a pointer to
`json.Marshal`, we pass a value, which must implement the
`json.Marshaler` interface.

With this solution we can have a type that we can use to unmarshal
values from a json payload and also a type that can be used to
validate input. In DDD parlance, a DTO and a Value Object.

## Case: parse a null value and store it as null in the DB
