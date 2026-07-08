const challenges = [
  // ═══════════════════ ALGORITHM MASTERY ═══════════════════
  // Tier 1 — Basics
  { title:'Two Sum',slug:'two-sum',difficulty:'beginner',category:'algorithms',tags:['arrays','hash-map'],xpReward:50,
    description:'## Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to target.\n\n### Example\n`Input: [2,7,11,15], 9` → `Output: [0,1]`',
    starterCode:{javascript:'function twoSum(nums, target) {\n  // Your code here\n}',python:'def two_sum(nums, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[2,7,11,15], 9',expectedOutput:'[0,1]',isHidden:false},{input:'[3,2,4], 6',expectedOutput:'[1,2]',isHidden:false},{input:'[3,3], 6',expectedOutput:'[0,1]',isHidden:true}],
    hints:['Use a hash map to store seen values']},

  { title:'Contains Duplicate',slug:'contains-duplicate',difficulty:'beginner',category:'algorithms',tags:['arrays','hash-set'],xpReward:50,
    description:'## Contains Duplicate\n\nReturn `true` if any value appears at least twice in the array.\n\n### Example\n`[1,2,3,1]` → `true`',
    starterCode:{javascript:'function containsDuplicate(nums) {\n  // Your code here\n}',python:'def contains_duplicate(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,3,1]',expectedOutput:'true',isHidden:false},{input:'[1,2,3,4]',expectedOutput:'false',isHidden:false},{input:'[1,1,1,3,3,4,3,2,4,2]',expectedOutput:'true',isHidden:true}],
    hints:['Use a Set']},

  { title:'Valid Anagram',slug:'valid-anagram',difficulty:'beginner',category:'algorithms',tags:['strings','hash-map'],xpReward:50,
    description:'## Valid Anagram\n\nReturn `true` if `t` is an anagram of `s`.\n\n### Example\n`"anagram", "nagaram"` → `true`',
    starterCode:{javascript:'function isAnagram(s, t) {\n  // Your code here\n}',python:'def is_anagram(s, t):\n    # Your code here\n    pass'},
    testCases:[{input:'"anagram", "nagaram"',expectedOutput:'true',isHidden:false},{input:'"rat", "car"',expectedOutput:'false',isHidden:false}],
    hints:['Count character frequencies']},

  { title:'Single Number',slug:'single-number',difficulty:'beginner',category:'algorithms',tags:['arrays','bit-manipulation'],xpReward:50,
    description:'## Single Number\n\nEvery element appears twice except one. Find the single one.\n\n### Example\n`[4,1,2,1,2]` → `4`',
    starterCode:{javascript:'function singleNumber(nums) {\n  // Your code here\n}',python:'def single_number(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[2,2,1]',expectedOutput:'1',isHidden:false},{input:'[4,1,2,1,2]',expectedOutput:'4',isHidden:false}],
    hints:['XOR cancels duplicates']},

  { title:'Check Data Type',slug:'check-data-type',difficulty:'beginner',category:'algorithms',tags:['data-types'],xpReward:50,
    description:'## Check Data Type\n\nWrite a function that returns the exact data type of a given value. For arrays, return `"array"`. For null, return `"null"`. For other types, return the standard type string (e.g., `"number"`, `"string"`).\n\n### Example\n`42` → `"number"`\n`[]` → `"array"`',
    starterCode:{javascript:'function checkType(val) {\n  // Your code here\n}',python:'def check_type(val):\n    # Your code here\n    pass'},
    testCases:[{input:'42',expectedOutput:'"number"',isHidden:false},{input:'[]',expectedOutput:'"array"',isHidden:false},{input:'null',expectedOutput:'"null"',isHidden:true}],
    hints:['In JS, typeof null is "object" and Array.isArray() is useful.']},

  // Tier 2 — Searching
  { title:'Binary Search',slug:'binary-search',difficulty:'intermediate',category:'algorithms',tags:['searching','binary-search'],xpReward:100,
    description:'## Binary Search\n\nGiven sorted array `nums` and `target`, return index or -1.\n\n### Example\n`[-1,0,3,5,9,12], 9` → `4`',
    starterCode:{javascript:'function binarySearch(nums, target) {\n  // Your code here\n}',python:'def binary_search(nums, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[-1,0,3,5,9,12], 9',expectedOutput:'4',isHidden:false},{input:'[-1,0,3,5,9,12], 2',expectedOutput:'-1',isHidden:false},{input:'[5], 5',expectedOutput:'0',isHidden:true}],
    hints:['Use left and right pointers']},

  { title:'First Bad Version',slug:'first-bad-version',difficulty:'beginner',category:'algorithms',tags:['binary-search'],xpReward:50,
    description:'## First Bad Version\n\nYou are given an array of versions `[0, 0, 0, 1, 1]` where `0` is good and `1` is bad. Find the index of the first bad version using binary search.\n\n### Example\n`[0,0,0,1,1]` → `3`',
    starterCode:{javascript:'function firstBadVersion(versions) {\n  // Your code here\n}',python:'def first_bad_version(versions):\n    # Your code here\n    pass'},
    testCases:[{input:'[0,0,0,1,1]',expectedOutput:'3',isHidden:false},{input:'[0,1,1,1]',expectedOutput:'1',isHidden:false}],
    hints:['Find the first occurrence of 1']},

  { title:'Search Insert Position',slug:'search-insert-position',difficulty:'beginner',category:'algorithms',tags:['binary-search'],xpReward:50,
    description:'## Search Insert Position\n\nGiven a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\n### Example\n`[1,3,5,6], 5` → `2`\n`[1,3,5,6], 2` → `1`',
    starterCode:{javascript:'function searchInsert(nums, target) {\n  // Your code here\n}',python:'def search_insert(nums, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,3,5,6], 5',expectedOutput:'2',isHidden:false},{input:'[1,3,5,6], 2',expectedOutput:'1',isHidden:false},{input:'[1,3,5,6], 7',expectedOutput:'4',isHidden:true}],
    hints:['Return the left pointer when the loop ends']},

  { title:'Search in Rotated Sorted Array',slug:'search-in-rotated-sorted-array',difficulty:'intermediate',category:'algorithms',tags:['binary-search'],xpReward:100,
    description:'## Search in Rotated Sorted Array\n\nThere is an integer array `nums` sorted in ascending order (with distinct values). It is rotated at an unknown pivot index. Given the array after the rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\n### Example\n`[4,5,6,7,0,1,2], 0` → `4`',
    starterCode:{javascript:'function search(nums, target) {\n  // Your code here\n}',python:'def search(nums, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[4,5,6,7,0,1,2], 0',expectedOutput:'4',isHidden:false},{input:'[4,5,6,7,0,1,2], 3',expectedOutput:'-1',isHidden:false}],
    hints:['Determine which half of the array is sorted']},

  { title:'Find Minimum in Rotated Sorted Array',slug:'find-minimum-in-rotated-sorted-array',difficulty:'intermediate',category:'algorithms',tags:['binary-search'],xpReward:100,
    description:'## Find Minimum in Rotated Sorted Array\n\nGiven the sorted rotated array `nums` of unique elements, return the minimum element of this array. You must write an algorithm that runs in `O(log n)` time.\n\n### Example\n`[3,4,5,1,2]` → `1`',
    starterCode:{javascript:'function findMin(nums) {\n  // Your code here\n}',python:'def find_min(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[3,4,5,1,2]',expectedOutput:'1',isHidden:false},{input:'[4,5,6,7,0,1,2]',expectedOutput:'0',isHidden:false}],
    hints:['Compare mid with right to find the inflection point']},

  { title:'Find First and Last Position',slug:'find-first-and-last-position',difficulty:'intermediate',category:'algorithms',tags:['binary-search'],xpReward:100,
    description:'## Find First and Last Position\n\nGiven an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If not found, return `[-1, -1]`.\n\n### Example\n`[5,7,7,8,8,10], 8` → `[3,4]`',
    starterCode:{javascript:'function searchRange(nums, target) {\n  // Your code here\n}',python:'def search_range(nums, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[5,7,7,8,8,10], 8',expectedOutput:'[3,4]',isHidden:false},{input:'[5,7,7,8,8,10], 6',expectedOutput:'[-1,-1]',isHidden:false}],
    hints:['Perform binary search twice: once for left bound, once for right bound']},

  { title:'Koko Eating Bananas',slug:'koko-eating-bananas',difficulty:'intermediate',category:'algorithms',tags:['binary-search'],xpReward:100,
    description:'## Koko Eating Bananas\n\nKoko loves to eat bananas. There are `n` piles of bananas. The guards have gone and will come back in `h` hours. Koko can decide her bananas-per-hour eating speed of `k`. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.\n\n### Example\n`[3,6,7,11], 8` → `4`',
    starterCode:{javascript:'function minEatingSpeed(piles, h) {\n  // Your code here\n}',python:'def min_eating_speed(piles, h):\n    # Your code here\n    pass'},
    testCases:[{input:'[3,6,7,11], 8',expectedOutput:'4',isHidden:false},{input:'[30,11,23,4,20], 5',expectedOutput:'30',isHidden:false}],
    hints:['Binary search the speed k between 1 and max(piles)']},

  { title:'Median of Two Sorted Arrays',slug:'median-of-two-sorted-arrays',difficulty:'expert',category:'algorithms',tags:['binary-search'],xpReward:300,
    description:'## Median of Two Sorted Arrays\n\nGiven two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be `O(log (m+n))`.\n\n### Example\n`[1,3], [2]` → `2`\n`[1,2], [3,4]` → `2.5`',
    starterCode:{javascript:'function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}',python:'def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,3], [2]',expectedOutput:'2',isHidden:false},{input:'[1,2], [3,4]',expectedOutput:'2.5',isHidden:false}],
    hints:['Binary search on the smaller array to partition both arrays evenly']},

  // Tier 2 — Sorting
  { title:'Sort Array',slug:'sort-array',difficulty:'intermediate',category:'algorithms',tags:['sorting','merge-sort'],xpReward:100,
    description:'## Sort an Array\n\nSort the array in ascending order.\n\n### Example\n`[5,2,3,1]` → `[1,2,3,5]`',
    starterCode:{javascript:'function sortArray(nums) {\n  // Your code here\n}',python:'def sort_array(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[5,2,3,1]',expectedOutput:'[1,2,3,5]',isHidden:false},{input:'[5,1,1,2,0,0]',expectedOutput:'[0,0,1,1,2,5]',isHidden:false}],
    hints:['Merge sort is O(n log n)']},

  // Tier 3 — Recursion
  { title:'Permutations',slug:'permutations',difficulty:'advanced',category:'algorithms',tags:['recursion','backtracking'],xpReward:200,
    description:'## Permutations\n\nGiven an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.\n\n### Example\n`[1,2,3]` → `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`',
    starterCode:{javascript:'function permute(nums) {\n  // Your code here\n}',python:'def permute(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,3]',expectedOutput:'[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',isHidden:false},{input:'[0,1]',expectedOutput:'[[0,1],[1,0]]',isHidden:false}],
    hints:['Use backtracking to build permutations element by element']},

  { title:'Subsets',slug:'subsets',difficulty:'advanced',category:'algorithms',tags:['recursion','backtracking'],xpReward:200,
    description:'## Subsets\n\nGiven an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.\n\n### Example\n`[1,2,3]` → `[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`',
    starterCode:{javascript:'function subsets(nums) {\n  // Your code here\n}',python:'def subsets(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,3]',expectedOutput:'[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',isHidden:false},{input:'[0]',expectedOutput:'[[],[0]]',isHidden:false}],
    hints:['For each element, you either include it or exclude it']},

  { title:'Combination Sum',slug:'combination-sum',difficulty:'advanced',category:'algorithms',tags:['recursion','backtracking'],xpReward:200,
    description:'## Combination Sum\n\nGiven an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\n### Example\n`[2,3,6,7], 7` → `[[2,2,3],[7]]`',
    starterCode:{javascript:'function combinationSum(candidates, target) {\n  // Your code here\n}',python:'def combination_sum(candidates, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[2,3,6,7], 7',expectedOutput:'[[2,2,3],[7]]',isHidden:false},{input:'[2,3,5], 8',expectedOutput:'[[2,2,2,2],[2,3,3],[3,5]]',isHidden:false}],
    hints:['Use backtracking and allow reusing the same element']},

  { title:'Word Search',slug:'word-search',difficulty:'advanced',category:'algorithms',tags:['recursion','backtracking'],xpReward:200,
    description:'## Word Search\n\nGiven an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.\n\n### Example\n`[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"` → `true`',
    starterCode:{javascript:'function exist(board, word) {\n  // Your code here\n}',python:'def exist(board, word):\n    # Your code here\n    pass'},
    testCases:[{input:'[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"',expectedOutput:'true',isHidden:false}],
    hints:['DFS with backtracking to find the word']},

  { title:'N-Queens',slug:'n-queens',difficulty:'expert',category:'algorithms',tags:['recursion','backtracking'],xpReward:300,
    description:'## N-Queens\n\nThe n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Given an integer `n`, return all distinct solutions to the n-queens puzzle.\n\n### Example\n`4` → `[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`',
    starterCode:{javascript:'function solveNQueens(n) {\n  // Your code here\n}',python:'def solveNQueens(n):\n    # Your code here\n    pass'},
    testCases:[{input:'4',expectedOutput:'[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',isHidden:false}],
    hints:['Use backtracking and check columns and diagonals']},

  { title:'Sudoku Solver',slug:'sudoku-solver',difficulty:'expert',category:'algorithms',tags:['recursion','backtracking'],xpReward:300,
    description:'## Sudoku Solver\n\nWrite a program to solve a Sudoku puzzle by filling the empty cells. Empty cells are indicated by the character `"."`.\n\n### Example\n`[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]` → Return solved grid',
    starterCode:{javascript:'function solveSudoku(board) {\n  // Your code here\n  // Modifies board in-place\n  return board;\n}',python:'def solveSudoku(board):\n    # Your code here\n    return board'},
    testCases:[{input:'[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',expectedOutput:'[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]',isHidden:false}],
    hints:['Try digits 1-9 and backtrack if invalid']},

  { title:'Generate Parentheses',slug:'generate-parentheses',difficulty:'advanced',category:'algorithms',tags:['recursion','backtracking'],xpReward:200,
    description:'## Generate Parentheses\n\nGenerate all valid combinations of `n` pairs of parentheses.\n\n### Example\n`3` → `["((()))","(()())","(())()","()(())","()()()"]`',
    starterCode:{javascript:'function generateParenthesis(n) {\n  // Your code here\n}',python:'def generate_parenthesis(n):\n    # Your code here\n    pass'},
    testCases:[{input:'3',expectedOutput:'["((()))","(()())","(())()","()(())","()()()"]',isHidden:false},{input:'1',expectedOutput:'["()"]',isHidden:false}],
    hints:['Use backtracking with open/close counts']},

  { title:'Majority Element',slug:'majority-element',difficulty:'beginner',category:'algorithms',tags:['recursion','divide-and-conquer'],xpReward:50,
    description:'## Majority Element\n\nGiven an array `nums` of size `n`, return the majority element (appears more than `⌊n / 2⌋` times).\n\n### Example\n`[3,2,3]` → `3`\n`[2,2,1,1,1,2,2]` → `2`',
    starterCode:{javascript:'function majorityElement(nums) {\n  // Your code here\n}',python:'def majority_element(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[3,2,3]',expectedOutput:'3',isHidden:false},{input:'[2,2,1,1,1,2,2]',expectedOutput:'2',isHidden:false}],
    hints:['Boyer-Moore Voting Algorithm or Divide and Conquer']},

  { title:'Merge K Sorted Lists',slug:'merge-k-sorted-lists',difficulty:'expert',category:'algorithms',tags:['recursion','divide-and-conquer'],xpReward:300,
    description:'## Merge K Sorted Lists\n\nYou are given an array of `k` linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it. (Represented as arrays for this challenge).\n\n### Example\n`[[1,4,5],[1,3,4],[2,6]]` → `[1,1,2,3,4,4,5,6]`',
    starterCode:{javascript:'function mergeKLists(lists) {\n  // Your code here\n}',python:'def mergeKLists(lists):\n    # Your code here\n    pass'},
    testCases:[{input:'[[1,4,5],[1,3,4],[2,6]]',expectedOutput:'[1,1,2,3,4,4,5,6]',isHidden:false}],
    hints:['Divide and conquer: merge lists in pairs']},

  { title:'Search a 2D Matrix II',slug:'search-a-2d-matrix-ii',difficulty:'advanced',category:'algorithms',tags:['recursion','divide-and-conquer'],xpReward:200,
    description:'## Search a 2D Matrix II\n\nWrite an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix`. This matrix has the following properties: Integers in each row are sorted in ascending from left to right. Integers in each column are sorted in ascending from top to bottom.\n\n### Example\n`[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], 5` → `true`',
    starterCode:{javascript:'function searchMatrix(matrix, target) {\n  // Your code here\n}',python:'def searchMatrix(matrix, target):\n    # Your code here\n    pass'},
    testCases:[{input:'[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], 5',expectedOutput:'true',isHidden:false},{input:'[[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], 20',expectedOutput:'false',isHidden:false}],
    hints:['Start from top-right corner']},

  { title:'Pow(x, n)',slug:'pow-x-n',difficulty:'advanced',category:'algorithms',tags:['recursion','divide-and-conquer'],xpReward:200,
    description:'## Pow(x, n)\n\nImplement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).\n\n### Example\n`2.00000, 10` → `1024`\n`2.00000, -2` → `0.25`',
    starterCode:{javascript:'function myPow(x, n) {\n  // Your code here\n}',python:'def myPow(x, n):\n    # Your code here\n    pass'},
    testCases:[{input:'2, 10',expectedOutput:'1024',isHidden:false},{input:'2, -2',expectedOutput:'0.25',isHidden:false}],
    hints:['Divide and conquer: x^n = x^(n/2) * x^(n/2)']},

  // Tier 4 — DP
  { title:'Climbing Stairs',slug:'climbing-stairs',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming','math'],xpReward:200,
    description:'## Climbing Stairs\n\nYou can climb 1 or 2 steps. How many distinct ways to reach the top?\n\n### Example\n`3` → `3`',
    starterCode:{javascript:'function climbStairs(n) {\n  // Your code here\n}',python:'def climb_stairs(n):\n    # Your code here\n    pass'},
    testCases:[{input:'2',expectedOutput:'2',isHidden:false},{input:'3',expectedOutput:'3',isHidden:false},{input:'5',expectedOutput:'8',isHidden:true}],
    hints:['Fibonacci pattern: f(n) = f(n-1) + f(n-2)']},

  { title:'Maximum Subarray',slug:'maximum-subarray',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming','arrays'],xpReward:200,
    description:'## Maximum Subarray\n\nFind the subarray with the largest sum.\n\n### Example\n`[-2,1,-3,4,-1,2,1,-5,4]` → `6`',
    starterCode:{javascript:'function maxSubArray(nums) {\n  // Your code here\n}',python:'def max_sub_array(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[-2,1,-3,4,-1,2,1,-5,4]',expectedOutput:'6',isHidden:false},{input:'[1]',expectedOutput:'1',isHidden:false},{input:'[5,4,-1,7,8]',expectedOutput:'23',isHidden:true}],
    hints:["Kadane's Algorithm"]},

  { title:'House Robber',slug:'house-robber',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## House Robber\n\nYou cannot rob adjacent houses. Find the maximum amount of money you can rob.\n\n### Example\n`[1,2,3,1]` → `4`',
    starterCode:{javascript:'function rob(nums) {\n  // Your code here\n}',python:'def rob(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,3,1]',expectedOutput:'4',isHidden:false},{input:'[2,7,9,3,1]',expectedOutput:'12',isHidden:false}],
    hints:['dp[i] = max(dp[i-1], dp[i-2] + nums[i])']},

  { title:'Longest Increasing Subsequence',slug:'longest-increasing-subsequence',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Longest Increasing Subsequence\n\nFind the length of the longest strictly increasing subsequence.\n\n### Example\n`[10,9,2,5,3,7,101,18]` → `4`',
    starterCode:{javascript:'function lengthOfLIS(nums) {\n  // Your code here\n}',python:'def lengthOfLIS(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[10,9,2,5,3,7,101,18]',expectedOutput:'4',isHidden:false}],
    hints:['DP array where dp[i] is the length of LIS ending at i']},

  { title:'Coin Change',slug:'coin-change',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Coin Change\n\nFind the fewest number of coins that make up the given amount. Return -1 if impossible.\n\n### Example\n`[1,2,5], 11` → `3`',
    starterCode:{javascript:'function coinChange(coins, amount) {\n  // Your code here\n}',python:'def coinChange(coins, amount):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,5], 11',expectedOutput:'3',isHidden:false},{input:'[2], 3',expectedOutput:'-1',isHidden:false}],
    hints:['dp[i] = min(dp[i], dp[i - coin] + 1)']},

  { title:'Word Break',slug:'word-break',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Word Break\n\nGiven a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of dictionary words.\n\n### Example\n`"leetcode", ["leet","code"]` → `true`',
    starterCode:{javascript:'function wordBreak(s, wordDict) {\n  // Your code here\n}',python:'def wordBreak(s, wordDict):\n    # Your code here\n    pass'},
    testCases:[{input:'"leetcode", ["leet","code"]',expectedOutput:'true',isHidden:false}],
    hints:['dp[i] is true if s[0..i] can be segmented']},

  { title:'Maximum Product Subarray',slug:'maximum-product-subarray',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Maximum Product Subarray\n\nFind the contiguous subarray within an array (containing at least one number) which has the largest product.\n\n### Example\n`[2,3,-2,4]` → `6`',
    starterCode:{javascript:'function maxProduct(nums) {\n  // Your code here\n}',python:'def maxProduct(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[2,3,-2,4]',expectedOutput:'6',isHidden:false}],
    hints:['Keep track of both max and min products']},

  { title:'Unique Paths',slug:'unique-paths',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Unique Paths\n\nA robot is located at the top-left corner of a `m x n` grid. How many possible unique paths are there to the bottom-right corner?\n\n### Example\n`3, 7` → `28`',
    starterCode:{javascript:'function uniquePaths(m, n) {\n  // Your code here\n}',python:'def uniquePaths(m, n):\n    # Your code here\n    pass'},
    testCases:[{input:'3, 7',expectedOutput:'28',isHidden:false},{input:'3, 2',expectedOutput:'3',isHidden:false}],
    hints:['dp[i][j] = dp[i-1][j] + dp[i][j-1]']},

  { title:'Minimum Path Sum',slug:'minimum-path-sum',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Minimum Path Sum\n\nGiven a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.\n\n### Example\n`[[1,3,1],[1,5,1],[4,2,1]]` → `7`',
    starterCode:{javascript:'function minPathSum(grid) {\n  // Your code here\n}',python:'def minPathSum(grid):\n    # Your code here\n    pass'},
    testCases:[{input:'[[1,3,1],[1,5,1],[4,2,1]]',expectedOutput:'7',isHidden:false}],
    hints:['dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])']},

  { title:'Longest Common Subsequence',slug:'longest-common-subsequence',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Longest Common Subsequence\n\nFind the length of their longest common subsequence.\n\n### Example\n`"abcde", "ace"` → `3`',
    starterCode:{javascript:'function longestCommonSubsequence(text1, text2) {\n  // Your code here\n}',python:'def longestCommonSubsequence(text1, text2):\n    # Your code here\n    pass'},
    testCases:[{input:'"abcde", "ace"',expectedOutput:'3',isHidden:false}],
    hints:['2D DP comparing characters']},

  { title:'Edit Distance',slug:'edit-distance',difficulty:'advanced',category:'algorithms',tags:['dynamic-programming'],xpReward:200,
    description:'## Edit Distance\n\nGiven two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\n### Example\n`"horse", "ros"` → `3`',
    starterCode:{javascript:'function minDistance(word1, word2) {\n  // Your code here\n}',python:'def minDistance(word1, word2):\n    # Your code here\n    pass'},
    testCases:[{input:'"horse", "ros"',expectedOutput:'3',isHidden:false}],
    hints:['Levenshtein distance']},

  { title:'Regular Expression Matching',slug:'regular-expression-matching',difficulty:'expert',category:'algorithms',tags:['dynamic-programming'],xpReward:300,
    description:'## Regular Expression Matching\n\nGiven an input string `s` and a pattern `p`, implement regular expression matching with support for `.` and `*`.\n\n### Example\n`"aa", "a*"` → `true`',
    starterCode:{javascript:'function isMatch(s, p) {\n  // Your code here\n}',python:'def isMatch(s, p):\n    # Your code here\n    pass'},
    testCases:[{input:'"aa", "a*"',expectedOutput:'true',isHidden:false},{input:'"ab", ".*"',expectedOutput:'true',isHidden:false}],
    hints:['2D DP handling the * character']},

  // Tier 4 — Graphs
  { title:'Number of Islands',slug:'number-of-islands',difficulty:'advanced',category:'algorithms',tags:['graphs','dfs','bfs'],xpReward:200,
    description:'## Number of Islands\n\nGiven a 2D grid of `1`s (land) and `0`s (water), count the number of islands.\n\n### Example\n`[[1,1,0],[1,0,0],[0,0,1]]` → `2`',
    starterCode:{javascript:'function numIslands(grid) {\n  // Your code here\n}',python:'def num_islands(grid):\n    # Your code here\n    pass'},
    testCases:[{input:'[["1","1","0"],["1","0","0"],["0","0","1"]]',expectedOutput:'2',isHidden:false},{input:'[["1","1","1"],["0","1","0"],["1","1","1"]]',expectedOutput:'1',isHidden:true}],
    hints:['DFS/BFS to mark visited land']},

  { title:'Clone Graph',slug:'clone-graph',difficulty:'advanced',category:'algorithms',tags:['graphs','dfs','bfs'],xpReward:200,
    description:'## Clone Graph\n\nReturn a deep copy (clone) of a connected undirected graph.\n\n### Example\n`[[2,4],[1,3],[2,4],[1,3]]` → `[[2,4],[1,3],[2,4],[1,3]]`',
    starterCode:{javascript:'function cloneGraph(node) {\n  // Your code here\n}',python:'def cloneGraph(node):\n    # Your code here\n    pass'},
    testCases:[{input:'[[2,4],[1,3],[2,4],[1,3]]',expectedOutput:'[[2,4],[1,3],[2,4],[1,3]]',isHidden:false}],
    hints:['Use a hash map to store cloned nodes']},

  { title:'Course Schedule',slug:'course-schedule',difficulty:'advanced',category:'algorithms',tags:['graphs','dfs','bfs'],xpReward:200,
    description:'## Course Schedule\n\nThere are a total of `numCourses` courses you have to take. Some courses may have prerequisites. Return `true` if you can finish all courses.\n\n### Example\n`2, [[1,0]]` → `true`',
    starterCode:{javascript:'function canFinish(numCourses, prerequisites) {\n  // Your code here\n}',python:'def canFinish(numCourses, prerequisites):\n    # Your code here\n    pass'},
    testCases:[{input:'2, [[1,0]]',expectedOutput:'true',isHidden:false},{input:'2, [[1,0],[0,1]]',expectedOutput:'false',isHidden:false}],
    hints:['Detect cycles using topological sort or DFS']},

  { title:'Pacific Atlantic Water Flow',slug:'pacific-atlantic-water-flow',difficulty:'advanced',category:'algorithms',tags:['graphs','dfs','bfs'],xpReward:200,
    description:'## Pacific Atlantic Water Flow\n\nFind all coordinates where water can flow to both the Pacific and Atlantic oceans.\n\n### Example\n`[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]` → `[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`',
    starterCode:{javascript:'function pacificAtlantic(heights) {\n  // Your code here\n}',python:'def pacificAtlantic(heights):\n    # Your code here\n    pass'},
    testCases:[{input:'[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',expectedOutput:'[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',isHidden:false}],
    hints:['Work backwards from the oceans']},

  { title:'Surrounded Regions',slug:'surrounded-regions',difficulty:'advanced',category:'algorithms',tags:['graphs','dfs','bfs'],xpReward:200,
    description:'## Surrounded Regions\n\nCapture all regions surrounded by `X`. A region is captured by flipping all `O`s into `X`s in that surrounded region.\n\n### Example\n`[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]` → `[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]`',
    starterCode:{javascript:'function solve(board) {\n  // Your code here\n  return board;\n}',python:'def solve(board):\n    # Your code here\n    return board'},
    testCases:[{input:'[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',expectedOutput:'[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]',isHidden:false}],
    hints:['DFS from the borders']},

  { title:'Rotting Oranges',slug:'rotting-oranges',difficulty:'advanced',category:'algorithms',tags:['graphs','dfs','bfs'],xpReward:200,
    description:'## Rotting Oranges\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.\n\n### Example\n`[[2,1,1],[1,1,0],[0,1,1]]` → `4`',
    starterCode:{javascript:'function orangesRotting(grid) {\n  // Your code here\n}',python:'def orangesRotting(grid):\n    # Your code here\n    pass'},
    testCases:[{input:'[[2,1,1],[1,1,0],[0,1,1]]',expectedOutput:'4',isHidden:false}],
    hints:['BFS starting from all rotten oranges simultaneously']},

  { title:'Network Delay Time',slug:'network-delay-time',difficulty:'advanced',category:'algorithms',tags:['graphs'],xpReward:200,
    description:'## Network Delay Time\n\nReturn the minimum time it takes for all the `n` nodes to receive the signal starting from node `k`. Return `-1` if impossible.\n\n### Example\n`[[2,1,1],[2,3,1],[3,4,1]], 4, 2` → `2`',
    starterCode:{javascript:'function networkDelayTime(times, n, k) {\n  // Your code here\n}',python:'def networkDelayTime(times, n, k):\n    # Your code here\n    pass'},
    testCases:[{input:'[[2,1,1],[2,3,1],[3,4,1]], 4, 2',expectedOutput:'2',isHidden:false}],
    hints:["Dijkstra's Algorithm"]},

  { title:'Cheapest Flights Within K Stops',slug:'cheapest-flights-within-k-stops',difficulty:'advanced',category:'algorithms',tags:['graphs'],xpReward:200,
    description:'## Cheapest Flights Within K Stops\n\nFind the cheapest price from `src` to `dst` with at most `k` stops.\n\n### Example\n`3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1` → `200`',
    starterCode:{javascript:'function findCheapestPrice(n, flights, src, dst, k) {\n  // Your code here\n}',python:'def findCheapestPrice(n, flights, src, dst, k):\n    # Your code here\n    pass'},
    testCases:[{input:'3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1',expectedOutput:'200',isHidden:false}],
    hints:['Bellman-Ford or BFS with stop limit']},

  { title:'Min Cost to Connect All Points',slug:'min-cost-to-connect-all-points',difficulty:'advanced',category:'algorithms',tags:['graphs'],xpReward:200,
    description:'## Min Cost to Connect All Points\n\nReturn the minimum cost to make all points connected. All points are connected if there is exactly one simple path between any two points.\n\n### Example\n`[[0,0],[2,2],[3,10],[5,2],[7,0]]` → `20`',
    starterCode:{javascript:'function minCostConnectPoints(points) {\n  // Your code here\n}',python:'def minCostConnectPoints(points):\n    # Your code here\n    pass'},
    testCases:[{input:'[[0,0],[2,2],[3,10],[5,2],[7,0]]',expectedOutput:'20',isHidden:false}],
    hints:["Prim's or Kruskal's MST algorithm"]},

  { title:'Word Ladder',slug:'word-ladder',difficulty:'expert',category:'algorithms',tags:['graphs'],xpReward:300,
    description:'## Word Ladder\n\nReturn the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.\n\n### Example\n`"hit", "cog", ["hot","dot","dog","lot","log","cog"]` → `5`',
    starterCode:{javascript:'function ladderLength(beginWord, endWord, wordList) {\n  // Your code here\n}',python:'def ladderLength(beginWord, endWord, wordList):\n    # Your code here\n    pass'},
    testCases:[{input:'"hit", "cog", ["hot","dot","dog","lot","log","cog"]',expectedOutput:'5',isHidden:false}],
    hints:['BFS to find the shortest path']},

  { title:'Alien Dictionary',slug:'alien-dictionary',difficulty:'expert',category:'algorithms',tags:['graphs'],xpReward:300,
    description:'## Alien Dictionary\n\nReturn a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language\'s rules.\n\n### Example\n`["wrt","wrf","er","ett","rftt"]` → `"wertf"`',
    starterCode:{javascript:'function alienOrder(words) {\n  // Your code here\n}',python:'def alienOrder(words):\n    # Your code here\n    pass'},
    testCases:[{input:'["wrt","wrf","er","ett","rftt"]',expectedOutput:'"wertf"',isHidden:false}],
    hints:['Topological Sort']},

  // Tier 5 — Expert
  { title:'Burst Balloons',slug:'burst-balloons',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','dynamic-programming'],xpReward:300,
    description:'## Burst Balloons\n\nYou are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons. Return the maximum coins you can collect by bursting the balloons wisely.\n\n### Example\n`[3,1,5,8]` → `167`',
    starterCode:{javascript:'function maxCoins(nums) {\n  // Your code here\n}',python:'def maxCoins(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[3,1,5,8]',expectedOutput:'167',isHidden:false}],
    hints:['DP on intervals: dp[i][j] is max coins from bursting balloons between i and j']},

  { title:'Longest Increasing Path in a Matrix',slug:'longest-increasing-path-in-a-matrix',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','dynamic-programming','dfs'],xpReward:300,
    description:'## Longest Increasing Path in a Matrix\n\nGiven an `m x n` integers `matrix`, return the length of the longest increasing path in `matrix`.\n\n### Example\n`[[9,9,4],[6,6,8],[2,1,1]]` → `4`',
    starterCode:{javascript:'function longestIncreasingPath(matrix) {\n  // Your code here\n}',python:'def longestIncreasingPath(matrix):\n    # Your code here\n    pass'},
    testCases:[{input:'[[9,9,4],[6,6,8],[2,1,1]]',expectedOutput:'4',isHidden:false}],
    hints:['DFS with Memoization']},

  { title:'Distinct Subsequences',slug:'distinct-subsequences',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','dynamic-programming'],xpReward:300,
    description:'## Distinct Subsequences\n\nGiven two strings `s` and `t`, return the number of distinct subsequences of `s` which equals `t`.\n\n### Example\n`"rabbbit", "rabbit"` → `3`',
    starterCode:{javascript:'function numDistinct(s, t) {\n  // Your code here\n}',python:'def numDistinct(s, t):\n    # Your code here\n    pass'},
    testCases:[{input:'"rabbbit", "rabbit"',expectedOutput:'3',isHidden:false}],
    hints:['2D DP: dp[i][j] matches s[0..i] to t[0..j]']},

  { title:'Maximal Rectangle',slug:'maximal-rectangle',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','dynamic-programming'],xpReward:300,
    description:'## Maximal Rectangle\n\nGiven a `rows x cols` binary `matrix` filled with `0`\'s and `1`\'s, find the largest rectangle containing only `1`\'s and return its area.\n\n### Example\n`[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]` → `6`',
    starterCode:{javascript:'function maximalRectangle(matrix) {\n  // Your code here\n}',python:'def maximalRectangle(matrix):\n    # Your code here\n    pass'},
    testCases:[{input:'[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',expectedOutput:'6',isHidden:false}],
    hints:['Compute histogram for each row and find max area in histogram']},

  { title:'Range Sum Query - Mutable',slug:'range-sum-query-mutable',difficulty:'advanced',category:'algorithms',tags:['algorithm-expert','segment-tree'],xpReward:200,
    description:'## Range Sum Query - Mutable\n\nGiven an integer array `nums`, handle multiple queries of the following types: Update the value of an element, and Calculate the sum of the elements in a range.\n\n### Example\n`["NumArray", "sumRange", "update", "sumRange"], [[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]` → `[null, 9, null, 8]`',
    starterCode:{javascript:'class NumArray {\n  constructor(nums) {\n  }\n  update(index, val) {\n  }\n  sumRange(left, right) {\n  }\n}',python:'class NumArray:\n    def __init__(self, nums):\n        pass\n    def update(self, index, val):\n        pass\n    def sumRange(self, left, right):\n        pass'},
    testCases:[{input:'["NumArray", "sumRange", "update", "sumRange"], [[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]',expectedOutput:'[null, 9, null, 8]',isHidden:false}],
    hints:['Use a Segment Tree or Binary Indexed Tree (Fenwick Tree)']},

  { title:'Count of Smaller Numbers After Self',slug:'count-of-smaller-numbers-after-self',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','segment-tree'],xpReward:300,
    description:'## Count of Smaller Numbers After Self\n\nGiven an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.\n\n### Example\n`[5,2,6,1]` → `[2,1,1,0]`',
    starterCode:{javascript:'function countSmaller(nums) {\n  // Your code here\n}',python:'def countSmaller(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[5,2,6,1]',expectedOutput:'[2,1,1,0]',isHidden:false}],
    hints:['Merge sort and count inversions, or Fenwick tree']},

  { title:'Reverse Pairs',slug:'reverse-pairs',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','segment-tree'],xpReward:300,
    description:'## Reverse Pairs\n\nGiven an integer array `nums`, return the number of reverse pairs in the array. A reverse pair is a pair `(i, j)` where `0 <= i < j < nums.length` and `nums[i] > 2 * nums[j]`.\n\n### Example\n`[1,3,2,3,1]` → `2`',
    starterCode:{javascript:'function reversePairs(nums) {\n  // Your code here\n}',python:'def reversePairs(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,3,2,3,1]',expectedOutput:'2',isHidden:false}],
    hints:['Modified merge sort']},

  { title:'Implement Trie',slug:'implement-trie',difficulty:'advanced',category:'algorithms',tags:['algorithm-expert','trie'],xpReward:200,
    description:'## Implement Trie (Prefix Tree)\n\nA trie or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class.\n\n### Example\n`["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]` → `[null, null, true, false, true, null, true]`',
    starterCode:{javascript:'class Trie {\n  constructor() {}\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}',python:'class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word):\n        pass\n    def search(self, word):\n        pass\n    def startsWith(self, prefix):\n        pass'},
    testCases:[{input:'["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',expectedOutput:'[null, null, true, false, true, null, true]',isHidden:false}],
    hints:['Use nested dictionaries or maps for nodes']},

  { title:'Word Search II',slug:'word-search-ii',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','trie'],xpReward:300,
    description:'## Word Search II\n\nGiven an `m x n` board of characters and a list of strings `words`, return all words on the board.\n\n### Example\n`[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]` → `["eat","oath"]`',
    starterCode:{javascript:'function findWords(board, words) {\n  // Your code here\n}',python:'def findWords(board, words):\n    # Your code here\n    pass'},
    testCases:[{input:'[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]',expectedOutput:'["eat","oath"]',isHidden:false}],
    hints:['Build a Trie of the words and run DFS on the board']},

  { title:'Find Median from Data Stream',slug:'find-median-from-data-stream',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','heap'],xpReward:300,
    description:'## Find Median from Data Stream\n\nImplement the MedianFinder class to find the median of a stream of integers.\n\n### Example\n`["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], [[], [1], [2], [], [3], []]` → `[null, null, null, 1.5, null, 2.0]`',
    starterCode:{javascript:'class MedianFinder {\n  constructor() {}\n  addNum(num) {}\n  findMedian() {}\n}',python:'class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num):\n        pass\n    def findMedian(self):\n        pass'},
    testCases:[{input:'["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], [[], [1], [2], [], [3], []]',expectedOutput:'[null, null, null, 1.5, null, 2.0]',isHidden:false}],
    hints:['Use two heaps (max-heap for smaller half, min-heap for larger half)']},

  { title:'Serialize and Deserialize Binary Tree',slug:'serialize-and-deserialize-binary-tree',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','trees'],xpReward:300,
    description:'## Serialize and Deserialize Binary Tree\n\nDesign an algorithm to serialize and deserialize a binary tree.\n\n### Example\n`[1,2,3,null,null,4,5]` → `[1,2,3,null,null,4,5]`',
    starterCode:{javascript:'function serialize(root) {\n}\nfunction deserialize(data) {\n}',python:'def serialize(root):\n    pass\ndef deserialize(data):\n    pass'},
    testCases:[{input:'[1,2,3,null,null,4,5]',expectedOutput:'[1,2,3,null,null,4,5]',isHidden:false}],
    hints:['Preorder or level-order traversal works well']},

  { title:'LFU Cache',slug:'lfu-cache',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','design'],xpReward:300,
    description:'## LFU Cache\n\nDesign and implement a data structure for a Least Frequently Used (LFU) cache.\n\n### Example\n`["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]` → `[null, null, null, 1, null, -1, 3, null, -1, 3, 4]`',
    starterCode:{javascript:'class LFUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}',python:'class LFUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass'},
    testCases:[{input:'["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]',expectedOutput:'[null, null, null, 1, null, -1, 3, null, -1, 3, 4]',isHidden:false}],
    hints:['Use two hashmaps: one for key-value, one for frequency-keys']},

  { title:'LRU Cache',slug:'lru-cache',difficulty:'expert',category:'algorithms',tags:['algorithm-expert','design'],xpReward:300,
    description:'## LRU Cache\n\nImplement a function that simulates LRU cache operations. Given capacity and operations array, return get results.\n\n### Example\n`2, [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]]` → `[1,-1]`',
    starterCode:{javascript:'function lruCache(capacity, operations) {\n  // Your code here\n}',python:'def lru_cache(capacity, operations):\n    # Your code here\n    pass'},
    testCases:[{input:'2, [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]]',expectedOutput:'[1,-1]',isHidden:false}],
    hints:['Use a Map for O(1) access + track insertion order']},

  // ═══════════════════ FRONTEND ENGINEERING ═══════════════════
  // Tier 1
  { title:'Reverse String',slug:'reverse-string',difficulty:'beginner',category:'frontend',tags:['html-css-layouts','strings'],xpReward:50,
    description:'## Reverse String\n\nReverse an array of characters.\n\n### Example\n`["h","e","l","l","o"]` → `["o","l","l","e","h"]`',
    starterCode:{javascript:'function reverseString(s) {\n  // Your code here\n}',python:'def reverse_string(s):\n    # Your code here\n    pass'},
    testCases:[{input:'["h","e","l","l","o"]',expectedOutput:'["o","l","l","e","h"]',isHidden:false},{input:'["H","a","n"]',expectedOutput:'["n","a","H"]',isHidden:false}],
    hints:['Two pointers swap']},

  { title:'Palindrome Check',slug:'palindrome-check',difficulty:'beginner',category:'frontend',tags:['js-dom-manipulation','strings'],xpReward:50,
    description:'## Palindrome Check\n\nReturn `true` if the string reads the same backward.\n\n### Example\n`"racecar"` → `true`',
    starterCode:{javascript:'function isPalindrome(s) {\n  // Your code here\n}',python:'def is_palindrome(s):\n    # Your code here\n    pass'},
    testCases:[{input:'"racecar"',expectedOutput:'true',isHidden:false},{input:'"hello"',expectedOutput:'false',isHidden:false}],
    hints:['Compare string with its reverse']},

  // Tier 2
  { title:'Debounce Function',slug:'debounce-function',difficulty:'intermediate',category:'frontend',tags:['hooks','closures'],xpReward:100,
    description:'## Debounce\n\nReturn the delay value passed in (simplified debounce concept).\n\n### Example\n`300` → `300`',
    starterCode:{javascript:'function debounce(delay) {\n  // Your code here\n}',python:'def debounce(delay):\n    # Your code here\n    pass'},
    testCases:[{input:'300',expectedOutput:'300',isHidden:false},{input:'500',expectedOutput:'500',isHidden:false}],
    hints:['Return the delay']},

  // Tier 3
  { title:'Flatten Nested Array',slug:'flatten-nested-array',difficulty:'advanced',category:'frontend',tags:['state-management','recursion'],xpReward:200,
    description:'## Flatten Array\n\nFlatten a nested array to given depth.\n\n### Example\n`[1,[2,[3,[4]]]], 2` → `[1,2,3,[4]]`',
    starterCode:{javascript:'function flattenArray(arr, depth) {\n  // Your code here\n}',python:'def flatten_array(arr, depth):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,[2,[3,[4]]]], 1',expectedOutput:'[1,2,[3,[4]]]',isHidden:false},{input:'[1,[2,[3,[4]]]], 2',expectedOutput:'[1,2,3,[4]]',isHidden:false}],
    hints:['Recursive flatten with depth counter']},

  // Tier 4
  { title:'Deep Clone Object',slug:'deep-clone-object',difficulty:'advanced',category:'frontend',tags:['performance','web-apis'],xpReward:200,
    description:'## Deep Clone\n\nCreate a deep clone of a nested object.\n\n### Example\n`{"a":1,"b":{"c":2}}` → `{"a":1,"b":{"c":2}}`',
    starterCode:{javascript:'function deepClone(obj) {\n  // Your code here\n}',python:'def deep_clone(obj):\n    # Your code here\n    pass'},
    testCases:[{input:'{"a":1,"b":{"c":2}}',expectedOutput:'{"a":1,"b":{"c":2}}',isHidden:false}],
    hints:['Recursively copy nested objects']},

  // Tier 5
  { title:'Event Emitter',slug:'event-emitter',difficulty:'expert',category:'frontend',tags:['system-ui','design-patterns'],xpReward:300,
    description:'## Event Emitter\n\nReturn the number of listeners registered for the given event count.\n\n### Example\n`3` → `3`',
    starterCode:{javascript:'function eventEmitterCount(n) {\n  return n;\n}',python:'def event_emitter_count(n):\n    return n'},
    testCases:[{input:'3',expectedOutput:'3',isHidden:false},{input:'0',expectedOutput:'0',isHidden:false}],
    hints:['Track listeners in a map']},

  // ═══════════════════ BACKEND ENGINEERING ═══════════════════
  // Tier 1
  { title:'HTTP Status Codes',slug:'http-status-codes',difficulty:'beginner',category:'backend',tags:['crud-apis','http'],xpReward:50,
    description:'## HTTP Status\n\nReturn the HTTP status code for "Not Found".\n\n### Example\n`"Not Found"` → `404`',
    starterCode:{javascript:'function getStatusCode(status) {\n  // Your code here\n}',python:'def get_status_code(status):\n    # Your code here\n    pass'},
    testCases:[{input:'"Not Found"',expectedOutput:'404',isHidden:false},{input:'"OK"',expectedOutput:'200',isHidden:false},{input:'"Internal Server Error"',expectedOutput:'500',isHidden:true}],
    hints:['Use a lookup map']},

  { title:'Parse Query String',slug:'parse-query-string',difficulty:'beginner',category:'backend',tags:['middleware-logic','parsing'],xpReward:50,
    description:'## Parse Query String\n\nParse `"a=1&b=2"` into `{"a":"1","b":"2"}`.\n\n### Example\n`"a=1&b=2"` → `{"a":"1","b":"2"}`',
    starterCode:{javascript:'function parseQuery(qs) {\n  // Your code here\n}',python:'def parse_query(qs):\n    # Your code here\n    pass'},
    testCases:[{input:'"a=1&b=2"',expectedOutput:'{"a":"1","b":"2"}',isHidden:false},{input:'"x=hello"',expectedOutput:'{"x":"hello"}',isHidden:false}],
    hints:['Split by & then by =']},

  // Tier 2
  { title:'JWT Payload Decode',slug:'jwt-payload-decode',difficulty:'intermediate',category:'backend',tags:['authentication-basics','jwt'],xpReward:100,
    description:'## JWT Parts\n\nReturn the number of parts in a JWT token string.\n\n### Example\n`"header.payload.signature"` → `3`',
    starterCode:{javascript:'function jwtParts(token) {\n  // Your code here\n}',python:'def jwt_parts(token):\n    # Your code here\n    pass'},
    testCases:[{input:'"header.payload.signature"',expectedOutput:'3',isHidden:false},{input:'"a.b.c"',expectedOutput:'3',isHidden:false}],
    hints:['Split by dot']},

  // Tier 3
  { title:'Rate Limiter',slug:'rate-limiter',difficulty:'advanced',category:'backend',tags:['caching','rate-limiting'],xpReward:200,
    description:'## Rate Limiter\n\nGiven max requests and current count, return `true` if request is allowed.\n\n### Example\n`5, 3` → `true`',
    starterCode:{javascript:'function isAllowed(max, current) {\n  // Your code here\n}',python:'def is_allowed(max_req, current):\n    # Your code here\n    pass'},
    testCases:[{input:'5, 3',expectedOutput:'true',isHidden:false},{input:'5, 5',expectedOutput:'false',isHidden:false},{input:'10, 0',expectedOutput:'true',isHidden:true}],
    hints:['Compare current < max']},

  // Tier 4
  { title:'Consistent Hash',slug:'consistent-hash',difficulty:'expert',category:'backend',tags:['load-balancing','microservices'],xpReward:300,
    description:'## Consistent Hashing\n\nGiven servers array and a key number, return which server handles it (modular hash).\n\n### Example\n`["A","B","C"], 7` → `"B"`',
    starterCode:{javascript:'function consistentHash(servers, key) {\n  // Your code here\n}',python:'def consistent_hash(servers, key):\n    # Your code here\n    pass'},
    testCases:[{input:'["A","B","C"], 7',expectedOutput:'"B"',isHidden:false},{input:'["X","Y"], 4',expectedOutput:'"X"',isHidden:false}],
    hints:['key % servers.length']},

  // ═══════════════════ SYSTEM DESIGN ═══════════════════
  // Tier 1 — Fundamentals
  { title:'URL Shortener Simulator',slug:'url-shortener-simulator',difficulty:'beginner',category:'system-design',tags:['url-shortener','encoding'],xpReward:50,
    description:'## URL Shortener Simulator\n\nImplement an `encode(longUrl)` function that returns a shortened string, and a `decode(shortUrl)` function that retrieves the original. (For simplicity, just use a map!).\n\n### Example\n`"https://devarena.com"` → `"1"` → `"https://devarena.com"`',
    starterCode:{javascript:'const map = {};\nlet id = 1;\nfunction encode(longUrl) {\n  // return short string\n}\nfunction decode(shortUrl) {\n  // return original\n}',python:'map = {}\nid_count = 1\ndef encode(longUrl):\n    pass\ndef decode(shortUrl):\n    pass'},
    testCases:[{input:'"https://devarena.com"',expectedOutput:'"https://devarena.com"',isHidden:false}],
    hints:['Use an auto-incrementing ID and a hash map']},

  { title:'Round Robin LB',slug:'round-robin-lb',difficulty:'beginner',category:'system-design',tags:['url-shortener','load-balancing'],xpReward:50,
    description:'## Round Robin\n\nGiven servers and request number n, return which server handles it.\n\n### Example\n`["A","B","C"], 4` → `"B"`',
    starterCode:{javascript:'function roundRobin(servers, n) {\n  // Your code here\n}',python:'def round_robin(servers, n):\n    # Your code here\n    pass'},
    testCases:[{input:'["A","B","C"], 0',expectedOutput:'"A"',isHidden:false},{input:'["A","B","C"], 4',expectedOutput:'"B"',isHidden:false}],
    hints:['n % servers.length']},

  { title:'Base62 Encode',slug:'base62-encode',difficulty:'beginner',category:'system-design',tags:['url-shortener','encoding'],xpReward:50,
    description:'## Base62 Encode\n\nReturn the length of base62 encoding needed for a number.\n\n### Example\n`100` → `2`',
    starterCode:{javascript:'function base62Length(num) {\n  // Your code here\n}',python:'def base62_length(num):\n    # Your code here\n    pass'},
    testCases:[{input:'0',expectedOutput:'1',isHidden:false},{input:'100',expectedOutput:'2',isHidden:false},{input:'62',expectedOutput:'2',isHidden:true}],
    hints:['Divide by 62 repeatedly']},

  // Tier 2 — Storage Systems
  { title:'Cache Hit Rate',slug:'cache-hit-rate',difficulty:'intermediate',category:'system-design',tags:['chat-system','caching'],xpReward:100,
    description:'## Cache Hit Rate\n\nGiven hits and total requests, return hit rate as percentage (integer).\n\n### Example\n`75, 100` → `75`',
    starterCode:{javascript:'function cacheHitRate(hits, total) {\n  // Your code here\n}',python:'def cache_hit_rate(hits, total):\n    # Your code here\n    pass'},
    testCases:[{input:'75, 100',expectedOutput:'75',isHidden:false},{input:'0, 50',expectedOutput:'0',isHidden:false},{input:'33, 100',expectedOutput:'33',isHidden:true}],
    hints:['Math.floor(hits/total * 100)']},

  { title:'Distributed Cache TTL',slug:'distributed-cache-ttl',difficulty:'intermediate',category:'system-design',tags:['distributed-cache','caching'],xpReward:100,
    description:'## Cache TTL Eviction\n\nGiven a list of cache entries `[key, timestamp, ttl]` and a current time `T`, return a list of keys that are still valid (timestamp + ttl >= T).\n\n### Example\n`[["A", 10, 5], ["B", 12, 10]], 16` → `["B"]`',
    starterCode:{javascript:'function validCacheKeys(entries, T) {\n  // Your code here\n}',python:'def validCacheKeys(entries, T):\n    # Your code here\n    pass'},
    testCases:[{input:'[["A", 10, 5], ["B", 12, 10]], 16',expectedOutput:'["B"]',isHidden:false}],
    hints:['Filter entries where timestamp + ttl >= T']},

  // Tier 2 — Compute
  { title:'Token Bucket Rate Limiter',slug:'token-bucket-rate-limiter',difficulty:'intermediate',category:'system-design',tags:['chat-system','notification-system'],xpReward:100,
    description:'## Token Bucket Simulator\n\nGiven a `capacity` of tokens, a `refillRate` per second, and a list of request timestamps `[1, 1, 1, 2, 2, 3]`, return `true` if all requests pass, or `false` if any gets dropped.\n\n### Example\n`3, 1, [1, 1, 1, 1]` → `false`',
    starterCode:{javascript:'function simulateRateLimiter(capacity, refillRate, requests) {\n  // Your code here\n}',python:'def simulateRateLimiter(capacity, refillRate, requests):\n    # Your code here\n    pass'},
    testCases:[{input:'3, 1, [1, 1, 1, 1]',expectedOutput:'false',isHidden:false}],
    hints:['Track current tokens and refill based on time difference']},

  // Tier 3 — Distributed Systems
  { title:'Partition Data',slug:'partition-data',difficulty:'advanced',category:'system-design',tags:['news-feed','distributed'],xpReward:200,
    description:'## Data Partitioning\n\nGiven total items and partition count, return items per partition.\n\n### Example\n`100, 3` → `[34,33,33]`',
    starterCode:{javascript:'function partition(total, parts) {\n  // Your code here\n}',python:'def partition(total, parts):\n    # Your code here\n    pass'},
    testCases:[{input:'100, 3',expectedOutput:'[34,33,33]',isHidden:false},{input:'10, 2',expectedOutput:'[5,5]',isHidden:false}],
    hints:['Distribute remainder across first partitions']},

  { title:'Merge News Feeds',slug:'merge-news-feeds',difficulty:'advanced',category:'system-design',tags:['news-feed','distributed'],xpReward:200,
    description:'## Merge Distributed Feeds\n\nGiven a list of arrays representing sorted feed posts (by timestamp) from different users, merge them into a single sorted feed (similar to Merge K Sorted Lists).\n\n### Example\n`[[10, 8, 5], [9, 7], [6, 2]]` → `[10, 9, 8, 7, 6, 5, 2]`',
    starterCode:{javascript:'function mergeFeeds(feeds) {\n  // Your code here\n}',python:'def mergeFeeds(feeds):\n    # Your code here\n    pass'},
    testCases:[{input:'[[10, 8, 5], [9, 7], [6, 2]]',expectedOutput:'[10, 9, 8, 7, 6, 5, 2]',isHidden:false}],
    hints:['Use a heap or iterative merge']},

  // Tier 4 — Cloud Architecture
  { title:'CDN Edge Routing',slug:'cdn-edge-routing',difficulty:'advanced',category:'system-design',tags:['cdn-system'],xpReward:200,
    description:'## CDN Edge Routing\n\nGiven a user location `[ux, uy]` and a list of CDN nodes `[[nx, ny]]`, return the index of the closest CDN node using Euclidean distance.\n\n### Example\n`[0, 0], [[3, 4], [1, 1], [5, 5]]` → `1`',
    starterCode:{javascript:'function findClosestCDN(user, nodes) {\n  // Your code here\n}',python:'def findClosestCDN(user, nodes):\n    # Your code here\n    pass'},
    testCases:[{input:'[0, 0], [[3, 4], [1, 1], [5, 5]]',expectedOutput:'1',isHidden:false}],
    hints:['Calculate (nx-ux)^2 + (ny-uy)^2 for each node']},

  // Tier 4 — Interview Prep
  { title:'Sharding Key',slug:'sharding-key',difficulty:'advanced',category:'system-design',tags:['instagram','sharding'],xpReward:200,
    description:'## Shard Selection\n\nGiven a user ID and shard count, return which shard the user belongs to.\n\n### Example\n`12345, 8` → `1`',
    starterCode:{javascript:'function getShard(userId, shardCount) {\n  // Your code here\n}',python:'def get_shard(user_id, shard_count):\n    # Your code here\n    pass'},
    testCases:[{input:'12345, 8',expectedOutput:'1',isHidden:false},{input:'100, 10',expectedOutput:'0',isHidden:false}],
    hints:['userId % shardCount']},

  // Tier 5 — Architect
  { title:'Bloom Filter Size',slug:'bloom-filter-size',difficulty:'expert',category:'system-design',tags:['search-engine','probabilistic'],xpReward:300,
    description:'## Bloom Filter\n\nGiven n items and false positive rate p (as percentage integer), return optimal bit array size m = ceil(n * 10).\n\n### Example\n`1000, 1` → `10000`',
    starterCode:{javascript:'function bloomFilterSize(n, p) {\n  // Your code here\n}',python:'def bloom_filter_size(n, p):\n    # Your code here\n    pass'},
    testCases:[{input:'1000, 1',expectedOutput:'10000',isHidden:false},{input:'500, 5',expectedOutput:'5000',isHidden:false}],
    hints:['m = ceil(n * 10)']},

  { title:'Autocomplete Trie',slug:'autocomplete-trie',difficulty:'expert',category:'system-design',tags:['search-engine'],xpReward:300,
    description:'## Typeahead Search\n\nGiven a list of search queries and a prefix, return all queries that start with that prefix (simulating a search engine autocomplete).\n\n### Example\n`["system design", "systemctl", "sysadmin", "software"], "sys"` → `["system design", "systemctl", "sysadmin"]`',
    starterCode:{javascript:'function autocomplete(queries, prefix) {\n  // Your code here\n}',python:'def autocomplete(queries, prefix):\n    # Your code here\n    pass'},
    testCases:[{input:'["system design", "systemctl", "sysadmin", "software"], "sys"',expectedOutput:'["system design", "systemctl", "sysadmin"]',isHidden:false}],
    hints:['Filter the array or build a prefix tree']},

  // ═══════════════════ CROSS-CATEGORY BONUS ═══════════════════
  { title:'Best Time to Buy Stock',slug:'best-time-to-buy-stock',difficulty:'intermediate',category:'algorithms',tags:['arrays','dynamic-programming'],xpReward:100,
    description:'## Buy and Sell Stock\n\nMaximize profit from one buy and one sell.\n\n### Example\n`[7,1,5,3,6,4]` → `5`',
    starterCode:{javascript:'function maxProfit(prices) {\n  // Your code here\n}',python:'def max_profit(prices):\n    # Your code here\n    pass'},
    testCases:[{input:'[7,1,5,3,6,4]',expectedOutput:'5',isHidden:false},{input:'[7,6,4,3,1]',expectedOutput:'0',isHidden:false}],
    hints:['Track minimum price seen so far']},

  { title:'Missing Number',slug:'missing-number',difficulty:'intermediate',category:'algorithms',tags:['arrays','math'],xpReward:100,
    description:'## Missing Number\n\nFind the missing number in range [0, n].\n\n### Example\n`[3,0,1]` → `2`',
    starterCode:{javascript:'function missingNumber(nums) {\n  // Your code here\n}',python:'def missing_number(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[3,0,1]',expectedOutput:'2',isHidden:false},{input:'[0,1]',expectedOutput:'2',isHidden:false},{input:'[9,6,4,2,3,5,7,0,1]',expectedOutput:'8',isHidden:true}],
    hints:['Sum formula: n*(n+1)/2']},

  { title:'Product Except Self',slug:'product-except-self',difficulty:'advanced',category:'algorithms',tags:['arrays','prefix-sum'],xpReward:200,
    description:'## Product Except Self\n\nReturn array where each element is product of all others.\n\n### Example\n`[1,2,3,4]` → `[24,12,8,6]`',
    starterCode:{javascript:'function productExceptSelf(nums) {\n  // Your code here\n}',python:'def product_except_self(nums):\n    # Your code here\n    pass'},
    testCases:[{input:'[1,2,3,4]',expectedOutput:'[24,12,8,6]',isHidden:false},{input:'[-1,1,0,-3,3]',expectedOutput:'[0,0,9,0,0]',isHidden:false}],
    hints:['Left products × right products']},
];

module.exports = challenges;
