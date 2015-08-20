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
      $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
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
      $.KINETICS.targetLayer.props = $.KINETICS.targetLayerOrigin;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zaG10dWNrZXIvR2l0SHViL0tpbmV0aWNzL0tpbmV0aWNzLmZyYW1lci9tb2R1bGVzL0tpbmV0aWNzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2pvc2htdHVja2VyL0dpdEh1Yi9LaW5ldGljcy9LaW5ldGljcy5mcmFtZXIvbW9kdWxlcy9LaW5ldGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsZUFBQTtBQUFBLElBQUEsV0FBQTtFQUFBOzZCQUFBOztBQUFBLENBRUEsR0FDQztBQUFBLEVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxFQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBRHRCO0FBQUEsRUFFQSxPQUFBLEVBQVMsRUFGVDtBQUFBLEVBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxFQUlBLE9BQUEsRUFBUztBQUFBLElBQUMsSUFBQSxFQUFLO0FBQUEsTUFBQyxRQUFBLEVBQVUsRUFBWDtBQUFBLE1BQWUsZUFBQSxFQUFpQixTQUFoQztLQUFOO0FBQUEsSUFBa0QsSUFBQSxFQUFLO0FBQUEsTUFBQyxlQUFBLEVBQWlCLFNBQWxCO0tBQXZEO0dBSlQ7QUFBQSxFQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsRUFNQSxLQUFBLEVBQU87QUFBQSxJQUFDLFlBQUEsRUFBYTtBQUFBLE1BQUMsZ0JBQUEsRUFBa0IsUUFBbkI7QUFBQSxNQUE2QixTQUFBLEVBQVcsWUFBeEM7QUFBQSxNQUFzRCxNQUFBLEVBQVEsNkJBQTlEO0tBQWQ7R0FOUDtBQUFBLEVBT0EsT0FBQSxFQUFTLEVBUFQ7Q0FIRCxDQUFBOztBQUFBLENBWUMsQ0FBQyxRQUFRLENBQUMsS0FBWCxHQUNDO0FBQUEsRUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFULEdBQWUsQ0FBckI7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjIyBWQVJJQUJMRVMgIyMjXG5cbiQgPSBcblx0S0lORVRJQ1M6IHt9XG5cdERFVklDRTogRnJhbWVyLkRldmljZS5waG9uZVxuXHRCVVRUT05TOiB7fVxuXHRURVhUOiB7fVxuXHRTTElERVJTOiB7a25vYjp7a25vYlNpemU6IDI4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifSwgZmlsbDp7YmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn19XG5cdExBQkVMUzoge31cblx0U1RZTEU6IHtzbGlkZXJMYWJlbHM6e1widmVydGljYWwtYWxpZ25cIjogXCJjZW50ZXJcIiwgXCJkaXNwbGF5XCI6IFwidGFibGUtY2VsbFwiLCBcImZvbnRcIjogXCJub3JtYWwgMTAwIDI2cHggUm9ib3RvIE1vbm9cIn19XG5cdEFOSU1BVEU6IHt9XG5cbiQuS0lORVRJQ1MucHJvcHMgPSBcblx0bWlkWDogJC5ERVZJQ0Uud2lkdGgvMiBcblx0bWlkWTogJC5ERVZJQ0UuaGVpZ2h0LzIgXG5cdHdpZHRoOiAoNzAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDcwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0aGVpZ2h0OiAoNDAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDQwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0c2NhbGU6IDBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMxNTE1MTdcIlxuXHRzdXBlckxheWVyOiAkLkRFVklDRVxuXHR0YXJnZXRMYXllcjoge31cblxuIyDigJPigJPigJMgQlVUVE9OU1xuJC5CVVRUT05TLmNsb3NlQnV0dG9uID0ge21heFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAyOCwgeTogMjgsIHdpZHRoOiAyNCwgaGVpZ2h0OiAyNCwgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJ9XG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YTCA9IHttaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGgvMiwgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodC8yLCB3aWR0aDogMjQsIGhlaWdodDogNCwgcm90YXRpb246IDQ1LCBib3JkZXJSYWRpdXM6IDE4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifVxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIgPSB7bWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoLzIsIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQvMiwgd2lkdGg6IDI0LCBoZWlnaHQ6IDQsIHJvdGF0aW9uOiAtNDUsIGJvcmRlclJhZGl1czogMTgsIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJ9XG5cbiMg4oCT4oCT4oCTIFRFWFRcbiQuVEVYVC5hbmltYXRlUHJvcHMgPSBcblx0bWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8yXG5cdHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMTYwXG5cdGhlaWdodDogODBcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0aWdub3JlRXZlbnRzOiBmYWxzZVxuXHRwcm9wYWdhdGVFdmVudHM6IGZhbHNlXG5cbiQuVEVYVC5jdXJ2ZVByb3BzID0gXG5cdG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMlxuXHRtYXhZOiAkLktJTkVUSUNTLnByb3BzLmhlaWdodC0yMFxuXHR3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8xLjVcblx0aGVpZ2h0OiA0MFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXG4jIOKAk+KAk+KAkyBTTElERVJTXG5cbiQuU0xJREVSUy50ZW5zaW9uID0gXG5cdHg6IDIwMFxuXHR5OiAxMDdcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bWluOiAwXG5cdG1heDogMTAwMFxuXHR2YWx1ZTogMjUwXG5cbiQuU0xJREVSUy5mcmljdGlvbiA9IFxuXHR4OiAyMDBcblx0eTogMTYxXG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG1pbjogMFxuXHRtYXg6IDEwMFxuXHR2YWx1ZTogNDVcblxuJC5TTElERVJTLnZlbG9jaXR5ID0gXG5cdHg6IDIwMFxuXHR5OiAyMTVcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bWluOiAwXG5cdG1heDogMTBcblx0dmFsdWU6IDBcblxuJC5TTElERVJTLnRvbGVyYW5jZSA9IFxuXHR4OiAyMDBcblx0eTogMjY5XG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG1pbjogMC4wMDFcblx0bWF4OiAxXG5cdHZhbHVlOiAwLjAwMVxuXG4jIOKAk+KAk+KAkyBMQUJFTFNcbiQuTEFCRUxTLnRlbnNpb24gPSBcblx0eDogMjBcblx0eTogOTJcblx0d2lkdGg6IDExMFxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVGVuc2lvblwiXG5cbiQuTEFCRUxTLmZyaWN0aW9uID0gXG5cdHg6IDIwXG5cdHk6IDE0NlxuXHR3aWR0aDogMTI1XG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJGcmljdGlvblwiXG5cbiQuTEFCRUxTLnZlbG9jaXR5ID0gXG5cdHg6IDIwXG5cdHk6IDIwMFxuXHR3aWR0aDogMTI1XG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJWZWxvY2l0eVwiXG5cbiQuTEFCRUxTLnRvbGVyYW5jZSA9IFxuXHR4OiAyMFxuXHR5OiAyNTRcblx0d2lkdGg6IDE0MVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVG9sZXJhbmNlXCJcblxuIyDigJPigJPigJMgQU5JTUFURVxuJC5BTklNQVRFLm9wdGlvbnMgPVxuXHRsYXllcjogbnVsbFxuXHRwcm9wZXJ0aWVzOiB7fVxuXHRjdXJ2ZTogXCJzcHJpbmcoMjUwLCA0NSwgMCwgLjAwMVwiXG5cdGN1cnZlT3B0aW9uczoge31cblx0dGltZTogMVxuXHRkZWxheTogMFxuXHRyZXBlYXQ6IDBcblx0ZGVidWc6IGZhbHNlXG5cbiMgRGlzYWJsZSBjbGlwIG9uIGRldmljZVxuRnJhbWVyLkRldmljZS5waG9uZS5jbGlwID0gZmFsc2VcblxuRnJhbWVyLkN1cnJlbnRDb250ZXh0Lm9uIFwibGF5ZXI6Y3JlYXRlXCIsIChsYXllcikgLT5cblx0bGF5ZXIub24gRXZlbnRzLkNsaWNrLCAoZSwgbGF5ZXIpIC0+XG5cdFx0IyBPbmx5IG9uIGFuIGFsdChvcHRpb24pICsgY2xpY2tcblx0XHRpZiBlLmFsdEtleSBhbmQgbGF5ZXIgaW5zdGFuY2VvZiBLaW5ldGljcyBpcyBmYWxzZSBhbmQgbGF5ZXIuc3VwZXJMYXllciBpc250ICQuS0lORVRJQ1MubGF5ZXJcblxuXHRcdFx0IyBEZXN0cm95IGlmIGxheWVyIGFscmVhZHkgZXhpc3RzXG5cdFx0XHRpZiAkLktJTkVUSUNTLmxheWVyIHRoZW4gJC5LSU5FVElDUy5sYXllci5kZXN0cm95KClcblx0XHRcdFxuXHRcdFx0IyBDcmVhdGUgS2luZXRpY3MgbGF5ZXJcblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIgPSBsYXllclxuXHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbiA9IGxheWVyLnByb3BzXG5cdFx0XHRuZXcgS2luZXRpY3MgJC5LSU5FVElDUy5wcm9wc1xuXG5cdFx0XHQjIyNcblxuXHRcdFx0VE9ETzogSXMgdGhlcmUgYSB3YXkgdG8gcmVtb3ZlIG1vdXNlZXZlbnQgbGlzdGVuZXJzIG9uIGxheWVycyBzbyB0aGVyZSdzIG5vIGNvbmZsaWN0P1xuXG5cdFx0XHQjIyNcblxuXHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcblxuY2xhc3MgS2luZXRpY3MgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBSZWZlcmVuY2UgS2luZXRpY3Ncblx0XHQkLktJTkVUSUNTLmxheWVyID0gQFxuXG5cdFx0QGRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZVxuXHRcdEBkcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXG5cdFx0IyBBZGQgY2xvc2UgYnV0dG9uXG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uLnN1cGVyTGF5ZXIgPSBAXG5cdFx0QGNsb3NlQnV0dG9uID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblxuXHRcdFx0XG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uWEwuc3VwZXJMYXllciA9IEBjbG9zZUJ1dHRvblxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSLnN1cGVyTGF5ZXIgPSBAY2xvc2VCdXR0b25cblx0XHRAY2xvc2VCdXR0b25YTCA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25YTFxuXHRcdEBjbG9zZUJ1dHRvblhSID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSXG5cblx0XHQjIOKAk+KAk+KAkyBFVkVOVFNcblx0XHRAY2xvc2VCdXR0b24ub24gRXZlbnRzLkNsaWNrLCAtPlxuXHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblxuXHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0c2NhbGU6IDBcblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcblxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsIC0+XG5cdFx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5kZXN0cm95KClcblxuXHRcdEBzZXR1cFRleHQoKVxuXHRcdEBzZXR1cFNsaWRlcnMoKVxuXG5cdHNldHVwVGV4dDogLT5cblx0XHQjIFNldHVwIHN1cGVyTGF5ZXJcblx0XHRmb3IgdGV4dCBvZiAkLlRFWFQgd2hlbiB0ZXh0IGlzbnQgXCJpbnB1dFwiXG5cdFx0XHQkLlRFWFRbXCIje3RleHR9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIOKAk+KAk+KAkyBBTklNQVRFIFBST1BFUlRJRVNcblx0XHRAYW5pbWF0ZVByb3BzID0gbmV3IExheWVyICQuVEVYVC5hbmltYXRlUHJvcHNcblxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIndpZHRoXCJdID0gXCIje0BhbmltYXRlUHJvcHMud2lkdGh9cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImhlaWdodFwiXSA9IFwiI3tAYW5pbWF0ZVByb3BzLmhlaWdodH1weFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udFwiXSA9IFwibm9ybWFsIDQwMCAyNnB4IFJvYm90byBNb25vXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ0ZXh0LWFsaWduXCJdID0gXCJjZW50ZXJcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMjZweFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiY29sb3JcIl0gPSBcIndoaXRlXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCItd2VraXQtdXNlci1zZWxlY3RcIl0gPSBcInRleHRcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcIiN7JC5LSU5FVElDUy5sYXllci5iYWNrZ3JvdW5kQ29sb3J9XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiXG5cblx0XHRAYW5pbWF0ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKEBhbmltYXRlUHJvcHNJbnB1dClcblxuXHRcdCMg4oCT4oCT4oCTIENVUlZFIFBST1BFUlRJRVNcblxuXHRcdCMjI1xuXG5cdFx0VE9ETzogTWFrZSBjdXJ2ZSBwcm9wcyBhbiBpbnB1dCB3aGVyZSB5b3UgY2FuIHR5cGUgaW4gaXQgaWYgeW91IHdpc2ggKGFkanVzdHMga25vYiB2YWx1ZXMpXG5cdFx0QlVHIChzZW1pKTogY3VydmVQcm9wcyBpcyBlZGl0YWJsZVxuXG5cdFx0IyMjXG5cblxuXHRcdEBjdXJ2ZVByb3BzID0gbmV3IExheWVyICQuVEVYVC5jdXJ2ZVByb3BzXG5cdFx0QGN1cnZlUHJvcHMuaHRtbCA9IFwiPHRleHRhcmVhIG9uY2xpY2s9J3RoaXMuc2VsZWN0KCknIHN0eWxlPSd3aWR0aDoje0BjdXJ2ZVByb3BzLndpZHRofXB4OyBoZWlnaHQ6I3tAY3VydmVQcm9wcy5oZWlnaHR9cHg7IHRleHQtYWxpZ246Y2VudGVyOyBsaW5lLWhlaWdodDozNHB4OyBjb2xvcjojQTBFMzVGOyBmb250OiA0MDAgMjhweCBSb2JvdG8gTW9ubzsgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IGJvcmRlcjogbm9uZTsgcmVzaXplOiBub25lJz4mcXVvdDsjeyQuQU5JTUFURS5vcHRpb25zLmN1cnZlfSZxdW90OzwvdGV4dGFyZWE+XCJcblxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0IyBTZWxlY3QgaW5wdXRcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQub25jbGljayA9IC0+XG5cdFx0XHRAZm9jdXMoKVxuXHRcdFx0QHBsYWNlaG9sZGVyID0gXCIgXCJcblxuXHRcdCMgUmVwbGFjZSBwbGFjZWhvbGRlclxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5vbmJsdXIgPSAtPlxuXHRcdFx0QHBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0IyBTdWJtaXR0aW5nIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0Lm9ua2V5dXAgPSAoZSkgLT5cblx0XHRcdGlmIGUua2V5Q29kZSBpcyAxM1xuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0XHRcdGlmICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUgaXNudCBcIlwiXG5cblx0XHRcdFx0XHRyZWdleCA9IC8oXFxTKlxcdykvZ1xuXG5cdFx0XHRcdFx0b3B0aW9ucyA9ICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUubWF0Y2gocmVnZXgpXG5cblx0XHRcdFx0XHRmb3Igb3B0aW9uIGluIG9wdGlvbnNcblx0XHRcdFx0XHRcdGluZGV4ID0gXy5pbmRleE9mKG9wdGlvbnMsIG9wdGlvbilcblx0XHRcdFx0XHRcdGlmIGluZGV4ICUgMiBpcyAwXG5cdFx0XHRcdFx0XHRcdCQuQU5JTUFURS5vcHRpb25zLnByb3BlcnRpZXNbXCIje29wdGlvbn1cIl0gPSBvcHRpb25zW2luZGV4KzFdXG5cblx0XHRcdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpblxuXG5cdHNldHVwU2xpZGVyczogLT5cblx0XHQjIFNldCBzdXBlckxheWVyIGZvciBzbGlkZXJzXG5cdFx0Zm9yIHNsaWRlciBvZiAkLlNMSURFUlMgd2hlbiBzbGlkZXIgaXNudCBcImtub2JcIlxuXHRcdFx0JC5TTElERVJTW1wiI3tzbGlkZXJ9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIFNldCBzdXBlckxheWVyIGZvciBsYWJlbHNcblx0XHRmb3IgbGFiZWwgb2YgJC5MQUJFTFNcblx0XHRcdCQuTEFCRUxTW1wiI3tsYWJlbH1cIl0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXJcblxuXHRcdCMg4oCT4oCT4oCTIFRFTlNJT05cblx0XHRAdGVuc2lvbiA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnRlbnNpb25cblx0XHRAdGVuc2lvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplXG5cdFx0QHRlbnNpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdGVuc2lvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QHRlbnNpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEB0ZW5zaW9uTGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudGVuc2lvblxuXHRcdEB0ZW5zaW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHRlbnNpb25MYWJlbC53aWR0aCcgaGVpZ2h0PSdAdGVuc2lvbkxhYmVsLmhlaWdodCc+I3tAdGVuc2lvbkxhYmVsLm5hbWV9PC9kaXY+XCJcblxuXHRcdCMg4oCT4oCT4oCTIEZSSUNUSU9OXG5cblx0XHRAZnJpY3Rpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy5mcmljdGlvblxuXHRcdEBmcmljdGlvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplXG5cdFx0QGZyaWN0aW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QGZyaWN0aW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAZnJpY3Rpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEBmcmljdGlvbkxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLmZyaWN0aW9uXG5cdFx0QGZyaWN0aW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQGZyaWN0aW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQGZyaWN0aW9uTGFiZWwuaGVpZ2h0Jz4je0BmcmljdGlvbkxhYmVsLm5hbWV9PC9kaXY+XCJcblxuXHRcdCMg4oCT4oCT4oCTIFZFTE9DSVRZXG5cdFx0QHZlbG9jaXR5ID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMudmVsb2NpdHlcblx0XHRAdmVsb2NpdHkua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB2ZWxvY2l0eS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEB2ZWxvY2l0eS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QHZlbG9jaXR5LmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdmVsb2NpdHlMYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy52ZWxvY2l0eVxuXHRcdEB2ZWxvY2l0eUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B2ZWxvY2l0eUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B2ZWxvY2l0eUxhYmVsLmhlaWdodCc+I3tAdmVsb2NpdHlMYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBUT0xFUkFOQ0Vcblx0XHRAdG9sZXJhbmNlID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMudG9sZXJhbmNlXG5cdFx0QHRvbGVyYW5jZS5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplXG5cdFx0QHRvbGVyYW5jZS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEB0b2xlcmFuY2Uua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB0b2xlcmFuY2UuZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEB0b2xlcmFuY2VMYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy50b2xlcmFuY2Vcblx0XHRAdG9sZXJhbmNlTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHRvbGVyYW5jZUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B0b2xlcmFuY2VMYWJlbC5oZWlnaHQnPiN7QHRvbGVyYW5jZUxhYmVsLm5hbWV9PC9kaXY+XCJcblxuXHRcdCMgU2V0IHN0eWxlIGZvciBhbGwgdGhlIGxhYmVsc1xuXHRcdGZvciBzbGlkZXIgaW4gJC5LSU5FVElDUy5sYXllci5zdWJMYXllcnMgd2hlbiBzbGlkZXIuY29uc3RydWN0b3IubmFtZSBpcyBcIkxheWVyXCJcblx0XHRcdGZvciBzdHlsZSBvZiAkLlNUWUxFLnNsaWRlckxhYmVscyBcblx0XHRcdFx0c2xpZGVyLl9lbGVtZW50LnN0eWxlW1wiI3tzdHlsZX1cIl0gPSAkLlNUWUxFLnNsaWRlckxhYmVsc1tcIiN7c3R5bGV9XCJdXG5cblx0XHQjIOKAk+KAk+KAkyBFVkVOVFNcblx0XHRmb3Igc2xpZGVyIGluIEBzdWJMYXllcnMgd2hlbiBzbGlkZXIgaW5zdGFuY2VvZiBTbGlkZXJDb21wb25lbnQgaXMgdHJ1ZVxuXHRcdFx0c2xpZGVyLm9uIFwiY2hhbmdlOnZhbHVlXCIsIC0+XG5cdFx0XHRcdCQuQU5JTUFURS5vcHRpb25zLmN1cnZlID0gXCJzcHJpbmcoI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudGVuc2lvbi52YWx1ZSl9LCAje01hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci5mcmljdGlvbi52YWx1ZSl9LCAje01hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci52ZWxvY2l0eS52YWx1ZSl9LCAje01hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci50b2xlcmFuY2UudmFsdWUgKiAxMDAwKS8xMDAwfSlcIlxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmN1cnZlUHJvcHMuaHRtbCA9IFwiPHRleHRhcmVhIGlkPSdjdXJ2ZVByb3BzJyBzdHlsZT0nd2lkdGg6I3skLlRFWFQuY3VydmVQcm9wcy53aWR0aH1weDsgaGVpZ2h0OiN7JC5URVhULmN1cnZlUHJvcHMuaGVpZ2h0fXB4OyB0ZXh0LWFsaWduOmNlbnRlcjsgbGluZS1oZWlnaHQ6MzRweDsgY29sb3I6I0EwRTM1RjsgZm9udDo0MDAgMjhweCBSb2JvdG8gTW9ubzsgYmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDsgYm9yZGVyOm5vbmU7IHJlc2l6ZTpub25lJz4mcXVvdDsjeyQuQU5JTUFURS5vcHRpb25zLmN1cnZlfSZxdW90OzwvdGV4dGFyZWE+XCJcblxuXHRcdFx0c2xpZGVyLmtub2Iub24gRXZlbnRzLkRyYWdFbmQsIC0+XG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVRhcmdldCgpXG5cblx0YW5pbWF0ZVRhcmdldDogLT5cblx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpblxuXHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIuYW5pbWF0ZSAkLkFOSU1BVEUub3B0aW9uc1xuXG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOS4xXG5cbi8qIFZBUklBQkxFUyAqL1xudmFyICQsIEtpbmV0aWNzLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuJCA9IHtcbiAgS0lORVRJQ1M6IHt9LFxuICBERVZJQ0U6IEZyYW1lci5EZXZpY2UucGhvbmUsXG4gIEJVVFRPTlM6IHt9LFxuICBURVhUOiB7fSxcbiAgU0xJREVSUzoge1xuICAgIGtub2I6IHtcbiAgICAgIGtub2JTaXplOiAyOCxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbiAgICB9LFxuICAgIGZpbGw6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbiAgICB9XG4gIH0sXG4gIExBQkVMUzoge30sXG4gIFNUWUxFOiB7XG4gICAgc2xpZGVyTGFiZWxzOiB7XG4gICAgICBcInZlcnRpY2FsLWFsaWduXCI6IFwiY2VudGVyXCIsXG4gICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jZWxsXCIsXG4gICAgICBcImZvbnRcIjogXCJub3JtYWwgMTAwIDI2cHggUm9ib3RvIE1vbm9cIlxuICAgIH1cbiAgfSxcbiAgQU5JTUFURToge31cbn07XG5cbiQuS0lORVRJQ1MucHJvcHMgPSB7XG4gIG1pZFg6ICQuREVWSUNFLndpZHRoIC8gMixcbiAgbWlkWTogJC5ERVZJQ0UuaGVpZ2h0IC8gMixcbiAgd2lkdGg6ICg3MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNzAwICogKDEgLSAkLkRFVklDRS5zY2FsZSkpLFxuICBoZWlnaHQ6ICg0MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNDAwICogKDEgLSAkLkRFVklDRS5zY2FsZSkpLFxuICBzY2FsZTogMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMxNTE1MTdcIixcbiAgc3VwZXJMYXllcjogJC5ERVZJQ0UsXG4gIHRhcmdldExheWVyOiB7fVxufTtcblxuJC5CVVRUT05TLmNsb3NlQnV0dG9uID0ge1xuICBtYXhYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMjgsXG4gIHk6IDI4LFxuICB3aWR0aDogMjQsXG4gIGhlaWdodDogMjQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG59O1xuXG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YTCA9IHtcbiAgbWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoIC8gMixcbiAgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodCAvIDIsXG4gIHdpZHRoOiAyNCxcbiAgaGVpZ2h0OiA0LFxuICByb3RhdGlvbjogNDUsXG4gIGJvcmRlclJhZGl1czogMTgsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbn07XG5cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSID0ge1xuICBtaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGggLyAyLFxuICBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0IC8gMixcbiAgd2lkdGg6IDI0LFxuICBoZWlnaHQ6IDQsXG4gIHJvdGF0aW9uOiAtNDUsXG4gIGJvcmRlclJhZGl1czogMTgsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbn07XG5cbiQuVEVYVC5hbmltYXRlUHJvcHMgPSB7XG4gIG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAyLFxuICB3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDE2MCxcbiAgaGVpZ2h0OiA4MCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIGlnbm9yZUV2ZW50czogZmFsc2UsXG4gIHByb3BhZ2F0ZUV2ZW50czogZmFsc2Vcbn07XG5cbiQuVEVYVC5jdXJ2ZVByb3BzID0ge1xuICBtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC8gMixcbiAgbWF4WTogJC5LSU5FVElDUy5wcm9wcy5oZWlnaHQgLSAyMCxcbiAgd2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAxLjUsXG4gIGhlaWdodDogNDAsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG59O1xuXG4kLlNMSURFUlMudGVuc2lvbiA9IHtcbiAgeDogMjAwLFxuICB5OiAxMDcsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG1pbjogMCxcbiAgbWF4OiAxMDAwLFxuICB2YWx1ZTogMjUwXG59O1xuXG4kLlNMSURFUlMuZnJpY3Rpb24gPSB7XG4gIHg6IDIwMCxcbiAgeTogMTYxLFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBtaW46IDAsXG4gIG1heDogMTAwLFxuICB2YWx1ZTogNDVcbn07XG5cbiQuU0xJREVSUy52ZWxvY2l0eSA9IHtcbiAgeDogMjAwLFxuICB5OiAyMTUsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG1pbjogMCxcbiAgbWF4OiAxMCxcbiAgdmFsdWU6IDBcbn07XG5cbiQuU0xJREVSUy50b2xlcmFuY2UgPSB7XG4gIHg6IDIwMCxcbiAgeTogMjY5LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBtaW46IDAuMDAxLFxuICBtYXg6IDEsXG4gIHZhbHVlOiAwLjAwMVxufTtcblxuJC5MQUJFTFMudGVuc2lvbiA9IHtcbiAgeDogMjAsXG4gIHk6IDkyLFxuICB3aWR0aDogMTEwLFxuICBoZWlnaHQ6IDM0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJUZW5zaW9uXCJcbn07XG5cbiQuTEFCRUxTLmZyaWN0aW9uID0ge1xuICB4OiAyMCxcbiAgeTogMTQ2LFxuICB3aWR0aDogMTI1LFxuICBoZWlnaHQ6IDM0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJGcmljdGlvblwiXG59O1xuXG4kLkxBQkVMUy52ZWxvY2l0eSA9IHtcbiAgeDogMjAsXG4gIHk6IDIwMCxcbiAgd2lkdGg6IDEyNSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiVmVsb2NpdHlcIlxufTtcblxuJC5MQUJFTFMudG9sZXJhbmNlID0ge1xuICB4OiAyMCxcbiAgeTogMjU0LFxuICB3aWR0aDogMTQxLFxuICBoZWlnaHQ6IDM0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJUb2xlcmFuY2VcIlxufTtcblxuJC5BTklNQVRFLm9wdGlvbnMgPSB7XG4gIGxheWVyOiBudWxsLFxuICBwcm9wZXJ0aWVzOiB7fSxcbiAgY3VydmU6IFwic3ByaW5nKDI1MCwgNDUsIDAsIC4wMDFcIixcbiAgY3VydmVPcHRpb25zOiB7fSxcbiAgdGltZTogMSxcbiAgZGVsYXk6IDAsXG4gIHJlcGVhdDogMCxcbiAgZGVidWc6IGZhbHNlXG59O1xuXG5GcmFtZXIuRGV2aWNlLnBob25lLmNsaXAgPSBmYWxzZTtcblxuRnJhbWVyLkN1cnJlbnRDb250ZXh0Lm9uKFwibGF5ZXI6Y3JlYXRlXCIsIGZ1bmN0aW9uKGxheWVyKSB7XG4gIHJldHVybiBsYXllci5vbihFdmVudHMuQ2xpY2ssIGZ1bmN0aW9uKGUsIGxheWVyKSB7XG4gICAgaWYgKGUuYWx0S2V5ICYmIGxheWVyIGluc3RhbmNlb2YgS2luZXRpY3MgPT09IGZhbHNlICYmIGxheWVyLnN1cGVyTGF5ZXIgIT09ICQuS0lORVRJQ1MubGF5ZXIpIHtcbiAgICAgIGlmICgkLktJTkVUSUNTLmxheWVyKSB7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpO1xuICAgICAgfVxuICAgICAgJC5LSU5FVElDUy50YXJnZXRMYXllciA9IGxheWVyO1xuICAgICAgJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbiA9IGxheWVyLnByb3BzO1xuICAgICAgbmV3IEtpbmV0aWNzKCQuS0lORVRJQ1MucHJvcHMpO1xuXG4gICAgICAvKlxuICAgICAgXG4gICAgICBcdFx0XHRUT0RPOiBJcyB0aGVyZSBhIHdheSB0byByZW1vdmUgbW91c2VldmVudCBsaXN0ZW5lcnMgb24gbGF5ZXJzIHNvIHRoZXJlJ3Mgbm8gY29uZmxpY3Q/XG4gICAgICAgKi9cbiAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGUoe1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgfSxcbiAgICAgICAgY3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcblxuS2luZXRpY3MgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoS2luZXRpY3MsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEtpbmV0aWNzKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIEtpbmV0aWNzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICQuS0lORVRJQ1MubGF5ZXIgPSB0aGlzO1xuICAgIHRoaXMuZHJhZ2dhYmxlLmVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uLnN1cGVyTGF5ZXIgPSB0aGlzO1xuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBuZXcgTGF5ZXIoJC5CVVRUT05TLmNsb3NlQnV0dG9uKTtcbiAgICAkLkJVVFRPTlMuY2xvc2VCdXR0b25YTC5zdXBlckxheWVyID0gdGhpcy5jbG9zZUJ1dHRvbjtcbiAgICAkLkJVVFRPTlMuY2xvc2VCdXR0b25YUi5zdXBlckxheWVyID0gdGhpcy5jbG9zZUJ1dHRvbjtcbiAgICB0aGlzLmNsb3NlQnV0dG9uWEwgPSBuZXcgTGF5ZXIoJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwpO1xuICAgIHRoaXMuY2xvc2VCdXR0b25YUiA9IG5ldyBMYXllcigkLkJVVFRPTlMuY2xvc2VCdXR0b25YUik7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5vbihFdmVudHMuQ2xpY2ssIGZ1bmN0aW9uKCkge1xuICAgICAgJC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW47XG4gICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlKHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNjYWxlOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG4gICAgICB9LCAkLktJTkVUSUNTLmxheWVyLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5kZXN0cm95KCk7XG4gICAgICB9KSk7XG4gICAgfSk7XG4gICAgdGhpcy5zZXR1cFRleHQoKTtcbiAgICB0aGlzLnNldHVwU2xpZGVycygpO1xuICB9XG5cbiAgS2luZXRpY3MucHJvdG90eXBlLnNldHVwVGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0ZXh0O1xuICAgIGZvciAodGV4dCBpbiAkLlRFWFQpIHtcbiAgICAgIGlmICh0ZXh0ICE9PSBcImlucHV0XCIpIHtcbiAgICAgICAgJC5URVhUW1wiXCIgKyB0ZXh0XS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hbmltYXRlUHJvcHMgPSBuZXcgTGF5ZXIoJC5URVhULmFuaW1hdGVQcm9wcyk7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wid2lkdGhcIl0gPSB0aGlzLmFuaW1hdGVQcm9wcy53aWR0aCArIFwicHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiaGVpZ2h0XCJdID0gdGhpcy5hbmltYXRlUHJvcHMuaGVpZ2h0ICsgXCJweFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250XCJdID0gXCJub3JtYWwgNDAwIDI2cHggUm9ib3RvIE1vbm9cIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMjZweFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJjb2xvclwiXSA9IFwid2hpdGVcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiLXdla2l0LXVzZXItc2VsZWN0XCJdID0gXCJ0ZXh0XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcIlwiICsgJC5LSU5FVElDUy5sYXllci5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hbmltYXRlUHJvcHNJbnB1dCk7XG5cbiAgICAvKlxuICAgIFxuICAgIFx0XHRUT0RPOiBNYWtlIGN1cnZlIHByb3BzIGFuIGlucHV0IHdoZXJlIHlvdSBjYW4gdHlwZSBpbiBpdCBpZiB5b3Ugd2lzaCAoYWRqdXN0cyBrbm9iIHZhbHVlcylcbiAgICBcdFx0QlVHIChzZW1pKTogY3VydmVQcm9wcyBpcyBlZGl0YWJsZVxuICAgICAqL1xuICAgIHRoaXMuY3VydmVQcm9wcyA9IG5ldyBMYXllcigkLlRFWFQuY3VydmVQcm9wcyk7XG4gICAgdGhpcy5jdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBvbmNsaWNrPSd0aGlzLnNlbGVjdCgpJyBzdHlsZT0nd2lkdGg6XCIgKyB0aGlzLmN1cnZlUHJvcHMud2lkdGggKyBcInB4OyBoZWlnaHQ6XCIgKyB0aGlzLmN1cnZlUHJvcHMuaGVpZ2h0ICsgXCJweDsgdGV4dC1hbGlnbjpjZW50ZXI7IGxpbmUtaGVpZ2h0OjM0cHg7IGNvbG9yOiNBMEUzNUY7IGZvbnQ6IDQwMCAyOHB4IFJvYm90byBNb25vOyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsgYm9yZGVyOiBub25lOyByZXNpemU6IG5vbmUnPiZxdW90O1wiICsgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgKyBcIiZxdW90OzwvdGV4dGFyZWE+XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlciA9IFwiIFwiO1xuICAgIH07XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5vbmJsdXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIjtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmFuaW1hdGVQcm9wc0lucHV0Lm9ua2V5dXAgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgaSwgaW5kZXgsIGxlbiwgb3B0aW9uLCBvcHRpb25zLCByZWdleDtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpO1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIjtcbiAgICAgICAgaWYgKCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICByZWdleCA9IC8oXFxTKlxcdykvZztcbiAgICAgICAgICBvcHRpb25zID0gJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgb3B0aW9uID0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgIGluZGV4ID0gXy5pbmRleE9mKG9wdGlvbnMsIG9wdGlvbik7XG4gICAgICAgICAgICBpZiAoaW5kZXggJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICQuQU5JTUFURS5vcHRpb25zLnByb3BlcnRpZXNbXCJcIiArIG9wdGlvbl0gPSBvcHRpb25zW2luZGV4ICsgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgS2luZXRpY3MucHJvdG90eXBlLnNldHVwU2xpZGVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLCBqLCBsYWJlbCwgbGVuLCBsZW4xLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNsaWRlciwgc3R5bGU7XG4gICAgZm9yIChzbGlkZXIgaW4gJC5TTElERVJTKSB7XG4gICAgICBpZiAoc2xpZGVyICE9PSBcImtub2JcIikge1xuICAgICAgICAkLlNMSURFUlNbXCJcIiArIHNsaWRlcl0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXI7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGFiZWwgaW4gJC5MQUJFTFMpIHtcbiAgICAgICQuTEFCRUxTW1wiXCIgKyBsYWJlbF0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXI7XG4gICAgfVxuICAgIHRoaXMudGVuc2lvbiA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLnRlbnNpb24pO1xuICAgIHRoaXMudGVuc2lvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMudGVuc2lvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRlbnNpb24ua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLnRlbnNpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50ZW5zaW9uTGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMudGVuc2lvbik7XG4gICAgdGhpcy50ZW5zaW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHRlbnNpb25MYWJlbC53aWR0aCcgaGVpZ2h0PSdAdGVuc2lvbkxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLnRlbnNpb25MYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICB0aGlzLmZyaWN0aW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMuZnJpY3Rpb24pO1xuICAgIHRoaXMuZnJpY3Rpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLmZyaWN0aW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMuZnJpY3Rpb24ua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLmZyaWN0aW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMuZnJpY3Rpb25MYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy5mcmljdGlvbik7XG4gICAgdGhpcy5mcmljdGlvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0BmcmljdGlvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0BmcmljdGlvbkxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLmZyaWN0aW9uTGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLnZlbG9jaXR5KTtcbiAgICB0aGlzLnZlbG9jaXR5Lmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy52ZWxvY2l0eS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnZlbG9jaXR5Lmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy52ZWxvY2l0eS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnZlbG9jaXR5TGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMudmVsb2NpdHkpO1xuICAgIHRoaXMudmVsb2NpdHlMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdmVsb2NpdHlMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdmVsb2NpdHlMYWJlbC5oZWlnaHQnPlwiICsgdGhpcy52ZWxvY2l0eUxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHRoaXMudG9sZXJhbmNlID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMudG9sZXJhbmNlKTtcbiAgICB0aGlzLnRvbGVyYW5jZS5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMudG9sZXJhbmNlLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudG9sZXJhbmNlLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy50b2xlcmFuY2UuZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50b2xlcmFuY2VMYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy50b2xlcmFuY2UpO1xuICAgIHRoaXMudG9sZXJhbmNlTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHRvbGVyYW5jZUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B0b2xlcmFuY2VMYWJlbC5oZWlnaHQnPlwiICsgdGhpcy50b2xlcmFuY2VMYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICByZWYgPSAkLktJTkVUSUNTLmxheWVyLnN1YkxheWVycztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNsaWRlciA9IHJlZltpXTtcbiAgICAgIGlmIChzbGlkZXIuY29uc3RydWN0b3IubmFtZSA9PT0gXCJMYXllclwiKSB7XG4gICAgICAgIGZvciAoc3R5bGUgaW4gJC5TVFlMRS5zbGlkZXJMYWJlbHMpIHtcbiAgICAgICAgICBzbGlkZXIuX2VsZW1lbnQuc3R5bGVbXCJcIiArIHN0eWxlXSA9ICQuU1RZTEUuc2xpZGVyTGFiZWxzW1wiXCIgKyBzdHlsZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmVmMSA9IHRoaXMuc3ViTGF5ZXJzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIHNsaWRlciA9IHJlZjFbal07XG4gICAgICBpZiAoIShzbGlkZXIgaW5zdGFuY2VvZiBTbGlkZXJDb21wb25lbnQgPT09IHRydWUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgc2xpZGVyLm9uKFwiY2hhbmdlOnZhbHVlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSA9IFwic3ByaW5nKFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci50ZW5zaW9uLnZhbHVlKSkgKyBcIiwgXCIgKyAoTWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLmZyaWN0aW9uLnZhbHVlKSkgKyBcIiwgXCIgKyAoTWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnZlbG9jaXR5LnZhbHVlKSkgKyBcIiwgXCIgKyAoTWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRvbGVyYW5jZS52YWx1ZSAqIDEwMDApIC8gMTAwMCkgKyBcIilcIjtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuY3VydmVQcm9wcy5odG1sID0gXCI8dGV4dGFyZWEgaWQ9J2N1cnZlUHJvcHMnIHN0eWxlPSd3aWR0aDpcIiArICQuVEVYVC5jdXJ2ZVByb3BzLndpZHRoICsgXCJweDsgaGVpZ2h0OlwiICsgJC5URVhULmN1cnZlUHJvcHMuaGVpZ2h0ICsgXCJweDsgdGV4dC1hbGlnbjpjZW50ZXI7IGxpbmUtaGVpZ2h0OjM0cHg7IGNvbG9yOiNBMEUzNUY7IGZvbnQ6NDAwIDI4cHggUm9ib3RvIE1vbm87IGJhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7IGJvcmRlcjpub25lOyByZXNpemU6bm9uZSc+JnF1b3Q7XCIgKyAkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSArIFwiJnF1b3Q7PC90ZXh0YXJlYT5cIjtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0cy5wdXNoKHNsaWRlci5rbm9iLm9uKEV2ZW50cy5EcmFnRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVRhcmdldCgpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBLaW5ldGljcy5wcm90b3R5cGUuYW5pbWF0ZVRhcmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgIHJldHVybiAkLktJTkVUSUNTLnRhcmdldExheWVyLmFuaW1hdGUoJC5BTklNQVRFLm9wdGlvbnMpO1xuICB9O1xuXG4gIHJldHVybiBLaW5ldGljcztcblxufSkoTGF5ZXIpO1xuIl19
