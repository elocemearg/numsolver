const testCases = [
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            25,
            100,
            8,
            2
        ],
        "solution": "(75 + 100 / 25) * (8 + 2)",
        "target": 790
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            7,
            10,
            5,
            7,
            3,
            8
        ],
        "solution": "(7 + 7) * 10 * 5 - 3",
        "target": 697
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            1,
            7,
            10,
            3,
            2,
            4
        ],
        "solution": "((10 - 1) * 7 * 3 + 2) * 4",
        "target": 764
    },
    {
        "countNumbersUsed": 5,
        "numAway": 1,
        "selection": [
            75,
            25,
            50,
            9,
            6,
            5
        ],
        "solution": "(75 - 5) * 9 + 6 - 50",
        "target": 587
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            100,
            50,
            75,
            1,
            4
        ],
        "solution": "(100 + 75) * (4 + 1)",
        "target": 875
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            100,
            8,
            1
        ],
        "solution": "100 + 75 / 25",
        "target": 103
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            25,
            100,
            3,
            10,
            5,
            7
        ],
        "solution": "100 * 10 - 7",
        "target": 993
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            5,
            4,
            5,
            10
        ],
        "solution": "(75 - 10 / 5) * 4 - 5",
        "target": 287
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            100,
            9,
            10
        ],
        "solution": "100 * 9 + 75",
        "target": 975
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            25,
            75,
            4,
            6,
            10
        ],
        "solution": "(75 + 6) * 4 - 25",
        "target": 299
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            25,
            7,
            4
        ],
        "solution": "50 * 7 - 100 / (75 - 25)",
        "target": 348
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            2,
            10,
            6
        ],
        "solution": "(50 - 10) * 25 - 75",
        "target": 925
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            3,
            9,
            7
        ],
        "solution": "(75 + 100 / 25) * 7 - 9",
        "target": 544
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            1,
            9,
            5,
            3,
            2
        ],
        "solution": "(100 + 3) * (9 - 2) + 1 - 5",
        "target": 717
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            9,
            6,
            4
        ],
        "solution": "75 + 50 - (9 + 4)",
        "target": 112
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            100,
            10,
            7,
            5,
            5
        ],
        "solution": "(75 + 7) * (10 + 5 / 5)",
        "target": 902
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            3,
            7,
            6,
            1
        ],
        "solution": "(75 + 25) * 3 - 7",
        "target": 293
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            7,
            9,
            4,
            3,
            8
        ],
        "solution": "25 * (7 + 4) - 9",
        "target": 266
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            50,
            25,
            10,
            7,
            1
        ],
        "solution": "(100 - 25) * 7 + 1 - 10",
        "target": 516
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            100,
            10,
            5,
            9,
            8,
            7
        ],
        "solution": "100 * 7 - 9",
        "target": 691
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            25,
            100,
            50,
            4,
            3
        ],
        "solution": "((100 + 4 * 3) * 75) / 25",
        "target": 336
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            50,
            100,
            7,
            6,
            2
        ],
        "solution": "(75 - 7) * 6 - 2",
        "target": 406
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            100,
            2,
            8,
            3,
            9
        ],
        "solution": "100 * 8 + 2 - 3",
        "target": 799
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            5,
            1,
            9,
            9,
            8,
            3
        ],
        "solution": "(9 * 3 + 5) * 8",
        "target": 256
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            25,
            50,
            4,
            2,
            3,
            7
        ],
        "solution": "50 * 4 + 2",
        "target": 202
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            25,
            5,
            7,
            6,
            7
        ],
        "solution": "(50 - (6 + 5)) * 25",
        "target": 975
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            75,
            50,
            25,
            9,
            8
        ],
        "solution": "(50 + 8) * 9 - (100 + 75) / 25",
        "target": 515
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            10,
            2,
            8,
            2,
            8,
            4
        ],
        "solution": "((10 - 2) * 8 + 2) * 8 - 4",
        "target": 525
    },
    {
        "countNumbersUsed": 4,
        "numAway": 1,
        "selection": [
            100,
            75,
            50,
            25,
            5,
            8
        ],
        "solution": "(75 + 50 - 5) * 8",
        "target": 961
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            3,
            9,
            2,
            9,
            1
        ],
        "solution": "(100 - 9) * 9 + 1",
        "target": 820
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            6,
            8,
            9,
            1,
            10,
            4
        ],
        "solution": "((10 + 9) * 6 + 1) * 8",
        "target": 920
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            4,
            2,
            5
        ],
        "solution": "(50 * 25 - 4) / 2 - 75",
        "target": 548
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            7,
            3,
            5,
            8,
            10
        ],
        "solution": "50 * 8 + 5 + 3",
        "target": 408
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            50,
            10,
            7,
            1,
            9
        ],
        "solution": "(75 - 1) * 10 + 50",
        "target": 790
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            100,
            50,
            7,
            5,
            10
        ],
        "solution": "(50 + 7) * 5 + 10 - 100 / 25",
        "target": 291
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            75,
            100,
            50,
            5,
            4
        ],
        "solution": "((100 * 5 - (75 + 4)) * 50) / 25",
        "target": 842
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            5,
            2,
            6,
            3,
            1,
            7
        ],
        "solution": "((5 * 3 - 2) * 6 + 1) * 7",
        "target": 554
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            100,
            4,
            7,
            1,
            1,
            2
        ],
        "solution": "(100 + 7 + 4) * (1 + 1) * 2",
        "target": 445
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            6,
            2,
            8,
            8,
            3,
            3
        ],
        "solution": "(8 * 6 + 3) * 8 * 2 - 3",
        "target": 812
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            75,
            100,
            25,
            1,
            10,
            9
        ],
        "solution": "(75 + 100 / 10 - 25) * 9 - 1",
        "target": 538
    },
    {
        "countNumbersUsed": 6,
        "numAway": 5,
        "selection": [
            1,
            5,
            2,
            4,
            9,
            2
        ],
        "solution": "(5 * (2 + 1) + 2) * 9 * 4",
        "target": 607
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            10,
            5,
            6,
            9,
            6
        ],
        "solution": "(100 + 10 - 6) * 5",
        "target": 520
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            75,
            50,
            100,
            9,
            9
        ],
        "solution": "((100 + 75) * (50 + 9)) / 25 - 9",
        "target": 404
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            75,
            50,
            1,
            3,
            8
        ],
        "solution": "(75 + 25) * 3 + 8 - 1",
        "target": 307
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            75,
            100,
            25,
            2,
            5,
            2
        ],
        "solution": "(75 - 5) * (100 / 25 + 2) - 2",
        "target": 419
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            100,
            4,
            9,
            3
        ],
        "solution": "((75 * 4 + 3) * 100) / 50",
        "target": 606
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            9,
            10,
            1,
            2,
            7,
            10
        ],
        "solution": "(10 + 10 / 2) * 9 * 7",
        "target": 945
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            5,
            1,
            10,
            4,
            9,
            1
        ],
        "solution": "10 * 9 * 4 * (1 + 1) + 5",
        "target": 725
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            25,
            50,
            1,
            8,
            3,
            9
        ],
        "solution": "50 * (25 - 9)",
        "target": 800
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            100,
            9,
            3,
            10,
            2
        ],
        "solution": "100 * 9 - 75 / 3",
        "target": 875
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            75,
            25,
            50,
            5,
            4,
            1
        ],
        "solution": "((75 + 25) * (50 - 4)) / 5 - 1",
        "target": 918
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            7,
            9,
            6,
            6,
            5
        ],
        "solution": "(6 * 6 - 9) * (25 - 7)",
        "target": 486
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            1,
            6,
            4,
            5,
            3
        ],
        "solution": "(25 * 4 - 1) * 6",
        "target": 594
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            75,
            50,
            5,
            6
        ],
        "solution": "100 + 75 + 5 - 50 / 25",
        "target": 178
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            10,
            3,
            1,
            8,
            6,
            9
        ],
        "solution": "(8 * 3 - 1) * 9 * (10 - 6)",
        "target": 828
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            100,
            9,
            7
        ],
        "solution": "(100 * (75 - 9)) / 25 + 50",
        "target": 314
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            100,
            2,
            4
        ],
        "solution": "100 + ((50 - 2) * 25) / 75",
        "target": 116
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            25,
            50,
            5,
            2,
            9
        ],
        "solution": "75 + 25 + 5 + 2",
        "target": 107
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            10,
            8,
            7
        ],
        "solution": "(100 - 7) * 8 - 10",
        "target": 734
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            25,
            10,
            9,
            8,
            6
        ],
        "solution": "(100 + 8 - 25) * 10",
        "target": 830
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            2,
            6,
            1,
            10,
            1
        ],
        "solution": "(75 - 6) * (10 + 1)",
        "target": 759
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            50,
            75,
            1,
            4,
            8
        ],
        "solution": "(100 * (75 + 1 - 50) + 8) / 4",
        "target": 652
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            25,
            100,
            10,
            1,
            4
        ],
        "solution": "25 * 10 + 75 + 1 - (100 + 4)",
        "target": 222
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            75,
            50,
            25,
            6,
            4
        ],
        "solution": "(100 + 75 / 25) * 6 + 50",
        "target": 668
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            25,
            100,
            75,
            5,
            3
        ],
        "solution": "(75 + 100 / 25) * 3",
        "target": 237
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            75,
            1,
            3,
            1,
            2
        ],
        "solution": "(50 + 3) * 2 + 1",
        "target": 107
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            25,
            10,
            6
        ],
        "solution": "50 * 10 - (75 * 6 + 100) / 25",
        "target": 478
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            50,
            25,
            100,
            3,
            6
        ],
        "solution": "(75 + 3) * 6 + 25 - 100 / 50",
        "target": 491
    },
    {
        "countNumbersUsed": 6,
        "numAway": 2,
        "selection": [
            50,
            100,
            75,
            25,
            1,
            2
        ],
        "solution": "((100 + 75) * (50 - 1) * 2) / 25",
        "target": 684
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            10,
            6,
            9,
            8,
            5
        ],
        "solution": "(75 + 8) * (9 - 6)",
        "target": 249
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            3,
            8,
            6,
            4,
            5,
            1
        ],
        "solution": "(5 * 4 - 1) * 8 * 6 - 3",
        "target": 908
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            2,
            7,
            9,
            8,
            10
        ],
        "solution": "(50 + 7 * 2) * 9 + 10",
        "target": 586
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            5,
            3,
            4,
            2,
            7,
            5
        ],
        "solution": "(7 * 3 * 2 - 5) * 5 * 4",
        "target": 741
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            4,
            2,
            8,
            2,
            10,
            6
        ],
        "solution": "((10 + 4) * (6 + 2) + 2) * 8",
        "target": 913
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            1,
            10,
            5,
            7,
            4,
            8
        ],
        "solution": "(8 * 5 + 4) * 10 - 1",
        "target": 439
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            50,
            1,
            7,
            3,
            8
        ],
        "solution": "(50 + 25) * 8 - 1",
        "target": 599
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            1,
            3,
            5,
            6,
            4
        ],
        "solution": "25 * 4 * 3 - 6",
        "target": 294
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            25,
            50,
            10,
            6,
            10
        ],
        "solution": "100 * 10 + (25 * 6) / 50 - 10",
        "target": 993
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            8,
            5,
            2
        ],
        "solution": "(75 - 2) * 8 - 50",
        "target": 534
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            3,
            4,
            8,
            2,
            7
        ],
        "solution": "(50 - 3) * (7 + 4 + 2)",
        "target": 611
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            8,
            6,
            2,
            2,
            3
        ],
        "solution": "(50 + 8) * (6 - 2) - 2",
        "target": 230
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            25,
            9,
            2,
            8
        ],
        "solution": "(25 * 8 - 9) * 2",
        "target": 382
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            50,
            1,
            8,
            3,
            1
        ],
        "solution": "100 * (8 - 1) - 1",
        "target": 699
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            5,
            3,
            7,
            10,
            6
        ],
        "solution": "(100 + 10) * 5 + 7",
        "target": 557
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            4,
            7,
            2,
            6,
            7,
            2
        ],
        "solution": "((7 + 2) * 7 - 4) * (6 + 2)",
        "target": 472
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            5,
            3,
            8,
            10,
            4
        ],
        "solution": "75 * 10 + 8 * 4 * 3",
        "target": 846
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            25,
            75,
            100,
            1,
            8
        ],
        "solution": "(100 - 50 / 25) * 8 + 75",
        "target": 859
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            100,
            50,
            4,
            10
        ],
        "solution": "100 + 75 + 50 + 10",
        "target": 235
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            25,
            5,
            2,
            3
        ],
        "solution": "(50 * 25 + 3 - 75) / 2",
        "target": 589
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            50,
            7,
            3,
            8,
            4
        ],
        "solution": "75 * 8 + 7 + 4",
        "target": 611
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            75,
            8,
            10,
            4
        ],
        "solution": "(100 * 25 - 4) / 8 + 75",
        "target": 387
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            25,
            50,
            10,
            6,
            8
        ],
        "solution": "75 * 8 + 6 - (50 + 25 + 10)",
        "target": 521
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            10,
            1,
            2
        ],
        "solution": "((100 + 1 - 10) * 75 * 2) / 25",
        "target": 546
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            8,
            4,
            10,
            1,
            7,
            5
        ],
        "solution": "(8 * 7 + 10) * 4",
        "target": 264
    },
    {
        "countNumbersUsed": 6,
        "numAway": 2,
        "selection": [
            4,
            8,
            3,
            9,
            2,
            8
        ],
        "solution": "((8 + 2) * 9 - 4) * (8 + 3)",
        "target": 948
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            25,
            75,
            6,
            4
        ],
        "solution": "(100 + 75) * 4 - 6",
        "target": 694
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            3,
            7,
            9,
            1,
            5
        ],
        "solution": "(7 * 5 + 3) * 25 + 9 - 1",
        "target": 958
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            100,
            9,
            2,
            3,
            4
        ],
        "solution": "(100 + 9) * 4 + 75 / 3",
        "target": 461
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            6,
            1,
            9
        ],
        "solution": "25 * 6 + 50 - 1",
        "target": 199
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            9,
            6,
            10,
            3
        ],
        "solution": "(50 - 10) * 9 + 3",
        "target": 363
    }
];
