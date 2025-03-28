# Lite-Mapper

![image](images/banner1.png "This image was actually made with ReMapper lol")
Lite-Mapper is a lightweight library to aid in the creation of V3 Beat Saber maps. Lite-Mapper provides basic support for the creation of various objects for Beat Saber maps. This includes modded elements for [Chroma and Noodle Extensions](https://github.com/Aeroluna/Heck).

## How to use it

It is highly recommended to use [Visual Studio Code](https://code.visualstudio.com/) (VSCode) when using Lite-Mapper, all the documentation and usage has been built around it.

Lite-Mapper runs on [Deno](https://deno.com/), so you will need to download it to run Lite-Mapper. You will also need the Deno extension for VSCode to properly utilise the features of Deno.

To start using Lite-Mapper, open a terminal somewhere (the location doesn't matter as you are simply getting the Lite-Mapper setup file). You can do this in VSCode by going to the top toolbar of the VSCode window and going to `Terminal > New Terminal`, or open powershell on windows, or bash on linux etc.

Then in this terminal, run:

```bash
deno install -f -g -n lm-init --allow-all -r https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/refs/heads/main/setup.ts
```

You only need to do this once, this simply downloads the install script that you can now reuse for every map that you make.

Next, you will need to open VSCode in your map folder if you haven't already. To do this, open the command palette with `Ctrl + Shift + P`, or `Cmd + Shift + P` on mac and type `File: Open Folder`. From here, navigate to your map folder and press Open.

With the folder now open, you can run the install script to generate the required files for mapping. Open a terminal, or use the already open one if you still have it. Then run the command:

```bash
lm-init -denon
```

This will create your `script.ts` and `scripts.json` file. Open up the `script.ts` file. Open the command palette with `Ctrl + Shift + P`, or `Cmd + Shift + P` on mac, and type `Deno: Initialize Workspace Configuration` and press yes for anything that it asks.

It is highly recommended to use [denon](https://deno.land/x/denon) to automatically re-run your script when you save. To run Lite-Mapper with denon, in the terminal, run:

```bash
denon lm
```

Or without denon, run:

```bash
deno run --allow-all script.ts
```

## Documentation

To read about what kind of things to put in your script.ts, head over to the [docs](docs.md) page.
