var testRunning = false;
var testNum = 0;
var numPasses = 0;
var numFails = 0;
var fastSolve = true;

function initState() {
}

function testButtonPress() {
    var out = document.getElementById("testoutput");
    var fastSolveBox = document.getElementById("fastsolve");
    
    if (testRunning)
        return;

    out.innerText = "";
    testNum = -1;
    numPasses = 0;
    numFails = 0;

    if (fastSolveBox.checked)
        fastSolve = true;
    else
        fastSolve = false;

    runNextTest();
}

function runNextTest() {
    var out = document.getElementById("testoutput");

    ++testNum;
    if (testNum >= testCases.length) {
        out.innerText = "Tests finished. " + numPasses.toString() + " passes, " + numFails.toString() + " failures.\r\n\r\n" + out.innerText;
        testRunning = false;
    }
    else {
        var testCase = testCases[testNum];

        var fastSolveThis = (fastSolve && testCase.minNumbersUsed == undefined && testCase.lockedNumbers == undefined);
        let minNumbersUsed = null;
        let maxNumbersUsed = null;
        let lockedNumbers = [];
        if (testCase.minNumbersUsed !== undefined)
            minNumbersUsed = testCase.minNumbersUsed;
        if (testCase.maxNumbersUsed !== undefined)
            maxNumbersUsed = testCase.maxNumbersUsed;
        if (testCase.lockedNumbers !== undefined)
            lockedNumbers = testCase.lockedNumbers;

        if (fastSolveThis) {
            solverRun(testCase.selection, testCase.target, null, testFinished, maxNumbersUsed);
        }
        else {
            solverRunAllSolutions(testCase.selection, testCase.target, null,
                    testFinishedAllSolutions, null, null, minNumbersUsed,
                    maxNumbersUsed, lockedNumbers);
        }
    }
}

function makeTestReportPreamble(testNum, testCase) {
    var selectionString = "";
    var constraints = "";
    for (var i = 0; i < testCase.selection.length; ++i) {
        if (i > 0)
            selectionString += " ";
        selectionString += testCase.selection[i].toString();
    }
    if (testCase.minNumbersUsed !== undefined) {
        constraints += "min " + testCase.minNumbersUsed.toString() + " ";
    }
    if (testCase.maxNumbersUsed !== undefined) {
        constraints += "max " + testCase.maxNumbersUsed.toString() + " ";
    }
    if (testCase.lockedNumbers !== undefined) {
        constraints += "locked [" + testCase.lockedNumbers.toString() + "] ";
    }
    if (constraints != "") {
        constraints = " (" + constraints.trim() + ")";
    }
    return "Test " + (testNum + 1).toString() +
            " of " + testCases.length.toString() + ": " +
            selectionString + " -> " + testCase.target.toString() +
            constraints + " ... ";
}

function testFinishedAllSolutions(solverResult) {
    var selection = solverResult.getSelection();
    var target = solverResult.getTarget();
    var expressions = solverResult.getSolutions();
    var errorMsg = solverResult.getErrorMessage();

    var testCase = testCases[testNum];
    var failed = false;
    var testReport = makeTestReportPreamble(testNum, testCase);

    if (expressions == null) {
        testReport += " ERROR: " + errorMsg;
        failed = true;
    }
    else {
        testReport += expressions.length.toString() + " solutions.\r\n";
        let solutionStringSet = {};
        for (var expIndex = 0; expIndex < expressions.length; ++expIndex) {
            var expression = expressions[expIndex];
            var away = Math.abs(expression.getValue() - target);

            testReport += "\t" + expression.toString() + " = " + expression.getValue().toString() + " ";

            if (away != testCase.numAway) {
                testReport += "Expected " + testCase.numAway.toString() + " away, observed " + away.toString() + " away. ";
                failed = true;
            }

            if (expression.toString() in solutionStringSet) {
                testReport += "(DUPLICATE SOLUTION!)";
                failed = true;
            }

            solutionStringSet[expression.toString()] = true;
            testReport += "\r\n";
        }
        if (expressions.length == 0) {
            testReport += "No solutions returned.\r\n";
            failed = true;
        }
    }

    testFinishedTail(failed, testReport);
}

function testFinished(solverResult) {
    var selection = solverResult.getSelection();
    var target = solverResult.getTarget();
    var expressions = solverResult.getSolutions();
    var errorMsg = solverResult.getErrorMessage();

    var testCase = testCases[testNum];
    var failed = false;
    var testReport = makeTestReportPreamble(testNum, testCase);

    if (expressions == null || expressions.length == 0) {
        testReport += " ERROR: " + errorMsg;
        failed = true;
    }
    else {
        var expression = expressions[0];
        var away = Math.abs(expression.getValue() - target);
        testReport += expression.toString() + " = " + expression.getValue().toString() + ". ";
        if (away != testCase.numAway) {
            testReport += "Expected " + testCase.numAway.toString() + " away, observed " + away.toString() + " away. ";
            failed = true;
        }
        
        if (expression.getCountNumbersUsed() > testCase.countNumbersUsed) {
            testReport += "Expected no more than" +
                testCase.countNumbersUsed.toString() + " numbers used, observed " +
                expression.getCountNumbersUsed().toString() + " numbers used. ";
            failed = true;
        }
    }

    testFinishedTail(failed, testReport);
}

function testFinishedTail(failed, testReport) {
    var out = document.getElementById("testoutput");

    if (failed) {
        testReport += " FAILED\r\n";
        numFails++;
    }
    else {
        testReport += " PASSED\r\n";
        numPasses++;
    }

    out.innerText = testReport + out.innerText;

    runNextTest();
}
