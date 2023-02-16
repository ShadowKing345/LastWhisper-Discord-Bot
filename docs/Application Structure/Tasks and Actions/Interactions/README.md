# Interactions

Probably the most complex event in Discord's API.
An interaction can range from a user calling a slash command, a button press, a drop-down menu interaction, and the
response to a modal.

As a result of all this added "features" the interaction function is probably one of the most complex functions in the
entire application as it needs to keep filtering out what an interaction event object is until it can invoke the correct
method.

Read more about each type of interaction below:

- [Slash Commands](docs/Application%20Structure/Tasks%20and%20Actions/Interactions/Slash%20Commands.md)
- [Buttons](docs/Application%20Structure/Tasks%20and%20Actions/Interactions/Buttons.md)
- [Down-Down Menus](docs/Application%20Structure/Tasks%20and%20Actions/Interactions/Drop-Down%20Menu.md)
- [Modal Responses](docs/Application%20Structure/Tasks%20and%20Actions/Interactions/Modal%20Responses.md)