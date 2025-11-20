# ts-define-enum

Tiny zero-dependency helper to define enum-like objects in TypeScript with:

- strongly typed keys and values,
- a built-in `is` type guard,
- optional methods attached to the enum object.

Perfect if you prefer `as const` objects over native `enum`, but still want a nicer API.

---

## Installation

```bash
npm install ts-define-enum
# or
yarn add ts-define-enum
# or
pnpm add ts-define-enum
```

## Quick start

### Defining enum

```ts
import { defineEnum } from 'ts-define-enum';

export type Color = (typeof Color)['values'][number];
export const Color = defineEnum({
  Green: 'GREEN',
  Red: 'RED',
});
```

### Using enum

```ts
Color.Green; // "GREEN"
Color.Red; // "RED"

Color.keys; // ["Green", "Red"]
Color.values; // ["GREEN", "RED"]
Color.enum; // { Green: "GREEN", Red: "RED" }

// type guard
if (Color.is(value)) {
  // value is inferred as "GREEN" | "RED"
}
```

### Custom methods and helpers

Any function in the input is treated as a factory: it is called once, and its ReturnType is used as the method type.

This lets you define methods that are strongly typed against the enum’s values:

```ts
type Status = (typeof Status)['values'][number];
const Status = defineEnum({
  Pending: 'PENDING',
  Done: 'DONE',

  getLabel() {
    const labels: Readonly<Record<Status, string>> = {
      [this.Pending]: 'Pending...',
      [this.Done]: 'Done!',
    };

    return (status: Status) => labels[status];
  },
});

// ---------------------------------------------------

// method is already the returned function
Status.getLabel(Status.Pending); // "Pending..."
Status.getLabel(Status.Done); // "Done!"
```

### Typing helpers

The library exposes a general type for “any enum defined with defineEnum:

```ts
import type { DefinedEnum } from 'ts-define-enum';

function logAllValues<E extends DefinedEnum>(e: E) {
  e.values.forEach((value) => {
    console.log(value);
  });
}

logAllValues(Color);
```

## Attribution

Licensed under MIT.
