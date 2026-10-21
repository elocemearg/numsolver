/* First and last target of the big rectangular map. */
const defaultTargetMapStart = 100;
const defaultTargetMapEnd = 999;
const defaultTargetMapRowLength = 25;

/* Return a string to put in the mouseover text when the user hovers over a
 * target in the target map. */
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

class TargetMap {
    /* Constructor arguments
     *
     * tableElement: the <table> element containing the target map's cells.
     * targetMapContainer: the element containing the <table> and the headline
     *     along the top.
     * solutionsOuterContainer: the element containing the solutions to the
     *     currently-selected target. We don't want this visible at the same
     *     time as the target map is visible, so we need a reference to this
     *     element in order to undisplay it when the target map is showing.
     * fullMapKey: the colour-to-solution-count key displayed below the
     *     table when the solver finds all solutions.
     * fastMapKey: the solved/not-solved key displayed below the table when
     *     the solver finds only one solution per target. We need this and
     *     fullMapKey so we can make the appropriate key visible.
     * targetMapBackButton, targetMapResetButton, targetMapForwardButton:
     *     the <button> elements for switching the target map to the previous
     *     or next page, or resetting it to the default page. TargetMap does
     *     not set up listeners for these buttons, that's the caller's problem.
     *     We only need references to them so that we can disable them when
     *     appropriate on a pagePrev(), pageNext() or pageHome() call.
     * targetMapClickHandler: handler to attach to each target cell's onclick
     *     event.
     * targetMapMouseOverHandler: handler to attach to each target cell's
     *     onmouseover event.
     * targetMapMouseOutHandler: handler to attach to each target cell's
     *     onmouseout event.
     * buildSolutionDivFunction: function taking the parameters (solution,
     *     target, showEquals, notation) which returns a <div> element
     *     showing a solution in the form of a mathematical expression.
     *     Parameters:
     *       solution: an Expression object representing the solution.
     *       target: the integer target.
     *       showEquals (optional, default false): boolean specifying whether
     *         to add "= <answer>" to the formatted expression.
     *       notation (optional, default null): one of the NOTATION_ constants
     *         in solver_engine.js. If null, the default configured notation.
     */
    constructor(tableElement, targetMapContainer, solutionsOuterContainer,
            fullMapKey, fastMapKey, targetMapBackButton, targetMapResetButton,
            targetMapForwardButton, targetMapClickHandler,
            targetMapMouseOverHandler, targetMapMouseOutHandler,
            buildSolutionDivFunction) {
        /* targetMapStart, targetMapEnd: current bounds of the target map */
        this.targetMapStart = defaultTargetMapStart;
        this.targetMapEnd = defaultTargetMapEnd;

        /* Number of target cells per row */
        this.targetMapRowLength = defaultTargetMapRowLength;

        /* Important HTML elements related to the target map */
        this.targetMapTable = tableElement;
        this.targetMapContainer = targetMapContainer;
        this.solutionsOuterContainer = solutionsOuterContainer;
        this.fullMapKey = fullMapKey;
        this.fastMapKey = fastMapKey;

        /* Buttons */
        this.targetMapBackButton = targetMapBackButton;
        this.targetMapResetButton = targetMapResetButton;
        this.targetMapForwardButton = targetMapForwardButton;

        /* Handlers */
        this.targetMapClickHandler = targetMapClickHandler;
        this.targetMapMouseOverHandler = targetMapMouseOverHandler;
        this.targetMapMouseOutHandler = targetMapMouseOutHandler;

        /* Function to build a solution element to put on the headline when
         * the user hovers their mouse over a target cell */
        this.buildSolutionDiv = buildSolutionDivFunction;

        this.targetMapHeadline = targetMapContainer.getElementsByClassName("headline")[0];
        if (this.targetMapHeadline) {
            this.headlineDivText = this.targetMapHeadline.getElementsByClassName("targetmapheadlinetext")[0];
            this.headlineDivSolution = this.targetMapHeadline.getElementsByClassName("targetmapheadlinesolution")[0];
            this.headlineDivLink = this.targetMapHeadline.getElementsByClassName("targetmapheadlinelink")[0];
        }
        else {
            this.headlineDivText = null;
            this.headlineDivSolution = null;
            this.headlineDivLink = null;
        }

        /* Cells currently showing: key=target, value=<td> element */
        this.cells = {};
    }

    /* Previous target map page. */
    pagePrev() {
        if (this.targetMapStart == 0) {
            /* Can't go back from the first page */
            return;
        }
        if (this.targetMapStart <= 100) {
            /* 100-999 -> 0-99 */
            this.targetMapStart = 0;
            this.targetMapEnd = 99;
        }
        else if (this.targetMapStart <= 1000) {
            /* 1000-1999 -> 100-999 */
            this.targetMapStart = 100;
            this.targetMapEnd = 999;
        }
        else if (this.targetMapStart % 1000 != 0) {
            /* Shouldn't happen, but make targetMapStart a multiple of 1000 */
            this.targetMapStart -= this.targetMapStart % 1000;
            this.targetMapEnd = this.targetMapStart + 999;
        }
        else {
            /* If we're on any other page, subtract 1000 from start and end */
            this.targetMapStart -= 1000;
            this.targetMapEnd -= 1000;
        }
        this.targetMapBackButton.disabled = (this.targetMapStart == 0);
        this.targetMapResetButton.disabled = (this.targetMapStart == defaultTargetMapStart);
        this.recreate();
    }

    /* Next target map page. Valid values for targetMapStart are 0, 100, 1000,
     * then every multiple of 1000 after that. */
    pageNext() {
        if (this.targetMapStart < 100) {
            /* 0-99 -> 100-999 */
            this.targetMapStart = 100;
            this.targetMapEnd = 999;
        }
        else if (this.targetMapStart < 1000) {
            /* 100-999 -> 1000-1999 */
            this.targetMapStart = 1000;
            this.targetMapEnd = 1999;
        }
        else {
            /* Anything else, just add 1000 to start and end, making sure
             * targetMapStart is always a multiple of 1000. */
            if (this.targetMapStart % 1000 != 0) {
                this.targetMapStart -= this.targetMapStart % 1000;
            }
            this.targetMapStart += 1000;
            this.targetMapEnd += 1000;
        }
        this.targetMapBackButton.disabled = false;
        this.targetMapResetButton.disabled = (this.targetMapStart == defaultTargetMapStart);
        this.recreate();
    }

    /* Return to the default target map page, 100-999. */
    pageHome() {
        this.targetMapStart = defaultTargetMapStart;
        this.targetMapEnd = defaultTargetMapEnd;
        this.targetMapBackButton.disabled = false;
        this.targetMapResetButton.disabled = true;
        this.recreate();
    }

    /* Set which page the target map should show, by specifying the first
     * target in the map. This must be 100 or a multiple of 1000. If it isn't,
     * it will be rounded down to the nearest multiple of 1000. If it's
     * negative it will be taken as 0. */
    setStart(start) {
        if (start < 0) {
            start = 0;
        }
        if (start != 100 && start % 1000 != 0) {
            start -= start % 1000;
        }
        this.targetMapStart = start;
        /* Set target map end according to target map start */
        if (this.targetMapStart == 0) {
            this.targetMapEnd = 99;
        }
        else if (this.targetMapStart == 100) {
            this.targetMapEnd = 999;
        }
        else {
            this.targetMapEnd = this.targetMapStart + 999;
        }
    }

    /* Empty the target map table and refill it with target cells according
     * to the currently selected target map page. This populates the cells
     * with their target numbers but does not colour them in yet. */
    recreate() {
        /* Remove anything already in the target map table */
        discardContents(this.targetMapTable);
        let mappedTarget = this.targetMapStart;
        this.cells = {};
        /* Fill in the target map table with the target cells that need to be in it */
        for (let rowStart = this.targetMapStart; rowStart <= this.targetMapEnd; rowStart += this.targetMapRowLength) {
            let row = document.createElement("tr");
            row.className = "targetmaprow";
            for (let mappedTarget = rowStart;
                    mappedTarget < rowStart + this.targetMapRowLength &&
                        mappedTarget <= this.targetMapEnd;
                    ++mappedTarget) {
                let cell = document.createElement("td");
                cell.className = "targetmapcell";
                cell.id = "targetmap" + mappedTarget.toString();
                cell.innerText = mappedTarget.toString();
                cell.setAttribute("data-target", mappedTarget.toString());
                if (mappedTarget == 0) {
                    cell.style.visibility = "hidden";
                }
                else {
                    cell.addEventListener("click", this.targetMapClickHandler);
                    cell.addEventListener("mouseover", this.targetMapMouseOverHandler);
                    cell.addEventListener("mouseout", this.targetMapMouseOutHandler);
                }
                this.cells[mappedTarget] = cell;
                row.appendChild(cell);
            }
            this.targetMapTable.appendChild(row);
        }
    }

    /* Update the target map cells and colour-code them according to how many
     * solutions there are for that target.
     * problem is a NumbersProblem object (solver_desktop_interface.js).
     * totalToExpressions is a map from targets to lists of Expressions. */
    updateAndDisplayTargetMap(problem, totalToExpressions) {
        let possibleTargets = 0;
        for (let target = this.targetMapStart; target <= this.targetMapEnd; ++target) {
            let solutionCount;
            let cell = this.cells[target];
            if (cell == null)
                continue;

            if (totalToExpressions != null && target in totalToExpressions && totalToExpressions[target].length > 0) {
                solutionCount = totalToExpressions[target].length;
                possibleTargets++;
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
            const numTargets = this.targetMapEnd - this.targetMapStart + (this.targetMapStart <= 0 && this.targetMapEnd >= 0 ? 0 : 1);
            this.defaultTargetMapHeadline = `${possibleTargets} of the ${numTargets} targets from ${this.targetMapStart == 0 ? 1 : this.targetMapStart} to ${this.targetMapEnd} are possible with this selection.`;
        }
        this.setHeadline(null, null, null, totalToExpressions != null);
        this.show();

        if (problem == null) {
            this.showTargetMapKey(false, false);
        }
        else {
            this.showTargetMapKey(problem.isAllSolutions(), !problem.isAllSolutions());
        }
    }

    /* If we are showing the default target map page, return the empty
     * string. Otherwise return "&mapstart=X", where X is the current
     * targetMapStart, suitable for including as part of the URL query string.
     */
    getQueryStringFragment() {
        if (this.targetMapStart != defaultTargetMapStart) {
            return "&mapstart=" + this.targetMapStart.toString();
        }
        else {
            return "";
        }
    }

    hide() {
        this.targetMapContainer.style.display = "none";
        this.solutionsOuterContainer.style.display = null;
    }

    show() {
        this.targetMapContainer.style.display = null;
        this.solutionsOuterContainer.style.display = "none";
    }

    setHeadline(hoveredTarget, currentProblem, currentResults, displayResults) {
        if (hoveredTarget == null) {
            /* Cursor isn't hovering over a target, so display the default
             * headline rather than a solution for that target. */
            if (displayResults && this.defaultTargetMapHeadline != null) {
                this.headlineDivText.innerText = this.defaultTargetMapHeadline;
                this.headlineDivSolution.style.display = "none";
                this.headlineDivLink.style.display = "inline-block";
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
                this.headlineDivText.innerHTML = html;

                let solDiv = this.buildSolutionDiv(sols[0], hoveredTarget, false, NOTATION_ALGEBRAIC);
                solDiv.classList.add("inheadlinesolution");
                discardContents(this.headlineDivSolution);
                this.headlineDivSolution.appendChild(solDiv);
            }
            else {
                this.headlineDivText.innerText = hoveredTarget.toString() + " is not possible with this selection.";
                discardContents(this.headlineDivSolution);
            }

            this.headlineDivSolution.style.display = "inline-block";
            this.headlineDivLink.style.display = "none";
        }
    }

    setDefaultHeadline(headline) {
        this.defaultTargetMapHeadline = headline;
    }

    showTargetMapKey(showFullKey, showFastKey) {
        this.fullMapKey.style.display = (showFullKey ? "block" : "none");
        this.fastMapKey.style.display = (showFastKey ? "block" : "none");
    }
}
