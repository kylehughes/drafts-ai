//
// action_replace-selection.js
// Drafts: AI
// By Kyle Hughes
//
// Requirements:
// - library_actions.js
// - library_openai.js
//
// Template Tags:
// - max_tokens_in_completion
// - prompt_prefix
// - temperature
// - truncation_characters_per_token
//

replaceSelectionWithCompletion(
    editor,
    {
        maximumTokensInCompletion: getTemplateTagAsNumberIfItExists(draft, 'max_tokens_in_completion'),
        promptPrefix: getTemplateTagIfItExists(draft, 'prompt_prefix'),
        temperature: getTemplateTagAsNumberIfItExists(draft, 'temperature'),
        truncatedUsingCharactersPerToken: getTemplateTagIfItExists(draft, 'truncation_characters_per_token'),
    }
);