I have identified the issue in `jewelry/src/store/cart.ts`. The `total` and `itemCount` properties are defined as getters on the state object. When Zustand (and its persist middleware) merges state updates, these getters are evaluated and stored as static values, meaning they don't update when `items` change.

Here is the plan to fix the calculation issue:

1.  **Update `jewelry/src/store/cart.ts`**:
    *   Remove the `get total()` and `get itemCount()` getters.
    *   Add `total` and `itemCount` as explicit number properties in the state.
    *   Create a helper function to calculate these values from the `items` array.
    *   Update `addItem`, `removeItem`, `updateQuantity`, and `clearCart` actions to recalculate and set `total` and `itemCount` whenever `items` are modified.

This ensures that the cart totals and item counts are always in sync with the items and trigger re-renders correctly.