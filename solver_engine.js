
/* Useful constants for the actual solver */
const PLUS = 0;
const MINUS = 1;
const TIMES = 2;
const DIVIDE = 3;
const NUMBER = 4;
const operatorSymbols = [ "+", "-", "*", "/", "" ];
const operatorPrecedence = [ 10, 10, 20, 20, 30 ];

/* The maximum number of numbers allowed in the selection. If you increase
 * this, the worst-case time to find a solution (or determine no exact
 * solution exists) gets bigger by a surprisingly large amount. */
const SELECTION_MAX = 8;


class Expression {
    constructor(leftExp, rightExp, operator) {
        this.leftExp = leftExp;
        this.rightExp = rightExp;
        this.operator = operator;
        this.value = null;
        this.selectionMask = null;
        this.numbersUsed = null;
    }

    getSelectionMask() {
        if (this.selectionMask == null) {
            this.selectionMask = this.leftExp.getSelectionMask() | this.rightExp.getSelectionMask();
        }
        return this.selectionMask;
    }

    isCompatible(otherExp) {
        return (this.getSelectionMask() & otherExp.getSelectionMask()) == 0;
    }

    getValue() {
        if (this.value == null) {
            if (this.operator == PLUS) {
                this.value = this.leftExp.getValue() + this.rightExp.getValue();
            }
            else if (this.operator == MINUS) {
                this.value = this.leftExp.getValue() - this.rightExp.getValue();
            }
            else if (this.operator == TIMES) {
                this.value = this.leftExp.getValue() * this.rightExp.getValue();
            }
            else if (this.operator == DIVIDE) {
                this.value = Math.floor(this.leftExp.getValue() / this.rightExp.getValue());
            }
            else {
                return null;
            }
        }

        return this.value;
    }

    getOperator() {
        return this.operator;
    }

    getOperatorPrecedence() {
        return operatorPrecedence[this.getOperator()];
    }

    getNumbersUsed() {
        if (this.numbersUsed == null) {
            this.numbersUsed = this.leftExp.getNumbersUsed() + this.rightExp.getNumbersUsed();
        }
        return this.numbersUsed;
    }

    toString() {
        var leftStr = this.leftExp.toString();
        var rightStr = this.rightExp.toString();

        if (this.leftExp.getOperatorPrecedence() < this.getOperatorPrecedence()) {
            leftStr = "(" + leftStr + ")";
        }
        
        if (this.rightExp.getOperatorPrecedence() <= this.getOperatorPrecedence() &&
                (this.rightExp.getOperator() != this.getOperator() ||
                 this.operator == MINUS || this.operator == DIVIDE)) {
            rightStr = "(" + rightStr + ")";
        }

        return leftStr + " " + operatorSymbols[this.operator] + " " + rightStr;
    }
}

class SingleNumber extends Expression {
    constructor(value, selectionMask) {
        super(null, null, NUMBER);
        this.value = value;
        this.selectionMask = selectionMask;
    }

    getSelectionMask() {
        return this.selectionMask;
    }

    getValue() {
        return this.value;
    }

    getOperator() {
        return NUMBER;
    }

    getNumbersUsed() {
        return 1;
    }

    toString() {
        return this.value.toString();
    }
}

class SolverState {
    constructor(progressCallback, finishedCallback) {
        this.startTime = Date.now();
        this.selection = null;
        this.target = null;
        this.progressCallback = progressCallback;
        this.finishedCallback = finishedCallback;

        /* expressions: map of expression length to list of expressions of
         * that length. "length" is the number of numbers used. */
        this.expressions = {};

        /* Number of expressions we've added to the expressions map so far
         * in this solve. */
        this.numExpressions = 0;

        /* resultMap: map of total to list of bitmasks representing starting
         * numbers which can be used to make that total. For example, if
         * 55 maps to [10, 12] that means that we know 55 can be made from
         * the second and fourth starting number (9, binary 1010) and also
         * from the third and fourth starting number (12, binary 1100).
         */
        this.resultMap = {};

        /* The expression which gets us closest to the target so far. */
        this.nearestExp = null;

        /* The selection as a string. */
        this.selectionString = "";

        /* dutyCycleOnMs: number of milliseconds step() will run for. After
         * that it will remember its state, call progressCallback(), and call
         * setTimeout() to resume in dutyCycleOffMs. */
        this.dutyCycleOnMs = 450;

        /* dutyCycleOffMs: number of milliseconds to wait between calls to
         * step(). This enables the browser to do other things like update the
         * progress indicator. */
        this.dutyCycleOffMs = 50;

        /* startDelayMs: number of milliseconds to wait before calling
         * step() for the first time. This is to give the browser a chance to
         * update the interface to tell the user a solve is in progress (e.g.
         * disable buttons, set a label to "please wait", etc).
         */
        this.startDelayMs = 30;

        /* The length of expression step() is currently looking to generate. */
        this.soughtExpressionLength = 1;
    }

    start(selection, target) {
        this.selection = selection;
        this.target = target;
        
        if (this.selection.length < 2 || this.selection.length > SELECTION_MAX) {
            this.finishedCallback(null, target, "Selection must contain between 2 and " + SELECTION_MAX.toString() + " numbers.");
            this.reset();
            return;
        }

        if (isNaN(target)) {
            this.finishedCallback(null, target, "Target is not a number.");
            this.reset();
            return;
        }

        if (target <= 0) {
            this.finishedCallback(null, target, "Target must be a positive integer.");
            this.reset();
            return;
        }

        for (var i = 0; i < selection.length; ++i) {
            var exp = new SingleNumber(selection[i], 1 << i);
            this.addExpressionToList(exp);

            var resultMasks = this.resultMap[selection[i]];
            if (resultMasks == null) {
                resultMasks = []
                this.resultMap[selection[i]] = resultMasks;
            }
            resultMasks.push(exp.getSelectionMask());

            /* If the target is in the selection, just return the single
             * expression containing that number */
            if (exp.getValue() == target) {
                this.finishedCallback(exp, target, null);
                this.reset();
                return;
            }

            if (i > 0)
                this.selectionString += " ";
            this.selectionString += selection[i].toString();
        }

        /* The expression length we're generating currently. */
        this.soughtExpressionLength = 2;

        /* The length of the expressions we want to put on the left and right
         * of the operator, which must add up to soughtExpressionLength. */
        this.expLength1 = 1;
        this.expLength2 = 1;

        /* Where we are in the list of left expressions and the list of
         * right expressions. We'll combine every expression of length
         * expLength1 with every expression of length expLength2, where that
         * makes sense and doesn't unnecessarily duplicate work. */
        this.expIndex1 = 0;
        this.expIndex2 = 0;

        setTimeout(() => { this.step(); }, this.startDelayMs);
    }

    step() {
        var expressionsThisStep = 0;
        var stepStartTime = Date.now();

        /* Generate all the two-number expressions, then all the three-number
         * expressions, and so on, up to the selection.length-number
         * expressions. Note that these for-loops don't have initialisers -
         * that's because this is designed to be returned from mid-solve so we
         * can pick up from wherever we left off. */
        for (; this.soughtExpressionLength <= this.selection.length; this.soughtExpressionLength++) {
            /* If we're generating expressions of length N, we first want
             * expression pairs of length 1 and N-1, then 2 and N-2, and so on
             * until N-1 and 1. That will generate us all the valid expressions
             * of length N. */
            for (; this.expLength1 < this.soughtExpressionLength; this.expLength1++) {
                this.expLength2 = this.soughtExpressionLength - this.expLength1;
                //console.log("expLength1 " + this.expLength1.toString() + ", expLength2 " + this.expLength2.toString());

                var expressions1 = this.expressions[this.expLength1];
                var expressions2 = this.expressions[this.expLength2];

                for (; this.expIndex1 < expressions1.length; this.expIndex1++) {
                    for (; this.expIndex2 < expressions2.length; this.expIndex2++) {
                        var exp1 = expressions1[this.expIndex1];
                        var exp2 = expressions2[this.expIndex2];

                        if (exp1.isCompatible(exp2)) {
                            /* exp1 and exp2 are compatible - they don't use
                             * any of the same starting numbers. */
                            
                            var leftValue = exp1.getValue();
                            var rightValue = exp2.getValue();

                            /* Generate a new expression using these two
                             * expressions for each of the operations +-*/
                            for (var op = 0; op < 4; ++op) {
                                /* We don't ever need to take a larger value
                                 * away from a smaller one. */
                                if (op == MINUS && leftValue <= rightValue)
                                    continue;

                                /* Also we don't need to divide by 1, or divide
                                 * A by B if A isn't a multiple of B. */
                                if (op == DIVIDE && (rightValue < 2 || leftValue % rightValue != 0))
                                    continue;

                                /* Don't bother multiplying by 0 or 1 */
                                if (op == TIMES && (leftValue < 2 || rightValue < 2))
                                    continue;

                                var newExp;

                                /* Personal style: for addition and
                                 * multiplication, put the larger number on
                                 * the left. */
                                if ((op == PLUS || op == TIMES) && exp1.getValue() < exp2.getValue()) {
                                    newExp = new Expression(exp2, exp1, op);
                                }
                                else {
                                    newExp = new Expression(exp1, exp2, op);
                                }
                                var resultValue = newExp.getValue();
                                var selectionMask = newExp.getSelectionMask();

                                if (resultValue == this.target) {
                                    /* We've found an expression which equals
                                     * the target, so we've finished. */
                                    var timeMs = Date.now() - this.startTime;
                                    console.log(this.selectionString + " -> " +
                                            this.target.toString() + ": solved. " +
                                            this.numExpressions +  " expressions, " +
                                            timeMs.toString() + "ms.");

                                    if (this.finishedCallback != null) {
                                        this.finishedCallback(newExp, this.target, null);
                                    }
                                    this.reset();
                                    return;
                                }

                                /* Get the list of selection masks which we
                                 * already know we can use to make resultValue.
                                 * If the expression newExp uses a superset of
                                 * one of those selection masks then we don't
                                 * need newExp.
                                 *
                                 * For example, there's no need to know we can
                                 * make 35 from 3*10+5 if we already know we
                                 * can make it from (10-3)*5. We don't need the
                                 * expression 4*2-2=6 if we already know
                                 * 4+2=6 (and we will already have the smaller
                                 * expression in our list, because we build the
                                 * smaller expressions first).
                                 */
                                var resultExistingMasks = this.resultMap[resultValue];
                                if (resultExistingMasks == null) {
                                    resultExistingMasks = [];
                                    this.resultMap[resultValue] = resultExistingMasks;
                                }

                                var addExp = true;

                                for (var k = 0; k < resultExistingMasks.length; ++k) {
                                    if ((selectionMask & resultExistingMasks[k]) == resultExistingMasks[k]) {
                                        /* We've already got an expression for
                                         * resultValue which uses a subset of
                                         * the numbers this expression uses */
                                        addExp = false;
                                        break;
                                    }
                                }

                                /* If after all that, this is a new and
                                 * interesting expression that gives us a
                                 * particular value in a way we couldn't get
                                 * before with the set of numbers the
                                 * expression uses, add it to the list, and
                                 * remember that this result can now be got by
                                 * this set of numbers. */
                                if (addExp) {
                                    resultExistingMasks.push(selectionMask);
                                    this.addExpressionToList(newExp);
                                    expressionsThisStep++;
                                }

                                /* If the value of this expression is closer to
                                 * the target than the closest we've found so
                                 * far, remember it. */
                                if (this.nearestExp == null ||
                                        Math.abs(this.nearestExp.getValue() - this.target) > Math.abs(resultValue - this.target)) {
                                    this.nearestExp = newExp;
                                }
                            }

                            var now = Date.now();
                            var stepElapsedMs = now - stepStartTime;
                            if (stepElapsedMs >= this.dutyCycleOnMs) {
                                /* We've done enough work for now... leave the
                                 * state as it is, go home, and come back
                                 * tomorrow*
                                 *
                                 * *in a few milliseconds
                                 */

                                if (this.progressCallback != null) {
                                    this.progressCallback(
                                            now - this.startTime,
                                            this.numExpressions,
                                            this.nearestExp == null ? -1 : this.nearestExp.getValue()
                                    );
                                }
                                setTimeout(() => { this.step(); }, this.dutyCycleOffMs);
                                console.log("Resting for " +
                                        this.dutyCycleOffMs.toString() +
                                        "ms after reaching " +
                                        this.numExpressions.toString() +
                                        " expressions and " +
                                        (now - this.startTime).toString() + "ms.");
                                return;
                            }
                        }
                    }
                    this.expIndex2 = 0;
                }
                this.expIndex1 = 0;
            }
            this.expLength1 = 1;
        }

        /* If we get here, we've searched the entire relevant expression space.
         * Return the expression that got closest to the target. */
        var timeMs = Date.now() - this.startTime;
        console.log(this.selectionString + " -> " + this.target.toString() +
                ": nearest possible is " + (this.nearestExp == null ? "unknown" : this.nearestExp.getValue().toString()) + ". "
                + this.numExpressions +  " expressions, " +
                timeMs.toString() + "ms.");
        if (this.finishedCallback != null) {
            this.finishedCallback(this.nearestExp, this.target, null);
        }
        this.reset();
    }


    reset() {
        this.expressions = null;
        this.resultMap = null;
        this.numExpressions = 0;
        this.nearestExp = null;
    }
    
    addExpressionToList(expression) {
        var l = this.expressions[expression.getNumbersUsed()];
        if (l == undefined) {
            l = [];
        }
        l.push(expression);
        this.expressions[expression.getNumbersUsed()] = l;
        this.numExpressions++;
    }
}

/* selection is an array of integers, and target is an integer.
 *
 * This runs the solve process in the background using setTimeout() calls.
 *
 * Every mumblemumble milliseconds, progressCallback() will be called with
 * the number of milliseconds elapsed so far, the number of expressions we
 * have, and the closest we've got so far to the target.
 *
 * When a solution is found, or if we determine there is no exact solution,
 * finishedCallback() will be called with the following arguments, in order:
 *     1. The Expression object for the solution (or nearest possible). If
 *        there was an error, this is null.
 *     2. The target, as a number.
 *     3. An error message (a string). If the expression parameter is null,
 *        this will explain why. If there was no error, this is null.
 *
 * We make no attempt to find "all" the solutions to a numbers puzzle. Once we
 * find one expression which equals the target, we return it. This will use the
 * fewest number of numbers possible, because we start by building up all the
 * 2-number expressions, then the 3-number expressions, and so on.
 */

function solverRun(selection, target, progressCallback, finishedCallback) {
    var solverState = new SolverState(progressCallback, finishedCallback);
    solverState.start(selection, target);
}
