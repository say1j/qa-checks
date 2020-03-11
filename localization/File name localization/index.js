/**
    * Checks whether file names are correctly localized in translation string.
    * Configurable.
    * @param {Array|Object} collection The collection of file names for localization.
    * @param {Array|Object} collection The collection of file names for target languages.
    * @returns {Object} Returns a message with mismatch localizated file names in translation.
    * @example
    * 
    * Source string: Open example1.txt file.
    * Translation string: Відкрийте wrong_localizated_file_name.txt файл.
    * // => Message: File localization. Found 1 missed localizated file name(s) in translation.
    */
// Config section
var yourMainFileNames = ['example1.txt', 'example2.txt'] // Your collection of file names for localization
var yourTargetFileNames = [] // Leave blank

// Configure next function with your target languages and related file names in the following form:

// case 'your target language':
// yourTargetFileNames = ['example1_trg1.txt', 'example2_trg2.txt'] where 'example1_trg1.txt', 'example2_trg2.txt' your file names for current language

switch (crowdin.targetLanguage) {
  case 'uk':
    yourTargetFileNames = ['example1_UA.txt', 'example2_UA.txt']
    break

  case 'de':
    yourTargetFileNames = ['example1_DE.txt', 'example2_DE.txt']
    break

  case 'pl':
    yourTargetFileNames = ['example1_PLND.txt', 'example2_PLND.txt']
    break

  case 'es':
    yourTargetFileNames = ['example1_ESP.txt', 'example2_ESP.txt']
    break

  default: // If there is no specific file names for target language, the main file names will be selected with auto configurable suffix before the last dot
    // yourMainFileNames.forEach(element => yourTargetFileNames.push(SetCharAt(element, element.lastIndexOf('.'), '_' + crowdin.targetLanguage + '.')))
    for (var i = 0; i < yourMainFileNames.length; i++) {
      yourTargetFileNames.push(SetCharAt(yourMainFileNames[i], yourMainFileNames[i].lastIndexOf('.'), '_' + crowdin.targetLanguage + '.'))
    }
    break
}

// Code section

var result = {
  success: false
}

function SetCharAt (str, index, chr) {
  if (index > str.length - 1) return str
  return str.substr(0, index) + chr + str.substr(index + 1)
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
var patternForFileNames = new RegExp('(?<=\\s|^)[a-z0-9A-Z_\\.]+\\.[A-Za-z]{1,3}(?=\\s|$|\\.\\s)', 'gm')
var sourceMatch = source.match(patternForFileNames)
var translationMatch = translation.match(patternForFileNames)
var fileNamesForLocalization = []
var fileNamesLocalizted = []

if (sourceMatch != null) {
  for (var i = 0; i < sourceMatch.length; i++) {
    (yourMainFileNames.indexOf(sourceMatch[i]) !== -1) ? fileNamesForLocalization.push(sourceMatch[i]) : null
  }
}

if (translationMatch != null) {
  for (var i = 0; i < translationMatch.length; i++) {
    (yourTargetFileNames.indexOf(translationMatch[i]) !== -1) ? fileNamesLocalizted.push(translationMatch[i]) : null
  }
}

if (fileNamesLocalizted == null || fileNamesForLocalization == null) {
  if (fileNamesLocalizted == null && fileNamesForLocalization == null) {
    result.success = true
  } else if (fileNamesLocalizted == null && fileNamesForLocalization != null) {
    result.message = 'File localization. Found ' + fileNamesForLocalization.length + ' missed localizated file name(s) in translation.'
    result.fixes = []
  } else if (fileNamesLocalizted != null && fileNamesForLocalization == null) {
    result.message = 'File localization. Found ' + fileNamesLocalizted.length + ' extra localizated file name(s) in translation.'
    result.fixes = []
  }
} else if (fileNamesLocalizted.length !== fileNamesForLocalization.length) {
  if (fileNamesLocalizted.length <= fileNamesForLocalization.length) {
    result.message = 'File localization. Found ' + (fileNamesForLocalization.length - fileNamesLocalizted.length) + ' missed localizated file name(s) in translation.'
    result.fixes = []
  } else if (fileNamesLocalizted.length >= fileNamesForLocalization.length) {
    result.message = 'File localization. Found ' + (fileNamesLocalizted.length - fileNamesForLocalization.length) + ' extra localizated file name(s) in translation.'
    result.fixes = []
  }
} else if (fileNamesLocalizted.length === fileNamesForLocalization.length) {
  result.success = true
}
return result
