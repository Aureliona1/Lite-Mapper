# Lite-Mapper

![image](images/banner1.png "This image was actually made with ReMapper lol")
Lite-Mapper is a lightweight library to aid in the creation of V3 Beat Saber maps. Lite-Mapper provides basic support for the creation of various objects for Beat Saber maps. This includes modded elements for [Chroma and Noodle Extensions](https://github.com/Aeroluna/Heck).

## How to use it

Lite-Mapper runs on [Deno](https://deno.com/), so you will need to download it to run Lite-Mapper. You will also need the Deno extension for VSCode to properly utilise the features of Deno.

To use Lite-Mapper, download the `Lite-Mapper.zip` folder in the [latest release](https://github.com/Aureliona1/Lite-Mapper/releases/latest), then extract the zip into your map folder. From there, simply open the folder in VSCode (or your favourite code editor) and add some stuff to `script.ts`.
Then, open the command palette with `Ctrl + Shift + P`, or `Cmd + Shift + P` on mac, and type `Deno: Initialize Workspace Configuration` and press yes for anything that it asks.

To run Lite-Mapper, open up any terminal (powershell, bash, cmd etc.) of your choice, or use the VSCode inbuilt terminal by clicking `Terminal` at the top of the window and choosing `New Terminal`.

It is highly recommended to use [denon](https://deno.land/x/denon) to automatically re-run your script when you save.

If the terminal is not open to your map folder, use `cd` to navigate to the folder. Then, if you are using denon, run:

```bash
denon lm
```

Or without denon, run:

```bash
deno run --allow-all script.ts
```

## Documentation

To read about what kind of things to put in your script.ts, head over to the [docs](docs.md) page.
