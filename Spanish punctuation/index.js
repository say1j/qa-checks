var config = {
  "¿": "?",
  "¡": "!"
}
  
var result = {
success: false
}

if (crowdin.targetLanguage !== "es") {
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
var sourceRegex = new RegExp('[' + GetValues(config).join('') + ']', 'g')
var translationRegex = new RegExp('[' + Object.getOwnPropertyNames(config).join('') + ']', 'g')

var sourceMatch = source.match(sourceRegex)
var translationMatch = translation.match(translationRegex)

function GetValues(config) {
  return Object.keys(config).map(function(e) {
    return config[e]
  })
}

function JoinWithQuotes (array) {
return array.length < 5 ? '"' + array.join('", "') + '"' : array.slice(0, 5).join('", "') + '" and others'
}

function Quotes (str) {
  return '"' + str + '"'
}

function ExtraTimes(element, times) {
  return Quotes(element) + ' extra localized ' + times + ' time(s).'
}

function DoesntTimes(element, times) {
  return Quotes(element) + ' doesn`t localized ' + times + ' time(s).'
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
var sourcePropertyValues = GetValues(config)
var sourcePropertyNames = Object.getOwnPropertyNames(config)
var sourceResultPropertyNames
sourceResult !== undefined ? sourceResultPropertyNames = Object.getOwnPropertyNames(sourceResult) : null
var translationResultPropertyNames
translationResult !== null ? translationResultPropertyNames = Object.getOwnPropertyNames(translationResult) : null
var notAllowedInSourceArray = []
if (sourceMatch !== null || translationMatch !== null) {
  var currentSymbol
  var notLocalizedSymbols = []
  if (translationResult === null) {
    result.fixes = []
    result.message = 'Spanish Punctuation. Please localize next punctuation symbol(s): ' + JoinWithQuotes(sourceResultPropertyNames) + '.'
  } else { // Output mismatch
    if (sourceResult === undefined) {
      for (i = 0; i < translationResultPropertyNames.length; i++) {
        notLocalizedSymbols.push(ExtraTimes(translationResultPropertyNames[i], translationResult[translationResultPropertyNames[i]]))
      }
    } else {
      for (i = 0; i < sourcePropertyValues.length; i++) {
        if (sourceResult[sourcePropertyValues[i]] === undefined) { // if source symbol undefined, check translation for extra 
          translationResult[sourcePropertyNames[i]] === undefined ? null : notLocalizedSymbols.push(ExtraTimes(sourcePropertyValues[i], translationResult[sourcePropertyNames[i]]))
        } else {
          if (translationResult[sourcePropertyNames[i]] === undefined) {
            notLocalizedSymbols.push(DoesntTimes(sourcePropertyValues[i], sourceResult[sourcePropertyValues[i]]))
          } else if (sourceResult[sourcePropertyValues[i]] === translationResult[sourcePropertyNames[i]]) {
            continue
          } else {
            (sourceResult[sourcePropertyValues[i]] > translationResult[sourcePropertyNames[i]]) ? notLocalizedSymbols.push(
              DoesntTimes(sourcePropertyValues[i], (sourceResult[sourcePropertyValues[i]] - translationResult[sourcePropertyNames[i]]))) : notLocalizedSymbols.push(
                ExtraTimes(sourcePropertyValues[i], (translationResult[sourcePropertyNames[i]] - sourceResult[sourcePropertyValues[i]])))
          }
        }
      }
    }
    if (!notLocalizedSymbols.length) {
      result.success = true
      return result
    } else {
      result.fixes = []
      result.message = 'Spanish Punctuation. Next issue(s) found: ' + notLocalizedSymbols.join(', ') + '.'
    }
  }
} else {
  result.success = true
}
return result
