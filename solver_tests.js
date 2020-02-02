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

        if (fastSolve) {
            solverRun(testCase.selection, testCase.target, null, testFinished);
        }
        else {
            solverRunAllSolutions(testCase.selection, testCase.target, null, testFinishedAllSolutions);
        }
    }
}

function makeTestReportPreamble(testNum, testCase) {
    var selectionString = "";
    for (var i = 0; i < testCase.selection.length; ++i) {
        if (i > 0)
            selectionString += " ";
        selectionString += testCase.selection[i].toString();
    }
    return "Test " + (testNum + 1).toString() +
            " of " + testCases.length.toString() + ": " +
            selectionString + " -> " + testCase.target.toString() + " ... ";
}

function testFinishedAllSolutions(expressions, target, errorMsg) {
    var testCase = testCases[testNum];
    var failed = false;
    var testReport = makeTestReportPreamble(testNum, testCase);

    if (expressions == null) {
        testReport += " ERROR: " + errorMsg;
        failed = true;
    }
    else {
        testReport += expressions.length.toString() + " solutions.\r\n";
        for (var expIndex = 0; expIndex < expressions.length; ++expIndex) {
            var expression = expressions[expIndex];
            var away = Math.abs(expression.getValue() - target);

            testReport += "\t" + expression.toString() + " = " + expression.getValue().toString() + " ";

            if (away != testCase.numAway) {
                testReport += "Expected " + testCase.numAway.toString() + " away, observed " + away.toString() + " away. ";
                failed = true;
            }
            testReport += "\r\n";
        }
    }

    testFinishedTail(failed, testReport);
}

function testFinished(expression, target, errorMsg) {
    var testCase = testCases[testNum];
    var failed = false;
    var testReport = makeTestReportPreamble(testNum, testCase);

    if (expression == null) {
        testReport += " ERROR: " + errorMsg;
        failed = true;
    }
    else {
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
