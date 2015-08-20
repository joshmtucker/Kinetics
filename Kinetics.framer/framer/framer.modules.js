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
        return $.KINETICS.layer.scale += .25;
      } else if (keys[18] && keys[189]) {
        $.KINETICS.layer.scale -= .25;
        if ($.KINETICS.layer.scale < .25) {
          return $.KINETICS.layer.scale = .25;
        }
      }
    };
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
        return $.KINETICS.layer.scale += .25;
      } else if (keys[18] && keys[189]) {
        $.KINETICS.layer.scale -= .25;
        if ($.KINETICS.layer.scale < .25) {
          return $.KINETICS.layer.scale = .25;
        }
      }
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zaG10dWNrZXIvR2l0SHViL0tpbmV0aWNzL0tpbmV0aWNzLmZyYW1lci9tb2R1bGVzL0tpbmV0aWNzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2pvc2htdHVja2VyL0dpdEh1Yi9LaW5ldGljcy9LaW5ldGljcy5mcmFtZXIvbW9kdWxlcy9LaW5ldGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsZUFBQTtBQUFBLElBQUEsV0FBQTtFQUFBOzZCQUFBOztBQUFBLENBRUEsR0FDQztBQUFBLEVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxFQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBRHRCO0FBQUEsRUFFQSxPQUFBLEVBQVMsRUFGVDtBQUFBLEVBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxFQUlBLE9BQUEsRUFBUztBQUFBLElBQUMsSUFBQSxFQUFLO0FBQUEsTUFBQyxRQUFBLEVBQVUsRUFBWDtBQUFBLE1BQWUsZUFBQSxFQUFpQixTQUFoQztLQUFOO0FBQUEsSUFBa0QsSUFBQSxFQUFLO0FBQUEsTUFBQyxlQUFBLEVBQWlCLFNBQWxCO0tBQXZEO0dBSlQ7QUFBQSxFQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsRUFNQSxLQUFBLEVBQU87QUFBQSxJQUFDLFlBQUEsRUFBYTtBQUFBLE1BQUMsZ0JBQUEsRUFBa0IsUUFBbkI7QUFBQSxNQUE2QixTQUFBLEVBQVcsWUFBeEM7QUFBQSxNQUFzRCxNQUFBLEVBQVEsNkJBQTlEO0tBQWQ7R0FOUDtBQUFBLEVBT0EsT0FBQSxFQUFTLEVBUFQ7Q0FIRCxDQUFBOztBQUFBLENBWUMsQ0FBQyxRQUFRLENBQUMsS0FBWCxHQUNDO0FBQUEsRUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFULEdBQWUsQ0FBckI7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjIyBWQVJJQUJMRVMgIyMjXG5cbiQgPSBcblx0S0lORVRJQ1M6IHt9XG5cdERFVklDRTogRnJhbWVyLkRldmljZS5waG9uZVxuXHRCVVRUT05TOiB7fVxuXHRURVhUOiB7fVxuXHRTTElERVJTOiB7a25vYjp7a25vYlNpemU6IDI4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifSwgZmlsbDp7YmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn19XG5cdExBQkVMUzoge31cblx0U1RZTEU6IHtzbGlkZXJMYWJlbHM6e1widmVydGljYWwtYWxpZ25cIjogXCJjZW50ZXJcIiwgXCJkaXNwbGF5XCI6IFwidGFibGUtY2VsbFwiLCBcImZvbnRcIjogXCJub3JtYWwgMTAwIDI2cHggUm9ib3RvIE1vbm9cIn19XG5cdEFOSU1BVEU6IHt9XG5cbiQuS0lORVRJQ1MucHJvcHMgPSBcblx0bWlkWDogJC5ERVZJQ0Uud2lkdGgvMiBcblx0bWlkWTogJC5ERVZJQ0UuaGVpZ2h0LzIgXG5cdHdpZHRoOiAoNzAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDcwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0aGVpZ2h0OiAoNDAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDQwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0c2NhbGU6IDBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMxNTE1MTdcIlxuXHRzdXBlckxheWVyOiAkLkRFVklDRVxuXHR0YXJnZXRMYXllcjoge31cblxuIyDigJPigJPigJMgQlVUVE9OU1xuJC5CVVRUT05TLmNsb3NlQnV0dG9uID0ge21heFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAyOCwgeTogMjgsIHdpZHRoOiAyNCwgaGVpZ2h0OiAyNCwgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJ9XG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YTCA9IHttaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGgvMiwgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodC8yLCB3aWR0aDogMjQsIGhlaWdodDogNCwgcm90YXRpb246IDQ1LCBib3JkZXJSYWRpdXM6IDE4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifVxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIgPSB7bWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoLzIsIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQvMiwgd2lkdGg6IDI0LCBoZWlnaHQ6IDQsIHJvdGF0aW9uOiAtNDUsIGJvcmRlclJhZGl1czogMTgsIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJ9XG5cbiMg4oCT4oCT4oCTIFRFWFRcbiQuVEVYVC5hbmltYXRlUHJvcHMgPSBcblx0bWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8yXG5cdHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMTYwXG5cdGhlaWdodDogODBcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0aWdub3JlRXZlbnRzOiBmYWxzZVxuXHRwcm9wYWdhdGVFdmVudHM6IGZhbHNlXG5cbiQuVEVYVC5jdXJ2ZVByb3BzID0gXG5cdG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMlxuXHRtYXhZOiAkLktJTkVUSUNTLnByb3BzLmhlaWdodC0yMFxuXHR3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8xLjVcblx0aGVpZ2h0OiA0MFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXG4jIOKAk+KAk+KAkyBTTElERVJTXG5cbiQuU0xJREVSUy50ZW5zaW9uID0gXG5cdHg6IDIwMFxuXHR5OiAxMDdcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bWluOiAwXG5cdG1heDogMTAwMFxuXHR2YWx1ZTogMjUwXG5cbiQuU0xJREVSUy5mcmljdGlvbiA9IFxuXHR4OiAyMDBcblx0eTogMTYxXG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG1pbjogMFxuXHRtYXg6IDEwMFxuXHR2YWx1ZTogNDVcblxuJC5TTElERVJTLnZlbG9jaXR5ID0gXG5cdHg6IDIwMFxuXHR5OiAyMTVcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bWluOiAwXG5cdG1heDogMTBcblx0dmFsdWU6IDBcblxuJC5TTElERVJTLnRvbGVyYW5jZSA9IFxuXHR4OiAyMDBcblx0eTogMjY5XG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG1pbjogMC4wMDFcblx0bWF4OiAxXG5cdHZhbHVlOiAwLjAwMVxuXG4jIOKAk+KAk+KAkyBMQUJFTFNcbiQuTEFCRUxTLnRlbnNpb24gPSBcblx0eDogMjBcblx0eTogOTJcblx0d2lkdGg6IDExMFxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVGVuc2lvblwiXG5cbiQuTEFCRUxTLmZyaWN0aW9uID0gXG5cdHg6IDIwXG5cdHk6IDE0NlxuXHR3aWR0aDogMTI1XG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJGcmljdGlvblwiXG5cbiQuTEFCRUxTLnZlbG9jaXR5ID0gXG5cdHg6IDIwXG5cdHk6IDIwMFxuXHR3aWR0aDogMTI1XG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJWZWxvY2l0eVwiXG5cbiQuTEFCRUxTLnRvbGVyYW5jZSA9IFxuXHR4OiAyMFxuXHR5OiAyNTRcblx0d2lkdGg6IDE0MVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVG9sZXJhbmNlXCJcblxuIyDigJPigJPigJMgQU5JTUFURVxuJC5BTklNQVRFLm9wdGlvbnMgPVxuXHRsYXllcjogbnVsbFxuXHRwcm9wZXJ0aWVzOiB7fVxuXHRjdXJ2ZTogXCJzcHJpbmcoMjUwLCA0NSwgMCwgLjAwMVwiXG5cdGN1cnZlT3B0aW9uczoge31cblx0dGltZTogMVxuXHRkZWxheTogMFxuXHRyZXBlYXQ6IDBcblx0ZGVidWc6IGZhbHNlXG5cbiMgRGlzYWJsZSBjbGlwIG9uIGRldmljZVxuRnJhbWVyLkRldmljZS5waG9uZS5jbGlwID0gZmFsc2VcblxuRnJhbWVyLkN1cnJlbnRDb250ZXh0Lm9uIFwibGF5ZXI6Y3JlYXRlXCIsIChsYXllcikgLT5cblx0bGF5ZXIub24gRXZlbnRzLkNsaWNrLCAoZSwgbGF5ZXIpIC0+XG5cdFx0IyBPbmx5IG9uIGFuIGFsdChvcHRpb24pICsgY2xpY2tcblx0XHRpZiBlLmFsdEtleSBhbmQgbGF5ZXIgaW5zdGFuY2VvZiBLaW5ldGljcyBpcyBmYWxzZSBhbmQgbGF5ZXIuc3VwZXJMYXllciBpc250ICQuS0lORVRJQ1MubGF5ZXJcblxuXHRcdFx0IyBEZXN0cm95IGlmIGxheWVyIGFscmVhZHkgZXhpc3RzXG5cdFx0XHRpZiAkLktJTkVUSUNTLmxheWVyIHRoZW4gJC5LSU5FVElDUy5sYXllci5kZXN0cm95KClcblx0XHRcdFxuXHRcdFx0IyBDcmVhdGUgS2luZXRpY3MgbGF5ZXJcblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIgPSBsYXllclxuXHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbiA9IGxheWVyLnByb3BzXG5cdFx0XHRuZXcgS2luZXRpY3MgJC5LSU5FVElDUy5wcm9wc1xuXG5cdFx0XHQjIyNcblxuXHRcdFx0VE9ETzogSXMgdGhlcmUgYSB3YXkgdG8gcmVtb3ZlIG1vdXNlZXZlbnQgbGlzdGVuZXJzIG9uIGxheWVycyBzbyB0aGVyZSdzIG5vIGNvbmZsaWN0P1xuXG5cdFx0XHQjIyNcblxuXHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcblxuY2xhc3MgS2luZXRpY3MgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBSZWZlcmVuY2UgS2luZXRpY3Ncblx0XHQkLktJTkVUSUNTLmxheWVyID0gQFxuXG5cdFx0QGRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZVxuXHRcdEBkcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXG5cdFx0IyBBZGQgY2xvc2UgYnV0dG9uXG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uLnN1cGVyTGF5ZXIgPSBAXG5cdFx0QGNsb3NlQnV0dG9uID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblxuXHRcdFx0XG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uWEwuc3VwZXJMYXllciA9IEBjbG9zZUJ1dHRvblxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSLnN1cGVyTGF5ZXIgPSBAY2xvc2VCdXR0b25cblx0XHRAY2xvc2VCdXR0b25YTCA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25YTFxuXHRcdEBjbG9zZUJ1dHRvblhSID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSXG5cblx0XHQjIOKAk+KAk+KAkyBFVkVOVFNcblx0XHQjIEFkanVzdCBzaXplIG9mIEtpbmV0aWNzIHdpbmRvdyB3aXRoIG9wdGlvbiArIHBsdXMgb3Igb3B0aW9uICsgbWludXNcblx0XHRrZXlzID0gW11cblx0XHRkb2N1bWVudC5vbmtleWRvd24gPSBkb2N1bWVudC5vbmtleXVwID0gKGUpIC0+XG5cdFx0XHRrZXlzW2Uua2V5Q29kZV0gPSBlLnR5cGUgPT0gXCJrZXlkb3duXCJcblxuXHRcdFx0IyBTY2FsZSB1cFxuXHRcdFx0aWYga2V5c1sxOF0gYW5kIGtleXNbMTg3XVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLnNjYWxlICs9IC4yNVxuXHRcdFx0ZWxzZSBpZiBrZXlzWzE4XSBhbmQga2V5c1sxODldXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgLT0gLjI1XG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPSAuMjUgaWYgJC5LSU5FVElDUy5sYXllci5zY2FsZSA8IC4yNVxuXG5cblxuXG5cdFx0QGNsb3NlQnV0dG9uLm9uIEV2ZW50cy5DbGljaywgLT5cblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luXG5cblx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNjYWxlOiAwXG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG5cblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPlxuXHRcdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpXG5cblx0XHRAc2V0dXBUZXh0KClcblx0XHRAc2V0dXBTbGlkZXJzKClcblxuXHRzZXR1cFRleHQ6IC0+XG5cdFx0IyBTZXR1cCBzdXBlckxheWVyXG5cdFx0Zm9yIHRleHQgb2YgJC5URVhUIHdoZW4gdGV4dCBpc250IFwiaW5wdXRcIlxuXHRcdFx0JC5URVhUW1wiI3t0ZXh0fVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyDigJPigJPigJMgQU5JTUFURSBQUk9QRVJUSUVTXG5cdFx0QGFuaW1hdGVQcm9wcyA9IG5ldyBMYXllciAkLlRFWFQuYW5pbWF0ZVByb3BzXG5cblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ3aWR0aFwiXSA9IFwiI3tAYW5pbWF0ZVByb3BzLndpZHRofXB4XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJoZWlnaHRcIl0gPSBcIiN7QGFuaW1hdGVQcm9wcy5oZWlnaHR9cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnRcIl0gPSBcIm5vcm1hbCA0MDAgMjZweCBSb2JvdG8gTW9ub1wiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjI2cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImNvbG9yXCJdID0gXCJ3aGl0ZVwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiLXdla2l0LXVzZXItc2VsZWN0XCJdID0gXCJ0ZXh0XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCIjeyQuS0lORVRJQ1MubGF5ZXIuYmFja2dyb3VuZENvbG9yfVwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0QGFuaW1hdGVQcm9wcy5fZWxlbWVudC5hcHBlbmRDaGlsZChAYW5pbWF0ZVByb3BzSW5wdXQpXG5cblx0XHQjIOKAk+KAk+KAkyBDVVJWRSBQUk9QRVJUSUVTXG5cblx0XHQjIyNcblxuXHRcdFRPRE86IE1ha2UgY3VydmUgcHJvcHMgYW4gaW5wdXQgd2hlcmUgeW91IGNhbiB0eXBlIGluIGl0IGlmIHlvdSB3aXNoIChhZGp1c3RzIGtub2IgdmFsdWVzKVxuXHRcdEJVRyAoc2VtaSk6IGN1cnZlUHJvcHMgaXMgZWRpdGFibGVcblxuXHRcdCMjI1xuXG5cblx0XHRAY3VydmVQcm9wcyA9IG5ldyBMYXllciAkLlRFWFQuY3VydmVQcm9wc1xuXHRcdEBjdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBvbmNsaWNrPSd0aGlzLnNlbGVjdCgpJyBzdHlsZT0nd2lkdGg6I3tAY3VydmVQcm9wcy53aWR0aH1weDsgaGVpZ2h0OiN7QGN1cnZlUHJvcHMuaGVpZ2h0fXB4OyB0ZXh0LWFsaWduOmNlbnRlcjsgbGluZS1oZWlnaHQ6MzRweDsgY29sb3I6I0EwRTM1RjsgZm9udDogNDAwIDI4cHggUm9ib3RvIE1vbm87IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyBib3JkZXI6IG5vbmU7IHJlc2l6ZTogbm9uZSc+JnF1b3Q7I3skLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZX0mcXVvdDs8L3RleHRhcmVhPlwiXG5cblxuXHRcdCMg4oCT4oCT4oCTIEVWRU5UU1xuXHRcdCMgU2VsZWN0IGlucHV0XG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0Lm9uY2xpY2sgPSAtPlxuXHRcdFx0QGZvY3VzKClcblx0XHRcdEBwbGFjZWhvbGRlciA9IFwiIFwiXG5cblx0XHQjIFJlcGxhY2UgcGxhY2Vob2xkZXJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQub25ibHVyID0gLT5cblx0XHRcdEBwbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCJcblxuXHRcdCMgU3VibWl0dGluZyBhbmltYXRpb24gcHJvcGVydGllc1xuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5vbmtleXVwID0gKGUpIC0+XG5cdFx0XHRpZiBlLmtleUNvZGUgaXMgMTNcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKClcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCJcblxuXHRcdFx0XHRpZiAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlIGlzbnQgXCJcIlxuXG5cdFx0XHRcdFx0cmVnZXggPSAvKFxcUypcXHcpL2dcblxuXHRcdFx0XHRcdG9wdGlvbnMgPSAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlLm1hdGNoKHJlZ2V4KVxuXG5cdFx0XHRcdFx0Zm9yIG9wdGlvbiBpbiBvcHRpb25zXG5cdFx0XHRcdFx0XHRpbmRleCA9IF8uaW5kZXhPZihvcHRpb25zLCBvcHRpb24pXG5cdFx0XHRcdFx0XHRpZiBpbmRleCAlIDIgaXMgMFxuXHRcdFx0XHRcdFx0XHQkLkFOSU1BVEUub3B0aW9ucy5wcm9wZXJ0aWVzW1wiI3tvcHRpb259XCJdID0gb3B0aW9uc1tpbmRleCsxXVxuXG5cdFx0XHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblxuXHRzZXR1cFNsaWRlcnM6IC0+XG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3Igc2xpZGVyc1xuXHRcdGZvciBzbGlkZXIgb2YgJC5TTElERVJTIHdoZW4gc2xpZGVyIGlzbnQgXCJrbm9iXCJcblx0XHRcdCQuU0xJREVSU1tcIiN7c2xpZGVyfVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3IgbGFiZWxzXG5cdFx0Zm9yIGxhYmVsIG9mICQuTEFCRUxTXG5cdFx0XHQkLkxBQkVMU1tcIiN7bGFiZWx9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIOKAk+KAk+KAkyBURU5TSU9OXG5cdFx0QHRlbnNpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy50ZW5zaW9uXG5cdFx0QHRlbnNpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0ZW5zaW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QHRlbnNpb24ua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB0ZW5zaW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdGVuc2lvbkxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLnRlbnNpb25cblx0XHRAdGVuc2lvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0ZW5zaW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQHRlbnNpb25MYWJlbC5oZWlnaHQnPiN7QHRlbnNpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBGUklDVElPTlxuXG5cdFx0QGZyaWN0aW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMuZnJpY3Rpb25cblx0XHRAZnJpY3Rpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEBmcmljdGlvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEBmcmljdGlvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QGZyaWN0aW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAZnJpY3Rpb25MYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy5mcmljdGlvblxuXHRcdEBmcmljdGlvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0BmcmljdGlvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0BmcmljdGlvbkxhYmVsLmhlaWdodCc+I3tAZnJpY3Rpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBWRUxPQ0lUWVxuXHRcdEB2ZWxvY2l0eSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnZlbG9jaXR5XG5cdFx0QHZlbG9jaXR5Lmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemVcblx0XHRAdmVsb2NpdHkua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdmVsb2NpdHkua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB2ZWxvY2l0eS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvclxuXG5cdFx0QHZlbG9jaXR5TGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudmVsb2NpdHlcblx0XHRAdmVsb2NpdHlMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdmVsb2NpdHlMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdmVsb2NpdHlMYWJlbC5oZWlnaHQnPiN7QHZlbG9jaXR5TGFiZWwubmFtZX08L2Rpdj5cIlxuXG5cdFx0IyDigJPigJPigJMgVE9MRVJBTkNFXG5cdFx0QHRvbGVyYW5jZSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnRvbGVyYW5jZVxuXHRcdEB0b2xlcmFuY2Uua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0b2xlcmFuY2Uua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdG9sZXJhbmNlLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAdG9sZXJhbmNlLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdG9sZXJhbmNlTGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudG9sZXJhbmNlXG5cdFx0QHRvbGVyYW5jZUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0b2xlcmFuY2VMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdG9sZXJhbmNlTGFiZWwuaGVpZ2h0Jz4je0B0b2xlcmFuY2VMYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIFNldCBzdHlsZSBmb3IgYWxsIHRoZSBsYWJlbHNcblx0XHRmb3Igc2xpZGVyIGluICQuS0lORVRJQ1MubGF5ZXIuc3ViTGF5ZXJzIHdoZW4gc2xpZGVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJMYXllclwiXG5cdFx0XHRmb3Igc3R5bGUgb2YgJC5TVFlMRS5zbGlkZXJMYWJlbHMgXG5cdFx0XHRcdHNsaWRlci5fZWxlbWVudC5zdHlsZVtcIiN7c3R5bGV9XCJdID0gJC5TVFlMRS5zbGlkZXJMYWJlbHNbXCIje3N0eWxlfVwiXVxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0Zm9yIHNsaWRlciBpbiBAc3ViTGF5ZXJzIHdoZW4gc2xpZGVyIGluc3RhbmNlb2YgU2xpZGVyQ29tcG9uZW50IGlzIHRydWVcblx0XHRcdHNsaWRlci5vbiBcImNoYW5nZTp2YWx1ZVwiLCAtPlxuXHRcdFx0XHQkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSA9IFwic3ByaW5nKCN7TWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRlbnNpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIuZnJpY3Rpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudmVsb2NpdHkudmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudG9sZXJhbmNlLnZhbHVlICogMTAwMCkvMTAwMH0pXCJcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5jdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBpZD0nY3VydmVQcm9wcycgc3R5bGU9J3dpZHRoOiN7JC5URVhULmN1cnZlUHJvcHMud2lkdGh9cHg7IGhlaWdodDojeyQuVEVYVC5jdXJ2ZVByb3BzLmhlaWdodH1weDsgdGV4dC1hbGlnbjpjZW50ZXI7IGxpbmUtaGVpZ2h0OjM0cHg7IGNvbG9yOiNBMEUzNUY7IGZvbnQ6NDAwIDI4cHggUm9ib3RvIE1vbm87IGJhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7IGJvcmRlcjpub25lOyByZXNpemU6bm9uZSc+JnF1b3Q7I3skLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZX0mcXVvdDs8L3RleHRhcmVhPlwiXG5cblx0XHRcdHNsaWRlci5rbm9iLm9uIEV2ZW50cy5EcmFnRW5kLCAtPlxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVUYXJnZXQoKVxuXG5cdGFuaW1hdGVUYXJnZXQ6IC0+XG5cdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLmFuaW1hdGUgJC5BTklNQVRFLm9wdGlvbnNcblxuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjkuMVxuXG4vKiBWQVJJQUJMRVMgKi9cbnZhciAkLCBLaW5ldGljcyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiQgPSB7XG4gIEtJTkVUSUNTOiB7fSxcbiAgREVWSUNFOiBGcmFtZXIuRGV2aWNlLnBob25lLFxuICBCVVRUT05TOiB7fSxcbiAgVEVYVDoge30sXG4gIFNMSURFUlM6IHtcbiAgICBrbm9iOiB7XG4gICAgICBrbm9iU2l6ZTogMjgsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG4gICAgfSxcbiAgICBmaWxsOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG4gICAgfVxuICB9LFxuICBMQUJFTFM6IHt9LFxuICBTVFlMRToge1xuICAgIHNsaWRlckxhYmVsczoge1xuICAgICAgXCJ2ZXJ0aWNhbC1hbGlnblwiOiBcImNlbnRlclwiLFxuICAgICAgXCJkaXNwbGF5XCI6IFwidGFibGUtY2VsbFwiLFxuICAgICAgXCJmb250XCI6IFwibm9ybWFsIDEwMCAyNnB4IFJvYm90byBNb25vXCJcbiAgICB9XG4gIH0sXG4gIEFOSU1BVEU6IHt9XG59O1xuXG4kLktJTkVUSUNTLnByb3BzID0ge1xuICBtaWRYOiAkLkRFVklDRS53aWR0aCAvIDIsXG4gIG1pZFk6ICQuREVWSUNFLmhlaWdodCAvIDIsXG4gIHdpZHRoOiAoNzAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDcwMCAqICgxIC0gJC5ERVZJQ0Uuc2NhbGUpKSxcbiAgaGVpZ2h0OiAoNDAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDQwMCAqICgxIC0gJC5ERVZJQ0Uuc2NhbGUpKSxcbiAgc2NhbGU6IDAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjMTUxNTE3XCIsXG4gIHN1cGVyTGF5ZXI6ICQuREVWSUNFLFxuICB0YXJnZXRMYXllcjoge31cbn07XG5cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvbiA9IHtcbiAgbWF4WDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDI4LFxuICB5OiAyOCxcbiAgd2lkdGg6IDI0LFxuICBoZWlnaHQ6IDI0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxufTtcblxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwgPSB7XG4gIG1pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aCAvIDIsXG4gIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQgLyAyLFxuICB3aWR0aDogMjQsXG4gIGhlaWdodDogNCxcbiAgcm90YXRpb246IDQ1LFxuICBib3JkZXJSYWRpdXM6IDE4LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG59O1xuXG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YUiA9IHtcbiAgbWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoIC8gMixcbiAgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodCAvIDIsXG4gIHdpZHRoOiAyNCxcbiAgaGVpZ2h0OiA0LFxuICByb3RhdGlvbjogLTQ1LFxuICBib3JkZXJSYWRpdXM6IDE4LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwiXG59O1xuXG4kLlRFWFQuYW5pbWF0ZVByb3BzID0ge1xuICBtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC8gMixcbiAgd2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAxNjAsXG4gIGhlaWdodDogODAsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBpZ25vcmVFdmVudHM6IGZhbHNlLFxuICBwcm9wYWdhdGVFdmVudHM6IGZhbHNlXG59O1xuXG4kLlRFWFQuY3VydmVQcm9wcyA9IHtcbiAgbWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAvIDIsXG4gIG1heFk6ICQuS0lORVRJQ1MucHJvcHMuaGVpZ2h0IC0gMjAsXG4gIHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC8gMS41LFxuICBoZWlnaHQ6IDQwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxufTtcblxuJC5TTElERVJTLnRlbnNpb24gPSB7XG4gIHg6IDIwMCxcbiAgeTogMTA3LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBtaW46IDAsXG4gIG1heDogMTAwMCxcbiAgdmFsdWU6IDI1MFxufTtcblxuJC5TTElERVJTLmZyaWN0aW9uID0ge1xuICB4OiAyMDAsXG4gIHk6IDE2MSxcbiAgd2lkdGg6IDQ2MCxcbiAgaGVpZ2h0OiAxMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwMCxcbiAgdmFsdWU6IDQ1XG59O1xuXG4kLlNMSURFUlMudmVsb2NpdHkgPSB7XG4gIHg6IDIwMCxcbiAgeTogMjE1LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBtaW46IDAsXG4gIG1heDogMTAsXG4gIHZhbHVlOiAwXG59O1xuXG4kLlNMSURFUlMudG9sZXJhbmNlID0ge1xuICB4OiAyMDAsXG4gIHk6IDI2OSxcbiAgd2lkdGg6IDQ2MCxcbiAgaGVpZ2h0OiAxMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIixcbiAgbWluOiAwLjAwMSxcbiAgbWF4OiAxLFxuICB2YWx1ZTogMC4wMDFcbn07XG5cbiQuTEFCRUxTLnRlbnNpb24gPSB7XG4gIHg6IDIwLFxuICB5OiA5MixcbiAgd2lkdGg6IDExMCxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiVGVuc2lvblwiXG59O1xuXG4kLkxBQkVMUy5mcmljdGlvbiA9IHtcbiAgeDogMjAsXG4gIHk6IDE0NixcbiAgd2lkdGg6IDEyNSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiRnJpY3Rpb25cIlxufTtcblxuJC5MQUJFTFMudmVsb2NpdHkgPSB7XG4gIHg6IDIwLFxuICB5OiAyMDAsXG4gIHdpZHRoOiAxMjUsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlZlbG9jaXR5XCJcbn07XG5cbiQuTEFCRUxTLnRvbGVyYW5jZSA9IHtcbiAgeDogMjAsXG4gIHk6IDI1NCxcbiAgd2lkdGg6IDE0MSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiVG9sZXJhbmNlXCJcbn07XG5cbiQuQU5JTUFURS5vcHRpb25zID0ge1xuICBsYXllcjogbnVsbCxcbiAgcHJvcGVydGllczoge30sXG4gIGN1cnZlOiBcInNwcmluZygyNTAsIDQ1LCAwLCAuMDAxXCIsXG4gIGN1cnZlT3B0aW9uczoge30sXG4gIHRpbWU6IDEsXG4gIGRlbGF5OiAwLFxuICByZXBlYXQ6IDAsXG4gIGRlYnVnOiBmYWxzZVxufTtcblxuRnJhbWVyLkRldmljZS5waG9uZS5jbGlwID0gZmFsc2U7XG5cbkZyYW1lci5DdXJyZW50Q29udGV4dC5vbihcImxheWVyOmNyZWF0ZVwiLCBmdW5jdGlvbihsYXllcikge1xuICByZXR1cm4gbGF5ZXIub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbihlLCBsYXllcikge1xuICAgIGlmIChlLmFsdEtleSAmJiBsYXllciBpbnN0YW5jZW9mIEtpbmV0aWNzID09PSBmYWxzZSAmJiBsYXllci5zdXBlckxheWVyICE9PSAkLktJTkVUSUNTLmxheWVyKSB7XG4gICAgICBpZiAoJC5LSU5FVElDUy5sYXllcikge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIgPSBsYXllcjtcbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW4gPSBsYXllci5wcm9wcztcbiAgICAgIG5ldyBLaW5ldGljcygkLktJTkVUSUNTLnByb3BzKTtcblxuICAgICAgLypcbiAgICAgIFxuICAgICAgXHRcdFx0VE9ETzogSXMgdGhlcmUgYSB3YXkgdG8gcmVtb3ZlIG1vdXNlZXZlbnQgbGlzdGVuZXJzIG9uIGxheWVycyBzbyB0aGVyZSdzIG5vIGNvbmZsaWN0P1xuICAgICAgICovXG4gICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlKHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbktpbmV0aWNzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEtpbmV0aWNzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBLaW5ldGljcyhvcHRpb25zKSB7XG4gICAgdmFyIGtleXM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBLaW5ldGljcy5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAkLktJTkVUSUNTLmxheWVyID0gdGhpcztcbiAgICB0aGlzLmRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5zdXBlckxheWVyID0gdGhpcztcbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvbik7XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwuc3VwZXJMYXllciA9IHRoaXMuY2xvc2VCdXR0b247XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIuc3VwZXJMYXllciA9IHRoaXMuY2xvc2VCdXR0b247XG4gICAgdGhpcy5jbG9zZUJ1dHRvblhMID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMKTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uWFIgPSBuZXcgTGF5ZXIoJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIpO1xuICAgIGtleXMgPSBbXTtcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZSkge1xuICAgICAga2V5c1tlLmtleUNvZGVdID0gZS50eXBlID09PSBcImtleWRvd25cIjtcbiAgICAgIGlmIChrZXlzWzE4XSAmJiBrZXlzWzE4N10pIHtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgKz0gLjI1O1xuICAgICAgfSBlbHNlIGlmIChrZXlzWzE4XSAmJiBrZXlzWzE4OV0pIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5zY2FsZSAtPSAuMjU7XG4gICAgICAgIGlmICgkLktJTkVUSUNTLmxheWVyLnNjYWxlIDwgLjI1KSB7XG4gICAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPSAuMjU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2xvc2VCdXR0b24ub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbigpIHtcbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSh7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzY2FsZTogMFxuICAgICAgICB9LFxuICAgICAgICBjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIlxuICAgICAgfSwgJC5LSU5FVElDUy5sYXllci5vbihFdmVudHMuQW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpO1xuICAgICAgfSkpO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0dXBUZXh0KCk7XG4gICAgdGhpcy5zZXR1cFNsaWRlcnMoKTtcbiAgfVxuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5zZXR1cFRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGV4dDtcbiAgICBmb3IgKHRleHQgaW4gJC5URVhUKSB7XG4gICAgICBpZiAodGV4dCAhPT0gXCJpbnB1dFwiKSB7XG4gICAgICAgICQuVEVYVFtcIlwiICsgdGV4dF0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYW5pbWF0ZVByb3BzID0gbmV3IExheWVyKCQuVEVYVC5hbmltYXRlUHJvcHMpO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIndpZHRoXCJdID0gdGhpcy5hbmltYXRlUHJvcHMud2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImhlaWdodFwiXSA9IHRoaXMuYW5pbWF0ZVByb3BzLmhlaWdodCArIFwicHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udFwiXSA9IFwibm9ybWFsIDQwMCAyNnB4IFJvYm90byBNb25vXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcInRleHQtYWxpZ25cIl0gPSBcImNlbnRlclwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjI2cHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiY29sb3JcIl0gPSBcIndoaXRlXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIi13ZWtpdC11c2VyLXNlbGVjdFwiXSA9IFwidGV4dFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCJcIiArICQuS0lORVRJQ1MubGF5ZXIuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQpO1xuXG4gICAgLypcbiAgICBcbiAgICBcdFx0VE9ETzogTWFrZSBjdXJ2ZSBwcm9wcyBhbiBpbnB1dCB3aGVyZSB5b3UgY2FuIHR5cGUgaW4gaXQgaWYgeW91IHdpc2ggKGFkanVzdHMga25vYiB2YWx1ZXMpXG4gICAgXHRcdEJVRyAoc2VtaSk6IGN1cnZlUHJvcHMgaXMgZWRpdGFibGVcbiAgICAgKi9cbiAgICB0aGlzLmN1cnZlUHJvcHMgPSBuZXcgTGF5ZXIoJC5URVhULmN1cnZlUHJvcHMpO1xuICAgIHRoaXMuY3VydmVQcm9wcy5odG1sID0gXCI8dGV4dGFyZWEgb25jbGljaz0ndGhpcy5zZWxlY3QoKScgc3R5bGU9J3dpZHRoOlwiICsgdGhpcy5jdXJ2ZVByb3BzLndpZHRoICsgXCJweDsgaGVpZ2h0OlwiICsgdGhpcy5jdXJ2ZVByb3BzLmhlaWdodCArIFwicHg7IHRleHQtYWxpZ246Y2VudGVyOyBsaW5lLWhlaWdodDozNHB4OyBjb2xvcjojQTBFMzVGOyBmb250OiA0MDAgMjhweCBSb2JvdG8gTW9ubzsgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IGJvcmRlcjogbm9uZTsgcmVzaXplOiBub25lJz4mcXVvdDtcIiArICQuQU5JTUFURS5vcHRpb25zLmN1cnZlICsgXCImcXVvdDs8L3RleHRhcmVhPlwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXIgPSBcIiBcIjtcbiAgICB9O1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25ibHVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCI7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5vbmtleXVwID0gZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIGksIGluZGV4LCBsZW4sIG9wdGlvbiwgb3B0aW9ucywgcmVnZXg7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKTtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCI7XG4gICAgICAgIGlmICgkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgcmVnZXggPSAvKFxcUypcXHcpL2c7XG4gICAgICAgICAgb3B0aW9ucyA9ICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUubWF0Y2gocmVnZXgpO1xuICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV07XG4gICAgICAgICAgICBpbmRleCA9IF8uaW5kZXhPZihvcHRpb25zLCBvcHRpb24pO1xuICAgICAgICAgICAgaWYgKGluZGV4ICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAkLkFOSU1BVEUub3B0aW9ucy5wcm9wZXJ0aWVzW1wiXCIgKyBvcHRpb25dID0gb3B0aW9uc1tpbmRleCArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5zZXR1cFNsaWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSwgaiwgbGFiZWwsIGxlbiwgbGVuMSwgcmVmLCByZWYxLCByZXN1bHRzLCBzbGlkZXIsIHN0eWxlO1xuICAgIGZvciAoc2xpZGVyIGluICQuU0xJREVSUykge1xuICAgICAgaWYgKHNsaWRlciAhPT0gXCJrbm9iXCIpIHtcbiAgICAgICAgJC5TTElERVJTW1wiXCIgKyBzbGlkZXJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxhYmVsIGluICQuTEFCRUxTKSB7XG4gICAgICAkLkxBQkVMU1tcIlwiICsgbGFiZWxdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyO1xuICAgIH1cbiAgICB0aGlzLnRlbnNpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy50ZW5zaW9uKTtcbiAgICB0aGlzLnRlbnNpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnRlbnNpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50ZW5zaW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy50ZW5zaW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudGVuc2lvbkxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnRlbnNpb24pO1xuICAgIHRoaXMudGVuc2lvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0ZW5zaW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQHRlbnNpb25MYWJlbC5oZWlnaHQnPlwiICsgdGhpcy50ZW5zaW9uTGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgdGhpcy5mcmljdGlvbiA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLmZyaWN0aW9uKTtcbiAgICB0aGlzLmZyaWN0aW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLmZyaWN0aW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy5mcmljdGlvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLmZyaWN0aW9uTGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMuZnJpY3Rpb24pO1xuICAgIHRoaXMuZnJpY3Rpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAZnJpY3Rpb25MYWJlbC53aWR0aCcgaGVpZ2h0PSdAZnJpY3Rpb25MYWJlbC5oZWlnaHQnPlwiICsgdGhpcy5mcmljdGlvbkxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy52ZWxvY2l0eSk7XG4gICAgdGhpcy52ZWxvY2l0eS5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMudmVsb2NpdHkua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy52ZWxvY2l0eS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudmVsb2NpdHkuZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy52ZWxvY2l0eUxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnZlbG9jaXR5KTtcbiAgICB0aGlzLnZlbG9jaXR5TGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHZlbG9jaXR5TGFiZWwud2lkdGgnIGhlaWdodD0nQHZlbG9jaXR5TGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudmVsb2NpdHlMYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICB0aGlzLnRvbGVyYW5jZSA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLnRvbGVyYW5jZSk7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnRvbGVyYW5jZS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRvbGVyYW5jZS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudG9sZXJhbmNlLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudG9sZXJhbmNlTGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMudG9sZXJhbmNlKTtcbiAgICB0aGlzLnRvbGVyYW5jZUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0b2xlcmFuY2VMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdG9sZXJhbmNlTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudG9sZXJhbmNlTGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgcmVmID0gJC5LSU5FVElDUy5sYXllci5zdWJMYXllcnM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzbGlkZXIgPSByZWZbaV07XG4gICAgICBpZiAoc2xpZGVyLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiTGF5ZXJcIikge1xuICAgICAgICBmb3IgKHN0eWxlIGluICQuU1RZTEUuc2xpZGVyTGFiZWxzKSB7XG4gICAgICAgICAgc2xpZGVyLl9lbGVtZW50LnN0eWxlW1wiXCIgKyBzdHlsZV0gPSAkLlNUWUxFLnNsaWRlckxhYmVsc1tcIlwiICsgc3R5bGVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlZjEgPSB0aGlzLnN1YkxheWVycztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBzbGlkZXIgPSByZWYxW2pdO1xuICAgICAgaWYgKCEoc2xpZGVyIGluc3RhbmNlb2YgU2xpZGVyQ29tcG9uZW50ID09PSB0cnVlKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHNsaWRlci5vbihcImNoYW5nZTp2YWx1ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgPSBcInNwcmluZyhcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudGVuc2lvbi52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci5mcmljdGlvbi52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci52ZWxvY2l0eS52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci50b2xlcmFuY2UudmFsdWUgKiAxMDAwKSAvIDEwMDApICsgXCIpXCI7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmN1cnZlUHJvcHMuaHRtbCA9IFwiPHRleHRhcmVhIGlkPSdjdXJ2ZVByb3BzJyBzdHlsZT0nd2lkdGg6XCIgKyAkLlRFWFQuY3VydmVQcm9wcy53aWR0aCArIFwicHg7IGhlaWdodDpcIiArICQuVEVYVC5jdXJ2ZVByb3BzLmhlaWdodCArIFwicHg7IHRleHQtYWxpZ246Y2VudGVyOyBsaW5lLWhlaWdodDozNHB4OyBjb2xvcjojQTBFMzVGOyBmb250OjQwMCAyOHB4IFJvYm90byBNb25vOyBiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50OyBib3JkZXI6bm9uZTsgcmVzaXplOm5vbmUnPiZxdW90O1wiICsgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgKyBcIiZxdW90OzwvdGV4dGFyZWE+XCI7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdHMucHVzaChzbGlkZXIua25vYi5vbihFdmVudHMuRHJhZ0VuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVUYXJnZXQoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgS2luZXRpY3MucHJvdG90eXBlLmFuaW1hdGVUYXJnZXQgPSBmdW5jdGlvbigpIHtcbiAgICAkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbjtcbiAgICByZXR1cm4gJC5LSU5FVElDUy50YXJnZXRMYXllci5hbmltYXRlKCQuQU5JTUFURS5vcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gS2luZXRpY3M7XG5cbn0pKExheWVyKTtcbiJdfQ==
