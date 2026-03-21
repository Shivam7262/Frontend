function cleanAssistantReply(rawText) {
  if (!rawText) return '';
  const withoutThinkBlocks = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/gi, '')
    .trim();
  return withoutThinkBlocks;
}

const testText = '<think>\nOkay, the user said "Hello." I need to respond appropriately.\n</think>\n\nHello! How can I assist you today? Whether you have questions about Indian languages, cultural insights, or need help with anything else, feel free to ask.';
const result = cleanAssistantReply(testText);
console.log('=== BEFORE ===');
console.log(testText.substring(0, 100) + '...');
console.log('\n=== AFTER ===');
console.log(result);
console.log('\n=== STATS ===');
console.log('Length before:', testText.length);
console.log('Length after:', result.length);
console.log('Is empty:', result === '');
console.log('Contains think:', result.includes('<think>'));
