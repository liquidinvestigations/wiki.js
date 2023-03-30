process.env.USER_SCRIPT = true

const users = require('./server/models/users.js')

require('./server/index.js')

async function deleteUser({ name }) {
  const usr = await WIKI.models.users.query().findOne({ name })
  console.log('Deleting user: ' + name + '; id: ' + usr.id)
  try {
    await users.deleteUser(usr.id, 2)
    console.log('User deleted successfully')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete user!')
  } finally {
    process.env.USER_SCRIPT = false
  }
}
const args = process.argv.slice(2)
const [name] = args

deleteUser({ name }).then(() => {
  process.exit(0);
})
  .catch(() => {
    process.exit(1)
  })
