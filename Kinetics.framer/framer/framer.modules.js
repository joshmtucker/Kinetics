require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Kinetics":[function(require,module,exports){
var $, Kinetics,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Utils.insertCSS("@import url(//fonts.googleapis.com/css?family=Roboto+Mono");


/* VARIABLES */

$ = {
  KINETICS: {},
  DEVICE: Framer.Device.phone,
  BUTTONS: {},
  TEXT: {},
  SLIDERS: {
    knob: {
      knobSize: 28,
      backgroundColor: "#E0E0E0"
    },
    fill: {
      backgroundColor: "#E0E0E0"
    }
  },
  LABELS: {},
  STYLE: {
    sliderLabels: {
      "vertical-align": "center",
      "display": "table-cell",
      "font": "normal 100 26px Roboto Mono"
    }
  },
  ANIMATE: {}
};

$.KINETICS.props = {
  midX: $.DEVICE.width / 2,
  midY: $.DEVICE.height / 2,
  width: (700 * $.DEVICE.scale) + (700 * (1 - $.DEVICE.scale)),
  height: (400 * $.DEVICE.scale) + (400 * (1 - $.DEVICE.scale)),
  scale: .5,
  options: 0,
  backgroundColor: "#151517",
  superLayer: $.DEVICE,
  targetLayer: {}
};

$.KINETICS.open = {
  layer: null,
  properties: {
    scale: 1,
    opacity: 1
  },
  curve: "spring(245, 40, 0)",
  curveOptions: {},
  time: 1,
  delay: 0,
  repeat: 0,
  debug: false
};

$.KINETICS.close = {
  layer: null,
  properties: {
    scale: .5,
    opacity: 0
  },
  curve: "spring(345, 40, 0)",
  curveOptions: {},
  time: 1,
  delay: 0,
  repeat: 0,
  debug: false
};

$.BUTTONS.closeButton = {
  maxX: $.KINETICS.props.width - 28,
  y: 28,
  width: 24,
  height: 24,
  backgroundColor: "transparent"
};

$.BUTTONS.closeButtonXL = {
  midX: $.BUTTONS.closeButton.width / 2,
  midY: $.BUTTONS.closeButton.height / 2,
  width: 24,
  height: 4,
  rotation: 45,
  borderRadius: 18,
  backgroundColor: "#E0E0E0"
};

$.BUTTONS.closeButtonXR = {
  midX: $.BUTTONS.closeButton.width / 2,
  midY: $.BUTTONS.closeButton.height / 2,
  width: 24,
  height: 4,
  rotation: -45,
  borderRadius: 18,
  backgroundColor: "#E0E0E0"
};

$.TEXT.animateProps = {
  midX: $.KINETICS.props.width / 2,
  width: $.KINETICS.props.width - 160,
  height: 80,
  backgroundColor: "transparent",
  name: "AnimateProps",
  ignoreEvents: false,
  propagateEvents: false
};

$.TEXT.curveProps = {
  midX: $.KINETICS.props.width / 2,
  maxY: $.KINETICS.props.height - 20,
  width: $.KINETICS.props.width / 1.5,
  name: "CurveProps",
  height: 40,
  backgroundColor: "transparent"
};

$.SLIDERS.tension = {
  x: 200,
  y: 107,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "TensionSlider",
  min: 0,
  max: 1000,
  value: 250
};

$.SLIDERS.friction = {
  x: 200,
  y: 161,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "FrictionSlider",
  min: 0,
  max: 100,
  value: 45
};

$.SLIDERS.velocity = {
  x: 200,
  y: 215,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "VelocitySlider",
  min: 0,
  max: 10,
  value: 0
};

$.SLIDERS.tolerance = {
  x: 200,
  y: 269,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "ToleranceSlider",
  min: 0.001,
  max: 1,
  value: 0.001
};

$.LABELS.tension = {
  x: 20,
  y: 92,
  width: 110,
  height: 34,
  backgroundColor: "transparent",
  name: "TensionLabel"
};

$.LABELS.friction = {
  x: 20,
  y: 146,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "FrictionLabel"
};

$.LABELS.velocity = {
  x: 20,
  y: 200,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "VelocityLabel"
};

$.LABELS.tolerance = {
  x: 20,
  y: 254,
  width: 141,
  height: 34,
  backgroundColor: "transparent",
  name: "ToleranceLabel"
};

$.ANIMATE.options = {
  layer: null,
  properties: {},
  curve: "spring(250, 45, 0, .001",
  curveOptions: {},
  time: 1,
  delay: 0,
  repeat: 0,
  debug: false
};

Framer.Device.phone.clip = false;

Framer.CurrentContext.on("layer:create", function(layer) {
  return layer.on(Events.Click, function(e, layer) {
    if (e.altKey && layer instanceof Kinetics === false && layer.superLayer !== $.KINETICS.layer) {
      if ($.KINETICS.layer) {
        $.KINETICS.layer.destroy();
      }
      $.KINETICS.targetLayer = layer;
      $.KINETICS.targetLayerOrigin = layer.props;
      new Kinetics($.KINETICS.props);

      /*
      
      			TODO: Is there a way to remove mouseevent listeners on layers so there's no conflict?
       */
      return $.KINETICS.layer.animate($.KINETICS.open);
    }
  });
});

Kinetics = (function(superClass) {
  extend(Kinetics, superClass);

  function Kinetics(options) {
    var keys;
    if (options == null) {
      options = {};
    }
    Kinetics.__super__.constructor.call(this, options);
    $.KINETICS.layer = this;
    this.draggable.enabled = true;
    this.draggable.momentum = false;
    $.BUTTONS.closeButton.superLayer = this;
    this.closeButton = new Layer($.BUTTONS.closeButton);
    $.BUTTONS.closeButtonXL.superLayer = this.closeButton;
    $.BUTTONS.closeButtonXR.superLayer = this.closeButton;
    this.closeButtonXL = new Layer($.BUTTONS.closeButtonXL);
    this.closeButtonXR = new Layer($.BUTTONS.closeButtonXR);
    keys = [];
    document.onkeydown = document.onkeyup = function(e) {
      keys[e.keyCode] = e.type === "keydown";
      if (keys[18] && keys[187]) {
        $.KINETICS.layer.animatePropsInput.blur();
        return $.KINETICS.layer.animate({
          properties: {
            scale: $.KINETICS.layer.scale + .25
          },
          curve: "spring(345, 40, 0)"
        });
      } else if (keys[18] && keys[189]) {
        $.KINETICS.layer.animatePropsInput.blur();
        $.KINETICS.layer.animate({
          properties: {
            scale: $.KINETICS.layer.scale - .25
          },
          curve: "spring(345, 40, 0)"
        });
        if ($.KINETICS.layer.scale < .25) {
          return $.KINETICS.layer.scale = .25;
        }
      }
    };
    this.closeButton.on(Events.Click, function() {
      $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
      $.KINETICS.layer.animate($.KINETICS.close);
      return Utils.delay(.5, function() {
        return $.KINETICS.layer.destroy();
      });
    });
    this.setupText();
    this.setupSliders();
  }

  Kinetics.prototype.setupText = function() {
    var text;
    for (text in $.TEXT) {
      if (text !== "input") {
        $.TEXT["" + text].superLayer = $.KINETICS.layer;
      }
    }
    this.animateProps = new Layer($.TEXT.animateProps);
    this.animatePropsInput = document.createElement("input");
    this.animatePropsInput.style["width"] = this.animateProps.width + "px";
    this.animatePropsInput.style["height"] = this.animateProps.height + "px";
    this.animatePropsInput.style["font"] = "normal 400 26px Roboto Mono";
    this.animatePropsInput.style["text-align"] = "center";
    this.animatePropsInput.style["font-size"] = "26px";
    this.animatePropsInput.style["color"] = "white";
    this.animatePropsInput.style["-wekit-user-select"] = "text";
    this.animatePropsInput.style["background-color"] = "" + $.KINETICS.layer.backgroundColor;
    this.animatePropsInput.placeholder = "Add animation properties";
    this.animateProps._element.appendChild(this.animatePropsInput);

    /*
    
    		TODO: Make curve props an input where you can type in it if you wish (adjusts knob values)
    		BUG (semi): curveProps is editable
     */
    this.curveProps = new Layer($.TEXT.curveProps);
    this.curvePropsText = document.createElement("textarea");
    this.curvePropsText.style["width"] = this.curveProps.width + "px";
    this.curvePropsText.style["height"] = this.curveProps.height + "px";
    this.curvePropsText.style["text-align"] = "center";
    this.curvePropsText.style["line-height"] = "34px";
    this.curvePropsText.style["color"] = "#A0E35F";
    this.curvePropsText.style["font"] = "400 28px Roboto Mono";
    this.curvePropsText.style["background-color"] = "transparent";
    this.curvePropsText.style["border"] = "none";
    this.curvePropsText.style["resize"] = "none";
    this.curvePropsText.value = "\"" + $.ANIMATE.options.curve + "\"";
    this.curveProps._element.appendChild(this.curvePropsText);
    this.animatePropsInput.onclick = function() {
      this.focus();
      return this.placeholder = " ";
    };
    this.animatePropsInput.onblur = function() {
      return this.placeholder = "Add animation properties";
    };
    this.animatePropsInput.onkeyup = function(e) {
      var i, index, len, option, options, regex;
      if (e.keyCode === 13) {
        $.KINETICS.layer.animatePropsInput.blur();
        $.KINETICS.layer.animatePropsInput.placeholder = "Add animation properties";
        if ($.KINETICS.layer.animatePropsInput.value !== "") {
          regex = /(\S*\w)/g;
          options = $.KINETICS.layer.animatePropsInput.value.match(regex);
          for (i = 0, len = options.length; i < len; i++) {
            option = options[i];
            index = _.indexOf(options, option);
            if (index % 2 === 0) {
              $.ANIMATE.options.properties["" + option] = options[index + 1];
            }
          }
          return $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
        }
      }
    };
    return this.curvePropsText.onclick = function() {
      return this.select();
    };
  };

  Kinetics.prototype.setupSliders = function() {
    var i, j, label, len, len1, ref, ref1, results, slider, style;
    for (slider in $.SLIDERS) {
      if (slider !== "knob") {
        $.SLIDERS["" + slider].superLayer = $.KINETICS.layer;
      }
    }
    for (label in $.LABELS) {
      $.LABELS["" + label].superLayer = $.KINETICS.layer;
    }
    this.tension = new SliderComponent($.SLIDERS.tension);
    this.tension.knobSize = $.SLIDERS.knob.knobSize;
    this.tension.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.tension.knob.draggable.momentum = false;
    this.tension.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.tensionLabel = new Layer($.LABELS.tension);
    this.tensionLabel.html = "<div width='@tensionLabel.width' height='@tensionLabel.height'>" + this.tensionLabel.name + "</div>";
    this.friction = new SliderComponent($.SLIDERS.friction);
    this.friction.knobSize = $.SLIDERS.knob.knobSize;
    this.friction.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.friction.knob.draggable.momentum = false;
    this.friction.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.frictionLabel = new Layer($.LABELS.friction);
    this.frictionLabel.html = "<div width='@frictionLabel.width' height='@frictionLabel.height'>" + this.frictionLabel.name + "</div>";
    this.velocity = new SliderComponent($.SLIDERS.velocity);
    this.velocity.knobSize = $.SLIDERS.knob.knobSize;
    this.velocity.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.velocity.knob.draggable.momentum = false;
    this.velocity.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.velocityLabel = new Layer($.LABELS.velocity);
    this.velocityLabel.html = "<div width='@velocityLabel.width' height='@velocityLabel.height'>" + this.velocityLabel.name + "</div>";
    this.tolerance = new SliderComponent($.SLIDERS.tolerance);
    this.tolerance.knobSize = $.SLIDERS.knob.knobSize;
    this.tolerance.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.tolerance.knob.draggable.momentum = false;
    this.tolerance.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.toleranceLabel = new Layer($.LABELS.tolerance);
    this.toleranceLabel.html = "<div width='@toleranceLabel.width' height='@toleranceLabel.height'>" + this.toleranceLabel.name + "</div>";
    ref = $.KINETICS.layer.subLayers;
    for (i = 0, len = ref.length; i < len; i++) {
      slider = ref[i];
      if (slider.constructor.name === "Layer") {
        for (style in $.STYLE.sliderLabels) {
          slider._element.style["" + style] = $.STYLE.sliderLabels["" + style];
        }
      }
    }
    ref1 = this.subLayers;
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      slider = ref1[j];
      if (!(slider instanceof SliderComponent === true)) {
        continue;
      }
      slider.on("change:value", function() {
        $.ANIMATE.options.curve = "spring(" + (Math.round($.KINETICS.layer.tension.value)) + ", " + (Math.round($.KINETICS.layer.friction.value)) + ", " + (Math.round($.KINETICS.layer.velocity.value)) + ", " + (Math.round($.KINETICS.layer.tolerance.value * 1000) / 1000) + ")";
        return $.KINETICS.layer.curvePropsText.value = "\"" + $.ANIMATE.options.curve + "\"";
      });
      results.push(slider.knob.on(Events.DragEnd, function() {
        return $.KINETICS.layer.animateTarget();
      }));
    }
    return results;
  };

  Kinetics.prototype.animateTarget = function() {
    $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
    return $.KINETICS.targetLayer.animate($.ANIMATE.options);
  };

  return Kinetics;

})(Layer);



},{}],"Kinetics":[function(require,module,exports){
// Generated by CoffeeScript 1.9.1
var $, Kinetics,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Utils.insertCSS("@import url(//fonts.googleapis.com/css?family=Roboto+Mono");


/* VARIABLES */

$ = {
  KINETICS: {},
  DEVICE: Framer.Device.phone,
  BUTTONS: {},
  TEXT: {},
  SLIDERS: {
    knob: {
      knobSize: 28,
      backgroundColor: "#E0E0E0"
    },
    fill: {
      backgroundColor: "#E0E0E0"
    }
  },
  LABELS: {},
  STYLE: {
    sliderLabels: {
      "vertical-align": "center",
      "display": "table-cell",
      "font": "normal 100 26px Roboto Mono"
    }
  },
  ANIMATE: {}
};

$.KINETICS.props = {
  midX: $.DEVICE.width / 2,
  midY: $.DEVICE.height / 2,
  width: (700 * $.DEVICE.scale) + (700 * (1 - $.DEVICE.scale)),
  height: (400 * $.DEVICE.scale) + (400 * (1 - $.DEVICE.scale)),
  scale: .5,
  options: 0,
  backgroundColor: "#151517",
  superLayer: $.DEVICE,
  targetLayer: {}
};

$.KINETICS.open = {
  layer: null,
  properties: {
    scale: 1,
    opacity: 1
  },
  curve: "spring(245, 40, 0)",
  curveOptions: {},
  time: 1,
  delay: 0,
  repeat: 0,
  debug: false
};

$.KINETICS.close = {
  layer: null,
  properties: {
    scale: .5,
    opacity: 0
  },
  curve: "spring(345, 40, 0)",
  curveOptions: {},
  time: 1,
  delay: 0,
  repeat: 0,
  debug: false
};

$.BUTTONS.closeButton = {
  maxX: $.KINETICS.props.width - 28,
  y: 28,
  width: 24,
  height: 24,
  backgroundColor: "transparent"
};

$.BUTTONS.closeButtonXL = {
  midX: $.BUTTONS.closeButton.width / 2,
  midY: $.BUTTONS.closeButton.height / 2,
  width: 24,
  height: 4,
  rotation: 45,
  borderRadius: 18,
  backgroundColor: "#E0E0E0"
};

$.BUTTONS.closeButtonXR = {
  midX: $.BUTTONS.closeButton.width / 2,
  midY: $.BUTTONS.closeButton.height / 2,
  width: 24,
  height: 4,
  rotation: -45,
  borderRadius: 18,
  backgroundColor: "#E0E0E0"
};

$.TEXT.animateProps = {
  midX: $.KINETICS.props.width / 2,
  width: $.KINETICS.props.width - 160,
  height: 80,
  backgroundColor: "transparent",
  name: "AnimateProps",
  ignoreEvents: false,
  propagateEvents: false
};

$.TEXT.curveProps = {
  midX: $.KINETICS.props.width / 2,
  maxY: $.KINETICS.props.height - 20,
  width: $.KINETICS.props.width / 1.5,
  name: "CurveProps",
  height: 40,
  backgroundColor: "transparent"
};

$.SLIDERS.tension = {
  x: 200,
  y: 107,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "TensionSlider",
  min: 0,
  max: 1000,
  value: 250
};

$.SLIDERS.friction = {
  x: 200,
  y: 161,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "FrictionSlider",
  min: 0,
  max: 100,
  value: 45
};

$.SLIDERS.velocity = {
  x: 200,
  y: 215,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "VelocitySlider",
  min: 0,
  max: 10,
  value: 0
};

$.SLIDERS.tolerance = {
  x: 200,
  y: 269,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
  name: "ToleranceSlider",
  min: 0.001,
  max: 1,
  value: 0.001
};

$.LABELS.tension = {
  x: 20,
  y: 92,
  width: 110,
  height: 34,
  backgroundColor: "transparent",
  name: "TensionLabel"
};

$.LABELS.friction = {
  x: 20,
  y: 146,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "FrictionLabel"
};

$.LABELS.velocity = {
  x: 20,
  y: 200,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "VelocityLabel"
};

$.LABELS.tolerance = {
  x: 20,
  y: 254,
  width: 141,
  height: 34,
  backgroundColor: "transparent",
  name: "ToleranceLabel"
};

$.ANIMATE.options = {
  layer: null,
  properties: {},
  curve: "spring(250, 45, 0, .001",
  curveOptions: {},
  time: 1,
  delay: 0,
  repeat: 0,
  debug: false
};

Framer.Device.phone.clip = false;

Framer.CurrentContext.on("layer:create", function(layer) {
  return layer.on(Events.Click, function(e, layer) {
    if (e.altKey && layer instanceof Kinetics === false && layer.superLayer !== $.KINETICS.layer) {
      if ($.KINETICS.layer) {
        $.KINETICS.layer.destroy();
      }
      $.KINETICS.targetLayer = layer;
      $.KINETICS.targetLayerOrigin = layer.props;
      new Kinetics($.KINETICS.props);

      /*
      
      			TODO: Is there a way to remove mouseevent listeners on layers so there's no conflict?
       */
      return $.KINETICS.layer.animate($.KINETICS.open);
    }
  });
});

Kinetics = (function(superClass) {
  extend(Kinetics, superClass);

  function Kinetics(options) {
    var keys;
    if (options == null) {
      options = {};
    }
    Kinetics.__super__.constructor.call(this, options);
    $.KINETICS.layer = this;
    this.draggable.enabled = true;
    this.draggable.momentum = false;
    $.BUTTONS.closeButton.superLayer = this;
    this.closeButton = new Layer($.BUTTONS.closeButton);
    $.BUTTONS.closeButtonXL.superLayer = this.closeButton;
    $.BUTTONS.closeButtonXR.superLayer = this.closeButton;
    this.closeButtonXL = new Layer($.BUTTONS.closeButtonXL);
    this.closeButtonXR = new Layer($.BUTTONS.closeButtonXR);
    keys = [];
    document.onkeydown = document.onkeyup = function(e) {
      keys[e.keyCode] = e.type === "keydown";
      if (keys[18] && keys[187]) {
        $.KINETICS.layer.animatePropsInput.blur();
        return $.KINETICS.layer.animate({
          properties: {
            scale: $.KINETICS.layer.scale + .25
          },
          curve: "spring(345, 40, 0)"
        });
      } else if (keys[18] && keys[189]) {
        $.KINETICS.layer.animatePropsInput.blur();
        $.KINETICS.layer.animate({
          properties: {
            scale: $.KINETICS.layer.scale - .25
          },
          curve: "spring(345, 40, 0)"
        });
        if ($.KINETICS.layer.scale < .25) {
          return $.KINETICS.layer.scale = .25;
        }
      }
    };
    this.closeButton.on(Events.Click, function() {
      $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
      $.KINETICS.layer.animate($.KINETICS.close);
      return Utils.delay(.5, function() {
        return $.KINETICS.layer.destroy();
      });
    });
    this.setupText();
    this.setupSliders();
  }

  Kinetics.prototype.setupText = function() {
    var text;
    for (text in $.TEXT) {
      if (text !== "input") {
        $.TEXT["" + text].superLayer = $.KINETICS.layer;
      }
    }
    this.animateProps = new Layer($.TEXT.animateProps);
    this.animatePropsInput = document.createElement("input");
    this.animatePropsInput.style["width"] = this.animateProps.width + "px";
    this.animatePropsInput.style["height"] = this.animateProps.height + "px";
    this.animatePropsInput.style["font"] = "normal 400 26px Roboto Mono";
    this.animatePropsInput.style["text-align"] = "center";
    this.animatePropsInput.style["font-size"] = "26px";
    this.animatePropsInput.style["color"] = "white";
    this.animatePropsInput.style["-wekit-user-select"] = "text";
    this.animatePropsInput.style["background-color"] = "" + $.KINETICS.layer.backgroundColor;
    this.animatePropsInput.placeholder = "Add animation properties";
    this.animateProps._element.appendChild(this.animatePropsInput);

    /*
    
    		TODO: Make curve props an input where you can type in it if you wish (adjusts knob values)
    		BUG (semi): curveProps is editable
     */
    this.curveProps = new Layer($.TEXT.curveProps);
    this.curvePropsText = document.createElement("textarea");
    this.curvePropsText.style["width"] = this.curveProps.width + "px";
    this.curvePropsText.style["height"] = this.curveProps.height + "px";
    this.curvePropsText.style["text-align"] = "center";
    this.curvePropsText.style["line-height"] = "34px";
    this.curvePropsText.style["color"] = "#A0E35F";
    this.curvePropsText.style["font"] = "400 28px Roboto Mono";
    this.curvePropsText.style["background-color"] = "transparent";
    this.curvePropsText.style["border"] = "none";
    this.curvePropsText.style["resize"] = "none";
    this.curvePropsText.value = "\"" + $.ANIMATE.options.curve + "\"";
    this.curveProps._element.appendChild(this.curvePropsText);
    this.animatePropsInput.onclick = function() {
      this.focus();
      return this.placeholder = " ";
    };
    this.animatePropsInput.onblur = function() {
      return this.placeholder = "Add animation properties";
    };
    this.animatePropsInput.onkeyup = function(e) {
      var i, index, len, option, options, regex;
      if (e.keyCode === 13) {
        $.KINETICS.layer.animatePropsInput.blur();
        $.KINETICS.layer.animatePropsInput.placeholder = "Add animation properties";
        if ($.KINETICS.layer.animatePropsInput.value !== "") {
          regex = /(\S*\w)/g;
          options = $.KINETICS.layer.animatePropsInput.value.match(regex);
          for (i = 0, len = options.length; i < len; i++) {
            option = options[i];
            index = _.indexOf(options, option);
            if (index % 2 === 0) {
              $.ANIMATE.options.properties["" + option] = options[index + 1];
            }
          }
          return $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
        }
      }
    };
    return this.curvePropsText.onclick = function() {
      return this.select();
    };
  };

  Kinetics.prototype.setupSliders = function() {
    var i, j, label, len, len1, ref, ref1, results, slider, style;
    for (slider in $.SLIDERS) {
      if (slider !== "knob") {
        $.SLIDERS["" + slider].superLayer = $.KINETICS.layer;
      }
    }
    for (label in $.LABELS) {
      $.LABELS["" + label].superLayer = $.KINETICS.layer;
    }
    this.tension = new SliderComponent($.SLIDERS.tension);
    this.tension.knobSize = $.SLIDERS.knob.knobSize;
    this.tension.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.tension.knob.draggable.momentum = false;
    this.tension.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.tensionLabel = new Layer($.LABELS.tension);
    this.tensionLabel.html = "<div width='@tensionLabel.width' height='@tensionLabel.height'>" + this.tensionLabel.name + "</div>";
    this.friction = new SliderComponent($.SLIDERS.friction);
    this.friction.knobSize = $.SLIDERS.knob.knobSize;
    this.friction.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.friction.knob.draggable.momentum = false;
    this.friction.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.frictionLabel = new Layer($.LABELS.friction);
    this.frictionLabel.html = "<div width='@frictionLabel.width' height='@frictionLabel.height'>" + this.frictionLabel.name + "</div>";
    this.velocity = new SliderComponent($.SLIDERS.velocity);
    this.velocity.knobSize = $.SLIDERS.knob.knobSize;
    this.velocity.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.velocity.knob.draggable.momentum = false;
    this.velocity.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.velocityLabel = new Layer($.LABELS.velocity);
    this.velocityLabel.html = "<div width='@velocityLabel.width' height='@velocityLabel.height'>" + this.velocityLabel.name + "</div>";
    this.tolerance = new SliderComponent($.SLIDERS.tolerance);
    this.tolerance.knobSize = $.SLIDERS.knob.knobSize;
    this.tolerance.knob.backgroundColor = $.SLIDERS.knob.backgroundColor;
    this.tolerance.knob.draggable.momentum = false;
    this.tolerance.fill.backgroundColor = $.SLIDERS.fill.backgroundColor;
    this.toleranceLabel = new Layer($.LABELS.tolerance);
    this.toleranceLabel.html = "<div width='@toleranceLabel.width' height='@toleranceLabel.height'>" + this.toleranceLabel.name + "</div>";
    ref = $.KINETICS.layer.subLayers;
    for (i = 0, len = ref.length; i < len; i++) {
      slider = ref[i];
      if (slider.constructor.name === "Layer") {
        for (style in $.STYLE.sliderLabels) {
          slider._element.style["" + style] = $.STYLE.sliderLabels["" + style];
        }
      }
    }
    ref1 = this.subLayers;
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      slider = ref1[j];
      if (!(slider instanceof SliderComponent === true)) {
        continue;
      }
      slider.on("change:value", function() {
        $.ANIMATE.options.curve = "spring(" + (Math.round($.KINETICS.layer.tension.value)) + ", " + (Math.round($.KINETICS.layer.friction.value)) + ", " + (Math.round($.KINETICS.layer.velocity.value)) + ", " + (Math.round($.KINETICS.layer.tolerance.value * 1000) / 1000) + ")";
        return $.KINETICS.layer.curvePropsText.value = "\"" + $.ANIMATE.options.curve + "\"";
      });
      results.push(slider.knob.on(Events.DragEnd, function() {
        return $.KINETICS.layer.animateTarget();
      }));
    }
    return results;
  };

  Kinetics.prototype.animateTarget = function() {
    $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
    return $.KINETICS.targetLayer.animate($.ANIMATE.options);
  };

  return Kinetics;

})(Layer);

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zaG10dWNrZXIvR2l0SHViL0tpbmV0aWNzL0tpbmV0aWNzLmZyYW1lci9tb2R1bGVzL0tpbmV0aWNzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2pvc2htdHVja2VyL0dpdEh1Yi9LaW5ldGljcy9LaW5ldGljcy5mcmFtZXIvbW9kdWxlcy9LaW5ldGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLElBQUEsV0FBQTtFQUFBOzZCQUFBOztBQUFBLEtBQUssQ0FBQyxTQUFOLENBQWdCLDJEQUFoQixDQUFBLENBQUE7O0FBRUE7QUFBQSxlQUZBOztBQUFBLENBSUEsR0FDQztBQUFBLEVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxFQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBRHRCO0FBQUEsRUFFQSxPQUFBLEVBQVMsRUFGVDtBQUFBLEVBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxFQUlBLE9BQUEsRUFBUztBQUFBLElBQUMsSUFBQSxFQUFLO0FBQUEsTUFBQyxRQUFBLEVBQVUsRUFBWDtBQUFBLE1BQWUsZUFBQSxFQUFpQixTQUFoQztLQUFOO0FBQUEsSUFBa0QsSUFBQSxFQUFLO0FBQUEsTUFBQyxlQUFBLEVBQWlCLFNBQWxCO0tBQXZEO0dBSlQ7QUFBQSxFQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsRUFNQSxLQUFBLEVBQU87QUFBQSxJQUFDLFlBQUEsRUFBYTtBQUFBLE1BQUMsZ0JBQUEsRUFBa0IsUUFBbkI7QUFBQSxNQUE2QixTQUFBLEVBQVcsWUFBeEM7QUFBQSxNQUFzRCxNQUFBLEVBQVEsNkJBQTlEO0tBQWQ7R0FOUDtBQUFBLEVBT0EsT0FBQSxFQUFTLEVBUFQ7Q0FMRCxDQUFBOztBQUFBLENBY0MsQ0FBQyxRQUFRLENBQUMsS0FBWCxHQUNDO0FBQUEsRUFBQSxJ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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgSW5zZXJ0IEdvb2dsZSBSb2JvdG8gZm9udFxuVXRpbHMuaW5zZXJ0Q1NTKFwiQGltcG9ydCB1cmwoLy9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PVJvYm90bytNb25vXCIpXG5cbiMjIyBWQVJJQUJMRVMgIyMjXG5cbiQgPSBcblx0S0lORVRJQ1M6IHt9XG5cdERFVklDRTogRnJhbWVyLkRldmljZS5waG9uZVxuXHRCVVRUT05TOiB7fVxuXHRURVhUOiB7fVxuXHRTTElERVJTOiB7a25vYjp7a25vYlNpemU6IDI4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifSwgZmlsbDp7YmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn19XG5cdExBQkVMUzoge31cblx0U1RZTEU6IHtzbGlkZXJMYWJlbHM6e1widmVydGljYWwtYWxpZ25cIjogXCJjZW50ZXJcIiwgXCJkaXNwbGF5XCI6IFwidGFibGUtY2VsbFwiLCBcImZvbnRcIjogXCJub3JtYWwgMTAwIDI2cHggUm9ib3RvIE1vbm9cIn19XG5cdEFOSU1BVEU6IHt9XG5cbiQuS0lORVRJQ1MucHJvcHMgPSBcblx0bWlkWDogJC5ERVZJQ0Uud2lkdGgvMiBcblx0bWlkWTogJC5ERVZJQ0UuaGVpZ2h0LzIgXG5cdHdpZHRoOiAoNzAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDcwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0aGVpZ2h0OiAoNDAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDQwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0c2NhbGU6IC41XG5cdG9wdGlvbnM6IDBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMxNTE1MTdcIlxuXHRzdXBlckxheWVyOiAkLkRFVklDRVxuXHR0YXJnZXRMYXllcjoge31cblxuJC5LSU5FVElDUy5vcGVuID0gXG5cdGxheWVyOiBudWxsXG5cdHByb3BlcnRpZXM6IHtzY2FsZTogMSwgb3BhY2l0eTogMX1cblx0Y3VydmU6IFwic3ByaW5nKDI0NSwgNDAsIDApXCJcblx0Y3VydmVPcHRpb25zOiB7fVxuXHR0aW1lOiAxXG5cdGRlbGF5OiAwXG5cdHJlcGVhdDogMFxuXHRkZWJ1ZzogZmFsc2VcblxuJC5LSU5FVElDUy5jbG9zZSA9IFxuXHRsYXllcjogbnVsbFxuXHRwcm9wZXJ0aWVzOiB7c2NhbGU6IC41LCBvcGFjaXR5OiAwfVxuXHRjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIlxuXHRjdXJ2ZU9wdGlvbnM6IHt9XG5cdHRpbWU6IDFcblx0ZGVsYXk6IDBcblx0cmVwZWF0OiAwXG5cdGRlYnVnOiBmYWxzZVxuXG4jIOKAk+KAk+KAkyBCVVRUT05TXG4kLkJVVFRPTlMuY2xvc2VCdXR0b24gPSB7bWF4WDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDI4LCB5OiAyOCwgd2lkdGg6IDI0LCBoZWlnaHQ6IDI0LCBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIn1cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMID0ge21pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aC8yLCBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0LzIsIHdpZHRoOiAyNCwgaGVpZ2h0OiA0LCByb3RhdGlvbjogNDUsIGJvcmRlclJhZGl1czogMTgsIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJ9XG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YUiA9IHttaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGgvMiwgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodC8yLCB3aWR0aDogMjQsIGhlaWdodDogNCwgcm90YXRpb246IC00NSwgYm9yZGVyUmFkaXVzOiAxOCwgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn1cblxuIyDigJPigJPigJMgVEVYVFxuJC5URVhULmFuaW1hdGVQcm9wcyA9IFxuXHRtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoLzJcblx0d2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAxNjBcblx0aGVpZ2h0OiA4MFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIkFuaW1hdGVQcm9wc1wiXG5cdGlnbm9yZUV2ZW50czogZmFsc2Vcblx0cHJvcGFnYXRlRXZlbnRzOiBmYWxzZVxuXG4kLlRFWFQuY3VydmVQcm9wcyA9IFxuXHRtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoLzJcblx0bWF4WTogJC5LSU5FVElDUy5wcm9wcy5oZWlnaHQtMjBcblx0d2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMS41XG5cdG5hbWU6IFwiQ3VydmVQcm9wc1wiXG5cdGhlaWdodDogNDBcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblxuIyDigJPigJPigJMgU0xJREVSU1xuJC5TTElERVJTLnRlbnNpb24gPSBcblx0eDogMjAwXG5cdHk6IDEwN1xuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRuYW1lOiBcIlRlbnNpb25TbGlkZXJcIlxuXHRtaW46IDBcblx0bWF4OiAxMDAwXG5cdHZhbHVlOiAyNTBcblxuJC5TTElERVJTLmZyaWN0aW9uID0gXG5cdHg6IDIwMFxuXHR5OiAxNjFcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bmFtZTogXCJGcmljdGlvblNsaWRlclwiXG5cdG1pbjogMFxuXHRtYXg6IDEwMFxuXHR2YWx1ZTogNDVcblxuJC5TTElERVJTLnZlbG9jaXR5ID0gXG5cdHg6IDIwMFxuXHR5OiAyMTVcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bmFtZTogXCJWZWxvY2l0eVNsaWRlclwiXG5cdG1pbjogMFxuXHRtYXg6IDEwXG5cdHZhbHVlOiAwXG5cbiQuU0xJREVSUy50b2xlcmFuY2UgPSBcblx0eDogMjAwXG5cdHk6IDI2OVxuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRuYW1lOiBcIlRvbGVyYW5jZVNsaWRlclwiXG5cdG1pbjogMC4wMDFcblx0bWF4OiAxXG5cdHZhbHVlOiAwLjAwMVxuXG4jIOKAk+KAk+KAkyBMQUJFTFNcbiQuTEFCRUxTLnRlbnNpb24gPSBcblx0eDogMjBcblx0eTogOTJcblx0d2lkdGg6IDExMFxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVGVuc2lvbkxhYmVsXCJcblxuJC5MQUJFTFMuZnJpY3Rpb24gPSBcblx0eDogMjBcblx0eTogMTQ2XG5cdHdpZHRoOiAxMjVcblx0aGVpZ2h0OiAzNFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIkZyaWN0aW9uTGFiZWxcIlxuXG4kLkxBQkVMUy52ZWxvY2l0eSA9IFxuXHR4OiAyMFxuXHR5OiAyMDBcblx0d2lkdGg6IDEyNVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVmVsb2NpdHlMYWJlbFwiXG5cbiQuTEFCRUxTLnRvbGVyYW5jZSA9IFxuXHR4OiAyMFxuXHR5OiAyNTRcblx0d2lkdGg6IDE0MVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVG9sZXJhbmNlTGFiZWxcIlxuXG4jIOKAk+KAk+KAkyBBTklNQVRFXG4kLkFOSU1BVEUub3B0aW9ucyA9XG5cdGxheWVyOiBudWxsXG5cdHByb3BlcnRpZXM6IHt9XG5cdGN1cnZlOiBcInNwcmluZygyNTAsIDQ1LCAwLCAuMDAxXCJcblx0Y3VydmVPcHRpb25zOiB7fVxuXHR0aW1lOiAxXG5cdGRlbGF5OiAwXG5cdHJlcGVhdDogMFxuXHRkZWJ1ZzogZmFsc2VcblxuIyBEaXNhYmxlIGNsaXAgb24gZGV2aWNlXG5GcmFtZXIuRGV2aWNlLnBob25lLmNsaXAgPSBmYWxzZVxuXG5GcmFtZXIuQ3VycmVudENvbnRleHQub24gXCJsYXllcjpjcmVhdGVcIiwgKGxheWVyKSAtPlxuXHRsYXllci5vbiBFdmVudHMuQ2xpY2ssIChlLCBsYXllcikgLT5cblx0XHQjIE9ubHkgb24gYW4gYWx0KG9wdGlvbikgKyBjbGlja1xuXHRcdGlmIGUuYWx0S2V5IGFuZCBsYXllciBpbnN0YW5jZW9mIEtpbmV0aWNzIGlzIGZhbHNlIGFuZCBsYXllci5zdXBlckxheWVyIGlzbnQgJC5LSU5FVElDUy5sYXllclxuXG5cdFx0XHQjIERlc3Ryb3kgaWYgbGF5ZXIgYWxyZWFkeSBleGlzdHNcblx0XHRcdGlmICQuS0lORVRJQ1MubGF5ZXIgdGhlbiAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKVxuXHRcdFx0XG5cdFx0XHQjIENyZWF0ZSBLaW5ldGljcyBsYXllclxuXHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllciA9IGxheWVyXG5cdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luID0gbGF5ZXIucHJvcHNcblx0XHRcdG5ldyBLaW5ldGljcyAkLktJTkVUSUNTLnByb3BzXG5cblx0XHRcdCMjI1xuXG5cdFx0XHRUT0RPOiBJcyB0aGVyZSBhIHdheSB0byByZW1vdmUgbW91c2VldmVudCBsaXN0ZW5lcnMgb24gbGF5ZXJzIHNvIHRoZXJlJ3Mgbm8gY29uZmxpY3Q/XG5cblx0XHRcdCMjI1xuXG5cdFx0XHQjIFNob3cgS2luZXRpY3Mgd2luZG93XG5cdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGUgJC5LSU5FVElDUy5vcGVuXG5cbmNsYXNzIEtpbmV0aWNzIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdCMgUmVmZXJlbmNlIEtpbmV0aWNzXG5cdFx0JC5LSU5FVElDUy5sYXllciA9IEBcblxuXHRcdEBkcmFnZ2FibGUuZW5hYmxlZCA9IHRydWVcblx0XHRAZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2VcblxuXHRcdCMgQWRkIGNsb3NlIGJ1dHRvblxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5zdXBlckxheWVyID0gQFxuXHRcdEBjbG9zZUJ1dHRvbiA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25cblx0XHRcdFxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMLnN1cGVyTGF5ZXIgPSBAY2xvc2VCdXR0b25cblx0XHQkLkJVVFRPTlMuY2xvc2VCdXR0b25YUi5zdXBlckxheWVyID0gQGNsb3NlQnV0dG9uXG5cdFx0QGNsb3NlQnV0dG9uWEwgPSBuZXcgTGF5ZXIgJC5CVVRUT05TLmNsb3NlQnV0dG9uWExcblx0XHRAY2xvc2VCdXR0b25YUiA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25YUlxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0IyBBZGp1c3Qgc2l6ZSBvZiBLaW5ldGljcyB3aW5kb3cgd2l0aCBvcHRpb24gKyBwbHVzIG9yIG9wdGlvbiArIG1pbnVzXG5cdFx0a2V5cyA9IFtdXG5cdFx0ZG9jdW1lbnQub25rZXlkb3duID0gZG9jdW1lbnQub25rZXl1cCA9IChlKSAtPlxuXHRcdFx0a2V5c1tlLmtleUNvZGVdID0gZS50eXBlID09IFwia2V5ZG93blwiXG5cblx0XHRcdCMgMTggPSBPcHRpb24ga2V5XG5cdFx0XHQjIDE4NyA9ICsga2V5XG5cdFx0XHQjIDE4OSA9IC0ga2V5XG5cblx0XHRcdCMgU2NhbGUgdXBcblx0XHRcdGlmIGtleXNbMThdIGFuZCBrZXlzWzE4N11cblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKClcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdHNjYWxlOiAkLktJTkVUSUNTLmxheWVyLnNjYWxlICsgLjI1XG5cdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcblx0XHRcdGVsc2UgaWYga2V5c1sxOF0gYW5kIGtleXNbMTg5XVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0c2NhbGU6ICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgLSAuMjVcblx0XHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIlxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLnNjYWxlID0gLjI1IGlmICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPCAuMjVcblxuXHRcdEBjbG9zZUJ1dHRvbi5vbiBFdmVudHMuQ2xpY2ssIC0+XG5cdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpblxuXG5cdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGUgJC5LSU5FVElDUy5jbG9zZVxuXG5cdFx0XHRVdGlscy5kZWxheSAuNSwgLT5cblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5kZXN0cm95KClcblxuXHRcdEBzZXR1cFRleHQoKVxuXHRcdEBzZXR1cFNsaWRlcnMoKVxuXG5cdHNldHVwVGV4dDogLT5cblx0XHQjIFNldHVwIHN1cGVyTGF5ZXJcblx0XHRmb3IgdGV4dCBvZiAkLlRFWFQgd2hlbiB0ZXh0IGlzbnQgXCJpbnB1dFwiXG5cdFx0XHQkLlRFWFRbXCIje3RleHR9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIOKAk+KAk+KAkyBBTklNQVRFIFBST1BFUlRJRVNcblx0XHRAYW5pbWF0ZVByb3BzID0gbmV3IExheWVyICQuVEVYVC5hbmltYXRlUHJvcHNcblxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIndpZHRoXCJdID0gXCIje0BhbmltYXRlUHJvcHMud2lkdGh9cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImhlaWdodFwiXSA9IFwiI3tAYW5pbWF0ZVByb3BzLmhlaWdodH1weFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udFwiXSA9IFwibm9ybWFsIDQwMCAyNnB4IFJvYm90byBNb25vXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ0ZXh0LWFsaWduXCJdID0gXCJjZW50ZXJcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMjZweFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiY29sb3JcIl0gPSBcIndoaXRlXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCItd2VraXQtdXNlci1zZWxlY3RcIl0gPSBcInRleHRcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcIiN7JC5LSU5FVElDUy5sYXllci5iYWNrZ3JvdW5kQ29sb3J9XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiXG5cblx0XHRAYW5pbWF0ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKEBhbmltYXRlUHJvcHNJbnB1dClcblxuXHRcdCMg4oCT4oCT4oCTIENVUlZFIFBST1BFUlRJRVNcblxuXHRcdCMjI1xuXG5cdFx0VE9ETzogTWFrZSBjdXJ2ZSBwcm9wcyBhbiBpbnB1dCB3aGVyZSB5b3UgY2FuIHR5cGUgaW4gaXQgaWYgeW91IHdpc2ggKGFkanVzdHMga25vYiB2YWx1ZXMpXG5cdFx0QlVHIChzZW1pKTogY3VydmVQcm9wcyBpcyBlZGl0YWJsZVxuXG5cdFx0IyMjXG5cblxuXHRcdEBjdXJ2ZVByb3BzID0gbmV3IExheWVyICQuVEVYVC5jdXJ2ZVByb3BzXG5cblx0XHRAY3VydmVQcm9wc1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJ3aWR0aFwiXSA9IFwiI3tAY3VydmVQcm9wcy53aWR0aH1weFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiaGVpZ2h0XCJdID0gXCIje0BjdXJ2ZVByb3BzLmhlaWdodH1weFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IFwiMzRweFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiY29sb3JcIl0gPSBcIiNBMEUzNUZcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImZvbnRcIl0gPSBcIjQwMCAyOHB4IFJvYm90byBNb25vXCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiYm9yZGVyXCJdID0gXCJub25lXCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJyZXNpemVcIl0gPSBcIm5vbmVcIlxuXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnZhbHVlID0gXCJcXFwiI3skLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZX1cXFwiXCJcblxuXHRcdEBjdXJ2ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKEBjdXJ2ZVByb3BzVGV4dClcblxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0IyBTZWxlY3QgaW5wdXRcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQub25jbGljayA9IC0+XG5cdFx0XHRAZm9jdXMoKVxuXHRcdFx0QHBsYWNlaG9sZGVyID0gXCIgXCJcblxuXHRcdCMgUmVwbGFjZSBwbGFjZWhvbGRlclxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5vbmJsdXIgPSAtPlxuXHRcdFx0QHBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0IyBTdWJtaXR0aW5nIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0Lm9ua2V5dXAgPSAoZSkgLT5cblx0XHRcdGlmIGUua2V5Q29kZSBpcyAxM1xuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0XHRcdGlmICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUgaXNudCBcIlwiXG5cblx0XHRcdFx0XHRyZWdleCA9IC8oXFxTKlxcdykvZ1xuXG5cdFx0XHRcdFx0b3B0aW9ucyA9ICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUubWF0Y2gocmVnZXgpXG5cblx0XHRcdFx0XHRmb3Igb3B0aW9uIGluIG9wdGlvbnNcblx0XHRcdFx0XHRcdGluZGV4ID0gXy5pbmRleE9mKG9wdGlvbnMsIG9wdGlvbilcblx0XHRcdFx0XHRcdGlmIGluZGV4ICUgMiBpcyAwXG5cdFx0XHRcdFx0XHRcdCQuQU5JTUFURS5vcHRpb25zLnByb3BlcnRpZXNbXCIje29wdGlvbn1cIl0gPSBvcHRpb25zW2luZGV4KzFdXG5cblx0XHRcdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpblxuXG5cdFx0IyBTZWxlY3QgY3VydmUgdmFsdWVcblx0XHRAY3VydmVQcm9wc1RleHQub25jbGljayA9IC0+XG5cdFx0XHRAc2VsZWN0KClcblxuXHRzZXR1cFNsaWRlcnM6IC0+XG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3Igc2xpZGVyc1xuXHRcdGZvciBzbGlkZXIgb2YgJC5TTElERVJTIHdoZW4gc2xpZGVyIGlzbnQgXCJrbm9iXCJcblx0XHRcdCQuU0xJREVSU1tcIiN7c2xpZGVyfVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3IgbGFiZWxzXG5cdFx0Zm9yIGxhYmVsIG9mICQuTEFCRUxTXG5cdFx0XHQkLkxBQkVMU1tcIiN7bGFiZWx9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIOKAk+KAk+KAkyBURU5TSU9OXG5cdFx0QHRlbnNpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy50ZW5zaW9uXG5cdFx0QHRlbnNpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0ZW5zaW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QHRlbnNpb24ua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB0ZW5zaW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdGVuc2lvbkxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLnRlbnNpb25cblx0XHRAdGVuc2lvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0ZW5zaW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQHRlbnNpb25MYWJlbC5oZWlnaHQnPiN7QHRlbnNpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBGUklDVElPTlxuXG5cdFx0QGZyaWN0aW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMuZnJpY3Rpb25cblx0XHRAZnJpY3Rpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEBmcmljdGlvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEBmcmljdGlvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QGZyaWN0aW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAZnJpY3Rpb25MYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy5mcmljdGlvblxuXHRcdEBmcmljdGlvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0BmcmljdGlvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0BmcmljdGlvbkxhYmVsLmhlaWdodCc+I3tAZnJpY3Rpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBWRUxPQ0lUWVxuXHRcdEB2ZWxvY2l0eSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnZlbG9jaXR5XG5cdFx0QHZlbG9jaXR5Lmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemVcblx0XHRAdmVsb2NpdHkua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdmVsb2NpdHkua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB2ZWxvY2l0eS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvclxuXG5cdFx0QHZlbG9jaXR5TGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudmVsb2NpdHlcblx0XHRAdmVsb2NpdHlMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdmVsb2NpdHlMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdmVsb2NpdHlMYWJlbC5oZWlnaHQnPiN7QHZlbG9jaXR5TGFiZWwubmFtZX08L2Rpdj5cIlxuXG5cdFx0IyDigJPigJPigJMgVE9MRVJBTkNFXG5cdFx0QHRvbGVyYW5jZSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnRvbGVyYW5jZVxuXHRcdEB0b2xlcmFuY2Uua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0b2xlcmFuY2Uua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdG9sZXJhbmNlLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAdG9sZXJhbmNlLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdG9sZXJhbmNlTGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudG9sZXJhbmNlXG5cdFx0QHRvbGVyYW5jZUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0b2xlcmFuY2VMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdG9sZXJhbmNlTGFiZWwuaGVpZ2h0Jz4je0B0b2xlcmFuY2VMYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIFNldCBzdHlsZSBmb3IgYWxsIHRoZSBsYWJlbHNcblx0XHRmb3Igc2xpZGVyIGluICQuS0lORVRJQ1MubGF5ZXIuc3ViTGF5ZXJzIHdoZW4gc2xpZGVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJMYXllclwiXG5cdFx0XHRmb3Igc3R5bGUgb2YgJC5TVFlMRS5zbGlkZXJMYWJlbHMgXG5cdFx0XHRcdHNsaWRlci5fZWxlbWVudC5zdHlsZVtcIiN7c3R5bGV9XCJdID0gJC5TVFlMRS5zbGlkZXJMYWJlbHNbXCIje3N0eWxlfVwiXVxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0Zm9yIHNsaWRlciBpbiBAc3ViTGF5ZXJzIHdoZW4gc2xpZGVyIGluc3RhbmNlb2YgU2xpZGVyQ29tcG9uZW50IGlzIHRydWVcblx0XHRcdHNsaWRlci5vbiBcImNoYW5nZTp2YWx1ZVwiLCAtPlxuXHRcdFx0XHQkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSA9IFwic3ByaW5nKCN7TWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRlbnNpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIuZnJpY3Rpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudmVsb2NpdHkudmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudG9sZXJhbmNlLnZhbHVlICogMTAwMCkvMTAwMH0pXCJcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5jdXJ2ZVByb3BzVGV4dC52YWx1ZSA9IFwiXFxcIiN7JC5BTklNQVRFLm9wdGlvbnMuY3VydmV9XFxcIlwiXG5cblx0XHRcdHNsaWRlci5rbm9iLm9uIEV2ZW50cy5EcmFnRW5kLCAtPlxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVUYXJnZXQoKVxuXG5cdGFuaW1hdGVUYXJnZXQ6IC0+XG5cdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLmFuaW1hdGUgJC5BTklNQVRFLm9wdGlvbnNcblxuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjkuMVxudmFyICQsIEtpbmV0aWNzLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuVXRpbHMuaW5zZXJ0Q1NTKFwiQGltcG9ydCB1cmwoLy9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PVJvYm90bytNb25vXCIpO1xuXG5cbi8qIFZBUklBQkxFUyAqL1xuXG4kID0ge1xuICBLSU5FVElDUzoge30sXG4gIERFVklDRTogRnJhbWVyLkRldmljZS5waG9uZSxcbiAgQlVUVE9OUzoge30sXG4gIFRFWFQ6IHt9LFxuICBTTElERVJTOiB7XG4gICAga25vYjoge1xuICAgICAga25vYlNpemU6IDI4LFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxuICAgIH0sXG4gICAgZmlsbDoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxuICAgIH1cbiAgfSxcbiAgTEFCRUxTOiB7fSxcbiAgU1RZTEU6IHtcbiAgICBzbGlkZXJMYWJlbHM6IHtcbiAgICAgIFwidmVydGljYWwtYWxpZ25cIjogXCJjZW50ZXJcIixcbiAgICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNlbGxcIixcbiAgICAgIFwiZm9udFwiOiBcIm5vcm1hbCAxMDAgMjZweCBSb2JvdG8gTW9ub1wiXG4gICAgfVxuICB9LFxuICBBTklNQVRFOiB7fVxufTtcblxuJC5LSU5FVElDUy5wcm9wcyA9IHtcbiAgbWlkWDogJC5ERVZJQ0Uud2lkdGggLyAyLFxuICBtaWRZOiAkLkRFVklDRS5oZWlnaHQgLyAyLFxuICB3aWR0aDogKDcwMCAqICQuREVWSUNFLnNjYWxlKSArICg3MDAgKiAoMSAtICQuREVWSUNFLnNjYWxlKSksXG4gIGhlaWdodDogKDQwMCAqICQuREVWSUNFLnNjYWxlKSArICg0MDAgKiAoMSAtICQuREVWSUNFLnNjYWxlKSksXG4gIHNjYWxlOiAuNSxcbiAgb3B0aW9uczogMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMxNTE1MTdcIixcbiAgc3VwZXJMYXllcjogJC5ERVZJQ0UsXG4gIHRhcmdldExheWVyOiB7fVxufTtcblxuJC5LSU5FVElDUy5vcGVuID0ge1xuICBsYXllcjogbnVsbCxcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiAxLFxuICAgIG9wYWNpdHk6IDFcbiAgfSxcbiAgY3VydmU6IFwic3ByaW5nKDI0NSwgNDAsIDApXCIsXG4gIGN1cnZlT3B0aW9uczoge30sXG4gIHRpbWU6IDEsXG4gIGRlbGF5OiAwLFxuICByZXBlYXQ6IDAsXG4gIGRlYnVnOiBmYWxzZVxufTtcblxuJC5LSU5FVElDUy5jbG9zZSA9IHtcbiAgbGF5ZXI6IG51bGwsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzY2FsZTogLjUsXG4gICAgb3BhY2l0eTogMFxuICB9LFxuICBjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIixcbiAgY3VydmVPcHRpb25zOiB7fSxcbiAgdGltZTogMSxcbiAgZGVsYXk6IDAsXG4gIHJlcGVhdDogMCxcbiAgZGVidWc6IGZhbHNlXG59O1xuXG4kLkJVVFRPTlMuY2xvc2VCdXR0b24gPSB7XG4gIG1heFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAyOCxcbiAgeTogMjgsXG4gIHdpZHRoOiAyNCxcbiAgaGVpZ2h0OiAyNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcbn07XG5cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMID0ge1xuICBtaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGggLyAyLFxuICBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0IC8gMixcbiAgd2lkdGg6IDI0LFxuICBoZWlnaHQ6IDQsXG4gIHJvdGF0aW9uOiA0NSxcbiAgYm9yZGVyUmFkaXVzOiAxOCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxufTtcblxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIgPSB7XG4gIG1pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aCAvIDIsXG4gIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQgLyAyLFxuICB3aWR0aDogMjQsXG4gIGhlaWdodDogNCxcbiAgcm90YXRpb246IC00NSxcbiAgYm9yZGVyUmFkaXVzOiAxOCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxufTtcblxuJC5URVhULmFuaW1hdGVQcm9wcyA9IHtcbiAgbWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAvIDIsXG4gIHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMTYwLFxuICBoZWlnaHQ6IDgwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJBbmltYXRlUHJvcHNcIixcbiAgaWdub3JlRXZlbnRzOiBmYWxzZSxcbiAgcHJvcGFnYXRlRXZlbnRzOiBmYWxzZVxufTtcblxuJC5URVhULmN1cnZlUHJvcHMgPSB7XG4gIG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAyLFxuICBtYXhZOiAkLktJTkVUSUNTLnByb3BzLmhlaWdodCAtIDIwLFxuICB3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAvIDEuNSxcbiAgbmFtZTogXCJDdXJ2ZVByb3BzXCIsXG4gIGhlaWdodDogNDAsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG59O1xuXG4kLlNMSURFUlMudGVuc2lvbiA9IHtcbiAgeDogMjAwLFxuICB5OiAxMDcsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiVGVuc2lvblNsaWRlclwiLFxuICBtaW46IDAsXG4gIG1heDogMTAwMCxcbiAgdmFsdWU6IDI1MFxufTtcblxuJC5TTElERVJTLmZyaWN0aW9uID0ge1xuICB4OiAyMDAsXG4gIHk6IDE2MSxcbiAgd2lkdGg6IDQ2MCxcbiAgaGVpZ2h0OiAxMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIixcbiAgbmFtZTogXCJGcmljdGlvblNsaWRlclwiLFxuICBtaW46IDAsXG4gIG1heDogMTAwLFxuICB2YWx1ZTogNDVcbn07XG5cbiQuU0xJREVSUy52ZWxvY2l0eSA9IHtcbiAgeDogMjAwLFxuICB5OiAyMTUsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiVmVsb2NpdHlTbGlkZXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwLFxuICB2YWx1ZTogMFxufTtcblxuJC5TTElERVJTLnRvbGVyYW5jZSA9IHtcbiAgeDogMjAwLFxuICB5OiAyNjksXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiVG9sZXJhbmNlU2xpZGVyXCIsXG4gIG1pbjogMC4wMDEsXG4gIG1heDogMSxcbiAgdmFsdWU6IDAuMDAxXG59O1xuXG4kLkxBQkVMUy50ZW5zaW9uID0ge1xuICB4OiAyMCxcbiAgeTogOTIsXG4gIHdpZHRoOiAxMTAsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlRlbnNpb25MYWJlbFwiXG59O1xuXG4kLkxBQkVMUy5mcmljdGlvbiA9IHtcbiAgeDogMjAsXG4gIHk6IDE0NixcbiAgd2lkdGg6IDEyNSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiRnJpY3Rpb25MYWJlbFwiXG59O1xuXG4kLkxBQkVMUy52ZWxvY2l0eSA9IHtcbiAgeDogMjAsXG4gIHk6IDIwMCxcbiAgd2lkdGg6IDEyNSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiVmVsb2NpdHlMYWJlbFwiXG59O1xuXG4kLkxBQkVMUy50b2xlcmFuY2UgPSB7XG4gIHg6IDIwLFxuICB5OiAyNTQsXG4gIHdpZHRoOiAxNDEsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlRvbGVyYW5jZUxhYmVsXCJcbn07XG5cbiQuQU5JTUFURS5vcHRpb25zID0ge1xuICBsYXllcjogbnVsbCxcbiAgcHJvcGVydGllczoge30sXG4gIGN1cnZlOiBcInNwcmluZygyNTAsIDQ1LCAwLCAuMDAxXCIsXG4gIGN1cnZlT3B0aW9uczoge30sXG4gIHRpbWU6IDEsXG4gIGRlbGF5OiAwLFxuICByZXBlYXQ6IDAsXG4gIGRlYnVnOiBmYWxzZVxufTtcblxuRnJhbWVyLkRldmljZS5waG9uZS5jbGlwID0gZmFsc2U7XG5cbkZyYW1lci5DdXJyZW50Q29udGV4dC5vbihcImxheWVyOmNyZWF0ZVwiLCBmdW5jdGlvbihsYXllcikge1xuICByZXR1cm4gbGF5ZXIub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbihlLCBsYXllcikge1xuICAgIGlmIChlLmFsdEtleSAmJiBsYXllciBpbnN0YW5jZW9mIEtpbmV0aWNzID09PSBmYWxzZSAmJiBsYXllci5zdXBlckxheWVyICE9PSAkLktJTkVUSUNTLmxheWVyKSB7XG4gICAgICBpZiAoJC5LSU5FVElDUy5sYXllcikge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIgPSBsYXllcjtcbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW4gPSBsYXllci5wcm9wcztcbiAgICAgIG5ldyBLaW5ldGljcygkLktJTkVUSUNTLnByb3BzKTtcblxuICAgICAgLypcbiAgICAgIFxuICAgICAgXHRcdFx0VE9ETzogSXMgdGhlcmUgYSB3YXkgdG8gcmVtb3ZlIG1vdXNlZXZlbnQgbGlzdGVuZXJzIG9uIGxheWVycyBzbyB0aGVyZSdzIG5vIGNvbmZsaWN0P1xuICAgICAgICovXG4gICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlKCQuS0lORVRJQ1Mub3Blbik7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5LaW5ldGljcyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChLaW5ldGljcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gS2luZXRpY3Mob3B0aW9ucykge1xuICAgIHZhciBrZXlzO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgS2luZXRpY3MuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgJC5LSU5FVElDUy5sYXllciA9IHRoaXM7XG4gICAgdGhpcy5kcmFnZ2FibGUuZW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICAkLkJVVFRPTlMuY2xvc2VCdXR0b24uc3VwZXJMYXllciA9IHRoaXM7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG5ldyBMYXllcigkLkJVVFRPTlMuY2xvc2VCdXR0b24pO1xuICAgICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMLnN1cGVyTGF5ZXIgPSB0aGlzLmNsb3NlQnV0dG9uO1xuICAgICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSLnN1cGVyTGF5ZXIgPSB0aGlzLmNsb3NlQnV0dG9uO1xuICAgIHRoaXMuY2xvc2VCdXR0b25YTCA9IG5ldyBMYXllcigkLkJVVFRPTlMuY2xvc2VCdXR0b25YTCk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvblhSID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSKTtcbiAgICBrZXlzID0gW107XG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGtleXNbZS5rZXlDb2RlXSA9IGUudHlwZSA9PT0gXCJrZXlkb3duXCI7XG4gICAgICBpZiAoa2V5c1sxOF0gJiYga2V5c1sxODddKSB7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpO1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlKHtcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBzY2FsZTogJC5LSU5FVElDUy5sYXllci5zY2FsZSArIC4yNVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGtleXNbMThdICYmIGtleXNbMTg5XSkge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKTtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlKHtcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBzY2FsZTogJC5LSU5FVElDUy5sYXllci5zY2FsZSAtIC4yNVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICgkLktJTkVUSUNTLmxheWVyLnNjYWxlIDwgLjI1KSB7XG4gICAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPSAuMjU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2xvc2VCdXR0b24ub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbigpIHtcbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlKCQuS0lORVRJQ1MuY2xvc2UpO1xuICAgICAgcmV0dXJuIFV0aWxzLmRlbGF5KC41LCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5zZXR1cFRleHQoKTtcbiAgICB0aGlzLnNldHVwU2xpZGVycygpO1xuICB9XG5cbiAgS2luZXRpY3MucHJvdG90eXBlLnNldHVwVGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0ZXh0O1xuICAgIGZvciAodGV4dCBpbiAkLlRFWFQpIHtcbiAgICAgIGlmICh0ZXh0ICE9PSBcImlucHV0XCIpIHtcbiAgICAgICAgJC5URVhUW1wiXCIgKyB0ZXh0XS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hbmltYXRlUHJvcHMgPSBuZXcgTGF5ZXIoJC5URVhULmFuaW1hdGVQcm9wcyk7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wid2lkdGhcIl0gPSB0aGlzLmFuaW1hdGVQcm9wcy53aWR0aCArIFwicHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiaGVpZ2h0XCJdID0gdGhpcy5hbmltYXRlUHJvcHMuaGVpZ2h0ICsgXCJweFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250XCJdID0gXCJub3JtYWwgNDAwIDI2cHggUm9ib3RvIE1vbm9cIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMjZweFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJjb2xvclwiXSA9IFwid2hpdGVcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiLXdla2l0LXVzZXItc2VsZWN0XCJdID0gXCJ0ZXh0XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcIlwiICsgJC5LSU5FVElDUy5sYXllci5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hbmltYXRlUHJvcHNJbnB1dCk7XG5cbiAgICAvKlxuICAgIFxuICAgIFx0XHRUT0RPOiBNYWtlIGN1cnZlIHByb3BzIGFuIGlucHV0IHdoZXJlIHlvdSBjYW4gdHlwZSBpbiBpdCBpZiB5b3Ugd2lzaCAoYWRqdXN0cyBrbm9iIHZhbHVlcylcbiAgICBcdFx0QlVHIChzZW1pKTogY3VydmVQcm9wcyBpcyBlZGl0YWJsZVxuICAgICAqL1xuICAgIHRoaXMuY3VydmVQcm9wcyA9IG5ldyBMYXllcigkLlRFWFQuY3VydmVQcm9wcyk7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wid2lkdGhcIl0gPSB0aGlzLmN1cnZlUHJvcHMud2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImhlaWdodFwiXSA9IHRoaXMuY3VydmVQcm9wcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcInRleHQtYWxpZ25cIl0gPSBcImNlbnRlclwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IFwiMzRweFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJjb2xvclwiXSA9IFwiI0EwRTM1RlwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJmb250XCJdID0gXCI0MDAgMjhweCBSb2JvdG8gTW9ub1wiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCJ0cmFuc3BhcmVudFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJib3JkZXJcIl0gPSBcIm5vbmVcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wicmVzaXplXCJdID0gXCJub25lXCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC52YWx1ZSA9IFwiXFxcIlwiICsgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgKyBcIlxcXCJcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jdXJ2ZVByb3BzVGV4dCk7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlciA9IFwiIFwiO1xuICAgIH07XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5vbmJsdXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIjtcbiAgICB9O1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25rZXl1cCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpLCBpbmRleCwgbGVuLCBvcHRpb24sIG9wdGlvbnMsIHJlZ2V4O1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKCk7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiO1xuICAgICAgICBpZiAoJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgIHJlZ2V4ID0gLyhcXFMqXFx3KS9nO1xuICAgICAgICAgIG9wdGlvbnMgPSAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBvcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBvcHRpb24gPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgaW5kZXggPSBfLmluZGV4T2Yob3B0aW9ucywgb3B0aW9uKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgJC5BTklNQVRFLm9wdGlvbnMucHJvcGVydGllc1tcIlwiICsgb3B0aW9uXSA9IG9wdGlvbnNbaW5kZXggKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZVByb3BzVGV4dC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QoKTtcbiAgICB9O1xuICB9O1xuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5zZXR1cFNsaWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSwgaiwgbGFiZWwsIGxlbiwgbGVuMSwgcmVmLCByZWYxLCByZXN1bHRzLCBzbGlkZXIsIHN0eWxlO1xuICAgIGZvciAoc2xpZGVyIGluICQuU0xJREVSUykge1xuICAgICAgaWYgKHNsaWRlciAhPT0gXCJrbm9iXCIpIHtcbiAgICAgICAgJC5TTElERVJTW1wiXCIgKyBzbGlkZXJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxhYmVsIGluICQuTEFCRUxTKSB7XG4gICAgICAkLkxBQkVMU1tcIlwiICsgbGFiZWxdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyO1xuICAgIH1cbiAgICB0aGlzLnRlbnNpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy50ZW5zaW9uKTtcbiAgICB0aGlzLnRlbnNpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnRlbnNpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50ZW5zaW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy50ZW5zaW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudGVuc2lvbkxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnRlbnNpb24pO1xuICAgIHRoaXMudGVuc2lvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0ZW5zaW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQHRlbnNpb25MYWJlbC5oZWlnaHQnPlwiICsgdGhpcy50ZW5zaW9uTGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgdGhpcy5mcmljdGlvbiA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLmZyaWN0aW9uKTtcbiAgICB0aGlzLmZyaWN0aW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLmZyaWN0aW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy5mcmljdGlvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLmZyaWN0aW9uTGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMuZnJpY3Rpb24pO1xuICAgIHRoaXMuZnJpY3Rpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAZnJpY3Rpb25MYWJlbC53aWR0aCcgaGVpZ2h0PSdAZnJpY3Rpb25MYWJlbC5oZWlnaHQnPlwiICsgdGhpcy5mcmljdGlvbkxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy52ZWxvY2l0eSk7XG4gICAgdGhpcy52ZWxvY2l0eS5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMudmVsb2NpdHkua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy52ZWxvY2l0eS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudmVsb2NpdHkuZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy52ZWxvY2l0eUxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnZlbG9jaXR5KTtcbiAgICB0aGlzLnZlbG9jaXR5TGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHZlbG9jaXR5TGFiZWwud2lkdGgnIGhlaWdodD0nQHZlbG9jaXR5TGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudmVsb2NpdHlMYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICB0aGlzLnRvbGVyYW5jZSA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLnRvbGVyYW5jZSk7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnRvbGVyYW5jZS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRvbGVyYW5jZS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudG9sZXJhbmNlLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudG9sZXJhbmNlTGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMudG9sZXJhbmNlKTtcbiAgICB0aGlzLnRvbGVyYW5jZUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0b2xlcmFuY2VMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdG9sZXJhbmNlTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudG9sZXJhbmNlTGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgcmVmID0gJC5LSU5FVElDUy5sYXllci5zdWJMYXllcnM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzbGlkZXIgPSByZWZbaV07XG4gICAgICBpZiAoc2xpZGVyLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiTGF5ZXJcIikge1xuICAgICAgICBmb3IgKHN0eWxlIGluICQuU1RZTEUuc2xpZGVyTGFiZWxzKSB7XG4gICAgICAgICAgc2xpZGVyLl9lbGVtZW50LnN0eWxlW1wiXCIgKyBzdHlsZV0gPSAkLlNUWUxFLnNsaWRlckxhYmVsc1tcIlwiICsgc3R5bGVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlZjEgPSB0aGlzLnN1YkxheWVycztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBzbGlkZXIgPSByZWYxW2pdO1xuICAgICAgaWYgKCEoc2xpZGVyIGluc3RhbmNlb2YgU2xpZGVyQ29tcG9uZW50ID09PSB0cnVlKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHNsaWRlci5vbihcImNoYW5nZTp2YWx1ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgPSBcInNwcmluZyhcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudGVuc2lvbi52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci5mcmljdGlvbi52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci52ZWxvY2l0eS52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci50b2xlcmFuY2UudmFsdWUgKiAxMDAwKSAvIDEwMDApICsgXCIpXCI7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmN1cnZlUHJvcHNUZXh0LnZhbHVlID0gXCJcXFwiXCIgKyAkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSArIFwiXFxcIlwiO1xuICAgICAgfSk7XG4gICAgICByZXN1bHRzLnB1c2goc2xpZGVyLmtub2Iub24oRXZlbnRzLkRyYWdFbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlVGFyZ2V0KCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5hbmltYXRlVGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgJC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW47XG4gICAgcmV0dXJuICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIuYW5pbWF0ZSgkLkFOSU1BVEUub3B0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIEtpbmV0aWNzO1xuXG59KShMYXllcik7XG4iXX0=
