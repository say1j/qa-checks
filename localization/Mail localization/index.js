/**
    * Checks whether emails are correctly localized in translation string.
    * Configurable.
    * @param {String} The email, which need to be localizated.
    * @param {String} The localizated email for target language.
    * @returns {Object} Returns a message with mismatch localizated emails in translation.
    * @example
    * 
    * Source string: Contact our support: example@crowdin.com.
    * Translation string: Зверніться до нашої служби підтримки: wrong.localizated.email@wrong.com.
    * // => Message: Email localization. Found 1 missed localizated email(s) in translation.
    */
// Config section

var yourTargetEmail
var yourSourceEmail = 'example@crowdin.com' // Set your main email in next format 'example@crowdin.com'

// Configure next function with your target languages and related emails in the following form:
// case 'your target language':
// yourTargetEmail = 'example@crowdin.com' where 'example@crowdin.com' your email for current language

switch (crowdin.targetLanguage) {
  case 'uk':
    yourTargetEmail = 'example@crowdin.ua'
    break

  case 'de':
    yourTargetEmail = 'example@crowdin.de'
    break

  case 'pl':
    yourTargetEmail = 'example@crowdin.com.pl'
    break

  case 'es':
    yourTargetEmail = 'example@crowdin.es'
    break

  default: // If there is no specific emails for target language, the source email will be selected
    yourTargetEmail = yourSourceEmail
    break
}

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
var patternForSourceMail, patternForTargetMail

patternForSourceMail = new RegExp ('(?<=\\s|^)' + yourSourceEmail.replace('.', '\\.') + '(?=\\s|$|\\.\\s)', 'gm')
patternForTargetMail = new RegExp ('(?<=\\s|^)' + yourTargetEmail.replace('.', '\\.') + '(?=\\s|$|\\.\\s)', 'gm')

var sourceMatch = source.match(patternForSourceMail)
var translationMatch = translation.match(patternForTargetMail)

if (sourceMatch == null || translationMatch == null) {
  if (sourceMatch == null && translationMatch == null) {
    result.success = true
  } else if (sourceMatch == null && translationMatch != null) {
    result.message = 'Email localization. Found ' + translationMatch.length + ' extra localizated email(s) in translation.'
    result.fixes = []
  } else if (sourceMatch != null && translationMatch == null) {
    result.message = 'Email localization. Found ' + sourceMatch.length + ' missed localizated email(s) in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length !== translationMatch.length) {
  if (sourceMatch.length <= translationMatch.length) {
    result.message = 'Email localization. Found ' + (translationMatch.length - sourceMatch.length) + ' extra localizated email(s) in translation.'
    result.fixes = []
  } else if (sourceMatch.length >= translationMatch.length) {
    result.message = 'Email localization. Found ' + (sourceMatch.length - translationMatch.length) + ' missed localizated email(s) in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length === translationMatch.length) {
  result.success = true
}

return result
