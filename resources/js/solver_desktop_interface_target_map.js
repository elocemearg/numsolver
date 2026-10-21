/* First and last target of the big rectangular map. */
const defaultTargetMapStart = 100;
const defaultTargetMapEnd = 999;
const defaultTargetMapRowLength = 25;

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
    constructor(tableElement, targetMapContainer, solutionsOuterContainer,
            fullMapKey, fastMapKey, targetMapBackButton, targetMapResetButton,
            targetMapForwardButton, targetMapClickHandler,
            targetMapMouseOverHandler, targetMapMouseOutHandler,
            buildSolutionDivFunction) {
        this.targetMapStart = defaultTargetMapStart;
        this.targetMapEnd = defaultTargetMapEnd;
        this.targetMapRowLength = defaultTargetMapRowLength;
        this.targetMapTable = tableElement;
        this.targetMapContainer = targetMapContainer;
        this.solutionsOuterContainer = solutionsOuterContainer;
        this.targetMapBackButton = targetMapBackButton;
        this.targetMapResetButton = targetMapResetButton;
        this.targetMapForwardButton = targetMapForwardButton;
        this.targetMapClickHandler = targetMapClickHandler;
        this.targetMapMouseOverHandler = targetMapMouseOverHandler;
        this.targetMapMouseOutHandler = targetMapMouseOutHandler;
        this.buildSolutionDiv = buildSolutionDivFunction;
        this.fullMapKey = fullMapKey;
        this.fastMapKey = fastMapKey;
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

    pageHome() {
        this.targetMapStart = defaultTargetMapStart;
        this.targetMapEnd = defaultTargetMapEnd;
        this.targetMapBackButton.disabled = false;
        this.targetMapResetButton.disabled = true;
        this.recreate();
    }

    setStart(start) {
        /* map start must be 100 or a multiple of 1000 */
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

    /* Empty the target map table and refill it with target cells according to
     * the global variables targetMapStart and targetMapEnd. */
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
        this.targetMapContainer.style.display = null;
        this.solutionsOuterContainer.style.display = "none";

        if (problem == null) {
            this.showTargetMapKey(false, false);
        }
        else {
            this.showTargetMapKey(problem.isAllSolutions(), !problem.isAllSolutions());
        }
    }

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
