/**
    * Inspect differences of mathematical symbols before translation and in the translation string.
    * Configurable.
    * @param {Array|Object} collection The collection of mathematical symbols.
    * @returns {Object} Returns the message with mismatch symbols and collection of fixes for extra mathematical symbols in translation.
    * @example
    *
    * Mathematical equation in source string: 1+2≠8
    * Mathematical equation in translation string: 1+2≠-8
    * // => 1+2≠8
    */
// Config section

var characters = ['+', '-', '±', '=', '≠', '≈', '≅', '≡', '*', '×', '÷', '/', '<', '>', '≤', '≥', '∑', '∏', '∫', '∩', '∀', '∃', '∅', '∂', '∇', '⊂', '⊃', '∪', '∈', '∉', '∋', '∠', '∴', '⊕', '⊗', '⊥', '√', '∝', '∞'] // Your math symbols

// Code section

var result = {
  success: false
}

if (crowdin.contentType == 'application/vnd.crowdin.text+plural') {
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
characters.indexOf('-') !== -1 ? characters[characters.indexOf('-')] = '\\-' : null
regex = new RegExp('[' + characters.join('') + ']', 'g')

sourceMatch = source.match(regex)
translationMatch = translation.match(regex)

function UnionArrays (firstArray, secondArray) {
  var outputArray = []
  if (firstArray.length && secondArray.length) {
    var tempArray = firstArray.concat(secondArray)
    tempArray.sort()
    outputArray = [tempArray[0]]
    for (var i = 1; i < tempArray.length; i++) {
      if (tempArray[i] !== tempArray[i - 1]) {
        outputArray.push(tempArray[i])
      }
    }
    return outputArray
  } else if (!firstArray.length) {
    secondArray.length ? outputArray = secondArray : null
  } else if (!secondArray.length) {
    firstArray.length ? outputArray = firstArray : null
  }
  return outputArray
}

function JoinWithQuotes (array, slice) {
  return slice ? array.slice(0, 5).join('", "') + '" and others.' : '"' + array.join('", "') + '".'
}

var sourceResult = {}
var translationResult = {}
var sourceProps = []
var translationProps = []
var mergedProps = []
var solution = []

if (sourceMatch != null) {
  for (var i = 0; i < sourceMatch.length; ++i) {
    var currentCharacter = sourceMatch[i]
    sourceResult[currentCharacter] !== undefined ? ++sourceResult[currentCharacter] : sourceResult[currentCharacter] = 1
  }
  sourceProps = Object.getOwnPropertyNames(sourceResult)
}

if (translationMatch != null) {
  for (var j = 0; j < translationMatch.length; ++j) {
    currentCharacter = translationMatch[j]
    translationResult[currentCharacter] !== undefined ? ++translationResult[currentCharacter] : translationResult[currentCharacter] = 1
  }
  translationProps = Object.getOwnPropertyNames(translationResult)
}

mergedProps = UnionArrays(sourceProps, translationProps)

if (mergedProps.length) {
  var replacementArray = []
  var missingArray = []
  var extraArray = []
  for (var u = 0; u < mergedProps.length; u++) { // Sort extra/missing and add to array
    if (sourceProps.indexOf(mergedProps[u]) !== -1 && translationProps.indexOf(mergedProps[u]) !== -1) {
      if (sourceResult[mergedProps[u]] === translationResult[mergedProps[u]]) {
      } else {
        if (sourceResult[mergedProps[u]] >= translationResult[mergedProps[u]]) {
          missingArray.push(mergedProps[u])
        } else if (sourceResult[mergedProps[u]] <= translationResult[mergedProps[u]]) {
          extraArray.push(mergedProps[u])
        }
      }
    } else if (sourceProps.indexOf(mergedProps[u]) !== -1 && translationProps.indexOf(mergedProps[u]) === -1) {
      missingArray.push(mergedProps[u])
    } else if ((sourceProps.indexOf(mergedProps[u]) === -1 && translationProps.indexOf(mergedProps[u]) !== -1)) {
      extraArray.push(mergedProps[u])
      replacementArray.push(mergedProps[u])
    }
  }
  if (replacementArray != null) { // Add fixes for extra symbols
    var tempIndex
    var repRegex = new RegExp('[' + replacementArray.join('') + ']', 'g')
    for (i = 0; i < replacementArray.length; i++) {
      for (j = 0; j < translationResult[replacementArray[i]]; j++) {
        tempIndex = repRegex.exec(translation).index
        solution.push({
          from_pos: tempIndex,
          to_pos: tempIndex + 1,
          replacement: ''
        })
      }
    }
  }
  if (!extraArray.length && !missingArray.length) {
    result.success = true
  } else {
    result.fixes = solution
    result.message = 'Math symbols.'
    if (missingArray.length) {
      result.message += ' Missing in translation: '
      missingArray.length < 6 ? result.message += JoinWithQuotes(missingArray, false) : result.message += JoinWithQuotes(missingArray, true)
    }
    if (extraArray.length) {
      result.message += ' Extra in translation: '
      extraArray.length < 6 ? result.message += JoinWithQuotes(extraArray, false) : result.message += JoinWithQuotes(extraArray, true)
    }
  }
} else {
  result.success = true
}

return result
