const testCases = [
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            2,
            9,
            4,
            6,
            1
        ],
        "solution": "50 * 6 - (9 + 1)",
        "target": 290
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            100,
            3,
            7,
            6
        ],
        "solution": "(75 + 6) * 3 - 100 / 50",
        "target": 241
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            4,
            2,
            9,
            3,
            9,
            7
        ],
        "solution": "(9 * 4 - 2) * 3",
        "target": 102
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            8,
            3,
            7,
            4,
            9,
            10
        ],
        "solution": "((8 + 3) * 10 + 4) * 7",
        "target": 798
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            100,
            8,
            8,
            6
        ],
        "solution": "(25 - 8) * 8 + 100",
        "target": 236
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            5,
            4,
            6,
            5
        ],
        "solution": "50 * 5 + (25 + 4) * 6",
        "target": 424
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            2,
            8,
            6,
            4,
            8,
            7
        ],
        "solution": "(8 * 6 - 2) * (8 + 4) + 7",
        "target": 559
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            8,
            1,
            3,
            7
        ],
        "solution": "(100 + 7) * (8 - 3)",
        "target": 535
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            3,
            4,
            10,
            6,
            8,
            6
        ],
        "solution": "10 * (6 + 3) * 6",
        "target": 540
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            50,
            5,
            1,
            10
        ],
        "solution": "(100 - 10) * 5 - 50 / 25",
        "target": 448
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            9,
            7,
            6,
            7,
            3,
            6
        ],
        "solution": "(7 * 7 + 6 + 6) * 9",
        "target": 549
    },
    {
        "countNumbersUsed": 2,
        "numAway": 0,
        "selection": [
            50,
            100,
            3,
            7,
            4,
            10
        ],
        "solution": "50 * 4",
        "target": 200
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            8,
            6,
            9
        ],
        "solution": "(75 - 8) * (9 + 6) - 25",
        "target": 980
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            50,
            4,
            7
        ],
        "solution": "75 * 7 + 100 / 50 - 25",
        "target": 502
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            25,
            8,
            1,
            9,
            7
        ],
        "solution": "(25 + 7) * (9 * 8 + 1 - 50)",
        "target": 736
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            50,
            75,
            100,
            4,
            6,
            6
        ],
        "solution": "((75 + 6) * 50) / 6 + 100 + 4",
        "target": 778
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            9,
            7,
            5,
            6,
            1,
            4
        ],
        "solution": "(7 * 5 + 1) * 9",
        "target": 324
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            100,
            25,
            50,
            75,
            1,
            1
        ],
        "solution": "(((50 - 1) * 25 - 1) * 75) / 100",
        "target": 917
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            5,
            8,
            3,
            9,
            10
        ],
        "solution": "(75 + 5) * 9 + 8 + 3",
        "target": 731
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            25,
            6,
            1
        ],
        "solution": "(75 + 50 + 6) * (100 / 25 + 1)",
        "target": 655
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            3,
            5,
            8,
            4,
            1,
            3
        ],
        "solution": "(8 * (4 + 3) * 3 + 1) * 5",
        "target": 845
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            75,
            2,
            7,
            3,
            5
        ],
        "solution": "75 * 5 * 2 + 50 - 7",
        "target": 793
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            100,
            7,
            4,
            2
        ],
        "solution": "(50 * 7 + 75) * 2 + 4",
        "target": 854
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            50,
            25,
            100,
            2,
            5
        ],
        "solution": "(75 - 2) * 5 - (100 + 50) / 25",
        "target": 359
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            100,
            4,
            6
        ],
        "solution": "75 * 4 - ((100 + 50) * 6) / 25",
        "target": 264
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            7,
            1,
            3,
            9,
            2,
            5
        ],
        "solution": "9 * 7 * 5 * 3 + 2",
        "target": 947
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            25,
            100,
            7,
            8
        ],
        "solution": "(50 + 8) * (7 + 75 / 25)",
        "target": 580
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            100,
            50,
            75,
            25,
            8,
            2
        ],
        "solution": "50 * 8 + 2",
        "target": 402
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            5,
            7,
            2,
            5,
            9
        ],
        "solution": "(25 + 2) * 5 * 5 - 7",
        "target": 668
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            4,
            5,
            9,
            8,
            5,
            4
        ],
        "solution": "(5 * 4 + 8) * 9 - 5",
        "target": 247
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            75,
            2,
            6,
            1
        ],
        "solution": "(100 + 75 + 25) * 2 - 6",
        "target": 394
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            50,
            6,
            4,
            9,
            1
        ],
        "solution": "(75 - 1) * 9 + 50",
        "target": 716
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            25,
            10,
            1,
            7,
            3
        ],
        "solution": "(50 + 10 + 1) * 3",
        "target": 183
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            8,
            9,
            4
        ],
        "solution": "100 + (25 - 8) * (9 - 4)",
        "target": 185
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            25,
            75,
            100,
            8,
            7
        ],
        "solution": "(100 + 7 + 50 / 25) * 8 + 75",
        "target": 947
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            100,
            4,
            6,
            8,
            7,
            5
        ],
        "solution": "(100 - 8) * 4",
        "target": 368
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            100,
            50,
            9,
            3,
            3,
            5
        ],
        "solution": "(50 + 9) * 5",
        "target": 295
    },
    {
        "countNumbersUsed": 6,
        "numAway": 217,
        "selection": [
            1,
            3,
            9,
            1,
            5,
            2
        ],
        "solution": "9 * 5 * (3 + 1) * (2 + 1)",
        "target": 757
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
            8
        ],
        "solution": "75 * 8 + 9 - 50 / 25",
        "target": 607
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            50,
            25,
            100,
            7,
            5
        ],
        "solution": "(100 + 50 - (5 + 75 / 25)) * 7",
        "target": 994
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            25,
            75,
            100,
            7,
            4
        ],
        "solution": "(75 * (50 + 4)) / 25 + 100 - 7",
        "target": 255
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            7,
            2,
            1
        ],
        "solution": "(75 + 25) * 7 - (50 + 2 + 1)",
        "target": 647
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            9,
            5,
            2,
            2,
            4
        ],
        "solution": "(75 + 2) * 5 + 9",
        "target": 394
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            50,
            1,
            7,
            4,
            2
        ],
        "solution": "(75 + 2 - 7) * 4",
        "target": 280
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            50,
            10,
            10,
            1
        ],
        "solution": "((100 + 25) * 50 + 10) / 10",
        "target": 626
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            50,
            25,
            100,
            75,
            2,
            2
        ],
        "solution": "((100 * 50 * 2 + 75) * 2) / 25",
        "target": 805
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            1,
            5,
            2,
            7,
            9
        ],
        "solution": "(75 * 9 - 1) / 2",
        "target": 337
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            75,
            100,
            50,
            7,
            5
        ],
        "solution": "75 * (25 - (7 + 5)) + 100 / 50",
        "target": 977
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            10,
            7,
            4,
            6,
            3
        ],
        "solution": "(50 - 3) * 7 + 4",
        "target": 333
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            1,
            10,
            7,
            4,
            10
        ],
        "solution": "(50 + 4) * (7 + 1) + 10",
        "target": 442
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            100,
            25,
            2,
            3,
            1
        ],
        "solution": "(75 * 25 + 100 - 3) / 2",
        "target": 986
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            2,
            1,
            7
        ],
        "solution": "100 * 2 + 75 + 50 + 7",
        "target": 332
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            25,
            75,
            100,
            1,
            8
        ],
        "solution": "(100 + 50 / 25) * 8",
        "target": 816
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            100,
            10,
            5,
            5
        ],
        "solution": "50 * 10 + (100 - 5) / 5",
        "target": 519
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            25,
            75,
            2,
            3,
            7
        ],
        "solution": "(75 + 50 + 3) * (7 - 2)",
        "target": 640
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            6,
            6,
            5,
            2,
            2
        ],
        "solution": "(75 - 6) * 2 - 2",
        "target": 136
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            100,
            75,
            25,
            50,
            8,
            4
        ],
        "solution": "(100 + 75 + 8 - 25) * 4 + 50",
        "target": 681
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            75,
            50,
            4,
            4,
            1,
            6
        ],
        "solution": "50 * (4 - 1)",
        "target": 150
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            50,
            9,
            2,
            4
        ],
        "solution": "(75 + 50) * 4 + 9",
        "target": 509
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            50,
            25,
            5,
            4
        ],
        "solution": "(100 - 75 / 5) * 4",
        "target": 340
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            6,
            3,
            9,
            5,
            10,
            4
        ],
        "solution": "10 * 9 * (5 + 3) + 4 - 6",
        "target": 718
    },
    {
        "countNumbersUsed": 5,
        "numAway": 1,
        "selection": [
            100,
            75,
            50,
            25,
            10,
            1
        ],
        "solution": "25 * (100 - (75 + 1)) - 10",
        "target": 591
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            50,
            4,
            8,
            4,
            1,
            2
        ],
        "solution": "50 * 4 + 4",
        "target": 204
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            75,
            7,
            7,
            9,
            5
        ],
        "solution": "(75 * 25 - 7) / (9 - 7)",
        "target": 934
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            50,
            100,
            4,
            9,
            6
        ],
        "solution": "(100 - 6) * 4 - 25",
        "target": 351
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            5,
            10,
            4,
            3,
            10
        ],
        "solution": "(10 * 10 - 3) * 5 + 4",
        "target": 489
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            25,
            9,
            8,
            8,
            10
        ],
        "solution": "25 * 8 - (10 + 8)",
        "target": 182
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            25,
            75,
            3,
            5,
            4
        ],
        "solution": "(75 - 4) * 5 + 50 + 25 + 3",
        "target": 433
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            6,
            8,
            5,
            2,
            4,
            1
        ],
        "solution": "((8 + 4) * 5 + 1) * 6",
        "target": 366
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            25,
            50,
            75,
            10,
            7
        ],
        "solution": "(75 + 100 / 25) * (7 + 50 / 10)",
        "target": 948
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            75,
            100,
            5,
            7,
            3
        ],
        "solution": "(100 * (50 - 3)) / 5",
        "target": 940
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            100,
            2,
            7,
            1,
            6
        ],
        "solution": "(100 - 1) * 7 + 25",
        "target": 718
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            10,
            3,
            3,
            6,
            8,
            2
        ],
        "solution": "(10 * 3 + 8) * 6 * 3",
        "target": 684
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            2,
            3,
            6,
            8
        ],
        "solution": "(25 + 6) * (8 + 2) + 100",
        "target": 410
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            9,
            4,
            1,
            7,
            6,
            9
        ],
        "solution": "((9 - 1) * 6 + 9) * (7 + 4)",
        "target": 627
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            7,
            3,
            6,
            5,
            7
        ],
        "solution": "75 * (6 + 3) + 7 + 7",
        "target": 689
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            8,
            6,
            2,
            1,
            10,
            9
        ],
        "solution": "(8 * 6 - 9) * (10 * 2 + 1)",
        "target": 819
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            6,
            9,
            7,
            5,
            1,
            2
        ],
        "solution": "(9 + 6) * 7",
        "target": 105
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            25,
            9,
            3,
            10,
            8
        ],
        "solution": "(50 + 25) * (9 + 3) + 8",
        "target": 908
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            100,
            6,
            1,
            5
        ],
        "solution": "(100 - 1) * (6 - 50 / 25)",
        "target": 396
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            8,
            9,
            7,
            7
        ],
        "solution": "50 * 8 + 7 * 7 - 9",
        "target": 440
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            9,
            9,
            4,
            2
        ],
        "solution": "100 * 2 + 9 * 9 + 4",
        "target": 285
    },
    {
        "countNumbersUsed": 6,
        "numAway": 194,
        "selection": [
            4,
            5,
            4,
            3,
            1,
            2
        ],
        "solution": "5 * 4 * 4 * (2 + 1) * 3",
        "target": 914
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            50,
            7,
            2,
            3,
            9
        ],
        "solution": "(100 - 9) * 7 + 50 / 2",
        "target": 662
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            1,
            5,
            8
        ],
        "solution": "(100 - 1) * 8 - 5",
        "target": 787
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            50,
            1,
            5,
            8,
            6
        ],
        "solution": "(100 - (8 + 5)) * 6",
        "target": 522
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            9,
            6,
            7,
            2,
            10,
            7
        ],
        "solution": "(9 * 7 - 6) * 10 - 2",
        "target": 568
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            6,
            3,
            2,
            6,
            5
        ],
        "solution": "50 * (5 * 3 - 2) + 6",
        "target": 656
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            50,
            9,
            6,
            5
        ],
        "solution": "100 * 5 + 25 + 6 - 9",
        "target": 522
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            50,
            10,
            9,
            8,
            3
        ],
        "solution": "50 * 8 + 9 + 3",
        "target": 412
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            25,
            100,
            10,
            4,
            2
        ],
        "solution": "(100 - 4) * (10 + 2 - 75 / 25)",
        "target": 864
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            75,
            2,
            7,
            6,
            9
        ],
        "solution": "50 * 7 - (75 + 2)",
        "target": 273
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            1,
            6,
            2,
            4,
            9,
            8
        ],
        "solution": "9 * (4 + 2) * 6",
        "target": 324
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            5,
            2,
            3,
            6,
            4,
            10
        ],
        "solution": "(6 + 5 + 2) * 10 * (4 + 3)",
        "target": 911
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            100,
            8,
            4
        ],
        "solution": "((100 * 4 + 75 - 8) * 50) / 25",
        "target": 934
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            25,
            1,
            7
        ],
        "solution": "75 * 7 - (50 + 100 / 25)",
        "target": 471
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            8,
            2,
            6,
            5,
            1
        ],
        "solution": "75 * 8 - 5 * (6 - 2)",
        "target": 580
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            25,
            1,
            7,
            8,
            3
        ],
        "solution": "(100 - (25 + 1)) * 8 - 7 * 3",
        "target": 571
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            75,
            7,
            8,
            10,
            5
        ],
        "solution": "(75 + 50 + 8 - 5) * 7",
        "target": 896
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            3,
            10,
            7,
            6,
            6
        ],
        "solution": "100 * 3 + 7 - 10",
        "target": 297
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            3,
            6,
            2,
            9,
            3
        ],
        "solution": "(50 + (9 + 6) * 3) * 2",
        "target": 190
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            50,
            75,
            10,
            3
        ],
        "solution": "(100 * 50 + 75) / 25 - 10",
        "target": 193
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            100,
            50,
            75,
            5,
            6
        ],
        "solution": "100 * 5 + (75 + 50 / 25) * 6",
        "target": 962
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            50,
            3,
            4,
            7
        ],
        "solution": "(100 + 50 / 25) * 3 - 7",
        "target": 299
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            9,
            5,
            2,
            8,
            3,
            9
        ],
        "solution": "(9 * 2 + 3) * 9 * 5 - 8",
        "target": 937
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            5,
            4,
            2,
            2
        ],
        "solution": "100 * 5 + 2 / 2",
        "target": 501
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            6,
            9,
            7,
            9,
            5
        ],
        "solution": "(25 + 7 + 5) * (9 + 6)",
        "target": 555
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            100,
            6,
            1
        ],
        "solution": "((100 + 50) * (75 - 6)) / 25 + 1",
        "target": 415
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            75,
            100,
            50,
            3,
            5,
            1
        ],
        "solution": "50 * (5 + 3)",
        "target": 400
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            7,
            2,
            7
        ],
        "solution": "(100 * 7) / 2 - 75 / 25",
        "target": 347
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            75,
            100,
            3,
            2,
            9,
            8
        ],
        "solution": "75 * 3 - 9",
        "target": 216
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            75,
            100,
            9,
            10,
            5
        ],
        "solution": "50 * 9 + 100 / (75 - 10 * 5)",
        "target": 454
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            6,
            2,
            6,
            1,
            10,
            3
        ],
        "solution": "(10 * 6 - 1) * (6 + 3 - 2)",
        "target": 413
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            75,
            7,
            3,
            1,
            8
        ],
        "solution": "(75 + 25 - 3) * 8 - 7",
        "target": 769
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            1,
            8,
            6
        ],
        "solution": "(100 + 8) * 6 - 75",
        "target": 573
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            10,
            2,
            3,
            7,
            3,
            8
        ],
        "solution": "(10 * 8 + 2 - 3) * 7",
        "target": 553
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            25,
            50,
            9,
            7,
            1
        ],
        "solution": "(100 * 25 + 7 - 50) / 9",
        "target": 273
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            100,
            50,
            8,
            1,
            8
        ],
        "solution": "(100 + 1) * ((75 * 8) / 50 - 8)",
        "target": 404
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            2,
            4,
            1,
            3
        ],
        "solution": "(75 * 2 + 50 - 1) * 4",
        "target": 796
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            7,
            4,
            3,
            10,
            6
        ],
        "solution": "(25 + 7) * (4 * 3 + 10)",
        "target": 704
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            1,
            9,
            1,
            4,
            2,
            4
        ],
        "solution": "(4 * 4 - 1) * 9 + 2",
        "target": 137
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            75,
            50,
            4,
            10,
            10
        ],
        "solution": "75 * 10 + 25 + 50 / 10 - 4",
        "target": 776
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            50,
            6,
            7,
            4,
            2
        ],
        "solution": "50 * (6 + 4) + 2 - 7",
        "target": 495
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            4,
            3,
            6,
            8,
            5,
            5
        ],
        "solution": "(5 + 3) * 8 * 6 + 4 - 5",
        "target": 383
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            50,
            8,
            1,
            3,
            6
        ],
        "solution": "50 * (25 - 6) + 8 * (3 + 1)",
        "target": 982
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            6,
            1,
            3,
            8,
            8,
            5
        ],
        "solution": "((8 + 6) * 8 + 1) * 5",
        "target": 565
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            50,
            25,
            100,
            2,
            10,
            9
        ],
        "solution": "50 * (9 + 10 / (100 / 25 - 2))",
        "target": 699
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            25,
            9,
            6,
            2,
            1,
            4
        ],
        "solution": "25 * (6 + 2)",
        "target": 200
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            5,
            1,
            1,
            9,
            9
        ],
        "solution": "(75 - 5) * 9 - (1 + 1)",
        "target": 628
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            50,
            6,
            5
        ],
        "solution": "(100 * (50 + 5)) / 25 - 6",
        "target": 214
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            75,
            2,
            10,
            5,
            7
        ],
        "solution": "(75 + 2 - 25) * 7 + 5",
        "target": 369
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            2,
            3,
            3,
            7,
            5
        ],
        "solution": "(100 + 3) * 5 + 7 + 2",
        "target": 524
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            25,
            50,
            5,
            8,
            10
        ],
        "solution": "75 * 10 + 8 - 5",
        "target": 753
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            25,
            50,
            9,
            1,
            6
        ],
        "solution": "(25 + 6 - 1) * 9",
        "target": 270
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            50,
            25,
            100,
            9,
            7
        ],
        "solution": "(75 + 50) * 7 + 100 / 25 - 9",
        "target": 870
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            50,
            6,
            3,
            9,
            3
        ],
        "solution": "9 * 6 + 50 - 3",
        "target": 101
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            25,
            75,
            100,
            8,
            4,
            1
        ],
        "solution": "(75 + 8 + 1) * 4 + 25 - 100",
        "target": 262
    },
    {
        "countNumbersUsed": 5,
        "numAway": 1,
        "selection": [
            10,
            2,
            4,
            6,
            8,
            2
        ],
        "solution": "(10 * 4 + 6) * 8 * 2",
        "target": 737
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            7,
            6,
            5,
            9,
            2
        ],
        "solution": "25 * (7 + 6) + 9 + 5",
        "target": 339
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            9,
            8,
            6,
            9
        ],
        "solution": "75 * 9 + 50 + 9 + 6",
        "target": 740
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            50,
            4,
            8,
            3
        ],
        "solution": "75 * 4 + 8 - 3",
        "target": 305
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            50,
            6,
            5,
            7,
            1
        ],
        "solution": "50 * 5 - (25 + 1)",
        "target": 224
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            75,
            2,
            4,
            9,
            2
        ],
        "solution": "50 * 9 + (75 - (4 + 2)) * 2",
        "target": 588
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            50,
            10,
            2,
            10
        ],
        "solution": "(50 + 10) * (10 + 100 / 25)",
        "target": 840
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            4,
            2,
            7,
            1
        ],
        "solution": "75 * 7 - (100 + 2)",
        "target": 423
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            6,
            3,
            8,
            7,
            6
        ],
        "solution": "50 * (6 + 6) - (8 * 7 + 3)",
        "target": 541
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            1,
            6,
            10,
            7
        ],
        "solution": "(100 + 10 - 6) * 7 - 50",
        "target": 678
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            50,
            9,
            5,
            7
        ],
        "solution": "(50 + 7) * 9 - 75",
        "target": 438
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            10,
            7,
            8,
            4
        ],
        "solution": "(50 - (8 + 4)) * 7",
        "target": 266
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            25,
            100,
            75,
            10,
            1
        ],
        "solution": "((100 - 10) * 75 - 50) / 25",
        "target": 268
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            50,
            75,
            25,
            10,
            9
        ],
        "solution": "(50 - 10) * 9 + 75 - 100 / 25",
        "target": 431
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            2,
            9,
            5
        ],
        "solution": "(75 - (5 + 2)) * 9 - 50",
        "target": 562
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            9,
            10,
            2,
            6,
            6
        ],
        "solution": "(10 * 6 + 25) * 6 - 9",
        "target": 501
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            25,
            3,
            6,
            9,
            8
        ],
        "solution": "(25 + 6) * (9 - 3)",
        "target": 186
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            10,
            10,
            5,
            6,
            2
        ],
        "solution": "(10 * 6 + 2) * 10",
        "target": 620
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            25,
            5,
            2,
            2,
            6
        ],
        "solution": "((100 + 6) * 2 - 25) * 5 + 2",
        "target": 937
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            7,
            10,
            7,
            1
        ],
        "solution": "25 * 7 + 7 - (50 + 10)",
        "target": 122
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            3,
            6,
            5,
            9
        ],
        "solution": "(100 + 6 / 3) * 5",
        "target": 510
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            100,
            25,
            75,
            50,
            6,
            1
        ],
        "solution": "((100 * (75 + 1)) / 50 - 25) * 6",
        "target": 763
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            100,
            3,
            5,
            5,
            9
        ],
        "solution": "100 * (5 + 3) + 9 - (25 + 5)",
        "target": 779
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            8,
            3,
            1,
            6
        ],
        "solution": "25 * (8 + 6) - 1",
        "target": 349
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            6,
            5,
            10,
            4,
            2
        ],
        "solution": "(100 - 5) * 6 - 4",
        "target": 566
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            6,
            8,
            7,
            7,
            4,
            1
        ],
        "solution": "(8 * 7 + 4 + 1) * (7 + 6)",
        "target": 793
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            75,
            5,
            10,
            8,
            2
        ],
        "solution": "75 * 8 + 100 - (10 + 2)",
        "target": 688
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            3,
            7,
            2
        ],
        "solution": "(75 + 2) * 7 + 50 / 25 - 3",
        "target": 538
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            75,
            4,
            1,
            3,
            3
        ],
        "solution": "((100 - 1) * 3 - 4) * 3",
        "target": 879
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            75,
            50,
            25,
            2,
            1,
            6
        ],
        "solution": "(50 - 2) * ((75 * 6) / 25 - 1)",
        "target": 815
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            100,
            1,
            9,
            6,
            5
        ],
        "solution": "(25 + 1) * (9 + 6)",
        "target": 390
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            1,
            10,
            7
        ],
        "solution": "(50 - 1) * 7 + 100 - 10",
        "target": 433
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            1,
            10,
            5,
            8,
            7
        ],
        "solution": "100 * 10 - (8 + 7 + 1)",
        "target": 984
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            1,
            10,
            9
        ],
        "solution": "(75 + 100 / 25) * 10 + 1",
        "target": 791
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            25,
            100,
            6,
            8,
            2
        ],
        "solution": "(75 + (100 - 6) / 2) * 8",
        "target": 976
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            50,
            100,
            25,
            9,
            3,
            5
        ],
        "solution": "(50 * 5 + 9 - 100 / 25) * 3",
        "target": 764
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            9,
            6,
            9,
            10,
            2
        ],
        "solution": "(25 + 9) * 9 - 10",
        "target": 296
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            100,
            25,
            50,
            1,
            8
        ],
        "solution": "(100 + 1) * 8 - 75 / (50 + 25)",
        "target": 807
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            75,
            8,
            1,
            4,
            5
        ],
        "solution": "100 + 75 - (8 * 5 + 1)",
        "target": 134
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            100,
            9,
            10,
            1,
            8,
            2
        ],
        "solution": "100 * 2 + (10 + 1) * 9 + 8",
        "target": 307
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            100,
            75,
            1,
            7
        ],
        "solution": "100 * (7 + 1) - 50 / 25",
        "target": 798
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            5,
            9,
            10,
            7,
            8,
            3
        ],
        "solution": "(10 * 5 + 7) * 9",
        "target": 513
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            4,
            2,
            9,
            9,
            6,
            1
        ],
        "solution": "((6 + 4) * 9 + 2) * 9 - 1",
        "target": 827
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            75,
            50,
            100,
            25,
            4,
            6
        ],
        "solution": "50 * 6 + 4",
        "target": 304
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            25,
            100,
            2,
            7,
            2
        ],
        "solution": "((75 + 2) * (25 - 2)) / 7",
        "target": 253
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            100,
            25,
            7,
            6,
            3
        ],
        "solution": "(50 - 6) * 7 * 3",
        "target": 924
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            8,
            10,
            6,
            8
        ],
        "solution": "(8 * 6 + 10) * 8",
        "target": 464
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            6,
            4,
            7,
            3,
            7
        ],
        "solution": "(100 - 7) * 3 + 6",
        "target": 285
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            75,
            100,
            50,
            8,
            7
        ],
        "solution": "(100 - 50 / 25) * 7 + 75",
        "target": 761
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            25,
            3,
            3,
            7,
            5
        ],
        "solution": "(50 - (7 + 5)) * (25 - 3) + 3",
        "target": 839
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            1,
            9,
            6,
            2,
            7,
            5
        ],
        "solution": "(7 * 6 + 5) * (9 + 2)",
        "target": 517
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            5,
            9,
            1
        ],
        "solution": "(25 + 1) * (9 + 5)",
        "target": 364
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            50,
            75,
            100,
            3,
            4
        ],
        "solution": "(100 + 50 - 3) * 4 - 75 / 25",
        "target": 585
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            25,
            5,
            10,
            9,
            3
        ],
        "solution": "(50 + 25) * 5 + 3 - 10",
        "target": 368
    },
    {
        "countNumbersUsed": 6,
        "numAway": 3,
        "selection": [
            5,
            5,
            2,
            7,
            3,
            3
        ],
        "solution": "(7 * 5 - 2) * (3 + 3) * 5",
        "target": 993
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            10,
            7,
            9,
            8,
            6,
            9
        ],
        "solution": "((8 + 6) * 10 - 9) * 7",
        "target": 917
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            75,
            100,
            10,
            4,
            5,
            3
        ],
        "solution": "100 + 10 * 4",
        "target": 140
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            3,
            10,
            1,
            8,
            9,
            2
        ],
        "solution": "10 * 9 * 3 + 8 - 1",
        "target": 277
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            50,
            6,
            1,
            7,
            9
        ],
        "solution": "50 * 6 + 75 + 7",
        "target": 382
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            10,
            6,
            1,
            8,
            9
        ],
        "solution": "25 * 10 + 8 - 6",
        "target": 252
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            1,
            9,
            8,
            5,
            4,
            3
        ],
        "solution": "8 * 5 * 4 - 1",
        "target": 159
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            3,
            10,
            8,
            7,
            6,
            2
        ],
        "solution": "(10 * 7 * 6 + 8) * 2",
        "target": 856
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            50,
            10,
            9,
            9,
            5
        ],
        "solution": "75 * 10 + 9 * 9 + 50",
        "target": 881
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            100,
            75,
            8,
            3,
            8,
            10
        ],
        "solution": "(75 + 8) * 10 - 3",
        "target": 827
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            75,
            2,
            1,
            10,
            3
        ],
        "solution": "(75 + 1) * 10 - 100 * 2",
        "target": 560
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            50,
            75,
            2,
            1,
            9
        ],
        "solution": "(100 * 9 + 75 - 1) / 2",
        "target": 487
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            100,
            5,
            2,
            4,
            1
        ],
        "solution": "(75 * 4 + 1) * (5 - 2)",
        "target": 903
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            100,
            25,
            50,
            75,
            8,
            9
        ],
        "solution": "100 * 9 + 25",
        "target": 925
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            50,
            100,
            25,
            6,
            2,
            4
        ],
        "solution": "50 * 4 - 2",
        "target": 198
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            25,
            10,
            2,
            8,
            8
        ],
        "solution": "75 * 10 + 25 - 8 * 2",
        "target": 759
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            100,
            75,
            5,
            7,
            10
        ],
        "solution": "((100 + 7) * 25 + 10) / 5",
        "target": 537
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            25,
            75,
            100,
            9,
            3
        ],
        "solution": "((100 + 50) * (75 + 9)) / 25",
        "target": 504
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            5,
            7,
            3,
            8,
            3
        ],
        "solution": "(50 + 8) * 5 + 7",
        "target": 297
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            8,
            2,
            8,
            9,
            2,
            3
        ],
        "solution": "8 * 8 * 3 * 2",
        "target": 384
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            25,
            100,
            2,
            1,
            9
        ],
        "solution": "(100 * 25 + 2) / 9 + 75",
        "target": 353
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            75,
            100,
            6,
            10,
            2
        ],
        "solution": "75 * 25 + 6 * 2 - 100 * 10",
        "target": 887
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            75,
            7,
            5,
            6,
            2,
            9
        ],
        "solution": "(75 - 9) * 5",
        "target": 330
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            50,
            100,
            10,
            8
        ],
        "solution": "75 * 8 + 100 - 10",
        "target": 690
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            25,
            75,
            10,
            9,
            5,
            7
        ],
        "solution": "(75 - 25) * (10 + 9 + 5 - 7)",
        "target": 851
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            50,
            25,
            100,
            10,
            5,
            7
        ],
        "solution": "(100 - 5) * 10 - (7 + 50 / 25)",
        "target": 942
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            1,
            4,
            9,
            10,
            2,
            1
        ],
        "solution": "(9 + 1) * 10 * 4 + 2",
        "target": 402
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            7,
            3,
            5,
            4,
            3,
            7
        ],
        "solution": "(7 * 4 * 3 - 5) * 7",
        "target": 553
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            10,
            9,
            1,
            6,
            5
        ],
        "solution": "(75 * 10) / 6 - 1",
        "target": 124
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            25,
            3,
            10,
            3,
            7
        ],
        "solution": "(75 - 7) * 10 - (25 + 3 + 3)",
        "target": 649
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            9,
            2,
            7,
            8,
            8
        ],
        "solution": "(50 - 9) * 7 - (8 + 2)",
        "target": 277
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            5,
            7,
            1,
            3,
            8,
            10
        ],
        "solution": "(8 * 7 + 5) * (10 + 1)",
        "target": 671
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            75,
            100,
            3,
            6,
            7
        ],
        "solution": "((100 - 3) * 75 * 6) / 50",
        "target": 873
    },
    {
        "countNumbersUsed": 2,
        "numAway": 0,
        "selection": [
            100,
            25,
            75,
            50,
            3,
            4
        ],
        "solution": "100 + 4",
        "target": 104
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            9,
            10,
            7,
            10,
            9
        ],
        "solution": "25 * (10 + 9) + 9 + 7 - 10",
        "target": 481
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            75,
            50,
            100,
            25,
            9,
            5
        ],
        "solution": "75 * 5 + 50 - 9",
        "target": 416
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            6,
            8,
            10,
            2,
            2,
            4
        ],
        "solution": "(8 * 4 + 2) * 6",
        "target": 204
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            75,
            25,
            4,
            3
        ],
        "solution": "(100 + 25) * 4 + 50 + 3",
        "target": 553
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            50,
            75,
            10,
            1,
            3,
            2
        ],
        "solution": "(50 * 10 - 3) * 2",
        "target": 994
    },
    {
        "countNumbersUsed": 3,
        "numAway": 0,
        "selection": [
            25,
            5,
            2,
            9,
            3,
            1
        ],
        "solution": "25 * 9 * 3",
        "target": 675
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            4,
            9,
            1,
            10,
            3,
            2
        ],
        "solution": "((10 - 1) * 9 + 2) * (4 + 3)",
        "target": 581
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            100,
            25,
            1,
            10,
            4
        ],
        "solution": "(100 + 4) * (10 - 1) - 75 / 25",
        "target": 933
    },
    {
        "countNumbersUsed": 5,
        "numAway": 1,
        "selection": [
            75,
            50,
            25,
            9,
            8,
            9
        ],
        "solution": "(75 + 9) * 9 + 8 - 50",
        "target": 715
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            100,
            1,
            5,
            10,
            9
        ],
        "solution": "100 * 10 - (25 + (9 + 1) / 5)",
        "target": 973
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            8,
            1,
            4,
            8,
            5,
            2
        ],
        "solution": "(8 * 4 - 1) * 5 + 8",
        "target": 163
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            5,
            4,
            9,
            2
        ],
        "solution": "(75 - 9 * 2) * 5",
        "target": 285
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            9,
            2,
            10,
            8,
            1,
            5
        ],
        "solution": "(10 + 9 + 2) * (8 + 5)",
        "target": 273
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            75,
            25,
            5,
            4,
            9
        ],
        "solution": "25 * 9 - (75 * 4) / 50",
        "target": 219
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            25,
            75,
            10,
            5,
            6,
            9
        ],
        "solution": "(75 + 6 - 25) * (9 - 10 / 5)",
        "target": 392
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            100,
            75,
            50,
            25,
            7,
            8
        ],
        "solution": "100 * 7 + (75 + 50) / 25",
        "target": 705
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            50,
            100,
            3,
            4,
            3,
            1
        ],
        "solution": "(100 + 50) * (4 + 1) + 3 + 3",
        "target": 756
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            25,
            50,
            100,
            75,
            8,
            6
        ],
        "solution": "((100 + 8) * 75 - 50) / 25",
        "target": 322
    },
    {
        "countNumbersUsed": 6,
        "numAway": 1,
        "selection": [
            50,
            75,
            25,
            100,
            8,
            2
        ],
        "solution": "(75 + 2) * 8 - (50 + 100 / 25)",
        "target": 563
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            25,
            6,
            8,
            9,
            3
        ],
        "solution": "75 * 9 + 25 * 8 + 6 * 3",
        "target": 893
    },
    {
        "countNumbersUsed": 4,
        "numAway": 0,
        "selection": [
            25,
            75,
            100,
            1,
            5,
            2
        ],
        "solution": "75 * (5 + 100 / 25)",
        "target": 675
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            75,
            25,
            10,
            6,
            6,
            7
        ],
        "solution": "(25 * 6 - (10 + 6)) * 7",
        "target": 938
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            75,
            100,
            50,
            5,
            10,
            9
        ],
        "solution": "((75 + 5) * 50 + 100) / 10 + 9",
        "target": 419
    },
    {
        "countNumbersUsed": 5,
        "numAway": 0,
        "selection": [
            50,
            100,
            5,
            1,
            10,
            4
        ],
        "solution": "((100 + 4) * 10) / 5 + 50",
        "target": 258
    },
    {
        "countNumbersUsed": 6,
        "numAway": 0,
        "selection": [
            10,
            2,
            8,
            2,
            3,
            7
        ],
        "solution": "(10 + 2) * (7 + 2) * 8 + 3",
        "target": 867
    },

    {
        "selection" : [ 75, 9, 1, 4, 9, 4, 2 ],
        "target" : 1569,
        "numAway" : 0,
        "solution" : "(75 + 2 + 1) * (9 - 4) * 4 + 9",
        "countNumbersUsed" : 7
    },
    {
        "selection" : [ 75, 9, 1, 4, 9, 4, 2 ],
        "target" : 1569,
        "numAway" : 1,
        "solution" : "((9 + 2) * 9 - 1) * 4 * 4",
        "maxNumbersUsed" : 6,
        "countNumbersUsed" : 6
    },

    {
        "selection" : [ 25, 75, 4, 7, 3, 9, 9 ],
        "target" : 1184,
        "numAway" : 0,
        "solution" : "75 * (9 + 7) + 9 - 25",
        "maxNumbersUsed" : 6,
        "countNumbersUsed" : 5
    },

    {
        "selection" : [ 100, 1, 1, 8, 6, 9 ],
        "target" : 557,
        "lockedNumbers" : [ 9 ],
        "numAway" : 1,
        "solution" : "(100 - 8 - 1) * 6 + 9 + 1",
        "countNumbersUsed" : 6
    },

    {
        "selection" : [ 100, 1, 1, 8, 6, 9 ],
        "target" : 557,
        "numAway" : 0,
        "solution" : "(100 + 1 - 8) * 6 - 1",
        "countNumbersUsed" : 5
    },

    {
        "selection" : [ 100, 1, 1, 8, 6, 9 ],
        "target" : 557,
        "minNumbersUsed" : 6,
        "numAway" : 1,
        "solution" : "(100 - 8 - 1) * 6 + 9 + 1",
        "countNumbersUsed" : 6
    }
]
