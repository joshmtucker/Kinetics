# Kinetics
Test spring animations on any layer in your Framer Studio project without having to reload. Created with [Richard Burton](https://twitter.com/ricburton "Richard Burton").

## How to use
Add *Kinetics.coffee* to the */modules/* folder of your Framer project.

Reference the module inside your Framer project.

```coffeescript
{Kinetics} = require "Kinetics"
```

### Controls
Open Kinetics Window – ⌥ + Click (Option key + Mouse click)

Zoom In on Kinetics Window – ⌥+ (Option key + Plus key)

Zoom Out on Kinetics Window – ⌥- (Option key + Minus key)

Move – Click + drag

### Properties

Add properties you want to animate by typing them into the input field as shown above. After adding your properties, hit the enter (return) key to submit.

Each time you change the properties inside the input field, the layer will return to its starting position.

#### Notes
* The starting position of the layer (and all of its properties) are captured when the Kinetics window is opened.
* Opening the Kinetics window may conflict with events in your project. Unfortunately, unavoidable. I am open to suggestions on a different shortcut to open the Kinetics window that wouldn't conflict
* If the layer changes because of some event triggered while opening the Kinetics window, the layer's position and properties will be reset when you submit inside the input field

### Animate!

Once you have submitted your properties, change the sliders to test out the animation on the layer. Each time you change a value, the animation restarts. Clicking on any knob also starts the animation using the curve values you have set.

#### Paste curve into your project
The curve is a selectable string. Click it to select it, copy, and paste it directly into your code editor.

## Upcoming

We are pushing towards adding more types of curves (i.e. bezier) and really optimizing every bit of this experience. We are aware there are many aspects to improve on, but you gotta start somewhere right? :) 

We'll need your help to squash every bug, fix every minor issue, and tweak the experience to make it as effective as possible. Let us know if you encounter any problems or have suggestions for improvement.




