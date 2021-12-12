const chalk = require('chalk')
const { Command } = require('commander')
const { required } = require('nodemon/lib/config')
const Logger = require('nodemon/lib/utils/log')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require('./contacts')

const program = new Command()
program
  .requiredOption('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone')

program.parse(process.argv)

const argv = program.opts()

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case 'list':
      const contacts = await listContacts()
      console.table(contacts)
      break

    case 'get':
      const contactById = await getContactById(id)
      if (contactById) {
        console.log(chalk.green('Contact found!'))
        console.log(contactById)
        return
      }
      console.log(chalk.red('Contact not found!'))
      break

    case 'add':
      const newContact = await addContact(name, email, phone)
      console.log(chalk.green('New contact'))
      console.log(newContact)

    case 'remove':
      const deleteContact = await removeContact(id)
      if (deleteContact) {
        console.log(chalk.yellow(`Contact by id ${id} has deleted`))
        console.log(deleteContact)
        return
      }

      console.log(chalk.red(`Contact by id ${id} is not found to delete`))
      break

    default:
      console.warn(chalk.red('Unknown action type!'))
  }
}

invokeAction(argv).then(() => console.log('Successful operation'))
