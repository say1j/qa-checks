var config = {
  "¿": "?",
  "¡": "!"
}

var result = {
  success: false
}

if (crowdin.sourceLanguage !== "es") {
  result.success = true
  return result
}

if (crowdin.contentType === 'application/vnd.crowdin.text+plural') {
  var obj = JSON.parse(crowdin.source)
  if (obj[crowdin.context.pluralForm] != null) {
    source = obj[crowdin.context.pluralForm]
  } else {
    source = obj.other
  }
  } else {
  source = crowdin.source
}

var translation = crowdin.translation
var sourceRegex = new RegExp('[' + Object.getOwnPropertyNames(config).join('') + ']', 'g')
var translationRegex = new RegExp('[' + Object.getOwnPropertyNames(config).join('') + Object.values(config).join('') + ']', 'g')

var sourceMatch = source.match(sourceRegex)
var translationMatch = translation.match(translationRegex)

function JoinWithQuotes (array) {
  return array.length < 5 ? '"' + array.join('", "') + '"' : array.slice(0, 5).join('", "') + '" and others'
}

function UniqueCharacters (inputArray) {
  var outputArray = []
  var currentCharacter
  for (var i = 0; i < inputArray.length; i++) {
    currentCharacter = inputArray[i]
    if (!~outputArray.indexOf(currentCharacter)) {
    outputArray.push(currentCharacter)
    }
  }
  return outputArray
}

function IndicesCounter(inputCharracters) {
  var indices = []
  var outputArray = {}
  var currentIndex
  var uniqueInput = UniqueCharacters(inputCharracters)
  for (var i = 0; i < uniqueInput.length; i++) {
    var currentIndex = inputCharracters.indexOf(uniqueInput[i]);
    while(currentIndex !== -1) {
      indices.push(currentIndex);
      currentIndex = inputCharracters.indexOf(uniqueInput[i], currentIndex + 1);
    }
    outputArray[uniqueInput[i]] = indices.length
    indices = []
  }
  return outputArray
}

var sourceResult
sourceMatch !== null ? sourceResult = IndicesCounter(sourceMatch) : null
var translationResult = translationMatch !== null ? translationResult = IndicesCounter(translationMatch) : null
var sourcePropertyNames = Object.getOwnPropertyNames(config)
var sourceResultPropertyNames
sourceResult !== undefined ? sourceResultPropertyNames = Object.getOwnPropertyNames(sourceResult) : null
var translationResultPropertyNames
translationResult !== null ? translationResultPropertyNames = Object.getOwnPropertyNames(translationResult) : null
var notAllowedInTranslationArray = []

if (translationResult !== null) {
  for (i = 0; i < sourcePropertyNames.length; i++) {
    if (translationResultPropertyNames.indexOf(sourcePropertyNames[i]) !== -1) {
      notAllowedInTranslationArray.push(sourcePropertyNames[i])
    }
  }
}
if (notAllowedInTranslationArray.length) {
  result.message = 'Spanish Punctuation. Please remove ' + JoinWithQuotes(notAllowedInTranslationArray) + ' from translation.'
  result.fixes = [] // will be fixes for removing
} else if (sourceMatch !== null) {
  var currentSymbol
  var notLocalizedSymbols = []
  if (translationResult === null) { //// ++++++++++++++
    for (i = 0; i < sourceResultPropertyNames.length; i++) {
      notLocalizedSymbols.push(sourceResultPropertyNames[i])
    }
    result.fixes = []
    result.message = 'Spanish Punctuation. Please localize next punctuation symbol(s): ' + JoinWithQuotes(notLocalizedSymbols) + '.'
  } else { // Output mismatch
    for (i = 0; i < sourcePropertyNames.length; i++) {
      if (sourceResult[sourcePropertyNames[i]] > translationResult[config[sourcePropertyNames[i]]]) {
        notLocalizedSymbols.push('"' + sourcePropertyNames[i] + '" doesn`t localized ' + (sourceResult[sourcePropertyNames[i]] - translationResult[config[sourcePropertyNames[i]]]) + ' time(s)')
      } else if (translationResult[config[sourcePropertyNames[i]]] === undefined) {
        notLocalizedSymbols.push('"' + sourcePropertyNames[i] + '" doesn`t localized ' + sourceResult[sourcePropertyNames[i]] + ' time(s)')
      }
    }
    result.fixes = []
    result.message = 'Spanish Punctuation. Next issue(s) found: ' + notLocalizedSymbols.join(', ') + '.'
  }
} else {
  result.success = true
}
return result
