/**
    * Counts the length of words before and after translation, compares it to the minimum percentage.
    * Configurable.
    * @param {Number} The minimum percentage for which translation is not considered too short. It is calculates as follows:
    * (the length of the translation words) / (the length of words to translate)
    * @returns {Object} Returns a message when translation is too short.
    * @example (Minimum percentage is 25%)
    * 
    * The length of words to translate: 100
    * The length of the translation words: 24
    * // => Translation too short. Current percent "24%", when minimal is "25%".
    */
// Config section.

var minimalPercent = 0.25 // Where 0.25 = 25%

// Code section

var result = {
  success: false
}

if (crowdin.contentType === 'application/vnd.crowdin.text+plural') {
  var obj = JSON.parse(crowdin.source)
  source = obj[crowdin.context.pluralForm]
} else {
  source = crowdin.source
}

var translation = crowdin.translation,
    wordsPattern = /[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]+/g,
    lengthOfSourceWords = 0,
    lengthOfTranslationWords = 0
massOfWordsSource = source.match(wordsPattern)
massOfWordsTranslation = translation.match(wordsPattern)

if (Array.isArray(massOfWordsSource) && massOfWordsSource.length) {
  for (var i = 0; i < massOfWordsSource.length; i++) {
    lengthOfSourceWords += massOfWordsSource[i].length
  }
} else {
  result.success = true
  return result
}

if (Array.isArray(massOfWordsTranslation) && massOfWordsTranslation.length) {
  for (var i = 0; i < massOfWordsTranslation.length; i++) {
    lengthOfTranslationWords += massOfWordsTranslation[i].length
  }
} else {
  result.message = 'Words in translation not found.'
  result.fixes = []
  return result
}
if ((lengthOfTranslationWords / lengthOfSourceWords) < minimalPercent) {
  result.message = 'Translation too short. Current percent "' + (lengthOfTranslationWords / lengthOfSourceWords.toFixed(2)) * 100 + '%", when minimal is "' + minimalPercent * 100 + '%".'
  result.fixes = []
  return result
} else {
  result.success = true
  return result
}
