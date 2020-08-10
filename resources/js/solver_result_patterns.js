class SolutionPattern {
    constructor(name=null) {
        this.name = name;
    }

    acceptMatch(expression, expNames) {
        if (this.name != null) {
            expNames[this.name] = expression;
        }
        return true;
    }

    /* In the course of matching a pattern, subclasses' implementations of
     * match() may set values in the dict expNames, which is a name -> value
     * mapping. The names that are set, and the meaning of their values, are
     * subclass-dependent.
     *
     * match() returns true if the pattern matches and false otherwise.
     * If true, any subclass implementation of match() must call
     * this.acceptMatch(expression, expNames) which sets
     * expNames[this.name] = expression.
     * */
    match(expression, expNames) {
        /* Base SolutionPattern class always matches any expression object */
        return this.acceptMatch(expression, expNames);
    }

    patternsMatchExpressionsAnyOrder(patterns, expressions, expNames) {
        if (patterns.length != expressions.length) {
            return false;
        }
        if (patterns.length == 0) {
            return true;
        }
        for (let patIndex = 0; patIndex < patterns.length; ++patIndex) {
            for (let expIndex = 0; expIndex < expressions.length; ++expIndex) {
                if (patterns[patIndex].match(expressions[expIndex], expNames)) {
                    /* If pattern patIndex matches expression expIndex, take
                     * them out of the lists and check the remaining lists
                     * match. If they do then we win, otherwise continue the
                     * search. */
                    let newPatterns = patterns.slice(0, patIndex).concat(patterns.slice(patIndex + 1));
                    let newExpressions = expressions.slice(0, expIndex).concat(expressions.slice(expIndex + 1));
                    if (this.patternsMatchExpressionsAnyOrder(newPatterns, newExpressions, expNames)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

class SolutionPatternAny extends SolutionPattern {
    constructor(name=null) {
        super(name);
    }
}

class SolutionPatternAtom extends SolutionPattern {
    constructor(name=null, value=null) {
        super(name);
        this.value = value;
    }

    match(expression, expNames) {
        if (expression.isAtom()) {
            if (this.value == null || expression.getValue() == this.value) {
                return this.acceptMatch(expression, expNames);
            }
        }
        return false;
    }
}

class SolutionPatternExpressionValue extends SolutionPattern {
    constructor(value, name=null) {
        super(name);
        this.value = value;
    }

    match(expression, expNames) {
        if (expression.getValue() == this.value) {
            return this.acceptMatch(expression, expNames);
        }
        else {
            return false;
        }
    }
}

class SolutionPatternAddAtoms extends SolutionPattern {
    constructor(name=null) {
        super(name);
    }

    match(expression, expNames) {
        if (expression.getOperator() == PLUS) {
            let terms = expression.getLeftExpressionList();
            for (let i = 0; i < terms.length; ++i) {
                if (!terms[i].isAtom()) {
                    return false;
                }
            }

            return this.acceptMatch(expression, expNames);
        }
        return false;
    }
}

class SolutionPatternSubtract extends SolutionPattern {
    constructor(operands, name=null) {
        super(name);
        this.operands = operands;
    }

    match(expression, expNames) {
        if (expression.getOperator() == MINUS) {
            if (this.operands.length != 2) {
                return false;
            }
            if (this.operands[0].match(expression.getAdditiveSideExpression(), expNames) &&
                this.operands[1].match(expression.getSubtractiveSideExpression(), expNames)) {
                return this.acceptMatch(expression, expNames);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}

class SolutionPatternDivide extends SolutionPattern {
    constructor(operands, name=null) {
        super(name);
        this.operands = operands;
    }

    match(expression, expNames) {
        if (expression.getOperator() == DIVIDE && this.operands.length == 2) {
            return this.operands[0].match(expression.getAdditiveSideExpression(), expNames) &&
                this.operands[1].match(expression.getSubtractiveSideExpression(), expNames);
        }
        else {
            return false;
        }
    }
}

class SolutionPatternMultiplyContains extends SolutionPattern {
    constructor(operands, name=null, remainingFactorName=null) {
        super(name);
        this.operands = operands;
        this.remainingFactorName = remainingFactorName;
    }

    match(expression, expNames) {
        let expList = [];
        let remainingFactor = expression.getValue();
        if (expression.isAtom() || expression.getOperatorType() == PLUS_MINUS) {
            expList = [expression];
        }
        else {
            if (expression.getOperator() != TIMES) {
                return false;
            }
            expList = expression.getLeftExpressionList();
        }
        for (let operandIndex = 0; operandIndex < this.operands.length; ++operandIndex) {
            let expIndexFound = -1;
            for (let expIndex = 0; expIndex < expList.length; ++expIndex) {
                if (this.operands[operandIndex].match(expList[expIndex], expNames)) {
                    expIndexFound = expIndex;
                    remainingFactor /= expList[expIndex].getValue();
                    break;
                }
            }

            /* If there's any pattern in "operands" which doesn't match a
             * pattern in "expList" then fail. */
            if (expIndexFound == -1) {
                return false;
            }
            expList = expList.slice(0, expIndexFound).concat(expList.slice(expIndexFound + 1));
        }

        if (this.remainingFactorName != null) {
            expNames[this.remainingFactorName] = remainingFactor;
        }

        return this.acceptMatch(expression, expNames);
    }
}

class SolutionPatternAddOrMultiply extends SolutionPattern {
    constructor(operands, name=null) {
        super(name);
        this.operands = operands;
        this.desiredOp = [ PLUS, TIMES ];
    }

    match(expression, expNames) {
        let found = false;
        for (let i = 0; i < this.desiredOp.length; ++i) {
            if (this.desiredOp[i] == expression.getOperator()) {
                found = true;
                break;
            }
        }
        if (found) {
            /* Operator is correct */
            if (this.operands == null) {
                return this.acceptMatch(expression, expNames);
            }
            else {
                let ret = this.patternsMatchExpressionsAnyOrder(this.operands,
                        expression.getLeftExpressionList(), expNames);
                if (ret) {
                    return this.acceptMatch(expression, expNames);
                }
                return ret;
            }
        }
        else {
            return false;
        }
    }
}

class SolutionPatternAdd extends SolutionPatternAddOrMultiply {
    constructor(operands, name=null) {
        super(operands, name);
        this.desiredOp = [ PLUS ];
    }
}

class SolutionPatternMultiply extends SolutionPatternAddOrMultiply {
    constructor(operands, name=null) {
        super(operands, name);
        this.desiredOp = [ TIMES ];
    }
}

class SolutionPatternAddOrSubtract extends SolutionPattern {
    constructor(operands, name=null) {
        super(name);
        this.operands = operands;
    }

    match(expression, expNames) {
        if (expression.getOperator() == PLUS) {
            if (this.operands == null) {
                return this.acceptMatch(expression, expNames);
            }
            else {
                if (this.patternsMatchExpressionsAnyOrder(this.operands,
                        expression.getLeftExpressionList(), expNames)) {
                    return this.acceptMatch(expression, expNames);
                }
                else {
                    return false;
                }
            }
        }
        else if (expression.getOperator() == MINUS) {
            if (this.operands == null) {
                return this.acceptMatch(expression, expNames);
            }
            else if (this.operands.length != 2) {
                return false;
            }
            else {
                if (this.operands[0].match(expression.getAdditiveSideExpression(), expNames) &&
                    this.operands[1].match(expression.getSubtractiveSideExpression(), expNames)) {
                    return this.acceptMatch(expression, expNames);
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }
}

class SolutionPatternIsOrDirectlyContains extends SolutionPattern {
    /* If the expression given to match() equals subPattern, then
     * expNames[name] = expression, and expNames[topLevelOpName] and
     * expNames[topLevelTwiddlerName] are not set.
     * If the expression given to match() is, say, subPattern + x, then
     * expNames[name] = expression, expNames[topLevelOpName] = "+", and
     * expNames[topLevelTwiddlerName] = x.getValue().
     */
    constructor(subPattern, name=null, topLevelOpName=null, topLevelTwiddlerName=null) {
        super(name);
        this.subPattern = subPattern;
        this.topLevelOpName = topLevelOpName;
        this.topLevelTwiddlerName = topLevelTwiddlerName;
    }

    match(expression, expNames) {
        if (this.subPattern.match(expression, expNames)) {
            if (this.topLevelOpName != null)
                expNames[this.topLevelOpName] = null;
            if (this.topLevelTwiddlerName != null)
                expNames[this.topLevelTwiddlerName] = null;
            return this.acceptMatch(expression, expNames);
        }
        else if (!expression.isAtom() && expression.getOperatorType() == PLUS_MINUS) {
            var containedExps = expression.getLeftExpressionList();
            for (let i = 0; i < containedExps.length; ++i) {
                if (this.subPattern.match(containedExps[i], expNames)) {
                    let twiddler;
                    let twiddlerOp;
                    twiddler = Math.abs(expression.getValue() - containedExps[i].getValue());
                    if (containedExps[i].getValue() > expression.getValue()) {
                        twiddlerOp = "-";
                    }
                    else {
                        twiddlerOp = "+";
                    }
                    if (this.topLevelOpName != null) {
                        expNames[this.topLevelOpName] = twiddlerOp;
                    }
                    if (this.topLevelTwiddlerName != null) {
                        expNames[this.topLevelTwiddlerName] = twiddler;
                    }
                    return this.acceptMatch(expression, expNames);
                }
            }
        }
        return false;
    }
}

class SolutionPatternOr extends SolutionPattern {
    constructor(alternatives, name=null) {
        super(name);
        this.alternatives = alternatives;
    }

    match(expression, expNames) {
        for (let i = 0; i < this.alternatives.length; ++i) {
            if (this.alternatives[i].match(expression, expNames)) {
                return this.acceptMatch(expression, expNames);
            }
        }
        return false;
    }
}

class SolutionPatternBigPlusOrMinusLittle extends SolutionPattern {
    constructor(name=null) {
        super(name);
    }

    match(expression, expNames) {
        if (expression.getOperatorType() == PLUS_MINUS) {
            let total = expression.getValue();
            let exps = expression.getLeftExpressionList().concat(expression.getRightExpressionList());
            let highestExp = null;

            for (let i = 0; i < exps.length; ++i) {
                if (highestExp == null || exps[i].getValue() > highestExp.getValue()) {
                    highestExp = exps[i];
                }
            }

            /* If one term in the plus-minus expression is at least half the
             * value of the expression, it matches this pattern. */
            if (highestExp.getValue() >= total / 2) {
                expNames["bpml_big_exp"] = highestExp;
                expNames["bpml_delta_op"] = (highestExp.getValue() <= total ? "+" : "-");
                expNames["bpml_delta"] = Math.abs(total - highestExp.getValue());
                return this.acceptMatch(expression, expNames);
            }
        }

        return false;
    }
}

class SolutionPatternValuePlusOrMinus extends SolutionPattern {
    constructor(value, name=null, opName=null, deltaName=null) {
        super(name);
        this.deltaName = deltaName;
        this.opName = opName;
        this.value = value;
    }

    match(expression, expNames) {
        if (expression.getValue() == this.value) {
            /* If this expression equals our sought value, it's a match. */
            if (this.deltaName != null) {
                expNames[this.deltaName] = null;
            }
            if (this.opName != null) {
                expNames[this.opName] = null;
            }
            return this.acceptMatch(expression, expNames);
        }
        else if (expression.getOperatorType() == PLUS_MINUS) {
            /* If one of the additive terms of this plus or minus operator is
             * equal to "value", then it's a match, and we set the op and delta
             * names accordingly. */
            let exps = expression.getLeftExpressionList();
            for (let i = 0; i < exps.length; ++i) {
                if (exps[i].getValue() == this.value) {
                    if (this.deltaName != null) {
                        expNames[this.deltaName] = Math.abs(expression.getValue() - this.value);
                    }
                    if (this.opName != null) {
                        expNames[this.opName] = (expression.getValue() >= this.value ? "+" : "-");
                    }
                    return this.acceptMatch(expression, expNames);
                }
            }
        }
        return false;
    }
}

/* Matches any expression which is the product of some expressions and where
 * one of the expressions has the specified value. */
class SolutionPatternValueTimes extends SolutionPattern {
    constructor(value, name=null, multiplierName=null) {
        super(name);
        this.value = value;
        this.multiplierName = multiplierName;
    }

    match(expression, expNames) {
        if (expression.getValue() == this.value) {
            if (this.multiplierName != null) {
                expNames[this.multiplierName] = null;
            }
            return this.acceptMatch(expression, expNames);
        }
        else if (expression.getOperatorType() == TIMES_DIVIDE) {
            let numeratorExps = expression.getLeftExpressionList();
            let denominatorExps = expression.getRightExpressionList();
            for (let i = 0; i < numeratorExps.length; ++i) {
                if (numeratorExps[i].getValue() == this.value) {
                    if (this.multiplierName != null) {
                        expNames[this.multiplierName] = expression.getValue() / this.value;
                    }
                    return this.acceptMatch(expression, expNames);
                }
            }
        }

        return false;
    }
}

let pattern203 =
    new SolutionPatternDivide([
            new SolutionPatternMultiplyContains([
                new SolutionPatternAddOrSubtract([
                    new SolutionPatternMultiply([
                        new SolutionPatternValuePlusOrMinus(100, null, "hundred_op", "hundred_delta"),
                        new SolutionPatternValuePlusOrMinus(50, null, "fifty_op", "fifty_delta")
                    ]),
                    new SolutionPatternValueTimes(75, null, "seventy_five_multiplier")
                ], "basenumberop")
            ], null, "remainingnumerator"),
            new SolutionPatternMultiplyContains([
                new SolutionPatternExpressionValue(25)
            ], null, "remainingdenominator")
    ]);

let pattern302 =
    new SolutionPatternDivide([
            new SolutionPatternMultiplyContains([
                new SolutionPatternAddOrSubtract([
                    new SolutionPatternMultiply([
                        new SolutionPatternValuePlusOrMinus(100, null, "hundred_op", "hundred_delta"),
                        new SolutionPatternValuePlusOrMinus(75, null, "seventy_five_op", "seventy_five_delta")
                    ]),
                    new SolutionPatternValueTimes(50, null, "fifty_multiplier")
                ], "basenumberop")
            ], null, "remainingnumerator"),
            new SolutionPatternMultiplyContains([
                new SolutionPatternExpressionValue(25)
            ], null, "remainingdenominator")
    ]);

let pattern93750_25 =
    new SolutionPatternDivide([
            new SolutionPatternMultiplyContains([
                new SolutionPatternValuePlusOrMinus(3750, null, "twenty_five_op", "twenty_five_multiplier"),
                new SolutionPatternExpressionValue(25)
            ], null, "remainingnumerator"),
            new SolutionPatternMultiplyContains([
                new SolutionPatternExpressionValue(100)
            ], null, "remainingdenominator")
    ]);

let pattern93750_50 =
    new SolutionPatternDivide([
            new SolutionPatternMultiplyContains([
                new SolutionPatternValuePlusOrMinus(1875, null, "fifty_op", "fifty_multiplier"),
                new SolutionPatternExpressionValue(50)
            ], null, "remainingnumerator"),
            new SolutionPatternMultiplyContains([
                new SolutionPatternExpressionValue(100)
            ], null, "remainingdenominator")
    ]);

let pattern93750_75 =
    new SolutionPatternDivide([
            new SolutionPatternMultiplyContains([
                new SolutionPatternValuePlusOrMinus(1250, null, "seventy_five_op", "seventy_five_multiplier"),
                new SolutionPatternExpressionValue(75)
            ], null, "remainingnumerator"),
            new SolutionPatternMultiplyContains([
                new SolutionPatternExpressionValue(100)
            ], null, "remainingdenominator")
    ]);

function patternTrickDynamicName(ns, baseNumber, additionalMultiplierName,
        additionalMultiplierEffect, firstDeltaName, firstDeltaEffect,
        secondDeltaName, secondDeltaEffect) {
    let dn = "4L(" + baseNumber.toString();
    dn += (ns["basenumberop"].getOperator() == PLUS) ? " + " : " - ";
    if (ns[additionalMultiplierName]) {
        dn += ns[additionalMultiplierName].toString() + "*" + additionalMultiplierEffect.toString();
    }
    else {
        dn += additionalMultiplierEffect.toString();
    }

    let firstDeltaOpName = firstDeltaName + "_op";
    let firstDeltaDeltaName = firstDeltaName + "_delta";
    let secondDeltaOpName = secondDeltaName + "_op";
    let secondDeltaDeltaName = secondDeltaName + "_delta";
    if (ns[firstDeltaOpName] && ns[secondDeltaOpName]) {
        dn += " + craziness";
    }
    else if (ns[firstDeltaOpName]) {
        dn += " " + ns[firstDeltaOpName] + " " + ns[firstDeltaDeltaName] + "*" + firstDeltaEffect.toString();
    }
    else if (ns[secondDeltaOpName]) {
        dn += " " + ns[secondDeltaOpName] + " " + ns[secondDeltaDeltaName] + "*" + secondDeltaEffect.toString();
    }
    dn += ")";
    return dn;
}

function pattern203DynamicName(ns) {
    return patternTrickDynamicName(ns, 200, "seventy_five_multiplier", 3,
            "hundred", 2, "fifty", 4);
}

function pattern302DynamicName(ns) {
    return patternTrickDynamicName(ns, 300, "fifty_multiplier", 2,
            "hundred", 3, "seventy_five", 4);
}

function pattern93750DynamicName(ns) {
    let deltaLarge = null;
    let largesWords = [ "twenty_five", "fifty", "seventy_five" ];
    let largesEffects = [ 0.25, 0.5, 0.75 ];
    let deltaEffect = null;

    for (let i = 0; i < largesWords.length; ++i) {
        if (ns[largesWords[i] + "_op"]) {
            deltaLarge = largesWords[i];
            deltaEffect = largesEffects[i];
            break;
        }
    }

    if (deltaLarge) {
        let dn = "4L(937.5 ";
        dn += ns[deltaLarge + "_op"];
        dn += ns[deltaLarge + "_multiplier"] * deltaEffect;
        dn += ")";
        return dn;
    }
    else {
        return "4L(937.5+...?)"
    }
}

function addTwiddlerToName(ns, name) {
    let multiplier = 1;
    if (ns["remainingnumerator"]) {
        multiplier *= ns["remainingnumerator"];
    }
    if (ns["remainingdenominator"]) {
        multiplier /= ns["remainingdenominator"];
    }
    if (multiplier < 1) {
        name += " / " + (1.0 / multiplier).toString();
    }
    if (multiplier > 1) {
        name += " * " + multiplier.toString();
    }

    if (ns["toplevelop"]) {
        let op = ns["toplevelop"];
        if (op == "*" || op == "/") {
            name = "(" + name + ")";
        }
        name += " " + op + " " + ns["topleveltwiddler"].toString();
    }
    return name;
}

function toLessShowboatySummaryString(numExp, denExp) {
    /* Express numExp / denExp in the form a / b or a * b, making b
     * as small as we can, with a being one of the numerator factors or the
     * product of a subset of the numerator factors. */
    let numList = numExp.getLeftExpressionList();
    let denList = denExp.getLeftExpressionList();
    let numValue = numExp.getValue();
    let denValue = denExp.getValue();
    let bestOtherValue = null;

    /* Smallest difference we've found between a and b in an expression
     * a*b or a/b. We try to find the a,b pair with the smallest difference,
     * where a > b. */
    let smallestDiff = null;
    let bestString = numValue.toString() + " / " + denValue.toString();

    for (let bitmask = 1; bitmask < (1 << numList.length); ++bitmask) {
        let candidateNumerator = 1;
        for (let i = 0; i < numList.length; ++i) {
            if ((bitmask & (1 << i)) != 0) {
                candidateNumerator *= numList[i].getValue();
            }
        }
        let remainingNumerator = numValue / candidateNumerator;
        if (remainingNumerator % denValue == 0) {
            let candidateOther = remainingNumerator / denValue;
            let candDiff = candidateNumerator - candidateOther;
            if (candDiff >= 0 && (smallestDiff == null || candDiff < smallestDiff)) {
                smallestDiff = candDiff;
                bestString = candidateNumerator.toString() + " * " + candidateOther.toString();
            }
        }
        else if (denValue % remainingNumerator == 0) {
            let candidateOther = denValue / remainingNumerator;
            let candDiff = candidateNumerator - candidateOther;
            if (smallestDiff == null || candDiff < smallestDiff) {
                smallestDiff = candDiff;
                bestString = candidateNumerator.toString() + " / " + candidateOther.toString();
            }
        }
    }

    return bestString;
}

let categories937 = [];
let patterns937 = [ pattern93750_25, pattern93750_50, pattern93750_75 ];
for (let i = 0; i < patterns937.length; ++i) {
    categories937.push(
            {
                "name" : "937.5 trick",
                "pattern" : new SolutionPatternIsOrDirectlyContains(patterns937[i], null, "toplevelop", "topleveltwiddler"),
                "dynamicName" : function(ns) {
                    let dn = pattern93750DynamicName(ns);
                    dn = addTwiddlerToName(ns, dn);
                    return dn;
                }
            }
    );
}

let solutionCategories = [
    {
        "name" : "197/203 trick",
        "pattern" : new SolutionPatternIsOrDirectlyContains(pattern203, null, "toplevelop", "topleveltwiddler"),
        "dynamicName" : function(ns) {
            let dn = pattern203DynamicName(ns);
            dn = addTwiddlerToName(ns, dn);
            return dn;
        }
    },
    {
        "name" : "298/302 trick",
        "pattern" : new SolutionPatternIsOrDirectlyContains(pattern302, null, "toplevelop", "topleveltwiddler"),
        "dynamicName" : function(ns) {
            let dn = pattern302DynamicName(ns);
            dn = addTwiddlerToName(ns, dn);
            return dn;
        }
    },
    categories937[0],
    categories937[1],
    categories937[2],
    {
        "name" : "product",
        "dynamicName" : function(ns) {
            let product = ns["product"];
            let factors = product.getLeftExpressionList();
            let left = 1;
            let right = 1;

            /* This expression is the product of an array of expressions
             * [ e1, e2, e3, ..., en ], and we want to express it in the
             * form lhs * rhs.
             * We'll split the list in two at the leftmost point for which the
             * product of all the expressions on the left is greater than
             * or equal to the square root of the whole expression's value.
             *
             * For example, in the expression 9 * 4 * 3 * 2, 9*4 is greater
             * than sqrt(9*4*3*2) so it's 36 * 6. In the expression
             * 25 * 4 * 3 * 2, 25 is greater than sqrt(25 * 4 * 3 * 2) so it's
             * 25 * 24.
             */
            for (let i = 0; i < factors.length; ++i) {
                if (left * left >= product.getValue()) {
                    right *= factors[i].getValue();
                }
                else {
                    left *= factors[i].getValue();
                }
            }
            let dn = left.toString() + " * " + right.toString();
            dn = addTwiddlerToName(ns, dn);
            return dn;
        },
        "pattern" :
            new SolutionPatternIsOrDirectlyContains(
                    new SolutionPatternMultiply(null, "product"),
                    null, "toplevelop", "topleveltwiddler"
            )
    },
    {
        "name" : "division",
        "pattern" :
            new SolutionPatternDivide([
                    new SolutionPatternAny("numerator"),
                    new SolutionPatternAny("denominator")
                ], "quotient"),
        "dynamicName" : function(ns) {
            return toLessShowboatySummaryString(ns["numerator"], ns["denominator"]);
        }
    },
    {
        "name" : "division plus/minus",
        "pattern" :
            new SolutionPatternAddOrSubtract([
                    new SolutionPatternDivide([
                        new SolutionPatternAny("numerator"),
                        new SolutionPatternAny("denominator")
                    ], "quotient"),
                    new SolutionPatternAny("addendum")
                ], "op"
            ),
        "condition" : function(ns) {
            let quotient = ns["numerator"].getValue() / ns["denominator"].getValue();
            return quotient > ns["addendum"].getValue();
        },
        "dynamicName" : function(ns) {
            return toLessShowboatySummaryString(ns["numerator"], ns["denominator"]) +
                " " + ns["op"].getOperatorString() + " " +
                ns["addendum"].getValue().toString();
        }
    },
    {
        "name" : "add them all together",
        "dynamicName" : function(ns) {
            return "Add them all together";
        },
        "pattern" : new SolutionPatternAddAtoms("node"),
        "condition" : function(ns) {
            let node = ns["node"];
            return node.getCountNumbersUsed() == ns["numStartingNumbers"];
        }
    },
    {
        "name" : "sum of subset",
        "dynamicName" : function(ns) {
            return "Sum of subset";
        },
        "pattern" : new SolutionPatternAddAtoms()
    },
    {
        "name" : "big plus or minus little",
        "dynamicName" : function(ns) {
            return ns["bpml_big_exp"].getValue().toString() + " " +
                ns["bpml_delta_op"] + " " + ns["bpml_delta"];
        },
        "pattern" : new SolutionPatternBigPlusOrMinusLittle()
    },
    {
        "name" : "other addition/subtraction",
        "dynamicName" : function(ns) {
            let exp = ns["addnode"];
            let totalValue = exp.getValue();
            let valueSoFar = 0;
            let terms = exp.getLeftExpressionList();
            /* Put as many terms as we can into the LHS until that equals
             * at least half the total. */
            for (let i = 0; i < terms.length; ++i) {
                valueSoFar += terms[i].getValue();
                if (valueSoFar >= totalValue / 2) {
                    return valueSoFar.toString() + " + " + (totalValue - valueSoFar).toString();
                }
            }

            /* Erm? */
            return valueSoFar.toString() + "-" + Math.abs(totalValue - valueSoFar).toString();
        },
        "pattern" : new SolutionPatternAddOrSubtract(null, "addnode")
    },
    {
        "name" : "ready-made target",
        "dynamicName" : function(ns) {
            return "Not even trying";
        },
        "pattern" : new SolutionPatternAtom()
    }
];

function getCategoryName(expression, numStartingNumbers=6) {
    for (let catIndex = 0; catIndex < solutionCategories.length; ++catIndex) {
        let ns = {
            "numStartingNumbers" : numStartingNumbers
        };
        let cat = solutionCategories[catIndex];
        let conditionFunction;
        let dynamicNameFunction;
        let pattern;
        if (!("condition" in cat)) {
            conditionFunction = function(ns) { return true; };
        }
        else {
            conditionFunction = cat["condition"];
        }
        if (!("dynamicName" in cat)) {
            dynamicNameFunction = function(ns) { return cat["name"]; };
        }
        else {
            dynamicNameFunction = cat["dynamicName"];
        }
        pattern = cat["pattern"];

        if (pattern.match(expression, ns) && conditionFunction(ns)) {
            return dynamicNameFunction(ns);
        }
    }
    return "?";
}

