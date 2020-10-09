# numsolver

This is a solver for numbers games on the TV show Countdown. It is written in JavaScript with a pair of HTML frontends: one designed for mobile devices and one more featureful interface for larger screens. All the calculations are done in JavaScript, so there is no need for a server, or even an internet connection once your browser has loaded the page.

It is hosted at https://greem.co.uk/solver and https://greem.co.uk/quantumtombola

By default it determines whether a solution to a numbers game exists, and returns one such solution if so. If there is no exact solution, it returns one closest-possible solution.

It can also be made to find all distinct solutions to a numbers game, but this is slower. Trivial rearrangements of an expression (e.g. `3*4+5` and `5+4*3`) are not considered distinct solutions.

This solver is not affiliated with or endorsed by Countdown or anyone connected with the programme.

# Using the interface

## Mobile interface

`mobile.html` is the original user interface. It's designed for touchscreens in portrait orientation, but it can be used, albeit clunkily, on a desktop computer. By default it runs in "fast" mode, which finds one solution.

## Quantum Tombola
`desktop.html` is the desktop-targeted interface, which assumes the user has easy access to a keyboard. It can do more complex things like analyse a numbers selection and show you which targets are possible and with how many solutions.

# Using the engine

This section is intended for developers who want to use the solver engine in their own projects.

`solver_engine.js` is the backend, which can be repurposed to whatever other interface you have. Its public-facing functions are `solverRun()`, `solverRunAllSolutions()`, and `solverRunAllTargets()`. Both of these functions return immediately and start the solve process in the background using JavaScript's `setTimeout()` call. When the solve process is finished, the result is delivered to the application using a callback.

`solverRun()`, `solverRunAllSolutions()`, and `solverRunAllTargets()` take four arguments as follows:

1. `selection`: the selection, as an array of integers.
2. `target`: the target, as an integer. This may be `null`, which indicates the solver is supposed to solve for all targets.
3. `progressCallback`: a function for the engine to call after each solving step with progress information. This is useful for updating a progress indicator on the page if the solve is taking a long time. It may be `null`, in which case no progress information is reported. It takes a single argument which is a `SolverProgress` object, detailed below.
4. `finishedCallback`: a function for the engine to call when it's finished, to pass you the solution or solutions. Its single argument is a `SolverResults` object, detailed below.

In addition, `solverRunAllSolutions()` and `solverRunAllTargets()` take two further arguments, which are optional and default to `null`:
5. `imperfectSolutionsMin` 
6. `imperfectSolutionsMax`

If either `imperfectSolutionsMin` or `imperfectSolutionsMax` are set, then solutions which are not the best available will be remembered and delivered in the `SolverResults` object passed to `finishedCallback()`. If `target` was `null` then you probably want to set these otherwise you won't get any solutions at all.

Setting `imperfectSolutionsMin` to 101 and `imperfectSolutionsMax` to 999 will tell the engine to retain all solutions which reach any number between 101 and 999.

See the description of `SolverResults` for information on how to list the imperfect solutions.

## The difference betwewen `solverRun()`, `solverRunAllSolutions()` and `solverRunAllTargets()

The use cases of three functions range from "here's a numbers selection and a target, give me one solution to this target or the closest possible" through "give me one solution to every target that's possible within this range" to "give me every solution to this target or a range of targets".

### `solverRun()`
`solverRun()` only delivers one solution. This solution is guaranteed to be as close to the target as it is possible to reach with the selection, and in the fewest number of steps.

This function is designed as a fast solver - it aggressively eliminates duplicates, makes no attempt to find alternative solutions, and it finishes as soon as it has found one solution to the target or established that none exists.

There is no `imperfectSolutionsMin` or `imperfectSolutionsMax` with this function. The `SolverResults.getImperfectSolutions()` will always return an empty map.

#### Use `solverRun()` if...
... you just want to know whether or not a numbers game is possible, with one example solution to the target or the closest possible to it.

### `solverRunAllTargets()`
This still uses the fast solver, but it doesn't stop working once it's found a solution to the target (if a target was even specified). It will search the whole solution space, and populate the map of imperfect solutions.

The `SolverResults` object's `getImperfectSolutions()` method will return a mapping of values to lists of expressions, but each list will have a maximum of one solution in it.

It is guaranteed that if a target within the specified imperfect solutions range is achievable with the selection, the returned mapping will map that target to a list of one `Expression` object.

#### Use `solverRunAllTargets()` if...
... you want to know which targets within a range are possible to reach with a given selection, and you want an example solution for each such target, but you don't care about alternative solutions or how many solutions there are.

### `solverRunAllSolutions()`
This uses the slower solving strategy which is a bit less aggressive with removing duplicates. The aim is to find all non-trivially different solutions to the target.

All non-trivially different solutions to the target (or the closest possible in both directions) will be returned by the `SolverResults` object's `getSolutions()` method.

In addition, if `imperfectSolutionsMin` and/or `imperfectSolutionsMax` are supplied, the mapping returned by `SolverResults.getImperfectSolutions()` will contain every solvable target within the range, each mapping to a list of every non-trivially different solution to that target.

#### Use `solverRunAllSolutions()` if...
... you want to see every solution to a target (or the closest possible to it in both directions) with a given selection, or every solution to each of a range of targets.

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

### `getBestSolutionSoFar()`
Return the best solution we've found so far, as an `Expression` object.

## The `SolverResults` object passed to `finishedCallback()`
The `finishedCallback` parameter must be a function which takes a single argument. This is a `SolverResults` object created by the engine. Its public methods are as follows:

### `getSelection()`
Return the selection for this numbers game, as an array of integers.

### `getTarget()`
Return the target for this numbers game, as an integer.

### `isSuccessful()`
Returns `true` if we successfully produced at least one expression (which might
not be an exact solution), or `false` if an error occurred.

### `getSolutions()`
Return an array of `Expression` objects, each of which is a best solution. If you called `solverRun()`, this array will only have one expression in it. If you called `solverRunAllSolutions()` it might have more. If there was an error, or if the `target` was null, this returns `null`.

### `getSolution()`
Returns the first expression in the list returned by `getSolutions()`, or
`null` if no solutions were found due to an error, or if the `target` was `null`.

### `getNumSolutions()`
Return the number of best solutions found. This will be the length of the array
returned by `getSolutions()`, or 0 if that returns `null`.

### `getImperfectSolutions()`
Return a dictionary which maps integers (expression values) to lists of Expression objects.

This is the set of all solutions we kept because their values fell within the range `[imperfectSolutionsMin, imperfectSolutionsMax]`. This includes perfect solutions as well. However, if `imperfectSolutionsMin` and `imperfectSolutionsMax` were both `null`, this returns an empty dictionary.

If `target` was `null`, then this method is how you get your solutions. Every applicable solutiont whose value is within the specified range will be in the returned map.

### `getErrorMessage()`
Return the error message, as a string. If there was no error, this is `null`.
If the return value of `getSolutions()` is `null`, this error message string
will explain why.


## The `Expression` object
An `Expression` object is a mathematical expression which uses integers and the four elementary mathematical operations of addition, subtraction, multiplication and division. Where we talk about a function or method returning a "solution", what actually gets returned is an `Expression` object or some subclass thereof.

The `getSolutions()` method of the `SolverResults` object passed to your `finishedCallback()` returns an array of these objects as the solution or solutions. The `getImperfectSolutions()` method returns a dictionary mapping result values to lists of `Expression` objects.

The `Expression` object has many different methods and fields (depending on which `solverRun*()` function you called), but the following methods, which your application should use, are guaranteed to be present:

### `getValue()`
Return the integer result of this expression. For example, if the expression is `(100 + 5) * 7`, `getValue()` will return `735`.

### `toString()`
Return the expression as a string, e.g. `(100 + 5) * 7 + 10`. This will be a single expression which uses BODMAS rules and only includes brackets where necessary. Everything in brackets must be done first, then multiplication and division from left to right, then addition and subtraction from left to right. This means `3 + 4 * 5` is 23, not 35. Multiplication is denoted by `*` and division by `/`.

### `toStringDescriptive()`
Return the expression as a string in descriptive notation rather than algebraic notation, like this:

    100 + 5 = 105
    105 * 7 = 735
    735 + 10 = 745

Each line is terminated with a newline (`\n`) character.

### `getCountNumbersUsed()`
Return how many of the selection's numbers were used in this expression.
