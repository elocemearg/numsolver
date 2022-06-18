
/* Useful constants for the actual solver */
const PLUS = 0;
const MINUS = 1;
const TIMES = 2;
const DIVIDE = 3;
const NUMBER = 4;

const PLUS_MINUS = 10;
const TIMES_DIVIDE = 11;

const NOTATION_ALGEBRAIC = 0;
const NOTATION_DESCRIPTIVE = 1;
const NOTATION_RPN = 2;
const NOTATION_PROSE = 3;

const operatorSymbols = [ "+", "-", "*", "/", "" ];
const operatorProse = [ "the sum of", "the difference between", "the product of", "the quotient of", "" ];
const operatorPrecedence = [ 10, 10, 20, 20, 30 ];
const operatorTypes = [ PLUS_MINUS, PLUS_MINUS, TIMES_DIVIDE, TIMES_DIVIDE, NUMBER ];

/* The maximum number of numbers allowed in the selection. If you increase
 * this, the worst-case time to find a solution (or determine no exact
 * solution exists) gets bigger by a surprisingly large amount. */
const SELECTION_MAX_FAST = 8;
const SELECTION_MAX_FULL = 7;

const STRATEGY_FAST_CUT = 0;
const STRATEGY_FAST = 1;
const STRATEGY_ALL_SOLUTIONS = 2;

/* SolverResults object, passed to the user's finishedCallback function. */
class SolverResults {
    constructor(selection, target, nearestExpressions, otherExpressions, errorMessage) {
        this.selection = selection.slice();
        this.target = target;
        this.nearestExpressions = nearestExpressions;
        this.errorMessage = errorMessage;
        if (otherExpressions == null) {
            otherExpressions = {};
        }
        this.otherExpressions = otherExpressions;
    }

    isSuccessful() {
        return this.errorMessage == null;
    }

    getSelection() {
        return this.selection;
    }

    getTarget() {
        return this.target;
    }

    getSolutions() {
        return this.nearestExpressions;
    }

    getSolution() {
        if (this.nearestExpressions == null || this.nearestExpressions.length == 0) {
            return null;
        }
        else {
            return this.nearestExpressions[0];
        }
    }

    getImperfectSolutions() {
        return this.otherExpressions;
    }

    getNumSolutions() {
        if (this.nearestExpressions == null)
            return 0;
        else
            return this.nearestExpressions.length;
    }

    getErrorMessage() {
        return this.errorMessage;
    }
}

/* SolverProgress object, passed to the user's progressCallback function if it
 * was defined. */
class SolverProgress {
    constructor(selection, target, msElapsed, numExpressions, bestTotalSoFar, numBestSolutions, bestSolution=null) {
        this.selection = selection.slice();
        this.target = target;
        this.msElapsed = msElapsed;
        this.numExpressions = numExpressions;
        this.bestTotalSoFar = bestTotalSoFar;
        this.numBestSolutions = numBestSolutions;
        this.bestSolution = bestSolution;
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

    getBestSolutionSoFar() {
        return this.bestSolution;
    }
}

class Expression {
    isCompatible(otherExp) {
        /* If there exists a pair of used-numbers bitmasks, one from our list
         * and one from otherExp's list, which don't have any bits in common,
         * then we're compatible. */
        let otherMasks = otherExp.getSelectionMaskList();
        for (let i = 0; i < this.selectionMasks.length; ++i) {
            for (let j = 0; j < otherMasks.length; ++j) {
                if ((this.selectionMasks[i] & otherMasks[j]) == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    toString(notation=NOTATION_ALGEBRAIC) {
        if (notation == NOTATION_DESCRIPTIVE) {
            return this.toStringDescriptive();
        }
        else if (notation == NOTATION_RPN) {
            return this.toStringRPN();
        }
        else if (notation == NOTATION_PROSE) {
            return this.toStringProse();
        }
        else {
            return this.toStringAlgebraic();
        }
    }
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
        this.selectionMaskList = null;
        this.countNumbersUsed = null;
    }

    getSelectionMask() {
        if (this.selectionMask == null) {
            this.selectionMask = this.leftExp.getSelectionMask() | this.rightExp.getSelectionMask();
        }
        return this.selectionMask;
    }

    getSelectionMaskList() {
        if (this.selectionMaskList == null) {
            this.selectionMaskList = [ this.getSelectionMask() ];
        }
        return this.selectionMaskList;
    }

    isCompatible(otherExp) {
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

    getCountSpecificNumberUsed(n) {
        return this.leftExp.getCountSpecificNumberUsed(n) + this.rightExp.getCountSpecificNumberUsed(n);
    }

    toStringAlgebraic() {
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

    getOperatorString() {
        return operatorSymbols[this.getOperator()];
    }

    toStringDescriptive() {
        let str = "";
        if (!this.leftExp.isAtom()) {
            str += this.leftExp.toStringDescriptive() + " = " + this.leftExp.getValue() + "\n";
        }
        if (!this.rightExp.isAtom()) {
            str += this.rightExp.toStringDescriptive() + " = " + this.rightExp.getValue() + "\n";
        }
        str += this.leftExp.getValue().toString() + " " +
            this.getOperatorString() + " " + this.rightExp.getValue().toString() + " = " + this.getValue().toString();
        return str;
    }

    toStringRPN() {
        let str;

        /* The left subtree's RPN... */
        str = this.leftExp.toStringRPN();

        /* ... then the right subtree's RPN... */
        str += " " + this.rightExp.toStringRPN();

        /* ... then the operator. */
        str += " " + this.getOperatorString();

        return str;
    }

    toStringProse() {
        let str;
        str = operatorProse[this.getOperator()];
        str += " " + this.leftExp.toStringProse();
        str += " and " + this.rightExp.toStringProse();
        return str;
    }

    isAtom() {
        return false;
    }

    isUseless() {
        /* We don't do uselessness analysis with BinaryTreeExpression */
        return false;
    }
}

class SingleNumber extends Expression {
    constructor(value, selectionMaskList) {
        super();
        this.value = value;
        this.selectionMasks = selectionMaskList.slice();
        this.numbersUsed = [];
        this.numbersUsed[value] = 1;
    }

    getSelectionMask() {
        return this.selectionMasks[0];
    }

    getSelectionMaskList() {
        return this.selectionMasks;
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

    getCountSpecificNumberUsed(n) {
        return (n == this.value ? 1 : 0);
    }

    toStringAlgebraic() {
        return this.value.toString();
    }

    toStringDescriptive() {
        return this.toString();
    }

    toStringRPN() {
        return this.toString();
    }

    toStringProse() {
        /* Currently returns e.g. "8". We might want "eight"? */
        return this.toString();
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

    compareTo(otherExp) {
        if (!otherExp.isAtom()) {
            return -otherExp.compareTo(this);
        }
        else {
            return otherExp.getValue() - this.value;
        }
    }

    isUseless() {
        return false;
    }

    getOperatorString() {
        return "";
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

function subsetSumEqualsValue(numbers, total, numbersStart=0) {
    for (let i = numbersStart; i < numbers.length; ++i) {
        if (numbers[i] == total) {
            return true;
        }
        if (numbers[i] < total && subsetSumEqualsValue(numbers, total - numbers[i], i + 1)) {
            return true;
        }
    }
    return false;
}

function subsetProductEqualsValue(numbers, product, numbersStart=0) {
    for (let i = numbersStart; i < numbers.length; ++i) {
        if (numbers[i] == product) {
            return true;
        }
        if (numbers[i] < product && (product % numbers[i]) == 0) {
            if (subsetProductEqualsValue(numbers, product / numbers[i], i + 1)) {
                return true;
            }
        }
    }
    return false;
}

/* In find-all-solutions mode, all expressions are either OrderedExpressions
 * or SingleNumbers. */
class OrderedExpression extends Expression {
    constructor(leftExp, rightExp, operator) {
        super();

        /* Each expression can have a number of bitmasks, in which each bit
         * represents a starting number used. The reason an expression can have
         * more than one bitmask is because there could be repeated numbers
         * in the selection, and we can use either. For example, if the
         * selection is [ 100, 4, 5, 5, 9, 3 ], and our selection uses the
         * 4, 5 and 9, our masks would be [ 0b011010, 0b010110 ] because we
         * could use either 5.
         *
         * This ensures we're always considered compatible with any other
         * expression that uses one 5 - it doesn't matter "which" 5 we use.
         * */
        this.selectionMasks = [];
        let leftMasks = leftExp.getSelectionMaskList();
        let rightMasks = rightExp.getSelectionMaskList();
        for (let i = 0; i < leftMasks.length; ++i) {
            for (let j = 0; j < rightMasks.length; ++j) {
                if ((leftMasks[i] & rightMasks[j]) == 0) {
                    this.selectionMasks.push(leftMasks[i] | rightMasks[j]);
                }
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

    getOneSideExpression(additive, start=0, end=null) {
        let expList;
        let length;

        if (additive)
            expList = this.leftExpressions;
        else
            expList = this.rightExpressions;

        if (end === null) {
            end = expList.length;
        }
        length = end - start;
        if (length <= 0) {
            return null;
        }
        else if (length == 1) {
            return expList[start];
        }
        else {
            let subOp;
            if (this.operatorType == PLUS_MINUS) {
                subOp = PLUS;
            }
            else {
                subOp = TIMES;
            }
            let left = this.getOneSideExpression(additive, start, start + Math.floor(length / 2));
            let right = this.getOneSideExpression(additive, start + Math.floor(length / 2), end);
            return new OrderedExpression(left, right, subOp);
        }
    }

    getAdditiveSideExpression() {
        return this.getOneSideExpression(true);
    }

    getSubtractiveSideExpression() {
        return this.getOneSideExpression(false);
    }

    getLeftExpressionList() {
        return this.leftExpressions.slice();
    }

    getRightExpressionList() {
        return this.rightExpressions.slice();
    }

    isUseless() {
        /* If this is a subtraction operation, then if the value of the right
         * is equal to half of any of the added terms on the left, this
         * operation is trivially optimisable. For example, (100 + 10) - 5 is
         * trivially optimisable to 100 + 5. */
        if (this.operatorType == PLUS_MINUS && this.rightExpressions.length > 0) {
            let rightTotal = 0;
            for (let i = 0; i < this.rightExpressions.length; ++i) {
                rightTotal += this.rightExpressions[i].getValue();
            }

            let leftValues = [];
            for (let i = 0; i < this.leftExpressions.length; ++i) {
                if (this.leftExpressions[i].getValue() == rightTotal * 2) {
                    return true;
                }
                leftValues.push(this.leftExpressions[i].getValue());
            }

            /* If any subset of the numbers on the left sum to the value of
             * this expression, then it is useless. For example,
             * 100 + 7 + 2 - (3 + 4) is useless because 100 + 2 = 102 and we
             * can remove the 7 and the (3 + 4). */
            let myValue = this.getValue();
            if (subsetSumEqualsValue(leftValues, myValue)) {
                return true;
            }
        }
        else if (this.operatorType == TIMES_DIVIDE && this.rightExpressions.length > 0) {
            /* Also if we have something like (100 * 25) / 5, that's trivially
             * optimisable to 100 * 5. */
            let rightTotal = 1;
            for (let i = 0; i < this.rightExpressions.length; ++i) {
                rightTotal *= this.rightExpressions[i].getValue();
            }

            let leftValues = [];
            for (let i = 0; i < this.leftExpressions.length; ++i) {
                if (this.leftExpressions[i].getValue() == rightTotal * rightTotal) {
                    return true;
                }
                leftValues.push(this.leftExpressions[i].getValue());
            }

            /* If any subset of numbers on the left multiply to the value of
             * this expression, we're useless. This identifies e.g.
             * (100 * 5 * 6 * 10) / 50 = 600. We can remove the 5, the 10, and
             * indeed the division. */

            let myValue = this.getValue();
            if (subsetProductEqualsValue(leftValues, myValue)) {
                return true;
            }
        }
        return false;
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

    getCountNumbersUsed() {
        return this.countNumbersUsed;
    }

    getCountSpecificNumberUsed(n) {
        let count = 0;
        for (let i = 0; i < this.leftExpressions.length; ++i) {
            count += this.leftExpressions[i].getCountSpecificNumberUsed(n);
        }
        for (let i = 0; i < this.rightExpressions.length; ++i) {
            count += this.rightExpressions[i].getCountSpecificNumberUsed(n);
        }
        return count;
    }

    getOperatorType() {
        return this.operatorType;
    }

    getOperator() {
        /* Get binary operator, PLUS, MINUS, TIMES or DIVIDE */
        if (this.operatorType == PLUS_MINUS) {
            if (this.rightExpressions.length == 0) {
                return PLUS;
            }
            else {
                return MINUS;
            }
        }
        else {
            if (this.rightExpressions.length == 0) {
                return TIMES;
            }
            else {
                return DIVIDE;
            }
        }
    }

    getOperatorString() {
        return operatorSymbols[this.getOperator()];
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

    toStringAlgebraic() {
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

    toStringDescriptive() {
        let expLists = [ this.leftExpressions, this.rightExpressions ];
        let desc = "";
        let runningTotal;
        let expCount = 0;
        let operators;

        if (this.operatorType == TIMES_DIVIDE) {
            runningTotal = 1;
            operators = [ "*", "/" ];
        }
        else {
            runningTotal = 0;
            operators = [ "+", "-" ];
        }

        for (let l = 0; l < 2; ++l) {
            let expList = expLists[l];
            for (let i = 0; i < expList.length; ++i) {
                let exp = expList[i];
                if (!exp.isAtom()) {
                    desc += exp.toStringDescriptive();
                }

                if (expCount > 0) {
                    desc += runningTotal.toString() + " " + operators[l] +
                        " " + exp.getValue().toString() + " = ";
                }

                if (this.operatorType == TIMES_DIVIDE) {
                    if (l == 0)
                        runningTotal *= exp.getValue();
                    else
                        runningTotal /= exp.getValue();
                }
                else {
                    if (l == 0)
                        runningTotal += exp.getValue();
                    else
                        runningTotal -= exp.getValue();
                }

                if (expCount > 0) {
                    desc += runningTotal.toString() + "\n";
                }

                ++expCount;
            }
        }
        return desc;
    }

    toStringRPN() {
        let output = "";
        let additiveOperator, subtractiveOperator;
        let expLists = [ this.leftExpressions, this.rightExpressions ];
        if (this.operatorType == TIMES_DIVIDE) {
            additiveOperator = "*";
            subtractiveOperator = "/";
        }
        else {
            additiveOperator = "+";
            subtractiveOperator = "-";
        }

        /* Combine all the left expressions with * or +, then combine all the
         * right expressions with * or +, then if there was at least one right
         * expression, emit a / or - to divide/subtract the left with the
         * right. */
        for (let l = 0; l < 2; ++l) {
            let expList = expLists[l];
            for (let i = 0; i < expList.length; ++i) {
                let exp = expList[i];
                output += exp.toStringRPN() + " ";
                if (i > 0) {
                    output += additiveOperator + " ";
                }
            }
        }
        if (expLists[1].length > 0) {
            output += subtractiveOperator;
        }
        return output.trim();
    }

    toStringProse() {
        let output = "";
        let additiveOperator, subtractiveOperator;
        let expLists = [ this.leftExpressions, this.rightExpressions ];
        if (this.operatorType == TIMES_DIVIDE) {
            additiveOperator = operatorProse[TIMES];
            subtractiveOperator = operatorProse[DIVIDE];
        }
        else {
            additiveOperator = operatorProse[PLUS];
            subtractiveOperator = operatorProse[MINUS];
        }

        let sides = [ "", "" ];
        for (let l = 0; l < 2; ++l) {
            let expList = expLists[l];
            /* Work from the end backwards, so we do the less complicated
             * expressions first. "the product of 5 and the sum of 6 and 7" is
             * clearer than "the product of the sum of 6 and 7 and 5". */
            for (let i = expList.length - 1; i >= 0; --i) {
                if (i < expList.length - 1) {
                    if (i == 0) {
                        sides[l] += " and ";
                    }
                    else {
                        sides[l] += ", ";
                    }
                }
                sides[l] += expList[i].toStringProse();
            }
            if (expList.length > 1) {
                sides[l] = additiveOperator + " " + sides[l];
            }
        }
        if (sides[1].length > 0) {
            output = subtractiveOperator + " " + sides[0] + " and " + sides[1];
        }
        else {
            output = sides[0];
        }
        return output;
    }

    getSelectionMaskList() {
        return this.selectionMasks;
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
    constructor(progressCallback, finishedCallback, strategy) {
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
         * If isBinaryTreeStrategy() is false (strategy is STRATEGY_FAST_CUT
         * or STRATEGY_FAST), this is instead a map of expression strings to
         * lists of masks.
         */
        this.resultMap = [];

        /* The expression which gets us closest to the target so far. If
         * target is null, this will be null. */
        this.nearestExp = null;

        /* All the "nearest" expressions we've found so far. If target is
         * null, this will always be empty. */
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
        this.startDelayMs = 10;

        /* The length of expression step() is currently looking to generate. */
        this.soughtExpressionLength = 1;

        /* strategy:
         * STRATEGY_FAST_CUT: use BinaryTree expressions, which agressively
         * eliminate redundant expressions. Stop when we've found an exact
         * solution or found that none exists.
         * STRATEGY_FAST: use BinaryTree expressions, but continue searching
         * for solutions to other targets, adding up to one solution per
         * target to imperfectMap, until we've found a solution for every
         * possible target.
         * STRATEGY_ALL_SOLUTIONS: use OrderedExpressions (slower) and continue
         * until all solutions are found. */
        this.strategy = strategy;

        this.selectionMax = (strategy == STRATEGY_ALL_SOLUTIONS ? SELECTION_MAX_FULL : SELECTION_MAX_FAST);

        /* If strategy is STRATEGY_FAST_CUT, imperfectMap is empty.
         * Otherwise, if one of imperfectMin or imperfectMax were set, this is
         * a map of (target -> array of solutions). Only targets within the
         * range [imperfectMin, imperfectMax] are added to imperfectMap.
         * If strategy is STRATEGY_ALL_SOLUTIONS, each target will map to a
         * list of all non-trivially different solutions for that target.
         * Otherwise if strategy is STRATEGY_FAST, each target will map to a
         * list containing at most one solution. */
        this.imperfectMap = {};

        /* Expressions whose value is within this range go into imperfectMap.
         * If both are null, then nothing goes into imperfectMap. */
        this.imperfectMin = null;
        this.imperfectMax = null;

        /* The minimum and maximum number of numbers that must be used by
         * each returned solution. By default they are 1 and the number of
         * numbers in the selection (that is, unrestricted). */
        this.minNumbersUsed = null;
        this.maxNumbersUsed = null;

        /* Which numbers in the selection must appear in every returned
         * solution, as a mapping of n -> count. For example, { 4: 3, 6: 1 }
         * means every valid solution must contain at least three 4s and one 6.
         * By default this is the empty dictionary - no specific number
         * is required to appear. */
        this.lockedNumbers = [];
        this.lockedNumbersCounts = {};

        /* By default, don't bother multiplying or dividing by numbers less
         * than 2. However, if we have a constraint on the minimum number of
         * numbers to use, or a 1 is locked, we'll allow multiplying or
         * dividing by 1. */
        this.minMultiplier = 2;

        /* If minNumbersUsed > 1 or any numbers are locked, it might be
         * required to do something like (y + x - x). */
        this.allowAddZero = false;
        this.allowUselessDivision = false;

        /* If imperfectMin and imperfectMax are not both null, this is the
         * number of distinct targets for which we have found at least one
         * solution. If imperfectMin == imperfectMax == null, it's always 0. */
        this.distinctImperfectTargetsFound = 0;

        /* If we solve this number of distinct targets which qualify to be
         * inserted into imperfectMap, then finish early. */
        this.maxDistinctImperfectTargets = null;
    }

    isAllSolutions() {
        return this.strategy == STRATEGY_ALL_SOLUTIONS;
    }

    isBinaryTreeStrategy() {
        return this.strategy != STRATEGY_ALL_SOLUTIONS;
    }

    isStopAfterSolutionFound() {
        return this.strategy == STRATEGY_FAST_CUT;
    }

    resultMapHashValue(expression) {
        if (this.isBinaryTreeStrategy()) {
            return expression.getValue();
        }
        else {
            return expression.toString();
        }
    }

    start(selection, target, imperfectMin=null, imperfectMax=null,
            minNumbersUsed=null, maxNumbersUsed=null, lockedNumbers=[]) {
        this.selection = selection;
        this.target = target;
        this.imperfectMin = imperfectMin;
        this.imperfectMax = imperfectMax;
        this.minNumbersUsed = minNumbersUsed;
        this.maxNumbersUsed = maxNumbersUsed;

        if (this.minNumbersUsed == null) {
            this.minNumbersUsed = 1;
        }
        if (this.maxNumbersUsed == null) {
            this.maxNumbersUsed = this.selection.length;
        }
        if (this.maxNumbersUsed > this.selection.length) {
            this.maxNumbersUsed = this.selection.length;
        }

        this.lockedNumbers = lockedNumbers;
        this.lockedNumbersCounts = {};
        for (let i = 0; i < lockedNumbers.length; ++i) {
            let n = lockedNumbers[i];
            if (this.lockedNumbersCounts[n] !== undefined) {
                this.lockedNumbersCounts[n] += 1;
            }
            else {
                this.lockedNumbersCounts[n] = 1;
            }
        }

        /* Check that the list of locked numbers is a subset of the selection.
         */
        for (let n in this.lockedNumbersCounts) {
            let count = this.lockedNumbersCounts[n];
            for (let i = 0; i < selection.length; ++i) {
                if (selection[i] == n) {
                    count--;
                }
            }
            if (count > 0) {
                this.finishedCallback(
                        new SolverResults(
                            selection, target, null, null,
                            "Locked numbers is not a subset of the selection."
                        )
                );
                this.reset();
                return;
            }
        }

        if (this.minNumbersUsed > 1 || 1 in this.lockedNumbersCounts) {
            this.minMultiplier = 1;
        }
        if (this.minNumbersUsed > 1 || this.lockedNumbers.length > 0) {
            this.allowAddZero = true;
            this.allowUselessDivision = true;
        }
        
        if (this.selection.length < 2) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null, null,
                        "Selection must contain at least 2 numbers."
                    )
            );
            this.reset();
            return;
        }
        else if (this.selection.length > this.selectionMax) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null, null,
                        "Selection may not contain more than " + this.selectionMax.toString() + " numbers" + (!this.isAllSolutions() ? "." : " in all-solutions mode.")
                    )
            );
            this.reset();
            return;
        }

        if (this.minNumbersUsed < 1) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null, null,
                        "Minimum numbers to use (" + this.minNumbersUsed.toString() + ") must be at least 1."
                    )
            );
            this.reset();
            return;
        }

        if (this.maxNumbersUsed < 2) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null, null,
                        "Maximum numbers to use (" + this.maxNumbersUsed.toString() + ") must be at least 2."
                    )
            );
            this.reset();
            return;
        }

        if (this.minNumbersUsed > this.selection.length) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null, null,
                        "Minimum numbers to use (" + this.minNumbersUsed.toString() + ") may not be greater than the number of numbers in the selection (" + this.selection.length.toString() + ").")
            );
            this.reset();
            return;
        }
        if (this.minNumbersUsed > this.maxNumbersUsed) {
            this.finishedCallback(
                    new SolverResults(
                        selection, target, null, null,
                        "Minimum numbers to use (" + this.minNumbersUsed.toString() + ") may not be greater than the maximum (" + this.maxNumbersUsed.toString() + ").")
            );
            this.reset();
            return;
        }

        if (this.imperfectMin != null && this.imperfectMax != null) {
            this.maxDistinctImperfectTargets = this.imperfectMax - this.imperfectMin + 1;
            if (this.target != null && (this.target < this.imperfectMin ||
                        this.target > this.imperfectMax)) {
                this.maxDistinctImperfectTargets++;
            }
        }

        /* We're allowed to have a null target - this means search the solution
         * space and fill imperfectMap with all the solutions we find. */
        if (target !== null) {
            if (isNaN(target)) {
                this.finishedCallback(
                        new SolverResults(selection, target, null, null,
                            "Target is not a number."
                        )
                );
                this.reset();
                return;
            }

            if (target <= 0) {
                this.finishedCallback(
                        new SolverResults(selection, target, null, null,
                            "Target must be a positive integer."
                        )
                );
                this.reset();
                return;
            }
        }

        /* Sort the selection descending, so that copies of the same number
         * are together. */
        selection = selection.slice(0);
        selection.sort(function(a, b) { return b - a; });
        for (var i = 0; i < selection.length; ++i) {
            let bitmasks = [1 << i];
            if (i > 0)
                this.selectionString += " ";
            this.selectionString += selection[i].toString();

            /* If this number appears more than once in the selection, and
             * we're not in fast mode, generate it once, but with multiple
             * bitmasks, once for each occurrence. This means we don't
             * accidentally generate multiple copies of the same solution,
             * because a second solution "uses the other 6" or whatever. */
            if (!this.isBinaryTreeStrategy()) {
                while (i + 1 < selection.length && selection[i + 1] == selection[i]) {
                    ++i;
                    bitmasks.push(1 << i);
                    this.selectionString += " ";
                    this.selectionString += selection[i].toString();

                }
            }

            var exp = new SingleNumber(selection[i], bitmasks);
            this.addExpressionToList(exp);

            if (exp.getValue() <= 0) {
                this.finishedCallback(new SolverResults(selection, target,
                            null, null,
                            "All starting numbers must be positive integers, so you can't have " + exp.getValue().toString() + "."
                            )
                );
                this.reset();
                return;
            }

            let resultMasks = this.resultMap[this.resultMapHashValue(exp)];
            if (resultMasks == null) {
                resultMasks = [];
                this.resultMap[this.resultMapHashValue(exp)] = resultMasks;
            }
            for (let j = 0; j < bitmasks.length; ++j) {
                resultMasks.push(bitmasks[j]);
            }

            if (!this.isStopAfterSolutionFound()) {
                /* If we have a filter to catch all expressions, even the ones
                 * not reaching the best solution, then add the single numbers
                 * to the filter map if they pass the filter. */
                if (this.imperfectMin != null || this.imperfectMax != null) {
                    if ((this.imperfectMin == null || exp.getValue() >= this.imperfectMin) &&
                            (this.imperfectMax == null || exp.getValue() <= this.imperfectMax) &&
                            !(exp.getValue() in this.imperfectMap) &&
                            this.meetsSolutionConstraints(exp)) {
                        this.addToImperfectMap(exp);
                    }
                }
            }

            if (target != null && exp.getValue() == target && this.meetsSolutionConstraints(exp)) {
                if (this.isStopAfterSolutionFound()) {
                    /* If the target is in the selection, just return the single
                     * expression containing that number */
                    this.finishedCallback(
                            new SolverResults(selection, target, [exp], [], null)
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
         * expressions, and so on, up to the maxNumbersUsed-number
         * expressions. Note that these for-loops don't have initialisers -
         * that's because this is designed to be returned from mid-solve so we
         * can pick up from wherever we left off. */
        for (; this.soughtExpressionLength <= this.maxNumbersUsed; this.soughtExpressionLength++) {
            /* If we're generating expressions of length N, we first want
             * expression pairs of length 1 and N-1, then 2 and N-2, and so on
             * until (N-1)/2 and (N+1)/2 (if N is odd) or N/2 and N/2 (if N is
             * even).
             * We don't need to go all the way up to N-1 and 1, because that
             * will just give us the same pairs we've already done but the
             * other way round. For addition or multiplication we don't care
             * which way round the expressions are, and for subtraction and
             * division it's only valid one way round - we'll make sure to put
             * the larger number first.
             * This generates us all the valid expressions of length N. */
            var expLength1Max = Math.floor(this.soughtExpressionLength / 2);
            for (; this.expLength1 <= expLength1Max; this.expLength1++) {
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

                        if (exp1.isCompatible(exp2)) {
                            /* exp1 and exp2 are compatible - they don't use
                             * any of the same starting numbers. */
                            
                            var leftValue = exp1.getValue();
                            var rightValue = exp2.getValue();

                            /* Put the larger number on the left hand side of
                             * the operator in all cases.
                             * For addition and multiplication this won't
                             * matter, and for subtraction and division we're
                             * required to have them that way round by the
                             * rules. */
                            if (leftValue < rightValue) {
                                var tmp = leftValue;
                                leftValue = rightValue;
                                rightValue = tmp;
                                tmp = exp1;
                                exp1 = exp2;
                                exp2 = tmp;
                            }

                            /* Generate a new expression using these two
                             * expressions for each of the operations +-*/
                            for (var op = 0; op < 4; ++op) {
                                /* Also we don't need to divide by 1, or divide
                                 * A by B if A isn't a multiple of B. */
                                if (op == DIVIDE && (rightValue < this.minMultiplier || leftValue % rightValue != 0))
                                    continue;

                                /* Don't bother multiplying by 0 or 1 */
                                if (op == TIMES && (leftValue < this.minMultiplier || rightValue < this.minMultiplier))
                                    continue;

                                /* We don't ever need to subtract x from 2x,
                                 * because the answer will be x, which we
                                 * already have. For example, 10 - 5 is always
                                 * useless. */
                                if (op == MINUS && !this.allowAddZero && leftValue == rightValue * 2)
                                    continue;

                                /* We don't ever need to divide a number by its
                                 * square root, because the square root will
                                 * be the answer, which we already have. e.g.
                                 * we never need to do 9 / 3 or 25 / 5. */
                                if (op == DIVIDE && !this.allowUselessDivision && leftValue == rightValue * rightValue)
                                    continue;

                                var newExp;
                                if (this.isBinaryTreeStrategy()) {
                                    newExp = new BinaryTreeExpression(exp1, exp2, op);
                                }
                                else {
                                    newExp = new OrderedExpression(exp1, exp2, op);
                                }

                                if (this.minNumbersUsed <= 1 &&
                                       this.lockedNumbers.length == 0 &&
                                       newExp.isUseless()) {
                                    continue;
                                }

                                var resultValue = newExp.getValue();

                                if (this.target != null && resultValue == this.target) {
                                    /* We've found an expression which equals
                                     * the target. If strategy is
                                     * STRATEGY_FAST_CUT then we've finished
                                     * and don't need to do anything more. */
                                    if (this.isStopAfterSolutionFound()) {
                                        this.logProblemFinished();
                                        if (this.finishedCallback != null) {
                                            this.finishedCallback(
                                                    new SolverResults(
                                                        this.selection,
                                                        this.target,
                                                        [newExp], null, null
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
                                if (this.soughtExpressionLength == this.maxNumbersUsed && this.nearestExp != null) {
                                    if (this.target != null && Math.abs(resultValue - this.target) > Math.abs(this.nearestExp.getValue() - this.target)) {
                                        if ((this.imperfectMin != null &&
                                                    resultValue < this.imperfectMin) ||
                                                (this.imperfectMax != null &&
                                                 resultValue > this.imperfectMax)) {
                                            addExp = false;
                                        }
                                    }
                                }

                                if (addExp) {
                                    let selectionMasks = newExp.getSelectionMaskList();
                                    let expHashValue = this.resultMapHashValue(newExp);

                                    /* Get the list of selection masks which we
                                     * already know we can use to make this
                                     * value or this expression (depending on
                                     * strategy). If the expression newExp
                                     * uses a superset of one of those
                                     * selection masks then we don't need
                                     * newExp.
                                     *
                                     * For example, if we're using fast-solve
                                     * mode, there's no need to know we
                                     * can make 35 from 3*10+5 if we already
                                     * know we can make it from (10-3)*5. We
                                     * don't need the expression 4*2-2=6 if we
                                     * already know 4+2=6 (and we will already
                                     * have the smaller expression in our list,
                                     * because we build the smaller expressions
                                     * first).
                                     */
                                    let resultExistingMasks = this.resultMap[expHashValue];
                                    if (resultExistingMasks == null) {
                                        resultExistingMasks = [];
                                        this.resultMap[expHashValue] = resultExistingMasks;
                                    }

                                    /* If our new expression has at least one
                                     * selection mask which is not a superset
                                     * of any of the existing masks for this
                                     * hash value, then this expression and
                                     * all its such selection masks are worth
                                     * keeping. */
                                    let newMasks = [];
                                    for (let l = 0; l < selectionMasks.length; ++l) {
                                        let isSupersetOfOne = false;
                                        for (let k = 0; k < resultExistingMasks.length; ++k) {
                                            if ((selectionMasks[l] & resultExistingMasks[k]) == resultExistingMasks[k]) {
                                                isSupersetOfOne = true;
                                                break;
                                            }
                                        }
                                        if (!isSupersetOfOne) {
                                            newMasks.push(selectionMasks[l]);
                                        }
                                    }
                                    /* We've already got an expression
                                     * for expHashValue which uses a
                                     * subset of the numbers this
                                     * expression uses */
                                    if (newMasks.length == 0) {
                                        addExp = false;
                                    }

                                    /* If after all that, this is a new and
                                     * interesting expression that gives us a
                                     * particular value in a way we couldn't
                                     * get before with the set of numbers the
                                     * expression uses, add it to the list, and
                                     * remember that this result can now be got
                                     * by this set of numbers. */
                                    if (addExp) {
                                        for (let l = 0; l < newMasks.length; ++l) {
                                            resultExistingMasks.push(newMasks[l]);
                                        }
                                    }
                                }

                                if (addExp && !this.isStopAfterSolutionFound()) {
                                    if ((this.imperfectMin != null ||
                                            this.imperfectMax != null) &&
                                            (this.imperfectMin == null ||
                                             resultValue >= this.imperfectMin) &&
                                            (this.imperfectMax == null ||
                                             resultValue <= this.imperfectMax) &&
                                            this.meetsSolutionConstraints(newExp)) {
                                        this.addToImperfectMap(newExp);
                                    }
                                }

                                if (addExp) {
                                    this.addExpressionToList(newExp);
                                    expressionsThisStep++;
                                }

                                if (addExp && this.target != null && this.meetsSolutionConstraints(newExp)) {
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

                            /* If we're not interested in every solution for
                             * a target, and we've found at least one solution
                             * for every target in the imperfect map, and we've
                             * found the actual target (if specified) then
                             * we can finish early. */
                            if (!this.isAllSolutions() &&
                                    this.target != null &&
                                    this.maxDistinctImperfectTargets != null &&
                                    this.nearestExp != null &&
                                    this.nearestExp.getValue() == this.target &&
                                    this.distinctImperfectTargetsFound >= this.maxDistinctImperfectTargets) {
                                console.log("Found " + this.distinctImperfectTargetsFound.toString() + " targets for imperfect targets map, finishing early.");
                                this.logProblemFinished();
                                if (this.finishedCallback != null) {
                                    this.finishedCallback(
                                            new SolverResults(this.selection, this.target,
                                                [ this.nearestExp ],
                                                this.isStopAfterSolutionFound() ? {}:this.imperfectMap,
                                                null)
                                    );
                                }
                                this.reset();
                                return;
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
                                                this.nearestExpList == null ? 0 : this.nearestExpList.length,
                                                this.nearestExp
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
         * Return the expression or expressions that got closest to the target,
         * and any other epxressions that match the filter we've been given. */

        this.logProblemFinished();
        if (this.finishedCallback != null) {
            this.finishedCallback(
                    new SolverResults(this.selection, this.target,
                        !this.isAllSolutions() ? (
                            this.nearestExp == null ? [] : [this.nearestExp]
                        ) : this.nearestExpList,
                        this.isStopAfterSolutionFound() ? {}:this.imperfectMap,
                        null)
            );
        }
        this.reset();
    }

    logProblemFinished() {
        let timeMs = Date.now() - this.startTime;
        console.log(this.selectionString +
                (this.target == null ? "" : (" -> " + this.target.toString() +
                " (min " + this.minNumbersUsed.toString() + ", max " +
                this.maxNumbersUsed.toString() + ", locked [" +
                this.lockedNumbers.toString() + "])" +
                ": best is " + (this.nearestExp == null ? "unknown" : this.nearestExp.getValue().toString()))) + ". "
                + this.numExpressions +  " expressions, " +
                timeMs.toString() + "ms.");
    }

    meetsSolutionConstraints(exp) {
        let numbersUsed = exp.getCountNumbersUsed();
        
        if (numbersUsed < this.minNumbersUsed || numbersUsed > this.maxNumbersUsed) {
            return false;
        }

        for (let n in this.lockedNumbersCounts) {
            let requiredCount = this.lockedNumbersCounts[n];
            if (exp.getCountSpecificNumberUsed(n) < requiredCount) {
                return false;
            }
        }

        return true;
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

    addToImperfectMap(newExp) {
        let resultValue = newExp.getValue();
        if (this.isAllSolutions() || !(resultValue in this.imperfectMap)) {
            if (resultValue in this.imperfectMap) {
                this.imperfectMap[resultValue].push(newExp);
            }
            else {
                this.distinctImperfectTargetsFound++;
                this.imperfectMap[resultValue] = [ newExp ];
            }
        }
    }
}

/* solverRun() and solverRunAllSolutions() are the public-facing calls from
 * this file.
 *
 * selection is an array of integers, and target is an integer or null. If
 * target is null then there is no target, but we still search the solution
 * space and fill imperfectMap with solutions to all targets assuming they
 * match the imperfectSolutionsMin/Max filter.
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
 *
 * solverRun() uses the STRATEGY_FAST_CUT strategy.
 * solverRunAllSolutions() uses the STRATEGY_ALL_SOLUTIONS strategy.
 *
 * In STRATEGY_FAST_CUT and STRATEGY_FAST, we make no attempt to find "all" the
 * solutions to a numbers puzzle. Expressions are eliminated if we already have
 * an expression which reaches the same total with the same starting numbers.
 * Additionally, if the strategy is STRATEGY_FAST_CUT, we stop early if we
 * find a solution to the target.
 *
 * If the strategy is STRATEGY_ALL_SOLUTIONS, we use a less aggressive
 * expression duplicate elimination strategy. The aim is to find all
 * non-trivially-different solutions to the target.
 *
 * If the strategy is STRATEGY_FAST or STRATEGY_ALL_SOLUTIONS, then
 * imperfectSolutionsMin and imperfectSolutionsMax can be set to tell the
 * solver to also catch solutions to targets that fall within that range.
 * In the case of STRATEGY_FAST, at most one solution will be returned per
 * target, and in the case of STRATEGY_ALL_SOLUTIONS, all non-trivially-
 * different solutions will be returned for each target.
 */

function solverRunAux(selection, target, progressCallback, finishedCallback,
        strategy, imperfectSolutionsMin=null, imperfectSolutionsMax=null,
        minNumbersUsed=null, maxNumbersUsed=null, lockedNumbers=[]) {
    var solverState = new SolverState(progressCallback, finishedCallback, strategy);
    solverState.start(selection, target, imperfectSolutionsMin,
            imperfectSolutionsMax, minNumbersUsed, maxNumbersUsed,
            lockedNumbers);
}

function solverRun(selection, target, progressCallback, finishedCallback,
        maxNumbersUsed=null) {
    solverRunAux(selection, target, progressCallback, finishedCallback,
            STRATEGY_FAST_CUT, null, null, null, maxNumbersUsed, []);
}

function solverRunAllTargets(selection, target, progressCallback,
        finishedCallback, imperfectSolutionsMin=null,
        imperfectSolutionsMax=null, minNumbersUsed=null, maxNumbersUsed=null,
        lockedNumbers=[]) {
    solverRunAux(selection, target, progressCallback, finishedCallback,
            STRATEGY_FAST, imperfectSolutionsMin, imperfectSolutionsMax,
            minNumbersUsed, maxNumbersUsed, lockedNumbers);
}

function solverRunAllSolutions(selection, target, progressCallback,
        finishedCallback, imperfectSolutionsMin=null,
        imperfectSolutionsMax=null, minNumbersUsed=null, maxNumbersUsed=null,
        lockedNumbers=[]) {
    solverRunAux(selection, target, progressCallback, finishedCallback,
            STRATEGY_ALL_SOLUTIONS, imperfectSolutionsMin,
            imperfectSolutionsMax, minNumbersUsed, maxNumbersUsed,
            lockedNumbers);
}
