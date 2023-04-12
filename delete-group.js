process.env.GROUP_SCRIPT = true

require('./server/index.js')

async function deleteGroup({ name }) {
  console.log('Deleting Group: ' + name)
  const auth = require('./server/core/auth.js')
  try {
    const group = await WIKI.models.groups.query().findOne({ name: name })
    if (group) {
      if (group.id === 1 || group.id === 2) {
        console.log('Cannot delete this group.')
        return
      }
      await WIKI.models.groups.query().deleteById(group.id)

      WIKI.auth.revokeUserTokens({ id: group.id, kind: 'g' })
      WIKI.events.outbound.emit('addAuthRevoke', { id: group.id, kind: 'g' })
    } else {
      console.log('Group not found.')
      return
    }
    await auth.reloadGroups()
    WIKI.events.outbound.emit('reloadGroups')
    console.log('Group deleted successfully')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete group!')
  } finally {
    process.env.USER_SCRIPT = false
  }
}
const args = process.argv.slice(2)
const [name] = args

// not nice but we need to wait for the WIKI object to be instantiated completly
setTimeout(() => {
  deleteGroup( {name} ).then(() => {
    process.exit(0)
  }).catch(() => process.exit(1))
}, 5000)
