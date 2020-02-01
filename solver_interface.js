
function clearOutput() {
    var answerDiv = document.getElementById("answerdiv");
    answerDiv.innerText = "";
    while (answerDiv.firstChild) {
        answerDiv.removeChild(answerDiv.firstChild);
    }
}

function showSolveResult(expression, target, errorMessage) {
    var answerDiv = document.getElementById("answerdiv");

    clearOutput();

    if (expression != null) {
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

        var method = document.createElement("div");
        method.className = "answermethod";

        var expressionText = expression.toString();

        method.innerHTML = expressionText.replace(/\*/g, "&times;").replace(/-/, "&minus;");

        answerSummaryDiv.appendChild(answerSpan);
        answerDiv.appendChild(answerSummaryDiv);
        answerDiv.appendChild(method);
    }
    else {
        answerDiv.innerText = errorMessage;
    }

    uiState = FINISHED;
    updateControls();
}

function showSolveProgress(elapsedMs, numExpressions, nearestTotal) {
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
            "Elapsed time: " + elapsedMs.toString() + "ms<br />" +
            "Expressions: " + numExpressions.toString() + "</br />" +
            "Best so far: " + nearestTotal.toString() +
                (nearestTotal < 0 ? "" : (" (" + away.toString() + " away)"));
    }
}

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
 */

const REQUEST_SELECTION = 0;
const REQUEST_TARGET = 1;
const SOLVING = 2;
const FINISHED = 3;

var uiState = REQUEST_SELECTION;
var currentSelection = [];
var currentTarget = 0;

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
        showSolveProgress(0, 0, 0);
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

    updateControls();

    if (startSolver) {
        window.dispatchEvent(new Event('resize'));
        solverRun(currentSelection, currentTarget, showSolveProgress, showSolveResult);
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
