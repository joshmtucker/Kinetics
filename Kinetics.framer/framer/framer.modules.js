require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Kinetics":[function(require,module,exports){

/* VARIABLES */
var $, Kinetics,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Utils.insertCSS("@import url(//fonts.googleapis.com/css?family=Roboto");

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
        $.KINETICS.layer.animatePropsInput.blur();
        return $.KINETICS.layer.scale += .25;
      } else if (keys[18] && keys[189]) {
        $.KINETICS.layer.animatePropsInput.blur();
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

/* VARIABLES */
var $, Kinetics,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Utils.insertCSS("@import url(//fonts.googleapis.com/css?family=Roboto");

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
        $.KINETICS.layer.animatePropsInput.blur();
        return $.KINETICS.layer.scale += .25;
      } else if (keys[18] && keys[189]) {
        $.KINETICS.layer.animatePropsInput.blur();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zaG10dWNrZXIvR2l0SHViL0tpbmV0aWNzL0tpbmV0aWNzLmZyYW1lci9tb2R1bGVzL0tpbmV0aWNzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2pvc2htdHVja2VyL0dpdEh1Yi9LaW5ldGljcy9LaW5ldGljcy5mcmFtZXIvbW9kdWxlcy9LaW5ldGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsZUFBQTtBQUFBLElBQUEsV0FBQTtFQUFBOzZCQUFBOztBQUFBLEtBRUssQ0FBQyxTQUFOLENBQWdCLHNEQUFoQixDQUZBLENBQUE7O0FBQUEsQ0FJQSxHQUNDO0FBQUEsRUFBQSxRQUFBLEVBQVUsRUFBVjtBQUFBLEVBQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FEdEI7QUFBQSxFQUVBLE9BQUEsRUFBUyxFQUZUO0FBQUEsRUFHQSxJQUFBLEVBQU0sRUFITjtBQUFBLEVBSUEsT0FBQSxFQUFTO0FBQUEsSUFBQyxJQUFBLEVBQUs7QUFBQSxNQUFDLFFBQUEsRUFBVSxFQUFYO0FBQUEsTUFBZSxlQUFBLEVBQWlCLFNBQWhDO0tBQU47QUFBQSxJQUFrRCxJQUFBLEVBQUs7QUFBQSxNQUFDLGVBQUEsRUFBaUIsU0FBbEI7S0FBdkQ7R0FKVDtBQUFBLEVBS0EsTUFBQSxFQUFRLEVBTFI7QUFBQSxFQU1BLEtBQUEsRUFBTztBQUFBLElBQUMsWUFBQSxFQUFhO0FBQUEsTUFBQyxnQkFBQSxFQUFrQixRQUFuQjtBQUFBLE1BQTZCLFNBQUEsRUFBVyxZQUF4QztBQUFBLE1BQXNELE1BQUEsRUFBUSw2QkFBOUQ7S0FBZDtHQU5QO0FBQUEsRUFPQSxPQUFBLEVBQVMsRUFQVDtDQUxELENBQUE7O0FBQUEsQ0FjQyxDQUFDLFFBQVEsQ0FBQyxLQUFYLEdBQ0M7QUFBQSxFQUFBLElB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USxDQUFDLFdBQVcsQ0FBQyxPQUF2QixDQUErQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQXpDLEVBRmM7RUFBQSxDQWpNZixDQUFBOztrQkFBQTs7R0FEc0IsTUFwS3ZCLENBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjIFZBUklBQkxFUyAjIyNcblxuVXRpbHMuaW5zZXJ0Q1NTKFwiQGltcG9ydCB1cmwoLy9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PVJvYm90b1wiKVxuXG4kID0gXG5cdEtJTkVUSUNTOiB7fVxuXHRERVZJQ0U6IEZyYW1lci5EZXZpY2UucGhvbmVcblx0QlVUVE9OUzoge31cblx0VEVYVDoge31cblx0U0xJREVSUzoge2tub2I6e2tub2JTaXplOiAyOCwgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn0sIGZpbGw6e2JhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJ9fVxuXHRMQUJFTFM6IHt9XG5cdFNUWUxFOiB7c2xpZGVyTGFiZWxzOntcInZlcnRpY2FsLWFsaWduXCI6IFwiY2VudGVyXCIsIFwiZGlzcGxheVwiOiBcInRhYmxlLWNlbGxcIiwgXCJmb250XCI6IFwibm9ybWFsIDEwMCAyNnB4IFJvYm90byBNb25vXCJ9fVxuXHRBTklNQVRFOiB7fVxuXG4kLktJTkVUSUNTLnByb3BzID0gXG5cdG1pZFg6ICQuREVWSUNFLndpZHRoLzIgXG5cdG1pZFk6ICQuREVWSUNFLmhlaWdodC8yIFxuXHR3aWR0aDogKDcwMCAqICQuREVWSUNFLnNjYWxlKSArICg3MDAgKiAoMS0kLkRFVklDRS5zY2FsZSkpXG5cdGhlaWdodDogKDQwMCAqICQuREVWSUNFLnNjYWxlKSArICg0MDAgKiAoMS0kLkRFVklDRS5zY2FsZSkpXG5cdHNjYWxlOiAwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjMTUxNTE3XCJcblx0c3VwZXJMYXllcjogJC5ERVZJQ0Vcblx0dGFyZ2V0TGF5ZXI6IHt9XG5cbiMg4oCT4oCT4oCTIEJVVFRPTlNcbiQuQlVUVE9OUy5jbG9zZUJ1dHRvbiA9IHttYXhYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMjgsIHk6IDI4LCB3aWR0aDogMjQsIGhlaWdodDogMjQsIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwifVxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwgPSB7bWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoLzIsIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQvMiwgd2lkdGg6IDI0LCBoZWlnaHQ6IDQsIHJvdGF0aW9uOiA0NSwgYm9yZGVyUmFkaXVzOiAxOCwgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn1cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSID0ge21pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aC8yLCBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0LzIsIHdpZHRoOiAyNCwgaGVpZ2h0OiA0LCByb3RhdGlvbjogLTQ1LCBib3JkZXJSYWRpdXM6IDE4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifVxuXG4jIOKAk+KAk+KAkyBURVhUXG4kLlRFWFQuYW5pbWF0ZVByb3BzID0gXG5cdG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMlxuXHR3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDE2MFxuXHRoZWlnaHQ6IDgwXG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiQW5pbWF0ZVByb3BzXCJcblx0aWdub3JlRXZlbnRzOiBmYWxzZVxuXHRwcm9wYWdhdGVFdmVudHM6IGZhbHNlXG5cbiQuVEVYVC5jdXJ2ZVByb3BzID0gXG5cdG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGgvMlxuXHRtYXhZOiAkLktJTkVUSUNTLnByb3BzLmhlaWdodC0yMFxuXHR3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8xLjVcblx0bmFtZTogXCJDdXJ2ZVByb3BzXCJcblx0aGVpZ2h0OiA0MFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXG4jIOKAk+KAk+KAkyBTTElERVJTXG5cbiQuU0xJREVSUy50ZW5zaW9uID0gXG5cdHg6IDIwMFxuXHR5OiAxMDdcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bmFtZTogXCJUZW5zaW9uU2xpZGVyXCJcblx0bWluOiAwXG5cdG1heDogMTAwMFxuXHR2YWx1ZTogMjUwXG5cbiQuU0xJREVSUy5mcmljdGlvbiA9IFxuXHR4OiAyMDBcblx0eTogMTYxXG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG5hbWU6IFwiRnJpY3Rpb25TbGlkZXJcIlxuXHRtaW46IDBcblx0bWF4OiAxMDBcblx0dmFsdWU6IDQ1XG5cbiQuU0xJREVSUy52ZWxvY2l0eSA9IFxuXHR4OiAyMDBcblx0eTogMjE1XG5cdHdpZHRoOiA0NjBcblx0aGVpZ2h0OiAxMFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiXG5cdG5hbWU6IFwiVmVsb2NpdHlTbGlkZXJcIlxuXHRtaW46IDBcblx0bWF4OiAxMFxuXHR2YWx1ZTogMFxuXG4kLlNMSURFUlMudG9sZXJhbmNlID0gXG5cdHg6IDIwMFxuXHR5OiAyNjlcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bmFtZTogXCJUb2xlcmFuY2VTbGlkZXJcIlxuXHRtaW46IDAuMDAxXG5cdG1heDogMVxuXHR2YWx1ZTogMC4wMDFcblxuIyDigJPigJPigJMgTEFCRUxTXG4kLkxBQkVMUy50ZW5zaW9uID0gXG5cdHg6IDIwXG5cdHk6IDkyXG5cdHdpZHRoOiAxMTBcblx0aGVpZ2h0OiAzNFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIlRlbnNpb25MYWJlbFwiXG5cbiQuTEFCRUxTLmZyaWN0aW9uID0gXG5cdHg6IDIwXG5cdHk6IDE0NlxuXHR3aWR0aDogMTI1XG5cdGhlaWdodDogMzRcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJGcmljdGlvbkxhYmVsXCJcblxuJC5MQUJFTFMudmVsb2NpdHkgPSBcblx0eDogMjBcblx0eTogMjAwXG5cdHdpZHRoOiAxMjVcblx0aGVpZ2h0OiAzNFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIlZlbG9jaXR5TGFiZWxcIlxuXG4kLkxBQkVMUy50b2xlcmFuY2UgPSBcblx0eDogMjBcblx0eTogMjU0XG5cdHdpZHRoOiAxNDFcblx0aGVpZ2h0OiAzNFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIlRvbGVyYW5jZUxhYmVsXCJcblxuIyDigJPigJPigJMgQU5JTUFURVxuJC5BTklNQVRFLm9wdGlvbnMgPVxuXHRsYXllcjogbnVsbFxuXHRwcm9wZXJ0aWVzOiB7fVxuXHRjdXJ2ZTogXCJzcHJpbmcoMjUwLCA0NSwgMCwgLjAwMVwiXG5cdGN1cnZlT3B0aW9uczoge31cblx0dGltZTogMVxuXHRkZWxheTogMFxuXHRyZXBlYXQ6IDBcblx0ZGVidWc6IGZhbHNlXG5cbiMgRGlzYWJsZSBjbGlwIG9uIGRldmljZVxuRnJhbWVyLkRldmljZS5waG9uZS5jbGlwID0gZmFsc2VcblxuRnJhbWVyLkN1cnJlbnRDb250ZXh0Lm9uIFwibGF5ZXI6Y3JlYXRlXCIsIChsYXllcikgLT5cblx0bGF5ZXIub24gRXZlbnRzLkNsaWNrLCAoZSwgbGF5ZXIpIC0+XG5cdFx0IyBPbmx5IG9uIGFuIGFsdChvcHRpb24pICsgY2xpY2tcblx0XHRpZiBlLmFsdEtleSBhbmQgbGF5ZXIgaW5zdGFuY2VvZiBLaW5ldGljcyBpcyBmYWxzZSBhbmQgbGF5ZXIuc3VwZXJMYXllciBpc250ICQuS0lORVRJQ1MubGF5ZXJcblxuXHRcdFx0IyBEZXN0cm95IGlmIGxheWVyIGFscmVhZHkgZXhpc3RzXG5cdFx0XHRpZiAkLktJTkVUSUNTLmxheWVyIHRoZW4gJC5LSU5FVElDUy5sYXllci5kZXN0cm95KClcblx0XHRcdFxuXHRcdFx0IyBDcmVhdGUgS2luZXRpY3MgbGF5ZXJcblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIgPSBsYXllclxuXHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbiA9IGxheWVyLnByb3BzXG5cdFx0XHRuZXcgS2luZXRpY3MgJC5LSU5FVElDUy5wcm9wc1xuXG5cdFx0XHQjIyNcblxuXHRcdFx0VE9ETzogSXMgdGhlcmUgYSB3YXkgdG8gcmVtb3ZlIG1vdXNlZXZlbnQgbGlzdGVuZXJzIG9uIGxheWVycyBzbyB0aGVyZSdzIG5vIGNvbmZsaWN0P1xuXG5cdFx0XHQjIyNcblxuXHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcblxuY2xhc3MgS2luZXRpY3MgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBSZWZlcmVuY2UgS2luZXRpY3Ncblx0XHQkLktJTkVUSUNTLmxheWVyID0gQFxuXG5cdFx0QGRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZVxuXHRcdEBkcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXG5cdFx0IyBBZGQgY2xvc2UgYnV0dG9uXG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uLnN1cGVyTGF5ZXIgPSBAXG5cdFx0QGNsb3NlQnV0dG9uID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblxuXHRcdFx0XG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uWEwuc3VwZXJMYXllciA9IEBjbG9zZUJ1dHRvblxuXHRcdCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSLnN1cGVyTGF5ZXIgPSBAY2xvc2VCdXR0b25cblx0XHRAY2xvc2VCdXR0b25YTCA9IG5ldyBMYXllciAkLkJVVFRPTlMuY2xvc2VCdXR0b25YTFxuXHRcdEBjbG9zZUJ1dHRvblhSID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSXG5cblx0XHQjIOKAk+KAk+KAkyBFVkVOVFNcblx0XHQjIEFkanVzdCBzaXplIG9mIEtpbmV0aWNzIHdpbmRvdyB3aXRoIG9wdGlvbiArIHBsdXMgb3Igb3B0aW9uICsgbWludXNcblx0XHRrZXlzID0gW11cblx0XHRkb2N1bWVudC5vbmtleWRvd24gPSBkb2N1bWVudC5vbmtleXVwID0gKGUpIC0+XG5cdFx0XHRrZXlzW2Uua2V5Q29kZV0gPSBlLnR5cGUgPT0gXCJrZXlkb3duXCJcblxuXHRcdFx0IyBTY2FsZSB1cFxuXHRcdFx0aWYga2V5c1sxOF0gYW5kIGtleXNbMTg3XVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLnNjYWxlICs9IC4yNVxuXHRcdFx0ZWxzZSBpZiBrZXlzWzE4XSBhbmQga2V5c1sxODldXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgLT0gLjI1XG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPSAuMjUgaWYgJC5LSU5FVElDUy5sYXllci5zY2FsZSA8IC4yNVxuXG5cdFx0QGNsb3NlQnV0dG9uLm9uIEV2ZW50cy5DbGljaywgLT5cblx0XHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luXG5cblx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNjYWxlOiAwXG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG5cblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPlxuXHRcdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpXG5cblx0XHRAc2V0dXBUZXh0KClcblx0XHRAc2V0dXBTbGlkZXJzKClcblxuXHRzZXR1cFRleHQ6IC0+XG5cdFx0IyBTZXR1cCBzdXBlckxheWVyXG5cdFx0Zm9yIHRleHQgb2YgJC5URVhUIHdoZW4gdGV4dCBpc250IFwiaW5wdXRcIlxuXHRcdFx0JC5URVhUW1wiI3t0ZXh0fVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyDigJPigJPigJMgQU5JTUFURSBQUk9QRVJUSUVTXG5cdFx0QGFuaW1hdGVQcm9wcyA9IG5ldyBMYXllciAkLlRFWFQuYW5pbWF0ZVByb3BzXG5cblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ3aWR0aFwiXSA9IFwiI3tAYW5pbWF0ZVByb3BzLndpZHRofXB4XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJoZWlnaHRcIl0gPSBcIiN7QGFuaW1hdGVQcm9wcy5oZWlnaHR9cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnRcIl0gPSBcIm5vcm1hbCA0MDAgMjZweCBSb2JvdG8gTW9ub1wiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjI2cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImNvbG9yXCJdID0gXCJ3aGl0ZVwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiLXdla2l0LXVzZXItc2VsZWN0XCJdID0gXCJ0ZXh0XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCIjeyQuS0lORVRJQ1MubGF5ZXIuYmFja2dyb3VuZENvbG9yfVwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0QGFuaW1hdGVQcm9wcy5fZWxlbWVudC5hcHBlbmRDaGlsZChAYW5pbWF0ZVByb3BzSW5wdXQpXG5cblx0XHQjIOKAk+KAk+KAkyBDVVJWRSBQUk9QRVJUSUVTXG5cblx0XHQjIyNcblxuXHRcdFRPRE86IE1ha2UgY3VydmUgcHJvcHMgYW4gaW5wdXQgd2hlcmUgeW91IGNhbiB0eXBlIGluIGl0IGlmIHlvdSB3aXNoIChhZGp1c3RzIGtub2IgdmFsdWVzKVxuXHRcdEJVRyAoc2VtaSk6IGN1cnZlUHJvcHMgaXMgZWRpdGFibGVcblxuXHRcdCMjI1xuXG5cblx0XHRAY3VydmVQcm9wcyA9IG5ldyBMYXllciAkLlRFWFQuY3VydmVQcm9wc1xuXG5cdFx0QGN1cnZlUHJvcHNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wid2lkdGhcIl0gPSBcIiN7QGN1cnZlUHJvcHMud2lkdGh9cHhcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImhlaWdodFwiXSA9IFwiI3tAY3VydmVQcm9wcy5oZWlnaHR9cHhcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcInRleHQtYWxpZ25cIl0gPSBcImNlbnRlclwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wibGluZS1oZWlnaHRcIl0gPSBcIjM0cHhcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImNvbG9yXCJdID0gXCIjQTBFMzVGXCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJmb250XCJdID0gXCI0MDAgMjhweCBSb2JvdG8gTW9ub1wiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXSA9IFwidHJhbnNwYXJlbnRcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImJvcmRlclwiXSA9IFwibm9uZVwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wicmVzaXplXCJdID0gXCJub25lXCJcblxuXHRcdEBjdXJ2ZVByb3BzVGV4dC52YWx1ZSA9IFwiXFxcIiN7JC5BTklNQVRFLm9wdGlvbnMuY3VydmV9XFxcIlwiXG5cblx0XHRAY3VydmVQcm9wcy5fZWxlbWVudC5hcHBlbmRDaGlsZChAY3VydmVQcm9wc1RleHQpXG5cblxuXHRcdCMg4oCT4oCT4oCTIEVWRU5UU1xuXHRcdCMgU2VsZWN0IGlucHV0XG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0Lm9uY2xpY2sgPSAtPlxuXHRcdFx0QGZvY3VzKClcblx0XHRcdEBwbGFjZWhvbGRlciA9IFwiIFwiXG5cblx0XHQjIFJlcGxhY2UgcGxhY2Vob2xkZXJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQub25ibHVyID0gLT5cblx0XHRcdEBwbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCJcblxuXHRcdCMgU3VibWl0dGluZyBhbmltYXRpb24gcHJvcGVydGllc1xuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5vbmtleXVwID0gKGUpIC0+XG5cdFx0XHRpZiBlLmtleUNvZGUgaXMgMTNcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKClcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCJcblxuXHRcdFx0XHRpZiAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlIGlzbnQgXCJcIlxuXG5cdFx0XHRcdFx0cmVnZXggPSAvKFxcUypcXHcpL2dcblxuXHRcdFx0XHRcdG9wdGlvbnMgPSAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlLm1hdGNoKHJlZ2V4KVxuXG5cdFx0XHRcdFx0Zm9yIG9wdGlvbiBpbiBvcHRpb25zXG5cdFx0XHRcdFx0XHRpbmRleCA9IF8uaW5kZXhPZihvcHRpb25zLCBvcHRpb24pXG5cdFx0XHRcdFx0XHRpZiBpbmRleCAlIDIgaXMgMFxuXHRcdFx0XHRcdFx0XHQkLkFOSU1BVEUub3B0aW9ucy5wcm9wZXJ0aWVzW1wiI3tvcHRpb259XCJdID0gb3B0aW9uc1tpbmRleCsxXVxuXG5cdFx0XHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblxuXHRcdCMgU2VsZWN0IGN1cnZlIHZhbHVlXG5cdFx0QGN1cnZlUHJvcHNUZXh0Lm9uY2xpY2sgPSAtPlxuXHRcdFx0QHNlbGVjdCgpXG5cblx0c2V0dXBTbGlkZXJzOiAtPlxuXHRcdCMgU2V0IHN1cGVyTGF5ZXIgZm9yIHNsaWRlcnNcblx0XHRmb3Igc2xpZGVyIG9mICQuU0xJREVSUyB3aGVuIHNsaWRlciBpc250IFwia25vYlwiXG5cdFx0XHQkLlNMSURFUlNbXCIje3NsaWRlcn1cIl0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXJcblxuXHRcdCMgU2V0IHN1cGVyTGF5ZXIgZm9yIGxhYmVsc1xuXHRcdGZvciBsYWJlbCBvZiAkLkxBQkVMU1xuXHRcdFx0JC5MQUJFTFNbXCIje2xhYmVsfVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyDigJPigJPigJMgVEVOU0lPTlxuXHRcdEB0ZW5zaW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMudGVuc2lvblxuXHRcdEB0ZW5zaW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemVcblx0XHRAdGVuc2lvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEB0ZW5zaW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAdGVuc2lvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvclxuXG5cdFx0QHRlbnNpb25MYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy50ZW5zaW9uXG5cdFx0QHRlbnNpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdGVuc2lvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0B0ZW5zaW9uTGFiZWwuaGVpZ2h0Jz4je0B0ZW5zaW9uTGFiZWwubmFtZX08L2Rpdj5cIlxuXG5cdFx0IyDigJPigJPigJMgRlJJQ1RJT05cblxuXHRcdEBmcmljdGlvbiA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLmZyaWN0aW9uXG5cdFx0QGZyaWN0aW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemVcblx0XHRAZnJpY3Rpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAZnJpY3Rpb24ua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEBmcmljdGlvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvclxuXG5cdFx0QGZyaWN0aW9uTGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMuZnJpY3Rpb25cblx0XHRAZnJpY3Rpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAZnJpY3Rpb25MYWJlbC53aWR0aCcgaGVpZ2h0PSdAZnJpY3Rpb25MYWJlbC5oZWlnaHQnPiN7QGZyaWN0aW9uTGFiZWwubmFtZX08L2Rpdj5cIlxuXG5cdFx0IyDigJPigJPigJMgVkVMT0NJVFlcblx0XHRAdmVsb2NpdHkgPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy52ZWxvY2l0eVxuXHRcdEB2ZWxvY2l0eS5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplXG5cdFx0QHZlbG9jaXR5Lmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QHZlbG9jaXR5Lmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAdmVsb2NpdHkuZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEB2ZWxvY2l0eUxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLnZlbG9jaXR5XG5cdFx0QHZlbG9jaXR5TGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHZlbG9jaXR5TGFiZWwud2lkdGgnIGhlaWdodD0nQHZlbG9jaXR5TGFiZWwuaGVpZ2h0Jz4je0B2ZWxvY2l0eUxhYmVsLm5hbWV9PC9kaXY+XCJcblxuXHRcdCMg4oCT4oCT4oCTIFRPTEVSQU5DRVxuXHRcdEB0b2xlcmFuY2UgPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy50b2xlcmFuY2Vcblx0XHRAdG9sZXJhbmNlLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemVcblx0XHRAdG9sZXJhbmNlLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QHRvbGVyYW5jZS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QHRvbGVyYW5jZS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvclxuXG5cdFx0QHRvbGVyYW5jZUxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLnRvbGVyYW5jZVxuXHRcdEB0b2xlcmFuY2VMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdG9sZXJhbmNlTGFiZWwud2lkdGgnIGhlaWdodD0nQHRvbGVyYW5jZUxhYmVsLmhlaWdodCc+I3tAdG9sZXJhbmNlTGFiZWwubmFtZX08L2Rpdj5cIlxuXG5cdFx0IyBTZXQgc3R5bGUgZm9yIGFsbCB0aGUgbGFiZWxzXG5cdFx0Zm9yIHNsaWRlciBpbiAkLktJTkVUSUNTLmxheWVyLnN1YkxheWVycyB3aGVuIHNsaWRlci5jb25zdHJ1Y3Rvci5uYW1lIGlzIFwiTGF5ZXJcIlxuXHRcdFx0Zm9yIHN0eWxlIG9mICQuU1RZTEUuc2xpZGVyTGFiZWxzIFxuXHRcdFx0XHRzbGlkZXIuX2VsZW1lbnQuc3R5bGVbXCIje3N0eWxlfVwiXSA9ICQuU1RZTEUuc2xpZGVyTGFiZWxzW1wiI3tzdHlsZX1cIl1cblxuXHRcdCMg4oCT4oCT4oCTIEVWRU5UU1xuXHRcdGZvciBzbGlkZXIgaW4gQHN1YkxheWVycyB3aGVuIHNsaWRlciBpbnN0YW5jZW9mIFNsaWRlckNvbXBvbmVudCBpcyB0cnVlXG5cdFx0XHRzbGlkZXIub24gXCJjaGFuZ2U6dmFsdWVcIiwgLT5cblx0XHRcdFx0JC5BTklNQVRFLm9wdGlvbnMuY3VydmUgPSBcInNwcmluZygje01hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci50ZW5zaW9uLnZhbHVlKX0sICN7TWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLmZyaWN0aW9uLnZhbHVlKX0sICN7TWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnZlbG9jaXR5LnZhbHVlKX0sICN7TWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRvbGVyYW5jZS52YWx1ZSAqIDEwMDApLzEwMDB9KVwiXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuY3VydmVQcm9wc1RleHQudmFsdWUgPSBcIlxcXCIjeyQuQU5JTUFURS5vcHRpb25zLmN1cnZlfVxcXCJcIlxuXG5cdFx0XHRzbGlkZXIua25vYi5vbiBFdmVudHMuRHJhZ0VuZCwgLT5cblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlVGFyZ2V0KClcblxuXHRhbmltYXRlVGFyZ2V0OiAtPlxuXHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luXG5cdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5hbmltYXRlICQuQU5JTUFURS5vcHRpb25zXG5cbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS45LjFcblxuLyogVkFSSUFCTEVTICovXG52YXIgJCwgS2luZXRpY3MsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5VdGlscy5pbnNlcnRDU1MoXCJAaW1wb3J0IHVybCgvL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvXCIpO1xuXG4kID0ge1xuICBLSU5FVElDUzoge30sXG4gIERFVklDRTogRnJhbWVyLkRldmljZS5waG9uZSxcbiAgQlVUVE9OUzoge30sXG4gIFRFWFQ6IHt9LFxuICBTTElERVJTOiB7XG4gICAga25vYjoge1xuICAgICAga25vYlNpemU6IDI4LFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxuICAgIH0sXG4gICAgZmlsbDoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxuICAgIH1cbiAgfSxcbiAgTEFCRUxTOiB7fSxcbiAgU1RZTEU6IHtcbiAgICBzbGlkZXJMYWJlbHM6IHtcbiAgICAgIFwidmVydGljYWwtYWxpZ25cIjogXCJjZW50ZXJcIixcbiAgICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNlbGxcIixcbiAgICAgIFwiZm9udFwiOiBcIm5vcm1hbCAxMDAgMjZweCBSb2JvdG8gTW9ub1wiXG4gICAgfVxuICB9LFxuICBBTklNQVRFOiB7fVxufTtcblxuJC5LSU5FVElDUy5wcm9wcyA9IHtcbiAgbWlkWDogJC5ERVZJQ0Uud2lkdGggLyAyLFxuICBtaWRZOiAkLkRFVklDRS5oZWlnaHQgLyAyLFxuICB3aWR0aDogKDcwMCAqICQuREVWSUNFLnNjYWxlKSArICg3MDAgKiAoMSAtICQuREVWSUNFLnNjYWxlKSksXG4gIGhlaWdodDogKDQwMCAqICQuREVWSUNFLnNjYWxlKSArICg0MDAgKiAoMSAtICQuREVWSUNFLnNjYWxlKSksXG4gIHNjYWxlOiAwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzE1MTUxN1wiLFxuICBzdXBlckxheWVyOiAkLkRFVklDRSxcbiAgdGFyZ2V0TGF5ZXI6IHt9XG59O1xuXG4kLkJVVFRPTlMuY2xvc2VCdXR0b24gPSB7XG4gIG1heFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAyOCxcbiAgeTogMjgsXG4gIHdpZHRoOiAyNCxcbiAgaGVpZ2h0OiAyNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcbn07XG5cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMID0ge1xuICBtaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGggLyAyLFxuICBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0IC8gMixcbiAgd2lkdGg6IDI0LFxuICBoZWlnaHQ6IDQsXG4gIHJvdGF0aW9uOiA0NSxcbiAgYm9yZGVyUmFkaXVzOiAxOCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxufTtcblxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIgPSB7XG4gIG1pZFg6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi53aWR0aCAvIDIsXG4gIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQgLyAyLFxuICB3aWR0aDogMjQsXG4gIGhlaWdodDogNCxcbiAgcm90YXRpb246IC00NSxcbiAgYm9yZGVyUmFkaXVzOiAxOCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIlxufTtcblxuJC5URVhULmFuaW1hdGVQcm9wcyA9IHtcbiAgbWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAvIDIsXG4gIHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMTYwLFxuICBoZWlnaHQ6IDgwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJBbmltYXRlUHJvcHNcIixcbiAgaWdub3JlRXZlbnRzOiBmYWxzZSxcbiAgcHJvcGFnYXRlRXZlbnRzOiBmYWxzZVxufTtcblxuJC5URVhULmN1cnZlUHJvcHMgPSB7XG4gIG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAyLFxuICBtYXhZOiAkLktJTkVUSUNTLnByb3BzLmhlaWdodCAtIDIwLFxuICB3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAvIDEuNSxcbiAgbmFtZTogXCJDdXJ2ZVByb3BzXCIsXG4gIGhlaWdodDogNDAsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG59O1xuXG4kLlNMSURFUlMudGVuc2lvbiA9IHtcbiAgeDogMjAwLFxuICB5OiAxMDcsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiVGVuc2lvblNsaWRlclwiLFxuICBtaW46IDAsXG4gIG1heDogMTAwMCxcbiAgdmFsdWU6IDI1MFxufTtcblxuJC5TTElERVJTLmZyaWN0aW9uID0ge1xuICB4OiAyMDAsXG4gIHk6IDE2MSxcbiAgd2lkdGg6IDQ2MCxcbiAgaGVpZ2h0OiAxMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIixcbiAgbmFtZTogXCJGcmljdGlvblNsaWRlclwiLFxuICBtaW46IDAsXG4gIG1heDogMTAwLFxuICB2YWx1ZTogNDVcbn07XG5cbiQuU0xJREVSUy52ZWxvY2l0eSA9IHtcbiAgeDogMjAwLFxuICB5OiAyMTUsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiVmVsb2NpdHlTbGlkZXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwLFxuICB2YWx1ZTogMFxufTtcblxuJC5TTElERVJTLnRvbGVyYW5jZSA9IHtcbiAgeDogMjAwLFxuICB5OiAyNjksXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiVG9sZXJhbmNlU2xpZGVyXCIsXG4gIG1pbjogMC4wMDEsXG4gIG1heDogMSxcbiAgdmFsdWU6IDAuMDAxXG59O1xuXG4kLkxBQkVMUy50ZW5zaW9uID0ge1xuICB4OiAyMCxcbiAgeTogOTIsXG4gIHdpZHRoOiAxMTAsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlRlbnNpb25MYWJlbFwiXG59O1xuXG4kLkxBQkVMUy5mcmljdGlvbiA9IHtcbiAgeDogMjAsXG4gIHk6IDE0NixcbiAgd2lkdGg6IDEyNSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiRnJpY3Rpb25MYWJlbFwiXG59O1xuXG4kLkxBQkVMUy52ZWxvY2l0eSA9IHtcbiAgeDogMjAsXG4gIHk6IDIwMCxcbiAgd2lkdGg6IDEyNSxcbiAgaGVpZ2h0OiAzNCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiVmVsb2NpdHlMYWJlbFwiXG59O1xuXG4kLkxBQkVMUy50b2xlcmFuY2UgPSB7XG4gIHg6IDIwLFxuICB5OiAyNTQsXG4gIHdpZHRoOiAxNDEsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlRvbGVyYW5jZUxhYmVsXCJcbn07XG5cbiQuQU5JTUFURS5vcHRpb25zID0ge1xuICBsYXllcjogbnVsbCxcbiAgcHJvcGVydGllczoge30sXG4gIGN1cnZlOiBcInNwcmluZygyNTAsIDQ1LCAwLCAuMDAxXCIsXG4gIGN1cnZlT3B0aW9uczoge30sXG4gIHRpbWU6IDEsXG4gIGRlbGF5OiAwLFxuICByZXBlYXQ6IDAsXG4gIGRlYnVnOiBmYWxzZVxufTtcblxuRnJhbWVyLkRldmljZS5waG9uZS5jbGlwID0gZmFsc2U7XG5cbkZyYW1lci5DdXJyZW50Q29udGV4dC5vbihcImxheWVyOmNyZWF0ZVwiLCBmdW5jdGlvbihsYXllcikge1xuICByZXR1cm4gbGF5ZXIub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbihlLCBsYXllcikge1xuICAgIGlmIChlLmFsdEtleSAmJiBsYXllciBpbnN0YW5jZW9mIEtpbmV0aWNzID09PSBmYWxzZSAmJiBsYXllci5zdXBlckxheWVyICE9PSAkLktJTkVUSUNTLmxheWVyKSB7XG4gICAgICBpZiAoJC5LSU5FVElDUy5sYXllcikge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIgPSBsYXllcjtcbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW4gPSBsYXllci5wcm9wcztcbiAgICAgIG5ldyBLaW5ldGljcygkLktJTkVUSUNTLnByb3BzKTtcblxuICAgICAgLypcbiAgICAgIFxuICAgICAgXHRcdFx0VE9ETzogSXMgdGhlcmUgYSB3YXkgdG8gcmVtb3ZlIG1vdXNlZXZlbnQgbGlzdGVuZXJzIG9uIGxheWVycyBzbyB0aGVyZSdzIG5vIGNvbmZsaWN0P1xuICAgICAgICovXG4gICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlKHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbktpbmV0aWNzID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEtpbmV0aWNzLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBLaW5ldGljcyhvcHRpb25zKSB7XG4gICAgdmFyIGtleXM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBLaW5ldGljcy5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAkLktJTkVUSUNTLmxheWVyID0gdGhpcztcbiAgICB0aGlzLmRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5zdXBlckxheWVyID0gdGhpcztcbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvbik7XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uWEwuc3VwZXJMYXllciA9IHRoaXMuY2xvc2VCdXR0b247XG4gICAgJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIuc3VwZXJMYXllciA9IHRoaXMuY2xvc2VCdXR0b247XG4gICAgdGhpcy5jbG9zZUJ1dHRvblhMID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMKTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uWFIgPSBuZXcgTGF5ZXIoJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIpO1xuICAgIGtleXMgPSBbXTtcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24oZSkge1xuICAgICAga2V5c1tlLmtleUNvZGVdID0gZS50eXBlID09PSBcImtleWRvd25cIjtcbiAgICAgIGlmIChrZXlzWzE4XSAmJiBrZXlzWzE4N10pIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKCk7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLnNjYWxlICs9IC4yNTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5c1sxOF0gJiYga2V5c1sxODldKSB7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpO1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLnNjYWxlIC09IC4yNTtcbiAgICAgICAgaWYgKCQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPCAuMjUpIHtcbiAgICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5zY2FsZSA9IC4yNTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5vbihFdmVudHMuQ2xpY2ssIGZ1bmN0aW9uKCkge1xuICAgICAgJC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW47XG4gICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlKHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHNjYWxlOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnZlOiBcInNwcmluZygzNDUsIDQwLCAwKVwiXG4gICAgICB9LCAkLktJTkVUSUNTLmxheWVyLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5kZXN0cm95KCk7XG4gICAgICB9KSk7XG4gICAgfSk7XG4gICAgdGhpcy5zZXR1cFRleHQoKTtcbiAgICB0aGlzLnNldHVwU2xpZGVycygpO1xuICB9XG5cbiAgS2luZXRpY3MucHJvdG90eXBlLnNldHVwVGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0ZXh0O1xuICAgIGZvciAodGV4dCBpbiAkLlRFWFQpIHtcbiAgICAgIGlmICh0ZXh0ICE9PSBcImlucHV0XCIpIHtcbiAgICAgICAgJC5URVhUW1wiXCIgKyB0ZXh0XS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hbmltYXRlUHJvcHMgPSBuZXcgTGF5ZXIoJC5URVhULmFuaW1hdGVQcm9wcyk7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wid2lkdGhcIl0gPSB0aGlzLmFuaW1hdGVQcm9wcy53aWR0aCArIFwicHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiaGVpZ2h0XCJdID0gdGhpcy5hbmltYXRlUHJvcHMuaGVpZ2h0ICsgXCJweFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250XCJdID0gXCJub3JtYWwgNDAwIDI2cHggUm9ib3RvIE1vbm9cIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMjZweFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJjb2xvclwiXSA9IFwid2hpdGVcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiLXdla2l0LXVzZXItc2VsZWN0XCJdID0gXCJ0ZXh0XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcIlwiICsgJC5LSU5FVElDUy5sYXllci5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hbmltYXRlUHJvcHNJbnB1dCk7XG5cbiAgICAvKlxuICAgIFxuICAgIFx0XHRUT0RPOiBNYWtlIGN1cnZlIHByb3BzIGFuIGlucHV0IHdoZXJlIHlvdSBjYW4gdHlwZSBpbiBpdCBpZiB5b3Ugd2lzaCAoYWRqdXN0cyBrbm9iIHZhbHVlcylcbiAgICBcdFx0QlVHIChzZW1pKTogY3VydmVQcm9wcyBpcyBlZGl0YWJsZVxuICAgICAqL1xuICAgIHRoaXMuY3VydmVQcm9wcyA9IG5ldyBMYXllcigkLlRFWFQuY3VydmVQcm9wcyk7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wid2lkdGhcIl0gPSB0aGlzLmN1cnZlUHJvcHMud2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImhlaWdodFwiXSA9IHRoaXMuY3VydmVQcm9wcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcInRleHQtYWxpZ25cIl0gPSBcImNlbnRlclwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IFwiMzRweFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJjb2xvclwiXSA9IFwiI0EwRTM1RlwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJmb250XCJdID0gXCI0MDAgMjhweCBSb2JvdG8gTW9ub1wiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCJ0cmFuc3BhcmVudFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJib3JkZXJcIl0gPSBcIm5vbmVcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wicmVzaXplXCJdID0gXCJub25lXCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC52YWx1ZSA9IFwiXFxcIlwiICsgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgKyBcIlxcXCJcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jdXJ2ZVByb3BzVGV4dCk7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlciA9IFwiIFwiO1xuICAgIH07XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5vbmJsdXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIjtcbiAgICB9O1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25rZXl1cCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpLCBpbmRleCwgbGVuLCBvcHRpb24sIG9wdGlvbnMsIHJlZ2V4O1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKCk7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiO1xuICAgICAgICBpZiAoJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgIHJlZ2V4ID0gLyhcXFMqXFx3KS9nO1xuICAgICAgICAgIG9wdGlvbnMgPSAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnZhbHVlLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBvcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBvcHRpb24gPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgaW5kZXggPSBfLmluZGV4T2Yob3B0aW9ucywgb3B0aW9uKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgJC5BTklNQVRFLm9wdGlvbnMucHJvcGVydGllc1tcIlwiICsgb3B0aW9uXSA9IG9wdGlvbnNbaW5kZXggKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5jdXJ2ZVByb3BzVGV4dC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QoKTtcbiAgICB9O1xuICB9O1xuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5zZXR1cFNsaWRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSwgaiwgbGFiZWwsIGxlbiwgbGVuMSwgcmVmLCByZWYxLCByZXN1bHRzLCBzbGlkZXIsIHN0eWxlO1xuICAgIGZvciAoc2xpZGVyIGluICQuU0xJREVSUykge1xuICAgICAgaWYgKHNsaWRlciAhPT0gXCJrbm9iXCIpIHtcbiAgICAgICAgJC5TTElERVJTW1wiXCIgKyBzbGlkZXJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxhYmVsIGluICQuTEFCRUxTKSB7XG4gICAgICAkLkxBQkVMU1tcIlwiICsgbGFiZWxdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyO1xuICAgIH1cbiAgICB0aGlzLnRlbnNpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy50ZW5zaW9uKTtcbiAgICB0aGlzLnRlbnNpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnRlbnNpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50ZW5zaW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy50ZW5zaW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudGVuc2lvbkxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnRlbnNpb24pO1xuICAgIHRoaXMudGVuc2lvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0ZW5zaW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQHRlbnNpb25MYWJlbC5oZWlnaHQnPlwiICsgdGhpcy50ZW5zaW9uTGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgdGhpcy5mcmljdGlvbiA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLmZyaWN0aW9uKTtcbiAgICB0aGlzLmZyaWN0aW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLmZyaWN0aW9uLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2U7XG4gICAgdGhpcy5mcmljdGlvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLmZyaWN0aW9uTGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMuZnJpY3Rpb24pO1xuICAgIHRoaXMuZnJpY3Rpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAZnJpY3Rpb25MYWJlbC53aWR0aCcgaGVpZ2h0PSdAZnJpY3Rpb25MYWJlbC5oZWlnaHQnPlwiICsgdGhpcy5mcmljdGlvbkxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy52ZWxvY2l0eSk7XG4gICAgdGhpcy52ZWxvY2l0eS5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMudmVsb2NpdHkua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy52ZWxvY2l0eS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudmVsb2NpdHkuZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy52ZWxvY2l0eUxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnZlbG9jaXR5KTtcbiAgICB0aGlzLnZlbG9jaXR5TGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQHZlbG9jaXR5TGFiZWwud2lkdGgnIGhlaWdodD0nQHZlbG9jaXR5TGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudmVsb2NpdHlMYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICB0aGlzLnRvbGVyYW5jZSA9IG5ldyBTbGlkZXJDb21wb25lbnQoJC5TTElERVJTLnRvbGVyYW5jZSk7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnRvbGVyYW5jZS5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRvbGVyYW5jZS5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudG9sZXJhbmNlLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudG9sZXJhbmNlTGFiZWwgPSBuZXcgTGF5ZXIoJC5MQUJFTFMudG9sZXJhbmNlKTtcbiAgICB0aGlzLnRvbGVyYW5jZUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0b2xlcmFuY2VMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdG9sZXJhbmNlTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudG9sZXJhbmNlTGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgcmVmID0gJC5LSU5FVElDUy5sYXllci5zdWJMYXllcnM7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzbGlkZXIgPSByZWZbaV07XG4gICAgICBpZiAoc2xpZGVyLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiTGF5ZXJcIikge1xuICAgICAgICBmb3IgKHN0eWxlIGluICQuU1RZTEUuc2xpZGVyTGFiZWxzKSB7XG4gICAgICAgICAgc2xpZGVyLl9lbGVtZW50LnN0eWxlW1wiXCIgKyBzdHlsZV0gPSAkLlNUWUxFLnNsaWRlckxhYmVsc1tcIlwiICsgc3R5bGVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlZjEgPSB0aGlzLnN1YkxheWVycztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBzbGlkZXIgPSByZWYxW2pdO1xuICAgICAgaWYgKCEoc2xpZGVyIGluc3RhbmNlb2YgU2xpZGVyQ29tcG9uZW50ID09PSB0cnVlKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHNsaWRlci5vbihcImNoYW5nZTp2YWx1ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgPSBcInNwcmluZyhcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudGVuc2lvbi52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci5mcmljdGlvbi52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci52ZWxvY2l0eS52YWx1ZSkpICsgXCIsIFwiICsgKE1hdGgucm91bmQoJC5LSU5FVElDUy5sYXllci50b2xlcmFuY2UudmFsdWUgKiAxMDAwKSAvIDEwMDApICsgXCIpXCI7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmN1cnZlUHJvcHNUZXh0LnZhbHVlID0gXCJcXFwiXCIgKyAkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSArIFwiXFxcIlwiO1xuICAgICAgfSk7XG4gICAgICByZXN1bHRzLnB1c2goc2xpZGVyLmtub2Iub24oRXZlbnRzLkRyYWdFbmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5hbmltYXRlVGFyZ2V0KCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5hbmltYXRlVGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgJC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW47XG4gICAgcmV0dXJuICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIuYW5pbWF0ZSgkLkFOSU1BVEUub3B0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIEtpbmV0aWNzO1xuXG59KShMYXllcik7XG4iXX0=
