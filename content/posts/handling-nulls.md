+++
title = "Handling nulls and undefined in Go"
description = ""
date = "2020-01-22"
draft = true
tags = ""
+++

One of the particularities of Go is that its primitive types
are never null or undefined: they are zero-valued at the moment
of variable declaration. For example:

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
Age int64 `json:"name"`
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
unmarshaler (an idea I took from [here](http://)).

```go
type NullInt64 struct {
	Defined bool
	sql.NullInt64
}

func (i *NullInt64) UnmarshalJSON(data []byte) error {
	// If this method was called, the value was set.
	i.Defined = true

	if string(data) == "null" {
		// The key was set to null
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
`sql.NullInt64`, a struct that gives us a `Valid` field with
which we can represent if the field is null or not. If we
store this value in a database, the driver is going to interpret
this as `NULL` and store it accordingly.

In the same vein, if we wanted to scan a `NULL` value, we
can't store it in one of Go's primitive types, we have to


```go
func (i *NullInt64) MarshalJSON(data interface{}) (response []byte, err error) {
	if i.Valid == true{
		return json.Marshal(i.Int64)
	}
	return []byte("null"), nil
}
```
