process.env.CERTS_SCRIPT = true

require('./server/index.js')


async function generateCerts() {
  const auth = require('./server/core/auth.js')
  console.log('Generating new certificates.')
  try {
    await auth.regenerateCertificates()
    console.log('Certificates successfully generated.')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to generate certificats!')
  } finally {
    process.env.CERTS_SCRIPT = false
  }
}

// not nice but we need to wait for the WIKI object to be instantiated completly
setTimeout(() => { generateCerts().then(() => {
  process.exit(0)
}).catch(() => process.exit(1)) }, 5000)
