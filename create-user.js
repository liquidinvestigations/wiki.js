process.env.USER_SCRIPT = true

const users = require('./server/models/users.js')

require('./server/index.js')

async function createUser({ email, name }) {
  console.log('Creating new user: ' + email + '; ' + name)
  try {
    await users.createNewUser({
      providerKey: 'liquid',
      email: email,
      passwordRaw: '',
      name: name,
      groups: [], // an array of group IDs (2 is for Guests)
      mustChangePassword: false,
      sendWelcomeEmail: false
    })
    console.log('User created successfully')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create user!')
  } finally {
    process.env.USER_SCRIPT = false
  }
}
const args = process.argv.slice(2)
const [email, name] = args
createUser({ email, name }).then(() => {
  process.exit(0);
})
  .catch(() => {
    process.exit(1)
})
