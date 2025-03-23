import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findRelevantEntries, formatContext, findExactMatch, calculateConfidence, dataset } from '$lib/data/dataset';

export const POST: RequestHandler = async ({ request }) => {
    const { 
        message, 
        context, 
        model, 
        conversationHistory, 
        isFollowUp,
        isTopicChange,
        previousTopic,
        currentTopic,
        isNewSession
    } = await request.json();
    
    // Check if the message exactly matches any entry in the dataset
    const exactMatch = findExactMatch(message);
    
    if (exactMatch) {
        // If there's an exact match, return the answer directly
        return new Response(exactMatch.answer, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
    
    // If no exact match, proceed with the normal flow
    // Find relevant context from dataset
    const relevantEntries = findRelevantEntries(message);
    
    // Calculate confidence level for this query
    const confidence = calculateConfidence(message, relevantEntries);
    
    // Enhanced query understanding
    const normalizedMessage = message.toLowerCase().trim();
    const isIdentityQuestion = (normalizedMessage.includes('who') && 
                               (normalizedMessage.includes('chris') || 
                                normalizedMessage.includes('he') || 
                                normalizedMessage.includes('him'))) ||
                               (normalizedMessage.includes('tell me about') && 
                               (normalizedMessage.includes('chris') || 
                                normalizedMessage.includes('yourself')));
    const isPreferenceQuestion = normalizedMessage.includes('like') || 
                                normalizedMessage.includes('enjoy') || 
                                normalizedMessage.includes('prefer');
    const isIntroductionRequest = normalizedMessage.includes('introduce') && 
        (normalizedMessage.includes('chris') || 
         normalizedMessage.includes('master') || 
         normalizedMessage.includes('creator'));
    const isDirect = relevantEntries.length > 0 && 
        (normalizedMessage.includes('what') || 
         normalizedMessage.includes('tell') || 
         normalizedMessage.includes('what are') || 
         normalizedMessage.includes('his'));

    // Prepare system prompt based on query type, conversation history, and topic changes
    let systemPrompt = '';
    
    // Format conversation history for context, but only if it's not a new session
    let historyContext = '';
    if (!isNewSession && conversationHistory && conversationHistory.length > 0) {
        historyContext = 'Recent conversation history:\n\n';
        conversationHistory.forEach(msg => {
            historyContext += `${msg.role === 'user' ? 'User' : 'Stelle'}: ${msg.content}\n`;
        });
        historyContext += '\n';
    }

    if (isNewSession) {
        // For a new session, treat every question as a fresh start
        // Do not reference any previous conversation
        if (isIdentityQuestion) {
            // Special handling for identity questions
            const identityEntry = dataset.find(entry => entry.id === '1');
            const hobbyEntry = dataset.find(entry => entry.id === '2');
            const entries = [identityEntry, hobbyEntry].filter(Boolean) as DataEntry[];
            
            systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

Here is core information about Chris's identity:
${formatContext(entries)}

The user is asking who Chris is. Provide a friendly, comprehensive introduction to Chris based strictly on the information above. Be enthusiastic about sharing this information as if you're excited to tell them about Chris. Don't add any details that aren't mentioned above.`;
        } else if (isIntroductionRequest) {
            // For introduction requests, use personal information from the dataset
            const personalInfo = dataset.filter(entry => entry.category === 'personal');
            systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

Here's information about Chris that you can use:
${formatContext(personalInfo)}

Create a friendly introduction to Chris based on this information. Be conversational and enthusiastic about sharing facts about Chris. Always make it clear that your purpose is to share information about Chris, not to assist with other tasks.`;
        } else if (relevantEntries.length > 0) {
            // For any other question in a new session
            const formattedContext = formatContext(relevantEntries);
            systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

Here is information about Chris that you can use to answer:
${formattedContext}

Respond in a friendly, enthusiastic way as if you're excited to share information about Chris. Make it clear that your purpose is to help others learn about Chris. Present information in your own words, but ensure all facts come only from the information provided above.

Do not reference any previous conversation, as this is a new discussion.`;
        } else {
            // Low confidence in a new session
            systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

Confidence: ${Math.round(confidence * 100)}% - I don't have specific information about this aspect of Chris in my knowledge base.

Explain in a friendly way that while you're happy to share information about Chris, you don't have this particular detail about him yet. Offer to answer other questions about Chris instead, such as his hobbies, education, or personal details that you do know about.

DO NOT make up information about Chris that is not in your knowledge base.
DO NOT reference any previous conversation, as this is a new discussion.`;
        }
    } else if (isTopicChange) {
        // For topic changes, acknowledge the shift and focus on the new topic
        const formattedContext = formatContext(relevantEntries);
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
The user has changed the topic from "${previousTopic}" to "${currentTopic}".

Here is information about Chris that you can use to answer about the new topic:
${formattedContext}

Acknowledge the topic change briefly and then focus entirely on providing information about the new topic. Do NOT try to relate or connect the new topic to the previous topic - they are separate subjects. Only use facts from the information provided above about the new topic.`;
    } else if (isFollowUp && conversationHistory && conversationHistory.length > 0) {
        // For follow-up questions, include conversation history
        const formattedContext = formatContext(relevantEntries);
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
The user's current message appears to be a follow-up question to the previous conversation about "${currentTopic}".

Here is information about Chris that you can use to answer:
${formattedContext}

Respond as if you understand what the user is referring to from the previous messages. Connect your answer to the previous topic of conversation. Only use facts from the information provided above, but make the connection between the follow-up question and the previous topic clear.`;
    } else if (isIdentityQuestion) {
        // Special handling for identity questions
        const identityEntry = dataset.find(entry => entry.id === '1');
        const hobbyEntry = dataset.find(entry => entry.id === '2');
        const entries = [identityEntry, hobbyEntry].filter(Boolean) as DataEntry[];
        
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
Here is core information about Chris's identity:
${formatContext(entries)}

The user is asking who Chris is. Provide a friendly, comprehensive introduction to Chris based strictly on the information above. Be enthusiastic about sharing this information as if you're excited to tell them about Chris. Don't add any details that aren't mentioned above.`;
    } else if (isIntroductionRequest) {
        // For introduction requests, use personal information from the dataset
        const personalInfo = dataset.filter(entry => entry.category === 'personal');
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
Here's information about Chris that you can use:
${formatContext(personalInfo)}

Create a friendly introduction to Chris based on this information. Be conversational and enthusiastic about sharing facts about Chris. Always make it clear that your purpose is to share information about Chris, not to assist with other tasks.`;
    } else if (isPreferenceQuestion && relevantForPreference.length > 0) {
        // Enhanced handling for preference questions
        const formattedContext = formatContext(relevantForPreference);
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
Here is information about Chris that you can use to answer:
${formattedContext}

Respond in a natural, conversational way that focuses on sharing what you know about Chris. Be enthusiastic about the topic and make it clear that your purpose is to help others learn about Chris. Only share facts that are based on the information provided above.`;
    } else if (isDirect && relevantEntries.length > 0) {
        // For direct questions that match entries
        const formattedContext = formatContext(relevantEntries);
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
Here is information about Chris that you can use to answer:
${formattedContext}

Respond in a friendly, enthusiastic way as if you're excited to share information about Chris. Make it clear that your purpose is to help others learn about Chris. Present information in your own words, but ensure all facts come only from the information provided above.`;
    } else if (confidence >= 0.4) {
        // Sufficient confidence
        const formattedContext = formatContext(relevantEntries);
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
Here is information about Chris that you can use to answer:
${formattedContext}

Respond as someone who is enthusiastic about sharing information about Chris. Be conversational but focus on providing accurate information about Chris rather than helping with other tasks. All facts must come only from the information provided above.

Confidence: ${Math.round(confidence * 100)}% - I have relevant information about this aspect of Chris.`;
    } else {
        // Low confidence
        systemPrompt = `You are Stelle, a dedicated chatbot created to share information about Chris Jen Ian Dava Roa. Your sole purpose is to help people learn about Chris.

${historyContext}
Confidence: ${Math.round(confidence * 100)}% - I don't have specific information about this aspect of Chris in my knowledge base.

Explain in a friendly way that while you're happy to share information about Chris, you don't have this particular detail about him yet. Offer to answer other questions about Chris instead, such as his hobbies, education, or personal details that you do know about.

DO NOT make up information about Chris that is not in your knowledge base.`;
    }

    // Prepare the request to Ollama API
    const ollamaRequest = {
        model: model || 'llama3.1:latest',
        prompt: message,
        system: systemPrompt,
        stream: true,
        options: {
            temperature: 0.7,
            top_p: 0.9
        }
    };

    // Create a readable stream to send the response
    const stream = new ReadableStream({
        async start(controller) {
            try {
                // Connect to Ollama API
                const response = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ollamaRequest)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ollama API error: ${response.status} ${errorText}`);
                }

                const reader = response.body?.getReader();
                if (!reader) throw new Error('No reader available from Ollama API');

                let accumulatedResponse = '';
                let lastSentLength = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = new TextDecoder().decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim());

                    for (const line of lines) {
                        try {
                            const data = JSON.parse(line);
                            if (data.response) {
                                // Add to accumulated response
                                accumulatedResponse += data.response;
                                
                                // Clean the entire accumulated response
                                let cleanedResponse = accumulatedResponse.replace(/<think>[\s\S]*?<\/think>/g, '');
                                
                                // Also handle cases where the closing tag hasn't arrived yet
                                cleanedResponse = cleanedResponse.replace(/<think>[\s\S]*$/, '');
                                
                                // Trim any leading/trailing whitespace that might be left after removal
                                cleanedResponse = cleanedResponse.trim();
                                
                                // Only send the new part that hasn't been sent yet
                                if (cleanedResponse.length > lastSentLength) {
                                    const newContent = cleanedResponse.substring(lastSentLength);
                                    controller.enqueue(new TextEncoder().encode(newContent));
                                    lastSentLength = cleanedResponse.length;
                                }
                            }
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
                    }
                }
                
                controller.close();
            } catch (error) {
                console.error('Error in stream:', error);
                controller.error(error);
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};
