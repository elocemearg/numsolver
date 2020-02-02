/* The states we can be in are as follows:
 *
 * REQUEST_SELECTION
 * This is the initial state. All keys are enabled, button10 is "10" not "0".
 * If the selection input contains between 2 and 6 numbers, the main
 * button reads "Next" otherwise it is disabled.
 * If any number keys are pressed, the appropriate number gets added to the
 * selection input.
 * If the backspace key is pressed, the last number (not necessarily just
 * the last digit) is removed from the selection input. If there is nothing
 * in the selection input it has no effect.
 * Pressing the "Next" button moves us into the REQUEST_TARGET state.
 *
 * REQUEST_TARGET
 * All keys except 25, 50, 75 and 100 are enabled, button10 is "0", and if
 * any number keys are pressed, the corresponding digit is added to the
 * target input. If the target input contains a valid positive integer,
 * the main button reads "Solve" otherwise it is disabled.
 * Pressing the "Solve" button starts off the solve process in the background
 * and moves us into the SOLVING state.
 * Pressing the selection input moves us back into the REQUEST_SELECTION state.
 *
 * SOLVING
 * All keys are disabled.
 * When the solve is finished, we move into the FINISHED state.
 *
 * FINISHED
 * The output pane shows the result of the solve, which may be an exact solve
 * or the closest the solver found. All keys are enabled, and their captions
 * are the same as in state REQUEST_SELECTION.
 * If any number key is pressed, the selection and target inputs are cleared,
 * the corresponding number is placed in the selection input and we move to
 * the REQUEST_SELECTION state.
 * If the backspace key is pressed, the selection and target inputs are
 * cleared and we move to the REQUEST_SELECTION state.
 * If the selection input is pressed, we move to the REQUEST_SELECTION state
 * without changing or clearing anything.
 * If the target input is pressed, we move to the REQUEST_TARGET state without
 * changing or clearing anything.
 *
 * SHOWING_ALL
 * The keyboard pane is invisible and the output pane has grown to fill its
 * place, because it's now showing a (potentially) long list of solutions.
 * The selection and target boxes are disabled.
 * If the main button is pressed (it reads "Done" or something like that)
 * we go back to the FINISHED state, shrink the output pane again and
 * make the keyboard visible.
 */

const REQUEST_SELECTION = 0;
const REQUEST_TARGET = 1;
const SOLVING = 2;
const FINISHED = 3;
const SHOWING_ALL = 4;

var currentSolutionList = [];
var currentSelection = [];
var currentTarget = 0;
var uiState = REQUEST_SELECTION;
var showingOptions = false;


function clearOutput() {
    var answerDiv = document.getElementById("answerdiv");
    answerDiv.innerText = "";
    while (answerDiv.firstChild) {
        answerDiv.removeChild(answerDiv.firstChild);
    }
}

function addAnswerSummaryDiv(parentDiv, expression, target) {
    var answerSummaryDiv = document.createElement("div");
    answerSummaryDiv.className = "answersummary";
    var answerSpan = document.createElement("span");
    if (expression.getValue() != target) {
        answerSpan.className = "inexactanswer";
        answerSpan.innerText = expression.getValue().toString() + " (" + Math.abs(target - expression.getValue()).toString() + " away)";
    }
    else {
        answerSpan.className = "exactanswer";
        answerSpan.innerText = target.toString();
    }
    answerSummaryDiv.appendChild(answerSpan);
    parentDiv.appendChild(answerSummaryDiv);
}

function addMethodDiv(parentDiv, expression) {
    var methodDiv = document.createElement("div");
    methodDiv.className = "answermethod";

    var expressionText = expression.toString();

    methodDiv.innerHTML = expressionText.replace(/\*/g, "&times;").replace(/-/g, "&minus;");
    parentDiv.appendChild(methodDiv);
}

function showSolveResultAux(selection, target, expressionList, errorMessage) {
    var answerDiv = document.getElementById("answerdiv");
    var expression;

    /* We're only interested in the first expression in the list. If this was
     * run as a fast solve (the default) then the list will only have one
     * expression in it anyway. */
    if (expressionList == null || expressionList.length < 1)
        expression = null;
    else
        expression = expressionList[0];

    clearOutput();

    if (expression != null) {
        addAnswerSummaryDiv(answerDiv, expression, target);
        addMethodDiv(answerDiv, expression);
        currentSolutionList = [ expression ];
    }
    else {
        answerDiv.innerText = errorMessage;
    }

    if (expression != null) {
        var answerFurtherSolutionsDiv = document.createElement("div");
        answerFurtherSolutionsDiv.className = "answerfurthersolutions";
        answerFurtherSolutionsDiv.id = "answerfurthersolutions";
        answerFurtherSolutionsDiv.innerHTML = "<a id=\"showmore\" class=\"morelink\" onclick=\"findAllSolutionsForCurrentPuzzle();\">Search for more solutions</a>";
        answerDiv.appendChild(answerFurtherSolutionsDiv);
    }

    uiState = FINISHED;
    updateControls();
}

function showSolveResult(solveResult) {
    showSolveResultAux(solveResult.getSelection(), solveResult.getTarget(),
            solveResult.getSolutions(), solveResult.getErrorMessage());
}

function showSolveResultListAux(selection, target, expressions, errorMessage) {
    if (expressions == null) {
        showSolveResultAux(selection, target, null, errorMessage);
        currentSolutionList = [];
    }
    else if (expressions.length == 0) {
        showSolveResultAux(selection, target, null, "No solutions found.");
        currentSolutionList = [];
    }
    else {
        var away = Math.abs(expressions[0].getValue() - target);
        var answerDiv = document.getElementById("answerdiv");
        showSolveResultAux(selection, target, expressions, errorMessage);

        var answerFurtherSolutionsDiv = document.getElementById("answerfurthersolutions");
        if (answerFurtherSolutionsDiv !== undefined) {
            if (expressions.length < 2) {
                answerFurtherSolutionsDiv.innerText = "This is the only " + ( away == 0 ? "" : "best ") + "solution.";
            }
            else {
                answerFurtherSolutionsDiv.innerHTML = "<a id=\"showmore\" class=\"morelink\" onclick=\"showMoreSolutions();\">Show all " + expressions.length.toString() + " solutions</a>";
            }
        }
        currentSolutionList = expressions;
    }
}

function showSolveResultList(solveResult) {
    showSolveResultListAux(solveResult.getSelection(), solveResult.getTarget(),
            solveResult.getSolutions(), solveResult.getErrorMessage());
}

function findAllSolutionsForCurrentPuzzle() {
    /* Run the solver again with the current selection and target, this time
     * looking for all solutions regardless of what the radio button in the
     * options page says. */
    uiState = SOLVING;
    updateControls();
    solverRunAllSolutions(currentSelection, currentTarget, showSolveProgress, showSolveResultList);
}

function showMoreSolutions() {
    var answerDiv = document.getElementById("answerdiv");

    if (currentSolutionList.length < 2) {
        return;
    }

    clearOutput();

    var firstSolution = currentSolutionList[0];

    addAnswerSummaryDiv(answerDiv, firstSolution, currentTarget);

    var solsAdded = 0;

    for (var i = 0; i < currentSolutionList.length; ++i) {
        var solution = currentSolutionList[i];
        if (solution.getValue() == firstSolution.getValue()) {
            addMethodDiv(answerDiv, solution);
            solsAdded++;
        }
    }

    if (firstSolution.getValue() != currentTarget) {
        /* If the first solution was N away, let's now show all the solutions
         * for N away the other way */
        var otherAnswer = currentTarget + (currentTarget - firstSolution.getValue());
        var foundOne = false;

        for (var i = 0; i < currentSolutionList.length; ++i) {
            var solution = currentSolutionList[i];
            if (solution.getValue() == otherAnswer) {
                if (!foundOne) {
                    addAnswerSummaryDiv(answerDiv, solution, currentTarget);
                    foundOne = true;
                }
                addMethodDiv(answerDiv, solution);
            }
        }
    }

    uiState = SHOWING_ALL;

    updateControls();
}

function msToMinsAndSecs(ms) {
    var str = "";
    if (ms >= 60000) {
        str += Math.floor(ms / 60000).toString() + "m ";
    }
    str += Math.floor((ms % 60000) / 1000).toString() + "s";
    return str;
}

function showSolveProgress(solverProgress) {
    var elapsedMs;
    var numExpressions;
    var nearestTotal;
    var numBestSolutions;
    var target = 0;

    if (solverProgress == null) {
        elapsedMs = 0;
        numExpressions = 0;
        nearestTotal = -1;
        numBestSolutions = 0;
    }
    else {
        elapsedMs = solverProgress.getElapsedMs();
        numExpressions = solverProgress.getNumExpressionsBuilt();
        nearestTotal = solverProgress.getBestTotalSoFar();
        numBestSolutions = solverProgress.getNumBestSolutionsSoFar();
        target = solverProgress.getTarget();
    }

    var answerDiv = document.getElementById("answerdiv");
    var away = Math.abs(nearestTotal - currentTarget);
    var progressDiv;

    progressDiv = document.getElementById("answerprogress");
    if (progressDiv == null) {
        clearOutput();
        progressDiv = document.createElement("div");
        progressDiv.className = "answerprogress";
        progressDiv.id = "answerprogress";
        answerDiv.appendChild(progressDiv);
    }

    progressDiv.innerHTML = "Solving, please wait...";
    if (elapsedMs > 0 || numExpressions > 0) {
        progressDiv.innerHTML += "<br />" +
            "Elapsed time: " + msToMinsAndSecs(elapsedMs) + "<br />" +
            "Expressions: " + numExpressions.toString() + "<br />" +
            "Best so far: " + nearestTotal.toString() +
                (nearestTotal < 0 ? "" : (" (" + away.toString() + " away")) +
                (nearestTotal == target ? (", " + numBestSolutions.toString() + " solution" + (numBestSolutions == 1 ? "" : "s")) : "") +
                ")";
    }
}


function setButtonEnabled(button, value) {
    button.disabled = !value;
    if (value) {
        button.style.backgroundColor = null;
    }
    else {
        button.style.backgroundColor = "#aaaaaa";
    }
}

function updateControls() {
    var selectionElement = document.getElementById("selection");
    var targetElement = document.getElementById("target");
    var mainButton = document.getElementById("mainbutton");
    var largeNumberButtons = document.getElementsByClassName("largenumkey");
    var allKeys = document.getElementsByClassName("inputkey");
    var answerDiv = document.getElementById("answerdiv");
    var backspaceButton = document.getElementById("buttonbackspace");
    var outputPane = document.getElementById("outputpane");
    var keyboardPane = document.getElementById("keyboardpane");

    var selectionString = "";
    for (var i = 0; i < currentSelection.length; ++i) {
        if (i > 0)
            selectionString += " ";
        selectionString += currentSelection[i].toString();
    }

    selectionElement.value = selectionString;
    if (currentTarget == 0)
        targetElement.value = "";
    else
        targetElement.value = currentTarget.toString();

    if (uiState != SOLVING) {
        for (var i = 0; i < allKeys.length; ++i) {
            setButtonEnabled(allKeys[i], true);
        }
        setButtonEnabled(mainButton, true);
    }

    if (uiState != REQUEST_TARGET) {
        for (var i = 0; i < largeNumberButtons.length; ++i) {
            setButtonEnabled(largeNumberButtons[i], true);
        }
        var button10 = document.getElementById("button10");
        button10.innerText = "10";

        targetElement.style.borderColor = null;
    }

    if (uiState != REQUEST_SELECTION) {
        selectionElement.style.borderColor = null;
    }

    if (uiState != FINISHED) {
        // backspace deletes previous character or number
        backspaceButton.innerHTML = "&#x232b;";
        backspaceButton.title = "Backspace";
    }

    if (uiState != SHOWING_ALL) {
        outputPane.style.height = null;
        answerDiv.style.height = null;
        keyboardPane.style.display = null;
        selectionElement.disabled = false;
        targetElement.disabled = false;
    }

    if (uiState == REQUEST_SELECTION) {
        mainButton.innerText = "Next";
        if (currentSelection.length >= 2 && currentSelection.length <= SELECTION_MAX) {
            setButtonEnabled(mainButton, true);
        }
        else {
            setButtonEnabled(mainButton, false);
        }
        selectionElement.style.borderColor = "yellow";

        answerDiv.innerText = "Enter selection and press Next.";
    }
    else if (uiState == REQUEST_TARGET) {
        for (var i = 0; i < largeNumberButtons.length; ++i) {
            setButtonEnabled(largeNumberButtons[i], false);
        }
        var button10 = document.getElementById("button10");
        button10.innerText = "0";

        mainButton.innerText = "Solve";
        setButtonEnabled(mainButton, currentTarget > 0);
        targetElement.style.borderColor = "yellow";

        answerDiv.innerText = "Enter target and press Solve.";
    }
    else if (uiState == SOLVING) {
        showSolveProgress(null);
        mainButton.innerText = "Solving...";
        setButtonEnabled(mainButton, false);
        for (var i = 0; i < allKeys.length; ++i) {
            setButtonEnabled(allKeys[i], false);
        }
    }
    else if (uiState == FINISHED) {
        mainButton.innerText = "Next";
        backspaceButton.innerHTML = "C"; // backspace deletes everything
        backspaceButton.title = "Clear";
        setButtonEnabled(mainButton, false);
    }
    else if (uiState == SHOWING_ALL) {
        /* Showing list of solutions, so keyboard pane is gone and answer
         * pane is tall */
        outputPane.style.height = "51vh";
        answerDiv.style.height = "49vh";
        keyboardPane.style.display = "none";
        setButtonEnabled(mainButton, true);
        mainButton.innerText = "Done";
        selectionElement.disabled = true;
        targetElement.disabled = true;
    }
}

function onFocusSelectionBox() {
    uiState = REQUEST_SELECTION;
    updateControls();
}

function onFocusTargetBox() {
    uiState = REQUEST_TARGET;
    updateControls();
}

function addNumberToSelection(number) {
    if (currentSelection.length < SELECTION_MAX) {
        currentSelection.push(number);
    }
}

function deleteLastNumberFromSelection() {
    if (currentSelection.length > 0) {
        currentSelection.pop();
    }
}

function buttonPress(button) {
    var startSolver = false;
    
    if (uiState == REQUEST_SELECTION) {
        if (button >= 0) {
            addNumberToSelection(button);
        }
        else if (button == -1) {
            deleteLastNumberFromSelection();
        }
        else {
            uiState = REQUEST_TARGET;
        }
    }
    else if (uiState == REQUEST_TARGET) {
        if (button >= 0 && button <= 10) {
            currentTarget *= 10;
            if (button < 10) {
                currentTarget += button;
            }
        }
        else if (button > 10) {
            currentTarget *= 100;
            currentTarget += button % 100;
        }
        else if (button == -1) {
            currentTarget = Math.floor(currentTarget / 10);
        }
        else {
            uiState = SOLVING;
            startSolver = true;
        }
    }
    else if (uiState == FINISHED) {
        if (button < 0) {
            currentSelection = [];
            currentTarget = 0;
        }
        else {
            currentSelection = [button];
            currentTarget = 0;
        }
        uiState = REQUEST_SELECTION;
        clearOutput();
    }
    else if (uiState == SHOWING_ALL) {
        if (button < 0) {
            if (currentSolutionList.length > 0) {
                showSolveResultListAux(currentSelection, currentTarget, currentSolutionList, null);
            }
            else {
                uiState = FINISHED;
                clearOutput();
            }
        }
    }

    updateControls();

    if (startSolver) {
        var solveStrategyAll = document.getElementById("solvestrategyall");
        var solverRunFn;
        var solverFinishedCallback;

        if (solveStrategyAll.checked) {
            solverRunFn = solverRunAllSolutions;
            solverFinishedCallback = showSolveResultList;
        }
        else {
            solverRunFn = solverRun;
            solverFinishedCallback = showSolveResult;
        }

        window.dispatchEvent(new Event('resize'));
        solverRunFn(currentSelection, currentTarget, showSolveProgress, solverFinishedCallback);
    }
}

function mainButtonPress() {
    buttonPress(-2);
}

function changedSelection() {
    var selectionElement = document.getElementById("selection");

    var selectionStrings = selectionElement.value.split(/[^0-9-]/);
    var selection = [];
    for (var i = 0; i < selectionStrings.length; ++i) {
        var n = parseInt(selectionStrings[i]);
        if (!isNaN(n) && n > 0) {
            selection.push(n);
        }
    }

    uiState = REQUEST_SELECTION;

    currentSelection = selection;

    updateControls();
}

function changedTarget() {
    var targetElement = document.getElementById("target");
    uiState = REQUEST_TARGET;
    currentTarget = parseInt(targetElement.value);
    if (isNaN(currentTarget)) {
        currentTarget = 0;
    }
    else {
        updateControls();
    }
}

function initState() {
    var editBoxes = document.getElementsByClassName("inputbox");

    /* When the user presses enter, press the main button */
    for (var i = 0; i < editBoxes.length; ++i) {
        editBoxes[i].addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                /* If the selection box has focus, make the target box have
                 * focus */
                var selectionElement = document.getElementById("selection");
                var targetElement = document.getElementById("target");
                var focusTarget = true;
                if (document.activeElement === selectionElement) {
                    focusTarget = true;
                }
                document.getElementById("mainbutton").click();
                if (focusTarget) {
                    targetElement.focus();
                }
            }
        });
    }

    uiState = REQUEST_SELECTION;
    currentSelection = [];
    currentTarget = 0;
    updateControls();
}

function showOptionsScreen() {
    if (showingOptions) {
        hideOptionsScreen();
    }
    else {
        var mainButton = document.getElementById("mainbutton");
        var optionsWindow = document.getElementById("optionswindow");
        optionsWindow.style.display = "block";
        mainButton.style.display = "none";
        showingOptions = true;
    }
}

function hideOptionsScreen() {
    var mainButton = document.getElementById("mainbutton");
    var optionsWindow = document.getElementById("optionswindow");
    optionsWindow.style.display = "none";
    mainButton.style.display = null;
    showingOptions = false;
}

function showAboutScreen() {
    var aboutWindow = document.getElementById("aboutwindow");
    aboutWindow.style.display = "block";
}

function hideAboutScreen() {
    var aboutWindow = document.getElementById("aboutwindow");
    aboutWindow.style.display = "none";
}
