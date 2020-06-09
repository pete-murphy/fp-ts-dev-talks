import { Eq } from "fp-ts/lib/Eq";
import { Option, some } from "fp-ts/lib/Option";
import { Task } from "fp-ts/lib/Task";

// Function signatures:
//  A => B

//  Array<A> = [A, A, A]
const myArray: Array<string> = ["Bob", "Alice", "Susan"];

//  Option<A> = None | Some<A>
const myOption: Option<string> = some("Bob");

//  Task<A> () => Promise<A>
const myTask: Task<string> = () => Promise.resolve("Bob");

//  Typeclasses
//  A way of making an "interface" that is separate from the value.

// ********
// *** Instead of:
// ********
interface IEqual {
  equals(i: IEqual): boolean;
}
class UserC implements IEqual {
  constructor(public id: string, public name: string) {}
  equals(u: IEqual): boolean {
    if (u instanceof UserC) {
      return u.id === this.id;
    } else {
      return false;
    }
  }
}

declare function uniqueI(things: Array<IEqual>): Array<IEqual>;

// ********
// *** We have:
// ********

interface Equals<A> {
  equals(x: A, y: A): boolean;
}

type User = {
  id: string;
  name: string;
};

const userEq: Equals<User> = {
  equals: (userA, userB) => userA.id === userB.id
};

declare function unique<A>(eq: Equals<A>, things: Array<A>): Array<A>;
