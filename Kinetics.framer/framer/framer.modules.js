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
        return $.KINETICS.layer.curveProps.html = "<textarea onclick='this.select()' style='width:" + $.TEXT.curveProps.width + "px; height:" + $.TEXT.curveProps.height + "px; text-align:center; line-height:34px; color:#A0E35F; font:400 28px Roboto Mono; background-color:transparent; border:none; resize:none'>&quot;" + $.ANIMATE.options.curve + "&quot;</textarea>";
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
        return $.KINETICS.layer.curveProps.html = "<textarea onclick='this.select()' style='width:" + $.TEXT.curveProps.width + "px; height:" + $.TEXT.curveProps.height + "px; text-align:center; line-height:34px; color:#A0E35F; font:400 28px Roboto Mono; background-color:transparent; border:none; resize:none'>&quot;" + $.ANIMATE.options.curve + "&quot;</textarea>";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zaG10dWNrZXIvR2l0SHViL0tpbmV0aWNzL0tpbmV0aWNzLmZyYW1lci9tb2R1bGVzL0tpbmV0aWNzLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2pvc2htdHVja2VyL0dpdEh1Yi9LaW5ldGljcy9LaW5ldGljcy5mcmFtZXIvbW9kdWxlcy9LaW5ldGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsZUFBQTtBQUFBLElBQUEsV0FBQTtFQUFBOzZCQUFBOztBQUFBLENBRUEsR0FDQztBQUFBLEVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxFQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBRHRCO0FBQUEsRUFFQSxPQUFBLEVBQVMsRUFGVDtBQUFBLEVBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxFQUlBLE9BQUEsRUFBUztBQUFBLElBQUMsSUFBQSxFQUFLO0FBQUEsTUFBQyxRQUFBLEVBQVUsRUFBWDtBQUFBLE1BQWUsZUFBQSxFQUFpQixTQUFoQztLQUFOO0FBQUEsSUFBa0QsSUFBQSxFQUFLO0FBQUEsTUFBQyxlQUFBLEVBQWlCLFNBQWxCO0tBQXZEO0dBSlQ7QUFBQSxFQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsRUFNQSxLQUFBLEVBQU87QUFBQSxJQUFDLFlBQUEsRUFBYTtBQUFBLE1BQUMsZ0JBQUEsRUFBa0IsUUFBbkI7QUFBQSxNQUE2QixTQUFBLEVBQVcsWUFBeEM7QUFBQSxNQUFzRCxNQUFBLEVBQVEsNkJBQTlEO0tBQWQ7R0FOUDtBQUFBLEVBT0EsT0FBQSxFQUFTLEVBUFQ7Q0FIRCxDQUFBOztBQUFBLENBWUMsQ0FBQyxRQUFRLENBQUMsS0FBWCxHQUNDO0FBQUEsRUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFULEdBQWUsQ0FBckI7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjIyBWQVJJQUJMRVMgIyMjXG5cbiQgPSBcblx0S0lORVRJQ1M6IHt9XG5cdERFVklDRTogRnJhbWVyLkRldmljZS5waG9uZVxuXHRCVVRUT05TOiB7fVxuXHRURVhUOiB7fVxuXHRTTElERVJTOiB7a25vYjp7a25vYlNpemU6IDI4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifSwgZmlsbDp7YmFja2dyb3VuZENvbG9yOiBcIiNFMEUwRTBcIn19XG5cdExBQkVMUzoge31cblx0U1RZTEU6IHtzbGlkZXJMYWJlbHM6e1widmVydGljYWwtYWxpZ25cIjogXCJjZW50ZXJcIiwgXCJkaXNwbGF5XCI6IFwidGFibGUtY2VsbFwiLCBcImZvbnRcIjogXCJub3JtYWwgMTAwIDI2cHggUm9ib3RvIE1vbm9cIn19XG5cdEFOSU1BVEU6IHt9XG5cbiQuS0lORVRJQ1MucHJvcHMgPSBcblx0bWlkWDogJC5ERVZJQ0Uud2lkdGgvMiBcblx0bWlkWTogJC5ERVZJQ0UuaGVpZ2h0LzIgXG5cdHdpZHRoOiAoNzAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDcwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0aGVpZ2h0OiAoNDAwICogJC5ERVZJQ0Uuc2NhbGUpICsgKDQwMCAqICgxLSQuREVWSUNFLnNjYWxlKSlcblx0c2NhbGU6IDBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMxNTE1MTdcIlxuXHRzdXBlckxheWVyOiAkLkRFVklDRVxuXHR0YXJnZXRMYXllcjoge31cblxuIyDigJPigJPigJMgQlVUVE9OU1xuJC5CVVRUT05TLmNsb3NlQnV0dG9uID0ge21heFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLSAyOCwgeTogMjgsIHdpZHRoOiAyNCwgaGVpZ2h0OiAyNCwgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJ9XG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YTCA9IHttaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGgvMiwgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodC8yLCB3aWR0aDogMjQsIGhlaWdodDogNCwgcm90YXRpb246IDQ1LCBib3JkZXJSYWRpdXM6IDE4LCBiYWNrZ3JvdW5kQ29sb3I6IFwiI0UwRTBFMFwifVxuJC5CVVRUT05TLmNsb3NlQnV0dG9uWFIgPSB7bWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoLzIsIG1pZFk6ICQuQlVUVE9OUy5jbG9zZUJ1dHRvbi5oZWlnaHQvMiwgd2lkdGg6IDI0LCBoZWlnaHQ6IDQsIHJvdGF0aW9uOiAtNDUsIGJvcmRlclJhZGl1czogMTgsIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJ9XG5cbiMg4oCT4oCT4oCTIFRFWFRcbiQuVEVYVC5hbmltYXRlUHJvcHMgPSBcblx0bWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8yXG5cdHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMTYwXG5cdGhlaWdodDogODBcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTogXCJBbmltYXRlUHJvcHNcIlxuXHRpZ25vcmVFdmVudHM6IGZhbHNlXG5cdHByb3BhZ2F0ZUV2ZW50czogZmFsc2VcblxuJC5URVhULmN1cnZlUHJvcHMgPSBcblx0bWlkWDogJC5LSU5FVElDUy5wcm9wcy53aWR0aC8yXG5cdG1heFk6ICQuS0lORVRJQ1MucHJvcHMuaGVpZ2h0LTIwXG5cdHdpZHRoOiAkLktJTkVUSUNTLnByb3BzLndpZHRoLzEuNVxuXHRuYW1lOiBcIkN1cnZlUHJvcHNcIlxuXHRoZWlnaHQ6IDQwXG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cbiMg4oCT4oCT4oCTIFNMSURFUlNcblxuJC5TTElERVJTLnRlbnNpb24gPSBcblx0eDogMjAwXG5cdHk6IDEwN1xuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRuYW1lOiBcIlRlbnNpb25TbGlkZXJcIlxuXHRtaW46IDBcblx0bWF4OiAxMDAwXG5cdHZhbHVlOiAyNTBcblxuJC5TTElERVJTLmZyaWN0aW9uID0gXG5cdHg6IDIwMFxuXHR5OiAxNjFcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bmFtZTogXCJGcmljdGlvblNsaWRlclwiXG5cdG1pbjogMFxuXHRtYXg6IDEwMFxuXHR2YWx1ZTogNDVcblxuJC5TTElERVJTLnZlbG9jaXR5ID0gXG5cdHg6IDIwMFxuXHR5OiAyMTVcblx0d2lkdGg6IDQ2MFxuXHRoZWlnaHQ6IDEwXG5cdGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCJcblx0bmFtZTogXCJWZWxvY2l0eVNsaWRlclwiXG5cdG1pbjogMFxuXHRtYXg6IDEwXG5cdHZhbHVlOiAwXG5cbiQuU0xJREVSUy50b2xlcmFuY2UgPSBcblx0eDogMjAwXG5cdHk6IDI2OVxuXHR3aWR0aDogNDYwXG5cdGhlaWdodDogMTBcblx0YmFja2dyb3VuZENvbG9yOiBcIiMzQTNBNDBcIlxuXHRuYW1lOiBcIlRvbGVyYW5jZVNsaWRlclwiXG5cdG1pbjogMC4wMDFcblx0bWF4OiAxXG5cdHZhbHVlOiAwLjAwMVxuXG4jIOKAk+KAk+KAkyBMQUJFTFNcbiQuTEFCRUxTLnRlbnNpb24gPSBcblx0eDogMjBcblx0eTogOTJcblx0d2lkdGg6IDExMFxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVGVuc2lvbkxhYmVsXCJcblxuJC5MQUJFTFMuZnJpY3Rpb24gPSBcblx0eDogMjBcblx0eTogMTQ2XG5cdHdpZHRoOiAxMjVcblx0aGVpZ2h0OiAzNFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOiBcIkZyaWN0aW9uTGFiZWxcIlxuXG4kLkxBQkVMUy52ZWxvY2l0eSA9IFxuXHR4OiAyMFxuXHR5OiAyMDBcblx0d2lkdGg6IDEyNVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVmVsb2NpdHlMYWJlbFwiXG5cbiQuTEFCRUxTLnRvbGVyYW5jZSA9IFxuXHR4OiAyMFxuXHR5OiAyNTRcblx0d2lkdGg6IDE0MVxuXHRoZWlnaHQ6IDM0XG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdG5hbWU6IFwiVG9sZXJhbmNlTGFiZWxcIlxuXG4jIOKAk+KAk+KAkyBBTklNQVRFXG4kLkFOSU1BVEUub3B0aW9ucyA9XG5cdGxheWVyOiBudWxsXG5cdHByb3BlcnRpZXM6IHt9XG5cdGN1cnZlOiBcInNwcmluZygyNTAsIDQ1LCAwLCAuMDAxXCJcblx0Y3VydmVPcHRpb25zOiB7fVxuXHR0aW1lOiAxXG5cdGRlbGF5OiAwXG5cdHJlcGVhdDogMFxuXHRkZWJ1ZzogZmFsc2VcblxuIyBEaXNhYmxlIGNsaXAgb24gZGV2aWNlXG5GcmFtZXIuRGV2aWNlLnBob25lLmNsaXAgPSBmYWxzZVxuXG5GcmFtZXIuQ3VycmVudENvbnRleHQub24gXCJsYXllcjpjcmVhdGVcIiwgKGxheWVyKSAtPlxuXHRsYXllci5vbiBFdmVudHMuQ2xpY2ssIChlLCBsYXllcikgLT5cblx0XHQjIE9ubHkgb24gYW4gYWx0KG9wdGlvbikgKyBjbGlja1xuXHRcdGlmIGUuYWx0S2V5IGFuZCBsYXllciBpbnN0YW5jZW9mIEtpbmV0aWNzIGlzIGZhbHNlIGFuZCBsYXllci5zdXBlckxheWVyIGlzbnQgJC5LSU5FVElDUy5sYXllclxuXG5cdFx0XHQjIERlc3Ryb3kgaWYgbGF5ZXIgYWxyZWFkeSBleGlzdHNcblx0XHRcdGlmICQuS0lORVRJQ1MubGF5ZXIgdGhlbiAkLktJTkVUSUNTLmxheWVyLmRlc3Ryb3koKVxuXHRcdFx0XG5cdFx0XHQjIENyZWF0ZSBLaW5ldGljcyBsYXllclxuXHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllciA9IGxheWVyXG5cdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luID0gbGF5ZXIucHJvcHNcblx0XHRcdG5ldyBLaW5ldGljcyAkLktJTkVUSUNTLnByb3BzXG5cblx0XHRcdCMjI1xuXG5cdFx0XHRUT0RPOiBJcyB0aGVyZSBhIHdheSB0byByZW1vdmUgbW91c2VldmVudCBsaXN0ZW5lcnMgb24gbGF5ZXJzIHNvIHRoZXJlJ3Mgbm8gY29uZmxpY3Q/XG5cblx0XHRcdCMjI1xuXG5cdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIlxuXG5jbGFzcyBLaW5ldGljcyBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHQjIFJlZmVyZW5jZSBLaW5ldGljc1xuXHRcdCQuS0lORVRJQ1MubGF5ZXIgPSBAXG5cblx0XHRAZHJhZ2dhYmxlLmVuYWJsZWQgPSB0cnVlXG5cdFx0QGRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cblx0XHQjIEFkZCBjbG9zZSBidXR0b25cblx0XHQkLkJVVFRPTlMuY2xvc2VCdXR0b24uc3VwZXJMYXllciA9IEBcblx0XHRAY2xvc2VCdXR0b24gPSBuZXcgTGF5ZXIgJC5CVVRUT05TLmNsb3NlQnV0dG9uXG5cdFx0XHRcblx0XHQkLkJVVFRPTlMuY2xvc2VCdXR0b25YTC5zdXBlckxheWVyID0gQGNsb3NlQnV0dG9uXG5cdFx0JC5CVVRUT05TLmNsb3NlQnV0dG9uWFIuc3VwZXJMYXllciA9IEBjbG9zZUJ1dHRvblxuXHRcdEBjbG9zZUJ1dHRvblhMID0gbmV3IExheWVyICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMXG5cdFx0QGNsb3NlQnV0dG9uWFIgPSBuZXcgTGF5ZXIgJC5CVVRUT05TLmNsb3NlQnV0dG9uWFJcblxuXHRcdCMg4oCT4oCT4oCTIEVWRU5UU1xuXHRcdCMgQWRqdXN0IHNpemUgb2YgS2luZXRpY3Mgd2luZG93IHdpdGggb3B0aW9uICsgcGx1cyBvciBvcHRpb24gKyBtaW51c1xuXHRcdGtleXMgPSBbXVxuXHRcdGRvY3VtZW50Lm9ua2V5ZG93biA9IGRvY3VtZW50Lm9ua2V5dXAgPSAoZSkgLT5cblx0XHRcdGtleXNbZS5rZXlDb2RlXSA9IGUudHlwZSA9PSBcImtleWRvd25cIlxuXG5cdFx0XHQjIFNjYWxlIHVwXG5cdFx0XHRpZiBrZXlzWzE4XSBhbmQga2V5c1sxODddXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpXG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgKz0gLjI1XG5cdFx0XHRlbHNlIGlmIGtleXNbMThdIGFuZCBrZXlzWzE4OV1cblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC5ibHVyKClcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5zY2FsZSAtPSAuMjVcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5zY2FsZSA9IC4yNSBpZiAkLktJTkVUSUNTLmxheWVyLnNjYWxlIDwgLjI1XG5cblx0XHRAY2xvc2VCdXR0b24ub24gRXZlbnRzLkNsaWNrLCAtPlxuXHRcdFx0JC5LSU5FVElDUy50YXJnZXRMYXllci5wcm9wcyA9ICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXJPcmlnaW5cblxuXHRcdFx0JC5LSU5FVElDUy5sYXllci5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0c2NhbGU6IDBcblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDM0NSwgNDAsIDApXCJcblxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsIC0+XG5cdFx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5kZXN0cm95KClcblxuXHRcdEBzZXR1cFRleHQoKVxuXHRcdEBzZXR1cFNsaWRlcnMoKVxuXG5cdHNldHVwVGV4dDogLT5cblx0XHQjIFNldHVwIHN1cGVyTGF5ZXJcblx0XHRmb3IgdGV4dCBvZiAkLlRFWFQgd2hlbiB0ZXh0IGlzbnQgXCJpbnB1dFwiXG5cdFx0XHQkLlRFWFRbXCIje3RleHR9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIOKAk+KAk+KAkyBBTklNQVRFIFBST1BFUlRJRVNcblx0XHRAYW5pbWF0ZVByb3BzID0gbmV3IExheWVyICQuVEVYVC5hbmltYXRlUHJvcHNcblxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIndpZHRoXCJdID0gXCIje0BhbmltYXRlUHJvcHMud2lkdGh9cHhcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImhlaWdodFwiXSA9IFwiI3tAYW5pbWF0ZVByb3BzLmhlaWdodH1weFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udFwiXSA9IFwibm9ybWFsIDQwMCAyNnB4IFJvYm90byBNb25vXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJ0ZXh0LWFsaWduXCJdID0gXCJjZW50ZXJcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMjZweFwiXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiY29sb3JcIl0gPSBcIndoaXRlXCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCItd2VraXQtdXNlci1zZWxlY3RcIl0gPSBcInRleHRcIlxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImJhY2tncm91bmQtY29sb3JcIl0gPSBcIiN7JC5LSU5FVElDUy5sYXllci5iYWNrZ3JvdW5kQ29sb3J9XCJcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiXG5cblx0XHRAYW5pbWF0ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKEBhbmltYXRlUHJvcHNJbnB1dClcblxuXHRcdCMg4oCT4oCT4oCTIENVUlZFIFBST1BFUlRJRVNcblxuXHRcdCMjI1xuXG5cdFx0VE9ETzogTWFrZSBjdXJ2ZSBwcm9wcyBhbiBpbnB1dCB3aGVyZSB5b3UgY2FuIHR5cGUgaW4gaXQgaWYgeW91IHdpc2ggKGFkanVzdHMga25vYiB2YWx1ZXMpXG5cdFx0QlVHIChzZW1pKTogY3VydmVQcm9wcyBpcyBlZGl0YWJsZVxuXG5cdFx0IyMjXG5cblxuXHRcdEBjdXJ2ZVByb3BzID0gbmV3IExheWVyICQuVEVYVC5jdXJ2ZVByb3BzXG5cblx0XHRAY3VydmVQcm9wc1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJ3aWR0aFwiXSA9IFwiI3tAY3VydmVQcm9wcy53aWR0aH1weFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiaGVpZ2h0XCJdID0gXCIje0BjdXJ2ZVByb3BzLmhlaWdodH1weFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1widGV4dC1hbGlnblwiXSA9IFwiY2VudGVyXCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IFwiMzRweFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiY29sb3JcIl0gPSBcIiNBMEUzNUZcIlxuXHRcdEBjdXJ2ZVByb3BzVGV4dC5zdHlsZVtcImZvbnRcIl0gPSBcIjQwMCAyOHB4IFJvYm90byBNb25vXCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiYm9yZGVyXCJdID0gXCJub25lXCJcblx0XHRAY3VydmVQcm9wc1RleHQuc3R5bGVbXCJyZXNpemVcIl0gPSBcIm5vbmVcIlxuXG5cdFx0QGN1cnZlUHJvcHNUZXh0LnZhbHVlID0gXCJcXFwiI3skLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZX1cXFwiXCJcblxuXHRcdEBjdXJ2ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKEBjdXJ2ZVByb3BzVGV4dClcblxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0IyBTZWxlY3QgaW5wdXRcblx0XHRAYW5pbWF0ZVByb3BzSW5wdXQub25jbGljayA9IC0+XG5cdFx0XHRAZm9jdXMoKVxuXHRcdFx0QHBsYWNlaG9sZGVyID0gXCIgXCJcblxuXHRcdCMgUmVwbGFjZSBwbGFjZWhvbGRlclxuXHRcdEBhbmltYXRlUHJvcHNJbnB1dC5vbmJsdXIgPSAtPlxuXHRcdFx0QHBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0IyBTdWJtaXR0aW5nIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXG5cdFx0QGFuaW1hdGVQcm9wc0lucHV0Lm9ua2V5dXAgPSAoZSkgLT5cblx0XHRcdGlmIGUua2V5Q29kZSBpcyAxM1xuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKVxuXHRcdFx0XHQkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIlxuXG5cdFx0XHRcdGlmICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUgaXNudCBcIlwiXG5cblx0XHRcdFx0XHRyZWdleCA9IC8oXFxTKlxcdykvZ1xuXG5cdFx0XHRcdFx0b3B0aW9ucyA9ICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUubWF0Y2gocmVnZXgpXG5cblx0XHRcdFx0XHRmb3Igb3B0aW9uIGluIG9wdGlvbnNcblx0XHRcdFx0XHRcdGluZGV4ID0gXy5pbmRleE9mKG9wdGlvbnMsIG9wdGlvbilcblx0XHRcdFx0XHRcdGlmIGluZGV4ICUgMiBpcyAwXG5cdFx0XHRcdFx0XHRcdCQuQU5JTUFURS5vcHRpb25zLnByb3BlcnRpZXNbXCIje29wdGlvbn1cIl0gPSBvcHRpb25zW2luZGV4KzFdXG5cblx0XHRcdFx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpblxuXG5cdFx0IyBTZWxlY3QgY3VydmUgdmFsdWVcblx0XHRAY3VydmVQcm9wc1RleHQub25jbGljayA9IC0+XG5cdFx0XHRAc2VsZWN0KClcblxuXHRzZXR1cFNsaWRlcnM6IC0+XG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3Igc2xpZGVyc1xuXHRcdGZvciBzbGlkZXIgb2YgJC5TTElERVJTIHdoZW4gc2xpZGVyIGlzbnQgXCJrbm9iXCJcblx0XHRcdCQuU0xJREVSU1tcIiN7c2xpZGVyfVwiXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllclxuXG5cdFx0IyBTZXQgc3VwZXJMYXllciBmb3IgbGFiZWxzXG5cdFx0Zm9yIGxhYmVsIG9mICQuTEFCRUxTXG5cdFx0XHQkLkxBQkVMU1tcIiN7bGFiZWx9XCJdLnN1cGVyTGF5ZXIgPSAkLktJTkVUSUNTLmxheWVyXG5cblx0XHQjIOKAk+KAk+KAkyBURU5TSU9OXG5cdFx0QHRlbnNpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50ICQuU0xJREVSUy50ZW5zaW9uXG5cdFx0QHRlbnNpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0ZW5zaW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yXG5cdFx0QHRlbnNpb24ua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB0ZW5zaW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdGVuc2lvbkxhYmVsID0gbmV3IExheWVyICQuTEFCRUxTLnRlbnNpb25cblx0XHRAdGVuc2lvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0ZW5zaW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQHRlbnNpb25MYWJlbC5oZWlnaHQnPiN7QHRlbnNpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBGUklDVElPTlxuXG5cdFx0QGZyaWN0aW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCAkLlNMSURFUlMuZnJpY3Rpb25cblx0XHRAZnJpY3Rpb24ua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEBmcmljdGlvbi5rbm9iLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5rbm9iLmJhY2tncm91bmRDb2xvclxuXHRcdEBmcmljdGlvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QGZyaWN0aW9uLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAZnJpY3Rpb25MYWJlbCA9IG5ldyBMYXllciAkLkxBQkVMUy5mcmljdGlvblxuXHRcdEBmcmljdGlvbkxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0BmcmljdGlvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0BmcmljdGlvbkxhYmVsLmhlaWdodCc+I3tAZnJpY3Rpb25MYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIOKAk+KAk+KAkyBWRUxPQ0lUWVxuXHRcdEB2ZWxvY2l0eSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnZlbG9jaXR5XG5cdFx0QHZlbG9jaXR5Lmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemVcblx0XHRAdmVsb2NpdHkua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdmVsb2NpdHkua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXHRcdEB2ZWxvY2l0eS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvclxuXG5cdFx0QHZlbG9jaXR5TGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudmVsb2NpdHlcblx0XHRAdmVsb2NpdHlMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdmVsb2NpdHlMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdmVsb2NpdHlMYWJlbC5oZWlnaHQnPiN7QHZlbG9jaXR5TGFiZWwubmFtZX08L2Rpdj5cIlxuXG5cdFx0IyDigJPigJPigJMgVE9MRVJBTkNFXG5cdFx0QHRvbGVyYW5jZSA9IG5ldyBTbGlkZXJDb21wb25lbnQgJC5TTElERVJTLnRvbGVyYW5jZVxuXHRcdEB0b2xlcmFuY2Uua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZVxuXHRcdEB0b2xlcmFuY2Uua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRAdG9sZXJhbmNlLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2Vcblx0XHRAdG9sZXJhbmNlLmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdG9sZXJhbmNlTGFiZWwgPSBuZXcgTGF5ZXIgJC5MQUJFTFMudG9sZXJhbmNlXG5cdFx0QHRvbGVyYW5jZUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B0b2xlcmFuY2VMYWJlbC53aWR0aCcgaGVpZ2h0PSdAdG9sZXJhbmNlTGFiZWwuaGVpZ2h0Jz4je0B0b2xlcmFuY2VMYWJlbC5uYW1lfTwvZGl2PlwiXG5cblx0XHQjIFNldCBzdHlsZSBmb3IgYWxsIHRoZSBsYWJlbHNcblx0XHRmb3Igc2xpZGVyIGluICQuS0lORVRJQ1MubGF5ZXIuc3ViTGF5ZXJzIHdoZW4gc2xpZGVyLmNvbnN0cnVjdG9yLm5hbWUgaXMgXCJMYXllclwiXG5cdFx0XHRmb3Igc3R5bGUgb2YgJC5TVFlMRS5zbGlkZXJMYWJlbHMgXG5cdFx0XHRcdHNsaWRlci5fZWxlbWVudC5zdHlsZVtcIiN7c3R5bGV9XCJdID0gJC5TVFlMRS5zbGlkZXJMYWJlbHNbXCIje3N0eWxlfVwiXVxuXG5cdFx0IyDigJPigJPigJMgRVZFTlRTXG5cdFx0Zm9yIHNsaWRlciBpbiBAc3ViTGF5ZXJzIHdoZW4gc2xpZGVyIGluc3RhbmNlb2YgU2xpZGVyQ29tcG9uZW50IGlzIHRydWVcblx0XHRcdHNsaWRlci5vbiBcImNoYW5nZTp2YWx1ZVwiLCAtPlxuXHRcdFx0XHQkLkFOSU1BVEUub3B0aW9ucy5jdXJ2ZSA9IFwic3ByaW5nKCN7TWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRlbnNpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIuZnJpY3Rpb24udmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudmVsb2NpdHkudmFsdWUpfSwgI3tNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudG9sZXJhbmNlLnZhbHVlICogMTAwMCkvMTAwMH0pXCJcblx0XHRcdFx0JC5LSU5FVElDUy5sYXllci5jdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBvbmNsaWNrPSd0aGlzLnNlbGVjdCgpJyBzdHlsZT0nd2lkdGg6I3skLlRFWFQuY3VydmVQcm9wcy53aWR0aH1weDsgaGVpZ2h0OiN7JC5URVhULmN1cnZlUHJvcHMuaGVpZ2h0fXB4OyB0ZXh0LWFsaWduOmNlbnRlcjsgbGluZS1oZWlnaHQ6MzRweDsgY29sb3I6I0EwRTM1RjsgZm9udDo0MDAgMjhweCBSb2JvdG8gTW9ubzsgYmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDsgYm9yZGVyOm5vbmU7IHJlc2l6ZTpub25lJz4mcXVvdDsjeyQuQU5JTUFURS5vcHRpb25zLmN1cnZlfSZxdW90OzwvdGV4dGFyZWE+XCJcblxuXHRcdFx0c2xpZGVyLmtub2Iub24gRXZlbnRzLkRyYWdFbmQsIC0+XG5cdFx0XHRcdCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVRhcmdldCgpXG5cblx0YW5pbWF0ZVRhcmdldDogLT5cblx0XHQkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpblxuXHRcdCQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIuYW5pbWF0ZSAkLkFOSU1BVEUub3B0aW9uc1xuXG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuOS4xXG5cbi8qIFZBUklBQkxFUyAqL1xudmFyICQsIEtpbmV0aWNzLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuJCA9IHtcbiAgS0lORVRJQ1M6IHt9LFxuICBERVZJQ0U6IEZyYW1lci5EZXZpY2UucGhvbmUsXG4gIEJVVFRPTlM6IHt9LFxuICBURVhUOiB7fSxcbiAgU0xJREVSUzoge1xuICAgIGtub2I6IHtcbiAgICAgIGtub2JTaXplOiAyOCxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbiAgICB9LFxuICAgIGZpbGw6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbiAgICB9XG4gIH0sXG4gIExBQkVMUzoge30sXG4gIFNUWUxFOiB7XG4gICAgc2xpZGVyTGFiZWxzOiB7XG4gICAgICBcInZlcnRpY2FsLWFsaWduXCI6IFwiY2VudGVyXCIsXG4gICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jZWxsXCIsXG4gICAgICBcImZvbnRcIjogXCJub3JtYWwgMTAwIDI2cHggUm9ib3RvIE1vbm9cIlxuICAgIH1cbiAgfSxcbiAgQU5JTUFURToge31cbn07XG5cbiQuS0lORVRJQ1MucHJvcHMgPSB7XG4gIG1pZFg6ICQuREVWSUNFLndpZHRoIC8gMixcbiAgbWlkWTogJC5ERVZJQ0UuaGVpZ2h0IC8gMixcbiAgd2lkdGg6ICg3MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNzAwICogKDEgLSAkLkRFVklDRS5zY2FsZSkpLFxuICBoZWlnaHQ6ICg0MDAgKiAkLkRFVklDRS5zY2FsZSkgKyAoNDAwICogKDEgLSAkLkRFVklDRS5zY2FsZSkpLFxuICBzY2FsZTogMCxcbiAgYmFja2dyb3VuZENvbG9yOiBcIiMxNTE1MTdcIixcbiAgc3VwZXJMYXllcjogJC5ERVZJQ0UsXG4gIHRhcmdldExheWVyOiB7fVxufTtcblxuJC5CVVRUT05TLmNsb3NlQnV0dG9uID0ge1xuICBtYXhYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC0gMjgsXG4gIHk6IDI4LFxuICB3aWR0aDogMjQsXG4gIGhlaWdodDogMjQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG59O1xuXG4kLkJVVFRPTlMuY2xvc2VCdXR0b25YTCA9IHtcbiAgbWlkWDogJC5CVVRUT05TLmNsb3NlQnV0dG9uLndpZHRoIC8gMixcbiAgbWlkWTogJC5CVVRUT05TLmNsb3NlQnV0dG9uLmhlaWdodCAvIDIsXG4gIHdpZHRoOiAyNCxcbiAgaGVpZ2h0OiA0LFxuICByb3RhdGlvbjogNDUsXG4gIGJvcmRlclJhZGl1czogMTgsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbn07XG5cbiQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSID0ge1xuICBtaWRYOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24ud2lkdGggLyAyLFxuICBtaWRZOiAkLkJVVFRPTlMuY2xvc2VCdXR0b24uaGVpZ2h0IC8gMixcbiAgd2lkdGg6IDI0LFxuICBoZWlnaHQ6IDQsXG4gIHJvdGF0aW9uOiAtNDUsXG4gIGJvcmRlclJhZGl1czogMTgsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjRTBFMEUwXCJcbn07XG5cbiQuVEVYVC5hbmltYXRlUHJvcHMgPSB7XG4gIG1pZFg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAyLFxuICB3aWR0aDogJC5LSU5FVElDUy5wcm9wcy53aWR0aCAtIDE2MCxcbiAgaGVpZ2h0OiA4MCxcbiAgYmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gIG5hbWU6IFwiQW5pbWF0ZVByb3BzXCIsXG4gIGlnbm9yZUV2ZW50czogZmFsc2UsXG4gIHByb3BhZ2F0ZUV2ZW50czogZmFsc2Vcbn07XG5cbiQuVEVYVC5jdXJ2ZVByb3BzID0ge1xuICBtaWRYOiAkLktJTkVUSUNTLnByb3BzLndpZHRoIC8gMixcbiAgbWF4WTogJC5LSU5FVElDUy5wcm9wcy5oZWlnaHQgLSAyMCxcbiAgd2lkdGg6ICQuS0lORVRJQ1MucHJvcHMud2lkdGggLyAxLjUsXG4gIG5hbWU6IFwiQ3VydmVQcm9wc1wiLFxuICBoZWlnaHQ6IDQwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxufTtcblxuJC5TTElERVJTLnRlbnNpb24gPSB7XG4gIHg6IDIwMCxcbiAgeTogMTA3LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBuYW1lOiBcIlRlbnNpb25TbGlkZXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwMDAsXG4gIHZhbHVlOiAyNTBcbn07XG5cbiQuU0xJREVSUy5mcmljdGlvbiA9IHtcbiAgeDogMjAwLFxuICB5OiAxNjEsXG4gIHdpZHRoOiA0NjAsXG4gIGhlaWdodDogMTAsXG4gIGJhY2tncm91bmRDb2xvcjogXCIjM0EzQTQwXCIsXG4gIG5hbWU6IFwiRnJpY3Rpb25TbGlkZXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDEwMCxcbiAgdmFsdWU6IDQ1XG59O1xuXG4kLlNMSURFUlMudmVsb2NpdHkgPSB7XG4gIHg6IDIwMCxcbiAgeTogMjE1LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBuYW1lOiBcIlZlbG9jaXR5U2xpZGVyXCIsXG4gIG1pbjogMCxcbiAgbWF4OiAxMCxcbiAgdmFsdWU6IDBcbn07XG5cbiQuU0xJREVSUy50b2xlcmFuY2UgPSB7XG4gIHg6IDIwMCxcbiAgeTogMjY5LFxuICB3aWR0aDogNDYwLFxuICBoZWlnaHQ6IDEwLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzNBM0E0MFwiLFxuICBuYW1lOiBcIlRvbGVyYW5jZVNsaWRlclwiLFxuICBtaW46IDAuMDAxLFxuICBtYXg6IDEsXG4gIHZhbHVlOiAwLjAwMVxufTtcblxuJC5MQUJFTFMudGVuc2lvbiA9IHtcbiAgeDogMjAsXG4gIHk6IDkyLFxuICB3aWR0aDogMTEwLFxuICBoZWlnaHQ6IDM0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJUZW5zaW9uTGFiZWxcIlxufTtcblxuJC5MQUJFTFMuZnJpY3Rpb24gPSB7XG4gIHg6IDIwLFxuICB5OiAxNDYsXG4gIHdpZHRoOiAxMjUsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIkZyaWN0aW9uTGFiZWxcIlxufTtcblxuJC5MQUJFTFMudmVsb2NpdHkgPSB7XG4gIHg6IDIwLFxuICB5OiAyMDAsXG4gIHdpZHRoOiAxMjUsXG4gIGhlaWdodDogMzQsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBuYW1lOiBcIlZlbG9jaXR5TGFiZWxcIlxufTtcblxuJC5MQUJFTFMudG9sZXJhbmNlID0ge1xuICB4OiAyMCxcbiAgeTogMjU0LFxuICB3aWR0aDogMTQxLFxuICBoZWlnaHQ6IDM0LFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgbmFtZTogXCJUb2xlcmFuY2VMYWJlbFwiXG59O1xuXG4kLkFOSU1BVEUub3B0aW9ucyA9IHtcbiAgbGF5ZXI6IG51bGwsXG4gIHByb3BlcnRpZXM6IHt9LFxuICBjdXJ2ZTogXCJzcHJpbmcoMjUwLCA0NSwgMCwgLjAwMVwiLFxuICBjdXJ2ZU9wdGlvbnM6IHt9LFxuICB0aW1lOiAxLFxuICBkZWxheTogMCxcbiAgcmVwZWF0OiAwLFxuICBkZWJ1ZzogZmFsc2Vcbn07XG5cbkZyYW1lci5EZXZpY2UucGhvbmUuY2xpcCA9IGZhbHNlO1xuXG5GcmFtZXIuQ3VycmVudENvbnRleHQub24oXCJsYXllcjpjcmVhdGVcIiwgZnVuY3Rpb24obGF5ZXIpIHtcbiAgcmV0dXJuIGxheWVyLm9uKEV2ZW50cy5DbGljaywgZnVuY3Rpb24oZSwgbGF5ZXIpIHtcbiAgICBpZiAoZS5hbHRLZXkgJiYgbGF5ZXIgaW5zdGFuY2VvZiBLaW5ldGljcyA9PT0gZmFsc2UgJiYgbGF5ZXIuc3VwZXJMYXllciAhPT0gJC5LSU5FVElDUy5sYXllcikge1xuICAgICAgaWYgKCQuS0lORVRJQ1MubGF5ZXIpIHtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgICAkLktJTkVUSUNTLnRhcmdldExheWVyID0gbGF5ZXI7XG4gICAgICAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luID0gbGF5ZXIucHJvcHM7XG4gICAgICBuZXcgS2luZXRpY3MoJC5LSU5FVElDUy5wcm9wcyk7XG5cbiAgICAgIC8qXG4gICAgICBcbiAgICAgIFx0XHRcdFRPRE86IElzIHRoZXJlIGEgd2F5IHRvIHJlbW92ZSBtb3VzZWV2ZW50IGxpc3RlbmVycyBvbiBsYXllcnMgc28gdGhlcmUncyBubyBjb25mbGljdD9cbiAgICAgICAqL1xuICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSh7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzY2FsZTogMVxuICAgICAgICB9LFxuICAgICAgICBjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIlxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5LaW5ldGljcyA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChLaW5ldGljcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gS2luZXRpY3Mob3B0aW9ucykge1xuICAgIHZhciBrZXlzO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgS2luZXRpY3MuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgJC5LSU5FVElDUy5sYXllciA9IHRoaXM7XG4gICAgdGhpcy5kcmFnZ2FibGUuZW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICAkLkJVVFRPTlMuY2xvc2VCdXR0b24uc3VwZXJMYXllciA9IHRoaXM7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG5ldyBMYXllcigkLkJVVFRPTlMuY2xvc2VCdXR0b24pO1xuICAgICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhMLnN1cGVyTGF5ZXIgPSB0aGlzLmNsb3NlQnV0dG9uO1xuICAgICQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSLnN1cGVyTGF5ZXIgPSB0aGlzLmNsb3NlQnV0dG9uO1xuICAgIHRoaXMuY2xvc2VCdXR0b25YTCA9IG5ldyBMYXllcigkLkJVVFRPTlMuY2xvc2VCdXR0b25YTCk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvblhSID0gbmV3IExheWVyKCQuQlVUVE9OUy5jbG9zZUJ1dHRvblhSKTtcbiAgICBrZXlzID0gW107XG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGtleXNbZS5rZXlDb2RlXSA9IGUudHlwZSA9PT0gXCJrZXlkb3duXCI7XG4gICAgICBpZiAoa2V5c1sxOF0gJiYga2V5c1sxODddKSB7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpO1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5zY2FsZSArPSAuMjU7XG4gICAgICB9IGVsc2UgaWYgKGtleXNbMThdICYmIGtleXNbMTg5XSkge1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LmJsdXIoKTtcbiAgICAgICAgJC5LSU5FVElDUy5sYXllci5zY2FsZSAtPSAuMjU7XG4gICAgICAgIGlmICgkLktJTkVUSUNTLmxheWVyLnNjYWxlIDwgLjI1KSB7XG4gICAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuc2NhbGUgPSAuMjU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2xvc2VCdXR0b24ub24oRXZlbnRzLkNsaWNrLCBmdW5jdGlvbigpIHtcbiAgICAgICQuS0lORVRJQ1MudGFyZ2V0TGF5ZXIucHJvcHMgPSAkLktJTkVUSUNTLnRhcmdldExheWVyT3JpZ2luO1xuICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZSh7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzY2FsZTogMFxuICAgICAgICB9LFxuICAgICAgICBjdXJ2ZTogXCJzcHJpbmcoMzQ1LCA0MCwgMClcIlxuICAgICAgfSwgJC5LSU5FVElDUy5sYXllci5vbihFdmVudHMuQW5pbWF0aW9uRW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQuS0lORVRJQ1MubGF5ZXIuZGVzdHJveSgpO1xuICAgICAgfSkpO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0dXBUZXh0KCk7XG4gICAgdGhpcy5zZXR1cFNsaWRlcnMoKTtcbiAgfVxuXG4gIEtpbmV0aWNzLnByb3RvdHlwZS5zZXR1cFRleHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGV4dDtcbiAgICBmb3IgKHRleHQgaW4gJC5URVhUKSB7XG4gICAgICBpZiAodGV4dCAhPT0gXCJpbnB1dFwiKSB7XG4gICAgICAgICQuVEVYVFtcIlwiICsgdGV4dF0uc3VwZXJMYXllciA9ICQuS0lORVRJQ1MubGF5ZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYW5pbWF0ZVByb3BzID0gbmV3IExheWVyKCQuVEVYVC5hbmltYXRlUHJvcHMpO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIndpZHRoXCJdID0gdGhpcy5hbmltYXRlUHJvcHMud2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcImhlaWdodFwiXSA9IHRoaXMuYW5pbWF0ZVByb3BzLmhlaWdodCArIFwicHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiZm9udFwiXSA9IFwibm9ybWFsIDQwMCAyNnB4IFJvYm90byBNb25vXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcInRleHQtYWxpZ25cIl0gPSBcImNlbnRlclwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjI2cHhcIjtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0LnN0eWxlW1wiY29sb3JcIl0gPSBcIndoaXRlXCI7XG4gICAgdGhpcy5hbmltYXRlUHJvcHNJbnB1dC5zdHlsZVtcIi13ZWtpdC11c2VyLXNlbGVjdFwiXSA9IFwidGV4dFwiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQuc3R5bGVbXCJiYWNrZ3JvdW5kLWNvbG9yXCJdID0gXCJcIiArICQuS0lORVRJQ1MubGF5ZXIuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQucGxhY2Vob2xkZXIgPSBcIkFkZCBhbmltYXRpb24gcHJvcGVydGllc1wiO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQpO1xuXG4gICAgLypcbiAgICBcbiAgICBcdFx0VE9ETzogTWFrZSBjdXJ2ZSBwcm9wcyBhbiBpbnB1dCB3aGVyZSB5b3UgY2FuIHR5cGUgaW4gaXQgaWYgeW91IHdpc2ggKGFkanVzdHMga25vYiB2YWx1ZXMpXG4gICAgXHRcdEJVRyAoc2VtaSk6IGN1cnZlUHJvcHMgaXMgZWRpdGFibGVcbiAgICAgKi9cbiAgICB0aGlzLmN1cnZlUHJvcHMgPSBuZXcgTGF5ZXIoJC5URVhULmN1cnZlUHJvcHMpO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcIndpZHRoXCJdID0gdGhpcy5jdXJ2ZVByb3BzLndpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJoZWlnaHRcIl0gPSB0aGlzLmN1cnZlUHJvcHMuaGVpZ2h0ICsgXCJweFwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQuc3R5bGVbXCJ0ZXh0LWFsaWduXCJdID0gXCJjZW50ZXJcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wibGluZS1oZWlnaHRcIl0gPSBcIjM0cHhcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiY29sb3JcIl0gPSBcIiNBMEUzNUZcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiZm9udFwiXSA9IFwiNDAwIDI4cHggUm9ib3RvIE1vbm9cIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiYmFja2dyb3VuZC1jb2xvclwiXSA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICB0aGlzLmN1cnZlUHJvcHNUZXh0LnN0eWxlW1wiYm9yZGVyXCJdID0gXCJub25lXCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzVGV4dC5zdHlsZVtcInJlc2l6ZVwiXSA9IFwibm9uZVwiO1xuICAgIHRoaXMuY3VydmVQcm9wc1RleHQudmFsdWUgPSBcIlxcXCJcIiArICQuQU5JTUFURS5vcHRpb25zLmN1cnZlICsgXCJcXFwiXCI7XG4gICAgdGhpcy5jdXJ2ZVByb3BzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY3VydmVQcm9wc1RleHQpO1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXIgPSBcIiBcIjtcbiAgICB9O1xuICAgIHRoaXMuYW5pbWF0ZVByb3BzSW5wdXQub25ibHVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlciA9IFwiQWRkIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXCI7XG4gICAgfTtcbiAgICB0aGlzLmFuaW1hdGVQcm9wc0lucHV0Lm9ua2V5dXAgPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgaSwgaW5kZXgsIGxlbiwgb3B0aW9uLCBvcHRpb25zLCByZWdleDtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQuYmx1cigpO1xuICAgICAgICAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVQcm9wc0lucHV0LnBsYWNlaG9sZGVyID0gXCJBZGQgYW5pbWF0aW9uIHByb3BlcnRpZXNcIjtcbiAgICAgICAgaWYgKCQuS0lORVRJQ1MubGF5ZXIuYW5pbWF0ZVByb3BzSW5wdXQudmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICByZWdleCA9IC8oXFxTKlxcdykvZztcbiAgICAgICAgICBvcHRpb25zID0gJC5LSU5FVElDUy5sYXllci5hbmltYXRlUHJvcHNJbnB1dC52YWx1ZS5tYXRjaChyZWdleCk7XG4gICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgb3B0aW9uID0gb3B0aW9uc1tpXTtcbiAgICAgICAgICAgIGluZGV4ID0gXy5pbmRleE9mKG9wdGlvbnMsIG9wdGlvbik7XG4gICAgICAgICAgICBpZiAoaW5kZXggJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICQuQU5JTUFURS5vcHRpb25zLnByb3BlcnRpZXNbXCJcIiArIG9wdGlvbl0gPSBvcHRpb25zW2luZGV4ICsgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuY3VydmVQcm9wc1RleHQub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KCk7XG4gICAgfTtcbiAgfTtcblxuICBLaW5ldGljcy5wcm90b3R5cGUuc2V0dXBTbGlkZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGosIGxhYmVsLCBsZW4sIGxlbjEsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2xpZGVyLCBzdHlsZTtcbiAgICBmb3IgKHNsaWRlciBpbiAkLlNMSURFUlMpIHtcbiAgICAgIGlmIChzbGlkZXIgIT09IFwia25vYlwiKSB7XG4gICAgICAgICQuU0xJREVSU1tcIlwiICsgc2xpZGVyXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsYWJlbCBpbiAkLkxBQkVMUykge1xuICAgICAgJC5MQUJFTFNbXCJcIiArIGxhYmVsXS5zdXBlckxheWVyID0gJC5LSU5FVElDUy5sYXllcjtcbiAgICB9XG4gICAgdGhpcy50ZW5zaW9uID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMudGVuc2lvbik7XG4gICAgdGhpcy50ZW5zaW9uLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy50ZW5zaW9uLmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudGVuc2lvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMudGVuc2lvbi5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRlbnNpb25MYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy50ZW5zaW9uKTtcbiAgICB0aGlzLnRlbnNpb25MYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdGVuc2lvbkxhYmVsLndpZHRoJyBoZWlnaHQ9J0B0ZW5zaW9uTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMudGVuc2lvbkxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHRoaXMuZnJpY3Rpb24gPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy5mcmljdGlvbik7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iU2l6ZSA9ICQuU0xJREVSUy5rbm9iLmtub2JTaXplO1xuICAgIHRoaXMuZnJpY3Rpb24ua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5mcmljdGlvbi5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlO1xuICAgIHRoaXMuZnJpY3Rpb24uZmlsbC5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMuZmlsbC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5mcmljdGlvbkxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLmZyaWN0aW9uKTtcbiAgICB0aGlzLmZyaWN0aW9uTGFiZWwuaHRtbCA9IFwiPGRpdiB3aWR0aD0nQGZyaWN0aW9uTGFiZWwud2lkdGgnIGhlaWdodD0nQGZyaWN0aW9uTGFiZWwuaGVpZ2h0Jz5cIiArIHRoaXMuZnJpY3Rpb25MYWJlbC5uYW1lICsgXCI8L2Rpdj5cIjtcbiAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFNsaWRlckNvbXBvbmVudCgkLlNMSURFUlMudmVsb2NpdHkpO1xuICAgIHRoaXMudmVsb2NpdHkua25vYlNpemUgPSAkLlNMSURFUlMua25vYi5rbm9iU2l6ZTtcbiAgICB0aGlzLnZlbG9jaXR5Lmtub2IuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmtub2IuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudmVsb2NpdHkua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLnZlbG9jaXR5LmZpbGwuYmFja2dyb3VuZENvbG9yID0gJC5TTElERVJTLmZpbGwuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMudmVsb2NpdHlMYWJlbCA9IG5ldyBMYXllcigkLkxBQkVMUy52ZWxvY2l0eSk7XG4gICAgdGhpcy52ZWxvY2l0eUxhYmVsLmh0bWwgPSBcIjxkaXYgd2lkdGg9J0B2ZWxvY2l0eUxhYmVsLndpZHRoJyBoZWlnaHQ9J0B2ZWxvY2l0eUxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLnZlbG9jaXR5TGFiZWwubmFtZSArIFwiPC9kaXY+XCI7XG4gICAgdGhpcy50b2xlcmFuY2UgPSBuZXcgU2xpZGVyQ29tcG9uZW50KCQuU0xJREVSUy50b2xlcmFuY2UpO1xuICAgIHRoaXMudG9sZXJhbmNlLmtub2JTaXplID0gJC5TTElERVJTLmtub2Iua25vYlNpemU7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYi5iYWNrZ3JvdW5kQ29sb3IgPSAkLlNMSURFUlMua25vYi5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy50b2xlcmFuY2Uua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZTtcbiAgICB0aGlzLnRvbGVyYW5jZS5maWxsLmJhY2tncm91bmRDb2xvciA9ICQuU0xJREVSUy5maWxsLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnRvbGVyYW5jZUxhYmVsID0gbmV3IExheWVyKCQuTEFCRUxTLnRvbGVyYW5jZSk7XG4gICAgdGhpcy50b2xlcmFuY2VMYWJlbC5odG1sID0gXCI8ZGl2IHdpZHRoPSdAdG9sZXJhbmNlTGFiZWwud2lkdGgnIGhlaWdodD0nQHRvbGVyYW5jZUxhYmVsLmhlaWdodCc+XCIgKyB0aGlzLnRvbGVyYW5jZUxhYmVsLm5hbWUgKyBcIjwvZGl2PlwiO1xuICAgIHJlZiA9ICQuS0lORVRJQ1MubGF5ZXIuc3ViTGF5ZXJzO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2xpZGVyID0gcmVmW2ldO1xuICAgICAgaWYgKHNsaWRlci5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkxheWVyXCIpIHtcbiAgICAgICAgZm9yIChzdHlsZSBpbiAkLlNUWUxFLnNsaWRlckxhYmVscykge1xuICAgICAgICAgIHNsaWRlci5fZWxlbWVudC5zdHlsZVtcIlwiICsgc3R5bGVdID0gJC5TVFlMRS5zbGlkZXJMYWJlbHNbXCJcIiArIHN0eWxlXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWYxID0gdGhpcy5zdWJMYXllcnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgc2xpZGVyID0gcmVmMVtqXTtcbiAgICAgIGlmICghKHNsaWRlciBpbnN0YW5jZW9mIFNsaWRlckNvbXBvbmVudCA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBzbGlkZXIub24oXCJjaGFuZ2U6dmFsdWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICQuQU5JTUFURS5vcHRpb25zLmN1cnZlID0gXCJzcHJpbmcoXCIgKyAoTWF0aC5yb3VuZCgkLktJTkVUSUNTLmxheWVyLnRlbnNpb24udmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIuZnJpY3Rpb24udmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudmVsb2NpdHkudmFsdWUpKSArIFwiLCBcIiArIChNYXRoLnJvdW5kKCQuS0lORVRJQ1MubGF5ZXIudG9sZXJhbmNlLnZhbHVlICogMTAwMCkgLyAxMDAwKSArIFwiKVwiO1xuICAgICAgICByZXR1cm4gJC5LSU5FVElDUy5sYXllci5jdXJ2ZVByb3BzLmh0bWwgPSBcIjx0ZXh0YXJlYSBvbmNsaWNrPSd0aGlzLnNlbGVjdCgpJyBzdHlsZT0nd2lkdGg6XCIgKyAkLlRFWFQuY3VydmVQcm9wcy53aWR0aCArIFwicHg7IGhlaWdodDpcIiArICQuVEVYVC5jdXJ2ZVByb3BzLmhlaWdodCArIFwicHg7IHRleHQtYWxpZ246Y2VudGVyOyBsaW5lLWhlaWdodDozNHB4OyBjb2xvcjojQTBFMzVGOyBmb250OjQwMCAyOHB4IFJvYm90byBNb25vOyBiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50OyBib3JkZXI6bm9uZTsgcmVzaXplOm5vbmUnPiZxdW90O1wiICsgJC5BTklNQVRFLm9wdGlvbnMuY3VydmUgKyBcIiZxdW90OzwvdGV4dGFyZWE+XCI7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdHMucHVzaChzbGlkZXIua25vYi5vbihFdmVudHMuRHJhZ0VuZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkLktJTkVUSUNTLmxheWVyLmFuaW1hdGVUYXJnZXQoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgS2luZXRpY3MucHJvdG90eXBlLmFuaW1hdGVUYXJnZXQgPSBmdW5jdGlvbigpIHtcbiAgICAkLktJTkVUSUNTLnRhcmdldExheWVyLnByb3BzID0gJC5LSU5FVElDUy50YXJnZXRMYXllck9yaWdpbjtcbiAgICByZXR1cm4gJC5LSU5FVElDUy50YXJnZXRMYXllci5hbmltYXRlKCQuQU5JTUFURS5vcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gS2luZXRpY3M7XG5cbn0pKExheWVyKTtcbiJdfQ==
