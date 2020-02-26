// Config section. Change as an example

var characters = ['+', '±', '–', '=', '≠', '≈', '≅', '≡', '*', '×', '÷', '/', '<', '>', '≤', '≥', '∑', '∏', '∫', '∩', '∀', '∃', '∅', '∂', '∇', '⊂', '⊃', '∪', '∈', '∉', '∋', '∠', '∴', '⊕', '⊗', '⊥', '√', '∝', '∞'] // Your math symbols

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

var translation = crowdin.translation
var regex = new RegExp('[' + characters.join('') + ']', 'g')
sourceMatch = source.match(regex)
translationMatch = translation.match(regex)

function UnionArrays (firstArray, secondArray) {
  var tempArray = firstArray.concat(secondArray)
  tempArray.sort()
  var outputArray = [tempArray[0]]
  for (var i = 1; i < tempArray.length; i++) {
    if (tempArray[i] !== tempArray[i - 1]) {
      outputArray.push(tempArray[i])
    }
  }
  return outputArray
}

function ArrayContains (array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === item) {
      return true
    }
  }
  return false
}

if (sourceMatch != null || translationMatch != null) {
  var sourceResult = {}
  var translationResult = {}
  var sourceProps = []
  var translationProps = []
  var mergedProps = []
  var solution = []
  if (sourceMatch != null && translationMatch != null) {
    for (var i = 0; i < sourceMatch.length; ++i) {
      var currentCharacter = sourceMatch[i]
      if (sourceResult[currentCharacter] !== undefined) { ++sourceResult[currentCharacter] } else { sourceResult[currentCharacter] = 1 }
    }
    for (var j = 0; j < translationMatch.length; ++j) {
      currentCharacter = translationMatch[j]
      if (translationResult[currentCharacter] !== undefined) { ++translationResult[currentCharacter] } else { translationResult[currentCharacter] = 1 }
    }
    sourceProps = Object.getOwnPropertyNames(sourceResult)
    translationProps = Object.getOwnPropertyNames(translationResult)
    mergedProps = UnionArrays(sourceProps, translationProps)
  }
  if (sourceMatch != null || translationMatch != null) {
    if (sourceMatch == null) {
      for (j = 0; j < translationMatch.length; ++j) {
        currentCharacter = translationMatch[j]
        if (translationResult[currentCharacter] !== undefined) { ++translationResult[currentCharacter] } else { translationResult[currentCharacter] = 1 }
      }
      translationProps = Object.getOwnPropertyNames(translationResult)
      mergedProps = translationProps
    } else if (translationMatch == null) {
      for (i = 0; i < sourceMatch.length; ++i) {
        currentCharacter = sourceMatch[i]
        if (sourceResult[currentCharacter] !== undefined) { ++sourceResult[currentCharacter] } else { sourceResult[currentCharacter] = 1 }
      }
      sourceProps = Object.getOwnPropertyNames(sourceResult)
      mergedProps = sourceProps
    }
  }
  var replacementArray = []
  var missingArray = []
  var extraArray = []
  for (var u = 0; u < mergedProps.length; u++) {
    if (ArrayContains(sourceProps, mergedProps[u]) && ArrayContains(translationProps, mergedProps[u])) {
      if (sourceResult[mergedProps[u]] === translationResult[mergedProps[u]]) { // If match good, check next
        continue
      } else { // Sort extra/missing and add to array
        if (sourceResult[mergedProps[u]] >= translationResult[mergedProps[u]]) {
          missingArray.push(mergedProps[u])
        } else if (sourceResult[mergedProps[u]] <= translationResult[mergedProps[u]]) {
          extraArray.push(mergedProps[u])
        }
      }
    } else if (ArrayContains(sourceProps, mergedProps[u]) && !ArrayContains(translationProps, mergedProps[u])) { // Missed in translation, add to missing array
      missingArray.push(mergedProps[u])
    } else if (!ArrayContains(sourceProps, mergedProps[u]) && ArrayContains(translationProps, mergedProps[u])) { // Extra in translation, add to extra array
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
  if (!(Array.isArray(extraArray) && extraArray.length) && !(Array.isArray(missingArray) && missingArray.length)) {
    result.success = true
  } else if (Array.isArray(extraArray) && extraArray.length && Array.isArray(missingArray) && missingArray.length) {
    result.fixes = solution
    result.message = 'Math symbols. Missing in translation: '
    if (missingArray.length < 6) {
      result.message += missingArray.join(', ') + '. '
    } else {
      result.message += missingArray.slice(0, 5).join(', ') + ' and others. '
    }
    result.message += 'Extra in translation: '
    if (extraArray.length < 6) {
      result.message += extraArray.join(', ') + '.'
    } else {
      result.message += extraArray.slice(0, 5).join(', ') + ' and others.'
    }
  } else if (Array.isArray(missingArray) && missingArray.length && !(Array.isArray(extraArray) && extraArray.length)) {
    result.fixes = solution
    result.message = 'Math symbols. Missing in translation: '
    if (missingArray.length < 6) {
      result.message += missingArray.join(', ') + '.'
    } else {
      result.message += missingArray.slice(0, 5).join(', ') + ' and others.'
    }
  } else if (!(Array.isArray(missingArray) && missingArray.length) && Array.isArray(extraArray) && extraArray.length) {
    result.fixes = solution
    result.message = 'Math symbols. Extra in translation: '
    if (extraArray.length < 6) {
      result.message += extraArray.join(', ') + '.'
    } else {
      result.message += extraArray.slice(0, 5).join(', ') + ' and others.'
    }
  }
} 
else {
  result.success = true
}

return result