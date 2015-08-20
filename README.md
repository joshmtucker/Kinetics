# Kinetics
Easily test spring animations on any layer in your Framer Studio project. Created by Joshua Tucker and Richard Burton.

## How to include in your project
Download Kinetics.framer, navigate to /modules and add Kinetics.coffee to the /modules folder of your project.

In your Framer project, put this line at the very top.

```coffeescript
{Kinetics} = require "Kinetics"
```

## How to use
It's easy! On any layer in your Framer project, option + click it to show the Kinetics window.

Add properties you want to animate by typing them into the input field like so:

```coffeescript
x: 200, y: 300, scale: .5
```

After adding your properties, hit the return key to submit.

Each time you change a value, the animation restarts. Clicking on any knob also starts the animation using the curve values you have set.

## Future
We are pushing towards adding more types of curves (i.e. bezier) and really optimizing every bit of this experience. We are aware there are many aspects to improve on, but you gotta start somewhere right? :) 

We'll need your help to squash every bug, fix every minor issue, and tweak the experience to make it as effective as possible. Let us know if you encounter any problems or have suggestions for improvement.




