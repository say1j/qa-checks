/**
    * Checks whether URLs are correctly localized in translation string.
    * Configurable.
    * @param {String} The URL, which need to be localizated.
    * @param {String} The localizated URL for target language.
    * @returns {Object} Returns a message with mismatch localizated URLs in translation.
    * @example
    * 
    * Source string: Check our products: https://www.crowdin.com.
    * Translation string: Подивіться нашу продукцію: https://www.crowdin.wrong.ua.
    * // => Message: URL localization. Found 1 missed localizated URL(s) in translation.
    */
// Config section

var yourTargetDomainUrl
var yourMainDomainUrl = 'crowdin.com' // Set your main domain URL in next format 'example.com', 'www.example.com' or 'example.com.ua'

// Configure next function with your target languages and related domains in the following form:

// case 'your target language':
// yourTargetDomainUrl = 'example.com' where 'example.com' or 'example.com.ua' your domain for current language

switch (crowdin.targetLanguage) {
  case 'uk':
    yourTargetDomainUrl = 'crowdin.ua'
    break

  case 'de':
    yourTargetDomainUrl = 'crowdin.de'
    break

  case 'pl':
    yourTargetDomainUrl = 'crowdin.com.pl'
    break

  case 'es':
    yourTargetDomainUrl = 'crowdin.es'
    break

  default: // If there is no specific domain for target language, the main domain will be selected
    yourTargetDomainUrl = yourMainDomainUrl
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
var patternForMainDomain, patternForTargetDomain

patternForMainDomain = new RegExp('(?<=\\s|^)((https?):\/\/|(https?):\/\/www.)' + yourMainDomainUrl + '(?=\\s|$)', 'gm')
patternForTargetDomain = new RegExp('(?<=\\s|^)((https?):\/\/|(https?):\/\/www.)' + yourTargetDomainUrl + '(?=\\s|$)', 'gm')

var sourceMatch = source.match(patternForMainDomain)
var translationMatch = translation.match(patternForTargetDomain)
result.source = source
result.s = sourceMatch
result.t = translationMatch

if (sourceMatch == null || translationMatch == null) {
  if (sourceMatch == null && translationMatch == null) {
    result.success = true
  } else if (sourceMatch == null && translationMatch != null) {
    result.message = 'URL localization. Found ' + translationMatch.length + ' extra localizated URL in translation.'
    result.fixes = []
  } else if (sourceMatch != null && translationMatch == null) {
    result.message = 'URL localization. Found ' + sourceMatch.length + ' missed localizated URL in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length !== translationMatch.length) {
  if (sourceMatch.length <= translationMatch.length) {
    result.message = 'URL localization. Found ' + (translationMatch.length - sourceMatch.length) + ' extra localizated URL in translation.'
    result.fixes = []
  } else if (sourceMatch.length >= translationMatch.length) {
    result.message = 'URL localization. Found ' + (sourceMatch.length - translationMatch.length) + ' missed localizated URL in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length === translationMatch.length) {
  result.success = true
}

return result
