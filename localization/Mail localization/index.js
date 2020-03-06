/**
    * Checks whether emails are correctly localized in translation string.
    * Configurable.
    * @param {Array|Object} collection The collection of emails for ignore localization.
    * @param {Array|Object} collection The collection of emails for localization.
    * @param {Array|Object} collection The collection of emails for target languages.
    * @returns {Object} Returns a message with mismatch localizated emails in translation.
    * @example
    *
    * Source string: Contact our support: example1@crowndin.com.
    * Translation string: Зверніться до нашої служби підтримки: wrong.example1@crowdin.ua.
    * // => Message: Email localization. Found 1 missed localizated email(s) in translation.
    */
// Config section

var ignoreMassive = ['ignore1example@crowdin.com', 'ignore2example@crowdin.com'] // Set your emails for ignore
var yourSourceEmails = ['example1@crowdin.com', 'example2@crowdin.com'] // Set your source emails
var yourTargetEmails = []

// Configure next function with your target languages and related emails in the following form:
// case 'your target language':
// yourTargetEmail = ['example1@crowdin.ua', 'example2_UA@crowdin.com'] where 'example1@crowdin.ua' and others - your emails for current language

switch (crowdin.targetLanguage) {
  case 'uk':
    yourTargetEmails = ['example1@crowdin.ua', 'example2_UA@crowdin.com']
    break

  case 'de':
    yourTargetEmails = ['example1@crowdin.de', 'example2_DE@crowdin.com']
    break

  case 'pl':
    yourTargetEmails = ['example1_PLN@crowdin.com', 'example2@crowdin.pl']
    break

  case 'es':
    yourTargetEmails = ['example1_ESP@crowdin.com', 'example2@crowdin.esp']
    break

  default: // If there is no specific emails for target language, the main file names will be selected with auto configurable domain after the last dot
    for (var i = 0; i < yourSourceEmails.length; i++) {
      yourTargetEmails.push(SetTargetAt(yourSourceEmails[i], yourSourceEmails[i].lastIndexOf('.'), '.' + crowdin.targetLanguage))
    }
    break
}

// Code section

var result = {
  success: false
}

function SetTargetAt (str, index, chr) {
  if (index > str.length - 1) return str
  return str.substr(0, index) + chr
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
var patternForEmails = new RegExp('(?<=\\s|^)(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,3}))(?=\\s|$|\\.\\s)', 'gm')

var sourceMatch = source.match(patternForEmails)
var translationMatch = translation.match(patternForEmails)
var emailsForLocalization = []
var emailsLocalizted = []

if (sourceMatch != null) {
  for (var i = 0; i < sourceMatch.length; i++) {
    (ignoreMassive.indexOf(sourceMatch[i]) === -1 && yourSourceEmails.indexOf(sourceMatch[i]) !== -1) ? emailsForLocalization.push(sourceMatch[i]) : null
  }
}
if (translationMatch != null) {
  for (var i = 0; i < translationMatch.length; i++) {
    (ignoreMassive.indexOf(translationMatch[i]) === -1 && yourTargetEmails.indexOf(translationMatch[i]) !== -1) ? emailsLocalizted.push(translationMatch[i]) : null
  }
}

if (emailsLocalizted == null || emailsForLocalization == null) {
  if (emailsLocalizted == null && emailsForLocalization == null) {
    result.success = true
  } else if (emailsLocalizted == null && emailsForLocalization != null) {
    result.message = 'Email localization. Found ' + emailsForLocalization.length + ' missed localizated email(s) in translation.'
    result.fixes = []
  } else if (emailsLocalizted != null && emailsForLocalization == null) {
    result.message = 'Email localization. Found ' + emailsLocalizted.length + ' extra localizated email(s) in translation.'
    result.fixes = []
  }
} else if (emailsLocalizted.length !== emailsForLocalization.length) {
  if (emailsLocalizted.length <= emailsForLocalization.length) {
    result.message = 'Email localization. Found ' + (emailsForLocalization.length - emailsLocalizted.length) + ' missed localizated email(s) in translation.'
    result.fixes = []
  } else if (emailsLocalizted.length >= emailsForLocalization.length) {
    result.message = 'Email localization. Found ' + (emailsLocalizted.length - emailsForLocalization.length) + ' extra localizated email(s) in translation.'
    result.fixes = []
  }
} else if (emailsLocalizted.length === emailsForLocalization.length) {
  result.success = true
}

return result
