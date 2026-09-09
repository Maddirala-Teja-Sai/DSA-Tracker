// DSA Questions Dataset — Ordered by Interview Frequency (highest first)
// frequency: 5 = Very High, 4 = High, 3 = Medium, 2 = Low, 1 = Rare

const DEFAULT_QUESTIONS = [
  // ═══════════════════════════════════════════════
  //  EASY
  // ═══════════════════════════════════════════════

  // — Array (Easy) —
  { id: "e1",  level: "Easy", category: "Array",           title: "Two Sum",                          link: "https://leetcode.com/problems/two-sum/",                              platform: "LeetCode",  frequency: 5, topics: ["Hash Map"] },
  { id: "e2",  level: "Easy", category: "Array",           title: "Best Time to Buy and Sell Stock",   link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",       platform: "LeetCode",  frequency: 5, topics: ["Sliding Window","Greedy"] },
  { id: "e3",  level: "Easy", category: "Array",           title: "Contains Duplicate",                link: "https://leetcode.com/problems/contains-duplicate/",                   platform: "LeetCode",  frequency: 5, topics: ["Hash Set"] },
  { id: "e4",  level: "Easy", category: "Array",           title: "Maximum Subarray",                  link: "https://leetcode.com/problems/maximum-subarray/",                     platform: "LeetCode",  frequency: 5, topics: ["Kadane's Algorithm","DP"] },
  { id: "e5",  level: "Easy", category: "Array",           title: "Move Zeroes",                       link: "https://leetcode.com/problems/move-zeroes/",                          platform: "LeetCode",  frequency: 4, topics: ["Two Pointers"] },
  { id: "e6",  level: "Easy", category: "Array",           title: "Plus One",                          link: "https://leetcode.com/problems/plus-one/",                             platform: "LeetCode",  frequency: 4, topics: ["Math"] },
  { id: "e7",  level: "Easy", category: "Array",           title: "Remove Duplicates from Sorted Array",link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", platform: "LeetCode",  frequency: 4, topics: ["Two Pointers"] },
  { id: "e8",  level: "Easy", category: "Array",           title: "Merge Sorted Array",                link: "https://leetcode.com/problems/merge-sorted-array/",                   platform: "LeetCode",  frequency: 4, topics: ["Two Pointers"] },
  { id: "e9",  level: "Easy", category: "Array",           title: "Intersection of Two Arrays II",     link: "https://leetcode.com/problems/intersection-of-two-arrays-ii/",        platform: "LeetCode",  frequency: 3, topics: ["Hash Map","Sorting"] },
  { id: "e10", level: "Easy", category: "Array",           title: "Single Number",                     link: "https://leetcode.com/problems/single-number/",                        platform: "LeetCode",  frequency: 3, topics: ["Bit Manipulation"] },
  { id: "e11", level: "Easy", category: "Array",           title: "Missing Number",                    link: "https://leetcode.com/problems/missing-number/",                       platform: "LeetCode",  frequency: 3, topics: ["Math","Bit Manipulation"] },
  { id: "e12", level: "Easy", category: "Array",           title: "Majority Element",                  link: "https://leetcode.com/problems/majority-element/",                     platform: "LeetCode",  frequency: 4, topics: ["Boyer-Moore Voting"] },
  { id: "e13", level: "Easy", category: "Array",           title: "Pascal's Triangle",                 link: "https://leetcode.com/problems/pascals-triangle/",                     platform: "LeetCode",  frequency: 3, topics: ["Math","DP"] },
  { id: "e14", level: "Easy", category: "Array",           title: "Find Pivot Index",                  link: "https://leetcode.com/problems/find-pivot-index/",                     platform: "LeetCode",  frequency: 3, topics: ["Prefix Sum"] },

  // — String (Easy) —
  { id: "e15", level: "Easy", category: "String",          title: "Valid Anagram",                     link: "https://leetcode.com/problems/valid-anagram/",                        platform: "LeetCode",  frequency: 5, topics: ["Hash Map","Sorting"] },
  { id: "e16", level: "Easy", category: "String",          title: "Valid Palindrome",                  link: "https://leetcode.com/problems/valid-palindrome/",                     platform: "LeetCode",  frequency: 5, topics: ["Two Pointers"] },
  { id: "e17", level: "Easy", category: "String",          title: "Reverse String",                    link: "https://leetcode.com/problems/reverse-string/",                       platform: "LeetCode",  frequency: 4, topics: ["Two Pointers"] },
  { id: "e18", level: "Easy", category: "String",          title: "First Unique Character in a String",link: "https://leetcode.com/problems/first-unique-character-in-a-string/",   platform: "LeetCode",  frequency: 4, topics: ["Hash Map"] },
  { id: "e19", level: "Easy", category: "String",          title: "Longest Common Prefix",             link: "https://leetcode.com/problems/longest-common-prefix/",                platform: "LeetCode",  frequency: 4, topics: ["String"] },
  { id: "e20", level: "Easy", category: "String",          title: "Roman to Integer",                  link: "https://leetcode.com/problems/roman-to-integer/",                     platform: "LeetCode",  frequency: 3, topics: ["Hash Map","Math"] },
  { id: "e21", level: "Easy", category: "String",          title: "Implement strStr()",                link: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", platform: "LeetCode", frequency: 3, topics: ["String Matching"] },

  // — Linked List (Easy) —
  { id: "e22", level: "Easy", category: "Linked List",     title: "Reverse Linked List",               link: "https://leetcode.com/problems/reverse-linked-list/",                  platform: "LeetCode",  frequency: 5, topics: ["Recursion","Iteration"] },
  { id: "e23", level: "Easy", category: "Linked List",     title: "Merge Two Sorted Lists",            link: "https://leetcode.com/problems/merge-two-sorted-lists/",               platform: "LeetCode",  frequency: 5, topics: ["Recursion"] },
  { id: "e24", level: "Easy", category: "Linked List",     title: "Linked List Cycle",                 link: "https://leetcode.com/problems/linked-list-cycle/",                    platform: "LeetCode",  frequency: 5, topics: ["Floyd's Cycle","Two Pointers"] },
  { id: "e25", level: "Easy", category: "Linked List",     title: "Middle of the Linked List",         link: "https://leetcode.com/problems/middle-of-the-linked-list/",            platform: "LeetCode",  frequency: 4, topics: ["Two Pointers"] },
  { id: "e26", level: "Easy", category: "Linked List",     title: "Remove Duplicates from Sorted List",link: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",   platform: "LeetCode",  frequency: 3, topics: ["Linked List"] },
  { id: "e27", level: "Easy", category: "Linked List",     title: "Palindrome Linked List",            link: "https://leetcode.com/problems/palindrome-linked-list/",               platform: "LeetCode",  frequency: 4, topics: ["Two Pointers","Stack"] },

  // — Stack & Queue (Easy) —
  { id: "e28", level: "Easy", category: "Stack & Queue",   title: "Valid Parentheses",                 link: "https://leetcode.com/problems/valid-parentheses/",                    platform: "LeetCode",  frequency: 5, topics: ["Stack"] },
  { id: "e29", level: "Easy", category: "Stack & Queue",   title: "Min Stack",                         link: "https://leetcode.com/problems/min-stack/",                            platform: "LeetCode",  frequency: 4, topics: ["Stack","Design"] },
  { id: "e30", level: "Easy", category: "Stack & Queue",   title: "Implement Queue using Stacks",      link: "https://leetcode.com/problems/implement-queue-using-stacks/",         platform: "LeetCode",  frequency: 4, topics: ["Stack","Queue","Design"] },

  // — Trees (Easy) —
  { id: "e31", level: "Easy", category: "Trees",           title: "Maximum Depth of Binary Tree",      link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",         platform: "LeetCode",  frequency: 5, topics: ["DFS","Recursion"] },
  { id: "e32", level: "Easy", category: "Trees",           title: "Invert Binary Tree",                link: "https://leetcode.com/problems/invert-binary-tree/",                   platform: "LeetCode",  frequency: 5, topics: ["DFS","BFS"] },
  { id: "e33", level: "Easy", category: "Trees",           title: "Symmetric Tree",                    link: "https://leetcode.com/problems/symmetric-tree/",                       platform: "LeetCode",  frequency: 4, topics: ["DFS","BFS"] },
  { id: "e34", level: "Easy", category: "Trees",           title: "Same Tree",                         link: "https://leetcode.com/problems/same-tree/",                            platform: "LeetCode",  frequency: 4, topics: ["DFS"] },
  { id: "e35", level: "Easy", category: "Trees",           title: "Subtree of Another Tree",           link: "https://leetcode.com/problems/subtree-of-another-tree/",              platform: "LeetCode",  frequency: 4, topics: ["DFS","String Matching"] },
  { id: "e36", level: "Easy", category: "Trees",           title: "Diameter of Binary Tree",           link: "https://leetcode.com/problems/diameter-of-binary-tree/",              platform: "LeetCode",  frequency: 4, topics: ["DFS"] },
  { id: "e37", level: "Easy", category: "Trees",           title: "Balanced Binary Tree",              link: "https://leetcode.com/problems/balanced-binary-tree/",                 platform: "LeetCode",  frequency: 3, topics: ["DFS"] },
  { id: "e38", level: "Easy", category: "Trees",           title: "Path Sum",                          link: "https://leetcode.com/problems/path-sum/",                             platform: "LeetCode",  frequency: 3, topics: ["DFS"] },

  // — Binary Search (Easy) —
  { id: "e39", level: "Easy", category: "Binary Search",   title: "Binary Search",                     link: "https://leetcode.com/problems/binary-search/",                        platform: "LeetCode",  frequency: 5, topics: ["Binary Search"] },
  { id: "e40", level: "Easy", category: "Binary Search",   title: "First Bad Version",                 link: "https://leetcode.com/problems/first-bad-version/",                    platform: "LeetCode",  frequency: 4, topics: ["Binary Search"] },
  { id: "e41", level: "Easy", category: "Binary Search",   title: "Search Insert Position",            link: "https://leetcode.com/problems/search-insert-position/",               platform: "LeetCode",  frequency: 3, topics: ["Binary Search"] },
  { id: "e42", level: "Easy", category: "Binary Search",   title: "Sqrt(x)",                           link: "https://leetcode.com/problems/sqrtx/",                                platform: "LeetCode",  frequency: 3, topics: ["Binary Search","Math"] },

  // — Math / Bit Manipulation (Easy) —
  { id: "e43", level: "Easy", category: "Math",            title: "Fizz Buzz",                         link: "https://leetcode.com/problems/fizz-buzz/",                            platform: "LeetCode",  frequency: 4, topics: ["Math","Simulation"] },
  { id: "e44", level: "Easy", category: "Math",            title: "Count Primes",                      link: "https://leetcode.com/problems/count-primes/",                         platform: "LeetCode",  frequency: 3, topics: ["Sieve of Eratosthenes"] },
  { id: "e45", level: "Easy", category: "Math",            title: "Power of Two",                      link: "https://leetcode.com/problems/power-of-two/",                         platform: "LeetCode",  frequency: 3, topics: ["Bit Manipulation"] },
  { id: "e46", level: "Easy", category: "Math",            title: "Reverse Integer",                   link: "https://leetcode.com/problems/reverse-integer/",                      platform: "LeetCode",  frequency: 4, topics: ["Math"] },
  { id: "e47", level: "Easy", category: "Math",            title: "Palindrome Number",                 link: "https://leetcode.com/problems/palindrome-number/",                    platform: "LeetCode",  frequency: 4, topics: ["Math"] },
  { id: "e48", level: "Easy", category: "Bit Manipulation",title: "Number of 1 Bits",                  link: "https://leetcode.com/problems/number-of-1-bits/",                     platform: "LeetCode",  frequency: 3, topics: ["Bit Manipulation"] },
  { id: "e49", level: "Easy", category: "Bit Manipulation",title: "Reverse Bits",                      link: "https://leetcode.com/problems/reverse-bits/",                         platform: "LeetCode",  frequency: 3, topics: ["Bit Manipulation"] },
  { id: "e50", level: "Easy", category: "Bit Manipulation",title: "Counting Bits",                     link: "https://leetcode.com/problems/counting-bits/",                        platform: "LeetCode",  frequency: 3, topics: ["DP","Bit Manipulation"] },

  // — Greedy (Easy) —
  { id: "e51", level: "Easy", category: "Greedy",          title: "Assign Cookies",                    link: "https://leetcode.com/problems/assign-cookies/",                       platform: "LeetCode",  frequency: 3, topics: ["Greedy","Sorting"] },
  { id: "e52", level: "Easy", category: "Greedy",          title: "Lemonade Change",                   link: "https://leetcode.com/problems/lemonade-change/",                      platform: "LeetCode",  frequency: 3, topics: ["Greedy","Simulation"] },

  // — DP (Easy) —
  { id: "e53", level: "Easy", category: "Dynamic Programming", title: "Climbing Stairs",               link: "https://leetcode.com/problems/climbing-stairs/",                      platform: "LeetCode",  frequency: 5, topics: ["DP","Fibonacci"] },
  { id: "e54", level: "Easy", category: "Dynamic Programming", title: "House Robber",                  link: "https://leetcode.com/problems/house-robber/",                         platform: "LeetCode",  frequency: 4, topics: ["DP"] },
  { id: "e55", level: "Easy", category: "Dynamic Programming", title: "Min Cost Climbing Stairs",      link: "https://leetcode.com/problems/min-cost-climbing-stairs/",             platform: "LeetCode",  frequency: 3, topics: ["DP"] },

  // ═══════════════════════════════════════════════
  //  MEDIUM
  // ═══════════════════════════════════════════════

  // — Array (Medium) —
  { id: "m1",  level: "Medium", category: "Array",         title: "3Sum",                              link: "https://leetcode.com/problems/3sum/",                                 platform: "LeetCode",  frequency: 5, topics: ["Two Pointers","Sorting"] },
  { id: "m2",  level: "Medium", category: "Array",         title: "Product of Array Except Self",      link: "https://leetcode.com/problems/product-of-array-except-self/",         platform: "LeetCode",  frequency: 5, topics: ["Prefix Sum"] },
  { id: "m3",  level: "Medium", category: "Array",         title: "Container With Most Water",         link: "https://leetcode.com/problems/container-with-most-water/",            platform: "LeetCode",  frequency: 5, topics: ["Two Pointers","Greedy"] },
  { id: "m4",  level: "Medium", category: "Array",         title: "Next Permutation",                  link: "https://leetcode.com/problems/next-permutation/",                     platform: "LeetCode",  frequency: 4, topics: ["Array","Math"] },
  { id: "m5",  level: "Medium", category: "Array",         title: "Sort Colors",                       link: "https://leetcode.com/problems/sort-colors/",                          platform: "LeetCode",  frequency: 5, topics: ["Dutch National Flag","Two Pointers"] },
  { id: "m6",  level: "Medium", category: "Array",         title: "Subarray Sum Equals K",             link: "https://leetcode.com/problems/subarray-sum-equals-k/",               platform: "LeetCode",  frequency: 5, topics: ["Prefix Sum","Hash Map"] },
  { id: "m7",  level: "Medium", category: "Array",         title: "Spiral Matrix",                     link: "https://leetcode.com/problems/spiral-matrix/",                        platform: "LeetCode",  frequency: 4, topics: ["Matrix","Simulation"] },
  { id: "m8",  level: "Medium", category: "Array",         title: "Set Matrix Zeroes",                 link: "https://leetcode.com/problems/set-matrix-zeroes/",                    platform: "LeetCode",  frequency: 4, topics: ["Matrix"] },
  { id: "m9",  level: "Medium", category: "Array",         title: "Rotate Image",                      link: "https://leetcode.com/problems/rotate-image/",                         platform: "LeetCode",  frequency: 4, topics: ["Matrix","Math"] },
  { id: "m10", level: "Medium", category: "Array",         title: "4Sum",                              link: "https://leetcode.com/problems/4sum/",                                 platform: "LeetCode",  frequency: 3, topics: ["Two Pointers","Sorting"] },
  { id: "m11", level: "Medium", category: "Array",         title: "Longest Consecutive Sequence",      link: "https://leetcode.com/problems/longest-consecutive-sequence/",          platform: "LeetCode",  frequency: 5, topics: ["Hash Set","Union Find"] },
  { id: "m12", level: "Medium", category: "Array",         title: "Find the Duplicate Number",         link: "https://leetcode.com/problems/find-the-duplicate-number/",            platform: "LeetCode",  frequency: 4, topics: ["Floyd's Cycle","Binary Search"] },
  { id: "m13", level: "Medium", category: "Array",         title: "Merge Intervals",                   link: "https://leetcode.com/problems/merge-intervals/",                      platform: "LeetCode",  frequency: 5, topics: ["Sorting","Intervals"] },
  { id: "m14", level: "Medium", category: "Array",         title: "Insert Interval",                   link: "https://leetcode.com/problems/insert-interval/",                      platform: "LeetCode",  frequency: 4, topics: ["Intervals"] },
  { id: "m15", level: "Medium", category: "Array",         title: "Non-overlapping Intervals",         link: "https://leetcode.com/problems/non-overlapping-intervals/",            platform: "LeetCode",  frequency: 3, topics: ["Greedy","Sorting"] },
  { id: "m16", level: "Medium", category: "Array",         title: "Top K Frequent Elements",           link: "https://leetcode.com/problems/top-k-frequent-elements/",              platform: "LeetCode",  frequency: 5, topics: ["Heap","Hash Map","Bucket Sort"] },
  { id: "m17", level: "Medium", category: "Array",         title: "Kth Largest Element in an Array",   link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",      platform: "LeetCode",  frequency: 5, topics: ["Heap","Quick Select"] },

  // — String (Medium) —
  { id: "m18", level: "Medium", category: "String",        title: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", platform: "LeetCode", frequency: 5, topics: ["Sliding Window","Hash Set"] },
  { id: "m19", level: "Medium", category: "String",        title: "Longest Palindromic Substring",     link: "https://leetcode.com/problems/longest-palindromic-substring/",        platform: "LeetCode",  frequency: 5, topics: ["DP","Expand Around Center"] },
  { id: "m20", level: "Medium", category: "String",        title: "Group Anagrams",                    link: "https://leetcode.com/problems/group-anagrams/",                       platform: "LeetCode",  frequency: 5, topics: ["Hash Map","Sorting"] },
  { id: "m21", level: "Medium", category: "String",        title: "String to Integer (atoi)",           link: "https://leetcode.com/problems/string-to-integer-atoi/",               platform: "LeetCode",  frequency: 4, topics: ["String","Math"] },
  { id: "m22", level: "Medium", category: "String",        title: "Palindromic Substrings",            link: "https://leetcode.com/problems/palindromic-substrings/",               platform: "LeetCode",  frequency: 4, topics: ["DP","Two Pointers"] },
  { id: "m23", level: "Medium", category: "String",        title: "Encode and Decode Strings",         link: "https://leetcode.com/problems/encode-and-decode-strings/",            platform: "LeetCode",  frequency: 4, topics: ["String","Design"] },
  { id: "m24", level: "Medium", category: "String",        title: "Minimum Window Substring",          link: "https://leetcode.com/problems/minimum-window-substring/",             platform: "LeetCode",  frequency: 4, topics: ["Sliding Window","Hash Map"] },

  // — Sliding Window (Medium) —
  { id: "m25", level: "Medium", category: "Sliding Window",title: "Longest Repeating Character Replacement", link: "https://leetcode.com/problems/longest-repeating-character-replacement/", platform: "LeetCode", frequency: 4, topics: ["Sliding Window"] },
  { id: "m26", level: "Medium", category: "Sliding Window",title: "Permutation in String",             link: "https://leetcode.com/problems/permutation-in-string/",                platform: "LeetCode",  frequency: 4, topics: ["Sliding Window","Hash Map"] },
  { id: "m27", level: "Medium", category: "Sliding Window",title: "Fruit Into Baskets",                link: "https://leetcode.com/problems/fruit-into-baskets/",                   platform: "LeetCode",  frequency: 3, topics: ["Sliding Window","Hash Map"] },
  { id: "m28", level: "Medium", category: "Sliding Window",title: "Max Consecutive Ones III",          link: "https://leetcode.com/problems/max-consecutive-ones-iii/",             platform: "LeetCode",  frequency: 3, topics: ["Sliding Window"] },

  // — Two Pointers (Medium) —
  { id: "m29", level: "Medium", category: "Two Pointers",  title: "3Sum Closest",                      link: "https://leetcode.com/problems/3sum-closest/",                         platform: "LeetCode",  frequency: 3, topics: ["Two Pointers","Sorting"] },

  // — Linked List (Medium) —
  { id: "m30", level: "Medium", category: "Linked List",   title: "Add Two Numbers",                   link: "https://leetcode.com/problems/add-two-numbers/",                      platform: "LeetCode",  frequency: 5, topics: ["Linked List","Math"] },
  { id: "m31", level: "Medium", category: "Linked List",   title: "Remove Nth Node From End of List",  link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",     platform: "LeetCode",  frequency: 5, topics: ["Two Pointers"] },
  { id: "m32", level: "Medium", category: "Linked List",   title: "Linked List Cycle II",              link: "https://leetcode.com/problems/linked-list-cycle-ii/",                 platform: "LeetCode",  frequency: 4, topics: ["Floyd's Cycle"] },
  { id: "m33", level: "Medium", category: "Linked List",   title: "Reorder List",                      link: "https://leetcode.com/problems/reorder-list/",                         platform: "LeetCode",  frequency: 4, topics: ["Two Pointers","Linked List"] },
  { id: "m34", level: "Medium", category: "Linked List",   title: "Copy List with Random Pointer",     link: "https://leetcode.com/problems/copy-list-with-random-pointer/",        platform: "LeetCode",  frequency: 4, topics: ["Hash Map","Linked List"] },
  { id: "m35", level: "Medium", category: "Linked List",   title: "Flatten a Linked List",             link: "https://www.geeksforgeeks.org/flattening-a-linked-list/",             platform: "GFG",       frequency: 4, topics: ["Merge Sort","Linked List"] },
  { id: "m36", level: "Medium", category: "Linked List",   title: "Rotate List",                       link: "https://leetcode.com/problems/rotate-list/",                          platform: "LeetCode",  frequency: 3, topics: ["Linked List"] },
  { id: "m37", level: "Medium", category: "Linked List",   title: "Sort List",                         link: "https://leetcode.com/problems/sort-list/",                            platform: "LeetCode",  frequency: 3, topics: ["Merge Sort","Linked List"] },

  // — Stack & Queue (Medium) —
  { id: "m38", level: "Medium", category: "Stack & Queue", title: "Daily Temperatures",                link: "https://leetcode.com/problems/daily-temperatures/",                   platform: "LeetCode",  frequency: 4, topics: ["Monotonic Stack"] },
  { id: "m39", level: "Medium", category: "Stack & Queue", title: "Next Greater Element II",           link: "https://leetcode.com/problems/next-greater-element-ii/",              platform: "LeetCode",  frequency: 3, topics: ["Monotonic Stack"] },
  { id: "m40", level: "Medium", category: "Stack & Queue", title: "Evaluate Reverse Polish Notation",  link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",     platform: "LeetCode",  frequency: 3, topics: ["Stack"] },
  { id: "m41", level: "Medium", category: "Stack & Queue", title: "Car Fleet",                         link: "https://leetcode.com/problems/car-fleet/",                            platform: "LeetCode",  frequency: 3, topics: ["Stack","Sorting"] },
  { id: "m42", level: "Medium", category: "Stack & Queue", title: "Decode String",                     link: "https://leetcode.com/problems/decode-string/",                        platform: "LeetCode",  frequency: 4, topics: ["Stack","Recursion"] },

  // — Trees (Medium) —
  { id: "m43", level: "Medium", category: "Trees",         title: "Binary Tree Level Order Traversal", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",    platform: "LeetCode",  frequency: 5, topics: ["BFS"] },
  { id: "m44", level: "Medium", category: "Trees",         title: "Validate Binary Search Tree",       link: "https://leetcode.com/problems/validate-binary-search-tree/",          platform: "LeetCode",  frequency: 5, topics: ["DFS","BST"] },
  { id: "m45", level: "Medium", category: "Trees",         title: "Lowest Common Ancestor of a BST",   link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", platform: "LeetCode", frequency: 5, topics: ["BST","DFS"] },
  { id: "m46", level: "Medium", category: "Trees",         title: "Lowest Common Ancestor of a Binary Tree", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", platform: "LeetCode", frequency: 5, topics: ["DFS","Recursion"] },
  { id: "m47", level: "Medium", category: "Trees",         title: "Kth Smallest Element in a BST",     link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",        platform: "LeetCode",  frequency: 4, topics: ["BST","Inorder"] },
  { id: "m48", level: "Medium", category: "Trees",         title: "Construct Binary Tree from Preorder and Inorder", link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", platform: "LeetCode", frequency: 4, topics: ["DFS","Recursion"] },
  { id: "m49", level: "Medium", category: "Trees",         title: "Binary Tree Right Side View",       link: "https://leetcode.com/problems/binary-tree-right-side-view/",          platform: "LeetCode",  frequency: 4, topics: ["BFS","DFS"] },
  { id: "m50", level: "Medium", category: "Trees",         title: "Count Good Nodes in Binary Tree",   link: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",      platform: "LeetCode",  frequency: 3, topics: ["DFS"] },
  { id: "m51", level: "Medium", category: "Trees",         title: "Binary Tree Zigzag Level Order Traversal", link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", platform: "LeetCode", frequency: 4, topics: ["BFS"] },
  { id: "m52", level: "Medium", category: "Trees",         title: "Serialize and Deserialize Binary Tree", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", platform: "LeetCode", frequency: 4, topics: ["BFS","DFS","Design"] },
  { id: "m53", level: "Medium", category: "Trees",         title: "Binary Tree Maximum Path Sum",      link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",         platform: "LeetCode",  frequency: 4, topics: ["DFS","DP"] },

  // — Heap / Priority Queue (Medium) —
  { id: "m54", level: "Medium", category: "Heap",          title: "Task Scheduler",                    link: "https://leetcode.com/problems/task-scheduler/",                       platform: "LeetCode",  frequency: 4, topics: ["Greedy","Heap"] },
  { id: "m55", level: "Medium", category: "Heap",          title: "K Closest Points to Origin",        link: "https://leetcode.com/problems/k-closest-points-to-origin/",           platform: "LeetCode",  frequency: 4, topics: ["Heap","Quick Select"] },
  { id: "m56", level: "Medium", category: "Heap",          title: "Reorganize String",                 link: "https://leetcode.com/problems/reorganize-string/",                    platform: "LeetCode",  frequency: 3, topics: ["Heap","Greedy"] },

  // — Binary Search (Medium) —
  { id: "m57", level: "Medium", category: "Binary Search",  title: "Search in Rotated Sorted Array",    link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",       platform: "LeetCode",  frequency: 5, topics: ["Binary Search"] },
  { id: "m58", level: "Medium", category: "Binary Search",  title: "Find Minimum in Rotated Sorted Array", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", platform: "LeetCode", frequency: 4, topics: ["Binary Search"] },
  { id: "m59", level: "Medium", category: "Binary Search",  title: "Search a 2D Matrix",                link: "https://leetcode.com/problems/search-a-2d-matrix/",                   platform: "LeetCode",  frequency: 4, topics: ["Binary Search","Matrix"] },
  { id: "m60", level: "Medium", category: "Binary Search",  title: "Koko Eating Bananas",               link: "https://leetcode.com/problems/koko-eating-bananas/",                  platform: "LeetCode",  frequency: 4, topics: ["Binary Search"] },
  { id: "m61", level: "Medium", category: "Binary Search",  title: "Find Peak Element",                 link: "https://leetcode.com/problems/find-peak-element/",                    platform: "LeetCode",  frequency: 3, topics: ["Binary Search"] },
  { id: "m62", level: "Medium", category: "Binary Search",  title: "Aggressive Cows",                   link: "https://www.geeksforgeeks.org/aggressive-cows/",                      platform: "GFG",       frequency: 4, topics: ["Binary Search","Greedy"] },
  { id: "m63", level: "Medium", category: "Binary Search",  title: "Book Allocation Problem",           link: "https://www.geeksforgeeks.org/allocate-minimum-number-pages/",        platform: "GFG",       frequency: 4, topics: ["Binary Search","Greedy"] },

  // — Graph (Medium) —
  { id: "m64", level: "Medium", category: "Graph",         title: "Number of Islands",                 link: "https://leetcode.com/problems/number-of-islands/",                    platform: "LeetCode",  frequency: 5, topics: ["DFS","BFS","Union Find"] },
  { id: "m65", level: "Medium", category: "Graph",         title: "Clone Graph",                       link: "https://leetcode.com/problems/clone-graph/",                          platform: "LeetCode",  frequency: 4, topics: ["DFS","BFS","Hash Map"] },
  { id: "m66", level: "Medium", category: "Graph",         title: "Course Schedule",                   link: "https://leetcode.com/problems/course-schedule/",                      platform: "LeetCode",  frequency: 5, topics: ["Topological Sort","BFS","DFS"] },
  { id: "m67", level: "Medium", category: "Graph",         title: "Course Schedule II",                link: "https://leetcode.com/problems/course-schedule-ii/",                   platform: "LeetCode",  frequency: 4, topics: ["Topological Sort"] },
  { id: "m68", level: "Medium", category: "Graph",         title: "Rotting Oranges",                   link: "https://leetcode.com/problems/rotting-oranges/",                      platform: "LeetCode",  frequency: 5, topics: ["BFS","Matrix"] },
  { id: "m69", level: "Medium", category: "Graph",         title: "Pacific Atlantic Water Flow",       link: "https://leetcode.com/problems/pacific-atlantic-water-flow/",          platform: "LeetCode",  frequency: 3, topics: ["DFS","BFS"] },
  { id: "m70", level: "Medium", category: "Graph",         title: "Surrounded Regions",                link: "https://leetcode.com/problems/surrounded-regions/",                   platform: "LeetCode",  frequency: 3, topics: ["DFS","BFS"] },
  { id: "m71", level: "Medium", category: "Graph",         title: "Graph Valid Tree",                  link: "https://leetcode.com/problems/graph-valid-tree/",                     platform: "LeetCode",  frequency: 3, topics: ["Union Find","DFS"] },
  { id: "m72", level: "Medium", category: "Graph",         title: "Number of Connected Components",    link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", platform: "LeetCode", frequency: 3, topics: ["Union Find","DFS"] },
  { id: "m73", level: "Medium", category: "Graph",         title: "Cheapest Flights Within K Stops",   link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",      platform: "LeetCode",  frequency: 3, topics: ["Bellman-Ford","BFS","Dijkstra"] },

  // — Dynamic Programming (Medium) —
  { id: "m74", level: "Medium", category: "Dynamic Programming", title: "Longest Increasing Subsequence", link: "https://leetcode.com/problems/longest-increasing-subsequence/",    platform: "LeetCode",  frequency: 5, topics: ["DP","Binary Search"] },
  { id: "m75", level: "Medium", category: "Dynamic Programming", title: "Coin Change",                  link: "https://leetcode.com/problems/coin-change/",                         platform: "LeetCode",  frequency: 5, topics: ["DP"] },
  { id: "m76", level: "Medium", category: "Dynamic Programming", title: "Word Break",                   link: "https://leetcode.com/problems/word-break/",                          platform: "LeetCode",  frequency: 5, topics: ["DP","Trie"] },
  { id: "m77", level: "Medium", category: "Dynamic Programming", title: "Combination Sum IV",           link: "https://leetcode.com/problems/combination-sum-iv/",                  platform: "LeetCode",  frequency: 3, topics: ["DP"] },
  { id: "m78", level: "Medium", category: "Dynamic Programming", title: "Decode Ways",                  link: "https://leetcode.com/problems/decode-ways/",                         platform: "LeetCode",  frequency: 4, topics: ["DP"] },
  { id: "m79", level: "Medium", category: "Dynamic Programming", title: "Unique Paths",                 link: "https://leetcode.com/problems/unique-paths/",                        platform: "LeetCode",  frequency: 4, topics: ["DP","Math"] },
  { id: "m80", level: "Medium", category: "Dynamic Programming", title: "Jump Game",                    link: "https://leetcode.com/problems/jump-game/",                           platform: "LeetCode",  frequency: 4, topics: ["DP","Greedy"] },
  { id: "m81", level: "Medium", category: "Dynamic Programming", title: "Jump Game II",                 link: "https://leetcode.com/problems/jump-game-ii/",                        platform: "LeetCode",  frequency: 3, topics: ["DP","Greedy","BFS"] },
  { id: "m82", level: "Medium", category: "Dynamic Programming", title: "Partition Equal Subset Sum",   link: "https://leetcode.com/problems/partition-equal-subset-sum/",           platform: "LeetCode",  frequency: 4, topics: ["DP","Knapsack"] },
  { id: "m83", level: "Medium", category: "Dynamic Programming", title: "Target Sum",                   link: "https://leetcode.com/problems/target-sum/",                          platform: "LeetCode",  frequency: 3, topics: ["DP","Backtracking"] },
  { id: "m84", level: "Medium", category: "Dynamic Programming", title: "Longest Common Subsequence",   link: "https://leetcode.com/problems/longest-common-subsequence/",           platform: "LeetCode",  frequency: 4, topics: ["DP"] },
  { id: "m85", level: "Medium", category: "Dynamic Programming", title: "0/1 Knapsack Problem",         link: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",          platform: "GFG",       frequency: 5, topics: ["DP","Knapsack"] },
  { id: "m86", level: "Medium", category: "Dynamic Programming", title: "Unbounded Knapsack",           link: "https://www.geeksforgeeks.org/unbounded-knapsack-repetition-items-allowed/", platform: "GFG", frequency: 4, topics: ["DP","Knapsack"] },
  { id: "m87", level: "Medium", category: "Dynamic Programming", title: "Longest Palindromic Subsequence", link: "https://leetcode.com/problems/longest-palindromic-subsequence/",  platform: "LeetCode",  frequency: 3, topics: ["DP"] },
  { id: "m88", level: "Medium", category: "Dynamic Programming", title: "Matrix Chain Multiplication",  link: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/",     platform: "GFG",       frequency: 4, topics: ["DP","Recursion"] },
  { id: "m89", level: "Medium", category: "Dynamic Programming", title: "Edit Distance",                link: "https://leetcode.com/problems/edit-distance/",                       platform: "LeetCode",  frequency: 4, topics: ["DP"] },

  // — Backtracking (Medium) —
  { id: "m90", level: "Medium", category: "Backtracking",  title: "Subsets",                           link: "https://leetcode.com/problems/subsets/",                              platform: "LeetCode",  frequency: 5, topics: ["Backtracking","Bit Manipulation"] },
  { id: "m91", level: "Medium", category: "Backtracking",  title: "Combination Sum",                   link: "https://leetcode.com/problems/combination-sum/",                      platform: "LeetCode",  frequency: 5, topics: ["Backtracking"] },
  { id: "m92", level: "Medium", category: "Backtracking",  title: "Permutations",                      link: "https://leetcode.com/problems/permutations/",                         platform: "LeetCode",  frequency: 5, topics: ["Backtracking"] },
  { id: "m93", level: "Medium", category: "Backtracking",  title: "Letter Combinations of a Phone Number", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", platform: "LeetCode", frequency: 4, topics: ["Backtracking"] },
  { id: "m94", level: "Medium", category: "Backtracking",  title: "Word Search",                       link: "https://leetcode.com/problems/word-search/",                          platform: "LeetCode",  frequency: 4, topics: ["Backtracking","DFS"] },
  { id: "m95", level: "Medium", category: "Backtracking",  title: "Subsets II",                        link: "https://leetcode.com/problems/subsets-ii/",                           platform: "LeetCode",  frequency: 3, topics: ["Backtracking"] },
  { id: "m96", level: "Medium", category: "Backtracking",  title: "Combination Sum II",                link: "https://leetcode.com/problems/combination-sum-ii/",                   platform: "LeetCode",  frequency: 3, topics: ["Backtracking"] },
  { id: "m97", level: "Medium", category: "Backtracking",  title: "Palindrome Partitioning",           link: "https://leetcode.com/problems/palindrome-partitioning/",              platform: "LeetCode",  frequency: 3, topics: ["Backtracking","DP"] },

  // — Greedy (Medium) —
  { id: "m98",  level: "Medium", category: "Greedy",       title: "Gas Station",                       link: "https://leetcode.com/problems/gas-station/",                          platform: "LeetCode",  frequency: 3, topics: ["Greedy"] },
  { id: "m99",  level: "Medium", category: "Greedy",       title: "Hand of Straights",                 link: "https://leetcode.com/problems/hand-of-straights/",                    platform: "LeetCode",  frequency: 3, topics: ["Greedy","Hash Map"] },
  { id: "m100", level: "Medium", category: "Greedy",       title: "Partition Labels",                  link: "https://leetcode.com/problems/partition-labels/",                     platform: "LeetCode",  frequency: 3, topics: ["Greedy","Two Pointers"] },

  // — Trie (Medium) —
  { id: "m101", level: "Medium", category: "Trie",         title: "Implement Trie (Prefix Tree)",      link: "https://leetcode.com/problems/implement-trie-prefix-tree/",           platform: "LeetCode",  frequency: 4, topics: ["Trie","Design"] },
  { id: "m102", level: "Medium", category: "Trie",         title: "Design Add and Search Words Data Structure", link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", platform: "LeetCode", frequency: 3, topics: ["Trie","DFS"] },

  // ═══════════════════════════════════════════════
  //  HARD
  // ═══════════════════════════════════════════════

  // — Array (Hard) —
  { id: "h1",  level: "Hard", category: "Array",           title: "Trapping Rain Water",               link: "https://leetcode.com/problems/trapping-rain-water/",                  platform: "LeetCode",  frequency: 5, topics: ["Two Pointers","Stack","DP"] },
  { id: "h2",  level: "Hard", category: "Array",           title: "First Missing Positive",            link: "https://leetcode.com/problems/first-missing-positive/",               platform: "LeetCode",  frequency: 4, topics: ["Array","Hash"] },
  { id: "h3",  level: "Hard", category: "Array",           title: "Median of Two Sorted Arrays",       link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",          platform: "LeetCode",  frequency: 5, topics: ["Binary Search","Divide and Conquer"] },

  // — String (Hard) —
  { id: "h4",  level: "Hard", category: "String",          title: "Minimum Window Substring",          link: "https://leetcode.com/problems/minimum-window-substring/",             platform: "LeetCode",  frequency: 5, topics: ["Sliding Window","Hash Map"] },
  { id: "h5",  level: "Hard", category: "String",          title: "Edit Distance",                     link: "https://leetcode.com/problems/edit-distance/",                        platform: "LeetCode",  frequency: 4, topics: ["DP"] },
  { id: "h6",  level: "Hard", category: "String",          title: "Longest Valid Parentheses",         link: "https://leetcode.com/problems/longest-valid-parentheses/",            platform: "LeetCode",  frequency: 3, topics: ["Stack","DP"] },

  // — Sliding Window (Hard) —
  { id: "h7",  level: "Hard", category: "Sliding Window",  title: "Sliding Window Maximum",            link: "https://leetcode.com/problems/sliding-window-maximum/",               platform: "LeetCode",  frequency: 4, topics: ["Deque","Monotonic Queue"] },

  // — Linked List (Hard) —
  { id: "h8",  level: "Hard", category: "Linked List",     title: "Merge K Sorted Lists",              link: "https://leetcode.com/problems/merge-k-sorted-lists/",                 platform: "LeetCode",  frequency: 5, topics: ["Heap","Divide and Conquer","Linked List"] },
  { id: "h9",  level: "Hard", category: "Linked List",     title: "Reverse Nodes in K-Group",          link: "https://leetcode.com/problems/reverse-nodes-in-k-group/",             platform: "LeetCode",  frequency: 4, topics: ["Linked List","Recursion"] },

  // — Stack (Hard) —
  { id: "h10", level: "Hard", category: "Stack & Queue",   title: "Largest Rectangle in Histogram",    link: "https://leetcode.com/problems/largest-rectangle-in-histogram/",       platform: "LeetCode",  frequency: 5, topics: ["Monotonic Stack"] },
  { id: "h11", level: "Hard", category: "Stack & Queue",   title: "Maximal Rectangle",                 link: "https://leetcode.com/problems/maximal-rectangle/",                    platform: "LeetCode",  frequency: 3, topics: ["Stack","DP","Matrix"] },

  // — Trees (Hard) —
  { id: "h12", level: "Hard", category: "Trees",           title: "Binary Tree Maximum Path Sum",      link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",         platform: "LeetCode",  frequency: 5, topics: ["DFS","DP"] },
  { id: "h13", level: "Hard", category: "Trees",           title: "Serialize and Deserialize Binary Tree", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", platform: "LeetCode", frequency: 4, topics: ["BFS","DFS","Design"] },

  // — Heap (Hard) —
  { id: "h14", level: "Hard", category: "Heap",            title: "Find Median from Data Stream",      link: "https://leetcode.com/problems/find-median-from-data-stream/",         platform: "LeetCode",  frequency: 5, topics: ["Heap","Design"] },
  { id: "h15", level: "Hard", category: "Heap",            title: "Merge K Sorted Lists",              link: "https://leetcode.com/problems/merge-k-sorted-lists/",                 platform: "LeetCode",  frequency: 5, topics: ["Heap","Linked List"] },

  // — Graph (Hard) —
  { id: "h16", level: "Hard", category: "Graph",           title: "Word Ladder",                       link: "https://leetcode.com/problems/word-ladder/",                          platform: "LeetCode",  frequency: 4, topics: ["BFS"] },
  { id: "h17", level: "Hard", category: "Graph",           title: "Alien Dictionary",                  link: "https://leetcode.com/problems/alien-dictionary/",                     platform: "LeetCode",  frequency: 4, topics: ["Topological Sort","BFS"] },
  { id: "h18", level: "Hard", category: "Graph",           title: "Swim in Rising Water",              link: "https://leetcode.com/problems/swim-in-rising-water/",                 platform: "LeetCode",  frequency: 3, topics: ["Dijkstra","Binary Search","BFS"] },
  { id: "h19", level: "Hard", category: "Graph",           title: "Critical Connections in a Network",  link: "https://leetcode.com/problems/critical-connections-in-a-network/",    platform: "LeetCode",  frequency: 3, topics: ["Tarjan's Algorithm","DFS"] },
  { id: "h20", level: "Hard", category: "Graph",           title: "Reconstruct Itinerary",             link: "https://leetcode.com/problems/reconstruct-itinerary/",                platform: "LeetCode",  frequency: 3, topics: ["Eulerian Path","DFS"] },

  // — Dynamic Programming (Hard) —
  { id: "h21", level: "Hard", category: "Dynamic Programming", title: "Regular Expression Matching",   link: "https://leetcode.com/problems/regular-expression-matching/",          platform: "LeetCode",  frequency: 4, topics: ["DP","Recursion"] },
  { id: "h22", level: "Hard", category: "Dynamic Programming", title: "Wildcard Matching",             link: "https://leetcode.com/problems/wildcard-matching/",                    platform: "LeetCode",  frequency: 3, topics: ["DP","Greedy"] },
  { id: "h23", level: "Hard", category: "Dynamic Programming", title: "Burst Balloons",                link: "https://leetcode.com/problems/burst-balloons/",                       platform: "LeetCode",  frequency: 3, topics: ["DP","Interval DP"] },
  { id: "h24", level: "Hard", category: "Dynamic Programming", title: "Distinct Subsequences",         link: "https://leetcode.com/problems/distinct-subsequences/",                platform: "LeetCode",  frequency: 3, topics: ["DP"] },
  { id: "h25", level: "Hard", category: "Dynamic Programming", title: "Interleaving String",           link: "https://leetcode.com/problems/interleaving-string/",                  platform: "LeetCode",  frequency: 3, topics: ["DP"] },
  { id: "h26", level: "Hard", category: "Dynamic Programming", title: "Palindrome Partitioning II",    link: "https://leetcode.com/problems/palindrome-partitioning-ii/",           platform: "LeetCode",  frequency: 3, topics: ["DP"] },
  { id: "h27", level: "Hard", category: "Dynamic Programming", title: "Best Time to Buy and Sell Stock III", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/", platform: "LeetCode", frequency: 3, topics: ["DP"] },
  { id: "h28", level: "Hard", category: "Dynamic Programming", title: "Best Time to Buy and Sell Stock IV", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/", platform: "LeetCode", frequency: 3, topics: ["DP"] },

  // — Backtracking (Hard) —
  { id: "h29", level: "Hard", category: "Backtracking",    title: "N-Queens",                          link: "https://leetcode.com/problems/n-queens/",                             platform: "LeetCode",  frequency: 4, topics: ["Backtracking"] },
  { id: "h30", level: "Hard", category: "Backtracking",    title: "Sudoku Solver",                     link: "https://leetcode.com/problems/sudoku-solver/",                        platform: "LeetCode",  frequency: 3, topics: ["Backtracking"] },
  { id: "h31", level: "Hard", category: "Backtracking",    title: "Word Search II",                    link: "https://leetcode.com/problems/word-search-ii/",                       platform: "LeetCode",  frequency: 3, topics: ["Backtracking","Trie"] },

  // — Trie (Hard) —
  { id: "h32", level: "Hard", category: "Trie",            title: "Word Search II",                    link: "https://leetcode.com/problems/word-search-ii/",                       platform: "LeetCode",  frequency: 4, topics: ["Trie","Backtracking","DFS"] },

  // — Greedy (Hard) —
  { id: "h33", level: "Hard", category: "Greedy",          title: "Candy",                             link: "https://leetcode.com/problems/candy/",                                platform: "LeetCode",  frequency: 3, topics: ["Greedy"] },
  { id: "h34", level: "Hard", category: "Greedy",          title: "Maximum Performance of a Team",     link: "https://leetcode.com/problems/maximum-performance-of-a-team/",        platform: "LeetCode",  frequency: 2, topics: ["Greedy","Heap","Sorting"] },

  // — Design (Hard) —
  { id: "h35", level: "Hard", category: "Design",          title: "LRU Cache",                         link: "https://leetcode.com/problems/lru-cache/",                            platform: "LeetCode",  frequency: 5, topics: ["Hash Map","Doubly Linked List","Design"] },
  { id: "h36", level: "Hard", category: "Design",          title: "LFU Cache",                         link: "https://leetcode.com/problems/lfu-cache/",                            platform: "LeetCode",  frequency: 3, topics: ["Hash Map","Doubly Linked List","Design"] },

  // — Bit Manipulation (Hard) —
  { id: "h37", level: "Hard", category: "Bit Manipulation",title: "Maximum XOR of Two Numbers in an Array", link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/", platform: "LeetCode", frequency: 2, topics: ["Trie","Bit Manipulation"] },
];
