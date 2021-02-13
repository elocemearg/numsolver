let solverIsRunning = false;
let currentProblem = null;
let currentResults = null;
let defaultTargetMapHeadline = "";

const targetRackRadius = 10;
const targetRackMin = 1;
const targetRackMax = null;
let useAlgebraicNotation = true;
const uriSelSep = "-";

const targetMapStart = 100;
const targetMapHide = 100;
const targetMapEnd = 999;
const targetMapRowLength = 25;


class NumbersProblem {
    constructor(selection, target, errorMessage=null) {
        if (selection == null)
            this.selection = null;
        else
            this.selection = selection.slice();
        this.target = target;
        this.errorMessage = errorMessage;
        this.strategy = STRATEGY_ALL_SOLUTIONS;
        this.minNumbersUsed = null;
        this.maxNumbersUsed = null;
        this.lockedNumbers = [];
    }

    getSelection() {
        return this.selection;
    }

    getTarget() {
        return this.target;
    }

    isValid() {
        if (this.selection == null)
            return false;

        if (this.isBinaryTreeStrategy() && ((this.minNumbersUsed != null &&
                this.minNumbersUsed > 1) || this.lockedNumbers.length > 0)) {
            this.errorMessage = "Can't use fast solver if a minimum number of numbers is specified or if there are any locked numbers.";
            return false;
        }
        return true;
    }

    getErrorMessage() {
        return this.errorMessage;
    }

    isAllSolutions() {
        return this.strategy == STRATEGY_ALL_SOLUTIONS;
    }

    isBinaryTreeStrategy() {
        return this.strategy != STRATEGY_ALL_SOLUTIONS;
    }

    isAllTargets() {
        return this.strategy != STRATEGY_FAST_CUT;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    getStrategy() {
        return this.strategy;
    }

    setMinNumbersUsed(count) {
        this.minNumbersUsed = count;
    }

    getMinNumbersUsed() {
        return this.minNumbersUsed;
    }

    setMaxNumbersUsed(count) {
        this.maxNumbersUsed = count;
    }

    getMaxNumbersUsed() {
        return this.maxNumbersUsed;
    }

    setLockedNumbers(locked) {
        this.lockedNumbers = locked;
    }

    getLockedNumbers() {
        return this.lockedNumbers;
    }

    getTargetRackMin() {
        if (this.isAllSolutions() || this.target == null || this.isAllTargets()) {
            return targetRackMin;
        }
        else {
            return null;
        }
    }
    
    getTargetRackMax() {
        if (this.isAllSolutions() || this.target == null || this.isAllTargets()) {
            return targetRackMax;
        }
        else {
            return null;
        }
    }

    isInRackRange(t) {
        let min, max;
        if (t < 0)
            return false;

        min = this.getTargetRackMin();
        if (min != null && t < min)
            return false;

        max = this.getTargetRackMax();
        if (max != null && t > max)
            return false;

        return true;
    }

    toQueryString() {
        let defaultStrategy = chooseStrategy(this.selection.length, this.target == null, false, false, false);
        let qStr = "?sel=" + encodeURIComponent(this.selection.join(uriSelSep));
        if (this.target != null) {
            qStr += "&target=" + this.target.toString();
        }
        if (this.strategy == STRATEGY_FAST && defaultStrategy != STRATEGY_FAST) {
            qStr += "&fast";
        }
        else if (this.strategy == STRATEGY_FAST_CUT && defaultStrategy != STRATEGY_FAST_CUT) {
            qStr += "&cut";
        }

        if (this.minNumbersUsed != null) {
            qStr += "&min=" + this.minNumbersUsed.toString();
        }
        if (this.maxNumbersUsed != null) {
            qStr += "&max=" + this.maxNumbersUsed.toString();
        }

        if (this.lockedNumbers.length > 0) {
            qStr += "&lock=" + encodeURIComponent(this.lockedNumbers.join(uriSelSep));
        }

        return qStr;
    }

    canDo(other) {
        return this.isAllTargets() &&
            this.strategy >= other.strategy &&
            selectionsEqual(this.getSelection(), other.getSelection()) &&
            this.minNumbersUsed == other.minNumbersUsed &&
            this.maxNumbersUsed == other.maxNumbersUsed &&
            selectionsEqual(this.lockedNumbers, other.lockedNumbers);
    }
}

function selectionsEqual(s1o, s2o) {
    let s1 = s1o.slice();
    let s2 = s2o.slice();

    if (s1.length != s2.length) {
        return false;
    }

    s1.sort(compareFunction=function(a, b) { return a - b; });
    s2.sort(compareFunction=function(a, b) { return a - b; });

    for (let i = 0; i < s1.length; ++i) {
        if (s1[i] != s2[i]) {
            return false;
        }
    }

    return true;
}

function HTMLescape(str) {
    return str.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
}

function useBetterSymbols(str) {
    return str.replace(/\*/g, "&times;").replace(/-/g, "&minus;");
}

function solutionToHTML(sol, algebraic=null) {
    if (algebraic === null) {
        algebraic = useAlgebraicNotation;
    }
    return useBetterSymbols(
            HTMLescape(
                sol.toString(algebraic ? NOTATION_ALGEBRAIC : NOTATION_DESCRIPTIVE)
            ).replace(/\n/g, "<br />")
    );
}

function discardContents(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function clearResults() {
    let solutionsContainer = document.getElementById("solutionscontainer");
    discardContents(solutionsContainer);
    let solutionsHeadline = document.getElementById("solutionsheadlinetext");
    discardContents(solutionsHeadline);
    let targetMapHeadline = document.getElementById("targetmapheadlinetext");
    discardContents(targetMapHeadline);

    let solutionsHeadlineLink = document.getElementById("solutionsheadlinelink");
    solutionsHeadlineLink.style.display = "none";

    let targetMapHeadlineLink = document.getElementById("targetmapheadlinelink");
    targetMapHeadlineLink.style.display = "none";
    let targetMapHeadlineSolution = document.getElementById("targetmapheadlinesolution");
    targetMapHeadlineSolution.style.display = "none";
}

function buildSolutionDiv(solution, target, showEquals=false, algebraic=null) {
    let div = document.createElement("div");
    div.classList.add("categorysolution");
    if (solution.getValue() == target) {
        div.classList.add("categorysolutionexact");
    }
    else {
        div.classList.add("categorysolutioninexact");
    }

    if (algebraic === null) {
        algebraic = useAlgebraicNotation;
    }

    let html = solutionToHTML(solution, algebraic);
    if (showEquals && algebraic) {
        html += " = " + solution.getValue().toString();
    }
    div.innerHTML = html;
    return div;
}

function getActiveHeadlineDiv() {
    return document.getElementById(currentProblem.getTarget() == null ? "targetmapheadlinetext" : "solutionsheadlinetext");
}

function getActiveHeadlineLinkDiv() {
    return document.getElementById(currentProblem.getTarget() == null ? "targetmapheadlinelink" : "solutionsheadlinelink");
}

function makeNumbersProblemFromInput(input, targetInputValue) {
    /* Split the input up by whitespace */
    let selection = [];
    let target = null;
    let nextIsTarget = false;
    let minNumbersUsed = null;
    let maxNumbersUsed = null;
    let lockedNumbers = [];
    let cutSpecified = false;
    let fastSpecified = false;
    let allSpecified = false;

    input = input.replace(/^\s+|\s+$/g, "");
    input = input.toLowerCase();

    if (input == "") {
        /* Do nothing */
        return null;
    }

    if (input == "help") {
        openHelp();
        clearInput();
        return null;
    }

    let parameters = input.split(/\s+/);

    /* Having split what the user entered into an array of words, interpret
     * each word as a number and interpret those as a numbers puzzle. */
    for (let i = 0; i < parameters.length; ++i) {
        let param = parameters[i];
        if (param === "target" || param === "@" || param === "->" || param === "→") {
            /* The word "target" or the token "@" means that the next word
             * is the target no matter what we might assume */
            nextIsTarget = true;
        }
        else if (param === "cut") {
            cutSpecified = true;
        }
        else if (param === "fast") {
            fastSpecified = true;
        }
        else if (param === "all") {
            allSpecified = true;
        }
        else if (param.indexOf('=') >= 0) {
            let nameValue = param.split('=');
            let name = nameValue[0];
            let value = nameValue[1];
            if (name == "min" || name == "max") {
                let count = parseInt(value);
                if (isNaN(count)) {
                    return new NumbersProblem(null, null, "Invalid value for parameter \"" + name + "\": " + value);
                }
                if (name == "min") {
                    minNumbersUsed = count;
                }
                else {
                    maxNumbersUsed = count;
                }
            }
        }
        else {
            if (param.substr(0, 1) === "@") {
                /* If a word begins with @, the rest of it is the target */
                param = param.substr(1);
                nextIsTarget = true;
            }

            if (param == "4l") {
                /* 4L: shorthand for the standard four large */
                if (nextIsTarget) {
                    return new NumbersProblem(null, null, "Invalid target: \"" + parameters[i] + "\".");
                }
                for (let i = 100; i >= 25; i -= 25) {
                    selection.push(i);
                }
            }
            else {
                let locked = false;
                if (param.charAt(0).toUpperCase() == "L") {
                    /* Number begins with L -> locked number */
                    locked = true;
                    param = param.substring(1);
                }

                /* This should be an integer. If it isn't, complain at the
                 * user. */
                let n = parseInt(param);
                if (isNaN(n)) {
                    return new NumbersProblem(null, null, "Invalid " + (nextIsTarget ? "target" : "selection") + ": \"" + param + "\" is not a number.");
                }

                /* Set this number as the target, or add it to the selection,
                 * as appropriate. */
                if (nextIsTarget) {
                    if (target != null) {
                        return new NumbersProblem(null, null, "You've specified more than one target. Please don't do that.");
                    }
                    target = n;
                }
                else {
                    selection.push(n);
                    if (locked) {
                        lockedNumbers.push(n);
                    }
                }
            }

            nextIsTarget = false;
        }
    }

    if (target == null) {
        /* No target specified in the first box, so take what's in the second
         * box. If there's nothing in the second box either then we have no
         * target and we show the target map. */
        targetInputValue = targetInputValue.trim();
        if (targetInputValue !== "") {
            target = parseInt(targetInputValue);
            if (isNaN(target)) {
                return new NumbersProblem(null, null, "Invalid numbers puzzle: target \"" + targetInputValue + "\" is not a number.");
            }
        }
    }
    else {
        /* There is a target in the first box, so put it in the second box. */
        let targetInput = document.getElementById("targetinput");
        targetInput.value = target.toString();
    }

    if (target == 0) {
        target = null;
    }

    if (target != null && target <= 0) {
        return new NumbersProblem(null, null, "Invalid target \"" + target.toString() + "\": target must be a positive integer.");
    }

    if (selection.length > SELECTION_MAX_FAST) {
        return new NumbersProblem(null, null, "Selection may not contain more than " + SELECTION_MAX_FAST.toString() + " numbers.");
    }

    let np = new NumbersProblem(selection, target);
    let strategy = chooseStrategy(selection.length, target == null, cutSpecified, fastSpecified, allSpecified);
    
    np.setStrategy(strategy);

    if (minNumbersUsed != null)
        np.setMinNumbersUsed(minNumbersUsed);
    if (maxNumbersUsed != null)
        np.setMaxNumbersUsed(maxNumbersUsed);
    if (lockedNumbers.length > 0)
        np.setLockedNumbers(lockedNumbers);

    return np;
}

function makeFreqMap(locked) {
    let lockedCounts = {};
    for (let i = 0; i < locked.length; ++i) {
        let n = locked[i];
        if (lockedCounts[n] == undefined) {
            lockedCounts[n] = 1;
        }
        else {
            lockedCounts[n] += 1;
        }
    }
    return lockedCounts;
}

function chooseStrategy(selectionLength, targetIsNull, cut, fast, all) {
    let strategy;
    if (cut && !targetIsNull) {
        strategy = STRATEGY_FAST_CUT;
    }
    else if (selectionLength > SELECTION_MAX_FULL) {
        if (targetIsNull || all || fast)
            strategy = STRATEGY_FAST;
        else
            strategy = STRATEGY_FAST_CUT;
    }
    else {
        if (fast)
            strategy = STRATEGY_FAST;
        else
            strategy = STRATEGY_ALL_SOLUTIONS;
    }
    return strategy;
}

function queryStringToDict(queryString) {
    let dict = {};
    if (queryString == null || queryString.length == 0) {
        return dict;
    }

    if (queryString[0] == '?') {
        queryString = queryString.substring(1);
    }

    let components = queryString.split("&");
    for (let i = 0; i < components.length; ++i) {
        let nameEqualsValue = components[i];
        let equalsPos = nameEqualsValue.search("=");

        if (equalsPos >= 0) {
            name = nameEqualsValue.substring(0, equalsPos);
            value = nameEqualsValue.substring(equalsPos + 1);
        }
        else {
            name = nameEqualsValue;
            value = "";
        }

        name = decodeURIComponent(name.replace(/\+/g, " "));
        value = decodeURIComponent(value.replace(/\+/g, " "));
        dict[name] = value;
    }

    return dict;
}

function makeNumbersProblemFromQueryString(queryString) {
    if (queryString == null || queryString.length == 0) {
        return null;
    }

    let dict = queryStringToDict(queryString);

    let selection;
    let target = null;
    let lockedNumbers = [];
    let minNumbersUsed = null;
    let maxNumbersUsed = null;

    if ("sel" in dict) {
        let selectionStr = dict["sel"];
        let selectionArr = selectionStr.split(uriSelSep);
        selection = [];
        for (let i = 0; i < selectionArr.length; ++i) {
            let n = parseInt(selectionArr[i]);
            if (isNaN(n)) {
                console.log("Ignoring query string " + queryString + ": invalid number " + selectionArr[i] + ".");
                return null;
            }
            selection.push(n);
        }
    }
    else {
        return null;
    }

    if ("lock" in dict) {
        let lockedStr = dict["lock"];
        let lockedArr = lockedStr.split(uriSelSep);
        lockedNumbers = [];
        for (let i = 0; i < lockedArr.length; ++i) {
            let n = parseInt(lockedArr[i]);
            if (isNaN(n)) {
                console.log("Ignoring query string " + queryString + ": invalid locked number " + lockedArr[i] + ".");
                return null;
            }
            lockedNumbers.push(n);
        }
    }

    if ("target" in dict) {
        let n = parseInt(dict["target"]);
        if (isNaN(n)) {
            console.log("Ignoring query string " + queryString + ": invalid target " + dict["target"] + ".");
            return null;
        }
        target = n;
    }

    if ("min" in dict) {
        let n = parseInt(dict["min"]);
        if (isNaN(n)) {
            console.log("Ignoring query string " + queryString + ": invalid min value " + dict["min"] + ".");
            return null;
        }
        minNumbersUsed = n;
    }

    if ("max" in dict) {
        let n = parseInt(dict["max"]);
        if (isNaN(n)) {
            console.log("Ignoring query string " + queryString + ": invalid max value " + dict["max"] + ".");
            return null;
        }
        maxNumbersUsed = n;
    }

    let numbersProblem = new NumbersProblem(selection, target);
    let strategy = chooseStrategy(selection.length, target == null, "cut" in dict, "fast" in dict, "all" in dict);
    numbersProblem.setStrategy(strategy);

    if (minNumbersUsed != null)
        numbersProblem.setMinNumbersUsed(minNumbersUsed);
    if (maxNumbersUsed != null)
        numbersProblem.setMaxNumbersUsed(maxNumbersUsed);
    if (lockedNumbers.length > 0)
        numbersProblem.setLockedNumbers(lockedNumbers);

    return numbersProblem;
}


function buildAndDisplayNearestSolutions(fullSolutionsDiv, problem, distinctTotals, totalToExpressions, bestSolutions) {
    let target = problem.getTarget();

    /* solutionbytotal
     *   contains solutioncategory (if problem.isAllSolutions())
     *     contains categorysolutioncontainer
     *       contains categorysolution
     */
    for (let totalIndex = 0; totalIndex < distinctTotals.length; ++totalIndex) {
        let categoryNames = [];
        let categoryGroups = {};
        let total = distinctTotals[totalIndex];
        let thisTotalExprs = totalToExpressions[total];
        let totalDiv = document.createElement("div");

        totalDiv.classList.add("solutionbytotal");
        if (distinctTotals.length == 1) {
            totalDiv.classList.add("solutionbytotalsingle");
        }

        /* Print this total, and the number of solutions if known. */
        let totalSolutionCountString;
        if (!problem.isAllSolutions() || distinctTotals.length == 1) {
            totalSolutionCountString = "";
        }
        else if (thisTotalExprs.length == 1) {
            totalSolutionCountString = "(1 method)";
        }
        else {
            totalSolutionCountString = "(" + thisTotalExprs.length.toString() + " methods)";
        }

        let totalHeadingDiv = document.createElement("div");
        totalHeadingDiv.className = "solutiontotalheading";
        totalHeadingDiv.innerHTML = "<span class=\"headingtotal\">" +
            total.toString() + "</span> " + "<span class=\"headingsolcount\">" +
            totalSolutionCountString + "</span>";
        totalDiv.appendChild(totalHeadingDiv);

        if (problem.isAllSolutions()) {
            /* Sort the solutions for this total into categories */
            for (let i = 0; i < thisTotalExprs.length; ++i) {
                let exp = thisTotalExprs[i];
                let catName = getCategoryName(exp, problem.getSelection().length);
                if (!(catName in categoryGroups)) {
                    categoryGroups[catName] = [exp];
                    categoryNames.push(catName);
                }
                else {
                    categoryGroups[catName].push(exp);
                }
            }

            /* For each category, output the category's heading and the
             * solutions that fall under that category */
            for (let catIndex = 0; catIndex < categoryNames.length; ++catIndex) {
                let catDiv = document.createElement("div");
                let catName = categoryNames[catIndex];
                let catSolutions = categoryGroups[catName];
                let catHeadingDiv = document.createElement("div");
                let catSolContainer = document.createElement("div");

                if (catName === "Add them all together") {
                    catName = "&#x1F40D;";
                }
                else {
                    catName = useBetterSymbols(HTMLescape(catName));
                }

                catDiv.className = "solutioncategory";
                catHeadingDiv.className = "solutioncategoryheading";
                catHeadingDiv.innerHTML = catName;
                catDiv.appendChild(catHeadingDiv);

                catSolContainer.className = "categorysolutioncontainer";

                for (let solIndex = 0; solIndex < catSolutions.length; ++solIndex) {
                    let exp = catSolutions[solIndex];
                    let solDiv = buildSolutionDiv(exp, target, false);
                    catSolContainer.appendChild(solDiv);

                    /* If we double-click the first token of a solution, don't
                     * make this select the last token in the previous solution
                     * as well */
                    solDiv.insertAdjacentHTML("afterend", "&ZeroWidthSpace;");
                }
                catDiv.appendChild(catSolContainer);
                totalDiv.appendChild(catDiv);
            }
        }
        else {
            /* Fast-solve, so there's only one solution. It'll be a
             * BinaryTree solution, so the category pattern matching thing
             * won't work on it. */
            let exp = null;

            /* Find the first solution in bestSolutions which evaluates to
             * "total". We might have two "nearest" solutions on different
             * totals. */
            for (let i = 0; i < bestSolutions.length; ++i) {
                if (bestSolutions[i].getValue() == total) {
                    exp = bestSolutions[i];
                    break;
                }
            }

            if (exp != null) {
                let solDiv = document.createElement("div");
                solDiv.classList.add("categorysolution");
                if (exp.getValue() == target) {
                    solDiv.classList.add("categorysolutionexact");
                }
                else {
                    solDiv.classList.add("categorysolutioninexact");
                }
                solDiv.innerHTML = solutionToHTML(exp);
                totalDiv.appendChild(solDiv);
            }

            if (!problem.isAllSolutions()) {
                let warningDiv = document.createElement("div");
                warningDiv.className = "fastsolverwarningdiv";
                warningDiv.innerHTML = "<span class=\"fastsolverwarning\">Fast solver used. There may be more solutions.</span>";
                totalDiv.appendChild(warningDiv);
            }
        }

        fullSolutionsDiv.appendChild(totalDiv);
    }
}

function setTargetMapHeadline(hoveredTarget, displayResults) {
    let headlineDivText = document.getElementById("targetmapheadlinetext");
    let headlineDivSolution = document.getElementById("targetmapheadlinesolution");
    let headlineDivLink = document.getElementById("targetmapheadlinelink");
    if (hoveredTarget == null) {
        /* Cursor isn't hovering over a target, so display the default
         * headline rather than a solution for that target. */
        if (displayResults && defaultTargetMapHeadline != null) {
            headlineDivText.innerText = defaultTargetMapHeadline;
            headlineDivSolution.style.display = "none";
            headlineDivLink.style.display = "inline-block";
        }
    }
    else if (currentResults != null && !solverIsRunning) {
        /* Cursor is hovering over a target, and the solver has finished
         * solving. Set the headline to the number of solutions for this
         * target, and show one example. */
        let imperfectMap = currentResults.getImperfectSolutions();
        let allSols = currentProblem.isAllSolutions();
        if (hoveredTarget in imperfectMap && imperfectMap[hoveredTarget].length > 0) {
            let sols = imperfectMap[hoveredTarget];
            let html = hoveredTarget.toString();

            if (!allSols) {
                html += " is possible with this selection.";
            }
            else if (sols.length == 1) {
                html += " has only one solution with this selection.";
            }
            else {
                html += " has " + sols.length.toString() + " solutions with this selection.";
            }
            headlineDivText.innerHTML = html;

            let solDiv = buildSolutionDiv(sols[0], hoveredTarget, false, true);
            solDiv.classList.add("inheadlinesolution");
            discardContents(headlineDivSolution);
            headlineDivSolution.appendChild(solDiv);
        }
        else {
            headlineDivText.innerText = hoveredTarget.toString() + " is not possible with this selection.";
            discardContents(headlineDivSolution);
        }

        headlineDivSolution.style.display = "inline-block";
        headlineDivLink.style.display = "none";
    }
}

function showTargetMapKey(showFullKey, showFastKey) {
    let slowKey = document.getElementById("targetmapkey");
    let fastKey = document.getElementById("targetmapkeyfast");
    slowKey.style.display = (showFullKey ? "block" : "none");
    fastKey.style.display = (showFastKey ? "block" : "none");
}

function targetToAltText(target, solutionCount, haveAllSolutions) {
    let altText = target.toString();
    if (solutionCount !== null) {
        if (target == 404 && solutionCount !== null && solutionCount == 0) {
            altText += ": not found";
        }
        else if (haveAllSolutions) {
            altText += ": ";
            if (solutionCount == 0) {
                altText += "no solutions";
            }
            else {
                altText += solutionCount.toString() + " solution" + (solutionCount == 1 ? "" : "s");
            }
        }
        else {
            if (solutionCount > 0) {
                altText += ": possible";
            }
            else {
                altText += ": impossible";
            }
        }
    }
    return altText;
}

function updateAndDisplayTargetMap(problem, totalToExpressions) {
    let possibleTargets = 0;
    for (let target = targetMapStart; target <= targetMapEnd; ++target) {
        let solutionCount;
        let cell = document.getElementById("targetmap" + target.toString());

        if (cell == null)
            continue;

        if (totalToExpressions != null && target in totalToExpressions && totalToExpressions[target].length > 0) {
            solutionCount = totalToExpressions[target].length;
            if (target != targetMapHide) {
                possibleTargets++;
            }
        }
        else {
            solutionCount = 0;
        }

        let fgbg = solutionCountToFGBG(solutionCount, false);
        cell.style.color = fgbg[0];
        cell.style.backgroundColor = fgbg[1];

        if (problem == null || totalToExpressions == null)
            solutionCount = null;

        let altText = targetToAltText(target, solutionCount, problem == null ? false : problem.isAllSolutions());
        cell.setAttribute("alt", altText);
        cell.setAttribute("title", altText);
    }

    if (totalToExpressions != null) {
        defaultTargetMapHeadline = possibleTargets.toString() + " of 899 targets are possible with this selection.";
    }
    setTargetMapHeadline(null, totalToExpressions != null);

    let targetMapDiv = document.getElementById("targetmapcontainer");
    targetMapDiv.style.display = null;

    let solutionsOuterDiv = document.getElementById("solutionsoutercontainer");
    solutionsOuterDiv.style.display = "none";

    if (problem == null) {
        showTargetMapKey(false, false);
    }
    else {
        showTargetMapKey(problem.isAllSolutions(), !problem.isAllSolutions());
    }
}

function hideTargetMap() {
    let targetMapDiv = document.getElementById("targetmapcontainer");
    targetMapDiv.style.display = "none";

    let solutionsOuterDiv = document.getElementById("solutionsoutercontainer");
    solutionsOuterDiv.style.display = null;
}

function showEmptyTargetMap() {
    updateAndDisplayTargetMap(null, null);
}

function enableMapButton() {
    let button = document.getElementById("targetmapbutton");
    button.disabled = false;
}

function disableMapButton() {
    let button = document.getElementById("targetmapbutton");
    button.disabled = true;
}

function closeHelp() {
    let helpDiv = document.getElementById("helpsection");
    helpDiv.style.display = "none";
}

function openHelp() {
    let helpDiv = document.getElementById("helpsection");
    helpDiv.style.display = "block";
}

function openPreferences() {
    let preferencesDiv = document.getElementById("prefssection");
    preferencesDiv.style.display = "block";
}

function closePreferences() {
    /* Close the preferences dialogue. */
    let prefsDiv = document.getElementById("prefssection");
    prefsDiv.style.display = "none";

    /* Check whether algebraic or descriptive is checked, and set
     * useAlgebraicNotation accordingly. */
    let descriptive = document.getElementById("notationd");
    if (descriptive.checked) {
        useAlgebraicNotation = false;
    }
    else {
        useAlgebraicNotation = true;
    }

    let cookieConsent = document.getElementById("saveprefsyes");
    if (cookieConsent.checked) {
        /* If the cookie consent radio button is checked, save these preferences
         * as a cookie now. */
        setCookie("quantum_tombola_cookies", "yes");
        setCookie("quantum_tombola_notation", useAlgebraicNotation ? "algebraic" : "descriptive");
    }
    else {
        /* Cookie consent not checked, so remove any cookies we may have
         * previously set. */
        deleteCookie("quantum_tombola_cookies");
        deleteCookie("quantum_tombola_notation");
    }
}

function hideWelcome() {
    let welcomeDiv = document.getElementById("welcomesection");
    welcomeDiv.style.display = "none";
}

function selectInputBox(highlight) {
    let inputElement = document.getElementById("solverinput");
    if (highlight) {
        inputElement.select();
    }
    inputElement.focus();
}

function clearInput() {
    let inputElement = document.getElementById("solverinput");
    inputElement.value = "";
}

function selectionBoxClick() {
    let selectionBox = document.getElementById("solverinput");
    if (selectionBox.selectionStart >= selectionBox.selectionEnd) {
        selectionBox.select();
    }
}


function createPageLinkElement(problem) {
    let a = document.createElement("a");
    a.href = document.location.protocol + "//" +
            document.location.host + document.location.pathname +
            problem.toQueryString();
    a.innerText = "link to this page";
    return a;
}

function setCurrentPageLink(problem) {
    let headlineLinkDiv = getActiveHeadlineLinkDiv();
    discardContents(headlineLinkDiv);
    headlineLinkDiv.appendChild(createPageLinkElement(problem));
    headlineLinkDiv.style.display = "inline-block";

    window.history.replaceState(null, null, problem.toQueryString());
}

function targetBoxClick() {
    let targetBox = document.getElementById("targetinput");
    if (document.activeElement !== targetBox) {
        targetBox.select();
    }
}


let hsv_sextant_starts = [ 0, 1, 2, 2, 1, 0 ];
let hsv_sextant_deltas = [ 1, -1, 1, -1, 1, -1 ];
function hsv_to_rgb(hue, saturation, value) {
    /* hue: 0-360
     * saturation: 0.0-1.0
     * value: 0.0-1.0
     *
     * Uses algorithm shamelessly nicked from Wikipedia.
     */
    let chroma = value * saturation;
    let sextant = Math.floor(hue / 60) % 6;
    let x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));

    let a = [ chroma, x, 0 ];
    let rgb = [0, 0, 0];

    let index = hsv_sextant_starts[sextant];
    let delta = hsv_sextant_deltas[sextant];
    for (let i = 0; i < 3; ++i) {
        rgb[i] = a[index];
        index = (index + 3 + delta) % 3;
    }

    let m = value - chroma;
    for (let i = 0; i < 3; ++i) {
        rgb[i] += m;
        rgb[i] = Math.floor(rgb[i] * 256);
        if (rgb[i] == 256)
            rgb[i] = 255;
    }

    return rgb;
}

function rgb_to_string(rgb) {
    let rgb_str = "#";
    for (let i = 0; i < 3; ++i) {
        if (rgb[i] < 16)
            rgb_str += "0";
        rgb_str += rgb[i].toString(16);
    }
    return rgb_str;
}


/* Background colour of a cell depends on the number of solutions.
 * 0 solutions: grey on lighter grey.
 * 1 solution: white background, black text (or grey if !saturate).
 * 2 or more solutions: hue component of background HSV colour is
 *     given by: min(sqrt(numsols - 2), 10) * 270 / 10. Lower counts of
 *     solutions are towards 0 degrees (red), higher counts of solutions are
 *     towards 270 degrees (blue-purple).
 *     Text is black, or grey if !saturate.
 */

/* Constants to work out approximate "brightness" of an RGB colour, taken from
 * https://www.w3.org/TR/AERT/#color-contrast */
const brightnessCoeffs = [0.299, 0.587, 0.114]
function solutionCountToFGBG(solutionCount, saturate) {
    let darkText = (saturate ? "#000000" : "#333333");
    let lightText = (saturate ? "#ffffff" : "#cccccc");
    if (solutionCount == 0) {
        return [ "#888888", "#dddddd" ];
    }
    else if (solutionCount == 1) {
        return [ darkText, "#ffffff" ];
    }
    else {
        let hue = Math.min(Math.sqrt(solutionCount - 2), 10) * 27.0;
        let rgb = hsv_to_rgb(hue, saturate ? 0.4 : 0.2, 1);
        let roughBrightness = 0;
        for (let i = 0; i < 3; ++i) {
            roughBrightness += brightnessCoeffs[i] * rgb[i] / 255.0;
        }
        return [ (roughBrightness > 0.5 ? darkText : lightText),
                  rgb_to_string(rgb) ];
    }
}

function desktopProgressCallback(solverProgress) {
    let solutionsContainer = document.getElementById("solutionscontainer");
    let headlineDiv = getActiveHeadlineDiv();

    if (solverProgress.getTarget() == null) {
        headlineDiv.innerText = "Please wait (" +
            Math.floor(solverProgress.getElapsedMs() / 1000).toString() +
            "s, " + solverProgress.getNumExpressionsBuilt().toString() +
            " expressions)...";
    }
    else {
        headlineDiv.innerText = "Please wait...";

        let fullSolutionsDiv = document.getElementById("fullsolutionsprogress");
        if (fullSolutionsDiv == null) {
            fullSolutionsDiv = document.createElement("div");
            fullSolutionsDiv.className = "fullsolutions";
            fullSolutionsDiv.id = "fullsolutionsprogress";
            solutionsContainer.appendChild(fullSolutionsDiv);
        }

        let prog = "";
        let exampleSolution = null;

        prog += "Elapsed time: " + Math.floor(solverProgress.getElapsedMs() / 1000).toString() + "s";
        prog += "<br />";
        prog += "Expressions generated: " + solverProgress.getNumExpressionsBuilt().toString();

        let target = solverProgress.getTarget();
        if (target !== null) {
            let bestTotal = solverProgress.getBestTotalSoFar();
            prog += "<br />";
            prog += "Best so far: ";
            if (bestTotal == target) {
                prog += bestTotal.toString();
                if (currentProblem.isAllSolutions()) {
                    let numSols = solverProgress.getNumBestSolutionsSoFar();
                    prog += " (" + numSols.toString() + " solution" +
                        (numSols == 1 ? "" : "s") + ")";
                }
            }
            else {
                let away = Math.abs(bestTotal - target);
                prog += away.toString() + " away";
            }

            let bestSol = solverProgress.getBestSolutionSoFar();
            if (bestSol !== null) {
                prog += "<br />";
                prog += "Example:<br />";
                exampleSolution = buildSolutionDiv(bestSol, target, true);
            }
        }

        fullSolutionsDiv.innerHTML = prog;
        if (exampleSolution != null) {
            fullSolutionsDiv.appendChild(exampleSolution);
        }
    }
}

function outputError(message) {
    let div = document.getElementById("errorcontainer");
    div.style.display = null;

    let textDiv = document.getElementById("errormessagebox");
    textDiv.innerText = message;
}

function removeError() {
    let div = document.getElementById("errorcontainer");
    div.style.display = "none";
}

function hideTargetRack(removeFromFlow=false) {
    let targetRack = document.getElementById("targetrack");
    if (targetRack) {
        if (removeFromFlow) {
            targetRack.style.display = "none";
            targetRack.style.visibility = null;
        }
        else {
            targetRack.style.display = null;
            targetRack.style.visibility = "hidden";
        }
    }
}

function setDisplayNoTarget() {
    let targetDiv = document.getElementById("target");
    hideTargetRack(true);
    targetDiv.style.display = "none";
}

function setDisplayWithTarget() {
    let targetDiv = document.getElementById("target");
    targetDiv.style.display = null;
}

/* Fill in the rack of targets either side of the actual target with the
 * 10 target numbers either side. */
function setTargetRackNumbers(problem) {
    let target = problem.getTarget();
    if (target == null)
        return;

    let targetRack = document.getElementById("targetrack");
    if (targetRack) {
        targetRack.style.display = null;
        targetRack.style.visibility = null;
    }
    for (let otherTotal = target - targetRackRadius; otherTotal <= target + targetRackRadius; ++otherTotal) {
        let away = otherTotal - target;
        let divName = "targetnumber";
        let divNames = [];
        if (away < 0)
            divName += "minus";
        if (away > 0)
            divName += "plus";

        if (away != 0) {
            divName += Math.abs(away).toString();
            divNames = [ divName ];
        }
        else {
            divName = "target";
            divNames = [ divName, "targetplaceholder" ];
        }

        for (let i = 0; i < divNames.length; ++i) {
            let numberDiv = document.getElementById(divNames[i]);
            if (numberDiv) {
                numberDiv.removeAttribute("title");
                if (problem.isInRackRange(otherTotal)) {
                    numberDiv.innerText = otherTotal.toString();
                }
                else {
                    numberDiv.innerText = "";
                }
            }
        }
    }
}

/* Fill in the solution counts for the rack of targets, 10 either side of
 * the actual target. Also colour the cell background appropriately: grey for
 * impossible, white for one solution, and somewhere on the spectrum of red
 * to violet for increasing numbers of different solutions.
 *
 * If "solutions" is null, then the solution counts are not known and they're
 * all set to grey.
 *
 * If problem.isAllSolutions() is true, then we write the solution counts in
 * the cells. If it's false then we just write a tick or a cross to indicate
 * that either a solution exists or no solution exists.
 */
function setTargetRackSolutionCounts(problem, solutions) {
    let haveAllSolutions = problem.isAllSolutions();
    let target = problem.getTarget();

    for (let otherTotal = target - targetRackRadius; otherTotal <= target + targetRackRadius; ++otherTotal) {
        let away = otherTotal - target;
        let cellSuffix = "";
        let solutionCount = 0;

        if (away < 0)
            cellSuffix += "minus";
        if (away > 0)
            cellSuffix += "plus";
        if (away != 0)
            cellSuffix += Math.abs(away).toString();

        if (solutions == null) {
            solutionCount = null;
        }
        else if (!problem.isInRackRange(otherTotal)) {
            solutionCount = null;
        }
        else if (otherTotal in solutions) {
            solutionCount = solutions[otherTotal].length;
            if (!haveAllSolutions && solutionCount > 1)
                solutionCount = 1;
        }
        else {
            solutionCount = 0;
        }

        let solCountDiv = document.getElementById("targetsolcount" + cellSuffix);
        if (solCountDiv) {
            if (solutionCount !== null) {
                if (haveAllSolutions) {
                    solCountDiv.innerText = solutionCount.toString();
                }
                else {
                    if (solutionCount == 0) {
                        solCountDiv.innerHTML = "&#x2718;";
                    }
                    else {
                        solCountDiv.innerHTML = "<span style=\"color: #008800;\">&#x2714;</span>";
                    }
                }
            }
            else {
                solCountDiv.innerText = "";
            }
        }

        let targetCell = document.getElementById("target" + cellSuffix);
        if (targetCell) {
            let fgbg = solutionCountToFGBG(solutionCount === null ? 0 : solutionCount, away == 0);
            targetCell.style.color = fgbg[0];
            targetCell.style.backgroundColor = fgbg[1];

            let altText = targetToAltText(otherTotal, solutionCount, haveAllSolutions);
            targetCell.setAttribute("alt", altText);
            targetCell.setAttribute("title", altText);
        }
        if (solutions == null || !problem.isInRackRange(otherTotal)) {
            targetCell.removeAttribute("onclick");
            targetCell.style.cursor = null;
        }
        else {
            targetCell.setAttribute("onclick", "nearbyTargetClick(" + (away).toString() + ");");
            targetCell.style.cursor = "pointer";
        }
    }
}

function setTargetBackgroundColour(solutionCount) {
    let targetCell = document.getElementById("target");
    if (targetCell) {
        let fgbg = solutionCountToFGBG(solutionCount === null ? 0 : solutionCount, true);
        targetCell.style.color = fgbg[0];
        targetCell.style.backgroundColor = fgbg[1];
    }
}

function discardSelection() {
    let selectionRack = document.getElementById("selectionrack");
    discardContents(selectionRack);
}

function setProblemStatement(selection, target, minNumbersUsed=null,
            maxNumbersUsed=null, lockedNumbers=[]) {
    /* Show our understanding of what the problem is, i.e. the numbers and
     * target we used. */
    let lockedNumbersCounts = makeFreqMap(lockedNumbers);

    let selectionRack = document.getElementById("selectionrack");
    if (selectionRack) {
        discardContents(selectionRack);

        let selectionTargetContainer = document.createElement("div");
        selectionTargetContainer.classList.add("currenttargetcellcontainer");

        let selectionTarget = document.createElement("div");
        selectionTarget.classList.add("currenttargetcell");
        selectionTarget.classList.add("currenttargetcellvisible");
        selectionTarget.id = "target";
        if (target == null) {
            selectionTarget.innerText = "";
        }
        else {
            selectionTarget.innerText = target.toString();
        }
        selectionTargetContainer.appendChild(selectionTarget);
        selectionRack.appendChild(selectionTargetContainer);

        let selectionBorder = document.createElement("div");
        selectionBorder.className = "selectioncellsborder";
        for (let i = 0; i < selection.length; ++i) {
            let numberDiv = document.createElement("div");
            let n = selection[i];
            numberDiv.classList.add("selectioncell");
            numberDiv.innerHTML = n.toString();
            if (n in lockedNumbersCounts && lockedNumbersCounts[n] > 0) {
                lockedNumbersCounts[n] -= 1;
                numberDiv.classList.add("selectioncelllocked");
            }
            selectionBorder.appendChild(numberDiv);
            if (i == 0)
                numberDiv.insertAdjacentHTML("beforebegin", "&nbsp;");
            numberDiv.insertAdjacentHTML("afterend", "&nbsp;");
        }
        selectionRack.appendChild(selectionBorder);

        if (minNumbersUsed != null || maxNumbersUsed != null) {
            let footer = document.createElement("div");
            footer.classList.add("selectionfooter");
            footer.innerText = "";
            if (minNumbersUsed != null) {
                footer.innerText += "Minimum " + minNumbersUsed.toString() + " numbers";
            }
            if (maxNumbersUsed != null) {
                if (footer.innerText != "") {
                    footer.innerText += ", m";
                }
                else {
                    footer.innerText = "M";
                }
                footer.innerText += "aximum " + maxNumbersUsed.toString() + " numbers";
            }
            if (footer.innerText != "") {
                footer.innerText += ".";
            }
            selectionBorder.appendChild(footer);
        }
    }

    if (target == null) {
        setDisplayNoTarget();
    }
    else {
        setDisplayWithTarget();
    }
}

/* Show the results of the solve. This will either be the list of solutions for
 * a specific target, with the target rack showing how many solutions there
 * were for nearby targets, or, if no target was specified, we'll show the
 * target map, which contains every number between 101 and 999 indicating
 * whether each one was possible. */
function outputPuzzleSolutions(results, problem) {
    let solutionsContainer = document.getElementById("solutionscontainer");
    let selection = results.getSelection();

    /* Don't use results.getTarget() because we might be called for a results
     * object with the right selection but the wrong target. The results object
     * will still contain the solutions for all possible targets. */
    let target = problem.getTarget();

    let showNearbyTargets = problem.isAllTargets() && target != null;

    /* Map of targets to lists of solutions. We call getImperfectSolutions()
     * because due to the filter we set up, this gives us every method to get
     * every target between 1 and infinity. */
    let allSolutions = results.getImperfectSolutions();

    clearResults();

    let diff = null;
    let seenHigher = false;
    let seenLower = false;
    let bestSolutions = [];

    if (showNearbyTargets) {
        /* Find the closest in this results object to target. First, as a fast
         * path, check if the target is reachable. If not, iterate through the
         * achieved targets to find the closest. */
        if (target in allSolutions) {
            bestSolutions = allSolutions[target];
            diff = 0;
        }
        else {
            for (let total in allSolutions) {
                if (diff == null || Math.abs(target - total) < diff) {
                    diff = Math.abs(target - total);
                    if (diff == 1) {
                        break;
                    }
                }
            }

            if ((target - diff) in allSolutions) {
                bestSolutions = bestSolutions.concat(allSolutions[target - diff]);
                seenLower = true;
            }
            if ((target + diff) in allSolutions) {
                bestSolutions = bestSolutions.concat(allSolutions[target + diff]);
                seenHigher = true;
            }
        }
    }
    else {
        bestSolutions = results.getSolutions();
        if (bestSolutions != null && bestSolutions.length > 0 && bestSolutions[0] != null) {
            diff = Math.abs(bestSolutions[0].getValue() - target);
        }
        else {
            diff = null;
        }
    }

    if (showNearbyTargets) {
        /* Show a row of boxes, from -targetRackRadius away to
         * +targetRackRadius away, each of which shows that target and the
         * number of methods of getting there. */
        setTargetRackNumbers(problem);
    }
    else {
        hideTargetRack();
    }

    /* Show the selection and the target. */
    setProblemStatement(selection, target, problem.getMinNumbersUsed(),
            problem.getMaxNumbersUsed(), problem.getLockedNumbers());

    if (showNearbyTargets) {
        /* Colour the backgrounds of the target and nearby targets according
         * to the number of solutions each target has. */
        setTargetRackSolutionCounts(problem, allSolutions);
    }
    else {
        /* If we only have the target box because we're not showing all
         * solutions, then colour the target background grey or white depending
         * on whether it's impossible or possible to solve exactly. */
        if (target != null) {
            setTargetBackgroundColour(diff == 0 ? 1 : 0);
        }
    }

    /* Show the headline, which is whether it's solvable, and how many best
     * solutions there are. */
    let headlineDiv = getActiveHeadlineDiv();
    if (problem.isAllSolutions() && target != null) {
        if (diff == 0) {
            if (bestSolutions.length == 1) {
                headlineDiv.innerHTML = "There is only <span class=\"headlinesolcount\">one solution</span>.";
            }
            else {
                headlineDiv.innerHTML = "There are <span class=\"headlinesolcount\">" + bestSolutions.length.toString() + " solutions</span>.";
            }
        }
        else {
            let description = "The closest possible is <span class=\"headlineaway\">" + diff.toString() + " away</span>";
            if (bestSolutions.length == 1) {
                description += ", for which there is <span class=\"headlinesolcount\">one solution</span>.";
            }
            else {
                description += ", for which there are <span class=\"headlinesolcount\">" + bestSolutions.length.toString() + " solutions</span>.";
            }
            headlineDiv.innerHTML = description;
        }
    }
    else if (diff != null) {
        if (diff == 0) {
            headlineDiv.innerHTML = "This can be solved exactly.";
        }
        else {
            headlineDiv.innerHTML = "The best possible is <span class=\"headlineaway\">" + diff.toString() + " away</span>.";
        }
    }

    setCurrentPageLink(problem);
    document.getElementById("targetmapheadlinesolution").style.display = "none";

    let totalToExpressions = {};

    /* A list of all distinct nearest totals. There will either be one (if
     * we solved it exactly, or if we get N-away one way or the other) or two
     * (if we can get N-away either way).
     * If we ran the solver in fast mode (isAllSolutions() is false), then
     * we'll only have one solution, but we can't claim it's the only one.
     */
    let distinctTotals = [];
    if (target == null) {
        totalToExpressions = allSolutions;
        for (let total in totalToExpressions) {
            distinctTotals.push(total);
        }
        distinctTotals.sort(compareFunction=function(x, y) { return x - y; });
    }
    else if (showNearbyTargets) {
        for (let i = 0; i < bestSolutions.length; ++i) {
            let exp = bestSolutions[i];
            let val = exp.getValue();
            if (val in totalToExpressions) {
                totalToExpressions[val].push(exp);
            }
            else {
                totalToExpressions[val] = [exp];
                distinctTotals.push(val);
            }
        }
        distinctTotals.sort(compareFunction=function(x, y) { return x - y; });
    }
    else {
        var sol;
        if (bestSolutions == null || bestSolutions.length == 0 || bestSolutions[0] == null) {
            sol = null;
        }
        else {
            sol = bestSolutions[0];
        }
        if (sol != null) {
            distinctTotals = [ sol.getValue() ];
            totalToExpressions[sol.getValue()] = [sol];
        }
    }

    if (target != null) {
        let fullSolutionsDiv = document.createElement("div");
        fullSolutionsDiv.className = "fullsolutions";
        buildAndDisplayNearestSolutions(fullSolutionsDiv, problem, distinctTotals, totalToExpressions, bestSolutions);
        solutionsContainer.appendChild(fullSolutionsDiv);
        enableMapButton();
    }
    else {
        updateAndDisplayTargetMap(problem, totalToExpressions);
        disableMapButton();
    }
}

function desktopSolvePuzzleFinishedCallback(results) {
    solverIsRunning = false;

    if (results.isSuccessful()) {
        currentResults = results;
        outputPuzzleSolutions(results, currentProblem);
    }
    else {
        let resultsHeadline = getActiveHeadlineDiv();
        resultsHeadline.innerText = "";
        outputError(results.getErrorMessage() == null ?
                "null null nullity null" : results.getErrorMessage());
        hideTargetMap();
    }
}

function startSolve(numbersProblem) {
    if (solverIsRunning) {
        return;
    }

    if (!numbersProblem.isValid()) {
        outputError(numbersProblem.getErrorMessage());
        return;
    }

    setTargetRackNumbers(numbersProblem);
    if (!numbersProblem.isAllTargets()) {
        hideTargetRack();
    }

    setProblemStatement(numbersProblem.getSelection(),
            numbersProblem.getTarget(), numbersProblem.getMinNumbersUsed(),
            numbersProblem.getMaxNumbersUsed(), numbersProblem.getLockedNumbers());
    setTargetRackSolutionCounts(numbersProblem, null);

    /* If we've clicked a target in the target map, we don't want any queued
     * onmouseout event to fiddle with the headline once we've displayed the
     * solutions for a specific target */
    defaultTargetMapHeadline = null;

    if (numbersProblem.getTarget() != null) {
        setDisplayWithTarget();
        hideTargetMap();
    }
    else {
        setDisplayNoTarget();
        showEmptyTargetMap();
    }

    clearResults();
    removeError();
    hideWelcome();

    if (currentResults != null && currentProblem.canDo(numbersProblem)) {
        /* We've been asked to solve a puzzle which has the same selection as
         * the one we last solved, so just use the existing results object. */
        let oldStrategy = currentProblem.getStrategy();
        currentProblem = numbersProblem;

        /* Keep the old strategy value from the previous problem, since if the
         * last problem has solutions for every target then we still have the
         * solution for every target and we don't need to rerun the whole thing
         * now we've been asked about a specific target. */
        currentProblem.setStrategy(oldStrategy);
        outputPuzzleSolutions(currentResults, currentProblem);
        //selectInputBox(true);
    }
    else {
        currentProblem = numbersProblem;

        solverIsRunning = true;

        let resultsHeadline = getActiveHeadlineDiv();
        resultsHeadline.innerText = "Please wait...";

        if (numbersProblem.isAllSolutions()) {
            solverRunAllSolutions(numbersProblem.getSelection(),
                    numbersProblem.getTarget(), desktopProgressCallback,
                    desktopSolvePuzzleFinishedCallback, targetRackMin,
                    targetRackMax, numbersProblem.getMinNumbersUsed(),
                    numbersProblem.getMaxNumbersUsed(),
                    numbersProblem.getLockedNumbers());
        }
        else if (numbersProblem.isAllTargets() || numbersProblem.getTarget() == null) {
            solverRunAllTargets(numbersProblem.getSelection(),
                    numbersProblem.getTarget(), desktopProgressCallback,
                    desktopSolvePuzzleFinishedCallback,
                    numbersProblem.getTargetRackMin(),
                    numbersProblem.getTargetRackMax(),
                    numbersProblem.getMinNumbersUsed(),
                    numbersProblem.getMaxNumbersUsed(),
                    numbersProblem.getLockedNumbers());
        }
        else {
            solverRun(numbersProblem.getSelection(),
                    numbersProblem.getTarget(), desktopProgressCallback,
                    desktopSolvePuzzleFinishedCallback,
                    numbersProblem.getMaxNumbersUsed());
        }
    }

    /* Set the selection and target inputs to show the selection and target,
     * formatted nicely and without any weirdness the user might have entered */
    let inputElement = document.getElementById("solverinput");
    let targetElement = document.getElementById("targetinput");

    /* Put the selection in the input box, preceding every locked number with
     * an L. */
    let selection = numbersProblem.getSelection();
    let lockedCounts = makeFreqMap(numbersProblem.getLockedNumbers());

    inputElement.value = "";
    for (let i = 0; i < selection.length; ++i) {
        let n = selection[i];
        if (i > 0) {
            inputElement.value += " ";
        }
        if (lockedCounts[n] !== undefined && lockedCounts[n] > 0) {
            inputElement.value += "L";
            lockedCounts[n] -= 1;
        }
        inputElement.value += n.toString();
    }

    let defaultStrategy = chooseStrategy(numbersProblem.getSelection().length, numbersProblem.getTarget() == null, false, false, false);
    switch (numbersProblem.getStrategy()) {
        case STRATEGY_FAST_CUT:
            if (defaultStrategy != STRATEGY_FAST_CUT) {
                inputElement.value += " cut";
            }
            break;

        case STRATEGY_FAST:
            if (defaultStrategy != STRATEGY_FAST) {
                if (numbersProblem.getSelection().length <= SELECTION_MAX_FULL) {
                    inputElement.value += " fast";
                }
                else {
                    /* With more than SELECTION_MAX_FULL numbers we usually use
                     * FAST_CUT but if we're using FAST with that many numbers
                     * then the user specified "all" */
                    inputElement.value += " all";
                }
            }
            break;
    }
    if (numbersProblem.getMinNumbersUsed() != null) {
        inputElement.value += " min=" + numbersProblem.getMinNumbersUsed().toString();
    }
    if (numbersProblem.getMaxNumbersUsed() != null) {
        inputElement.value += " max=" + numbersProblem.getMaxNumbersUsed().toString();
    }
    if (numbersProblem.getTarget() != null) {
        targetElement.value = numbersProblem.getTarget().toString();
    }
    else {
        targetElement.value = "";
    }
}

function enterListener(event) {
    if (event.keyCode === 13) {
        document.getElementById("solvebutton").click();
    }
}

function escapeListener(event) {
    /* Be kind to users. If you've opened a pop-up box - even if, as in this
     * case, it's one the user asked for - make sure it's easy to close. There
     * are three ways to close the Help box: click the X in the corner, click
     * anywhere outside the help box (the helpsection div) or press Escape. */
    if (event.keyCode === 27) {
        closeHelp();
        closePreferences();
    }
}

function inputEditListener(event) {
    if (event.target.value == "100 75 50 25 6 3") {
        let welcomeDiv = document.getElementById("welcomesection");
        welcomeDiv.innerText = "I mean, that was only an example, but sure, go ahead.";
    }
}

function initState() {
    let inputElement = document.getElementById("solverinput");
    let targetElement = document.getElementById("targetinput");
    inputElement.focus();

    /* If any cookies are set, initialise the user's preferences from them. */
    let cookies = readCookies();
    if (getCookieValue(cookies, "quantum_tombola_cookies", "no") == "yes") {
        let notation = getCookieValue(cookies, "quantum_tombola_notation", "algebraic");
        if (notation == "descriptive") {
            useAlgebraicNotation = false;
        }
        else {
            useAlgebraicNotation = true;
        }

        let cookieConsent = document.getElementById("saveprefsyes");
        cookieConsent.checked = true;
    }

    /* Set up the preference controls to reflect the current settings */
    if (useAlgebraicNotation) {
        let el = document.getElementById("notationa");
        el.checked = true;
    }
    else {
        let el = document.getElementById("notationd")
        el.checked = true;
    }

    /* Set up the target rack */
    let targetRack = document.getElementById("targetrack");
    discardContents(targetRack);
    for (let away = -targetRackRadius; away <= targetRackRadius; ++away) {
        let targetCell = document.createElement("div");
        let cellName;

        targetCell.classList.add("nearbytargetcell");
        if (away == 0) {
            targetCell.classList.add("currenttargetcell");
            targetCell.classList.add("currenttargetcellplaceholder");
            cellName = "";
        }
        else {
            cellName = (away < 0 ? "minus" : "plus") + Math.abs(away).toString();
        }
        if (away == 0) {
            targetCell.id = "targetplaceholder";
        }
        else {
            targetCell.id = "target" + cellName;
        }

        if (away < 0) {
            targetCell.classList.add("rackbeforetarget");
        }
        else if (away > 0) {
            targetCell.classList.add("rackaftertarget");
        }
        if (away == -5 || away == -10) {
            targetCell.classList.add("scoringboundarybelowcell");
        }
        else if (away == 5 || away == 10) {
            targetCell.classList.add("scoringboundaryabovecell");
        }

        if (away != 0) {
            let targetNumberDiv = document.createElement("div");
            targetNumberDiv.id = "targetnumber" + cellName;
            targetNumberDiv.classList.add("nearbytargetnumber");
            targetCell.appendChild(targetNumberDiv);

            let targetSolCountDiv = document.createElement("div");
            targetSolCountDiv.id = "targetsolcount" + cellName;
            targetSolCountDiv.classList.add("nearbytargetsolutioncount");
            targetCell.appendChild(targetSolCountDiv);
        }

        targetRack.appendChild(targetCell);
        if (away < targetRackRadius) {
            /* If the user double-clicks a target or a nearby total, make sure
             * the browser doesn't highlight the adjacent target as well. */
            targetCell.insertAdjacentHTML("afterend", "&ZeroWidthSpace;");
        }
    }

    /* Set up the big target map */
    let targetMapTable = document.getElementById("targetmaptable");
    let mappedTarget = targetMapStart;
    for (let rowStart = targetMapStart; rowStart <= targetMapEnd; rowStart += targetMapRowLength) {
        let rowDiv = document.createElement("div");
        rowDiv.className = "targetmaprow";
        for (let mappedTarget = rowStart;
                mappedTarget < rowStart + targetMapRowLength &&
                    mappedTarget <= targetMapEnd;
                ++mappedTarget) {
            let cell = document.createElement("div");
            cell.className = "targetmapcell";
            cell.id = "targetmap" + mappedTarget.toString();
            cell.innerText = mappedTarget.toString();
            cell.setAttribute("onclick", "targetMapClick(" + mappedTarget.toString() + ");");
            cell.setAttribute("onmouseover", "setTargetMapHeadline(" + mappedTarget.toString() + ", true);");
            cell.setAttribute("onmouseout", "setTargetMapHeadline(null, true);");
            rowDiv.appendChild(cell);
        }
        targetMapTable.appendChild(rowDiv);
    }

    /* Fill in the colour key for the target map */
    let targetMapKey = document.getElementById("targetmapkeyscale");
    let scalePoints = [0, 1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    for (let i = 0; i < scalePoints.length; ++i) {
        let n = scalePoints[i];
        let keyCell = document.createElement("div");
        let fgbg;

        keyCell.classList.add("targetmapcell");
        keyCell.classList.add("targetmapkeycell");
        if (n == 0)
            keyCell.innerText = "None";
        else
            keyCell.innerText = n.toString() + (i == scalePoints.length - 1 ? "+" : "");

        fgbg = solutionCountToFGBG(n, false);
        keyCell.style.color = fgbg[0];
        keyCell.style.backgroundColor = fgbg[1];

        targetMapKey.appendChild(keyCell);
    }

    /* Fill in the key for the fast target map, which is grey for impossible
     * and white for possible */
    targetMapKey = document.getElementById("targetmapkeyfastscale");
    let fastScalePoints = [0, 1];
    let fastScaleLegends = [ "Impossible", "Possible" ];
    for (let i = 0; i < fastScalePoints.length; ++i) {
        let keyCell = document.createElement("div");
        keyCell.classList.add("targetmapcell");
        keyCell.classList.add("targetmapkeycell");
        keyCell.classList.add("targetmapfastkeycell");
        keyCell.innerText = fastScaleLegends[i];
        fgbg = solutionCountToFGBG(fastScalePoints[i], false);
        keyCell.style.color = fgbg[0];
        keyCell.style.backgroundColor = fgbg[1];
        targetMapKey.appendChild(keyCell);
    }

    /* If either edit box has focus when the user presses enter, take that
     * as a press of the Go button. */
    inputElement.addEventListener("keyup", enterListener);
    inputElement.addEventListener("input", inputEditListener);
    targetElement.addEventListener("keyup", enterListener);

    /* The target map button starts disabled, and we only enable it when a
     * solve for a specific target is visible. */
    disableMapButton();

    /* The "100" of the target map isn't a valid target, so make it invisible */
    let hundred = document.getElementById("targetmap100");
    hundred.style.visibility = "hidden";

    let helpSection = document.getElementById("helpsection");
    helpSection.addEventListener("click", function(e) {
        if (e.target.id === "helpsection") {
            closeHelp();
        }
    });

    let prefsSection = document.getElementById("prefssection");
    prefsSection.addEventListener("click", function(e) {
        if (e.target.id === "prefssection") {
            closePreferences();
        }
    });

    document.addEventListener("keyup", escapeListener);


    /* If we've been given a selection in the query string, because the user
     * has followed a link to a specific solve, start a solve of that selection
     * immediately. */
    let initialNumbersProblem = makeNumbersProblemFromQueryString(document.location.search);
    if (initialNumbersProblem != null) {
        startSolve(initialNumbersProblem);
    }
}

function processInput() {
    let inputElement = document.getElementById("solverinput");
    let targetElement = document.getElementById("targetinput");
    let numbersProblem = makeNumbersProblemFromInput(inputElement.value, targetElement.value);
    if (numbersProblem != null) {
        startSolve(numbersProblem);
    }
}

function nearbyTargetClick(away) {
    if (currentProblem) {
        let newProblem = new NumbersProblem(currentProblem.getSelection(),
                currentProblem.getTarget() + away);
        newProblem.setStrategy(currentProblem.getStrategy());
        newProblem.setMinNumbersUsed(currentProblem.getMinNumbersUsed());
        newProblem.setMaxNumbersUsed(currentProblem.getMaxNumbersUsed());
        newProblem.setLockedNumbers(currentProblem.getLockedNumbers());
        startSolve(newProblem);
    }
}

function targetMapClick(target) {
    if (currentProblem) {
        let newProblem = new NumbersProblem(currentProblem.getSelection(), target);
        newProblem.setStrategy(currentProblem.getStrategy());
        newProblem.setMinNumbersUsed(currentProblem.getMinNumbersUsed());
        newProblem.setMaxNumbersUsed(currentProblem.getMaxNumbersUsed());
        newProblem.setLockedNumbers(currentProblem.getLockedNumbers());
        startSolve(newProblem);
    }
}
