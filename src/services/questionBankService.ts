// src/services/questionBankService.ts

export interface Question {
    id: string;
    text: string;
    category: 'HR' | 'Technical' | 'DSA' | 'System Design';
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

const QUESTIONS: Question[] = [
    // HR
    { id: 'hr_1', text: "Tell me about a time you solved a complex technical problem under pressure.", category: 'HR', difficulty: 'Medium' },
    { id: 'hr_2', text: "Describe a situation where you had to work with a difficult team member.", category: 'HR', difficulty: 'Medium' },
    { id: 'hr_3', text: "What is your greatest strength, and how has it helped you professionally?", category: 'HR', difficulty: 'Easy' },
    { id: 'hr_4', text: "Why do you want to work at this company?", category: 'HR', difficulty: 'Easy' },
    
    // Technical
    { id: 'tech_1', text: "Explain the difference between a process and a thread.", category: 'Technical', difficulty: 'Medium' },
    { id: 'tech_2', text: "What is normalisation in databases? Explain up to 3NF.", category: 'Technical', difficulty: 'Medium' },
    { id: 'tech_3', text: "Describe the SOLID principles of object-oriented design.", category: 'Technical', difficulty: 'Hard' },
    { id: 'tech_4', text: "What happens when you type a URL into a browser?", category: 'Technical', difficulty: 'Easy' },

    // DSA
    { id: 'dsa_1', text: "How would you find the middle element of a linked list in one pass?", category: 'DSA', difficulty: 'Easy' },
    { id: 'dsa_2', text: "Explain your approach to detect a cycle in a directed graph.", category: 'DSA', difficulty: 'Medium' },
    { id: 'dsa_3', text: "Describe how you would implement an LRU Cache.", category: 'DSA', difficulty: 'Hard' },
    { id: 'dsa_4', text: "Walk me through solving the 'Two Sum' problem optimally.", category: 'DSA', difficulty: 'Easy' },

    // System Design
    { id: 'sys_1', text: "How would you design a URL shortening service like bit.ly?", category: 'System Design', difficulty: 'Medium' },
    { id: 'sys_2', text: "Design a real-time chat system that supports group conversations.", category: 'System Design', difficulty: 'Hard' },
    { id: 'sys_3', text: "How would you architect a notification service at scale?", category: 'System Design', difficulty: 'Hard' },
    { id: 'sys_4', text: "Design a rate limiter for a public API.", category: 'System Design', difficulty: 'Medium' }
];

export const questionBankService = {
    getQuestionsByCategory(category: string): Question[] {
        return QUESTIONS.filter(q => q.category.toLowerCase() === category.toLowerCase());
    },

    getRandomQuestion(category?: string): Question {
        const pool = category ? this.getQuestionsByCategory(category) : QUESTIONS;
        return pool[Math.floor(Math.random() * pool.length)];
    },

    getAllCategories(): string[] {
        return Array.from(new Set(QUESTIONS.map(q => q.category)));
    }
};
