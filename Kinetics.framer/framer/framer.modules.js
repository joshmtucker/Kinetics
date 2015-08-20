require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Kinetics":[function(require,module,exports){

/* VARIABLES */
var $, Kinetics,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
  scale: 0,
  backgroundColor: "#151517",
  superLayer: $.DEVICE,
  targetLayer: {}
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
  ignoreEvents: false,
  propagateEvents: false
};

$.TEXT.curveProps = {
  midX: $.KINETICS.props.width / 2,
  maxY: $.KINETICS.props.height - 20,
  width: $.KINETICS.props.width / 1.5,
  height: 40,
  backgroundColor: "transparent"
};

$.SLIDERS.tension = {
  x: 200,
  y: 107,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
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
  name: "Tension"
};

$.LABELS.friction = {
  x: 20,
  y: 146,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "Friction"
};

$.LABELS.velocity = {
  x: 20,
  y: 200,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "Velocity"
};

$.LABELS.tolerance = {
  x: 20,
  y: 254,
  width: 141,
  height: 34,
  backgroundColor: "transparent",
  name: "Tolerance"
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
      return $.KINETICS.layer.animate({
        properties: {
          scale: 1
        },
        curve: "spring(345, 40, 0)"
      });
    }
  });
});

Kinetics = (function(superClass) {
  extend(Kinetics, superClass);

  function Kinetics(options) {
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
    this.closeButton.on(Events.Click, function() {
      return $.KINETICS.layer.animate({
        properties: {
          scale: 0
        },
        curve: "spring(345, 40, 0)"
      }, $.KINETICS.layer.on(Events.AnimationEnd, function() {
        return $.KINETICS.layer.destroy();
      }));
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
    this.curveProps.html = "<textarea onclick='this.select()' style='width:" + this.curveProps.width + "px; height:" + this.curveProps.height + "px; text-align:center; line-height:34px; color:#A0E35F; font: 400 28px Roboto Mono; background-color: transparent; border: none; resize: none'>&quot;" + $.ANIMATE.options.curve + "&quot;</textarea>";
    this.animatePropsInput.onclick = function() {
      this.focus();
      return this.placeholder = " ";
    };
    this.animatePropsInput.onblur = function() {
      return this.placeholder = "Add animation properties";
    };
    return this.animatePropsInput.onkeyup = function(e) {
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
        return $.KINETICS.layer.curveProps.html = "<textarea id='curveProps' style='width:" + $.TEXT.curveProps.width + "px; height:" + $.TEXT.curveProps.height + "px; text-align:center; line-height:34px; color:#A0E35F; font:400 28px Roboto Mono; background-color:transparent; border:none; resize:none'>&quot;" + $.ANIMATE.options.curve + "&quot;</textarea>";
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

/* VARIABLES */
var $, Kinetics,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
  scale: 0,
  backgroundColor: "#151517",
  superLayer: $.DEVICE,
  targetLayer: {}
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
  ignoreEvents: false,
  propagateEvents: false
};

$.TEXT.curveProps = {
  midX: $.KINETICS.props.width / 2,
  maxY: $.KINETICS.props.height - 20,
  width: $.KINETICS.props.width / 1.5,
  height: 40,
  backgroundColor: "transparent"
};

$.SLIDERS.tension = {
  x: 200,
  y: 107,
  width: 460,
  height: 10,
  backgroundColor: "#3A3A40",
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
  name: "Tension"
};

$.LABELS.friction = {
  x: 20,
  y: 146,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "Friction"
};

$.LABELS.velocity = {
  x: 20,
  y: 200,
  width: 125,
  height: 34,
  backgroundColor: "transparent",
  name: "Velocity"
};

$.LABELS.tolerance = {
  x: 20,
  y: 254,
  width: 141,
  height: 34,
  backgroundColor: "transparent",
  name: "Tolerance"
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
      return $.KINETICS.layer.animate({
        properties: {
          scale: 1
        },
        curve: "spring(345, 40, 0)"
      });
    }
  });
});

Kinetics = (function(superClass) {
  extend(Kinetics, superClass);

  function Kinetics(options) {
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
    this.closeButton.on(Events.Click, function() {
      return $.KINETICS.layer.animate({
        properties: {
          scale: 0
        },
        curve: "spring(345, 40, 0)"
      }, $.KINETICS.layer.on(Events.AnimationEnd, function() {
        return $.KINETICS.layer.destroy();
      }));
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
    this.curveProps.html = "<textarea onclick='this.select()' style='width:" + this.curveProps.width + "px; height:" + this.curveProps.height + "px; text-align:center; line-height:34px; color:#A0E35F; font: 400 28px Roboto Mono; background-color: transparent; border: none; resize: none'>&quot;" + $.ANIMATE.options.curve + "&quot;</textarea>";
    this.animatePropsInput.onclick = function() {
      this.focus();
      return this.placeholder = " ";
    };
    this.animatePropsInput.onblur = function() {
      return this.placeholder = "Add animation properties";
    };
    return this.animatePropsInput.onkeyup = function(e) {
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
        return $.KINETICS.layer.curveProps.html = "<textarea id='curveProps' style='width:" + $.TEXT.curveProps.width + "px; height:" + $.TEXT.curveProps.height + "px; text-align:center; line-height:34px; color:#A0E35F; font:400 28px Roboto Mono; background-color:transparent; border:none; resize:none'>&quot;" + $.ANIMATE.options.curve + "&quot;</textarea>";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zaG10dWNrZXIvR2l0SHViL0tpbmV0aWNzLmZyYW1lci9tb2R1bGVzL0tpbmV0aWNzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2pvc2htdHVja2VyL0dpdEh1Yi9LaW5ldGljcy5mcmFtZXIvbW9kdWxlcy9LaW5ldGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsZUFBQTtBQUFBLElBQUEsV0FBQTtFQUFBOzZCQUFBOztBQUFBLENBRUEsR0FDQztBQUFBLEVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxFQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBRHRCO0FBQUEsRUFFQSxPQUFBLEVBQVMsRUFGVDtBQUFBLEVBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxFQUlBLE9BQUEsRUFBUztBQUFBLElBQUMsSUFBQSxFQUFLO0FBQUEsTUFBQyxRQUFBLEVBQVUsRUFBWDtBQUFBLE1BQWUsZUFBQSxFQUFpQixTQUFoQztLQUFOO0FBQUEsSUFBa0QsSUFBQSxFQUFLO0FBQUEsTUFBQyxlQUFBLEVBQWlCLFNBQWxCO0tBQXZEO0dBSlQ7QUFBQSxFQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsRUFNQSxLQUFBLEVBQU87QUFBQSxJQUFDLFlBQUEsRUFBYTtBQUFBLE1BQUMsZ0JBQUEsRUFBa0IsUUFBbkI7QUFBQSxNQUE2QixTQUFBLEVBQVcsWUFBeEM7QUFBQSxNQUFzRCxNQUFBLEVBQVEsNkJBQTlEO0tBQWQ7R0FOUDtBQUFBLEVBT0EsT0FBQSxFQUFTLEVBUFQ7Q0FIRCxDQUFBOztBQUFBLENBWUMsQ0FBQyxRQUFRLENBQUMsS0FBWCxHQUNDO0FBQUEsRUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFULEdBQWUsQ0FBckI7QUFBQSxFQUNBLElBQUEsRUFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyMgVkFSSUFCTEVTICMjI1xuXG4kID0gXG5cdEtJTkVUSUNTOiB7fVxuXHRERVZJQ0U6IEZyYW1lci5EZXZpY2UucGhvbmVcblx0QlVUVE9OUzoge31cblx0VEVYVDoge31cblx0U0xJREVSUzoge2tub2I6e2tub2JTaXplOiAyOCwgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn0sIGZpbGw6e2JhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJ9fVxuXHRMQUJFTFM6IHt9XG5cdFNUWUxFOiB7c2xpZGVyTGFiZWxzOntcInZlcnRpY2FsLWFsaWduXCI6IFwiY2VudGVyXCIsIFwiZGlzcGxheVwiOiBcInRhYmxlLWNlbGxcIiwgXCJmb250XCI6IFwibm9ybWFsIDEwMCAyNnB4IFJvYm90byBNb25vXCJ9fVxuXHRBTklNQVRFOiB7fVxuXG4kLktJTkVUSUNTLnByb3BzID0gXG5cdG1pZFg6ICQuREVWSUNFLndpZHRoLzIgXG5cdG1pZFk6ICQuREVWSUNFLmhlaWdodC8yIFxuXHR3aWR0aDogKDcwMCAqICQuREVWSUNFLnNjYWxlKSArICg3MDAgKiAoMS0kLkRFVklDRS5zY2FsZSkpXG5cdGhlaWdodDogKDQwMCAqICQuREVWSUNFLnNjYWxlKSArICg0MDAgKiAoMS0kLkRFVklDRS5zY2FsZSkpXG5cdHNjYWxlOiAwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjMTUxNTE3XCJcblx0c3VwZXJMYXllcjogJC5ERVZJQ0Vcblx0dGFyZ2V0TGF5ZXI6IHt9XG5cbiMg4oCT4oCT4oCTIEJVVFRPTlNcbiQuQlVUVE9OUy5jbG9zZUJ1dHRvbiA9IHttYXhYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMjgsIHk6IDI4LCB3aWR0aDogMjQsIGhlaWdodDogMjQsIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwifVxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwgPSB7bWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoLzIsIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQvMiwgd2lkdGg6IDI0LCBoZWlnaHQ6IDQsIHJvdGF0aW9uOiA0NSwgYm9yZGVyUmFkaXVzOiAxOCwgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn1cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSID0ge21pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aC8yLCBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0LzIsIHdpZHRoOiAyNCwgaGVpZ2h0OiA0LCByb3RhdGlvbjogLTQ1LCBib3JkZXJSYWRpdXM6IDE4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifVxuXG4jIOKAk+KAk+KAkyBURVhUXG4kLlRFWFQuYW5pbWF0ZVByb3BzID0gXG5cdG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMlxuXHR3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDE2MFxuXHRoZWlnaHQ6IDgwXG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdGlnbm9yZUV2ZW50czogZmFsc2Vcblx0cHJvcGFnYXRlRXZlbnRzOiBmYWxzZVxuXG4kLlRFWFQuY3VydmVQcm9wcyA9IFxuXHRtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoLzJcblx0bWF4WTogJC5LSU5FVElDUy5wcm9wcy5oZWlnaHQtMjBcblx0d2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMS41XG5cdGhlaWdodDogNDBcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblxuIyDigJPigJPigJMgU0xJREVSU1xuXG4kLlNMSURFUlMudGVuc2lvbiA9IFxuXHR4OiAyMDBcblx0eTogMTA3XG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG1pbjogMFxuXHRtYXg6IDEwMDBcblx0dmFsdWU6IDI1MFxuXG4kLlNMSURFUlMuZnJpY3Rpb24gPSBcblx0eDogMjAwXG5cdHk6IDE2MVxuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRtaW46IDBcblx0bWF4OiAxMDBcblx0dmFsdWU6IDQ1XG5cbiQuU0xJREVSUy52ZWxvY2l0eSA9IFxuXHR4OiAyMDBcblx0eTogMjE1XG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG1pbjogMFxuXHRtYXg6IDEwXG5cdHZhbHVlOiAwXG5cbiQuU0xJREVSUy50b2xlcmFuY2UgPSBcblx0eDogMjAwXG5cdHk6IDI2OVxuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRtaW46IDAuMDAxXG5cdG1heDogMVxuXHR2YWx1ZTogMC4wMDFcblxuIyDigJPigJPigJMgTEFCRUxTXG4kLkxBQkVMUy50ZW5zaW9uID0gXG5cdHg6IDIwXG5cdHk6IDkyXG5cdHdpZHRoOiAxMTBcblx0aGVpZ2h0OiAzNFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIlRlbnNpb25cIlxuXG4kLkxBQkVMUy5mcmljdGlvbiA9IFxuXHR4OiAyMFxuXHR5OiAxNDZcblx0d2lkdGg6IDEyNVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiRnJpY3Rpb25cIlxuXG4kLkxBQkVMUy52ZWxvY2l0eSA9IFxuXHR4OiAyMFxuXHR5OiAyMDBcblx0d2lkdGg6IDEyNVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVmVsb2NpdHlcIlxuXG4kLkxBQkVMUy50b2xlcmFuY2UgPSBcblx0eDogMjBcblx0eTogMjU0XG5cdHdpZHRoOiAxNDFcblx0aGVpZ2h0OiAzNFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIlRvbGVyYW5jZVwiXG5cbiMg4oCT4oCT4oCTIEFOSU1BVEVcbiQuQU5JTUFURS5vcHRpb25zID1cblx0bGF5ZXI6IG51bGxcblx0cHJvcGVydGllczoge31cblx0Y3VydmU6IFwic3ByaW5nKDI1MCwgNDUsIDAsIC4wMDFcIlxuXHRjdXJ2ZU9wdGlvbnM6IHt9XG5cdHRpbWU6IDFcblx0ZGVsYXk6IDBcblx0cmVwZWF0OiAwXG5cdGRlYnVnOiBmYWxzZVxuXG4jIERpc2FibGUgY2xpcCBvbiBkZXZpY2VcbkZyYW1lci5EZXZpY2UucGhvbmUuY2xpcCA9IGZhbHNlXG5cbkZyYW1lci5DdXJyZW50Q29udGV4dC5vbiBcImxheWVyOmNyZWF0ZVwiLCAobGF5ZXIpIC0+XG5cdGxheWVyLm9uIEV2ZW50cy5DbGljaywgKGUsIGxheWVyKSAtPlxuXHRcdCMgT25seSBvbiBhbiBhbHQob3B0aW9uKSArIGNsaWNrXG5cdFx0aWYgZS5hbHRLZXkgYW5kIGxheWVyIGluc3RhbmNlb2YgS2luZXRpY3MgaXMgZmFsc2UgYW5kIGxheWVyLnN1cGVyTGF5ZXIgaXNudCAkLktJTkVUSUNTLmxheWVyXG5cblx0XHRcdCMgRGVzdHJveSBpZiBsYXllciBhbHJlYWR5IGV4aXN0c1xuXHRcdFx0aWYgJC5LSU5FVElDUy5sYXllciB0aGVuICQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpXG5cdFx0XHRcblx0XHRcdCMgQ3JlYXRlIEtpbmV0aWNzIGxheWVyXG5cdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyID0gbGF5ZXJcblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW4gPSBsYXllci5wcm9wc1xuXHRcdFx0bmV3IEtpbmV0aWNzICQuS0lORVRJQ1MucHJvcHNcblxuXHRcdFx0IyMjXG5cblx0XHRcdFRPRE86IElzIHRoZXJlIGEgd2F5IHRvIHJlbW92ZSBtb3VzZWV2ZW50IGxpc3RlbmVycyBvbiBsYXllcnMgc28gdGhlcmUncyBubyBjb25mbGljdD9cblxuXHRcdFx0IyMjXG5cblx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRcdGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG5cbmNsYXNzIEtpbmV0aWNzIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdCMgUmVmZXJlbmNlIEtpbmV0aWNzXG5cdFx0JC5LSU5FVElDUy5sYXllciA9IEBcblxuXHRcdEBkcmFnZ2FibGUuZW5hYmxlZCA9IHRydWVcblx0XHRAZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2VcblxuXHRcdCMgQWRkIGNsb3NlIGJ1dHRvblxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5zdXBlckxheWVyID0gQFxuXHRcdEBjbG9zZUJ1dHRvbiA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25cblx0XHRcdFxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMLnN1cGVyTGF5ZXIgPSBAY2xvc2VCdXR0b25cblx0XHQkLkJVVFRPTlMuY2xvc2VCdXR0b25YUi5zdXBlckxheWVyID0gQGNsb3NlQnV0dG9uXG5cdFx0QGNsb3NlQnV0dG9uWEwgPSBuZXcgTGF5ZXIgJC5CVVRUT05TLmNsb3NlQnV0dG9uWExcblx0XHRAY2xvc2VCdXR0b25YUiA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25YUlxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0QGNsb3NlQnV0dG9uLm9uIEV2ZW50cy5DbGljaywgLT5cblx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNjYWxlOiAwXG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG5cblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPlxuXHRcdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpXG5cblx0XHRAc2V0dXBUZXh0KClcblx0XHRAc2V0dXBTbGlkZXJzKClcblxuXHRzZXR1cFRleHQ6IC0+XG5cdFx0IyBTZXR1cCBzdXBlckxheWVyXG5cdFx0Zm9yIHRleHQgb2YgJC5URVhUIHdoZW4gdGV4dCBpc250IFwiaW5wdXRcIlxuXHRcdFx0JC5URVhUW1wiI3t0ZXh0fVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyDigJPigJPigJMgQU5JTUFURSBQUk9QRVJUSUVTXG5cdFx0QGFuaW1hdGVQcm9wcyA9IG5ldyBMYXllciAkLlRFWFQuYW5pbWF0ZVByb3BzXG5cblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ3aWR0aFwiXSA9IFwiI3tAYW5pbWF0ZVByb3BzLndpZHRofXB4XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJoZWlnaHRcIl0gPSBcIiN7QGFuaW1hdGVQcm9wcy5oZWlnaHR9cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnRcIl0gPSBcIm5vcm1hbCA0MDAgMjZweCBSb2JvdG8gTW9ub1wiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjI2cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImNvbG9yXCJdID0gXCJ3aGl0ZVwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiLXdla2l0LXVzZXItc2VsZWN0XCJdID0gXCJ0ZXh0XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCIjeyQuS0lORVRJQ1MubGF5ZXIuYmFja2dyb3VuZENvbG9yfVwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0QGFuaW1hdGVQcm9wcy5fZWxlbWVudC5hcHBlbmRDaGlsZChAYW5pbWF0ZVByb3BzSW5wdXQpXG5cblx0XHQjIOKAk+KAk+KAkyBDVVJWRSBQUk9QRVJUSUVTXG5cblx0XHQjIyNcblxuXHRcdFRPRE86IE1ha2UgY3VydmUgcHJvcHMgYW4gaW5wdXQgd2hlcmUgeW91IGNhbiB0eXBlIGluIGl0IGlmIHlvdSB3aXNoIChhZGp1c3RzIGtub2IgdmFsdWVzKVxuXHRcdEJVRyAoc2VtaSk6IGN1cnZlUHJvcHMgaXMgZWRpdGFibGVcblxuXHRcdCMjI1xuXG5cblx0XHRAY3VydmVQcm9wcyA9IG5ldyBMYXllciAkLlRFWFQuY3VydmVQcm9wc1xuXHRcdEBjdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBvbmNsaWNrPSd0aGlzLnNlbGVjdCgpJyBzdHlsZT0nd2lkdGg6I3tAY3VydmVQcm9wcy53aWR0aH1weDsgaGVpZ2h0OiN7QGN1cnZlUHJvcHMuaGVpZ2h0fXB4OyB0ZXh0LWFsaWduOmNlbnRlcjsgbGluZS1oZWlnaHQ6MzRweDsgY29sb3I6I0EwRTM1RjsgZm9udDogNDAwIDI4cHggUm9ib3RvIE1vbm87IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyBib3JkZXI6IG5vbmU7IHJlc2l6ZTogbm9uZSc+JnF1b3Q7I3skLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZX0mcXVvdDs8L3RleHRhcmVhPlwiXG5cblxuXHRcdCMg4oCT4oCT4oCTIEVWRU5UU1xuXHRcdCMgU2VsZWN0IGlucHV0XG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0Lm9uY2xpY2sgPSAtPlxuXHRcdFx0QGZvY3VzKClcblx0XHRcdEBwbGFjZWhvbGRlciA9IFwiIFwiXG5cblx0XHQjIFJlcGxhY2UgcGxhY2Vob2xkZXJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQub25ibHVyID0gLT5cblx0XHRcdEBwbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCJcblxuXHRcdCMgU3VibWl0dGluZyBhbmltYXRpb24gcHJvcGVydGllc1xuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5vbmtleXVwID0gKGUpIC0+XG5cdFx0XHRpZiBlLmtleUNvZGUgaXMgMTNcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKClcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCJcblxuXHRcdFx0XHRpZiAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlIGlzbnQgXCJcIlxuXG5cdFx0XHRcdFx0cmVnZXggPSAvKFxcUypcXHcpL2dcblxuXHRcdFx0XHRcdG9wdGlvbnMgPSAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlLm1hdGNoKHJlZ2V4KVxuXG5cdFx0XHRcdFx0Zm9yIG9wdGlvbiBpbiBvcHRpb25zXG5cdFx0XHRcdFx0XHRpbmRleCA9IF8uaW5kZXhPZihvcHRpb25zLCBvcHRpb24pXG5cdFx0XHRcdFx0XHRpZiBpbmRleCAlIDIgaXMgMFxuXHRcdFx0XHRcdFx0XHQkLkFOSU1BVEUub3B0aW9ucy5wcm9wZXJ0aWVzW1wiI3tvcHRpb259XCJdID0gb3B0aW9uc1tpbmRleCsxXVxuXG5cdFx0XHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblxuXHRzZXR1cFNsaWRlcnM6IC0+XG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3Igc2xpZGVyc1xuXHRcdGZvciBzbGlkZXIgb2YgJC5TTElERVJTIHdoZW4gc2xpZGVyIGlzbnQgXCJrbm9iXCJcblx0XHRcdCQuU0xJREVSU1tcIiN7c2xpZGVyfVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3IgbGFiZWxzXG5cdFx0Zm9yIGxhYmVsIG9mICQuTEFCRUxTXG5cdFx0XHQkLkxBQkVMU1tcIiN7bGFiZWx9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIOKAk+KAk+KAkyBURU5TSU9OXG5cdFx0QHRlbnNpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy50ZW5zaW9uXG5cdFx0QHRlbnNpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0ZW5zaW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QHRlbnNpb24ua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB0ZW5zaW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdGVuc2lvbkxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLnRlbnNpb25cblx0XHRAdGVuc2lvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0ZW5zaW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQHRlbnNpb25MYWJlbC5oZWlnaHQnPiN7QHRlbnNpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBGUklDVElPTlxuXG5cdFx0QGZyaWN0aW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMuZnJpY3Rpb25cblx0XHRAZnJpY3Rpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEBmcmljdGlvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEBmcmljdGlvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QGZyaWN0aW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAZnJpY3Rpb25MYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy5mcmljdGlvblxuXHRcdEBmcmljdGlvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0BmcmljdGlvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0BmcmljdGlvbkxhYmVsLmhlaWdodCc+I3tAZnJpY3Rpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBWRUxPQ0lUWVxuXHRcdEB2ZWxvY2l0eSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnZlbG9jaXR5XG5cdFx0QHZlbG9jaXR5Lmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemVcblx0XHRAdmVsb2NpdHkua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdmVsb2NpdHkua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB2ZWxvY2l0eS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvclxuXG5cdFx0QHZlbG9jaXR5TGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudmVsb2NpdHlcblx0XHRAdmVsb2NpdHlMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdmVsb2NpdHlMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdmVsb2NpdHlMYWJlbC5oZWlnaHQnPiN7QHZlbG9jaXR5TGFiZWwubmFtZX08L2Rpdj5cIlxuXG5cdFx0IyDigJPigJPigJMgVE9MRVJBTkNFXG5cdFx0QHRvbGVyYW5jZSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnRvbGVyYW5jZVxuXHRcdEB0b2xlcmFuY2Uua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0b2xlcmFuY2Uua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdG9sZXJhbmNlLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAdG9sZXJhbmNlLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdG9sZXJhbmNlTGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudG9sZXJhbmNlXG5cdFx0QHRvbGVyYW5jZUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0b2xlcmFuY2VMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdG9sZXJhbmNlTGFiZWwuaGVpZ2h0Jz4je0B0b2xlcmFuY2VMYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIFNldCBzdHlsZSBmb3IgYWxsIHRoZSBsYWJlbHNcblx0XHRmb3Igc2xpZGVyIGluICQuS0lORVRJQ1MubGF5ZXIuc3ViTGF5ZXJzIHdoZW4gc2xpZGVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJMYXllclwiXG5cdFx0XHRmb3Igc3R5bGUgb2YgJC5TVFlMRS5zbGlkZXJMYWJlbHMgXG5cdFx0XHRcdHNsaWRlci5fZWxlbWVudC5zdHlsZVtcIiN7c3R5bGV9XCJdID0gJC5TVFlMRS5zbGlkZXJMYWJlbHNbXCIje3N0eWxlfVwiXVxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0Zm9yIHNsaWRlciBpbiBAc3ViTGF5ZXJzIHdoZW4gc2xpZGVyIGluc3RhbmNlb2YgU2xpZGVyQ29tcG9uZW50IGlzIHRydWVcblx0XHRcdHNsaWRlci5vbiBcImNoYW5nZTp2YWx1ZVwiLCAtPlxuXHRcdFx0XHQkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSA9IFwic3ByaW5nKCN7TWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRlbnNpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIuZnJpY3Rpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudmVsb2NpdHkudmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudG9sZXJhbmNlLnZhbHVlICogMTAwMCkvMTAwMH0pXCJcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5jdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBpZD0nY3VydmVQcm9wcycgc3R5bGU9J3dpZHRoOiN7JC5URVhULmN1cnZlUHJvcHMud2lkdGh9cHg7IGhlaWdodDojeyQuVEVYVC5jdXJ2ZVByb3BzLmhlaWdodH1weDsgdGV4dC1hbGlnbjpjZW50ZXI7IGxpbmUtaGVpZ2h0OjM0cHg7IGNvbG9yOiNBMEUzNUY7IGZvbnQ6NDAwIDI4cHggUm9ib3RvIE1vbm87IGJhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7IGJvcmRlcjpub25lOyByZXNpemU6bm9uZSc+JnF1b3Q7I3skLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZX0mcXVvdDs8L3RleHRhcmVhPlwiXG5cblx0XHRcdHNsaWRlci5rbm9iLm9uIEV2ZW50cy5EcmFnRW5kLCAtPlxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVUYXJnZXQoKVxuXG5cdGFuaW1hdGVUYXJnZXQ6IC0+XG5cdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLmFuaW1hdGUgJC5BTklNQVRFLm9wdGlvbnNcblxuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjkuMVxuXG4vKiBWQVJJQUJMRVMgKi9cbnZhciAkLCBLaW5ldGljcyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiQgPSB7XG4gIEtJTkVUSUNTOiB7fSxcbiAgREVWSUNFOiBGcmFtZXIuRGV2aWNlLnBob25lLFxuICBCVVRUT05TOiB7fSxcbiAgVEVYVDoge30sXG4gIFNMSURFUlM6IHtcbiAgICBrbm9iOiB7XG4gICAgICBrbm9iU2l6ZTogMjgsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG4gICAgfSxcbiAgICBmaWxsOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG4gICAgfVxuICB9LFxuICBMQUJFTFM6IHt9LFxuICBTVFlMRToge1xuICAgIHNsaWRlckxhYmVsczoge1xuICAgICAgXCJ2ZXJ0aWNhbC1hbGlnblwiOiBcImNlbnRlclwiLFxuICAgICAgXCJkaXNwbGF5XCI6IFwidGFibGUtY2VsbFwiLFxuICAgICAgXCJmb250XCI6IFwibm9ybWFsIDEwMCAyNnB4IFJvYm90byBNb25vXCJcbiAgICB9XG4gIH0sXG4gIEFOSU1BVEU6IHt9XG59O1xuXG4kLktJTkVUSUNTLnByb3BzID0ge1xuICBtaWRYOiAkLkRFVklDRS53aWR0aCAvIDIsXG4gIG1pZFk6ICQuREVWSUNFLmhlaWdodCAvIDIsXG4gIHdpZHRoOiAoNzAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDcwMCAqICgxIC0gJC5ERVZJQ0Uuc2NhbGUpKSxcbiAgaGVpZ2h0OiAoNDAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDQwMCAqICgxIC0gJC5ERVZJQ0Uuc2NhbGUpKSxcbiAgc2NhbGU6IDAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjMTUxNTE3XCIsXG4gIHN1cGVyTGF5ZXI6ICQuREVWSUNFLFxuICB0YXJnZXRMYXllcjoge31cbn07XG5cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvbiA9IHtcbiAgbWF4WDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDI4LFxuICB5OiAyOCxcbiAgd2lkdGg6IDI0LFxuICBoZWlnaHQ6IDI0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxufTtcblxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwgPSB7XG4gIG1pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aCAvIDIsXG4gIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQgLyAyLFxuICB3aWR0aDogMjQsXG4gIGhlaWdodDogNCxcbiAgcm90YXRpb246IDQ1LFxuICBib3JkZXJSYWRpdXM6IDE4LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG59O1xuXG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YUiA9IHtcbiAgbWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoIC8gMixcbiAgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodCAvIDIsXG4gIHdpZHRoOiAyNCxcbiAgaGVpZ2h0OiA0LFxuICByb3RhdGlvbjogLTQ1LFxuICBib3JkZXJSYWRpdXM6IDE4LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG59O1xuXG4kLlRFWFQuYW5pbWF0ZVByb3BzID0ge1xuICBtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC8gMixcbiAgd2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAxNjAsXG4gIGhlaWdodDogODAsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBpZ25vcmVFdmVudHM6IGZhbHNlLFxuICBwcm9wYWdhdGVFdmVudHM6IGZhbHNlXG59O1xuXG4kLlRFWFQuY3VydmVQcm9wcyA9IHtcbiAgbWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAvIDIsXG4gIG1heFk6ICQuS0lORVRJQ1MucHJvcHMuaGVpZ2h0IC0gMjAsXG4gIHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC8gMS41LFxuICBoZWlnaHQ6IDQwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxufTtcblxuJC5TTElERVJTLnRlbnNpb24gPSB7XG4gIHg6IDIwMCxcbiAgeTogMTA3LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBtaW46IDAsXG4gIG1heDogMTAwMCxcbiAgdmFsdWU6IDI1MFxufTtcblxuJC5TTElERVJTLmZyaWN0aW9uID0ge1xuICB4OiAyMDAsXG4gIHk6IDE2MSxcbiAgd2lkdGg6IDQ2MCxcbiAgaGVpZ2h0OiAxMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwMCxcbiAgdmFsdWU6IDQ1XG59O1xuXG4kLlNMSURFUlMudmVsb2NpdHkgPSB7XG4gIHg6IDIwMCxcbiAgeTogMjE1LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBtaW46IDAsXG4gIG1heDogMTAsXG4gIHZhbHVlOiAwXG59O1xuXG4kLlNMSURFUlMudG9sZXJhbmNlID0ge1xuICB4OiAyMDAsXG4gIHk6IDI2OSxcbiAgd2lkdGg6IDQ2MCxcbiAgaGVpZ2h0OiAxMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIixcbiAgbWluOiAwLjAwMSxcbiAgbWF4OiAxLFxuICB2YWx1ZTogMC4wMDFcbn07XG5cbiQuTEFCRUxTLnRlbnNpb24gPSB7XG4gIHg6IDIwLFxuICB5OiA5MixcbiAgd2lkdGg6IDExMCxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiVGVuc2lvblwiXG59O1xuXG4kLkxBQkVMUy5mcmljdGlvbiA9IHtcbiAgeDogMjAsXG4gIHk6IDE0NixcbiAgd2lkdGg6IDEyNSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiRnJpY3Rpb25cIlxufTtcblxuJC5MQUJFTFMudmVsb2NpdHkgPSB7XG4gIHg6IDIwLFxuICB5OiAyMDAsXG4gIHdpZHRoOiAxMjUsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlZlbG9jaXR5XCJcbn07XG5cbiQuTEFCRUxTLnRvbGVyYW5jZSA9IHtcbiAgeDogMjAsXG4gIHk6IDI1NCxcbiAgd2lkdGg6IDE0MSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiVG9sZXJhbmNlXCJcbn07XG5cbiQuQU5JTUFURS5vcHRpb25zID0ge1xuICBsYXllcjogbnVsbCxcbiAgcHJvcGVydGllczoge30sXG4gIGN1cnZlOiBcInNwcmluZygyNTAsIDQ1LCAwLCAuMDAxXCIsXG4gIGN1cnZlT3B0aW9uczoge30sXG4gIHRpbWU6IDEsXG4gIGRlbGF5OiAwLFxuICByZXBlYXQ6IDAsXG4gIGRlYnVnOiBmYWxzZVxufTtcblxuRnJhbWVyLkRldmljZS5waG9uZS5jbGlwID0gZmFsc2U7XG5cbkZyYW1lci5DdXJyZW50Q29udGV4dC5vbihcImxheWVyOmNyZWF0ZVwiLCBmdW5jdGlvbihsYXllcikge1xuICByZXR1cm4gbGF5ZXIub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbihlLCBsYXllcikge1xuICAgIGlmIChlLmFsdEtleSAmJiBsYXllciBpbnN0YW5jZW9mIEtpbmV0aWNzID09PSBmYWxzZSAmJiBsYXllci5zdXBlckxheWVyICE9PSAkLktJTkVUSUNTLmxheWVyKSB7XG4gICAgICBpZiAoJC5LSU5FVElDUy5sYXllcikge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIgPSBsYXllcjtcbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW4gPSBsYXllci5wcm9wcztcbiAgICAgIG5ldyBLaW5ldGljcygkLktJTkVUSUNTLnByb3BzKTtcblxuICAgICAgLypcbiAgICAgIFxuICAgICAgXHRcdFx0VE9ETzogSXMgdGhlcmUgYSB3YXkgdG8gcmVtb3ZlIG1vdXNlZXZlbnQgbGlzdGVuZXJzIG9uIGxheWVycyBzbyB0aGVyZSdzIG5vIGNvbmZsaWN0P1xuICAgICAgICovXG4gICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlKHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbktpbmV0aWNzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEtpbmV0aWNzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBLaW5ldGljcyhvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBLaW5ldGljcy5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAkLktJTkVUSUNTLmxheWVyID0gdGhpcztcbiAgICB0aGlzLmRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5zdXBlckxheWVyID0gdGhpcztcbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvbik7XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwuc3VwZXJMYXllciA9IHRoaXMuY2xvc2VCdXR0b247XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIuc3VwZXJMYXllciA9IHRoaXMuY2xvc2VCdXR0b247XG4gICAgdGhpcy5jbG9zZUJ1dHRvblhMID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMKTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uWFIgPSBuZXcgTGF5ZXIoJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24ub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGUoe1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2NhbGU6IDBcbiAgICAgICAgfSxcbiAgICAgICAgY3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcbiAgICAgIH0sICQuS0lORVRJQ1MubGF5ZXIub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKTtcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgICB0aGlzLnNldHVwVGV4dCgpO1xuICAgIHRoaXMuc2V0dXBTbGlkZXJzKCk7XG4gIH1cblxuICBLaW5ldGljcy5wcm90b3R5cGUuc2V0dXBUZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRleHQ7XG4gICAgZm9yICh0ZXh0IGluICQuVEVYVCkge1xuICAgICAgaWYgKHRleHQgIT09IFwiaW5wdXRcIikge1xuICAgICAgICAkLlRFWFRbXCJcIiArIHRleHRdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFuaW1hdGVQcm9wcyA9IG5ldyBMYXllcigkLlRFWFQuYW5pbWF0ZVByb3BzKTtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ3aWR0aFwiXSA9IHRoaXMuYW5pbWF0ZVByb3BzLndpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJoZWlnaHRcIl0gPSB0aGlzLmFuaW1hdGVQcm9wcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnRcIl0gPSBcIm5vcm1hbCA0MDAgMjZweCBSb2JvdG8gTW9ub1wiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ0ZXh0LWFsaWduXCJdID0gXCJjZW50ZXJcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udC1zaXplXCJdID0gXCIyNnB4XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImNvbG9yXCJdID0gXCJ3aGl0ZVwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCItd2VraXQtdXNlci1zZWxlY3RcIl0gPSBcInRleHRcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXSA9IFwiXCIgKyAkLktJTkVUSUNTLmxheWVyLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmFuaW1hdGVQcm9wc0lucHV0KTtcblxuICAgIC8qXG4gICAgXG4gICAgXHRcdFRPRE86IE1ha2UgY3VydmUgcHJvcHMgYW4gaW5wdXQgd2hlcmUgeW91IGNhbiB0eXBlIGluIGl0IGlmIHlvdSB3aXNoIChhZGp1c3RzIGtub2IgdmFsdWVzKVxuICAgIFx0XHRCVUcgKHNlbWkpOiBjdXJ2ZVByb3BzIGlzIGVkaXRhYmxlXG4gICAgICovXG4gICAgdGhpcy5jdXJ2ZVByb3BzID0gbmV3IExheWVyKCQuVEVYVC5jdXJ2ZVByb3BzKTtcbiAgICB0aGlzLmN1cnZlUHJvcHMuaHRtbCA9IFwiPHRleHRhcmVhIG9uY2xpY2s9J3RoaXMuc2VsZWN0KCknIHN0eWxlPSd3aWR0aDpcIiArIHRoaXMuY3VydmVQcm9wcy53aWR0aCArIFwicHg7IGhlaWdodDpcIiArIHRoaXMuY3VydmVQcm9wcy5oZWlnaHQgKyBcInB4OyB0ZXh0LWFsaWduOmNlbnRlcjsgbGluZS1oZWlnaHQ6MzRweDsgY29sb3I6I0EwRTM1RjsgZm9udDogNDAwIDI4cHggUm9ib3RvIE1vbm87IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyBib3JkZXI6IG5vbmU7IHJlc2l6ZTogbm9uZSc+JnF1b3Q7XCIgKyAkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSArIFwiJnF1b3Q7PC90ZXh0YXJlYT5cIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0Lm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyID0gXCIgXCI7XG4gICAgfTtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0Lm9uYmx1ciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25rZXl1cCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpLCBpbmRleCwgbGVuLCBvcHRpb24sIG9wdGlvbnMsIHJlZ2V4O1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKCk7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiO1xuICAgICAgICBpZiAoJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgIHJlZ2V4ID0gLyhcXFMqXFx3KS9nO1xuICAgICAgICAgIG9wdGlvbnMgPSAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBvcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBvcHRpb24gPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgaW5kZXggPSBfLmluZGV4T2Yob3B0aW9ucywgb3B0aW9uKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgJC5BTklNQVRFLm9wdGlvbnMucHJvcGVydGllc1tcIlwiICsgb3B0aW9uXSA9IG9wdGlvbnNbaW5kZXggKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBLaW5ldGljcy5wcm90b3R5cGUuc2V0dXBTbGlkZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGosIGxhYmVsLCBsZW4sIGxlbjEsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2xpZGVyLCBzdHlsZTtcbiAgICBmb3IgKHNsaWRlciBpbiAkLlNMSURFUlMpIHtcbiAgICAgIGlmIChzbGlkZXIgIT09IFwia25vYlwiKSB7XG4gICAgICAgICQuU0xJREVSU1tcIlwiICsgc2xpZGVyXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsYWJlbCBpbiAkLkxBQkVMUykge1xuICAgICAgJC5MQUJFTFNbXCJcIiArIGxhYmVsXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICB9XG4gICAgdGhpcy50ZW5zaW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMudGVuc2lvbik7XG4gICAgdGhpcy50ZW5zaW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy50ZW5zaW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudGVuc2lvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudGVuc2lvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRlbnNpb25MYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy50ZW5zaW9uKTtcbiAgICB0aGlzLnRlbnNpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdGVuc2lvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0B0ZW5zaW9uTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudGVuc2lvbkxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHRoaXMuZnJpY3Rpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy5mcmljdGlvbik7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMuZnJpY3Rpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMuZnJpY3Rpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5mcmljdGlvbkxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLmZyaWN0aW9uKTtcbiAgICB0aGlzLmZyaWN0aW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQGZyaWN0aW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQGZyaWN0aW9uTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMuZnJpY3Rpb25MYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMudmVsb2NpdHkpO1xuICAgIHRoaXMudmVsb2NpdHkua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnZlbG9jaXR5Lmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudmVsb2NpdHkua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLnZlbG9jaXR5LmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudmVsb2NpdHlMYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy52ZWxvY2l0eSk7XG4gICAgdGhpcy52ZWxvY2l0eUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B2ZWxvY2l0eUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B2ZWxvY2l0eUxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLnZlbG9jaXR5TGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgdGhpcy50b2xlcmFuY2UgPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy50b2xlcmFuY2UpO1xuICAgIHRoaXMudG9sZXJhbmNlLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLnRvbGVyYW5jZS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRvbGVyYW5jZUxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnRvbGVyYW5jZSk7XG4gICAgdGhpcy50b2xlcmFuY2VMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdG9sZXJhbmNlTGFiZWwud2lkdGgnIGhlaWdodD0nQHRvbGVyYW5jZUxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLnRvbGVyYW5jZUxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHJlZiA9ICQuS0lORVRJQ1MubGF5ZXIuc3ViTGF5ZXJzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2xpZGVyID0gcmVmW2ldO1xuICAgICAgaWYgKHNsaWRlci5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkxheWVyXCIpIHtcbiAgICAgICAgZm9yIChzdHlsZSBpbiAkLlNUWUxFLnNsaWRlckxhYmVscykge1xuICAgICAgICAgIHNsaWRlci5fZWxlbWVudC5zdHlsZVtcIlwiICsgc3R5bGVdID0gJC5TVFlMRS5zbGlkZXJMYWJlbHNbXCJcIiArIHN0eWxlXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWYxID0gdGhpcy5zdWJMYXllcnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgc2xpZGVyID0gcmVmMVtqXTtcbiAgICAgIGlmICghKHNsaWRlciBpbnN0YW5jZW9mIFNsaWRlckNvbXBvbmVudCA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBzbGlkZXIub24oXCJjaGFuZ2U6dmFsdWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICQuQU5JTUFURS5vcHRpb25zLmN1cnZlID0gXCJzcHJpbmcoXCIgKyAoTWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRlbnNpb24udmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIuZnJpY3Rpb24udmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudmVsb2NpdHkudmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudG9sZXJhbmNlLnZhbHVlICogMTAwMCkgLyAxMDAwKSArIFwiKVwiO1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5jdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBpZD0nY3VydmVQcm9wcycgc3R5bGU9J3dpZHRoOlwiICsgJC5URVhULmN1cnZlUHJvcHMud2lkdGggKyBcInB4OyBoZWlnaHQ6XCIgKyAkLlRFWFQuY3VydmVQcm9wcy5oZWlnaHQgKyBcInB4OyB0ZXh0LWFsaWduOmNlbnRlcjsgbGluZS1oZWlnaHQ6MzRweDsgY29sb3I6I0EwRTM1RjsgZm9udDo0MDAgMjhweCBSb2JvdG8gTW9ubzsgYmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDsgYm9yZGVyOm5vbmU7IHJlc2l6ZTpub25lJz4mcXVvdDtcIiArICQuQU5JTUFURS5vcHRpb25zLmN1cnZlICsgXCImcXVvdDs8L3RleHRhcmVhPlwiO1xuICAgICAgfSk7XG4gICAgICByZXN1bHRzLnB1c2goc2xpZGVyLmtub2Iub24oRXZlbnRzLkRyYWdFbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlVGFyZ2V0KCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5hbmltYXRlVGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgJC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW47XG4gICAgcmV0dXJuICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIuYW5pbWF0ZSgkLkFOSU1BVEUub3B0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIEtpbmV0aWNzO1xuXG59KShMYXllcik7XG4iXX0=
