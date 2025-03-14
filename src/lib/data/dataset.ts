export interface DataEntry {
    id: string;
    question: string;
    answer: string;
    category: string;
    keywords: string[];
    variations: string[];
}

export const dataset: DataEntry[] = [
    {
        id: '2',
        question: "What's my name?",
        answer: "Your name is Chris. You're a programmer who created me to be your personal assistant.",
        category: 'personal',
        keywords: ['name', 'my', 'who', 'am', 'i'],
        variations: [
            'who am i',
            'what do you call me',
            'my name'
        ]
    },
    {
        id: '3',
        question: 'What are my work hours?',
        answer: 'You typically work from 9 AM to 5 PM on weekdays. You prefer to take breaks every 2 hours to maintain productivity.',
        category: 'schedule',
        keywords: ['work', 'hours', 'schedule', 'time'],
        variations: [
            'when do i work',
            'my schedule',
            'working hours'
        ]
    },
    {
        id: '4',
        question: 'What are my preferences?',
        answer: 'You prefer working in a quiet environment, enjoy coding in TypeScript and Svelte, and like to keep your workspace organized. Your favorite development setup includes VS Code with a dark theme.',
        category: 'preferences',
        keywords: ['like', 'prefer', 'favorite', 'preferences'],
        variations: [
            'what do i like',
            'my preferences',
            'favorite things'
        ]
    },
    {
        id: '5',
        question: 'What projects am I working on?',
        answer: "You're currently working on developing an AI chatbot assistant using Svelte and integrating it with various LLM models like Llama and DeepSeek.",
        category: 'projects',
        keywords: ['project', 'work', 'developing', 'current'],
        variations: [
            'current projects',
            'what am i developing',
            'my projects'
        ]
    }
];

function calculateStringSimilarity(str1: string, str2: string): number {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    
    // Exact match
    if (str1 === str2) return 1;
    
    // One string contains the other
    if (str1.includes(str2) || str2.includes(str1)) return 0.8;
    
    // Calculate word overlap - optimize by using Set for faster lookups
    const words1 = new Set(str1.split(/\s+/));
    const words2 = str2.split(/\s+/);
    const commonWords = words2.filter(word => words1.has(word));
    
    return commonWords.length / Math.max(words1.size, words2.length);
}

function findMatchingKeywords(query: string, keywords: string[]): number {
    if (keywords.length === 0) return 0;
    
    query = query.toLowerCase();
    const queryWords = new Set(query.split(/\s+/));
    
    // Use a more efficient approach with Set
    let matches = 0;
    for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();
        for (const word of queryWords) {
            if (word.includes(keywordLower) || keywordLower.includes(word)) {
                matches++;
                break; // Once we find a match for this keyword, move to next
            }
        }
    }
    
    return matches;
}

// Cache for recent queries to avoid recalculation
const queryCache = new Map<string, DataEntry[]>();
const CACHE_SIZE = 20;

export function findRelevantEntries(query: string): DataEntry[] {
    query = query.toLowerCase().trim();
    
    // Check cache first
    if (queryCache.has(query)) {
        return queryCache.get(query)!;
    }
    
    // Early return for empty queries
    if (!query) return [];
    
    // Score each entry based on multiple factors
    const scoredEntries = dataset.map(entry => {
        let score = 0;
        
        // Check exact matches with variations - exit early if found
        for (const variation of entry.variations) {
            const similarity = calculateStringSimilarity(query, variation);
            if (similarity > 0.7) {
                score += 3;
                break; // No need to check other variations
            }
        }
        
        // Check keyword matches
        const keywordMatches = findMatchingKeywords(query, entry.keywords);
        score += keywordMatches;
        
        // Check category match
        if (query.includes(entry.category.toLowerCase())) score += 1;
        
        // Check question similarity
        const questionSimilarity = calculateStringSimilarity(query, entry.question);
        score += questionSimilarity * 2;
        
        return { entry, score };
    });
    
    // Filter entries with a minimum score and sort by score
    const relevantEntries = scoredEntries
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ entry }) => entry);
    
    // Limit to top 3 most relevant entries to avoid information overload
    const result = relevantEntries.slice(0, 3);
    
    // Update cache
    queryCache.set(query, result);
    
    // Maintain cache size
    if (queryCache.size > CACHE_SIZE) {
        const firstKey = queryCache.keys().next().value;
        queryCache.delete(firstKey);
    }
        
    return result;
}

// Helper function to format the context based on matched entries
export function formatContext(entries: DataEntry[]): string {
    if (entries.length === 0) return '';
    
    let context = 'Here is some relevant information:\n\n';
    entries.forEach(entry => {
        context += `Q: ${entry.question}\nA: ${entry.answer}\n\n`;
    });
    return context;
} 