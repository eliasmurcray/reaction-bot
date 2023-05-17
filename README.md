<h1 align="center">Reaction Bot</h1>

<p align="center">Reaction Bot is a simple Discord bot designed to facilitate role assignment based on user reactions.</p>
<br>

## Features

- Easy role assignment: Users can assign themselves roles by reacting to specific messages.
- Customizable reactions: Define the messages and reactions to trigger role assignment.
- Easy Setup: Deploy the bot quickly and easily to your Discord server.

## Setup and Usage

1. [Add the bot to your server.](https://discord.com/oauth2/authorize?client_id=1072595131905081497&permissions=2415929408&scope=bot%20applications.commands)
2. Create a role or two for testing!
3. Run `/reactrole` in the format `/reactrole [@role1] [:emoji1:] [@role2] [:emoji2:]` (without square brackets) in the Discord message input, then press enter.
4. You should now have a message from the bot with your emojis as reactions. Try reacting to one! You should receive the corresponding role.
5. Go to [commands](#other-commands) to view other commands.

## Other Commands

 - `/greeting`: Prints "Hello!".
 - `/guildid`: Prints the Server's unique ID. Useful for bug reports.
 - `/relisten [messageID]`: Attempts to reapply event listeners to a message. The first argument is the message ID, which you can get by clicking the three dots after hovering a message and clicking "Copy Message ID"

## Contributions

Contributions to this project are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
