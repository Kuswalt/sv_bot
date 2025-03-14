<script lang="ts">
    import { onMount } from 'svelte';
    import ChatMessage from '$lib/components/ChatMessage.svelte';
    import type { StreamingMessage } from '$lib/types';
    import { findRelevantEntries, formatContext } from '$lib/data/dataset';

    let messages: StreamingMessage[] = [];
    let userInput = '';
    let isLoading = false;
    let selectedModel = 'llama3.1:latest';
    
    const models = [
        { id: 'llama3.1:latest', name: 'Llama 3.1' },
        { id: 'deepseek-r1:latest', name: 'DeepSeek R1' }
    ];

    function addMessage(role: 'user' | 'assistant', content: string, isStreaming = false) {
        messages = [...messages, { role, content, isStreaming }];
    }

    async function handleSubmit() {
        if (!userInput.trim()) return;
        
        const userMessage = userInput.trim();
        addMessage('user', userMessage);
        userInput = '';
        isLoading = true;

        // Find relevant context from dataset
        const relevantEntries = findRelevantEntries(userMessage);
        const context = formatContext(relevantEntries);
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage, 
                    context,
                    model: selectedModel
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
        } catch (error) {
            console.error('Error:', error);
            addMessage('assistant', 'Sorry, I encountered an error while processing your request.');
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        // Add a more friendly welcome message
        addMessage('assistant', "Hi Chris! It's great to see you. How can I help you today with your personal information? 😊");
    });
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-white shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Chris's Personal Assistant</h1>
            <div class="flex items-center">
                <label for="model-select" class="mr-2 text-sm font-medium text-gray-700">Model:</label>
                <select 
                    id="model-select"
                    bind:value={selectedModel}
                    class="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        <p class="text-lg font-medium">No messages yet. Ask me about your personal info!</p>
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
                        placeholder="Ask about your personal info..."
                        disabled={isLoading}
                        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        class="bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Ask'}
                    </button>
                </form>
            </div>
        </div>
    </main>
</div>
