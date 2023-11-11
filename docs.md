# Documentation

Welcome to the Lite-Mapper documentation!
This document covers most of the main aspects of Lite-Mapper, but is not a complete list.

Lite-Mapper is made to follow a very similar syntax to [ReMapper](https://github.com/Swifter1243/ReMapper) with some minor differences.
It aims to be a more "barebones" alternative to ReMapper that works very closely to the raw JSON form of maps.

If you are looking for a more feature rich alternative to Lite-Mapper, then look into learning [ReMapper](https://github.com/Swifter1243/ReMapper).

Otherwise, welcome to Lite-Mapper!

## Pull Requests / Updates

If you see an issue with Lite-Mapper, or would like to add a feature to the library, then feel free to create a pull request. Lite-Mapper is currently only maintained by Aurellis (me), so there may be a bit of a delay before pull requests get merged. But 99/100 times it will be approved.

## Installing

Lite-Mapper runs on [Deno](https://deno.com/), so you will need to download it to run Lite-Mapper. You will also need the Deno extension for VSCode to properly utilise the features of Deno.

To use Lite-Mapper, download the `Lite-Mapper.zip` folder in the [latest release](https://github.com/Aureliona1/Lite-Mapper/releases/latest), then extract the zip into your map folder. From there, simply open the folder in VSCode (or your favourite code editor) and add some stuff to `script.ts`.
Then, open the command palette with `Ctrl + Shift + P`, or `Cmd + Shift + P` on mac, and type `Deno: Initialize Workspace Configuration` and press yes for anything that it asks.

To run Lite-Mapper, simply open the `run.bat` file and let it do its thing. `run.bat` relies on [denon](https://github.com/denosaurs/denon#denoland), so you will need to install this to use `run.bat`.

**Important**
For mac and ChromeBook users, `run.bat` probably won't work. In this case, open a new terminal (for VSCode, go `Terminal > New Terminal`), then type `deno run --allow-all script.ts`.

Many of Lite-Mapper's features are made for the Heck mods for Beat Saber (Noodle Extensions and Chroma).
For a better understanding of how properties and objects work, read the [Heck](https://github.com/Aeroluna/Heck/wiki) documentation.

## Using Lite-Mapper

### Map Initialization

Before adding anything to your script, you will need to initialize your map.
This essentially tells the code what map file to make changes to.

In the default template `script.ts`, there is a basic initialization line.

```js
const map = new BeatMap("ExpertStandard", "ExpertPlusStandard");
```

The first difficulty is the `input` difficulty, this is where you add all your notes and walls and stuff.
The second one is the `output` difficulty. This should be empty as it will be overwritten by Lite-Mapper.

### Notes / Bombs / Walls

Notes, bombs, and walls all have similar syntaxes.
First you need to initialize the object.

```js
const note = new Note();
```

From there, you can add and modify properties on the note.

```js
note.color = [1, 0, 0, 1];
```

Then once you have made all the changes you would like, you can push the note to the active difficulty.

```js
note.push();
```

Due to the way that Lite-Mapper handles objects, you will need to re-initialize the object every time you want to make changes.
So, this will work:

```js
repeat(10, i => {
	const note = new Note();
	note.time = i;
	note.push();
});
```

But this will not:

```js
const note = new Note();
repeat(10, i => {
	note.time = i;
	note.push();
});
// Every note will have the same time value.
```

### Environment / Geometry

Lite-Mapper has a class for creating environment and geometry objects.

Similar to other objects, you need to initialize the environment first.

```js
const env = new Environment().env();
```

Then you can make changes to the object, `Environment()` has methods for specifically creating an environment object or a geometry object.

```js
env.geo("Cube", { shader: "Standard" });
env.position = [0, 10, 0];
```

`.geo()` will make the environment into a geometry object, `.env()` will make it an environment object.

**Warning:** Never mix `.env()` and `.geo()` as it will not work.

Like other objects, you will have to push the environment to add it to your map.

```js
env.push();
```

#### Geometry Materials

Geometry objects need to have a material, but adding the raw JSON of the material to each object is incredibly performance intensive for Beat Saber.
Ideally, you should create a single material for every object that has the same material.

To do this, you can either manually add the JSON to your map.
Like so:

```js
map.materials["Mat"] = { shader: "BTSPillar" };
```

Then you can reference the material name in the geometry objects.

```js
new Environment().geo("Cube", "Mat").push();
```

You can also use the `Material()` class to create a material, this class also has auto-fill for some shader keywords.

```js
map.materials["Mat"] = new Material().BTSPillar();
```

### Custom Events

There are several types of custom event supported by Heck.

They include:

-   `AnimateTrack`
-   `AnimateComponent`
-   `AssignPathAnimation`
-   `AssignTrackParent`
-   `AssignPlayerToTrack`

Each custom event has its own class to keep the different properties separate.

Like all other objects in Lite-Mapper, you need to initialize the object first.

```js
const anim = new AnimateTrack("cool track", 0, 16);
```

Then you can edit the event.

```js
anim.animate.position = [
	[0, 10, 0, 0],
	[0, 0, 0, 1]
	// etc...
];
```

Then push the animation to your map.

```js
anim.push();
```

### Note Mods / Modifying existing objects

Lite-Mapper includes several functions to filter through existing objects in your map and make changes.

Each function starts with the word `filter` followed by whatever type of object it targets.

A simple application of this would be to make changes to notes you have already placed in your map.

For example:

```js
filterNotes(
	false,
	x => x.time >= 0 && x.time < 10,
	x => {
		x.color = [1, 1, 1, 1];
	}
);
```

The above code will search through all notes (excluding fake notes) for any between beat 0 and beat 10.
It will then make the filtered notes white.
