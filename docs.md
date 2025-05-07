# Documentation

Welcome to the Lite-Mapper documentation!
This document covers most of the main aspects of Lite-Mapper, but is not a complete list.

Lite-Mapper is made to follow a very similar syntax to [ReMapper](https://github.com/Swifter1243/ReMapper) with some minor differences.
It aims to be a more "barebones" alternative to ReMapper that works very closely to the raw JSON form of maps.

If you are looking for a more feature rich alternative to Lite-Mapper, then look into learning [ReMapper](https://github.com/Swifter1243/ReMapper).

Otherwise, welcome to Lite-Mapper!

## Pull Requests / Updates

If you see an issue with Lite-Mapper, or would like to add a feature to the library, then feel free to create a pull request. Lite-Mapper is currently only maintained by Aurellis (me), so there may be a bit of a delay before pull requests get merged. But 99/100 times it will be approved.

## Getting Started

It is highly recommended to use [Visual Studio Code](https://code.visualstudio.com/) (VSCode) when using Lite-Mapper, all the documentation and usage has been built around it.

Lite-Mapper runs on [Deno](https://deno.com/), so you will need to download it to run Lite-Mapper. You will also need the Deno extension for VSCode to properly utilise the features of Deno.

To start using Lite-Mapper, open a terminal somewhere (the location doesn't matter as you are simply getting the Lite-Mapper setup file). You can do this in VSCode by going to the top toolbar of the VSCode window and going to `Terminal > New Terminal`, or open powershell on windows, or bash on linux etc.

Then in this terminal, run:

```bash
deno install -f -g -n lm-init --allow-all -r https://raw.githubusercontent.com/Aureliona1/Lite-Mapper/refs/heads/main/cli.ts
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

## Using Lite-Mapper

Lite-Mapper is made with [TypeScript](https://www.typescriptlang.org/), so if you don't know how to code in TypeScript (or even JavaScript), then it is a very good idea to get a grasp of the basics. Some useful places to look for learning TypeScipt and JavaScript are:

-   [W3Schools JS](https://www.w3schools.com/js/default.asp)
-   [TypeScript Docs](https://www.typescriptlang.org/docs/)
-   [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting)
-   [Code Academy](https://www.codecademy.com/learn/learn-typescript)

Most of Lite-Mapper's code has extensive JSDoc comments to help self-document the code as you write it.
This will appear automatically as you type out functions, classes, and variables in VSCode.

Additionally, if you want to view the source code or internal functionality of anything, you can type it out in your script, then hold `ctrl` and click on the item. You can also press `F12` with your text-cursor on the iterm to view some source information about it.

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

### Environment / Geometry

Lite-Mapper has a class for creating environment and geometry objects.

Similar to other objects, you need to initialize the environment first.

```js
const env = new Environment();
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
new Material().BTSPillar().push("black");
```

Which is the same as.

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

Lite-Mapper has an inbuilt material optimizer that runs automatically when you save the map. This optimizer changes the names of affected materials.
To disable this, change the value in `map.optimize.materials` to `false`.

```js
map.optimize.materials = false;
```

However, this optimizer is incredibly valuable to speed up the performance of your map in-game, in most cases this setting should remain on.

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

### Lights / Events

Lite-Mapper has several features to assist with lighting your map. Generally, it is recommended to light your map with a mapping software of your choice. However, not all effects are realistic to create in these programs.

To create a basic lighting event, like most other features of Lite-Mapper, the event will need to be initialised. This can be done like so:

```js
const event = new LightEvent();
```

The `LightEvent` class has several methods to make events easier to create in a single line without needing to declare a variable.

The most effective way of creating quick events in a single line looks something like this.

```js
new LightEvent(5).setType("BackLasers").setValue("On").setColor([1, 0, 0, 1]).push();
```

This will create an event at beat 5 that affects the back lasers (this is the same as type = 0), it will turn the lights on with a red color.

#### Light Keyframes

Lite-Mapper has another class to create lighting events with an alternative syntax.
`LightKeyframe` uses a keyframe-style animation to animate the color of a light over a set period of time.

Like a regular event, you will need to initialise the class first, like so:

```js
new LightKeyframe();
```

This class can also be run in a single line, like so:

```js
new LightKeyframe(5, 0, "BackLasers").addFrames([1, 0, 0, 1, 0]).push();
```

This will do exactly the same thing as the event example from the previous section.

Expanding on this, you can add any sort of color animation you want.

```js
new LightKeyframe(0, 12, "BackLasers").addFrames([1, 0, 0, 1, 0], [0, 1, 0, 1, 0.5, "easeLinear", "HSV"], [0, 0, 1, 1, 1, "easeLinear", "HSV"]).push();
```

This will animate the "Back Laser" lights to go from red to green to blue from beat 0 to 12.

## Minor Features

Lite-Mapper also has a bunch of minor features to assist in the creation of maps, these features help to simplify common processes in mapping and scripting.

### Arrays

Lite-Mapper has a class to help with operations on arrays of numbers. The class has methods to automate large processes on arrays.

For example, you can add two vectors like so:

```js
const sum = ArrOp.add([1, 2, 3], [4, 5, 6]);
```

Or find the average of all the numbers in an array.

```js
const avg = new ArrOp([1, 2, 3, 4, 3, 2, 1]).mean;
```

### Constants

Lite-Mapper has a number of constant values that may be used when mapping.

#### Material Presets

Ported from [Shonshyn's mapping tools repo](https://github.com/Shonshyn/BS-Tools-for-Mappers), the `MaterialPresets` constant has several pre-made materials that you can directly add to any geometry object in your map.

```js
new Material().import(MaterialPresets.Glass).push("Glass");
```

You can also modify any properties about the materials before adding them to your map.

```js
const mat = new Material().import(MaterialPresets.Glass);
mat.color = [1, 0, 0];
mat.push("Glass");
```

#### Environment Params

The `ENV_PARAM` constant has several preset ids and lookups for commonly used environment objects in Beat Saber.

```js
const env = new Environment().env(...ENV_PARAM.BTS.SOLID_LASER);
```

### Optimizers

Lite-Mapper has a few built-in functions for optimizing certain aspects of your map. These optimizers can have massive performance improvements for your map ingame. However, they can also affect the runtime of your map script.

#### Material Optimizer

By default, your materials will be optimized by Lite-Mapper, this means that names of materials will change slightly if optimizations can be made. To turn this off, simply change:

```js
map.optimize.materials = false;
```

#### Geo Track Stack

A geometry track stack is an optimized way of creating and reusing geometry objects in your map. This is more of an advanced feature, however it can be very powerful for maps that would typically require a lot of geometry objects.

To use a track stack, you must first initialize the stack.

```js
const stack = new GeoTrackStack(new Environment().geo("Cube", { shader: "BTSPillar" }), "cube");
```

This will create a stack that uses geometry cubes.

Now, whenever you need some cubes, you can request a certain number of cubes for a certain amount of time and the stack will create the minimum possible amount of cubes.

For example:

```js
stack.request(10, [0, 8]).forEach((track, i) => {
	const anim = new AnimateTrack(track, 0, 8);
	anim.animate.position = [0, 0, i];
	anim.animate.rotation = [0, 0, i * 36];
	anim.animate.scale = [1, 1, 1];
	anim.push();
});
```

This will create 10 cubes that will be used from beat 0 to beat 8. You can then animate the cubes that are available during this time. These 10 cubes can then be reused later when they are needed.

For example:

```js
stack.request(15, [16, 32]).forEach((track, i) => {
	const anim = new AnimateTrack(track, 16, 16);
	anim.animate.position = [0, i, i];
	anim.animate.rotation = [0, 0, 0];
	anim.animate.scale = [1, 1, 1];
	anim.push();
});
```

This will now create an extra 5 cubes, and reuse the old 10 cubes from before. Keep in mind that rotation and scale need to be reset to `[0, 0, 0]` and `[1, 1, 1]` respectively as the cubes might have different rotations or scales from being used elsewhere.

Finally, once you are done requesting cubes from the stack. You need to run.

```js
stack.push();
```

The `push()` method also has an option to merge all the animations from the requests that were made earlier. This will only work if the animations are either a set of keyframes (e.g., [[1,2,3,0],[4,5,6,1]]), or static vectors (e.g., [1,2,3]). This will not work if you used modifier animations.
