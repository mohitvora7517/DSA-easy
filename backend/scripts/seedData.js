const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Level = require('../models/Level');
const Problem = require('../models/Problem');
const Achievement = require('../models/Achievement');

// Sample data
const sampleLevels = [
  {
    levelNumber: 1,
    title: "Array Basics",
    description: "Learn the fundamentals of arrays and basic operations",
    category: "arrays",
    difficulty: "beginner",
    xpReward: 100,
    pointsReward: 50,
    icon: "📊",
    color: "#3B82F6",
    isUnlocked: true
  },
  {
    levelNumber: 2,
    title: "String Manipulation",
    description: "Master string operations and common string algorithms",
    category: "strings",
    difficulty: "beginner",
    xpReward: 120,
    pointsReward: 60,
    icon: "📝",
    color: "#10B981",
    isUnlocked: false
  },
  {
    levelNumber: 3,
    title: "Two Pointers",
    description: "Learn the powerful two-pointer technique for array problems",
    category: "arrays",
    difficulty: "intermediate",
    xpReward: 150,
    pointsReward: 75,
    icon: "🎯",
    color: "#F59E0B",
    isUnlocked: false
  },
  {
    levelNumber: 4,
    title: "Linked Lists",
    description: "Understand linked list data structure and common operations",
    category: "linked-lists",
    difficulty: "intermediate",
    xpReward: 180,
    pointsReward: 90,
    icon: "🔗",
    color: "#8B5CF6",
    isUnlocked: false
  },
  {
    levelNumber: 5,
    title: "Binary Trees",
    description: "Explore tree data structures and tree traversal algorithms",
    category: "trees",
    difficulty: "intermediate",
    xpReward: 200,
    pointsReward: 100,
    icon: "🌳",
    color: "#EF4444",
    isUnlocked: false
  }
];

const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "easy",
    category: "arrays",
    points: 10,
    timeLimit: 2000,
    memoryLimit: 128,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the thing that is a little tricky here is that we have to return the indices, not the values.",
      "So we need a way to look up the index of a value in constant time."
    ],
    starterCode: {
      javascript: `function solution(nums, target) {
    // Your code here
    return [];
}`,
      python: `def solution(nums, target):
    # Your code here
    return []`,
      java: `public int[] solution(int[] nums, int target) {
    // Your code here
    return new int[0];
}`,
      cpp: `vector<int> solution(vector<int>& nums, int target) {
    // Your code here
    return {};
}`
    },
    solution: {
      javascript: `function solution(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `def solution(nums, target):
    hashmap = {}
    for i in range(len(nums)):
        complement = target - nums[i]
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[nums[i]] = i
    return []`,
      java: `public int[] solution(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
      cpp: `vector<int> solution(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`
    },
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1],
        description: "Basic test case",
        isHidden: false
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expectedOutput: [1, 2],
        description: "Different indices",
        isHidden: false
      },
      {
        input: { nums: [3, 3], target: 6 },
        expectedOutput: [0, 1],
        description: "Same numbers",
        isHidden: false
      },
      {
        input: { nums: [1, 2, 3, 4, 5], target: 8 },
        expectedOutput: [2, 4],
        description: "Larger array",
        isHidden: true
      }
    ],
    tags: ["array", "hash-table"]
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "easy",
    category: "strings",
    points: 10,
    timeLimit: 2000,
    memoryLimit: 128,
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string contains valid parentheses."
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets are properly closed."
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "The closing bracket doesn't match the opening bracket."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    hints: [
      "Use a stack to keep track of opening brackets.",
      "When you encounter a closing bracket, check if it matches the most recent opening bracket.",
      "If the stack is empty when you encounter a closing bracket, it's invalid."
    ],
    starterCode: {
      javascript: `function solution(s) {
    // Your code here
    return false;
}`,
      python: `def solution(s):
    # Your code here
    return False`,
      java: `public boolean solution(String s) {
    // Your code here
    return false;
}`,
      cpp: `bool solution(string s) {
    // Your code here
    return false;
}`
    },
    solution: {
      javascript: `function solution(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char in map) {
            if (stack.length === 0 || stack.pop() !== map[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
      python: `def solution(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0`,
      java: `public boolean solution(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> map = new HashMap<>();
    map.put(')', '(');
    map.put('}', '{');
    map.put(']', '[');
    
    for (char c : s.toCharArray()) {
        if (map.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != map.get(c)) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    
    return stack.isEmpty();
}`,
      cpp: `bool solution(string s) {
    stack<char> st;
    unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
    
    for (char c : s) {
        if (map.count(c)) {
            if (st.empty() || st.top() != map[c]) {
                return false;
            }
            st.pop();
        } else {
            st.push(c);
        }
    }
    
    return st.empty();
}`
    },
    testCases: [
      {
        input: { s: "()" },
        expectedOutput: true,
        description: "Simple valid case",
        isHidden: false
      },
      {
        input: { s: "()[]{}" },
        expectedOutput: true,
        description: "Multiple bracket types",
        isHidden: false
      },
      {
        input: { s: "(]" },
        expectedOutput: false,
        description: "Invalid case",
        isHidden: false
      },
      {
        input: { s: "([)]" },
        expectedOutput: false,
        description: "Interleaved brackets",
        isHidden: true
      }
    ],
    tags: ["string", "stack"]
  },
  {
    title: "Maximum Subarray",
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.`,
    difficulty: "medium",
    category: "arrays",
    points: 15,
    timeLimit: 2000,
    memoryLimit: 128,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The single element has the largest sum."
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "[5,4,-1,7,8] has the largest sum = 23."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    hints: [
      "Think about the maximum sum ending at each position.",
      "If the current sum becomes negative, it's better to start fresh.",
      "This is known as Kadane's algorithm."
    ],
    starterCode: {
      javascript: `function solution(nums) {
    // Your code here
    return 0;
}`,
      python: `def solution(nums):
    # Your code here
    return 0`,
      java: `public int solution(int[] nums) {
    // Your code here
    return 0;
}`,
      cpp: `int solution(vector<int>& nums) {
    // Your code here
    return 0;
}`
    },
    solution: {
      javascript: `function solution(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      python: `def solution(nums):
    max_sum = current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
      java: `public int solution(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      cpp: `int solution(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    
    return maxSum;
}`
    },
    testCases: [
      {
        input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        expectedOutput: 6,
        description: "Standard test case",
        isHidden: false
      },
      {
        input: { nums: [1] },
        expectedOutput: 1,
        description: "Single element",
        isHidden: false
      },
      {
        input: { nums: [5, 4, -1, 7, 8] },
        expectedOutput: 23,
        description: "All positive",
        isHidden: false
      },
      {
        input: { nums: [-1, -2, -3, -4] },
        expectedOutput: -1,
        description: "All negative",
        isHidden: true
      }
    ],
    tags: ["array", "dynamic-programming", "divide-and-conquer"]
  }
];

const sampleAchievements = [
  {
    name: "First Steps",
    description: "Solve your first problem",
    icon: "🎯",
    category: "problem",
    criteria: {
      type: "problems_solved",
      value: 1
    },
    xpReward: 50,
    pointsReward: 25,
    rarity: "common",
    color: "#10B981"
  },
  {
    name: "Problem Solver",
    description: "Solve 10 problems",
    icon: "🏆",
    category: "problem",
    criteria: {
      type: "problems_solved",
      value: 10
    },
    xpReward: 200,
    pointsReward: 100,
    rarity: "uncommon",
    color: "#3B82F6"
  },
  {
    name: "Streak Master",
    description: "Maintain a 7-day coding streak",
    icon: "🔥",
    category: "streak",
    criteria: {
      type: "streak_days",
      value: 7
    },
    xpReward: 300,
    pointsReward: 150,
    rarity: "rare",
    color: "#F59E0B"
  },
  {
    name: "Level Up",
    description: "Reach level 5",
    icon: "⭐",
    category: "level",
    criteria: {
      type: "level_reached",
      value: 5
    },
    xpReward: 500,
    pointsReward: 250,
    rarity: "epic",
    color: "#8B5CF6"
  },
  {
    name: "Array Master",
    description: "Solve 20 array problems",
    icon: "📊",
    category: "category",
    criteria: {
      type: "category_mastery",
      value: 20,
      category: "arrays"
    },
    xpReward: 1000,
    pointsReward: 500,
    rarity: "legendary",
    color: "#EF4444"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-game');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Level.deleteMany({});
    await Problem.deleteMany({});
    await Achievement.deleteMany({});
    console.log('Cleared existing data');

    // Create levels
    const createdLevels = await Level.insertMany(sampleLevels);
    console.log(`Created ${createdLevels.length} levels`);

    // Create problems and assign to levels
    for (let i = 0; i < sampleProblems.length; i++) {
      const problem = sampleProblems[i];
      problem.level = createdLevels[0]._id; // Assign all problems to first level for now
      
      const createdProblem = await Problem.create(problem);
      
      // Add problem to level
      await Level.findByIdAndUpdate(
        createdLevels[0]._id,
        { $push: { problems: createdProblem._id } }
      );
    }
    console.log(`Created ${sampleProblems.length} problems`);

    // Create achievements
    const createdAchievements = await Achievement.insertMany(sampleAchievements);
    console.log(`Created ${createdAchievements.length} achievements`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();