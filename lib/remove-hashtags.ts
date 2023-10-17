export default  function removeHashtags(input: string): string {
    // This regular expression matches hashtags.
    //const hashtagRegex = /#\w+/g;
    const hashtagRegex = /#(\w+)\b/g;

    const ret=input.replace(hashtagRegex, '');
    console.log("removeHashtags:",input,ret);
    return input.replace(hashtagRegex, '');
}
