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

if (crowdin.contentType === 'application/vnd.crowdin.text+plural') {
  var obj = JSON.parse(crowdin.source)
  source = obj[crowdin.context.pluralForm]
} else {
  source = crowdin.source
}

var translation = crowdin.translation
var patternForMainDomain, patternForTargetDomain

patternForMainDomain = new RegExp('((https?):\/\/|(https?):\/\/www.)' + yourMainDomainUrl, 'g')
patternForTargetDomain = new RegExp('((https?):\/\/|(https?):\/\/www.)' + yourTargetDomainUrl, 'g')

var sourceMatch = source.match(patternForMainDomain)
var translationMatch = translation.match(patternForTargetDomain)

if (sourceMatch == null || translationMatch == null) {
  if (sourceMatch == null && translationMatch == null) {
    result.success = true
  } else if (sourceMatch == null && translationMatch != null) {
    result.message = 'URL localization. Found extra localizated URL in translation.'
    result.fixes = []
  } else if (sourceMatch != null && translationMatch == null) {
    result.message = 'URL localization. Found missed localizated URL in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length !== translationMatch.length) {
  if (sourceMatch.length <= translationMatch.length) {
    result.message = 'URL localization. Found extra localizated URL in translation.'
    result.fixes = []
  } else if (sourceMatch.length >= translationMatch.length) {
    result.message = 'URL localization. Found missed localizated URL in translation.'
    result.fixes = []
  }
} else if (sourceMatch.length === translationMatch.length) {
  result.success = true
}

return result