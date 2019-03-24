# tsbase
Base class libraries for TypeScript

[![Build status](https://joseph-w-bayes.visualstudio.com/tsbase/_apis/build/status/Test,%20Build,%20Archive)](https://joseph-w-bayes.visualstudio.com/tsbase/_build/latest?definitionId=7)
[![Code coverage](https://img.shields.io/azure-devops/coverage/joseph-w-bayes/50cd9014-db2f-482c-ac28-d707aa30bf98/7.svg)](https://img.shields.io/azure-devops/coverage/joseph-w-bayes/50cd9014-db2f-482c-ac28-d707aa30bf98/7.svg)

Helpful links:
- [Home page](https://tsbase.josephbayes.net/)
- [Project home](https://dev.azure.com/joseph-w-bayes/tsbase)
- [Wiki](https://dev.azure.com/joseph-w-bayes/tsbase/_wiki/wikis)

---

## Quick-start

Install tsbase inside any npm based project by running `npm i tsbase`

Import the libraries you wish to use like so:

```ts
import { Queryable, List } from 'tsbase';
```

Consume available apis:

```ts
// Instantiate a list of person
people = new List<Person>([
   new Person('John Doe', 18),
   new Person('James Doe', 27),
   new Person('Joe Doe', 20),
   new Person('Jack Doe', 45)
]);

people.Sort(p => p.name); // Sort people alphabetically

const averageAge = people.Average(p => p.age); // 27.5

const youngestPerson = people.OrderBy([p => p.age]).First(); // John Doe / 18

const seniorPeople = people.Where(
   p => p.age > people.Average(p => p.age));
```
