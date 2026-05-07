const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../server/placenix.db');
const db = new Database(dbPath);

const dataPath = path.join(__dirname, '../js/questionBankData.js');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract the object from the JS file
const startMarker = 'const QUESTION_BANK_DATA = ';
const startIndex = dataContent.indexOf(startMarker);
const endMarker = 'window.QUESTION_BANK_DATA';
const endIndex = dataContent.indexOf(endMarker);
const jsonLike = dataContent.substring(startIndex + startMarker.length, endIndex).trim();

// Remove the trailing semicolon if it exists
let cleanJson = jsonLike;
if (cleanJson.endsWith(';')) {
    cleanJson = cleanJson.slice(0, -1);
}

// Using eval for a one-off seed script
let QUESTION_BANK_DATA;
try {
    QUESTION_BANK_DATA = eval(`(${cleanJson})`);
} catch (e) {
    console.error('Failed to parse question data:', e);
    console.log('Problematic snippet:', cleanJson.substring(cleanJson.length - 100));
    process.exit(1);
}

console.log('Seeding companies...');
const insertCompany = db.prepare(`
    INSERT OR REPLACE INTO companies (id, name, color, type)
    VALUES (?, ?, ?, ?)
`);

for (const [id, details] of Object.entries(QUESTION_BANK_DATA.companies)) {
    insertCompany.run(id, details.name, details.color, details.type);
}

console.log('Seeding questions...');
const insertQuestion = db.prepare(`
    INSERT OR REPLACE INTO questions (
        id, title, category, subcategory, type, difficulty, year, 
        time_limit, points, times_asked, success_rate, question_text,
        options_json, correct_option, explanation, tags_json, hints_json,
        examples_json, constraints_json, starter_code_json, test_cases_json,
        model_answer, solution_code
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
    )
`);

const insertMapping = db.prepare(`
    INSERT OR REPLACE INTO question_companies (question_id, company_id)
    VALUES (?, ?)
`);

db.transaction(() => {
    for (const q of QUESTION_BANK_DATA.questions) {
        insertQuestion.run(
            q.id,
            q.title,
            q.category,
            q.subcategory || null,
            q.type,
            q.difficulty,
            q.year || 2024,
            q.timeLimit || 0,
            q.points || 0,
            q.timesAsked || 0,
            q.successRate || 0,
            q.question || null,
            q.options ? JSON.stringify(q.options) : null,
            q.correct || null,
            q.explanation || null,
            q.tags ? JSON.stringify(q.tags) : '[]',
            JSON.stringify([q.hint1, q.hint2].filter(Boolean)),
            q.examples ? JSON.stringify(q.examples) : '[]',
            q.constraints ? JSON.stringify(q.constraints) : '[]',
            q.starterCode ? JSON.stringify(q.starterCode) : null,
            q.testCases ? JSON.stringify(q.testCases) : '[]',
            q.modelAnswer || null,
            q.solution || null
        );

        if (q.companies) {
            for (const companyId of q.companies) {
                if (companyId === 'all') {
                    // map to all existing companies
                    for (const cid of Object.keys(QUESTION_BANK_DATA.companies)) {
                        insertMapping.run(q.id, cid);
                    }
                } else {
                    insertMapping.run(q.id, companyId);
                }
            }
        }
    }
})();

console.log('👍 Seeding completed successfully!');
db.close();
