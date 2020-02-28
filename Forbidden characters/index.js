/**
    * Removes every forbidden character in translation string.
    * Configurable.
    * @param {Array|Object} collection The collection of forbidden characters.
    * @returns {Object} Returns collection of fixes with message if found forbidden characters in translation. 
    * @example (For example '#' character is forbidden)
    * 
    * Test #string.
    * // => Test string.
    */
// Config section

var characters = ['!', '@', '#', '$', '%', '&'] // Your forbidden characters

// Code section

var result = {
  success: false
}

function UniqueCharacters (inputArray) {
  var outputArray = [],
      currentCharacter
  for (var i = 0; i < inputArray.length; i++) {
    currentCharacter = inputArray[i]
    if (!~outputArray.indexOf(currentCharacter)) {
      outputArray.push(currentCharacter)
    }
  }
  return outputArray
}

var translation = crowdin.translation,
    regex = new RegExp('[' + characters.join('') + ']', 'g')
translationMatch = translation.match(regex)

if (translationMatch != null) {
  var uniqueArray = UniqueCharacters(translationMatch),
      solution = [],
      tempIndex
  result.message = 'Forbidden characters. The translation contains ' + uniqueArray.length + ' forbidden character(s): '
  if (uniqueArray.length < 6) {
    result.message += '"' + uniqueArray.join('", "') + '".'
  } else {
    result.message += '"' + uniqueArray.slice(0, 5).join('", "') + '" and others.'
  }
  for (var i = 0; i < translationMatch.length; i++) {
    tempIndex = regex.exec(translation).index
    solution[i] = {
      from_pos: tempIndex,
      to_pos: tempIndex + 1,
      replacement: ''
    }
  }
  result.fixes = solution
} else {
  result.success = true
}

return result