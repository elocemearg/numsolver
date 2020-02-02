# numsolver

This is a solver for numbers games on the TV show Countdown. It is written in JavaScript with an HTML frontend which is designed for mobile devices. All the calculations are done in JavaScript, so there is no need for a server, or even an internet connection once your browser has loaded the page.

It is hosted at https://greem.co.uk/solver

By default it determines whether a solution to a numbers game exists, and returns one such solution if so. If there is no exact solution, it returns one closest-possible solution.

It can also be made to find all distinct solutions to a numbers game, but this is slower. Trivial rearrangements of an expression (e.g. `3*4+5` and `5+4*3`) are not considered distinct solutions.

This solver is not affiliated with or endorsed by Countdown or anyone connected with the programme.

# Using the interface

`index.html` is the main user interface. It's designed for touchscreens in portrait orientation, but it can be used, albeit clunkily, on a desktop computer. By default it runs in "fast" mode, which finds one solution.

# Using the engine

This section is intended for developers who want to use the solver engine in their own projects.

`solver_engine.js` is the backend, which can be repurposed to whatever other interface you have. Its public-facing functions are `runSolver()` and `runSolverAllSolutions()`.

Both `runSolver()` and `runSolverAllSolutions()` take four arguments as follows:

1. `selection`: the selection, as an array of integers.
2. `target`: the target, as an integer.
3. `progressCallback`: a function for the engine to call after each solving step with progress information. This is useful for updating a progress indicator on the page if the solve is taking a long time. It may be `null`, in which case no progress information is reported. It takes a single argument which is a `SolverProgress` object, detailed below.
4. `finishedCallback`: a function for the engine to call when it's finished, to pass you the solution or solutions. Its single argument is a `SolverResult` object, detailed below.

## The `SolverProgress` object passed to `progressCallback()`
The `progressCallback` parameter must be a function which takes a single
argument. This is a `SolverProgress` object created by the engine. Its public
methods are as follows:

### `getSelection()`
Return the selection for this numbers game, as an array of integers.

### `getTarget()`
Return the target for this numbers game, as an integer.

### `getElapsedMs()`
Return the number of milliseconds that have elapsed since we started this solve,
up to the time the progress callback was called.

### `getNumExpressionsBuilt()`
Return the number of expressions we've generated so far.

### `getBestTotalSoFar()`
Return the best total we've found so far, as an integer.

### `getNumBestSolutionsSoFar()`
Return the number of solutions we've found so far which are equally as close
to the target as `getBestTotalSoFar()`.

## The `SolverResult` object passed to `finishedCallback()`
The `finishedCallback` parameter must be a function which takes a single argument. This is a `SolverResult` object created by the engine. Its public methods are as follows:

### `getSelection()`
Return the selection for this numbers game, as an array of integers.

### `getTarget()`
Return the target for this numbers game, as an integer.

### `isSuccessful()`
Returns `true` if we successfully produced at least one expression (which might
not be an exact solution), or `false` if an error occurred.

### `getSolutions()`
Return an array of `Expression` objects, each of which is a best solution. If you called `runSolver()`, this array will only have one expression in it. If you called `runSolverAllSolutions()` it might have more. If there was an error, this returns `null`.

### `getSolution()`
Returns the first expression in the list returned by `getSolutions()`, or
`null` if no solutions were found.

### `getNumSolutions()`
Return the number of best solutions found. This will be the length of the array
returned by `getSolutions()`, or 0 if that returns `null`.

### `getErrorMessage()`
Return the error message, as a string. If there was no error, this is `null`.
If the return value of `getSolutions()` is `null`, this error message string
will explain why.

## The `Expression` object
An `Expression` object is a mathematical expression which uses integers and the four elementary mathematical operations of addition, subtraction, multiplication and division. The `getSolutions()` method of the `SolverResult` object passed
to your `finishedCallback()` returns an array of these objects as the solution or solutions.

It has many different methods and fields (depending on which `runSolver*()` function you called), but an `Expression` object will always have the following methods, which your interface should use:

### `getValue()`
Return the integer result of this expression. For example, if the expression is `(100 + 5) * 7`, `getValue()` will return `735`.

### `toString()`
Return the expression as a string, e.g. `(100 + 5) * 7 + 10`. This will be a single expression which uses BODMAS rules and only includes brackets where necessary. Everything in brackets must be done first, then multiplication and division from left to right, then addition and subtraction from left to right. This means `3 + 4 * 5` is 23, not 35. Multiplication is denoted by `*` and division by `/`.

### `getCountNumbersUsed()`
Return how many of the selection's numbers were used in this expression.
