
/* Useful constants for the actual solver */
const PLUS = 0;
const MINUS = 1;
const TIMES = 2;
const DIVIDE = 3;
const NUMBER = 4;

const PLUS_MINUS = 10;
const TIMES_DIVIDE = 11;

const operatorSymbols = [ "+", "-", "*", "/", "" ];
const operatorPrecedence = [ 10, 10, 20, 20, 30 ];
const operatorTypes = [ PLUS_MINUS, PLUS_MINUS, TIMES_DIVIDE, TIMES_DIVIDE, NUMBER ];

/* The maximum number of numbers allowed in the selection. If you increase
 * this, the worst-case time to find a solution (or determine no exact
 * solution exists) gets bigger by a surprisingly large amount. */
const SELECTION_MAX_FAST = 8;
const SELECTION_MAX_FULL = 7;

/* SolverResults object, passed to the user's finishedCallback function. */
class SolverResults {
    constructor(selection, target, expressions, errorMessage) {
        this.selection = selection.slice();
        this.target = target;
        this.expressions = expressions;
        this.errorMessage = errorMessage;
    }

    isSuccessful() {
        return this.expressions != null && this.expressions.length > 0;
    }

    getSelection() {
        return this.selection;
    }

    getTarget() {
        return this.target;
    }

    getSolutions() {
        return this.expressions;
    }

    getSolution() {
        if (this.expressions == null || this.expressions.length == 0) {
            return null;
        }
        else {
            return this.expressions[0];
        }
    }

    getNumSolutions() {
        if (this.expressions == null)
            return 0;
        else
            return this.expressions.length;
    }

    getErrorMessage() {
        return this.errorMessage;
    }
}

/* SolverProgress object, passed to the user's progressCallback function if it
 * was defined. */
class SolverProgress {
    constructor(selection, target, msElapsed, numExpressions, bestTotalSoFar, numBestSolutions) {
        this.selection = selection.slice();
        this.target = target;
        this.msElapsed = msElapsed;
        this.numExpressions = numExpressions;
        this.bestTotalSoFar = bestTotalSoFar;
        this.numBestSolutions = numBestSolutions;
    }

    getSelection() {
        return this.selection;
    }

    getTarget() {
        return this.target;
    }

    getElapsedMs() {
        return this.msElapsed;
    }

    getNumExpressionsBuilt() {
        return this.numExpressions;
    }

    getBestTotalSoFar() {
        return this.bestTotalSoFar;
    }

    getNumBestSolutionsSoFar() {
        return this.numBestSolutions;
    }
}

class Expression {
}

/* In fast solve mode, expressions are either BinaryTreeExpressions or
 * SingleNumbers. */
class BinaryTreeExpression extends Expression {
    constructor(leftExp, rightExp, operator) {
        super();
        this.leftExp = leftExp;
        this.rightExp = rightExp;
        this.operator = operator;
        this.value = null;
        this.selectionMask = null;
        this.countNumbersUsed = null;
    }

    getSelectionMask() {
        if (this.selectionMask == null) {
            this.selectionMask = this.leftExp.getSelectionMask() | this.rightExp.getSelectionMask();
        }
        return this.selectionMask;
    }

    isCompatible(otherExp, ignored) {
        return (this.selectionMask & otherExp.getSelectionMask()) == 0;
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

    getCountNumbersUsed() {
        if (this.countNumbersUsed == null) {
            this.countNumbersUsed = this.leftExp.getCountNumbersUsed() + this.rightExp.getCountNumbersUsed();
        }
        return this.countNumbersUsed;
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

    isAtom() {
        return false;
    }
}

class SingleNumber extends Expression {
    constructor(value, selectionMask) {
        super();
        this.value = value;
        this.selectionMask = selectionMask;
        this.numbersUsed = [];
        this.numbersUsed[value] = 1;
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

    getOperatorType() {
        return NUMBER;
    }

    getOperatorPrecedence() {
        return operatorPrecedence[NUMBER];
    }

    getCountNumbersUsed() {
        return 1;
    }

    getNumbersUsed() {
        return this.numbersUsed;
    }

    toString() {
        return this.value.toString();
    }

    isAtom() {
        return true;
    }

    getLeftExpressionList() {
        return [ this ];
    }

    getRightExpressionList() {
        return [];
    }

    isCompatible(otherExp, selectionCounts) {
        if (otherExp.isAtom()) {
            return (otherExp.selectionMask & this.selectionMask) == 0;
        }
        else {
            return otherExp.isCompatible(this, selectionCounts);
        }
    }

    compareTo(otherExp) {
        if (!otherExp.isAtom()) {
            return -otherExp.compareTo(this);
        }
        else {
            return otherExp.getValue() - this.value;
        }
    }
}

function isPositiveOperator(op) {
    return op == PLUS || op == TIMES;
}

function mergeExpressionLists(list1, list2) {
    var pos1, pos2;
    var output = [];

    pos1 = 0;
    pos2 = 0;
    
    while (pos1 < list1.length && pos2 < list2.length) {
        if (list1[pos1].compareTo(list2[pos2]) <= 0) {
            output.push(list1[pos1++]);
        }
        else {
            output.push(list2[pos2++]);
        }
    }
    if (pos1 < list1.length) {
        output = output.concat(list1.slice(pos1));
    }
    if (pos2 < list2.length) {
        output = output.concat(list2.slice(pos2));
    }
    return output;
}

/* In find-all-solutions mode, all expressions are either OrderedExpressions
 * or SingleNumbers. */
class OrderedExpression extends Expression {
    constructor(leftExp, rightExp, operator) {
        super();
        this.numbersUsed = [];
        var leftNumsUsed = leftExp.getNumbersUsed();
        var rightNumsUsed = rightExp.getNumbersUsed();
        for (var n in leftNumsUsed) {
            this.numbersUsed[n] = leftNumsUsed[n];
        }
        for (var n in rightNumsUsed) {
            if (n in this.numbersUsed) {
                this.numbersUsed[n] = this.numbersUsed[n] + rightNumsUsed[n];
            }
            else {
                this.numbersUsed[n] = rightNumsUsed[n];
            }
        }

        /* To make elimination of duplicate solutions easier, an
         * OrderedExpression isn't necessarily a binary tree. It's a node with
         * a list of left children and a list of right children. The
         * expression's value is either the sum of the left children minus the
         * sum of the right children, or the product of the left children
         * divided by the product of the right children. */
        this.countNumbersUsed = leftExp.getCountNumbersUsed() + rightExp.getCountNumbersUsed();

        /* If the left expression is the same operator type as us (e.g. both
         * additive or both multiplicative) then we take the left expression's
         * left and right (plus and minus, or times and divide) expression
         * lists, and add them to our (currently empty) left and right
         * expression lists.
         *
         * If the left expression isn't the same operator type as us (e.g.
         * operator is PLUS and the left expression is a times-or-divide
         * node) then we have to treat that left expression on its own - we
         * add it to our left list and leave the right list empty for now.
         * For example, if we have the left expression (2*3) and the right
         * expression (4) and we want to add them together, our left
         * expression list becomes [ (2*3) ]. */
        if (leftExp.getOperatorType() == operatorTypes[operator]) {
            this.leftExpressions = leftExp.getLeftExpressionList();
            this.rightExpressions = leftExp.getRightExpressionList();
        }
        else {
            this.leftExpressions = [leftExp];
            this.rightExpressions = [];
        }

        /* Right expression is similar, but we must bear in mind that if we're
         * a negative operator (minus or divide) then the right expression's
         * left expression list gets added to our right and its right
         * expression list gets added to our left.
         * If the operator type of the right expression doesn't match ours,
         * then we must treat it as an indivisible expression.
         *
         * For example, if the left expression is 2*3 and the right expression
         * is 8/4, and we have to subtract, our left expression list will be
         * [ 2*3 ] and our right expression will be [ 8/4 ]. If we have to
         * multiply those two expressions rather than subtract, our left list
         * will be [ 2, 3, 8 ] and our right list will be [4]. If we have to
         * divide, our left list will be [ 2, 3, 4 ] and our right list will be
         * [8]. */
        var posList, negList;
        if (rightExp.getOperatorType() == operatorTypes[operator]) {
            posList = rightExp.getLeftExpressionList();
            negList = rightExp.getRightExpressionList();
        }
        else {
            posList = [ rightExp ];
            negList = [];
        }

        if (isPositiveOperator(operator)) {
            this.leftExpressions = mergeExpressionLists(this.leftExpressions, posList);
            this.rightExpressions = mergeExpressionLists(this.rightExpressions, negList);
        }
        else {
            this.leftExpressions = mergeExpressionLists(this.leftExpressions, negList);
            this.rightExpressions = mergeExpressionLists(this.rightExpressions, posList);
        }
        
        this.operatorType = operatorTypes[operator];
        this.value = null;
        this.stringValue = null;
    }

    isAtom() {
        return false;
    }

    getLeftExpressionList() {
        return this.leftExpressions.slice();
    }

    getRightExpressionList() {
        return this.rightExpressions.slice();
    }

    getValue() {
        if (this.value == null) {
            var leftTotal = 0;
            var rightTotal = 0;

            if (this.operatorType == TIMES_DIVIDE) {
                leftTotal = 1;
                rightTotal = 1;
                for (var i = 0; i < this.leftExpressions.length; ++i) {
                    leftTotal *= this.leftExpressions[i].getValue();
                }
                for (var i = 0; i < this.rightExpressions.length; ++i) {
                    rightTotal *= this.rightExpressions[i].getValue();
                }
                this.value = leftTotal / rightTotal;
            }
            else {
                for (var i = 0; i < this.leftExpressions.length; ++i) {
                    leftTotal += this.leftExpressions[i].getValue();
                }
                for (var i = 0; i < this.rightExpressions.length; ++i) {
                    rightTotal += this.rightExpressions[i].getValue();
                }
                this.value = leftTotal - rightTotal;
            }
        }
        return this.value;
    }

    getNumbersUsed() {
        return this.numbersUsed;
    }

    getCountNumbersUsed() {
        return this.countNumbersUsed;
    }

    getOperatorType() {
        return this.operatorType;
    }

    joinExps(expList, opStr, bracketSubExps) {
        var expStr = "";
        for (var i = 0; i < expList.length; ++i) {
            if (i > 0) {
                expStr += " " + opStr + " ";
            }
            if (bracketSubExps && !expList[i].isAtom())
                expStr += "(";
            expStr += expList[i].toString();
            if (bracketSubExps && !expList[i].isAtom())
                expStr += ")";
        }
        return expStr;
    }

    toString() {
        if (this.stringValue == null) {
            var opStr = this.operatorType == TIMES_DIVIDE ? "*" : "+";
            var bracketSubExps = (this.operatorType == TIMES_DIVIDE);
            var expStr = this.joinExps(this.leftExpressions, opStr, bracketSubExps);

            if (this.rightExpressions.length > 0) {
                if (this.operatorType == TIMES_DIVIDE) {
                    var brackets;
                    if (this.rightExpressions.length > 1)
                        brackets = [ "(", ")" ];
                    else
                        brackets = [ "", "" ];
                    expStr += " / " + brackets[0] + this.joinExps(this.rightExpressions, "*", true) + brackets[1];
                }
                else {
                    expStr += " - " + this.joinExps(this.rightExpressions, "-", false);
                }
            }
            this.stringValue = expStr;
        }

        return this.stringValue;
    }

    isCompatible(otherExp, selectionCounts) {
        var otherCounts = otherExp.getNumbersUsed();
        var totalCounts = [];
        
        for (var n in this.numbersUsed) {
            if (n in totalCounts)
                totalCounts[n] += this.numbersUsed[n];
            else
                totalCounts[n] = this.numbersUsed[n];
        }
        
        for (var n in otherCounts) {
            if (n in totalCounts)
                totalCounts[n] += otherCounts[n];
            else
                totalCounts[n] = otherCounts[n];
        }

        for (var n in totalCounts) {
            if (totalCounts[n] > 0 && (!(n in selectionCounts) || selectionCounts[n] < totalCounts[n])) {
                return false;
            }
        }

        return true;
    }

    /* Decide whether this expression should go before or after otherExp in
     * a multi-term sum or product. This means we don't have equivalent but
     * trivially-different expressions lying around, like "6 * 4 + 5" and
     * "5 + 6 * 4". */
    compareTo(otherExp) {
        /* If one expression has a larger value than the other, put the
         * larger-valued one first. */
        var diff = this.getValue() - otherExp.getValue();
        if (diff != 0)
            return -diff;

        /* Put multiplications and divisions first, then additions or
         * subtractions, then bare numbers.
         * e.g. "7 * 6 + 42", not "42 + 7 * 6"
         */
        diff = this.getOperatorType() - otherExp.getOperatorType();
        /* * or / comes first, then + or -, then bare numbers */
        if (diff != 0)
            return -diff;

        if (this.isAtom()) {
            /* If this is a bare number then otherExp is also the same bare
             * number if we got this far. */
            return 0;
        }

        /* The expression with more numbers in it goes first */
        diff = this.getCountNumbersUsed() - otherExp.getCountNumbersUsed();
        if (diff != 0)
            return -diff;

        /* Otherwise, compare the sub-expressions */
        var thisLeft = this.getLeftExpressionList();
        var thisRight = this.getRightExpressionList();
        var otherLeft = otherExp.getLeftExpressionList();
        var otherRight = otherExp.getRightExpressionList();

        for (var i = 0; i < thisLeft.length && i < otherLeft.length; ++i) {
            diff = thisLeft[i].compareTo(otherLeft[i]);
            if (diff != 0)
                return diff;
        }
        
        /* Expression with the longer left-expression goes first */
        if (thisLeft.length != otherLeft.length)
            return otherLeft.length - thisLeft.length;

        /* ... and in the event of a tie, compare the right sub-expressions
         * in the same way. */
        for (var i = 0; i < thisRight.length && i < otherRight.length; ++i) {
            diff = thisRight[i].compareTo(otherRight[i]);
            if (diff != 0)
                return diff;
        }
        if (thisRight.length != otherRight.length)
            return otherRight.length - thisRight.length;

        /* okay, we'll call it a draw */
        return 0;
    }    
}


/* SolverState: keeps track of where we are in a solve so that we can stop,
 * do something else, then dive back into it. */
class SolverState {
    constructor(progressCallback, finishedCallback, fastSolve) {
        this.startTime = Date.now();
        this.selection = null;
        this.target = null;

        /* We call this after we've completed a step() to give the caller an
         * idea of how things are going. It takes a single argument, which is
         * a SolverProgress object. */
        this.progressCallback = progressCallback;

        /* We call this when we've finished. It takes a single argument, which
         * is a SolverResults object. */
        this.finishedCallback = finishedCallback;

        /* expressions: map of expression length to list of expressions of
         * that length. "length" is the number of numbers used. */
        this.expressions = [];

        /* Number of expressions we've added to the expressions map so far
         * in this solve. */
        this.numExpressions = 0;

        /* resultMap: map of total to list of bitmasks representing starting
         * numbers which can be used to make that total. For example, if
         * 55 maps to [10, 12] that means that we know 55 can be made from
         * the second and fourth starting number (9, binary 1010) and also
         * from the third and fourth starting number (12, binary 1100).
         *
         * If fastSolve is false, this is instead a map of result
         * values to sets of expression strings.
         */
        this.resultMap = [];

        /* The expression which gets us closest to the target so far. */
        this.nearestExp = null;

        /* All the "nearest" expressions we've found so far. */
        this.nearestExpList = [];

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

        /* How many we have of each number. */
        this.selectionCounts = [];

        /* If fastSolve is true, we eliminate redundant expressions
         * aggressively and return the first optimal solution we find.
         * If fastSolve is false, we only eliminate equivalent expressions and
         * we return all the optimal solutions. */
        this.fastSolve = fastSolve;

        this.selectionMax = (fastSolve ? SELECTION_MAX_FAST : SELECTION_MAX_FULL);
    }

    start(selection, target) {
        this.selection = selection;
        this.target = target;
        
        if (this.selection.length < 2) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null,
                        "Selection must contain at least 2 numbers."
                    )
            );
            this.reset();
            return;
        }
        else if (this.selection.length > this.selectionMax) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null,
                        "Selection may not contain more than " + this.selectionMax.toString() + " numbers" + (this.fastSolve ? "." : " in all-solutions mode.")
                    )
            );
            this.reset();
            return;
        }

        if (isNaN(target)) {
            this.finishedCallback(
                    new SolverResults(selection, target, null,
                        "Target is not a number."
                    )
            );
            this.reset();
            return;
        }

        if (target <= 0) {
            this.finishedCallback(
                    new SolverResults(selection, target, null,
                        "Target must be a positive integer."
                    )
            );
            this.reset();
            return;
        }

        for (var i = 0; i < selection.length; ++i) {
            var exp = new SingleNumber(selection[i], 1 << i);
            this.addExpressionToList(exp);

            if (this.fastSolve) {
                var resultMasks = this.resultMap[selection[i]];
                if (resultMasks == null) {
                    resultMasks = [];
                    this.resultMap[selection[i]] = resultMasks;
                }
                resultMasks.push(exp.getSelectionMask());
            }
            else {
                var resultStrings = this.resultMap[selection[i]];
                if (resultStrings == null) {
                    resultStrings = {};
                    this.resultMap[selection[i]] = resultStrings;
                }
                resultStrings[exp.toString()] = true;
            }

            if (exp.getValue() == target) {
                if (this.fastSolve) {
                    /* If the target is in the selection, just return the single
                     * expression containing that number */
                    this.finishedCallback(
                            new SolverResults(selection, target, [exp], null)
                    );
                    this.reset();
                    return;
                }
                else {
                    /* Add this expression to our list of nearest expressions */
                    this.nearestExp = exp;
                    this.nearestExpList = [exp];
                }
            }

            if (i > 0)
                this.selectionString += " ";
            this.selectionString += selection[i].toString();

            var currentCount;
            if (selection[i] in this.selectionCounts)
                currentCount = this.selectionCounts[selection[i]];
            else
                currentCount = 0;
            this.selectionCounts[selection[i]] = currentCount + 1;
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

                if (!(this.expLength1 in this.expressions))
                    this.expressions[this.expLength1] = [];
                if (!(this.expLength2 in this.expressions))
                    this.expressions[this.expLength2] = [];

                var expressions1 = this.expressions[this.expLength1];
                var expressions2 = this.expressions[this.expLength2];

                for (; this.expIndex1 < expressions1.length; this.expIndex1++) {
                    for (; this.expIndex2 < expressions2.length; this.expIndex2++) {
                        var exp1 = expressions1[this.expIndex1];
                        var exp2 = expressions2[this.expIndex2];

                        if (exp1.isCompatible(exp2, this.selectionCounts)) {
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

                                /* We don't ever need to subtract x from 2x,
                                 * because the answer will be x, which we
                                 * already have. For example, 10 - 5 is always
                                 * useless. */
                                if (op == MINUS && leftValue == rightValue * 2)
                                    continue;

                                /* We don't ever need to divide a number by its
                                 * square root, because the square root will
                                 * be the answer, which we already have. e.g.
                                 * we never need to do 9 / 3 or 25 / 5. */
                                if (op == DIVIDE && leftValue == rightValue * rightValue)
                                    continue;

                                var newExp;

                                if (this.fastSolve) {
                                    /* Personal style: for addition and
                                     * multiplication, put the larger number on
                                     * the left. */
                                    if ((op == PLUS || op == TIMES) && exp1.getValue() < exp2.getValue()) {
                                        newExp = new BinaryTreeExpression(exp2, exp1, op);
                                    }
                                    else {
                                        newExp = new BinaryTreeExpression(exp1, exp2, op);
                                    }
                                }
                                else {
                                    newExp = new OrderedExpression(exp1, exp2, op);
                                }
                                var resultValue = newExp.getValue();

                                if (resultValue == this.target) {
                                    /* We've found an expression which equals
                                     * the target. If fastSolve is set then
                                     * we've finished and don't need to do
                                     * anything more. */
                                    var timeMs = Date.now() - this.startTime;
                                    console.log(this.selectionString + " -> " +
                                            this.target.toString() + ": solved. " +
                                            this.numExpressions +  " expressions, " +
                                            timeMs.toString() + "ms. " +
                                            newExp.toString());

                                    if (this.fastSolve) {
                                        if (this.finishedCallback != null) {
                                            this.finishedCallback(
                                                    new SolverResults(
                                                        this.selection,
                                                        this.target,
                                                        [newExp], null
                                                    )
                                            );
                                        }
                                        this.reset();
                                        return;
                                    }
                                }

                                var addExp = true;

                                /* If this is an N-number expression, where N
                                 * is the number of numbers in the selection,
                                 * then if this expression's value is further
                                 * away than the best solution we have so far
                                 * then we don't need it - we're never going
                                 * to need to combine it with another
                                 * expression because expressions can't be
                                 * longer than this. */
                                if (this.soughtExpressionLength == this.selection.length && this.nearestExp != null) {
                                    if (Math.abs(resultValue - this.target) > Math.abs(this.nearestExp.getValue() - this.target)) {
                                        addExp = false;
                                    }
                                }

                                if (addExp && this.fastSolve) {
                                    var selectionMask = newExp.getSelectionMask();
                                    /* Get the list of selection masks which we
                                     * already know we can use to make
                                     * resultValue. If the expression newExp
                                     * uses a superset of one of those
                                     * selection masks then we don't need
                                     * newExp.
                                     *
                                     * For example, there's no need to know we
                                     * can make 35 from 3*10+5 if we already
                                     * know we can make it from (10-3)*5. We
                                     * don't need the expression 4*2-2=6 if we
                                     * already know 4+2=6 (and we will already
                                     * have the smaller expression in our list,
                                     * because we build the smaller expressions
                                     * first).
                                     */
                                    var resultExistingMasks = this.resultMap[resultValue];
                                    if (resultExistingMasks == null) {
                                        resultExistingMasks = [];
                                        this.resultMap[resultValue] = resultExistingMasks;
                                    }


                                    for (var k = 0; k < resultExistingMasks.length; ++k) {
                                        if ((selectionMask & resultExistingMasks[k]) == resultExistingMasks[k]) {
                                            /* We've already got an expression
                                             * for resultValue which uses a
                                             * subset of the numbers this
                                             * expression uses */
                                            addExp = false;
                                            break;
                                        }
                                    }

                                    /* If after all that, this is a new and
                                     * interesting expression that gives us a
                                     * particular value in a way we couldn't
                                     * get before with the set of numbers the
                                     * expression uses, add it to the list, and
                                     * remember that this result can now be got
                                     * by this set of numbers. */
                                    if (addExp) {
                                        resultExistingMasks.push(selectionMask);
                                    }
                                }
                                else if (addExp) {
                                    /* Not in fast-solve mode, so because all
                                     * the expressions we've generated have
                                     * had their reorderable components in a
                                     * standard order, we can just check if the
                                     * string representation of the expression
                                     * is in the hash set for this result
                                     * value. */
                                    var resultExistingStrings = this.resultMap[resultValue];
                                    if (resultExistingStrings == null) {
                                        resultExistingStrings = {};
                                        this.resultMap[resultValue] = resultExistingStrings;
                                    }

                                    if (newExp.toString() in resultExistingStrings) {
                                        /* We already have this expression */
                                        addExp = false;
                                    }

                                    if (addExp) {
                                        resultExistingStrings[newExp.toString()] = true;
                                    }
                                }


                                if (addExp) {
                                    this.addExpressionToList(newExp);
                                    expressionsThisStep++;

                                    /* If the value of this expression is
                                     * closer to the target than the closest
                                     * we've found so far, remember it. */
                                    var betterThanNearest;
                                    if (this.nearestExp == null) {
                                        betterThanNearest = null;
                                    }
                                    else {
                                        betterThanNearest = Math.abs(this.nearestExp.getValue() - this.target) - Math.abs(resultValue - this.target);
                                    }

                                    if (this.nearestExp == null ||
                                            betterThanNearest >= 0) {
                                        if (this.nearestExp == null || betterThanNearest > 0) {
                                            /* If this expression is better
                                             * than rather than equally as good
                                             * as the current best, empty the
                                             * list of nearest expressions and
                                             * start a new one. */
                                            this.nearestExpList = [];
                                            this.nearestExp = newExp;
                                        }
                                        this.nearestExpList.push(newExp);
                                    }
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
                                            new SolverProgress(this.selection,
                                                this.target,
                                                now - this.startTime,
                                                this.numExpressions,
                                                this.nearestExp == null ? -1 : this.nearestExp.getValue(),
                                                this.nearestExpList == null ? 0 : this.nearestExpList.length
                                            )
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
         * Return the expression that got closest to the target if we're in
         * fastSolve mode, or the list of optimal expressions if we're not in
         * fastSolve mode. */
        var timeMs = Date.now() - this.startTime;
        console.log(this.selectionString + " -> " + this.target.toString() +
                ": best is " + (this.nearestExp == null ? "unknown" : this.nearestExp.getValue().toString()) + ". "
                + this.numExpressions +  " expressions, " +
                timeMs.toString() + "ms.");
        if (this.finishedCallback != null) {
            this.finishedCallback(
                    new SolverResults(this.selection, this.target,
                        this.fastSolve ? [this.nearestExp]:this.nearestExpList,
                        null)
            );
        }
        this.reset();
    }


    reset() {
        this.expressions = null;
        this.resultMap = null;
        this.numExpressions = 0;
        this.nearestExp = null;
        this.nearestExpList = [];
    }
    
    addExpressionToList(expression) {
        var l = this.expressions[expression.getCountNumbersUsed()];
        if (l == undefined) {
            l = [];
        }
        l.push(expression);
        this.expressions[expression.getCountNumbersUsed()] = l;
        this.numExpressions++;
    }
}

/* solverRun() and solverRunAllSolutions() are the public-facing calls from
 * this file.
 *
 * selection is an array of integers, and target is an integer.
 *
 * These functions run the solve process in the background using setTimeout()
 * calls.
 *
 * Every mumblemumble milliseconds, progressCallback() will be called with
 * a SolverProgress object, which contains, among other things, the number of
 * milliseconds elapsed so far and how close we've got to the target.
 *
 * When a solution is found, or if we determine there is no exact solution,
 * finishedCallback() will be called with a single argument, a SolverResults
 * object. This contains the solution or solutions the solver found.
 *
 * In fast mode (solverRun()) we make no attempt to find "all" the solutions to
 * a numbers puzzle. Once we find one expression which equals the target, we
 * return it. This will use the fewest number of numbers possible, because we
 * start by building up all the 2-number expressions, then the 3-number
 * expressions, and so on.
 *
 * If we're not in fast mode (solverRunAllSolutions()) we find all the
 * non-trivially-different solutions that give the closest possible to the
 * target.
 */

function solverRunAux(selection, target, progressCallback, finishedCallback, fastSolve) {
    var solverState = new SolverState(progressCallback, finishedCallback, fastSolve);
    solverState.start(selection, target);
}

function solverRun(selection, target, progressCallback, finishedCallback) {
    solverRunAux(selection, target, progressCallback, finishedCallback, true);
}

function solverRunAllSolutions(selection, target, progressCallback, finishedCallback) {
    solverRunAux(selection, target, progressCallback, finishedCallback, false);
}
