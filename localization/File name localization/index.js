/**
    * Checks whether file names are correctly localized in translation string.
    * Configurable.
    * @param {String} The file name, which need to be localizated.
    * @param {String} The localizated file name for target language.
    * @returns {Object} Returns a message with mismatch localizated file names in translation.
    * @example
    * 
    * Source string: Open example.txt file.
    * Translation string: Відкрийте wrong_localizated_file_name.txt файл.
    * // => Message: File localization. Found 1 missed localizated file name(s) in translation.
    */
// Config section

var yourTargetFileName
var yourMainFileName = 'example.txt' // Set your main file name

// Configure next function with your target languages and related file names in the following form:

// case 'your target language':
// yourTargetFileName = 'example.txt' where 'example.txt' your file name for current language

switch (crowdin.targetLanguage) {
  case 'uk':
    yourTargetFileName = 'example_uk.txt'
    break

  case 'de':
    yourTargetFileName = 'example_de.txt'
    break

  case 'pl':
    yourTargetFileName = 'example_pl.txt'
    break

  case 'es':
    yourTargetFileName = 'example_es.txt'
    break

  default: // If there is no specific file name for target language, the main file name will be selected
    yourTargetFileName = yourMainFileName
    break
}

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
var patternForMainFileName, patternForTargetFileName

patternForYourMainFileName = new RegExp ('(?<=\\s|^)' + yourMainFileName.replace('.', '\\.') + '(?=\\s|$|\\.\\s)', 'gm')
patternForYourTargetFileName = new RegExp ('(?<=\\s|^)' + yourTargetFileName.replace('.', '\\.') + '(?=\s|$|\\.\\s)', 'gm')

var sourceMatch = source.match(patternForYourMainFileName)
var translationMatch = translation.match(patternForYourTargetFileName)

if (sourceMatch == null || translationMatch == null) {
  if (sourceMatch == null && translationMatch == null) {
    result.success = true
  } else if (sourceMatch == null && translationMatch != null) {
    result.message = 'File localization. Found ' + translationMatch.length + ' extra localizated file name(s) in translation.'
    result.fixes = []
  } else if (sourceMatch != null && translationMatch == null) {
    result.message = 'File localization. Found ' + sourceMatch.length + ' missed localizated file name(s) in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length !== translationMatch.length) {
  if (sourceMatch.length <= translationMatch.length) {
    result.message = 'File localization. Found ' + (translationMatch.length - sourceMatch.length) + ' extra localizated file name(s) in translation.'
    result.fixes = []
  } else if (sourceMatch.length >= translationMatch.length) {
    result.message = 'File localization. Found ' + (sourceMatch.length - translationMatch.length) + ' missed localizated file name(s) in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length === translationMatch.length) {
  result.success = true
}

return result
