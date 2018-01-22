"use strict";

System.register(["./app/app"], function (_export, _context) {
  "use strict";

  var loadPluginCss, MetricsPanelCtrl, TimeSeries, config, _createClass, GrafanaBoomTableCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appApp) {
      loadPluginCss = _appApp.loadPluginCss;
      MetricsPanelCtrl = _appApp.MetricsPanelCtrl;
      TimeSeries = _appApp.TimeSeries;
      config = _appApp.config;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      loadPluginCss(config.list_of_stylesheets);

      _export("PanelCtrl", GrafanaBoomTableCtrl = function (_MetricsPanelCtrl) {
        _inherits(GrafanaBoomTableCtrl, _MetricsPanelCtrl);

        function GrafanaBoomTableCtrl($scope, $injector, $sce) {
          _classCallCheck(this, GrafanaBoomTableCtrl);

          var _this = _possibleConstructorReturn(this, (GrafanaBoomTableCtrl.__proto__ || Object.getPrototypeOf(GrafanaBoomTableCtrl)).call(this, $scope, $injector));

          _.defaults(_this.panel, config.panelDefaults);
          _this.events.on("data-received", _this.onDataReceived.bind(_this));
          _this.events.on("init-edit-mode", _this.onInitEditMode.bind(_this));
          return _this;
        }

        _createClass(GrafanaBoomTableCtrl, [{
          key: "onInitEditMode",
          value: function onInitEditMode() {
            var _this2 = this;

            this.valueNameOptions = config.valueNameOptions;
            _.each(config.editorTabs, function (editor) {
              _this2.addEditorTab(editor.name, "public/plugins/" + config.plugin_id + editor.template, editor.position);
            });
          }
        }, {
          key: "onDataReceived",
          value: function onDataReceived(data) {
            this.dataReceived = data;
            this.render();
          }
        }, {
          key: "seriesHandler",
          value: function seriesHandler(seriesData) {
            var series = new TimeSeries({
              datapoints: seriesData.datapoints || [],
              alias: seriesData.target
            });
            series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
            return series;
          }
        }, {
          key: "addPattern",
          value: function addPattern() {
            var newPattern = {
              pattern: "^server.*cpu$",
              delimiter: ".",
              valueName: "avg",
              row_name: "_0_",
              col_name: "_1_"
            };
            this.panel.patterns.push(newPattern);
            this.panel.activePatternIndex = this.panel.patterns.length - 1;
            this.render();
          }
        }, {
          key: "removePattern",
          value: function removePattern(index) {
            this.panel.patterns.splice(index, 1);
            this.panel.activePatternIndex = -1;
            this.render();
          }
        }]);

        return GrafanaBoomTableCtrl;
      }(MetricsPanelCtrl));

      GrafanaBoomTableCtrl.prototype.render = function () {
        var _this3 = this;

        if (this.dataReceived) {
          console.log("Rendering");
          // Binding the grafana computations to the metrics received
          this.dataComputed = this.dataReceived.map(this.seriesHandler.bind(this));
          // Assign pattern
          this.dataComputed = this.dataComputed.map(function (series) {
            series.pattern = _.find(_this3.panel.patterns.concat(_this3.panel.defaultPattern), function (p) {
              return series.alias.match(p.pattern || "");
            });
            return series;
          });
          // Assign value
          this.dataComputed = this.dataComputed.map(function (series) {
            series.value = series.stats[series.pattern.valueName || "avg"] || "N/A";
            return series;
          });
          // Assign Row Name
          this.dataComputed = this.dataComputed.map(function (series) {
            series.row_name = series.alias.split(series.pattern.delimiter || ".").reduce(function (r, it, i) {
              return r.replace(new RegExp("_" + i + "_", "g"), it);
            }, series.pattern.row_name || config.panelDefaults.defaultPattern.row_name);
            return series;
          });
          // Assign Col Name
          this.dataComputed = this.dataComputed.map(function (series) {
            series.col_name = series.alias.split(series.pattern.delimiter || ".").reduce(function (r, it, i) {
              return r.replace(new RegExp("_" + i + "_", "g"), it);
            }, series.pattern.col_name || config.panelDefaults.defaultPattern.col_name);
            return series;
          });
          // Assigning computed data to output panel
          this.panel.data = this.dataComputed;
        }
      };

      GrafanaBoomTableCtrl.templateUrl = "partials/module.html";

      _export("PanelCtrl", GrafanaBoomTableCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map