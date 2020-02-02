# numsolver
JavaScript solver for Countdown numbers games

This is a solver for numbers games on the TV show Countdown. It is written in JavaScript with an HTML frontend which is designed for mobile devices. All the calculations are done in JavaScript, so there is no need for a server, or even an internet connection once your browser has loaded the page.

By default it determines whether a solution to a numbers game exists, and returns one such solution if so. If there is no exact solution, it returns one closest-possible solution.

It can also be made to find all distinct solutions to a numbers game, but this is slower. Trivial rearrangements of an expression (e.g. `3*4+5` and `5+4*3`) are not considered distinct solutions.

This solver is not affiliated with or endorsed by Countdown or anyone connected with the programme.
