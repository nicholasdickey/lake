export default  function removeHashtags(input: string): string {
    // This regular expression matches hashtags.
    const hashtagRegex = /#\w+/g;
    return input.replace(hashtagRegex, '');
}
