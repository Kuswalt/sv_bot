export function filterResponseAgainstDataset(response: string, entries: DataEntry[]): string {
    // If there are no entries to validate against, return as is with a disclaimer
    if (entries.length === 0) {
        return response + "\n\n(Note: I don't have specific information about this in my knowledge base.)";
    }
    
    // Extract key facts from the dataset entries
    const facts = extractFacts(entries);
    
    // Check if the response contains unsupported claims
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Filter out sentences that make unsupported claims
    const validSentences = sentences.filter(sentence => {
        // Skip short or typical introductory phrases
        if (sentence.trim().length < 15 || 
            isIntroductoryPhrase(sentence)) {
            return true;
        }
        
        // Verify sentence against facts
        return isSupportedByFacts(sentence, facts);
    });
    
    // If we've filtered out too much, just return the dataset info directly
    if (validSentences.length < sentences.length / 2) {
        return entries.map(e => e.answer).join(" ");
    }
    
    return validSentences.join(". ") + ".";
}

function extractFacts(entries: DataEntry[]): string[] {
    const facts: string[] = [];
    entries.forEach(entry => {
        // Split answers into individual fact statements
        const entryFacts = entry.answer.split(/[.!?]+/)
            .filter(s => s.trim().length > 0)
            .map(s => s.trim());
        facts.push(...entryFacts);
    });
    return facts;
}

function isIntroductoryPhrase(sentence: string): boolean {
    const lowerSentence = sentence.toLowerCase().trim();
    return (
        lowerSentence.startsWith("chris") || 
        lowerSentence.startsWith("he") ||
        lowerSentence.includes("based on") ||
        lowerSentence.includes("according to")
    );
}

function isSupportedByFacts(sentence: string, facts: string[]): boolean {
    // Simple heuristic: check if the sentence contains keywords from facts
    for (const fact of facts) {
        const keyTerms = extractKeyTerms(fact);
        const matchCount = keyTerms.filter(term => 
            sentence.toLowerCase().includes(term.toLowerCase())
        ).length;
        
        // If the sentence contains most of the key terms from a fact, consider it supported
        if (keyTerms.length > 0 && matchCount / keyTerms.length > 0.5) {
            return true;
        }
    }
    
    return false;
}

function extractKeyTerms(fact: string): string[] {
    // Extract nouns and key phrases from the fact
    const words = fact.toLowerCase().split(/\s+/);
    // Filter out common stopwords
    return words.filter(word => 
        word.length > 3 && 
        !["this", "that", "with", "from", "about", "their", "there"].includes(word)
    );
} 