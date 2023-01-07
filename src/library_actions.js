//
// library_actions.js
// Drafts: AI
// By Kyle Hughes
//

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action Convenience
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {Draft} draft
 * @param {string} templateTag
 * @returns {number | undefined}
 */
function getTemplateTagAsNumberIfItExists(draft, templateTag) {
    const value = draft.getTemplateTag(templateTag);

    if(value == '') {
        return undefined;
    } else {
        return Number(value);
    }
}

/**
 * @param {Draft} draft
 * @param {string} templateTag
 * @returns {string | undefined}
 */
function getTemplateTagIfItExists(draft, templateTag) {
    const value = draft.getTemplateTag(templateTag);

    if(value == '') {
        return undefined;
    } else {
        return value;
    }
}