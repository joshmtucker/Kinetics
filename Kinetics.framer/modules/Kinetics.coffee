# Insert Google Roboto font
Utils.insertCSS("@import url(https://fonts.googleapis.com/css?family=Roboto+Mono);")

### VARIABLES ###

$ = 
	KINETICS: {}
	DEVICE: Framer.Device.phone
	BUTTONS: {}
	TEXT: {}
	SLIDERS: {knob:{knobSize: 28, backgroundColor: "#E0E0E0"}, fill:{backgroundColor: "#E0E0E0"}}
	LABELS: {}
	STYLE: {sliderLabels:{"vertical-align": "center", "display": "table-cell", "font": "normal 100 26px Roboto Mono"}}
	ANIMATE: {}

$.KINETICS.props = 
	midX: $.DEVICE.width/2 
	midY: $.DEVICE.height/2 
	width: (700 * $.DEVICE.scale) + (700 * (1-$.DEVICE.scale))
	height: (400 * $.DEVICE.scale) + (400 * (1-$.DEVICE.scale))
	scale: .5
	options: 0
	backgroundColor: "#151517"
	superLayer: $.DEVICE
	targetLayer: {}

$.KINETICS.open = 
	layer: null
	properties: {scale: 1, opacity: 1}
	curve: "spring(245, 40, 0)"
	curveOptions: {}
	time: 1
	delay: 0
	repeat: 0
	debug: false

$.KINETICS.close = 
	layer: null
	properties: {scale: .5, opacity: 0}
	curve: "spring(345, 40, 0)"
	curveOptions: {}
	time: 1
	delay: 0
	repeat: 0
	debug: false

# ––– BUTTONS
$.BUTTONS.closeButton = {maxX: $.KINETICS.props.width - 28, y: 28, width: 24, height: 24, backgroundColor: "transparent"}
$.BUTTONS.closeButtonXL = {midX: $.BUTTONS.closeButton.width/2, midY: $.BUTTONS.closeButton.height/2, width: 24, height: 4, rotation: 45, borderRadius: 18, backgroundColor: "#E0E0E0"}
$.BUTTONS.closeButtonXR = {midX: $.BUTTONS.closeButton.width/2, midY: $.BUTTONS.closeButton.height/2, width: 24, height: 4, rotation: -45, borderRadius: 18, backgroundColor: "#E0E0E0"}

# ––– TEXT
$.TEXT.animateProps = 
	midX: $.KINETICS.props.width/2
	width: $.KINETICS.props.width - 160
	height: 80
	backgroundColor: "transparent"
	name: "AnimateProps"
	ignoreEvents: false
	propagateEvents: false

$.TEXT.curveProps = 
	midX: $.KINETICS.props.width/2
	maxY: $.KINETICS.props.height-20
	width: $.KINETICS.props.width/1.5
	name: "CurveProps"
	height: 40
	backgroundColor: "transparent"

# ––– SLIDERS
$.SLIDERS.tension = 
	x: 200
	y: 107
	width: 460
	height: 10
	backgroundColor: "#3A3A40"
	name: "TensionSlider"
	min: 0
	max: 1000
	value: 250

$.SLIDERS.friction = 
	x: 200
	y: 161
	width: 460
	height: 10
	backgroundColor: "#3A3A40"
	name: "FrictionSlider"
	min: 0
	max: 100
	value: 45

$.SLIDERS.velocity = 
	x: 200
	y: 215
	width: 460
	height: 10
	backgroundColor: "#3A3A40"
	name: "VelocitySlider"
	min: 0
	max: 10
	value: 0

$.SLIDERS.tolerance = 
	x: 200
	y: 269
	width: 460
	height: 10
	backgroundColor: "#3A3A40"
	name: "ToleranceSlider"
	min: 0.001
	max: 1
	value: 0.001

# ––– LABELS
$.LABELS.tension = 
	x: 20
	y: 92
	width: 110
	height: 34
	backgroundColor: "transparent"
	name: "TensionLabel"

$.LABELS.friction = 
	x: 20
	y: 146
	width: 125
	height: 34
	backgroundColor: "transparent"
	name: "FrictionLabel"

$.LABELS.velocity = 
	x: 20
	y: 200
	width: 125
	height: 34
	backgroundColor: "transparent"
	name: "VelocityLabel"

$.LABELS.tolerance = 
	x: 20
	y: 254
	width: 141
	height: 34
	backgroundColor: "transparent"
	name: "ToleranceLabel"

# ––– ANIMATE
$.ANIMATE.options =
	layer: null
	properties: {}
	curve: "spring(250, 45, 0, .001"
	curveOptions: {}
	time: 1
	delay: 0
	repeat: 0
	debug: false

# Disable clip on device
Framer.Device.phone.clip = false

Framer.CurrentContext.on "layer:create", (layer) ->
	layer.on Events.Click, (e, layer) ->
		# Only on an alt(option) + click
		if e.altKey and layer instanceof Kinetics is false and layer.superLayer isnt $.KINETICS.layer

			# Destroy if layer already exists
			if $.KINETICS.layer then $.KINETICS.layer.destroy()
			
			# Create Kinetics layer
			$.KINETICS.targetLayer = layer
			$.KINETICS.targetLayerOrigin = layer.props
			new Kinetics $.KINETICS.props

			###

			TODO: Is there a way to remove mouseevent listeners on layers so there's no conflict?

			###

			# Show Kinetics window
			$.KINETICS.layer.animate $.KINETICS.open

class Kinetics extends Layer
	constructor: (options={}) ->
		super options

		# Reference Kinetics
		$.KINETICS.layer = @

		@draggable.enabled = true
		@draggable.momentum = false

		# Add close button
		$.BUTTONS.closeButton.superLayer = @
		@closeButton = new Layer $.BUTTONS.closeButton
			
		$.BUTTONS.closeButtonXL.superLayer = @closeButton
		$.BUTTONS.closeButtonXR.superLayer = @closeButton
		@closeButtonXL = new Layer $.BUTTONS.closeButtonXL
		@closeButtonXR = new Layer $.BUTTONS.closeButtonXR

		# ––– EVENTS
		# Adjust size of Kinetics window with option + plus or option + minus
		keys = []
		document.onkeydown = document.onkeyup = (e) ->
			keys[e.keyCode] = e.type == "keydown"

			# 18 = Option key
			# 187 = + key
			# 189 = - key

			# Scale up
			if keys[18] and keys[187]
				$.KINETICS.layer.animatePropsInput.blur()
				$.KINETICS.layer.animate
					properties:
						scale: $.KINETICS.layer.scale + .25
					curve: "spring(345, 40, 0)"
			else if keys[18] and keys[189]
				$.KINETICS.layer.animatePropsInput.blur()
				$.KINETICS.layer.animate
					properties:
						scale: $.KINETICS.layer.scale - .25
					curve: "spring(345, 40, 0)"
				$.KINETICS.layer.scale = .25 if $.KINETICS.layer.scale < .25

		@closeButton.on Events.Click, ->
			$.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin

			$.KINETICS.layer.animate $.KINETICS.close

			Utils.delay .5, ->
				$.KINETICS.layer.destroy()

		@setupText()
		@setupSliders()

	setupText: ->
		# Setup superLayer
		for text of $.TEXT when text isnt "input"
			$.TEXT["#{text}"].superLayer = $.KINETICS.layer

		# ––– ANIMATE PROPERTIES
		@animateProps = new Layer $.TEXT.animateProps

		@animatePropsInput = document.createElement("input")
		@animatePropsInput.style["width"] = "#{@animateProps.width}px"
		@animatePropsInput.style["height"] = "#{@animateProps.height}px"
		@animatePropsInput.style["font"] = "normal 400 26px Roboto Mono"
		@animatePropsInput.style["text-align"] = "center"
		@animatePropsInput.style["font-size"] = "26px"
		@animatePropsInput.style["color"] = "white"
		@animatePropsInput.style["-wekit-user-select"] = "text"
		@animatePropsInput.style["background-color"] = "#{$.KINETICS.layer.backgroundColor}"
		@animatePropsInput.placeholder = "Add animation properties"

		@animateProps._element.appendChild(@animatePropsInput)

		# ––– CURVE PROPERTIES

		###

		TODO: Make curve props an input where you can type in it if you wish (adjusts knob values)
		BUG (semi): curveProps is editable

		###


		@curveProps = new Layer $.TEXT.curveProps

		@curvePropsText = document.createElement("textarea")
		@curvePropsText.style["width"] = "#{@curveProps.width}px"
		@curvePropsText.style["height"] = "#{@curveProps.height}px"
		@curvePropsText.style["text-align"] = "center"
		@curvePropsText.style["line-height"] = "34px"
		@curvePropsText.style["color"] = "#A0E35F"
		@curvePropsText.style["font"] = "400 28px Roboto Mono"
		@curvePropsText.style["background-color"] = "transparent"
		@curvePropsText.style["border"] = "none"
		@curvePropsText.style["resize"] = "none"

		@curvePropsText.value = "\"#{$.ANIMATE.options.curve}\""

		@curveProps._element.appendChild(@curvePropsText)


		# ––– EVENTS
		# Select input
		@animatePropsInput.onclick = ->
			@focus()
			@placeholder = " "

		# Replace placeholder
		@animatePropsInput.onblur = ->
			@placeholder = "Add animation properties"

		# Submitting animation properties
		@animatePropsInput.onkeyup = (e) ->
			if e.keyCode is 13
				$.KINETICS.layer.animatePropsInput.blur()
				$.KINETICS.layer.animatePropsInput.placeholder = "Add animation properties"

				if $.KINETICS.layer.animatePropsInput.value isnt ""

					regex = /(\S*\w)/g

					options = $.KINETICS.layer.animatePropsInput.value.match(regex)

					for option in options
						index = _.indexOf(options, option)
						if index % 2 is 0
							$.ANIMATE.options.properties["#{option}"] = options[index+1]

					$.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin

		# Select curve value
		@curvePropsText.onclick = ->
			@select()

	setupSliders: ->
		# Set superLayer for sliders
		for slider of $.SLIDERS when slider isnt "knob"
			$.SLIDERS["#{slider}"].superLayer = $.KINETICS.layer

		# Set superLayer for labels
		for label of $.LABELS
			$.LABELS["#{label}"].superLayer = $.KINETICS.layer

		# ––– TENSION
		@tension = new SliderComponent $.SLIDERS.tension
		@tension.knobSize = $.SLIDERS.knob.knobSize
		@tension.knob.backgroundColor = $.SLIDERS.knob.backgroundColor
		@tension.knob.draggable.momentum = false
		@tension.fill.backgroundColor = $.SLIDERS.fill.backgroundColor

		@tensionLabel = new Layer $.LABELS.tension
		@tensionLabel.html = "<div width='@tensionLabel.width' height='@tensionLabel.height'>#{@tensionLabel.name}</div>"

		# ––– FRICTION

		@friction = new SliderComponent $.SLIDERS.friction
		@friction.knobSize = $.SLIDERS.knob.knobSize
		@friction.knob.backgroundColor = $.SLIDERS.knob.backgroundColor
		@friction.knob.draggable.momentum = false
		@friction.fill.backgroundColor = $.SLIDERS.fill.backgroundColor

		@frictionLabel = new Layer $.LABELS.friction
		@frictionLabel.html = "<div width='@frictionLabel.width' height='@frictionLabel.height'>#{@frictionLabel.name}</div>"

		# ––– VELOCITY
		@velocity = new SliderComponent $.SLIDERS.velocity
		@velocity.knobSize = $.SLIDERS.knob.knobSize
		@velocity.knob.backgroundColor = $.SLIDERS.knob.backgroundColor
		@velocity.knob.draggable.momentum = false
		@velocity.fill.backgroundColor = $.SLIDERS.fill.backgroundColor

		@velocityLabel = new Layer $.LABELS.velocity
		@velocityLabel.html = "<div width='@velocityLabel.width' height='@velocityLabel.height'>#{@velocityLabel.name}</div>"

		# ––– TOLERANCE
		@tolerance = new SliderComponent $.SLIDERS.tolerance
		@tolerance.knobSize = $.SLIDERS.knob.knobSize
		@tolerance.knob.backgroundColor = $.SLIDERS.knob.backgroundColor
		@tolerance.knob.draggable.momentum = false
		@tolerance.fill.backgroundColor = $.SLIDERS.fill.backgroundColor

		@toleranceLabel = new Layer $.LABELS.tolerance
		@toleranceLabel.html = "<div width='@toleranceLabel.width' height='@toleranceLabel.height'>#{@toleranceLabel.name}</div>"

		# Set style for all the labels
		for slider in $.KINETICS.layer.subLayers when slider.constructor.name is "Layer"
			for style of $.STYLE.sliderLabels 
				slider._element.style["#{style}"] = $.STYLE.sliderLabels["#{style}"]

		# ––– EVENTS
		for slider in @subLayers when slider instanceof SliderComponent is true
			slider.on "change:value", ->
				$.ANIMATE.options.curve = "spring(#{Math.round($.KINETICS.layer.tension.value)}, #{Math.round($.KINETICS.layer.friction.value)}, #{Math.round($.KINETICS.layer.velocity.value)}, #{Math.round($.KINETICS.layer.tolerance.value * 1000)/1000})"
				$.KINETICS.layer.curvePropsText.value = "\"#{$.ANIMATE.options.curve}\""

			slider.knob.on Events.DragEnd, ->
				$.KINETICS.layer.animateTarget()

	animateTarget: ->
		$.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin
		$.KINETICS.targetLayer.animate $.ANIMATE.options

