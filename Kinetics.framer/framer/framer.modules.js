require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Kinetics":[function(require,module,exports){
var $, Kinetics,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Utils.insertCSS("@import url(https://fonts.googleapis.com/css?family=Roboto+Mono);");


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

Utils.insertCSS("@import url(https://fonts.googleapis.com/css?family=Roboto+Mono);");


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zaG10dWNrZXIvR2l0SHViL0tpbmV0aWNzL0tpbmV0aWNzLmZyYW1lci9tb2R1bGVzL0tpbmV0aWNzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2pvc2htdHVja2VyL0dpdEh1Yi9LaW5ldGljcy9LaW5ldGljcy5mcmFtZXIvbW9kdWxlcy9LaW5ldGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLElBQUEsV0FBQTtFQUFBOzZCQUFBOztBQUFBLEtBQUssQ0FBQyxTQUFOLENBQWdCLG1FQUFoQixDQUFBLENBQUE7O0FBRUE7QUFBQSxlQUZBOztBQUFBLENBSUEsR0FDQztBQUFBLEVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxFQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBRHRCO0FBQUEsRUFFQSxPQUFBLEVBQVMsRUFGVDtBQUFBLEVBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxFQUlBLE9BQUEsRUFBUztBQUFBLElBQUMsSUFBQSxFQUFLO0FBQUEsTUFBQyxRQUFBLEVBQVUsRUFBWDtBQUFBLE1BQWUsZUFBQSxFQUFpQixTQUFoQztLQUFOO0FBQUEsSUFBa0QsSUFBQSxFQUFLO0FBQUEsTUFBQyxlQUFBLEVBQWlCLFNBQWxCO0tBQXZEO0dBSlQ7QUFBQSxFQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsRUFNQSxLQUFBLEVBQU87QUFBQSxJQUFDLFlBQUEsRUFBYTtBQUFBLE1BQUMsZ0JBQUEsRUFBa0IsUUFBbkI7QUFBQSxNQUE2QixTQUFBLEVBQVcsWUFBeEM7QUFBQSxNQUFzRCxNQUFBLEVBQVEsNkJBQTlEO0tBQWQ7R0FOUDtBQUFBLEVBT0EsT0FBQSxFQUFTLEVBUFQ7Q0FMRCxDQUFBOztBQUFBLENBY0MsQ0FBQyxRQUFRLENBQUMsS0FBWCxHQUNDO0FBQUEsRUFBQSxJ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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgSW5zZXJ0IEdvb2dsZSBSb2JvdG8gZm9udFxuVXRpbHMuaW5zZXJ0Q1NTKFwiQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PVJvYm90bytNb25vKTtcIilcblxuIyMjIFZBUklBQkxFUyAjIyNcblxuJCA9IFxuXHRLSU5FVElDUzoge31cblx0REVWSUNFOiBGcmFtZXIuRGV2aWNlLnBob25lXG5cdEJVVFRPTlM6IHt9XG5cdFRFWFQ6IHt9XG5cdFNMSURFUlM6IHtrbm9iOntrbm9iU2l6ZTogMjgsIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJ9LCBmaWxsOntiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifX1cblx0TEFCRUxTOiB7fVxuXHRTVFlMRToge3NsaWRlckxhYmVsczp7XCJ2ZXJ0aWNhbC1hbGlnblwiOiBcImNlbnRlclwiLCBcImRpc3BsYXlcIjogXCJ0YWJsZS1jZWxsXCIsIFwiZm9udFwiOiBcIm5vcm1hbCAxMDAgMjZweCBSb2JvdG8gTW9ub1wifX1cblx0QU5JTUFURToge31cblxuJC5LSU5FVElDUy5wcm9wcyA9IFxuXHRtaWRYOiAkLkRFVklDRS53aWR0aC8yIFxuXHRtaWRZOiAkLkRFVklDRS5oZWlnaHQvMiBcblx0d2lkdGg6ICg3MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNzAwICogKDEtJC5ERVZJQ0Uuc2NhbGUpKVxuXHRoZWlnaHQ6ICg0MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNDAwICogKDEtJC5ERVZJQ0Uuc2NhbGUpKVxuXHRzY2FsZTogLjVcblx0b3B0aW9uczogMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzE1MTUxN1wiXG5cdHN1cGVyTGF5ZXI6ICQuREVWSUNFXG5cdHRhcmdldExheWVyOiB7fVxuXG4kLktJTkVUSUNTLm9wZW4gPSBcblx0bGF5ZXI6IG51bGxcblx0cHJvcGVydGllczoge3NjYWxlOiAxLCBvcGFjaXR5OiAxfVxuXHRjdXJ2ZTogXCJzcHJpbmcoMjQ1LCA0MCwgMClcIlxuXHRjdXJ2ZU9wdGlvbnM6IHt9XG5cdHRpbWU6IDFcblx0ZGVsYXk6IDBcblx0cmVwZWF0OiAwXG5cdGRlYnVnOiBmYWxzZVxuXG4kLktJTkVUSUNTLmNsb3NlID0gXG5cdGxheWVyOiBudWxsXG5cdHByb3BlcnRpZXM6IHtzY2FsZTogLjUsIG9wYWNpdHk6IDB9XG5cdGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG5cdGN1cnZlT3B0aW9uczoge31cblx0dGltZTogMVxuXHRkZWxheTogMFxuXHRyZXBlYXQ6IDBcblx0ZGVidWc6IGZhbHNlXG5cbiMg4oCT4oCT4oCTIEJVVFRPTlNcbiQuQlVUVE9OUy5jbG9zZUJ1dHRvbiA9IHttYXhYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMjgsIHk6IDI4LCB3aWR0aDogMjQsIGhlaWdodDogMjQsIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwifVxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwgPSB7bWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoLzIsIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQvMiwgd2lkdGg6IDI0LCBoZWlnaHQ6IDQsIHJvdGF0aW9uOiA0NSwgYm9yZGVyUmFkaXVzOiAxOCwgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn1cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSID0ge21pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aC8yLCBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0LzIsIHdpZHRoOiAyNCwgaGVpZ2h0OiA0LCByb3RhdGlvbjogLTQ1LCBib3JkZXJSYWRpdXM6IDE4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifVxuXG4jIOKAk+KAk+KAkyBURVhUXG4kLlRFWFQuYW5pbWF0ZVByb3BzID0gXG5cdG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMlxuXHR3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDE2MFxuXHRoZWlnaHQ6IDgwXG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiQW5pbWF0ZVByb3BzXCJcblx0aWdub3JlRXZlbnRzOiBmYWxzZVxuXHRwcm9wYWdhdGVFdmVudHM6IGZhbHNlXG5cbiQuVEVYVC5jdXJ2ZVByb3BzID0gXG5cdG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMlxuXHRtYXhZOiAkLktJTkVUSUNTLnByb3BzLmhlaWdodC0yMFxuXHR3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8xLjVcblx0bmFtZTogXCJDdXJ2ZVByb3BzXCJcblx0aGVpZ2h0OiA0MFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXG4jIOKAk+KAk+KAkyBTTElERVJTXG4kLlNMSURFUlMudGVuc2lvbiA9IFxuXHR4OiAyMDBcblx0eTogMTA3XG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG5hbWU6IFwiVGVuc2lvblNsaWRlclwiXG5cdG1pbjogMFxuXHRtYXg6IDEwMDBcblx0dmFsdWU6IDI1MFxuXG4kLlNMSURFUlMuZnJpY3Rpb24gPSBcblx0eDogMjAwXG5cdHk6IDE2MVxuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRuYW1lOiBcIkZyaWN0aW9uU2xpZGVyXCJcblx0bWluOiAwXG5cdG1heDogMTAwXG5cdHZhbHVlOiA0NVxuXG4kLlNMSURFUlMudmVsb2NpdHkgPSBcblx0eDogMjAwXG5cdHk6IDIxNVxuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRuYW1lOiBcIlZlbG9jaXR5U2xpZGVyXCJcblx0bWluOiAwXG5cdG1heDogMTBcblx0dmFsdWU6IDBcblxuJC5TTElERVJTLnRvbGVyYW5jZSA9IFxuXHR4OiAyMDBcblx0eTogMjY5XG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG5hbWU6IFwiVG9sZXJhbmNlU2xpZGVyXCJcblx0bWluOiAwLjAwMVxuXHRtYXg6IDFcblx0dmFsdWU6IDAuMDAxXG5cbiMg4oCT4oCT4oCTIExBQkVMU1xuJC5MQUJFTFMudGVuc2lvbiA9IFxuXHR4OiAyMFxuXHR5OiA5MlxuXHR3aWR0aDogMTEwXG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJUZW5zaW9uTGFiZWxcIlxuXG4kLkxBQkVMUy5mcmljdGlvbiA9IFxuXHR4OiAyMFxuXHR5OiAxNDZcblx0d2lkdGg6IDEyNVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiRnJpY3Rpb25MYWJlbFwiXG5cbiQuTEFCRUxTLnZlbG9jaXR5ID0gXG5cdHg6IDIwXG5cdHk6IDIwMFxuXHR3aWR0aDogMTI1XG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJWZWxvY2l0eUxhYmVsXCJcblxuJC5MQUJFTFMudG9sZXJhbmNlID0gXG5cdHg6IDIwXG5cdHk6IDI1NFxuXHR3aWR0aDogMTQxXG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJUb2xlcmFuY2VMYWJlbFwiXG5cbiMg4oCT4oCT4oCTIEFOSU1BVEVcbiQuQU5JTUFURS5vcHRpb25zID1cblx0bGF5ZXI6IG51bGxcblx0cHJvcGVydGllczoge31cblx0Y3VydmU6IFwic3ByaW5nKDI1MCwgNDUsIDAsIC4wMDFcIlxuXHRjdXJ2ZU9wdGlvbnM6IHt9XG5cdHRpbWU6IDFcblx0ZGVsYXk6IDBcblx0cmVwZWF0OiAwXG5cdGRlYnVnOiBmYWxzZVxuXG4jIERpc2FibGUgY2xpcCBvbiBkZXZpY2VcbkZyYW1lci5EZXZpY2UucGhvbmUuY2xpcCA9IGZhbHNlXG5cbkZyYW1lci5DdXJyZW50Q29udGV4dC5vbiBcImxheWVyOmNyZWF0ZVwiLCAobGF5ZXIpIC0+XG5cdGxheWVyLm9uIEV2ZW50cy5DbGljaywgKGUsIGxheWVyKSAtPlxuXHRcdCMgT25seSBvbiBhbiBhbHQob3B0aW9uKSArIGNsaWNrXG5cdFx0aWYgZS5hbHRLZXkgYW5kIGxheWVyIGluc3RhbmNlb2YgS2luZXRpY3MgaXMgZmFsc2UgYW5kIGxheWVyLnN1cGVyTGF5ZXIgaXNudCAkLktJTkVUSUNTLmxheWVyXG5cblx0XHRcdCMgRGVzdHJveSBpZiBsYXllciBhbHJlYWR5IGV4aXN0c1xuXHRcdFx0aWYgJC5LSU5FVElDUy5sYXllciB0aGVuICQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpXG5cdFx0XHRcblx0XHRcdCMgQ3JlYXRlIEtpbmV0aWNzIGxheWVyXG5cdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyID0gbGF5ZXJcblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW4gPSBsYXllci5wcm9wc1xuXHRcdFx0bmV3IEtpbmV0aWNzICQuS0lORVRJQ1MucHJvcHNcblxuXHRcdFx0IyMjXG5cblx0XHRcdFRPRE86IElzIHRoZXJlIGEgd2F5IHRvIHJlbW92ZSBtb3VzZWV2ZW50IGxpc3RlbmVycyBvbiBsYXllcnMgc28gdGhlcmUncyBubyBjb25mbGljdD9cblxuXHRcdFx0IyMjXG5cblx0XHRcdCMgU2hvdyBLaW5ldGljcyB3aW5kb3dcblx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSAkLktJTkVUSUNTLm9wZW5cblxuY2xhc3MgS2luZXRpY3MgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBSZWZlcmVuY2UgS2luZXRpY3Ncblx0XHQkLktJTkVUSUNTLmxheWVyID0gQFxuXG5cdFx0QGRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZVxuXHRcdEBkcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXG5cdFx0IyBBZGQgY2xvc2UgYnV0dG9uXG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uLnN1cGVyTGF5ZXIgPSBAXG5cdFx0QGNsb3NlQnV0dG9uID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblxuXHRcdFx0XG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uWEwuc3VwZXJMYXllciA9IEBjbG9zZUJ1dHRvblxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSLnN1cGVyTGF5ZXIgPSBAY2xvc2VCdXR0b25cblx0XHRAY2xvc2VCdXR0b25YTCA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25YTFxuXHRcdEBjbG9zZUJ1dHRvblhSID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSXG5cblx0XHQjIOKAk+KAk+KAkyBFVkVOVFNcblx0XHQjIEFkanVzdCBzaXplIG9mIEtpbmV0aWNzIHdpbmRvdyB3aXRoIG9wdGlvbiArIHBsdXMgb3Igb3B0aW9uICsgbWludXNcblx0XHRrZXlzID0gW11cblx0XHRkb2N1bWVudC5vbmtleWRvd24gPSBkb2N1bWVudC5vbmtleXVwID0gKGUpIC0+XG5cdFx0XHRrZXlzW2Uua2V5Q29kZV0gPSBlLnR5cGUgPT0gXCJrZXlkb3duXCJcblxuXHRcdFx0IyAxOCA9IE9wdGlvbiBrZXlcblx0XHRcdCMgMTg3ID0gKyBrZXlcblx0XHRcdCMgMTg5ID0gLSBrZXlcblxuXHRcdFx0IyBTY2FsZSB1cFxuXHRcdFx0aWYga2V5c1sxOF0gYW5kIGtleXNbMTg3XVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0c2NhbGU6ICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgKyAuMjVcblx0XHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIlxuXHRcdFx0ZWxzZSBpZiBrZXlzWzE4XSBhbmQga2V5c1sxODldXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRzY2FsZTogJC5LSU5FVElDUy5sYXllci5zY2FsZSAtIC4yNVxuXHRcdFx0XHRcdGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPSAuMjUgaWYgJC5LSU5FVElDUy5sYXllci5zY2FsZSA8IC4yNVxuXG5cdFx0QGNsb3NlQnV0dG9uLm9uIEV2ZW50cy5DbGljaywgLT5cblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luXG5cblx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSAkLktJTkVUSUNTLmNsb3NlXG5cblx0XHRcdFV0aWxzLmRlbGF5IC41LCAtPlxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKVxuXG5cdFx0QHNldHVwVGV4dCgpXG5cdFx0QHNldHVwU2xpZGVycygpXG5cblx0c2V0dXBUZXh0OiAtPlxuXHRcdCMgU2V0dXAgc3VwZXJMYXllclxuXHRcdGZvciB0ZXh0IG9mICQuVEVYVCB3aGVuIHRleHQgaXNudCBcImlucHV0XCJcblx0XHRcdCQuVEVYVFtcIiN7dGV4dH1cIl0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXJcblxuXHRcdCMg4oCT4oCT4oCTIEFOSU1BVEUgUFJPUEVSVElFU1xuXHRcdEBhbmltYXRlUHJvcHMgPSBuZXcgTGF5ZXIgJC5URVhULmFuaW1hdGVQcm9wc1xuXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wid2lkdGhcIl0gPSBcIiN7QGFuaW1hdGVQcm9wcy53aWR0aH1weFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiaGVpZ2h0XCJdID0gXCIje0BhbmltYXRlUHJvcHMuaGVpZ2h0fXB4XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250XCJdID0gXCJub3JtYWwgNDAwIDI2cHggUm9ib3RvIE1vbm9cIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcInRleHQtYWxpZ25cIl0gPSBcImNlbnRlclwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udC1zaXplXCJdID0gXCIyNnB4XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJjb2xvclwiXSA9IFwid2hpdGVcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIi13ZWtpdC11c2VyLXNlbGVjdFwiXSA9IFwidGV4dFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXSA9IFwiI3skLktJTkVUSUNTLmxheWVyLmJhY2tncm91bmRDb2xvcn1cIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCJcblxuXHRcdEBhbmltYXRlUHJvcHMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQGFuaW1hdGVQcm9wc0lucHV0KVxuXG5cdFx0IyDigJPigJPigJMgQ1VSVkUgUFJPUEVSVElFU1xuXG5cdFx0IyMjXG5cblx0XHRUT0RPOiBNYWtlIGN1cnZlIHByb3BzIGFuIGlucHV0IHdoZXJlIHlvdSBjYW4gdHlwZSBpbiBpdCBpZiB5b3Ugd2lzaCAoYWRqdXN0cyBrbm9iIHZhbHVlcylcblx0XHRCVUcgKHNlbWkpOiBjdXJ2ZVByb3BzIGlzIGVkaXRhYmxlXG5cblx0XHQjIyNcblxuXG5cdFx0QGN1cnZlUHJvcHMgPSBuZXcgTGF5ZXIgJC5URVhULmN1cnZlUHJvcHNcblxuXHRcdEBjdXJ2ZVByb3BzVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKVxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcIndpZHRoXCJdID0gXCIje0BjdXJ2ZVByb3BzLndpZHRofXB4XCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJoZWlnaHRcIl0gPSBcIiN7QGN1cnZlUHJvcHMuaGVpZ2h0fXB4XCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJ0ZXh0LWFsaWduXCJdID0gXCJjZW50ZXJcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImxpbmUtaGVpZ2h0XCJdID0gXCIzNHB4XCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJjb2xvclwiXSA9IFwiI0EwRTM1RlwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiZm9udFwiXSA9IFwiNDAwIDI4cHggUm9ib3RvIE1vbm9cIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcInRyYW5zcGFyZW50XCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJib3JkZXJcIl0gPSBcIm5vbmVcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcInJlc2l6ZVwiXSA9IFwibm9uZVwiXG5cblx0XHRAY3VydmVQcm9wc1RleHQudmFsdWUgPSBcIlxcXCIjeyQuQU5JTUFURS5vcHRpb25zLmN1cnZlfVxcXCJcIlxuXG5cdFx0QGN1cnZlUHJvcHMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQGN1cnZlUHJvcHNUZXh0KVxuXG5cblx0XHQjIOKAk+KAk+KAkyBFVkVOVFNcblx0XHQjIFNlbGVjdCBpbnB1dFxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5vbmNsaWNrID0gLT5cblx0XHRcdEBmb2N1cygpXG5cdFx0XHRAcGxhY2Vob2xkZXIgPSBcIiBcIlxuXG5cdFx0IyBSZXBsYWNlIHBsYWNlaG9sZGVyXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0Lm9uYmx1ciA9IC0+XG5cdFx0XHRAcGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiXG5cblx0XHQjIFN1Ym1pdHRpbmcgYW5pbWF0aW9uIHByb3BlcnRpZXNcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQub25rZXl1cCA9IChlKSAtPlxuXHRcdFx0aWYgZS5rZXlDb2RlIGlzIDEzXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiXG5cblx0XHRcdFx0aWYgJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZSBpc250IFwiXCJcblxuXHRcdFx0XHRcdHJlZ2V4ID0gLyhcXFMqXFx3KS9nXG5cblx0XHRcdFx0XHRvcHRpb25zID0gJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZS5tYXRjaChyZWdleClcblxuXHRcdFx0XHRcdGZvciBvcHRpb24gaW4gb3B0aW9uc1xuXHRcdFx0XHRcdFx0aW5kZXggPSBfLmluZGV4T2Yob3B0aW9ucywgb3B0aW9uKVxuXHRcdFx0XHRcdFx0aWYgaW5kZXggJSAyIGlzIDBcblx0XHRcdFx0XHRcdFx0JC5BTklNQVRFLm9wdGlvbnMucHJvcGVydGllc1tcIiN7b3B0aW9ufVwiXSA9IG9wdGlvbnNbaW5kZXgrMV1cblxuXHRcdFx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luXG5cblx0XHQjIFNlbGVjdCBjdXJ2ZSB2YWx1ZVxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5vbmNsaWNrID0gLT5cblx0XHRcdEBzZWxlY3QoKVxuXG5cdHNldHVwU2xpZGVyczogLT5cblx0XHQjIFNldCBzdXBlckxheWVyIGZvciBzbGlkZXJzXG5cdFx0Zm9yIHNsaWRlciBvZiAkLlNMSURFUlMgd2hlbiBzbGlkZXIgaXNudCBcImtub2JcIlxuXHRcdFx0JC5TTElERVJTW1wiI3tzbGlkZXJ9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIFNldCBzdXBlckxheWVyIGZvciBsYWJlbHNcblx0XHRmb3IgbGFiZWwgb2YgJC5MQUJFTFNcblx0XHRcdCQuTEFCRUxTW1wiI3tsYWJlbH1cIl0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXJcblxuXHRcdCMg4oCT4oCT4oCTIFRFTlNJT05cblx0XHRAdGVuc2lvbiA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnRlbnNpb25cblx0XHRAdGVuc2lvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplXG5cdFx0QHRlbnNpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdGVuc2lvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QHRlbnNpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEB0ZW5zaW9uTGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudGVuc2lvblxuXHRcdEB0ZW5zaW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHRlbnNpb25MYWJlbC53aWR0aCcgaGVpZ2h0PSdAdGVuc2lvbkxhYmVsLmhlaWdodCc+I3tAdGVuc2lvbkxhYmVsLm5hbWV9PC9kaXY+XCJcblxuXHRcdCMg4oCT4oCT4oCTIEZSSUNUSU9OXG5cblx0XHRAZnJpY3Rpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy5mcmljdGlvblxuXHRcdEBmcmljdGlvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplXG5cdFx0QGZyaWN0aW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QGZyaWN0aW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAZnJpY3Rpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEBmcmljdGlvbkxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLmZyaWN0aW9uXG5cdFx0QGZyaWN0aW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQGZyaWN0aW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQGZyaWN0aW9uTGFiZWwuaGVpZ2h0Jz4je0BmcmljdGlvbkxhYmVsLm5hbWV9PC9kaXY+XCJcblxuXHRcdCMg4oCT4oCT4oCTIFZFTE9DSVRZXG5cdFx0QHZlbG9jaXR5ID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMudmVsb2NpdHlcblx0XHRAdmVsb2NpdHkua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB2ZWxvY2l0eS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEB2ZWxvY2l0eS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QHZlbG9jaXR5LmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdmVsb2NpdHlMYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy52ZWxvY2l0eVxuXHRcdEB2ZWxvY2l0eUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B2ZWxvY2l0eUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B2ZWxvY2l0eUxhYmVsLmhlaWdodCc+I3tAdmVsb2NpdHlMYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBUT0xFUkFOQ0Vcblx0XHRAdG9sZXJhbmNlID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMudG9sZXJhbmNlXG5cdFx0QHRvbGVyYW5jZS5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplXG5cdFx0QHRvbGVyYW5jZS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEB0b2xlcmFuY2Uua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB0b2xlcmFuY2UuZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEB0b2xlcmFuY2VMYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy50b2xlcmFuY2Vcblx0XHRAdG9sZXJhbmNlTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHRvbGVyYW5jZUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B0b2xlcmFuY2VMYWJlbC5oZWlnaHQnPiN7QHRvbGVyYW5jZUxhYmVsLm5hbWV9PC9kaXY+XCJcblxuXHRcdCMgU2V0IHN0eWxlIGZvciBhbGwgdGhlIGxhYmVsc1xuXHRcdGZvciBzbGlkZXIgaW4gJC5LSU5FVElDUy5sYXllci5zdWJMYXllcnMgd2hlbiBzbGlkZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIkxheWVyXCJcblx0XHRcdGZvciBzdHlsZSBvZiAkLlNUWUxFLnNsaWRlckxhYmVscyBcblx0XHRcdFx0c2xpZGVyLl9lbGVtZW50LnN0eWxlW1wiI3tzdHlsZX1cIl0gPSAkLlNUWUxFLnNsaWRlckxhYmVsc1tcIiN7c3R5bGV9XCJdXG5cblx0XHQjIOKAk+KAk+KAkyBFVkVOVFNcblx0XHRmb3Igc2xpZGVyIGluIEBzdWJMYXllcnMgd2hlbiBzbGlkZXIgaW5zdGFuY2VvZiBTbGlkZXJDb21wb25lbnQgaXMgdHJ1ZVxuXHRcdFx0c2xpZGVyLm9uIFwiY2hhbmdlOnZhbHVlXCIsIC0+XG5cdFx0XHRcdCQuQU5JTUFURS5vcHRpb25zLmN1cnZlID0gXCJzcHJpbmcoI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudGVuc2lvbi52YWx1ZSl9LCAje01hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci5mcmljdGlvbi52YWx1ZSl9LCAje01hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci52ZWxvY2l0eS52YWx1ZSl9LCAje01hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci50b2xlcmFuY2UudmFsdWUgKiAxMDAwKS8xMDAwfSlcIlxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmN1cnZlUHJvcHNUZXh0LnZhbHVlID0gXCJcXFwiI3skLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZX1cXFwiXCJcblxuXHRcdFx0c2xpZGVyLmtub2Iub24gRXZlbnRzLkRyYWdFbmQsIC0+XG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVRhcmdldCgpXG5cblx0YW5pbWF0ZVRhcmdldDogLT5cblx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpblxuXHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIuYW5pbWF0ZSAkLkFOSU1BVEUub3B0aW9uc1xuXG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOS4xXG52YXIgJCwgS2luZXRpY3MsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5VdGlscy5pbnNlcnRDU1MoXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvK01vbm8pO1wiKTtcblxuXG4vKiBWQVJJQUJMRVMgKi9cblxuJCA9IHtcbiAgS0lORVRJQ1M6IHt9LFxuICBERVZJQ0U6IEZyYW1lci5EZXZpY2UucGhvbmUsXG4gIEJVVFRPTlM6IHt9LFxuICBURVhUOiB7fSxcbiAgU0xJREVSUzoge1xuICAgIGtub2I6IHtcbiAgICAgIGtub2JTaXplOiAyOCxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbiAgICB9LFxuICAgIGZpbGw6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbiAgICB9XG4gIH0sXG4gIExBQkVMUzoge30sXG4gIFNUWUxFOiB7XG4gICAgc2xpZGVyTGFiZWxzOiB7XG4gICAgICBcInZlcnRpY2FsLWFsaWduXCI6IFwiY2VudGVyXCIsXG4gICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jZWxsXCIsXG4gICAgICBcImZvbnRcIjogXCJub3JtYWwgMTAwIDI2cHggUm9ib3RvIE1vbm9cIlxuICAgIH1cbiAgfSxcbiAgQU5JTUFURToge31cbn07XG5cbiQuS0lORVRJQ1MucHJvcHMgPSB7XG4gIG1pZFg6ICQuREVWSUNFLndpZHRoIC8gMixcbiAgbWlkWTogJC5ERVZJQ0UuaGVpZ2h0IC8gMixcbiAgd2lkdGg6ICg3MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNzAwICogKDEgLSAkLkRFVklDRS5zY2FsZSkpLFxuICBoZWlnaHQ6ICg0MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNDAwICogKDEgLSAkLkRFVklDRS5zY2FsZSkpLFxuICBzY2FsZTogLjUsXG4gIG9wdGlvbnM6IDAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjMTUxNTE3XCIsXG4gIHN1cGVyTGF5ZXI6ICQuREVWSUNFLFxuICB0YXJnZXRMYXllcjoge31cbn07XG5cbiQuS0lORVRJQ1Mub3BlbiA9IHtcbiAgbGF5ZXI6IG51bGwsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzY2FsZTogMSxcbiAgICBvcGFjaXR5OiAxXG4gIH0sXG4gIGN1cnZlOiBcInNwcmluZygyNDUsIDQwLCAwKVwiLFxuICBjdXJ2ZU9wdGlvbnM6IHt9LFxuICB0aW1lOiAxLFxuICBkZWxheTogMCxcbiAgcmVwZWF0OiAwLFxuICBkZWJ1ZzogZmFsc2Vcbn07XG5cbiQuS0lORVRJQ1MuY2xvc2UgPSB7XG4gIGxheWVyOiBudWxsLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc2NhbGU6IC41LFxuICAgIG9wYWNpdHk6IDBcbiAgfSxcbiAgY3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCIsXG4gIGN1cnZlT3B0aW9uczoge30sXG4gIHRpbWU6IDEsXG4gIGRlbGF5OiAwLFxuICByZXBlYXQ6IDAsXG4gIGRlYnVnOiBmYWxzZVxufTtcblxuJC5CVVRUT05TLmNsb3NlQnV0dG9uID0ge1xuICBtYXhYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMjgsXG4gIHk6IDI4LFxuICB3aWR0aDogMjQsXG4gIGhlaWdodDogMjQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG59O1xuXG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YTCA9IHtcbiAgbWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoIC8gMixcbiAgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodCAvIDIsXG4gIHdpZHRoOiAyNCxcbiAgaGVpZ2h0OiA0LFxuICByb3RhdGlvbjogNDUsXG4gIGJvcmRlclJhZGl1czogMTgsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbn07XG5cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSID0ge1xuICBtaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGggLyAyLFxuICBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0IC8gMixcbiAgd2lkdGg6IDI0LFxuICBoZWlnaHQ6IDQsXG4gIHJvdGF0aW9uOiAtNDUsXG4gIGJvcmRlclJhZGl1czogMTgsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbn07XG5cbiQuVEVYVC5hbmltYXRlUHJvcHMgPSB7XG4gIG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAyLFxuICB3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDE2MCxcbiAgaGVpZ2h0OiA4MCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiQW5pbWF0ZVByb3BzXCIsXG4gIGlnbm9yZUV2ZW50czogZmFsc2UsXG4gIHByb3BhZ2F0ZUV2ZW50czogZmFsc2Vcbn07XG5cbiQuVEVYVC5jdXJ2ZVByb3BzID0ge1xuICBtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC8gMixcbiAgbWF4WTogJC5LSU5FVElDUy5wcm9wcy5oZWlnaHQgLSAyMCxcbiAgd2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAxLjUsXG4gIG5hbWU6IFwiQ3VydmVQcm9wc1wiLFxuICBoZWlnaHQ6IDQwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxufTtcblxuJC5TTElERVJTLnRlbnNpb24gPSB7XG4gIHg6IDIwMCxcbiAgeTogMTA3LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBuYW1lOiBcIlRlbnNpb25TbGlkZXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwMDAsXG4gIHZhbHVlOiAyNTBcbn07XG5cbiQuU0xJREVSUy5mcmljdGlvbiA9IHtcbiAgeDogMjAwLFxuICB5OiAxNjEsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiRnJpY3Rpb25TbGlkZXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwMCxcbiAgdmFsdWU6IDQ1XG59O1xuXG4kLlNMSURFUlMudmVsb2NpdHkgPSB7XG4gIHg6IDIwMCxcbiAgeTogMjE1LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBuYW1lOiBcIlZlbG9jaXR5U2xpZGVyXCIsXG4gIG1pbjogMCxcbiAgbWF4OiAxMCxcbiAgdmFsdWU6IDBcbn07XG5cbiQuU0xJREVSUy50b2xlcmFuY2UgPSB7XG4gIHg6IDIwMCxcbiAgeTogMjY5LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBuYW1lOiBcIlRvbGVyYW5jZVNsaWRlclwiLFxuICBtaW46IDAuMDAxLFxuICBtYXg6IDEsXG4gIHZhbHVlOiAwLjAwMVxufTtcblxuJC5MQUJFTFMudGVuc2lvbiA9IHtcbiAgeDogMjAsXG4gIHk6IDkyLFxuICB3aWR0aDogMTEwLFxuICBoZWlnaHQ6IDM0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJUZW5zaW9uTGFiZWxcIlxufTtcblxuJC5MQUJFTFMuZnJpY3Rpb24gPSB7XG4gIHg6IDIwLFxuICB5OiAxNDYsXG4gIHdpZHRoOiAxMjUsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIkZyaWN0aW9uTGFiZWxcIlxufTtcblxuJC5MQUJFTFMudmVsb2NpdHkgPSB7XG4gIHg6IDIwLFxuICB5OiAyMDAsXG4gIHdpZHRoOiAxMjUsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlZlbG9jaXR5TGFiZWxcIlxufTtcblxuJC5MQUJFTFMudG9sZXJhbmNlID0ge1xuICB4OiAyMCxcbiAgeTogMjU0LFxuICB3aWR0aDogMTQxLFxuICBoZWlnaHQ6IDM0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJUb2xlcmFuY2VMYWJlbFwiXG59O1xuXG4kLkFOSU1BVEUub3B0aW9ucyA9IHtcbiAgbGF5ZXI6IG51bGwsXG4gIHByb3BlcnRpZXM6IHt9LFxuICBjdXJ2ZTogXCJzcHJpbmcoMjUwLCA0NSwgMCwgLjAwMVwiLFxuICBjdXJ2ZU9wdGlvbnM6IHt9LFxuICB0aW1lOiAxLFxuICBkZWxheTogMCxcbiAgcmVwZWF0OiAwLFxuICBkZWJ1ZzogZmFsc2Vcbn07XG5cbkZyYW1lci5EZXZpY2UucGhvbmUuY2xpcCA9IGZhbHNlO1xuXG5GcmFtZXIuQ3VycmVudENvbnRleHQub24oXCJsYXllcjpjcmVhdGVcIiwgZnVuY3Rpb24obGF5ZXIpIHtcbiAgcmV0dXJuIGxheWVyLm9uKEV2ZW50cy5DbGljaywgZnVuY3Rpb24oZSwgbGF5ZXIpIHtcbiAgICBpZiAoZS5hbHRLZXkgJiYgbGF5ZXIgaW5zdGFuY2VvZiBLaW5ldGljcyA9PT0gZmFsc2UgJiYgbGF5ZXIuc3VwZXJMYXllciAhPT0gJC5LSU5FVElDUy5sYXllcikge1xuICAgICAgaWYgKCQuS0lORVRJQ1MubGF5ZXIpIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgICAkLktJTkVUSUNTLnRhcmdldExheWVyID0gbGF5ZXI7XG4gICAgICAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luID0gbGF5ZXIucHJvcHM7XG4gICAgICBuZXcgS2luZXRpY3MoJC5LSU5FVElDUy5wcm9wcyk7XG5cbiAgICAgIC8qXG4gICAgICBcbiAgICAgIFx0XHRcdFRPRE86IElzIHRoZXJlIGEgd2F5IHRvIHJlbW92ZSBtb3VzZWV2ZW50IGxpc3RlbmVycyBvbiBsYXllcnMgc28gdGhlcmUncyBubyBjb25mbGljdD9cbiAgICAgICAqL1xuICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSgkLktJTkVUSUNTLm9wZW4pO1xuICAgIH1cbiAgfSk7XG59KTtcblxuS2luZXRpY3MgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoS2luZXRpY3MsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEtpbmV0aWNzKG9wdGlvbnMpIHtcbiAgICB2YXIga2V5cztcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIEtpbmV0aWNzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICQuS0lORVRJQ1MubGF5ZXIgPSB0aGlzO1xuICAgIHRoaXMuZHJhZ2dhYmxlLmVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uLnN1cGVyTGF5ZXIgPSB0aGlzO1xuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBuZXcgTGF5ZXIoJC5CVVRUT05TLmNsb3NlQnV0dG9uKTtcbiAgICAkLkJVVFRPTlMuY2xvc2VCdXR0b25YTC5zdXBlckxheWVyID0gdGhpcy5jbG9zZUJ1dHRvbjtcbiAgICAkLkJVVFRPTlMuY2xvc2VCdXR0b25YUi5zdXBlckxheWVyID0gdGhpcy5jbG9zZUJ1dHRvbjtcbiAgICB0aGlzLmNsb3NlQnV0dG9uWEwgPSBuZXcgTGF5ZXIoJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwpO1xuICAgIHRoaXMuY2xvc2VCdXR0b25YUiA9IG5ldyBMYXllcigkLkJVVFRPTlMuY2xvc2VCdXR0b25YUik7XG4gICAga2V5cyA9IFtdO1xuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGRvY3VtZW50Lm9ua2V5dXAgPSBmdW5jdGlvbihlKSB7XG4gICAgICBrZXlzW2Uua2V5Q29kZV0gPSBlLnR5cGUgPT09IFwia2V5ZG93blwiO1xuICAgICAgaWYgKGtleXNbMThdICYmIGtleXNbMTg3XSkge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKTtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgc2NhbGU6ICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgKyAuMjVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChrZXlzWzE4XSAmJiBrZXlzWzE4OV0pIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKCk7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgc2NhbGU6ICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgLSAuMjVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoJC5LSU5FVElDUy5sYXllci5zY2FsZSA8IC4yNSkge1xuICAgICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLnNjYWxlID0gLjI1O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uLm9uKEV2ZW50cy5DbGljaywgZnVuY3Rpb24oKSB7XG4gICAgICAkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbjtcbiAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSgkLktJTkVUSUNTLmNsb3NlKTtcbiAgICAgIHJldHVybiBVdGlscy5kZWxheSguNSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0dXBUZXh0KCk7XG4gICAgdGhpcy5zZXR1cFNsaWRlcnMoKTtcbiAgfVxuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5zZXR1cFRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGV4dDtcbiAgICBmb3IgKHRleHQgaW4gJC5URVhUKSB7XG4gICAgICBpZiAodGV4dCAhPT0gXCJpbnB1dFwiKSB7XG4gICAgICAgICQuVEVYVFtcIlwiICsgdGV4dF0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYW5pbWF0ZVByb3BzID0gbmV3IExheWVyKCQuVEVYVC5hbmltYXRlUHJvcHMpO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIndpZHRoXCJdID0gdGhpcy5hbmltYXRlUHJvcHMud2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImhlaWdodFwiXSA9IHRoaXMuYW5pbWF0ZVByb3BzLmhlaWdodCArIFwicHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udFwiXSA9IFwibm9ybWFsIDQwMCAyNnB4IFJvYm90byBNb25vXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcInRleHQtYWxpZ25cIl0gPSBcImNlbnRlclwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjI2cHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiY29sb3JcIl0gPSBcIndoaXRlXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIi13ZWtpdC11c2VyLXNlbGVjdFwiXSA9IFwidGV4dFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCJcIiArICQuS0lORVRJQ1MubGF5ZXIuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQpO1xuXG4gICAgLypcbiAgICBcbiAgICBcdFx0VE9ETzogTWFrZSBjdXJ2ZSBwcm9wcyBhbiBpbnB1dCB3aGVyZSB5b3UgY2FuIHR5cGUgaW4gaXQgaWYgeW91IHdpc2ggKGFkanVzdHMga25vYiB2YWx1ZXMpXG4gICAgXHRcdEJVRyAoc2VtaSk6IGN1cnZlUHJvcHMgaXMgZWRpdGFibGVcbiAgICAgKi9cbiAgICB0aGlzLmN1cnZlUHJvcHMgPSBuZXcgTGF5ZXIoJC5URVhULmN1cnZlUHJvcHMpO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcIndpZHRoXCJdID0gdGhpcy5jdXJ2ZVByb3BzLndpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJoZWlnaHRcIl0gPSB0aGlzLmN1cnZlUHJvcHMuaGVpZ2h0ICsgXCJweFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJ0ZXh0LWFsaWduXCJdID0gXCJjZW50ZXJcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wibGluZS1oZWlnaHRcIl0gPSBcIjM0cHhcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiY29sb3JcIl0gPSBcIiNBMEUzNUZcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiZm9udFwiXSA9IFwiNDAwIDI4cHggUm9ib3RvIE1vbm9cIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXSA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiYm9yZGVyXCJdID0gXCJub25lXCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcInJlc2l6ZVwiXSA9IFwibm9uZVwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQudmFsdWUgPSBcIlxcXCJcIiArICQuQU5JTUFURS5vcHRpb25zLmN1cnZlICsgXCJcXFwiXCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY3VydmVQcm9wc1RleHQpO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXIgPSBcIiBcIjtcbiAgICB9O1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25ibHVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCI7XG4gICAgfTtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0Lm9ua2V5dXAgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgaSwgaW5kZXgsIGxlbiwgb3B0aW9uLCBvcHRpb25zLCByZWdleDtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpO1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIjtcbiAgICAgICAgaWYgKCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICByZWdleCA9IC8oXFxTKlxcdykvZztcbiAgICAgICAgICBvcHRpb25zID0gJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgb3B0aW9uID0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgIGluZGV4ID0gXy5pbmRleE9mKG9wdGlvbnMsIG9wdGlvbik7XG4gICAgICAgICAgICBpZiAoaW5kZXggJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICQuQU5JTUFURS5vcHRpb25zLnByb3BlcnRpZXNbXCJcIiArIG9wdGlvbl0gPSBvcHRpb25zW2luZGV4ICsgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuY3VydmVQcm9wc1RleHQub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KCk7XG4gICAgfTtcbiAgfTtcblxuICBLaW5ldGljcy5wcm90b3R5cGUuc2V0dXBTbGlkZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGosIGxhYmVsLCBsZW4sIGxlbjEsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2xpZGVyLCBzdHlsZTtcbiAgICBmb3IgKHNsaWRlciBpbiAkLlNMSURFUlMpIHtcbiAgICAgIGlmIChzbGlkZXIgIT09IFwia25vYlwiKSB7XG4gICAgICAgICQuU0xJREVSU1tcIlwiICsgc2xpZGVyXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsYWJlbCBpbiAkLkxBQkVMUykge1xuICAgICAgJC5MQUJFTFNbXCJcIiArIGxhYmVsXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICB9XG4gICAgdGhpcy50ZW5zaW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMudGVuc2lvbik7XG4gICAgdGhpcy50ZW5zaW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy50ZW5zaW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudGVuc2lvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudGVuc2lvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRlbnNpb25MYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy50ZW5zaW9uKTtcbiAgICB0aGlzLnRlbnNpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdGVuc2lvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0B0ZW5zaW9uTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudGVuc2lvbkxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHRoaXMuZnJpY3Rpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy5mcmljdGlvbik7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMuZnJpY3Rpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMuZnJpY3Rpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5mcmljdGlvbkxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLmZyaWN0aW9uKTtcbiAgICB0aGlzLmZyaWN0aW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQGZyaWN0aW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQGZyaWN0aW9uTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMuZnJpY3Rpb25MYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMudmVsb2NpdHkpO1xuICAgIHRoaXMudmVsb2NpdHkua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnZlbG9jaXR5Lmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudmVsb2NpdHkua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLnZlbG9jaXR5LmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudmVsb2NpdHlMYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy52ZWxvY2l0eSk7XG4gICAgdGhpcy52ZWxvY2l0eUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B2ZWxvY2l0eUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B2ZWxvY2l0eUxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLnZlbG9jaXR5TGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgdGhpcy50b2xlcmFuY2UgPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy50b2xlcmFuY2UpO1xuICAgIHRoaXMudG9sZXJhbmNlLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLnRvbGVyYW5jZS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRvbGVyYW5jZUxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnRvbGVyYW5jZSk7XG4gICAgdGhpcy50b2xlcmFuY2VMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdG9sZXJhbmNlTGFiZWwud2lkdGgnIGhlaWdodD0nQHRvbGVyYW5jZUxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLnRvbGVyYW5jZUxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHJlZiA9ICQuS0lORVRJQ1MubGF5ZXIuc3ViTGF5ZXJzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2xpZGVyID0gcmVmW2ldO1xuICAgICAgaWYgKHNsaWRlci5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkxheWVyXCIpIHtcbiAgICAgICAgZm9yIChzdHlsZSBpbiAkLlNUWUxFLnNsaWRlckxhYmVscykge1xuICAgICAgICAgIHNsaWRlci5fZWxlbWVudC5zdHlsZVtcIlwiICsgc3R5bGVdID0gJC5TVFlMRS5zbGlkZXJMYWJlbHNbXCJcIiArIHN0eWxlXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWYxID0gdGhpcy5zdWJMYXllcnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgc2xpZGVyID0gcmVmMVtqXTtcbiAgICAgIGlmICghKHNsaWRlciBpbnN0YW5jZW9mIFNsaWRlckNvbXBvbmVudCA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBzbGlkZXIub24oXCJjaGFuZ2U6dmFsdWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICQuQU5JTUFURS5vcHRpb25zLmN1cnZlID0gXCJzcHJpbmcoXCIgKyAoTWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRlbnNpb24udmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIuZnJpY3Rpb24udmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudmVsb2NpdHkudmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudG9sZXJhbmNlLnZhbHVlICogMTAwMCkgLyAxMDAwKSArIFwiKVwiO1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5jdXJ2ZVByb3BzVGV4dC52YWx1ZSA9IFwiXFxcIlwiICsgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgKyBcIlxcXCJcIjtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0cy5wdXNoKHNsaWRlci5rbm9iLm9uKEV2ZW50cy5EcmFnRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVRhcmdldCgpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBLaW5ldGljcy5wcm90b3R5cGUuYW5pbWF0ZVRhcmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgIHJldHVybiAkLktJTkVUSUNTLnRhcmdldExheWVyLmFuaW1hdGUoJC5BTklNQVRFLm9wdGlvbnMpO1xuICB9O1xuXG4gIHJldHVybiBLaW5ldGljcztcblxufSkoTGF5ZXIpO1xuIl19
