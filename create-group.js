process.env.GROUP_SCRIPT = true

require('./server/index.js')

async function createGroup({ name }) {
  console.log('Creating new Group: ' + name)
  const auth = require('./server/core/auth.js')
  try {
    const group = await WIKI.models.groups.query().findOne({ name: name })
    if (! group) {
      await WIKI.models.groups.query().insertAndFetch({
        name: name,
        permissions: JSON.stringify(WIKI.data.groups.defaultPermissions),
        pageRules: JSON.stringify(WIKI.data.groups.defaultPageRules),
        isSystem: false
      })
    } else {
      console.log('Group exists already')
      return
    }
    await auth.reloadGroups()
    WIKI.events.outbound.emit('reloadGroups')
    console.log('Group created successfully')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create group!')
  } finally {
    process.env.USER_SCRIPT = false
  }
}
const args = process.argv.slice(2)
const [name] = args

// not nice but we need to wait for the WIKI object to be instantiated completly
setTimeout(() => {
  createGroup( {name} ).then(() => {
    process.exit(0)
  }).catch(() => process.exit(1))
}, 5000)
