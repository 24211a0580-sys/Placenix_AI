const QUESTION_BANK_DATA = {
  metadata: {
  version: "2.0",
  lastUpdated: "2024",
  totalQuestions: 50,
  totalCompanies: 14,
  categories: 6
},
  companies: {
  amazon:    { name:"Amazon",    color:"#FF9900", type:"product" },
  google:    { name:"Google",    color:"#4285F4", type:"product" },
  microsoft: { name:"Microsoft", color:"#00A4EF", type:"product" },
  tcs:       { name:"TCS",       color:"#00A3E0", type:"service" },
  infosys:   { name:"Infosys",   color:"#007CC3", type:"service" },
  wipro:     { name:"Wipro",     color:"#341C78", type:"service" },
  zoho:      { name:"Zoho",      color:"#E42527", type:"product" },
  flipkart:  { name:"Flipkart",  color:"#F74F00", type:"product" },
  adobe:     { name:"Adobe",     color:"#FF0000", type:"product" },
  oracle:    { name:"Oracle",    color:"#C74634", type:"product" },
  samsung:   { name:"Samsung",   color:"#1428A0", type:"product" },
  accenture: { name:"Accenture", color:"#A100FF", type:"service" },
  cognizant: { name:"Cognizant", color:"#0033A0", type:"service" },
  capgemini: { name:"Capgemini", color:"#0070AD", type:"service" }
},
  questions: [
    
  {
    id: "apt_001", title: "Speed, Distance and Time", category: "aptitude", subcategory: "Quantitative", type: "mcq", difficulty: "easy", companies: ["tcs", "infosys", "wipro", "accenture"], year: 2024, timeLimit: 60, points: 5, timesAsked: 234, successRate: 72,
    question: "A train travels 360 km in 4 hours.\nWhat is its speed in m/s?",
    options: { A: "25 m/s", B: "30 m/s", C: "22.5 m/s", D: "20 m/s" },
    correct: "A",
    explanation: "Speed = Distance/Time = 360/4 = 90 km/h\nConvert: 90 × (1000/3600) = 90/3.6 = 25 m/s\nFormula: km/h to m/s → multiply by 5/18",
    tags: ["speed", "distance", "time", "unit conversion"],
    hint1: "First find speed in km/h, then convert", hint2: "To convert km/h to m/s, multiply by 5/18"
  },
  {
    id: "apt_002", title: "Work and Time", category: "aptitude", subcategory: "Quantitative", type: "mcq", difficulty: "medium", companies: ["tcs", "infosys", "wipro", "cognizant"], year: 2024, timeLimit: 90, points: 10, timesAsked: 189, successRate: 58,
    question: "12 workers complete a job in 18 days.\nHow many days will 8 workers take to complete\nthe same job, working at the same rate?",
    options: { A: "24 days", B: "27 days", C: "30 days", D: "21 days" },
    correct: "B",
    explanation: "Total work = 12 × 18 = 216 worker-days\nDays for 8 workers = 216 ÷ 8 = 27 days\nRule: More workers = fewer days (inverse proportion)",
    tags: ["work", "time", "inverse proportion"],
    hint1: "Calculate total work first (workers × days)", hint2: "Total work stays constant. Divide by new workers."
  },
  {
    id: "apt_003", title: "Number Series Pattern", category: "aptitude", subcategory: "Logical Reasoning", type: "mcq", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 60, points: 5, timesAsked: 412, successRate: 81,
    question: "Find the next number in the series:\n2, 6, 12, 20, 30, ?",
    options: { A: "40", B: "42", C: "44", D: "48" },
    correct: "B",
    explanation: "Differences: 4, 6, 8, 10, 12 (increasing by 2)\nPattern: n(n+1) → 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42\nNext = 30 + 12 = 42",
    tags: ["series", "pattern", "differences"],
    hint1: "Look at the differences between consecutive terms", hint2: "The differences form an arithmetic progression"
  },
  {
    id: "apt_004", title: "Profit, Loss and Discount", category: "aptitude", subcategory: "Quantitative", type: "mcq", difficulty: "hard", companies: ["amazon", "microsoft", "flipkart"], year: 2024, timeLimit: 120, points: 15, timesAsked: 156, successRate: 41,
    question: "A shopkeeper marks up goods by 40% above\ncost price and then offers a 25% discount.\nWhat is the net profit or loss percentage?",
    options: { A: "5% profit", B: "5% loss", C: "10% profit", D: "No profit or loss" },
    correct: "A",
    explanation: "Let CP = 100\nMP = 140 (40% markup)\nSP = 140 × 0.75 = 105 (25% discount)\nProfit = 105 - 100 = 5%",
    tags: ["profit", "loss", "discount", "markup"],
    hint1: "Assume cost price = 100 to make calculation easy", hint2: "Calculate Marked Price first, then apply discount"
  },
  {
    id: "apt_005", title: "Probability Basics", category: "aptitude", subcategory: "Quantitative", type: "mcq", difficulty: "medium", companies: ["google", "amazon", "microsoft"], year: 2024, timeLimit: 90, points: 10, timesAsked: 203, successRate: 63,
    question: "A bag contains 5 red, 3 blue, and 2 green\nballs. Two balls are drawn at random without replacement.\nWhat is the probability both are red?",
    options: { A: "2/9", B: "1/5", C: "2/11", D: "1/4" },
    correct: "A",
    explanation: "P(both red) = C(5,2)/C(10,2)\n= (5×4/2) / (10×9/2)\n= 10/45 = 2/9",
    tags: ["probability", "combination", "without replacement"],
    hint1: "Use combination formula C(n,r) = n!/(r!(n-r)!)", hint2: "P = (ways to pick 2 red) / (ways to pick any 2)"
  },
  {
    id: "apt_006", title: "Syllogism", category: "aptitude", subcategory: "Logical Reasoning", type: "mcq", difficulty: "medium", companies: ["tcs", "infosys", "cognizant", "capgemini"], year: 2024, timeLimit: 90, points: 10, timesAsked: 178, successRate: 55,
    question: "Statements:\nAll cats are animals.\nAll animals are living beings.\nConclusions:\nI.  All cats are living beings.\nII. Some living beings are cats.\nWhich conclusions follow?",
    options: { A: "Only I follows", B: "Only II follows", C: "Both I and II follow", D: "Neither follows" },
    correct: "C",
    explanation: "All cats → animals → living beings\nSo ALL cats are living beings (I is true)\nSince all cats are living beings,\nSOME living beings are cats (II is true)\nBoth conclusions follow.",
    tags: ["syllogism", "logic", "conclusions"],
    hint1: "Draw a Venn diagram with the three sets", hint2: "If all A are B, then some B are A (converse)"
  },
  {
    id: "apt_007", title: "Percentage Problems", category: "aptitude", subcategory: "Quantitative", type: "mcq", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 60, points: 5, timesAsked: 389, successRate: 76,
    question: "In a class of 80 students:\n60% passed in Mathematics\n70% passed in English\n20% failed in both subjects\nWhat percentage passed in BOTH subjects?",
    options: { A: "40%", B: "50%", C: "45%", D: "55%" },
    correct: "B",
    explanation: "Failed in both = 20%, so passed in at least one = 80%\nBy inclusion-exclusion:\nP(M∪E) = P(M) + P(E) - P(M∩E)\n80 = 60 + 70 - P(M∩E)\nP(M∩E) = 50%",
    tags: ["percentage", "sets", "venn diagram"],
    hint1: "If 20% failed both, then 80% passed at least one", hint2: "Use: P(A∪B) = P(A) + P(B) - P(A∩B)"
  },
  {
    id: "apt_008", title: "Seating Arrangement", category: "aptitude", subcategory: "Logical Reasoning", type: "mcq", difficulty: "hard", companies: ["amazon", "google", "microsoft"], year: 2024, timeLimit: 150, points: 15, timesAsked: 134, successRate: 38,
    question: "6 people A,B,C,D,E,F sit in a row.\nA sits to the right of B.\nC sits to the left of D.\nE is at one of the ends.\nB and C are adjacent.\nIf F is third from left, who is at the leftmost?",
    options: { A: "A", B: "B", C: "E", D: "C" },
    correct: "C",
    explanation: "E is at an end. F is 3rd from left.\nB and C adjacent, A right of B, C left of D.\nWorking out: E_BC_F__ or constraints force E at left.\nE sits leftmost to satisfy all conditions.",
    tags: ["arrangement", "seating", "logical deduction"],
    hint1: "Start with the fixed positions: E at end, F at 3rd", hint2: "Try placing F=3rd, then satisfy B-C adjacent"
  },
  {
    id: "apt_009", title: "Compound Interest", category: "aptitude", subcategory: "Quantitative", type: "mcq", difficulty: "medium", companies: ["all"], year: 2024, timeLimit: 90, points: 10, timesAsked: 267, successRate: 61,
    question: "What is the compound interest on ₹8000\nat 10% per annum for 2 years,\ncompounded annually?",
    options: { A: "₹1600", B: "₹1680", C: "₹1800", D: "₹1750" },
    correct: "B",
    explanation: "CI = P[(1+r/100)^n - 1]\n= 8000[(1.1)² - 1]\n= 8000[1.21 - 1]\n= 8000 × 0.21 = ₹1680",
    tags: ["compound interest", "finance", "formula"],
    hint1: "Formula: A = P(1 + r/100)^n", hint2: "CI = A - P (Amount minus Principal)"
  },
  {
    id: "apt_010", title: "Data Interpretation — Bar Chart", category: "aptitude", subcategory: "Data Interpretation", type: "mcq", difficulty: "medium", companies: ["amazon", "flipkart", "accenture"], year: 2024, timeLimit: 120, points: 10, timesAsked: 143, successRate: 67,
    question: "A company's sales (in lakhs):\n2020: ₹40L, 2021: ₹55L, 2022: ₹48L, 2023: ₹72L\nWhat is the percentage increase in sales\nfrom 2020 to 2023?",
    options: { A: "70%", B: "75%", C: "80%", D: "65%" },
    correct: "C",
    explanation: "Increase = 72 - 40 = 32 lakhs\n% increase = (32/40) × 100 = 80%",
    tags: ["data interpretation", "percentage change", "bar chart"],
    hint1: "% change = (new - old)/old × 100", hint2: "Base year is 2020 (₹40L)"
  },
  {
    id: "dsa_001", title: "Two Sum", category: "dsa", subcategory: "Arrays & Strings", type: "coding", difficulty: "easy", companies: ["amazon", "google", "microsoft", "adobe"], year: 2024, timeLimit: 180, points: 20, timesAsked: 891, successRate: 74,
    question: "Given an array of integers nums and\nan integer target, return indices of the two numbers\nthat add up to target.\nEach input has exactly one solution.\nYou may not use the same element twice.",
    examples: [{input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2+7 = 9"},{input: "nums = [3,2,4], target = 6", output: "[1,2]"}],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists"],
    starterCode: {python: "def twoSum(nums, target):\n    pass", javascript: "function twoSum(nums, target) {\n    \n}", java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}", cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}"},
    testCases: [{input:"[2,7,11,15]\\n9", expected:"[0,1]", label:"Example 1"}, {input:"[3,2,4]\\n6", expected:"[1,2]", label:"Example 2"}, {input:"[3,3]\\n6", expected:"[0,1]", label:"Duplicates"}],
    expectedKeywords: ["hashmap","dict","seen","O(n)"],
    modelAnswer: "Use a hashmap. For each element x,\ncheck if (target-x) already exists in the map.\nIf yes → return current index and stored index.\nIf no → store x: index in map.\nTime: O(n), Space: O(n)",
    hint1: "What if you stored each number and its index?", hint2: "For each number, check if target-number is in your storage",
    tags: ["array", "hashmap", "two pointers"],
    solution: "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i"
  },
  {
    id: "dsa_002", title: "Valid Parentheses", category: "dsa", subcategory: "Arrays & Strings", type: "coding", difficulty: "easy", companies: ["amazon", "google", "microsoft", "zoho"], year: 2024, timeLimit: 180, points: 20, timesAsked: 654, successRate: 69,
    question: "Given a string s containing just the\ncharacters '(', ')', '{', '}', '[' and ']',\ndetermine if the input string is valid.\nAn input string is valid if:\n1. Open brackets are closed by same type\n2. Open brackets are closed in correct order\n3. Every close bracket has a corresponding open bracket",
    examples: [{input: "s = \"()\"", output: "true"}, {input: "s = \"()[]{}\"", output: "true"}, {input: "s = \"(]\"", output: "false"}],
    constraints: ["1 <= s.length <= 10^4", "s consists of brackets only"],
    starterCode: {python: "def isValid(s):\n    pass", javascript: "function isValid(s) {\n    \n}", java: "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}", cpp: "bool isValid(string s) {\n    return false;\n}"},
    testCases: [{input:"()", expected:"true", label:"Simple pair"}, {input:"()[]{}", expected:"true", label:"Multiple types"}, {input:"(]", expected:"false", label:"Wrong type"}, {input:"([)]", expected:"false", label:"Wrong order"}, {input:"{[]}", expected:"true", label:"Nested"}],
    expectedKeywords: ["stack", "push", "pop", "map"],
    modelAnswer: "Use a stack.\nPush opening brackets onto stack.\nFor closing brackets: if stack empty or top\ndoesn't match → invalid.\nAt end: stack must be empty.\nTime: O(n), Space: O(n)",
    hint1: "Think about which data structure handles last-in-first-out", hint2: "Use a stack: push opening, pop and match closing",
    tags: ["stack", "string", "bracket matching"],
    solution: "def isValid(s):\n    stack = []\n    mapping = {')':'(', '}':'{', ']':'['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack"
  },
  {
    id: "dsa_003", title: "Binary Search", category: "dsa", subcategory: "Sorting & Searching", type: "coding", difficulty: "easy", companies: ["amazon", "google", "microsoft", "samsung"], year: 2024, timeLimit: 180, points: 20, timesAsked: 567, successRate: 71,
    question: "Given a sorted array of distinct integers\nand a target value, return the index if target is found.\nIf not, return the index where it would be inserted\nin order. Must run in O(log n) time.",
    examples: [{input:"nums=[1,3,5,6], target=5", output:"2"}, {input:"nums=[1,3,5,6], target=2", output:"1"}, {input:"nums=[1,3,5,6], target=7", output:"4"}],
    constraints: ["1 <= nums.length <= 10^4", "O(log n) required"],
    starterCode: {python: "def searchInsert(nums, target):\n    pass", javascript: "function searchInsert(nums, target) {\n    \n}", java: "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        return 0;\n    }\n}", cpp: "int searchInsert(vector<int>& nums, int target) {\n    return 0;\n}"},
    testCases: [{input:"[1,3,5,6]\\n5", expected:"2", label:"Found"}, {input:"[1,3,5,6]\\n2", expected:"1", label:"Insert middle"}, {input:"[1,3,5,6]\\n7", expected:"4", label:"Insert end"}, {input:"[1,3,5,6]\\n0", expected:"0", label:"Insert start"}],
    expectedKeywords: ["binary search","mid","lo","hi","left","right"],
    modelAnswer: "Classic binary search.\nlo=0, hi=len-1.\nWhile lo<=hi: mid=(lo+hi)//2\nIf nums[mid]==target: return mid\nIf nums[mid]<target: lo=mid+1\nElse: hi=mid-1\nReturn lo (insertion point)",
    hint1: "Use two pointers: left and right, find the middle", hint2: "When loop ends, left pointer is the insertion point",
    tags: ["binary search", "array", "searching"],
    solution: "def searchInsert(nums, target):\n    lo, hi = 0, len(nums)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: lo = mid+1\n        else: hi = mid-1\n    return lo"
  },
  {
    id: "dsa_004", title: "Linked List Cycle Detection", category: "dsa", subcategory: "Linked List", type: "coding", difficulty: "medium", companies: ["amazon", "microsoft", "flipkart", "oracle"], year: 2024, timeLimit: 240, points: 25, timesAsked: 423, successRate: 56,
    question: "Given the head of a linked list,\ndetermine if the linked list has a cycle in it.\nA cycle exists if a node can be reached again\nby following the next pointers.\nReturn true if cycle exists, false otherwise.\nDo it in O(1) extra space.",
    examples: [{input: "head=[3,2,0,-4], pos=1", output: "true", explanation: "Tail connects to node at index 1"}, {input: "head=[1,2], pos=0", output: "true"}, {input: "head=[1], pos=-1", output: "false"}],
    constraints: ["O(1) memory solution preferred", "0 <= Number of nodes <= 10^4"],
    starterCode: {python: "def hasCycle(head):\n    pass", javascript: "function hasCycle(head) {\n    \n}", java: "public boolean hasCycle(ListNode head) {\n    return false;\n}", cpp: "bool hasCycle(ListNode *head) {\n    return false;\n}"},
    testCases: [{input:"[3,2,0,-4] pos=1", expected:"true", label:"Has cycle"}, {input:"[1]        pos=-1", expected:"false", label:"No cycle"}],
    expectedKeywords: ["slow","fast","floyd","tortoise","hare","two pointer"],
    modelAnswer: "Floyd's Cycle Detection (Tortoise & Hare).\nslow moves 1 step, fast moves 2 steps.\nIf they meet → cycle exists.\nIf fast reaches null → no cycle.\nTime: O(n), Space: O(1)",
    hint1: "Use two pointers moving at different speeds", hint2: "Fast pointer (2 steps) catches slow pointer (1 step) if cycle exists",
    tags: ["linked list", "two pointers", "floyd's algorithm"],
    solution: "def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False"
  },
  {
    id: "dsa_005", title: "Maximum Subarray (Kadane's)", category: "dsa", subcategory: "Dynamic Programming", type: "coding", difficulty: "medium", companies: ["amazon", "google", "microsoft", "adobe"], year: 2024, timeLimit: 240, points: 25, timesAsked: 712, successRate: 62,
    question: "Given an integer array nums, find the\nsubarray with the largest sum and return its sum.\nA subarray is a contiguous non-empty sequence\nof elements within an array.",
    examples: [{input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has sum 6"}, {input: "nums = [1]", output: "1"}, {input: "nums = [5,4,-1,7,8]", output: "23"}],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {python: "def maxSubArray(nums):\n    pass", javascript: "function maxSubArray(nums) {\n    \n}", java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}", cpp: "int maxSubArray(vector<int>& nums) {\n    return 0;\n}"},
    testCases: [{input:"[-2,1,-3,4,-1,2,1,-5,4]", expected:"6", label:"Standard"}, {input:"[1]", expected:"1", label:"Single"}, {input:"[-1]", expected:"-1", label:"Negative"}, {input:"[5,4,-1,7,8]", expected:"23", label:"All positive"}],
    expectedKeywords: ["kadane","current","max","dp","extend"],
    modelAnswer: "Kadane's Algorithm:\nTrack current_sum and max_sum.\nFor each number: current_sum = max(num, current_sum + num)\n(either start fresh or extend previous subarray)\nmax_sum = max(max_sum, current_sum)\nTime: O(n), Space: O(1)",
    hint1: "At each position, decide: start fresh or extend current subarray?", hint2: "current = max(nums[i], current + nums[i])",
    tags: ["dynamic programming", "array", "kadane"],
    solution: "def maxSubArray(nums):\n    max_sum = cur = nums[0]\n    for n in nums[1:]:\n        cur = max(n, cur + n)\n        max_sum = max(max_sum, cur)\n    return max_sum"
  },
  {
    id: "tech_001", title: "Four Pillars of OOPs", category: "technical", subcategory: "OOPs", type: "theory", difficulty: "easy", companies: ["infosys","wipro","tcs","cognizant","capgemini"], year: 2024, timeLimit: 180, points: 20, timesAsked: 1245, successRate: 65,
    question: "Explain the four pillars of\nObject-Oriented Programming with real-world examples\nand code snippets for each.",
    expectedKeywords: ["encapsulation","inheritance","polymorphism","abstraction","example","hiding","extends","override"],
    modelAnswer: "1. ENCAPSULATION: Bundling data + methods,\nhiding internal state. Example: ATM hides wiring.\nCode: private variables + public getters/setters.\n\n2. INHERITANCE: Child class gets parent properties.\nExample: Car extends Vehicle (has wheels, engine).\nCode: class Dog extends Animal\n\n3. POLYMORPHISM: Same interface, different behavior.\nExample: draw() on Circle vs Square → different result.\nCode: method overriding and overloading.\n\n4. ABSTRACTION: Hide complexity, show essentials.\nExample: TV remote (don't need to know circuits).\nCode: abstract classes and interfaces.",
    rubric: {excellent: "All 4 with real examples AND code snippets", good: "All 4 with real-world examples", average: "All 4 defined but no examples", poor: "Less than 4 or wrong definitions"},
    hint1: "Think of real objects around you for examples", hint2: "Remember: EIPA — Encapsulation, Inheritance, Polymorphism, Abstraction",
    tags: ["oops", "fundamentals", "concepts"]
  },
  {
    id: "tech_002", title: "DBMS Normalization (1NF, 2NF, 3NF)", category: "technical", subcategory: "DBMS & SQL", type: "theory", difficulty: "medium", companies: ["all"], year: 2024, timeLimit: 240, points: 25, timesAsked: 934, successRate: 52,
    question: "What is database normalization?\nExplain 1NF, 2NF, and 3NF with a practical\nexample showing the progression from\nunnormalized to 3NF.",
    expectedKeywords: ["1NF","2NF","3NF","atomic","redundancy","partial dependency","transitive dependency","primary key","functional dependency","anomaly"],
    modelAnswer: "Normalization: Organizing DB to reduce\nredundancy and improve data integrity.\n\nUnnormalized: Student(ID, Name, Courses, Instructors)\n\n1NF: Atomic values, no repeating groups.\n→ Student(ID, Name, CourseID, CourseName, Instructor)\n\n2NF: 1NF + Remove partial dependencies.\n→ Student(ID, Name) + Course(CourseID, CourseName, Instructor)\n\n3NF: 2NF + Remove transitive dependencies.\n→ Student + Course(CourseID, CourseName, InstructorID)\n   + Instructor(InstructorID, InstructorName, Dept)",
    rubric: {excellent: "All 3 NFs + example showing progression + anomalies", good: "All 3 NFs with example", average: "All 3 NFs defined only", poor: "Less than 3 or incorrect"},
    hint1: "Start with an unnormalized table and show each step", hint2: "2NF is about composite keys; 3NF is about non-key → non-key dependencies",
    tags: ["dbms", "normalization", "sql", "database design"]
  },
  {
    id: "tech_003", title: "SQL: INNER vs LEFT JOIN", category: "technical", subcategory: "DBMS & SQL", type: "theory", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 150, points: 15, timesAsked: 1089, successRate: 71,
    question: "Explain the difference between\nINNER JOIN and LEFT JOIN in SQL.\nShow with an example using\nStudents and Grades tables.",
    expectedKeywords: ["inner join","left join","matching","all rows","null","both tables","unmatched","result set"],
    modelAnswer: "INNER JOIN: Returns only matching rows from BOTH tables.\nSELECT s.name, g.grade\nFROM Students s INNER JOIN Grades g ON s.id = g.student_id\n→ Only students WHO HAVE grades appear.\n\nLEFT JOIN: Returns ALL rows from left table +\nmatching from right (NULL if no match).\nSELECT s.name, g.grade\nFROM Students s LEFT JOIN Grades g ON s.id = g.student_id\n→ ALL students appear; grade is NULL if no grade entry.\n\nUse INNER JOIN when you want only matched records.\nUse LEFT JOIN to keep all records from the left table.",
    rubric: {excellent: "Both joins explained + SQL code + NULL handling", good: "Both joins with SQL examples", average: "Both defined without SQL code", poor: "Only one join or incorrect explanation"},
    hint1: "Think about what happens to rows with NO match", hint2: "INNER = intersection, LEFT = all left + matching right",
    tags: ["sql", "joins", "database", "query"]
  },
  {
    id: "tech_004", title: "Process vs Thread", category: "technical", subcategory: "Operating Systems", type: "theory", difficulty: "medium", companies: ["amazon","google","microsoft","oracle"], year: 2024, timeLimit: 180, points: 20, timesAsked: 756, successRate: 59,
    question: "What is the difference between\na Process and a Thread?\nExplain with examples and discuss:\ncontext switching, memory, and communication.",
    expectedKeywords: ["process","thread","memory","shared","isolated","context switch","lightweight","communication","IPC","heap","stack"],
    modelAnswer: "PROCESS: Independent program in execution.\n- Own memory space (code, heap, stack, data)\n- Isolated: crash doesn't affect others\n- Heavy context switch (save/restore full state)\n- Communication via IPC (pipes, sockets)\n- Example: Chrome tabs are separate processes\n\nTHREAD: Lightweight unit within a process.\n- Shares memory with other threads (heap, code)\n- Own stack and registers only\n- Fast context switch\n- Communicate via shared memory (careful: race conditions)\n- Example: Chrome's JS engine uses multiple threads\n\nKey difference: Processes are isolated,\nThreads share memory within a process.",
    rubric: {excellent: "Both explained + memory model + communication + examples", good: "Both explained with key differences", average: "Basic definition of both", poor: "Confused or only one explained"},
    hint1: "Think about what is shared and what is private", hint2: "Process → isolation. Thread → sharing within process.",
    tags: ["os", "process", "thread", "concurrency"]
  },
  {
    id: "tech_005", title: "Design URL Shortener", category: "technical", subcategory: "System Design", type: "system_design", difficulty: "hard", companies: ["amazon","google","microsoft","flipkart"], year: 2024, timeLimit: 1200, points: 50, timesAsked: 312, successRate: 34,
    question: "Design a URL shortening service like bit.ly.\nCover all of the following:\n1. Functional & Non-functional requirements\n2. API design\n3. Database schema\n4. Encoding/hashing strategy\n5. Scaling for 100M+ daily requests",
    expectedKeywords: ["hash","base62","redirect","cache","redis","database","load balancer","CDN","rate limiting","analytics","sharding","replication"],
    modelAnswer: "REQUIREMENTS:\nFunctional: Shorten URL, redirect, custom alias, expiry\nNon-functional: 100M req/day, <100ms latency, 99.9% uptime\n\nAPI:\nPOST /shorten {url, customAlias?, expiryDays?} → shortCode\nGET /{shortCode} → 301/302 redirect\nGET /analytics/{shortCode} → click stats\n\nSCHEMA:\nurls(id PK, original_url, short_code UNIQUE,\n     created_at, expiry, user_id, click_count)\n\nENCODING:\nMD5(url+timestamp) → take first 7 chars → Base62\nBase62: a-z, A-Z, 0-9 → 62^7 = 3.5 trillion combinations\n\nSCALING:\n- Redis cache for hot URLs (80% hits cached)\n- Read replicas for DB\n- CDN at edge nodes for redirects\n- Rate limiting: 100 req/min per IP",
    rubric: {excellent: "All 5 components with trade-offs discussed", good: "All 5 components, basic explanation", average: "API + DB only, no scaling", poor: "Only high-level overview"},
    hint1: "Start with requirements (functional vs non-functional)", hint2: "Think: how will you handle 100M requests/day? Cache!",
    tags: ["system design", "hashing", "cache", "scale"]
  },
  {
    id: "tech_006", title: "HTTP vs HTTPS", category: "technical", subcategory: "Computer Networks", type: "theory", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 892, successRate: 78,
    question: "What is the difference between\nHTTP and HTTPS?\nExplain how HTTPS secures communication\nusing SSL/TLS.",
    expectedKeywords: ["https","ssl","tls","encrypt","certificate","secure","port 443","port 80","handshake","ca"],
    modelAnswer: "HTTP: HyperText Transfer Protocol\n- Port 80, data sent as plain text\n- No encryption → vulnerable to interception\n- No authentication of server identity\n\nHTTPS: HTTP + SSL/TLS encryption\n- Port 443\n- All data encrypted using symmetric key\n- Server authenticated via digital certificate (CA-signed)\n\nTLS Handshake:\n1. Client sends 'ClientHello' (supported algorithms)\n2. Server sends certificate + 'ServerHello'\n3. Client verifies certificate with CA\n4. Exchange keys, establish encrypted session\n5. Secure communication begins\n\nUse HTTPS for: login pages, payments, any sensitive data",
    rubric: {excellent: "HTTP vs HTTPS + TLS handshake steps + port numbers", good: "Difference + encryption explanation", average: "Basic difference only", poor: "Just 'S means secure'"},
    hint1: "What does the 'S' actually add? Focus on encryption", hint2: "Explain the TLS handshake: how do client and server agree on encryption?",
    tags: ["networking", "http", "https", "ssl", "security"]
  },
  {
    id: "tech_007", title: "Deadlock — 4 Conditions", category: "technical", subcategory: "Operating Systems", type: "theory", difficulty: "medium", companies: ["amazon","microsoft","google","oracle"], year: 2024, timeLimit: 210, points: 20, timesAsked: 567, successRate: 53,
    question: "What is deadlock in operating systems?\nExplain the 4 necessary conditions for deadlock\n(Coffman conditions) and describe 3 ways to\nprevent or handle deadlock.",
    expectedKeywords: ["mutual exclusion","hold and wait","no preemption","circular wait","prevention","avoidance","banker's algorithm","detection","recovery"],
    modelAnswer: "DEADLOCK: Processes wait for each other\nindefinitely, none can proceed.\n\n4 Coffman Conditions (ALL must be true):\n1. Mutual Exclusion: Resource held by only one process\n2. Hold & Wait: Process holding resource waits for more\n3. No Preemption: Resources can't be forcibly taken\n4. Circular Wait: Cycle in the wait-for graph\n\nHANDLING:\nPrevention: Eliminate one condition\n- No hold & wait: request all resources at once\n- Allow preemption: take resource if needed\n- Impose ordering: assign numbers to resources\n\nAvoidance: Banker's Algorithm\n- Always keep system in 'safe state'\n- Check if resource grant keeps safe state\n\nDetection + Recovery:\n- Detect cycle in resource allocation graph\n- Rollback or kill processes to break deadlock",
    rubric: {excellent: "4 conditions + all 3 handling strategies + examples", good: "4 conditions + 2 handling strategies", average: "4 conditions only", poor: "Less than 4 conditions or incorrect"},
    hint1: "Remember: ALL 4 conditions must hold simultaneously for deadlock", hint2: "Prevention = eliminate one condition. Avoidance = Banker's Algorithm.",
    tags: ["os", "deadlock", "concurrency", "coffman"]
  },
  {
    id: "tech_008", title: "REST API Design Principles", category: "technical", subcategory: "System Design", type: "theory", difficulty: "medium", companies: ["amazon","google","microsoft","zoho","adobe"], year: 2024, timeLimit: 180, points: 20, timesAsked: 445, successRate: 61,
    question: "What is a RESTful API?\nExplain the 6 REST constraints/principles\nand show examples of good REST API design\nfor a simple Todo application.",
    expectedKeywords: ["stateless","client server","cacheable","uniform interface","layered","code on demand","GET","POST","PUT","DELETE","HTTP methods","status codes","resource","endpoint"],
    modelAnswer: "REST: Representational State Transfer\n\n6 Constraints:\n1. Client-Server: Separation of concerns\n2. Stateless: Each request has all needed info\n3. Cacheable: Responses marked as cacheable or not\n4. Uniform Interface: Consistent resource naming\n5. Layered System: Client doesn't know about intermediaries\n6. Code on Demand (optional): Send executable code\n\nTodo API Example:\nGET    /todos          → get all todos (200)\nPOST   /todos          → create todo (201)\nGET    /todos/{id}     → get specific todo (200/404)\nPUT    /todos/{id}     → update todo (200)\nDELETE /todos/{id}     → delete todo (204)\nPATCH  /todos/{id}     → partial update (200)\n\nStatus codes: 200 OK, 201 Created, 400 Bad Request,\n401 Unauthorized, 404 Not Found, 500 Server Error",
    rubric: {excellent: "6 constraints + API example + status codes", good: "Key constraints + API example", average: "REST definition + HTTP methods only", poor: "Vague or incorrect REST principles"},
    hint1: "Think about what makes an API 'RESTful' vs just an API", hint2: "Focus on: stateless, uniform interface, and HTTP methods mapping",
    tags: ["api", "rest", "web", "http", "design"]
  },
  {
    id: "beh_001", title: "Tell Me About Yourself", category: "behavioral", subcategory: "Introduction", type: "behavioral", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 2341, successRate: 55,
    question: "Tell me about yourself.\n(This is the most asked question in every interview.\nIt sets the tone for the entire conversation.)",
    expectedKeywords: ["education","skills","project","achievement","interest","company","role","concise","present"],
    modelAnswer: "FORMULA: Present → Past → Future (90 seconds max)\n\nPresent: 'I'm a final-year CSE student at [College],\nspecializing in full-stack development with React & Node.js.'\n\nPast: 'During my internship at [Company], I built a\nreal-time dashboard that reduced report generation\ntime by 60%. I've also completed 200+ DSA problems\non LeetCode and built 3 full-stack projects.'\n\nFuture: 'I'm excited about this [Role] at [Company]\nbecause [specific reason — show research].\nI want to [specific goal] and I believe this role\nis the perfect next step.'\n\nKey rules:\n✓ Keep under 90 seconds\n✓ Connect to THIS company and THIS role\n✓ Mention one quantified achievement\n✗ Don't recite your resume\n✗ Don't mention personal life unless asked",
    rubric: {excellent: "Present-Past-Future, specific, quantified, company-connected", good: "Good structure, relevant, mentions company", average: "Decent but generic, no company connection", poor: "Too long/short, reads resume, no direction"},
    hint1: "Use Present → Past → Future structure", hint2: "Mention ONE quantified achievement and connect to the company",
    tags: ["introduction", "self-pitch", "hr", "first impression"]
  },
  {
    id: "beh_002", title: "Greatest Weakness", category: "behavioral", subcategory: "Self Awareness", type: "behavioral", difficulty: "medium", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 1876, successRate: 48,
    question: "What is your greatest weakness?\nHow are you actively working to improve it?",
    expectedKeywords: ["genuine","working on","improving","steps","progress","self-aware","not critical","example","action"],
    modelAnswer: "NEVER say: 'I work too hard' or \n'I'm a perfectionist' (clichés — interviewers hate these)\nNEVER say a critical skill for the job role.\n\nFORMULA: Real Weakness + Self-Awareness + Action + Progress\n\nExample (good answer):\n'I used to struggle with public speaking and\npresenting technical ideas to non-technical audiences.\nI realized this was holding me back, so I joined my\ncollege's debate club 6 months ago, presented at 2\ndepartmental seminars, and even gave a talk at our\ncollege tech fest. I'm still improving but I'm much\nmore comfortable now, and I actively look for\npresentation opportunities.'\n\nThe key is: show you are actively doing something about it.",
    rubric: {excellent: "Real weakness + concrete action steps + measurable progress", good: "Real weakness + some improvement steps", average: "Weakness mentioned but vague improvement", poor: "Cliche weakness / critical skill / no improvement"},
    hint1: "Choose a real but non-critical weakness (not core to the job)", hint2: "Show what you're ACTIVELY doing to improve — be specific",
    tags: ["self-awareness", "growth mindset", "hr", "weakness"]
  },
  {
    id: "beh_003", title: "Conflict with Team Member", category: "behavioral", subcategory: "Teamwork", type: "behavioral", difficulty: "medium", companies: ["amazon","google","microsoft"], year: 2024, timeLimit: 180, points: 20, timesAsked: 934, successRate: 51,
    question: "Tell me about a time you had a\ndisagreement with a team member.\nHow did you handle it and what was the outcome?\n(Use STAR format)",
    expectedKeywords: ["situation","action","result","listen","perspective","communicate","resolved","outcome","respect","professional","data","compromise"],
    modelAnswer: "S: 'During our final year project, my teammate\nand I disagreed about the database architecture.\nI wanted PostgreSQL for ACID compliance; they\npreferred MongoDB for flexibility.'\n\nT: 'We needed to make a decision quickly as\nimplementation was starting in 2 days.'\n\nA: 'I proposed we each prepare a 5-minute case\nfor our approach with data and benchmarks.\nI listened to their concerns — they were worried\nabout schema rigidity. I acknowledged the valid\npoints and suggested a hybrid: PostgreSQL for\nuser data (requiring consistency) and MongoDB\nfor logs (flexible schema needed).'\n\nR: 'We both agreed on the hybrid approach.\nThe project got full marks and we maintained\na great working relationship. I learned to\nvalidate others' perspectives before defending mine.'",
    rubric: {excellent: "Full STAR + listened first + data-driven + positive outcome", good: "STAR format + conflict resolved positively", average: "Story told but informal structure", poor: "Blaming others / no resolution / unprofessional"},
    hint1: "Start with STAR: Situation, Task, Action, Result", hint2: "Show that you LISTENED to their perspective first before defending yours",
    tags: ["conflict", "teamwork", "star", "communication"]
  },
  {
    id: "beh_004", title: "Why This Company?", category: "behavioral", subcategory: "Company Research", type: "behavioral", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 1654, successRate: 57,
    question: "Why do you want to work at [Company]?\nWhat specifically attracts you to this\nrole and this organization?",
    expectedKeywords: ["research","mission","values","product","specific","contribute","growth","aligned","culture","technology","opportunity"],
    modelAnswer: "STRUCTURE: Research → Values Alignment → Contribution\n\nBAD: 'You're a big company with good salary and brand name.'\nBAD: 'It's been my dream company since childhood.'\n\nGOOD: 'I've been following [Company]'s work on [specific\nproduct/project/tech]. Your [specific value/mission]\nresonates deeply with how I approach [related thing].\n\nSpecifically, your recent work on [specific initiative]\nis exactly the kind of problem I want to work on.\nI've already built [related project] which showed me\nthe complexity of this space.\n\nI believe my skills in [relevant skill] can contribute\nto [specific team/product], and I want to grow into\n[specific career goal] which I believe this role enables.'\n\nShow: You researched. You're aligned. You'll contribute.",
    rubric: {excellent: "Specific product/mission + skills alignment + contribution plan", good: "Genuine reasons + company mentioned specifically", average: "Generic reasons without research evidence", poor: "Only salary/brand/perks/dream company clichés"},
    hint1: "Research the company's recent news, products, and mission before answering", hint2: "Structure: What you admire + How you align + What you'll bring",
    tags: ["company research", "motivation", "culture fit", "preparation"]
  },
  {
    id: "beh_005", title: "Handled Failure or Mistake", category: "behavioral", subcategory: "Problem Solving", type: "behavioral", difficulty: "medium", companies: ["amazon","google","microsoft"], year: 2024, timeLimit: 180, points: 20, timesAsked: 678, successRate: 49,
    question: "Tell me about a time you failed\nor made a significant mistake.\nWhat did you learn from it?",
    expectedKeywords: ["failed","mistake","learned","responsibility","action","improved","outcome","accountability","next time","reflection"],
    modelAnswer: "KEY: Show ownership, learning, and growth.\nDon't blame others. Don't choose a trivial mistake.\n\nS: 'In my 3rd year project, I underestimated the\ntime needed for database integration and assured\nmy team we'd finish in 2 days. It took 6 days.'\n\nT: 'This delayed our submission and required\nmy team to work extra hours.'\n\nA: 'I immediately took responsibility, apologized\nto my team, redistributed tasks to compensate,\nand worked overnight to minimize the delay.\nI also had an honest conversation with our professor\nexplaining what went wrong.'\n\nR: 'We submitted only 1 day late. More importantly,\nI now always add 50% buffer to time estimates,\nbreak large tasks into measurable milestones,\nand communicate risks early. Haven't had a similar\nissue since.'",
    rubric: {excellent: "Real failure + ownership + concrete lesson + behavioral change", good: "Real failure + some learning + accountability", average: "Minor failure or vague lesson learned", poor: "Blaming others / trivial mistake / no real learning"},
    hint1: "Choose a REAL failure — interviewers can tell when it's fabricated", hint2: "The 'lesson learned' is more important than the failure itself",
    tags: ["failure", "accountability", "growth", "learning"]
  },
  {
    id: "beh_006", title: "5-Year Career Goals", category: "behavioral", subcategory: "Career Planning", type: "behavioral", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 1432, successRate: 62,
    question: "Where do you see yourself in 5 years?\nHow does this role align with your\nlong-term career goals?",
    expectedKeywords: ["growth","technical","skills","role","contribute","learn","aligned","specific","leadership","expertise","realistic"],
    modelAnswer: "KEY: Be specific, realistic, and connected\nto THIS company and role.\n\nBAD: 'I want to be a manager' (sounds like you'll leave the role)\nBAD: 'I want to be CEO' (unrealistic)\nBAD: 'I'm not sure' (no ambition)\n\nGOOD: 'In 5 years, I see myself as a Senior Software\nEngineer with deep expertise in [relevant domain —\nmatch to company].\n\nIn the first 2 years, I want to contribute meaningfully\nto [team/product], mastering [specific tech stack].\nBy year 3-4, I'd like to be leading small features\nend-to-end and mentoring newer engineers.\nBy year 5, I want to be the go-to person for\n[technical area] in my team.\n\n[Company] is the ideal place for this journey because\n[specific reason — scale/technology/domain].'",
    rubric: {excellent: "Specific 5-year plan + company connection + realistic progression", good: "Reasonable goals with some company connection", average: "Generic goals without company link", poor: "Vague / unrealistic / no company connection"},
    hint1: "Think in phases: Year 1-2 (learning), Year 3-4 (leading), Year 5 (expert)", hint2: "Always connect your goals to THIS specific company and role",
    tags: ["career goals", "5 years", "ambition", "planning"]
  },
  {
    id: "hr_001", title: "Salary Expectations", category: "hr", subcategory: "Salary Negotiation", type: "behavioral", difficulty: "medium", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 1123, successRate: 44,
    question: "What are your salary expectations?\nHow did you arrive at this figure?",
    expectedKeywords: ["research","market","skills","negotiable","range","experience","value","flexible","industry"],
    modelAnswer: "STRATEGY: Research → Range → Justify → Flexible\n\nStep 1: Research before the interview\n- Check Glassdoor, LinkedIn, AmbitionBox for role\n- Know: fresher range for this company + city\n\nStep 2: Give a RANGE, not a single number\n'Based on my research of market rates for this role\nand my skill set in [specific skills], I'm looking\nat ₹X - ₹Y LPA.'\n\nStep 3: Justify your range\n'I have [specific skills/projects/internship] that\nI believe add value. I've also seen similar roles\noffer this range at comparable companies.'\n\nStep 4: Show flexibility\n'That said, I'm also very interested in the total\ncompensation including growth opportunities and\nlearning, and I'm open to discussion.'\n\nFor freshers: Don't undersell yourself.\nResearch the company's known fresher salary first.",
    rubric: {excellent: "Research-backed range + justification + flexible tone", good: "Range given + some justification", average: "Single number without research", poor: "No answer / too high without reason / 'anything is fine'"},
    hint1: "Always research the company's known salary range BEFORE the interview", hint2: "Give a range (not a single number), justify it, and stay flexible",
    tags: ["salary", "negotiation", "hr", "compensation"]
  },
  {
    id: "hr_002", title: "Relocation and Flexibility", category: "hr", subcategory: "Situational", type: "behavioral", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 90, points: 10, timesAsked: 876, successRate: 73,
    question: "Are you open to relocation?\nAre you comfortable working in night shifts\nor rotational shifts if the role requires it?",
    expectedKeywords: ["open","flexible","willing","opportunity","discuss","comfortable","requirements","role"],
    modelAnswer: "APPROACH: Be honest but positive about flexibility.\n\nFor Relocation:\n'Yes, I'm open to relocation. I understand that\ngreat opportunities may require flexibility, and\nI'm prepared for that. Could you tell me which\nlocations this role might require?'\n(Then decide based on their answer — but don't\nclose the door immediately in the interview)\n\nFor Shifts:\n'I understand that the role may have shift requirements.\nI'm comfortable discussing shift arrangements and\nfinding a setup that works for both the team and me.'\n\nKEY: Never give a hard 'no' in the interview itself.\nIf you have genuine constraints, mention them\ndiplomatically after you've received an offer.",
    rubric: {excellent: "Open and positive + asks clarifying question", good: "Positive and willing with some caveats", average: "Vague or hesitant", poor: "Hard 'no' without context or discussion"},
    hint1: "Be genuinely flexible if you can — it helps your candidacy", hint2: "Ask a clarifying question about the specifics before committing",
    tags: ["relocation", "flexibility", "shifts", "hr"]
  },
  {
    id: "hr_003", title: "Strengths — Top 3", category: "hr", subcategory: "Self Assessment", type: "behavioral", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 1543, successRate: 68,
    question: "What are your top 3 strengths?\nGive specific examples of how each strength\nhas helped you in your academic or professional life.",
    expectedKeywords: ["example","specific","result","evidence","relevant","demonstrated","impact","project","outcome"],
    modelAnswer: "RULE: Never just list traits. PROVE each one.\n\nFORMAT: Strength → Specific Example → Result\n\nStrength 1: Problem Solving\n'I'm a strong problem solver. When our team's\nML model had 40% accuracy, I systematically\nanalyzed the data pipeline, found a preprocessing\nbug, and improved accuracy to 87%.'\n\nStrength 2: Fast Learner\n'I can pick up new technologies quickly.\nI learned React in 2 weeks to complete an\ninternship project when the original developer left.\nThe feature shipped on time.'\n\nStrength 3: Communication\n'I can explain complex things simply.\nI've tutored 15 juniors in DSA, and 12 of them\ncleared their placement rounds.'\n\nChoose strengths RELEVANT to the job role.",
    rubric: {excellent: "3 strengths + specific example + measurable result for each", good: "3 strengths with examples (not all quantified)", average: "3 strengths with vague examples", poor: "Just listing traits with no evidence"},
    hint1: "Pick strengths RELEVANT to the job you're applying for", hint2: "For each strength: Name it → Prove it with a story → Show the result",
    tags: ["strengths", "self assessment", "hr", "examples"]
  },
  {
    id: "apt_011", title: "Blood Relations", category: "aptitude", subcategory: "Logical Reasoning", type: "mcq", difficulty: "medium", companies: ["tcs", "wipro", "infosys"], year: 2024, timeLimit: 60, points: 10, timesAsked: 89, successRate: 65,
    question: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
    options: { A: "His own", B: "His son's", C: "His father's", D: "His nephew's" },
    correct: "B",
    explanation: "Since he has no brother or sister, 'my father's son' is the man himself. So, the man in the photograph's father is the speaker. Hence, the photograph is of his son.",
    tags: ["blood relations", "reasoning"], hint1: "Break it down: who is 'my father's son'?", hint2: "If he has no siblings, 'my father's son' can only be one person."
  },
  {
    id: "apt_012", title: "Coding and Decoding", category: "aptitude", subcategory: "Logical Reasoning", type: "mcq", difficulty: "easy", companies: ["cognizant", "capgemini"], year: 2024, timeLimit: 60, points: 5, timesAsked: 112, successRate: 82,
    question: "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded in that code?",
    options: { A: "CPNCBX", B: "CPNCBZ", C: "CPOCBZ", D: "CQOCBZ" },
    correct: "B",
    explanation: "Each letter in the word is moved one step forward to obtain the corresponding letter of the code. B(+1)=C, O(+1)=P, M(+1)=N, B(+1)=C, A(+1)=B, Y(+1)=Z.",
    tags: ["coding", "letters"], hint1: "Look at the relation between M and N, A and B...", hint2: "Just shift each letter by +1."
  },
  {
    id: "dsa_006", title: "Merge Two Sorted Lists", category: "dsa", subcategory: "Linked List", type: "coding", difficulty: "easy", companies: ["amazon", "microsoft"], year: 2024, timeLimit: 180, points: 20, timesAsked: 445, successRate: 65,
    question: "You are given the heads of two sorted linked lists list1 and list2.\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.",
    examples: [{input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]"}],
    constraints: ["The number of nodes in both lists is in the range [0, 50]", "-100 <= Node.val <= 100"],
    starterCode: {python: "def mergeTwoLists(list1, list2):\n    pass"},
    testCases: [{input: "", expected: "", label: "Base Case"}],
    expectedKeywords: ["dummy", "node", "current"], modelAnswer: "Use a dummy head. Iterate while both lists exist, attaching the smaller node. Finally, attach the remaining elements.",
    hint1: "Use a dummy node to simplify the head edge cases.", hint2: "Compare list1.val and list2.val at each step.", tags: ["linked list", "sorting"], solution: "def mergeTwoLists(l1, l2):\n    dummy = cur = ListNode(0)\n    while l1 and l2:\n        if l1.val < l2.val:\n            cur.next, l1 = l1, l1.next\n        else:\n            cur.next, l2 = l2, l2.next\n        cur = cur.next\n    cur.next = l1 or l2\n    return dummy.next"
  },
  {
    id: "dsa_007", title: "Valid Palindrome", category: "dsa", subcategory: "Arrays & Strings", type: "coding", difficulty: "easy", companies: ["google", "zoho"], year: 2024, timeLimit: 120, points: 15, timesAsked: 320, successRate: 78,
    question: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\nGiven a string s, return true if it is a palindrome, or false otherwise.",
    examples: [{input: "s = \"A man, a plan, a canal: Panama\"", output: "true"}],
    constraints: ["1 <= s.length <= 2 * 10^5"],
    starterCode: {python: "def isPalindrome(s):\n    pass"},
    testCases: [{input: "\"racecar\"", expected: "true", label: "Simple"}],
    expectedKeywords: ["two pointer", "alphanumeric", "lowercase"], modelAnswer: "Two pointer approach from start and end, skipping non-alphanumeric chars.",
    hint1: "You can use two pointers: left starting at 0, right at the end.", hint2: "Make sure to ignore spaces and punctuation.", tags: ["string", "two pointers"], solution: "def isPalindrome(s):\n    l, r = 0, len(s)-1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l +=1; r -= 1\n    return True"
  },
  {
    id: "dsa_008", title: "Climbing Stairs", category: "dsa", subcategory: "Dynamic Programming", type: "coding", difficulty: "easy", companies: ["amazon"], year: 2024, timeLimit: 120, points: 15, timesAsked: 400, successRate: 75,
    question: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [{input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1"}],
    constraints: ["1 <= n <= 45"],
    starterCode: {python: "def climbStairs(n):\n    pass"},
    testCases: [{input: "3", expected: "3", label: "N=3"}],
    expectedKeywords: ["fibonacci", "dp"], modelAnswer: "This is a Fibonacci sequence. dp[i] = dp[i-1] + dp[i-2]",
    hint1: "To reach step n, you must have come from step n-1 or step n-2.", hint2: "It's exactly the Fibonacci sequence.", tags: ["dp", "fibonacci"], solution: "def climbStairs(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a"
  },
  {
    id: "dsa_009", title: "Reverse Linked List", category: "dsa", subcategory: "Linked List", type: "coding", difficulty: "easy", companies: ["microsoft", "google"], year: 2024, timeLimit: 120, points: 15, timesAsked: 520, successRate: 70,
    question: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [{input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]"}],
    constraints: ["The number of nodes in the list is the range [0, 5000]."],
    starterCode: {python: "def reverseList(head):\n    pass"},
    testCases: [{input: "[1,2]", expected: "[2,1]", label: "Short list"}],
    expectedKeywords: ["prev", "curr", "next"], modelAnswer: "Iterate with prev, curr, next pointers. curr.next = prev; prev=curr; curr=next.",
    hint1: "Keep track of the previous node.", hint2: "Update the next pointer of the current node to point to the previous node.", tags: ["linked list", "pointers"], solution: "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev"
  },
  {
    id: "tech_009", title: "OSI Model Layers", category: "technical", subcategory: "Computer Networks", type: "theory", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 600, successRate: 68,
    question: "List the 7 layers of the OSI model and briefly describe their functions.",
    expectedKeywords: ["physical", "data link", "network", "transport", "session", "presentation", "application"],
    modelAnswer: "1. Physical: Raw bit stream over physical medium.\n2. Data Link: Node-to-node transfer (MAC).\n3. Network: Routing and IP addressing.\n4. Transport: End-to-end connections (TCP/UDP).\n5. Session: Manage sessions and ports.\n6. Presentation: Data translation, encryption.\n7. Application: User interface (HTTP).",
    rubric: {excellent: "All 7 layers mentioned in order with correct functions.", good: "All 7 listed, some functions missing.", average: "Partial list.", poor: "Incorrect layers."},
    hint1: "Please Do Not Throw Sausage Pizza Away", hint2: "Physical layer is at the bottom, Application is at the top.", tags: ["osi", "networking"]
  },
  {
    id: "tech_010", title: "TCP vs UDP", category: "technical", subcategory: "Computer Networks", type: "theory", difficulty: "easy", companies: ["amazon", "microsoft"], year: 2024, timeLimit: 120, points: 15, timesAsked: 550, successRate: 72,
    question: "Explain the main differences between TCP and UDP protocols. When would you use which?",
    expectedKeywords: ["reliable", "connection-oriented", "fast", "connectionless", "guarantee"],
    modelAnswer: "TCP is connection-oriented and reliable (guaranteed delivery, ordered). Used for web browsing, emails.\nUDP is connectionless, fast, no guarantees of delivery or order. Used for video streaming, gaming, VoIP.",
    rubric: {excellent: "Accurate comparison of reliability, connection type, and use cases.", good: "Basic differences mentioned.", average: "Only one protocol described.", poor: "Incorrect differences."},
    hint1: "Think about reliability vs speed.", hint2: "Which one do you use for YouTube vs sending an email?", tags: ["tcp", "udp", "networking"]
  },
  {
    id: "tech_011", title: "What is Git?", category: "technical", subcategory: "Tools & Version Control", type: "theory", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 10, timesAsked: 800, successRate: 85,
    question: "What is Git and why is it used? Mention the difference between Git and GitHub.",
    expectedKeywords: ["version control", "distributed", "commits", "repository", "hosting", "collaboration"],
    modelAnswer: "Git is a distributed version control system used to track changes in source code. It allows multiple developers to work together.\nGitHub is a cloud-based hosting service that lets you manage Git repositories.",
    rubric: {excellent: "Clear distinction between Git (tool) and GitHub (service).", good: "Basic understanding shown.", average: "Vague definition.", poor: "Thinks Git and GitHub are the same."},
    hint1: "One is a local tool, the other is a website.", hint2: "Git is the engine, GitHub is the garage.", tags: ["git", "vcs"]
  },
  {
    id: "tech_012", title: "Array vs Linked List", category: "technical", subcategory: "Data Structures", type: "theory", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 900, successRate: 80,
    question: "Compare Arrays and Linked Lists in terms of memory allocation, access time, and insertion/deletion time.",
    expectedKeywords: ["contiguous", "random access", "pointers", "O(1)", "O(n)"],
    modelAnswer: "Arrays: Contiguous memory. O(1) random access. O(n) insertion/deletion (need to shift elements).\nLinked Lists: Non-contiguous (nodes with pointers). O(n) access. O(1) insertion/deletion if pointer is given.",
    rubric: {excellent: "Correct big-O complexities and memory layout discussed.", good: "General differences discussed.", average: "Only memory or only speed mentioned.", poor: "Mixes them up."},
    hint1: "How do you access the 100th element in each?", hint2: "Arrays are fixed/dynamic blocks, Linked Lists are scattered nodes.", tags: ["data structures", "array", "linked list"]
  },
  {
    id: "tech_013", title: "Primary Key vs Foreign Key", category: "technical", subcategory: "DBMS & SQL", type: "theory", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 700, successRate: 75,
    question: "What is the difference between a Primary Key and a Foreign Key in a relational database?",
    expectedKeywords: ["unique", "identifier", "reference", "relation", "null"],
    modelAnswer: "Primary Key uniquely identifies a record in a table. Cannot be NULL.\nForeign Key is a field that uniquely identifies a row of another table, establishing a link/relationship between the two tables. Can accept NULL values.",
    rubric: {excellent: "Clear definitions and mentions relationship creation.", good: "Basic definitions.", average: "Confuses the two slightly.", poor: "Completely wrong."},
    hint1: "Primary means main identifier for the table itself.", hint2: "Foreign points to something outside.", tags: ["sql", "keys", "dbms"]
  },
  {
    id: "tech_014", title: "Singleton Design Pattern", category: "technical", subcategory: "System Design", type: "theory", difficulty: "medium", companies: ["amazon", "microsoft"], year: 2024, timeLimit: 150, points: 20, timesAsked: 300, successRate: 50,
    question: "What is the Singleton design pattern? Give an example use case.",
    expectedKeywords: ["one instance", "global access", "constructor", "private"],
    modelAnswer: "Singleton ensures a class has only one instance and provides a global point of access to it.\nAchieved via private constructor and a static mechanism to return the instance.\nUse case: Database connection pool, Configuration manager.",
    rubric: {excellent: "Correctly explains implementation and provides a real use case.", good: "Explains standard definition.", average: "Vague understanding.", poor: "Thinks it means a single file."},
    hint1: "Single = only one.", hint2: "How would you prevent others from using the `new` keyword?", tags: ["design patterns", "oop"]
  },
  {
    id: "beh_007", title: "Leadership Experience", category: "behavioral", subcategory: "Leadership", type: "behavioral", difficulty: "medium", companies: ["amazon", "google"], year: 2024, timeLimit: 150, points: 15, timesAsked: 400, successRate: 60,
    question: "Tell me about a time you took the lead on a difficult project or situation.",
    expectedKeywords: ["initiative", "guidance", "team", "organization", "result"],
    modelAnswer: "Use STAR format.\nS: Group project where the leader dropped out.\nT: We were falling behind timeline with a complex tech stack.\nA: I stepped up, reorganized our Trello board, assigned tasks based on strengths, and set up daily 10-minute standups.\nR: We delivered the project on time and got an A grade.",
    rubric: {excellent: "STAR format used, clear initiative shown, positive outcome.", good: "Clear example of leading.", average: "Just 'I managed a team'.", poor: "No leadership examples."},
    hint1: "It doesn't have to be an official title, just a time you stepped up.", hint2: "Use STAR format.", tags: ["leadership", "initiative", "star"]
  },
  {
    id: "beh_008", title: "Working Under Pressure", category: "behavioral", subcategory: "Problem Solving", type: "behavioral", difficulty: "medium", companies: ["all"], year: 2024, timeLimit: 120, points: 15, timesAsked: 600, successRate: 65,
    question: "Can you describe a time when you had to work under significant pressure or a tight deadline?",
    expectedKeywords: ["prioritize", "calm", "focus", "deadline", "delivered"],
    modelAnswer: "Use STAR format.\nS: Hackathon final hours and our main feature broke.\nT: 2 hours left before presentation.\nA: I stayed calm, isolated the broken module, reverted to a stable commit, and we built a simpler version of the feature while dividing the testing and presentation prep.\nR: We presented successfully and won 3rd place.",
    rubric: {excellent: "Shows prioritization and calm demeanor under stress.", good: "Valid pressure situation and resolution.", average: "Generic 'I study before exams'.", poor: "Complains about the pressure."},
    hint1: "How do you organize tasks when time is short?", hint2: "Focus on staying calm and prioritizing.", tags: ["pressure", "deadlines", "star"]
  },
  {
    id: "beh_009", title: "Disagreed with a Manager", category: "behavioral", subcategory: "Communication", type: "behavioral", difficulty: "hard", companies: ["amazon", "microsoft"], year: 2024, timeLimit: 180, points: 20, timesAsked: 250, successRate: 40,
    question: "Tell me about a time you disagreed with a manager or professor. How did you handle it?",
    expectedKeywords: ["respectful", "data", "discussion", "commit", "perspective"],
    modelAnswer: "Use STAR format.\nEmphasize that the disagreement was professional. You brought data to support your view, had a private and respectful conversation, listened to their perspective.\nIf they went with your idea, state the positive outcome.\nIf they stuck with their idea, emphasize that you 'disagreed and committed' and supported the team fully.",
    rubric: {excellent: "Highly professional, data-centric, ego-less approach.", good: "Respectful disagreement shown.", average: "Mild disagreement.", poor: "Disrespectful / 'I was right, they were wrong'."},
    hint1: "Amazon loves \"Disagree and Commit\".", hint2: "Keep it respectful and data-driven.", tags: ["conflict", "authority", "star"]
  },
  {
    id: "hr_004", title: "Why did you choose your degree?", category: "hr", subcategory: "Introduction", type: "behavioral", difficulty: "easy", companies: ["infosys", "tcs", "wipro"], year: 2024, timeLimit: 120, points: 10, timesAsked: 500, successRate: 70,
    question: "Why did you choose to study Computer Science (or your specific degree)?",
    expectedKeywords: ["passion", "problem-solving", "logic", "impact", "technology"],
    modelAnswer: "Focus on passion for problem solving.\n'I've always been interested in logic puzzles. When I wrote my first script in high school and saw how lines of text could automate tasks, I was hooked. I chose CS because it's the closest thing to real-world magic—building solutions that can impact millions from a single laptop.'",
    rubric: {excellent: "Answers with genuine passion and an interesting anecdote.", good: "Standard passion for tech.", average: "'Because it pays well' or 'Parents told me'.", poor: "No real reason."},
    hint1: "Think back to your first coding experience.", hint2: "Show passion, not just career progression.", tags: ["motivation", "education", "hr"]
  },
  {
    id: "hr_005", title: "Are you a team player?", category: "hr", subcategory: "Teamwork", type: "behavioral", difficulty: "easy", companies: ["all"], year: 2024, timeLimit: 120, points: 10, timesAsked: 800, successRate: 75,
    question: "Are you a team player? Give an example.",
    expectedKeywords: ["collaborate", "support", "listen", "shared goals"],
    modelAnswer: "Always yes. Prove it with a quick example.\n'Yes, I thrive in teams. In my recent group project, one member was struggling with the frontend React components. I spent my weekend pair-programming with them. We caught up to the deadline, and they learned a new skill. I believe team success is more important than individual glory.'",
    rubric: {excellent: "Provides a concrete example of helping or collaborating seamlessly.", good: "General 'yes' with a vague example.", average: "Just says 'yes I like teams'.", poor: "Says they prefer working alone."},
    hint1: "Don't just say yes, prove it.", hint2: "Think of a time you helped someone or compromised for the team.", tags: ["teamwork", "hr", "collaboration"]
  },
    {
    id: "tech_015", title: "Compiled vs Interpreted languages", category: "technical", subcategory: "Core Computer Science", type: "theory", difficulty: "easy", companies: ["tcs","infosys","wipro"], year: 2024, timeLimit: 120, points: 15, timesAsked: 800, successRate: 85,
    question: "Difference between compiled and interpreted languages?",
    expectedKeywords: ["compile","interpret","binary","speed","runtime","C++","Python"],
    modelAnswer: "Compiled languages (C++) translate all code to binary before execution, making them faster but platform-dependent. Interpreted languages (Python) translate code line-by-line during runtime, making them slower but more platform-independent.",
    rubric: {excellent: "Clear definitions with examples of languages.", good: "Basic differences mentioned.", average: "Only one type described.", poor: "Incorrect differences."},
    hint1: "Think about when the code translation happens.", hint2: "Why is C++ faster than Python?", tags: ["compilation", "languages"]
  }
  ],
  companySets: {
  amazon: {
    name: "Amazon Complete Interview Set 2024", totalQuestions: 45,
    rounds: [
      { name:"Online Assessment", questionIds:["apt_001","apt_002","apt_003","dsa_001","dsa_003"], duration:"90 min" },
      { name:"Technical Round 1 — DSA", questionIds:["dsa_002","dsa_004","dsa_005"], duration:"60 min" },
      { name:"Technical Round 2 — System Design", questionIds:["tech_005","tech_008"], duration:"60 min" },
      { name:"Bar Raiser + HR", questionIds:["beh_001","beh_002","beh_003","beh_005"], duration:"45 min" }
    ]
  },
  google: {
    name: "Google Complete Interview Set 2024", totalQuestions: 38,
    rounds: [
      { name:"Phone Screen", questionIds:["dsa_001","dsa_003"], duration:"45 min" },
      { name:"Onsite Round 1 — Algorithms", questionIds:["dsa_004","dsa_005"], duration:"45 min" },
      { name:"Onsite Round 2 — System Design", questionIds:["tech_005"], duration:"45 min" },
      { name:"Googleyness Round", questionIds:["beh_003","beh_004","beh_006"], duration:"45 min" }
    ]
  },
  tcs: {
    name: "TCS NQT Complete Set 2024", totalQuestions: 35,
    rounds: [
      { name:"NQT — Aptitude", questionIds:["apt_001","apt_002","apt_003","apt_007","apt_009"], duration:"60 min" },
      { name:"NQT — Verbal & Reasoning", questionIds:["apt_006","apt_008"], duration:"30 min" },
      { name:"Technical Interview", questionIds:["tech_001","tech_002","tech_003","tech_006"], duration:"45 min" },
      { name:"HR Interview", questionIds:["hr_001","hr_002","hr_003","beh_001","beh_002"], duration:"30 min" }
    ]
  }
}
};

window.QUESTION_BANK_DATA = QUESTION_BANK_DATA;
