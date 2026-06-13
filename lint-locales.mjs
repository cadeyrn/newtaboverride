import { readdirSync, readFileSync } from 'node:fs'

const referenceLocale = 'de'
const localesDirectory = new URL('src/_locales/', import.meta.url)

const readMessages = locale => JSON.parse(
  readFileSync(new URL(`${locale}/messages.json`, localesDirectory), 'utf8')
)

const referenceKeys = Object.keys(readMessages(referenceLocale))
const referenceKeySet = new Set(referenceKeys)
const errors = []

for (const locale of readdirSync(localesDirectory)) {
  if (locale === referenceLocale) {
    continue
  }

  const messages = readMessages(locale)
  const localeKeys = Object.keys(messages)
  const localeKeySet = new Set(localeKeys)
  const missingKeys = referenceKeys.filter(key => !localeKeySet.has(key))
  const unexpectedKeys = localeKeys.filter(key => !referenceKeySet.has(key))

  if (missingKeys.length === 0 && unexpectedKeys.length === 0) {
    continue
  }

  errors.push(`_locales/${locale}/messages.json`)

  for (const key of missingKeys) {
    errors.push(`- missing key: ${key}`)
  }

  for (const key of unexpectedKeys) {
    errors.push(`- unexpected key: ${key}`)
  }
}

if (errors.length > 0) {
  console.error(`Locale lint failed:\n\n${errors.join('\n')}`)
  process.exitCode = 1
}
