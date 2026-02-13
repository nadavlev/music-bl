
# Fix Timeline Card Alternating Alignment (RTL)

## Problem
The timeline cards are not properly alternating between right and left sides on desktop. This is because the page uses `dir="rtl"`, which reverses the behavior of `margin-left: auto` and `margin-right: auto`. The current CSS classes don't account for this RTL reversal.

## Solution
Update the card positioning classes in `DecadeCard.tsx` to use RTL-aware Tailwind utilities (`md:me-auto` / `md:ms-auto` and `md:pe-*` / `md:ps-*`) instead of physical direction classes (`md:mr-auto` / `md:ml-auto` and `md:pr-*` / `md:pl-*`). These logical properties automatically adapt to the text direction.

## Changes

### `src/components/DecadeCard.tsx`
- Replace `md:mr-auto` with `md:me-auto` (margin-inline-end)
- Replace `md:ml-auto` with `md:ms-auto` (margin-inline-start)  
- Replace `md:pr-8` / `md:pl-0` with `md:pe-8` / `md:ps-0`
- Replace `md:pl-8` / `md:pr-0` with `md:ps-8` / `md:pe-0`

This ensures:
- Even-indexed cards appear on the **right** side (in RTL)
- Odd-indexed cards appear on the **left** side (in RTL)
- Proper alternating layout regardless of text direction

### Technical Detail
Line 33-35 changes from:
```
isEven ? "md:mr-auto md:pl-0 md:pr-8" : "md:ml-auto md:pr-0 md:pl-8"
```
to:
```
isEven ? "md:me-auto md:ps-0 md:pe-8" : "md:ms-auto md:pe-0 md:ps-8"
```
