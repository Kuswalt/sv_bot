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
        id: '1',
        question: "What's my name?",
        answer: "Chris Jen Ian Dava Roa, 20 years old, born on Sept. 20 2004 and lives in Olongapo City. He's a programmer who created this personal assistant.",
        category: 'personal', 
        keywords: ['name', 'my', 'who', 'am', 'i', 'master', 'creator', 'chris', 'called', 'birth', 'age', 
                  'years old', 'born', 'birthday', 'live', 'location', 'city', 'where', 'reside', 'programmer', 'developer'],
        variations: [
            'who am i',
            'what do you call me',
            'my name',
            'who is your master',
            'tell me about chris',
            'who created you',
            'how old is chris',
            'where does chris live',
            'what does chris do',
            'when was chris born'
        ]
    },
    {
        id: '2',
        question: 'What are my hobbies?',
        answer: 'Chris enjoys gaming, reading manga, building gunplas, and watching anime.',
        category: 'personal',
        keywords: ['hobbies', 'interests', 'free time', 'leisure', 'enjoy', 'like', 'fun', 'pastime', 
                  'activity', 'activities', 'gaming', 'games', 'play', 'manga', 'reading', 'read', 
                  'gunpla', 'gundam', 'model', 'build', 'anime', 'watch', 'watching', 'entertainment'],
        variations: [
            'what do i do for fun',
            'my leisure activities',
            'my interests',
            'what i enjoy doing',
            'how does chris spend free time',
            'what does chris like to do',
            'does chris like gaming',
            'does chris watch anime',
            'does chris read manga',
            'does chris build gunpla',
            'what games does chris play',
            'what anime does chris watch'
        ]
    },
    {
        id: '3',
        question: 'What is my favorite food?',
        answer: 'His favorite food is fried rice. Chris particularly enjoys trying different toppings on it.',
        category: 'personal',
        keywords: ['favorite', 'food', 'fried rice', 'cuisine', 'meal', 'dish', 'eat', 'like', 'enjoy', 
                  'prefer', 'taste', 'delicious', 'dinner', 'lunch', 'breakfast', 'rice', 'toppings'],
        variations: [
            'what do i like to eat',
            'my favorite dish',
            'preferred meal',
            'what food does chris enjoy',
            'does chris like fried rice',
            'what does chris eat',
            'chris favorite food',
            'what kind of food does chris prefer',
            'best food for chris'
        ]
    },
    {
        id: '4',
        question: 'What is my favorite movie?',
        answer: 'Chris\'s favorite movie is "Star Wars" by George Lucas. He appreciates its plot and visual effects.',
        category: 'personal',
        keywords: ['favorite', 'movie', 'film', 'star wars', 'cinema', 'watch', 'george lucas', 'plot', 
                  'visual effects', 'entertainment', 'sci-fi', 'science fiction', 'like', 'enjoy'],
        variations: [
            'what movie do i like',
            'my top film',
            'preferred movie',
            'what film does chris enjoy',
            'does chris like star wars',
            'favorite cinema',
            'what does chris watch',
            'best movie for chris',
            'what kind of movies does chris like'
        ]
    },
    {
        id: '5',
        question: 'What is my favorite manga?',
        answer: 'His favorite manga is "Dr. Stone" by Boichi. Chris finds its world-building and Science Crafting fascinating.',
        category: 'personal',
        keywords: ['favorite', 'manga', 'reading', 'dr. stone', 'boichi', 'comic', 'japanese', 'book', 
                  'world-building', 'science', 'crafting', 'story', 'read', 'enjoy', 'like'],
        variations: [
            'what manga or book do i like',
            'my top read',
            'preferred manga',
            'what does chris read',
            'does chris like dr stone',
            'favorite comic',
            'japanese comics chris enjoys',
            'what manga series does chris follow',
            'does chris enjoy reading'
        ]
    },
    {
        id: '6',
        question: 'What is my favorite music genre?',
        answer: 'Chris\'s favorite music genre is instrumental. He enjoys listening to it while working or relaxing.',
        category: 'personal',
        keywords: ['favorite', 'music', 'genre', 'instrumental', 'song', 'listen', 'audio', 'sound', 
                  'working', 'relaxing', 'melody', 'tune', 'playlist', 'background', 'listening'],
        variations: [
            'what music do i like',
            'my preferred genre',
            'type of music i enjoy',
            'what does chris listen to',
            'music taste',
            'chris favorite songs',
            'what genre does chris prefer',
            'does chris like instrumental music',
            'music for working',
            'music for relaxation'
        ]
    },
    {
        id: '7',
        question: 'What is my favorite travel destination?',
        answer: 'His favorite travel destination is Japan. Chris loves its culture, food, and scenic beauty.',
        category: 'personal',
        keywords: ['favorite', 'travel', 'destination', 'japan', 'vacation', 'trip', 'visit', 'place', 
                  'country', 'culture', 'food', 'scenic', 'beauty', 'tourism', 'tourist', 'japanese'],
        variations: [
            'where do i like to travel',
            'my preferred vacation spot',
            'favorite place to visit',
            'dream destination',
            'where would chris like to go',
            'does chris want to visit japan',
            'what country does chris like',
            'travel preferences',
            'where has chris traveled'
        ]
    },
    {
        id: '8',
        question: 'What are my long-term goals?',
        answer: 'Chris\'s long-term goals include achieving a healthy work-life balance, traveling more, and learning new skills outside of programming.',
        category: 'personal',
        keywords: ['long-term', 'goals', 'goal', 'aspirations', 'future', 'plans', 'ambition', 'dream', 'target', 
                  'aim', 'objective', 'work-life', 'balance', 'travel', 'learning', 'skills', 'career'],
        variations: [
            'what do i want to achieve',
            'my future plans',
            'my aspirations',
            'what is chris working towards',
            'career goals',
            'life ambitions',
            'what does chris want in life',
            'future aspirations',
            'personal development goals',
            'dream',
            'life goals'
        ]
    },
    {
        id: '9',
        question: 'What course am I taking at the moment?',
        answer: 'Chris is currently taking Bachelor in Science of Computer Science at Gordon College.',
        category: 'education',
        keywords: ['course', 'taking', 'current', 'education', 'learning', 'study', 'studying', 'college', 
                  'university', 'degree', 'bachelor', 'computer science', 'cs', 'gordon', 'school', 'major', 
                  'program', 'academic', 'student'],
        variations: [
            'what am i studying',
            'my current class',
            'what course am i enrolled in',
            'what is chris studying',
            'where does chris go to school',
            'college major',
            'university degree',
            'educational background',
            'what degree is chris pursuing',
            'chris school information'
        ]
    },
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
    
    // Special case for identity questions
    if ((query.includes('who') || query.includes('tell me about')) && 
        (query.includes('chris') || query.includes('he') || query.includes('him'))) {
        // Get the basic identity entry
        const identityEntry = dataset.find(entry => entry.id === '1');
        if (identityEntry) {
            // Optionally add more personal info entries
            const personalEntries = dataset.filter(entry => 
                entry.category === 'personal' && entry.id !== '1'
            ).slice(0, 2); // Get up to 2 additional personal entries
            
            return [identityEntry, ...personalEntries];
        }
    }
    
    // Check cache first
    if (queryCache.has(query)) {
        return queryCache.get(query)!;
    }
    
    // Early return for empty queries
    if (!query) return [];
    
    // First check for direct questions matching dataset questions
    for (const entry of dataset) {
        const questionLower = entry.question.toLowerCase();
        // If query is substantially similar to the question
        if (calculateStringSimilarity(query, questionLower) > 0.7) {
            return [entry];
        }
        
        // Check for variations
        for (const variation of entry.variations) {
            if (calculateStringSimilarity(query, variation.toLowerCase()) > 0.7) {
                return [entry];
            }
        }
    }
    
    // Score each entry based on multiple factors
    const scoredEntries = dataset.map(entry => {
        let score = 0;
        
        // Check keyword matches - higher weight
        const keywordMatches = findMatchingKeywords(query, entry.keywords);
        score += keywordMatches * 1.5;
        
        // Check category match
        if (query.includes(entry.category.toLowerCase())) score += 1.5;
        
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
    
    let context = 'Facts about Chris:\n\n';
    entries.forEach(entry => {
        context += `• ${entry.answer}\n`;
    });
    context += '\nUse this information to help users learn about Chris. You can present this information in different ways and use your own words, but only share facts mentioned above.';
    
    return context;
}

/**
 * Find an exact match for a query in the dataset
 * @param query The user's query
 * @returns The matching dataset entry or null if no exact match
 */
export function findExactMatch(query: string): DataEntry | null {
    // Normalize the query (lowercase, trim, remove punctuation)
    const normalizedQuery = query.toLowerCase().trim().replace(/[.,?!;:]/g, '');
    
    // Check for exact matches with questions
    const exactQuestionMatch = dataset.find(entry => 
        entry.question.toLowerCase().trim().replace(/[.,?!;:]/g, '') === normalizedQuery
    );
    
    if (exactQuestionMatch) return exactQuestionMatch;
    
    // Check for exact matches with variations
    const variationMatch = dataset.find(entry => 
        entry.variations.some(variation => 
            variation.toLowerCase().trim().replace(/[.,?!;:]/g, '') === normalizedQuery
        )
    );
    
    if (variationMatch) return variationMatch;
    
    // Check for keyword matches (all keywords must be present)
    const keywordMatches = dataset.filter(entry => 
        entry.keywords.every(keyword => 
            normalizedQuery.includes(keyword.toLowerCase())
        )
    );
    
    // If there's only one keyword match, consider it an exact match
    if (keywordMatches.length === 1) return keywordMatches[0];
    
    // No exact match found
    return null;
}

/**
 * Calculate confidence level for a query based on matching dataset entries
 * @param query The user's query
 * @param matchedEntries The relevant entries found for the query
 * @returns A number between 0 and 1 representing confidence
 */
export function calculateConfidence(query: string, matchedEntries: DataEntry[]): number {
    // Special case for direct "who is Chris" type questions
    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery.includes('who') && 
        (normalizedQuery.includes('chris') || normalizedQuery.includes('he') || normalizedQuery.includes('him'))) {
        // Find the basic identity entry
        const identityEntry = dataset.find(entry => entry.id === '1');
        if (identityEntry) {
            return 1.0; // Maximum confidence for identity questions
        }
    }
    
    // If no entries match, confidence is 0
    if (matchedEntries.length === 0) return 0;
    
    // For exact matches, confidence is 1
    const exactMatch = findExactMatch(query);
    if (exactMatch) return 1;
    
    // Rest of the function remains the same...
} 