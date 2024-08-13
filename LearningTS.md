# Learning TypeScript with Lite-Mapper

This document aims to provide an introduction to basic synta and features of TypeScript for first-time coders who just want to make cool maps in Beat Saber.

## Prerequisites

You will need a functional computer, this guide has instructions specifically for windows devices, but macs will work too.

A basic knowledge of using a computer is also required, you be able to navigate directories, make and delete files etc.

## Basic Installation

### Visual Studio Code

To begin, you will need to install an IDE. IDEs are software designed to make writing code easier, _technically_ you can use any text-editor software that can write raw text files. However, IDEs make this much easier with code formatting, syntax highlighting and much more.

The IDE that we will use for this guide is [VSCode](https://code.visualstudio.com/).

Follow the link above to go to the main page for Visual Studio Code.

**Important**: Do not confuse Visual Studio Code (free software), with Visual Studio (paid software). Visual Studio Code has a blue icon and Visual Studio has a purple icon.

Download VSCode and go through the installation process. In the VSCode installer, make sure both of the "Add Open With Code" boxes are ticked. These features will come in handy later.

Next, you will need a working directory to make some scripts from. Right now we will just start with a random folder, however later on when we are using Lite-Mapper, you will need to use your Beat Saber WIP map folder.

For now, just create a folder somehwere and name it something like "TypeScript practice".
You can now open the folder, then right click the space in file explorer and click "Open With Code".

When VSCode opens up the folder, it might ask "Do you trust the authors of this folder?", make sure you click yes.

**Note** You don't need to click the box about trusting the parent folder, we only care about the working folder.

### VSCode Extension

Now that we have VSCode running in the practice folder, we need the Deno extension to enable proper syntax highlighting and linting for TypeScript.

Go to the extensions tab on the left, it looks like four squares with the top right one disconnected from the rest.

Here, you can search for the "Deno" extension for VSCode.

Now open up the command palette with `ctrl + shift + P` and type `Deno: Initialize Workspace Configuration` and press yes to everything that pops up.

### (Optional) Denon

Another thing to install that is optional, but highly recommended is [Denon](https://deno.land/x/denon).
Denon will run your script automatically every time you save the script file.

To install denon, open up a terminal in VSCode using `` ctrl + `  `` and type `deno install -qAf --unstable https://deno.land/x/denon/denon.ts`.

We will go into using Denon more later.

## Hello World

Time for your first script, the standard first script for programming is a Hello World script.
This is to test that the coding environment is working and build on to more advanced scripts.

On the left of VSCode, go to the explorer tab (it hould be at the top).
Then in the explorer tab, double click and type `helloWorld.ts` which will create the file for your script.

With this script, we want to log the message `"Hello World"` to the console.
To do this, we need to call the `console` object.
Start typing the word `console` and when it appears at the top of the pop-up menu (usually after the first s), press `tab`.

Then press `.` and the pop-up menu shold come back. This menu is very useful as it shows autocomplete suggestions for your code which can be very helpful.
Use the down arrow to navigate down to the option that says `log`, or you can start typing the word `log` and it will go to the top of the pop-up menu, press `tab` when `log` is highlighted in this menu.

Then, you will need a set of brackets, and the message that you want to log.
Resulting in this:

```js
console.log("Hello World");
```

To run your code, open the terminal up again with `` ctrl + ` `` and type `deno run helloWorld.ts`.
Or if you have Denon installed,
