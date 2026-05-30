# Shared Package

This directory is **reserved for code that is genuinely shared** across more than one
consumer in the monorepo — for example, types, helpers, or constants used by both the
backend (`apps/api`) and the frontend (`apps/web`).

## When to add code here

Only place code in this package when it is **actually shared by more than one consumer**.
Do not add code here speculatively or "just in case" — premature sharing couples otherwise
independent applications and works against the template's goal of staying small, flat, and
explicit.

A good rule of thumb:

- If exactly one app needs it, keep it inside that app.
- If two or more apps genuinely need the same thing, promote it here.

## Current status

This package is **intentionally empty**. It contains only this placeholder document and no
application code. When you have something genuinely shared, add it here and wire up the
appropriate package configuration for its language/ecosystem at that time.
