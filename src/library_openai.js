//
// library_openai.js
// Drafts: AI
// By Kyle Hughes
//

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OpenAI API
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class OpenAI {
    constructor() {
        this.apiBaseURL = 'https://api.openai.com/v1';
        this.http = HTTP.create();
        this.maximumTokensInModel = 4096;

        // @ts-ignore
        this.credential = Credential.create('OpenAI API', 'Credentials for OpenAI API');
        this.credential.addPasswordField('apiKey', 'OpenAI API Key');
    }

    /**
     * The `text-davinci-003` model has a maximum context size of 4,096 tokens. This means the prompt + the output 
     * cannot be more than 4,096 tokens. OpenAI lets us constrain the output to a maximum size which will implicitly
     * set the maximum size for our prompt. We will only send the last 4,096-`maximumTokensInCompletion` tokens in the
     * prompt to be completed.
     * 
     * See: https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
     * 
     * If necessary we could devise a more clever chunking mechanism for passing the whole contents through.
     * 
     * See: https://stackoverflow.com/questions/70060847/how-to-work-with-openai-maximum-context-length-is-2049-tokens
     * 
     * @param {string} prompt
     * @param {Object} parameters
     * @param {number} parameters.maximumTokensInCompletion
     * @param {number} parameters.temperature
     * @param {number} parameters.truncatedUsingCharactersPerToken
     * @returns {string}
     */
    getCompletion(
        prompt, 
        {
            maximumTokensInCompletion,
            temperature,
            truncatedUsingCharactersPerToken,
        }
    ) {
        this.credential.authorize();

        if(truncatedUsingCharactersPerToken) {
            console.log(`Original prompt has ${prompt.length} characters`);

            const maximumTokensInPrompt = this.maximumTokensInModel - maximumTokensInCompletion;
            const maximumCharactersInPrompt = maximumTokensInPrompt * truncatedUsingCharactersPerToken;

            var prompt = prompt;

            if(maximumCharactersInPrompt < prompt.length) {
                prompt = prompt.slice(-maximumCharactersInPrompt);

                console.log(`Prompt was truncated to last ${prompt.length} characters`);
            } else {
                console.log(`Prompt was not truncated`);
            }
        }

        const httpMethod = 'POST';
        const apiURL = `${this.apiBaseURL}/completions`;
        const apiKey = this.credential.getValue('apiKey');
        const apiIdentifier = `${httpMethod} ${apiURL}`;

        console.log(apiIdentifier);

        const response = this.http.request(
            {
                method: httpMethod,
                url: apiURL,
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    prompt,
                    // @ts-ignore
                    temperature,
                    model: 'text-davinci-003',
                    // @ts-ignore
                    max_tokens: maximumTokensInCompletion,
                }
            }
        );

        console.log(`⮑ HTTP ${response.statusCode}`);

        if(response.success) {
            return response.responseData.choices[0].text;
        } else if(response.responseData.message) {
            throw new Error(`Error: ${response.responseData.message}`);
        } else if(response.responseData.error.message) {
            throw new Error(`Error: ${response.responseData.error.message}`);
        } else {
            throw new Error("Error : Unknown");
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {Editor} editor
 * @param {Object} parameters
 * @param {number} parameters.maximumTokensInCompletion
 * @param {string} parameters.promptPrefix
 * @param {number} parameters.temperature
 * @param {Object} parameters.truncatedUsingCharactersPerToken
 */
function completeEditor(
    editor,
    {
        maximumTokensInCompletion = 2048,
        promptPrefix = '',
        temperature = 0.7,
        truncatedUsingCharactersPerToken = 3.5,
    } = {
        maximumTokensInCompletion: undefined,
        promptPrefix: undefined,
        temperature: undefined,
        truncatedUsingCharactersPerToken: undefined,
    }
) {
    const originalContent = editor.getText().trim();
    const prompt = promptPrefix + originalContent;

    try {
        const completion = new OpenAI().getCompletion(
            prompt,
            {
                maximumTokensInCompletion,
                temperature,
                truncatedUsingCharactersPerToken,
            }
        );

        editor.save();
        editor.setText(originalContent + completion)
    } catch(error) {
        context.fail(error.message);
    }
}

/**
 * @param {Editor} editor
 * @param {Object} parameters
 * @param {number} parameters.maximumTokensInCompletion
 * @param {string} parameters.promptPrefix
 * @param {number} parameters.temperature
 * @param {Object} parameters.truncatedUsingCharactersPerToken
 */
function replaceSelectionWithCompletion(
    editor,
    {
        maximumTokensInCompletion = 2048,
        promptPrefix = '',
        temperature = 0.7,
        truncatedUsingCharactersPerToken = 3.5,
    } = {
        maximumTokensInCompletion: undefined,
        promptPrefix: undefined,
        temperature: undefined,
        truncatedUsingCharactersPerToken: undefined,
    }
) {
    const originalContent = editor.getSelectedText().trim();
    const prompt = promptPrefix + originalContent;

    try {
        const completion = new OpenAI().getCompletion(
            prompt,
            {
                maximumTokensInCompletion,
                temperature,
                truncatedUsingCharactersPerToken,
            }
        ).trim();

        editor.save();
        editor.setSelectedText(completion);
    } catch(error) {
        context.fail(error.message);
    }
}