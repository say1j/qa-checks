# qa-checks (Karplyuk Volodymyr)
• Duplacate words - Removes every second repeated word in translation. Not case sensitive. All languages supported. Not configurable. Returns collection of fixes with message if found dublicate words in translation.

• Forbidden characters - Detects forbidden characters in translation from a predefined configurable collection. The warning message displays a list of found unique forbidden characters, if more than 5 - displays the first 5. Autofix removes them from the translation.

• Math symbols - Inspect differences of mathematical symbols before translation and in the translation. Configurable by collection of mathematical symbols. Returns the message with mismatch symbols and collection of fixes for extra mathematical symbols in translation.

• Translation too short - Counts the length of words before and after translation, compares it to the minimum percentage. Configurable by minimum percentage value, which is calculates as follows: (the length of the translation words) / (the length of words to translate). Returns a message when translation is too short.

------------------------------
• Localization (Не перевірені)
1. File name localization - перевіряє зміну назв файлів відповідно до таргет мови перекладу. Список з відповідностями мов та назв файлів конфігурується.
2. Mail localization - перевіряє зміну адрес емейлів відповідно до таргет мови перекладу. Список з відповідностями мов та емейлів конфігурується.
3. URL localization - перевіряє зміну доменів сайту відповідно до таргет мови перекладу. Список з відповідностями мов та доменів конфігурується.
