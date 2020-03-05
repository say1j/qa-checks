# qa-checks (Karplyuk Volodymyr)
• Duplacate words - This QA check removes every second repeated word in translation. Not case sensitive. Not configurable.  All languages are supported. Returns collection of fixes with message if dublicate words are found in translation.

• Forbidden characters - This QA check detects forbidden characters in translation from a predefined configurable collection. The warning message displays a list of found unique forbidden characters, if there are more than 5 - displays the first 5. Autofix removes them from the translation.

• Math symbols - This QA check inspects differences of mathematical symbols between source text and translation. It's configurable by collection of mathematical symbols. Returns the message with mismatch symbols and collection of fixes for extra mathematical symbols in translation.

• Translation is too short - This QA check cunts the length of words in the source text and translation, compares it to the minimum percentage. It's configurable by minimum percentage value, which is calculateed in the following way: (the length of the translation) / (the length of the source text). Returns a message when translation is too short.

------------------------------
Не перевірені на правильність англійської
• File name localization - This QA check inspects whether file names are correctly localized in translation. Configurable by the file name, which need to be localizated and the localizated file name for target languages. Returns a message with mismatch localizated file names in translation.

• Mail localization - This QA check inspects whether emails are correctly localized in translation. Configurable by the email, which need to be localizated and the localizated email for target languages. Returns a message with mismatch localizated emails in translation.

• URL localization - This QA check inspects whether URLs are correctly localized in translation. Configurable by the Url, which need to be localizated and the localizated URLs for target languages. Returns a message with mismatch localizated URLs in translation.
