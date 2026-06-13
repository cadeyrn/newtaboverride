import { spawnSync } from 'node:child_process'

const lintCommands = [
  'lint:html',
  'lint:css',
  'lint:js',
  'lint:locales',
  'lint:web-ext'
]

const failedCommands = []

const getFailureDetails = result => {
  const details = []

  if (result.status !== null) {
    details.push(`exit code ${result.status}`)
  }

  if (result.signal) {
    details.push(`signal ${result.signal}`)
  }

  if (result.error) {
    details.push(`error ${result.error.message}`)
  }

  return details.join(', ')
}

for (const command of lintCommands) {
  const result = spawnSync('npm', ['run', command], {
    env: {
      ...process.env
    },
    shell: false,
    stdio: 'inherit'
  })

  if (result.status !== 0 || result.signal || result.error) {
    failedCommands.push(`${command} (${getFailureDetails(result)})`)
  }
}

if (failedCommands.length > 0) {
  console.error(`\nLint failed: ${failedCommands.join(', ')}`)
  process.exitCode = 1
}
