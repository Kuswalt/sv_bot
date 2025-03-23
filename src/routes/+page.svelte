<script lang="ts">
    import { onMount } from 'svelte';
    import ChatMessage from '$lib/components/ChatMessage.svelte';
    import type { StreamingMessage } from '$lib/types';
    import { findRelevantEntries, formatContext } from '$lib/data/dataset';

    let messages: StreamingMessage[] = [];
    let userInput = '';
    let isLoading = false;
    let selectedModel = 'llama3.1:latest';
    
    // Initialize empty conversation context
    let conversationContext = {
        lastTopic: '',
        currentTopic: '',
        lastEntryId: '',
        relevantEntries: [] as any[],
        isNewSession: true // Flag to indicate a fresh session
    };
    
    const models = [
        { id: 'llama3.1:latest', name: 'Llama 3.1' }
    ];

    function addMessage(role: 'user' | 'assistant', content: string, isStreaming = false) {
        messages = [...messages, { role, content, isStreaming }];
        
        // After the first message exchange, it's no longer a new session
        if (messages.length > 2) { // Welcome message + user message + response
            conversationContext.isNewSession = false;
        }
    }

    async function handleSubmit() {
        if (!userInput.trim()) return;
        
        const userMessage = userInput.trim();
        addMessage('user', userMessage);
        userInput = '';
        isLoading = true;

        // Find relevant context from dataset for the current message
        const relevantEntries = findRelevantEntries(userMessage);
        
        // Only consider follow-ups if not a new session
        const isNewSession = conversationContext.isNewSession;
        
        // Determine if this is a topic change or a follow-up
        // If it's a new session, it's neither a follow-up nor a topic change
        const topicInfo = isNewSession ? 
            { isFollowUp: false, isTopicChange: false, currentTopic: '' } : 
            detectTopicChange(userMessage, relevantEntries);
        
        // Get the entries to use for this response
        let entriesToUse = relevantEntries;
        
        // If this is a follow-up with no good matches, use previous context
        // But only if it's not a new session
        if (!isNewSession && topicInfo.isFollowUp && relevantEntries.length === 0 && conversationContext.relevantEntries.length > 0) {
            entriesToUse = conversationContext.relevantEntries;
        }
        
        const context = formatContext(entriesToUse);
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage, 
                    context,
                    model: selectedModel,
                    conversationHistory: isNewSession ? [] : getConversationHistory(),
                    isFollowUp: topicInfo.isFollowUp,
                    isTopicChange: topicInfo.isTopicChange,
                    previousTopic: conversationContext.lastTopic,
                    currentTopic: topicInfo.currentTopic,
                    isNewSession
                })
            });

            if (!response.ok) throw new Error('Failed to get response');
            
            // Add empty assistant message that will be streamed into
            addMessage('assistant', '', true);
            
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');
            
            let accumulatedResponse = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = new TextDecoder().decode(value);
                accumulatedResponse += chunk;
                
                // Update the last message with the accumulated response
                messages = messages.map((msg, i) => 
                    i === messages.length - 1 
                        ? { ...msg, content: accumulatedResponse } 
                        : msg
                );
            }
            
            // Mark streaming as complete
            messages = messages.map((msg, i) => 
                i === messages.length - 1 
                    ? { ...msg, isStreaming: false } 
                    : msg
            );
            
            // Update conversation context, but only if it's not a new session
            if (!isNewSession) {
                updateConversationContext(userMessage, entriesToUse, topicInfo);
            } else {
                // For a new session, just update the current topic
                if (topicInfo.currentTopic || (entriesToUse.length > 0 && entriesToUse[0].category)) {
                    conversationContext.currentTopic = topicInfo.currentTopic || entriesToUse[0].category;
                    conversationContext.relevantEntries = entriesToUse;
                    if (entriesToUse.length > 0 && entriesToUse[0].id) {
                        conversationContext.lastEntryId = entriesToUse[0].id;
                    }
                }
                // Now it's no longer a new session
                conversationContext.isNewSession = false;
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('assistant', 'Sorry, I encountered an error while processing your request.');
        } finally {
            isLoading = false;
        }
    }
    
    // Enhanced topic detection and change recognition
    function detectTopicChange(message: string, entries: any[]): { 
        isFollowUp: boolean, 
        isTopicChange: boolean, 
        currentTopic: string 
    } {
        const normalizedMsg = message.toLowerCase();
        let currentTopic = '';
        let isFollowUp = false;
        
        // Try to detect the current topic from the message and entries
        if (entries.length > 0) {
            // First try to detect from the entry categories and keywords
            for (const entry of entries) {
                // Check for specific topics
                if (entry.keywords.includes('movie') || normalizedMsg.includes('movie') || 
                    normalizedMsg.includes('film') || normalizedMsg.includes('star wars')) {
                    currentTopic = 'movie';
                    break;
                } else if (entry.keywords.includes('food') || normalizedMsg.includes('food') || 
                          normalizedMsg.includes('eat') || normalizedMsg.includes('fried rice')) {
                    currentTopic = 'food';
                    break;
                } else if (entry.keywords.includes('hobbies') || normalizedMsg.includes('hobby') || 
                          normalizedMsg.includes('interest') || normalizedMsg.includes('free time')) {
                    currentTopic = 'hobbies';
                    break;
                } else if (entry.keywords.includes('manga') || normalizedMsg.includes('manga') || 
                          normalizedMsg.includes('dr. stone') || normalizedMsg.includes('comic')) {
                    currentTopic = 'manga';
                    break;
                } else if (entry.keywords.includes('music') || normalizedMsg.includes('music') || 
                          normalizedMsg.includes('genre') || normalizedMsg.includes('listen')) {
                    currentTopic = 'music';
                    break;
                } else if (entry.keywords.includes('travel') || normalizedMsg.includes('travel') || 
                          normalizedMsg.includes('japan') || normalizedMsg.includes('destination')) {
                    currentTopic = 'travel';
                    break;
                } else if (entry.category) {
                    // If no specific topic detected, use the entry's category
                    currentTopic = entry.category;
                    break;
                }
            }
        }
        
        // If we couldn't detect a topic but have relevant entries, use the first entry's category
        if (!currentTopic && entries.length > 0 && entries[0].category) {
            currentTopic = entries[0].category;
        }
        
        // Detect if this is a follow-up question
        // Check for pronouns and other follow-up indicators
        const followUpIndicators = [
            'it', 'that', 'this', 'he', 'his', 'him', 'why', 'how',
            'when', 'where', 'what about', 'tell me more'
        ];
        
        // It's likely a follow-up if:
        // 1. It's a short message (≤ 5 words)
        const isShort = normalizedMsg.split(' ').length <= 5;
        
        // 2. It contains follow-up indicators
        const hasIndicators = followUpIndicators.some(indicator => 
            normalizedMsg.split(' ').includes(indicator)
        );
        
        // 3. It lacks a clear subject (doesn't mention "Chris" directly)
        const lacksSubject = !normalizedMsg.includes('chris');
        
        // Determine if it's a follow-up
        isFollowUp = isShort && (hasIndicators || lacksSubject);
        
        // If we detected a current topic, check if it's different from the last topic
        const isTopicChange = currentTopic && 
                              conversationContext.lastTopic && 
                              currentTopic !== conversationContext.lastTopic;
        
        // If it seems like a follow-up but there's a clear topic change, it's not a follow-up
        if (isFollowUp && isTopicChange) {
            isFollowUp = false;
        }
        
        return { isFollowUp, isTopicChange, currentTopic };
    }
    
    // Function to get recent conversation history
    function getConversationHistory(): {role: string, content: string}[] {
        // Get last 4 messages for context (or fewer if not enough)
        return messages.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }
    
    // Function to update conversation context based on the current exchange
    function updateConversationContext(
        userMessage: string, 
        entries: any[],
        topicInfo: { isFollowUp: boolean, isTopicChange: boolean, currentTopic: string }
    ): void {
        // Save the previous topic first
        conversationContext.lastTopic = conversationContext.currentTopic;
        
        // Update with the new topic if we detected one
        if (topicInfo.currentTopic) {
            conversationContext.currentTopic = topicInfo.currentTopic;
        }
        
        // Store the current entries for potential follow-ups
        if (entries.length > 0) {
            conversationContext.relevantEntries = entries;
            if (entries[0].id) {
                conversationContext.lastEntryId = entries[0].id;
            }
        }
    }

    onMount(() => {
        // Reset conversation context on page load/refresh
        conversationContext = {
            lastTopic: '',
            currentTopic: '',
            lastEntryId: '',
            relevantEntries: [],
            isNewSession: true
        };
        
        // Add a more friendly welcome message
        addMessage('assistant', "Hello! I'm Stelle, a chatbot dedicated to sharing information about Chris. Feel free to ask me anything about him - his hobbies, education, interests, or personal details! 😊");
    });
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-white shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Stelle - Chris's Info Bot</h1>
            <div class="flex items-center">
                <label for="model-select" class="mr-2 text-sm font-medium text-gray-700">Model:</label>
                <select 
                    id="model-select"
                    bind:value={selectedModel}
                    class="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {#each models as model}
                        <option value={model.id}>{model.name}</option>
                    {/each}
                </select>
            </div>
        </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow-lg border border-gray-200 h-[calc(100vh-12rem)] flex flex-col">
            <div class="flex-1 overflow-y-auto p-4">
                {#if messages.length === 0}
                    <div class="h-full flex items-center justify-center text-gray-500">
                        <p class="text-lg font-medium">Ask me anything about Chris!</p>
                    </div>
                {:else}
                    {#each messages as message}
                        <ChatMessage {message} />
                    {/each}
                {/if}
            </div>
            
            <div class="border-t border-gray-200 p-4">
                <form on:submit|preventDefault={handleSubmit} class="flex gap-2">
                    <input
                        type="text"
                        bind:value={userInput}
                        placeholder="Ask about Chris..."
                        disabled={isLoading}
                        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        class="bg-green-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Ask'}
                    </button>
                </form>
            </div>
        </div>
    </main>
</div>
