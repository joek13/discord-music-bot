const config = require("./config/config.json");
const permission = require("./permissions.js");

let commands = [
  {
    name: "help",
    description: "Lists all commands or gives help for one command.",
    permission: permission.ANY,
    parameters:
    [
      {
        name: "command",
        optional: true,
        description: "The command to get help for."
      }
    ],
    aliases: ["commands"],
    run: (message, params) =>
    {
      if(params.length === 0)
      {
        //list all commands
        let response = [`Hello ${message.author.username}, here's a list of commands:`];
        for(let command of commands)
        {
          response.push(
            `  **${config.commandPrefix}${command.name}** - ${command.description}`
          );
        }
        response.push(`Type \`${config.commandPrefix}help <command>\` for more specific help on a single command.`);
        message.author.sendMessage(response);
      }
      else
      {
        //give help on a single command
        let command = findCommand(params[0]);
        if(command)
        {
          let reply = [`**Help for ${config.commandPrefix}${command.name}**`, `${command.description}`];
          if(command.aliases && aliases.length >= 1)
          {
            reply.push(`**Aliases:** ${command.aliases.join(", ")}`);
          }
          if(command.parameters && command.parameters.length >= 1)
          {
            reply.push("**Parameters:**");
            for(let parameter of command.parameters)
            {
              reply.push(`  **${config.commandPrefix}${parameter.name}** ${parameter.optional ? `*(optional)*` : ""} - ${parameter.description}`);
            }
          }
          message.reply(reply);
        }else
        {
          message.reply(`Command "${params[0]}" not found. Type ${config.commandPrefix}help for a list of commands.`);
        }
      }
    }
  }
];

function findCommand(name) {
  for(let command of commands)
  {
    if(command.name === name || command.aliases.includes(name))
    {
      return command;
    }
  }
  return null;
}

function processMessage(message)
{
  let split = message.content.split(" ");
  if(split.length > 0)
  {
      let commandIn = split[0].slice(config.commandPrefix.length);
      let params = split.slice(1);
      let command = findCommand(commandIn);
      if(command)
      {
        if(permission.checkPermission(message, command))
        {
          command.run(message, params);
        }
        else
        {
          message.reply("You don't have permission to perform that command here.");
        }
      }else
      {
        message.reply(`Command "${params[0]}" not found. Type ${config.commandPrefix}help for a list of commands.`);
      }
  }
}
module.exports.processMessage = processMessage;
