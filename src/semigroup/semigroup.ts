import {
  Semigroup,
  getFirstSemigroup,
  getLastSemigroup,
  getMeetSemigroup,
  getJoinSemigroup,
  getStructSemigroup,
  getFunctionSemigroup,
  semigroupAll,
  fold as foldSemigroup
} from "fp-ts/lib/Semigroup";
import { fromFoldable } from "fp-ts/lib/Map";
import { ordString, contramap, ordNumber, getTupleOrd } from "fp-ts/lib/Ord";
import { array } from "fp-ts/lib/Array";
import { getApplySemigroup, some, none } from "fp-ts/lib/Option";

// Binary associativity

// Number
const numberFn1 = (a: number, b: number, c: number) => a * b * c;

const numberFn2 = (a: number, b: number, c: number) => a * (b * c);

const numberFn3 = (a: number, b: number, c: number) => a * b * c;

console.log(numberFn1(2, 3, 4));

console.log(numberFn2(2, 3, 4));

console.log(numberFn3(2, 3, 4));

// String
const stringFn1 = (a: string, b: string, c: string) => a + " " + b + " " + c;

const stringFn2 = (a: string, b: string, c: string) => a + " " + (b + " " + c);

const stringFn3 = (a: string, b: string, c: string) => a + " " + b + " " + c;

console.log(stringFn1("Hello", "World", "New"));

console.log(stringFn2("Hello", "New", "World"));

console.log(stringFn3("Hello", "New", "World"));

// Boolean
const booleanFn1 = (a: boolean, b: boolean, c: boolean) => a && b && c;

const booleanFn2 = (a: boolean, b: boolean, c: boolean) => a && b && c;

const booleanFn3 = (a: boolean, b: boolean, c: boolean) => a && b && c;

console.log(booleanFn1(true, false, true));

console.log(booleanFn2(true, false, true));

console.log(booleanFn3(true, false, true));

// Semigroup Associativity

const semigroupProduct: Semigroup<number> = {
  concat: (x, y) => x * y
};

console.log(semigroupProduct.concat(3, 4));
console.log(semigroupProduct.concat(semigroupProduct.concat(3, 4), 5));
console.log(semigroupProduct.concat(3, semigroupProduct.concat(4, 5)));

const semigroupSumNumber: Semigroup<number> = {
  concat: (x, y) => x + y
};

console.log(semigroupSumNumber.concat(3, 4));
console.log(semigroupSumNumber.concat(semigroupSumNumber.concat(3, 4), 5));
console.log(semigroupSumNumber.concat(3, semigroupSumNumber.concat(4, 5)));

const semigroupSumString: Semigroup<string> = {
  concat: (x, y) => x + y
};

console.log(semigroupSumString.concat("Hello", "New"));
console.log(
  semigroupSumString.concat(semigroupSumString.concat("Hello", "New"), "World")
);
console.log(
  semigroupSumString.concat("Hello", semigroupSumString.concat("New", "World"))
);

const semigroupFirstString: Semigroup<string> = {
  concat: (x, y) => x
};

console.log(semigroupFirstString.concat("Hello", "New"));
console.log(
  semigroupFirstString.concat(
    semigroupFirstString.concat("Hello", "New"),
    "World"
  )
);
console.log(
  semigroupFirstString.concat(
    "Hello",
    semigroupFirstString.concat("New", "World")
  )
);

const getRandomSemigroupString: Semigroup<string> = {
  concat: (x, y) => (Math.random() > 0.5 ? x : y)
};

console.log(
  getRandomSemigroupString.concat(
    getRandomSemigroupString.concat("a", "b"),
    "c"
  )
);

console.log(
  getRandomSemigroupString.concat(
    getRandomSemigroupString.concat("a", "b"),
    "c"
  )
);

console.log(
  getRandomSemigroupString.concat(
    "a",
    getRandomSemigroupString.concat("b", "c")
  )
);

// Get a semigroup instance

type UserRecord = {
  key: string;
  val: { name: string };
};

type User = {
  name: string;
};

const userArray: Array<UserRecord> = [
  { key: "id1", val: { name: "Boop" } },
  { key: "id1", val: { name: "Bop" } },
  { key: "id1", val: { name: "Bope" } },
  { key: "id2", val: { name: "Dee" } },
  { key: "id3", val: { name: "Doop" } }
];

// getFirstSemigroup
const first = fromFoldable(ordString, array)(
  userArray.map(({ key, val }) => [key, val]),
  getFirstSemigroup<User>().concat
);

console.log(first);

// getLastSemigroup
const last = fromFoldable(ordString, array)(
  userArray.map(({ key, val }) => [key, val]),
  getLastSemigroup<User>().concat
);

console.log(last);

// Creating a free semigroup of A

function getArraySemigroup<A = never>(): Semigroup<Array<A>> {
  return { concat: (x, y) => x.concat(y) };
}

function semigroupArrayOf<A>(a: A): Array<A> {
  return [a];
}

const semigroupArrayNumber = getArraySemigroup<number>();

const array2 = semigroupArrayOf(2);
const array3 = semigroupArrayOf(3);
const array4 = semigroupArrayOf(4);

console.log(
  semigroupArrayNumber.concat(
    array2,
    semigroupArrayNumber.concat(array3, array4)
  )
);

// Creating a semigroup from an Ord instance

type Inventory = {
  name: string;
  amount: number;
};

type InventoryRecord = {
  key: number;
  val: Inventory;
};

const inventoryArray: Array<InventoryRecord> = [
  { key: 1, val: { name: "Sock", amount: 1 } },
  { key: 2, val: { name: "Cup", amount: 3 } },
  { key: 2, val: { name: "iPad", amount: 2 } },
  { key: 2, val: { name: "House", amount: 10 } },
  { key: 5, val: { name: "Marker", amount: 30 } },
  { key: 6, val: { name: "Marker", amount: 20 } },
  { key: 6, val: { name: "Marker", amount: 25 } }
];

const ordInventoryRecord = contramap((inventoryRecord: InventoryRecord) => [
  inventoryRecord.key,
  inventoryRecord.val.name
])(getTupleOrd(ordNumber, ordString));

/** Takes the minimum of two values */
const semigroupMin = getMeetSemigroup(ordInventoryRecord);

/** Takes the maximum of two values  */
const semigroupMax = getJoinSemigroup(ordInventoryRecord);

console.log(semigroupMin.concat(inventoryArray[0], inventoryArray[1]));
console.log(semigroupMin.concat(inventoryArray[1], inventoryArray[3]));
console.log(semigroupMax.concat(inventoryArray[1], inventoryArray[3]));
console.log(semigroupMax.concat(inventoryArray[3], inventoryArray[4]));

// Constructing complex semigroup instances

const semigroupInventory: Semigroup<Inventory> = {
  concat: (i1, i2) => ({
    name: getFirstSemigroup<string>().concat(i1.name, i2.name),
    amount: semigroupSumNumber.concat(i1.amount, i2.amount)
  })
};

const semigroupInventoryRecord = getStructSemigroup({
  key: getFirstSemigroup<number>(),
  val: semigroupInventory
});

console.log(
  semigroupInventoryRecord.concat(inventoryArray[4], inventoryArray[5])
);

// Deriving a semigroup for functions

const semigroupPredicate: Semigroup<(
  ir: InventoryRecord
) => boolean> = getFunctionSemigroup(semigroupAll)<InventoryRecord>();

const isMoreThan20 = (ir: InventoryRecord) => ir.val.amount > 20;
const isLessThan30 = (ir: InventoryRecord) => ir.val.amount < 30;

const isInBetween20And30 = semigroupPredicate.concat(
  isMoreThan20,
  isLessThan30
);

console.log(isInBetween20And30(inventoryArray[5]));
console.log(isInBetween20And30(inventoryArray[6]));

// Folding multiple semigroup instances

const concatInventoryRecords = foldSemigroup(semigroupInventoryRecord);

console.log(
  concatInventoryRecords({ key: 0, val: { name: "NO", amount: 0 } })(
    inventoryArray
  )
);

// Semigroups for type constructors

const optionSemigroupOfInventoryRecords = getApplySemigroup(
  semigroupInventoryRecord
);

console.log(
  optionSemigroupOfInventoryRecords.concat(some(inventoryArray[0]), none)
);
console.log(
  optionSemigroupOfInventoryRecords.concat(
    some(inventoryArray[0]),
    some(inventoryArray[1])
  )
);
