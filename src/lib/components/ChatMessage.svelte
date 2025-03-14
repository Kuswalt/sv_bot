<script lang="ts">
    import type { StreamingMessage } from '$lib/types';
    export let message: StreamingMessage;
</script>

<div class="mb-4 last:mb-0 {message.role === 'assistant' ? 'pl-2' : 'pl-2'}">
    <div class="flex items-start gap-2">
        <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 {
            message.role === 'assistant' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
        }">
            {#if message.role === 'assistant'}
                🤖
            {:else}
                👤
            {/if}
        </div>
        <div class="flex-1 {
            message.role === 'assistant' 
                ? 'bg-white border border-purple-200' 
                : 'bg-blue-500 text-white'
        } rounded-lg px-4 py-2 shadow-sm">
            <p class="whitespace-pre-wrap break-words">
                {message.content}
                {#if message.isStreaming}
                    <span class="inline-block animate-pulse">▊</span>
                {/if}
            </p>
        </div>
    </div>
</div> 