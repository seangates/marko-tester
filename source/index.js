'use strict';

var testConfiguration = require('./test-configuration');
var testFixtures = require('./test-fixtures');

function buildComponent(settings) {
  beforeEach(function (done) {
    function buildDom() {
      if (!settings) {
        done();
      }

      if (!settings.renderer.render) {
        settings.renderer.render = settings.renderer.renderer;
      }

      settings.renderer.render(settings.fixture, function (err, result) {
        if (global._.isObject(result)) {
          var widget = result.context.attributes.widgets.widgets[0];
          var widgetId = widget.id;

          window.$markoWidgetsState = {};
          window.$markoWidgetsState[widgetId] = widget.state;
          window.$markoWidgetsConfig = {};
          window.$markoWidgetsConfig[widgetId] = widget.config;

          result = result.html;
        }

        var componentContainer = window['component-container'];

        componentContainer.innerHTML = result;

        var widgetEl = componentContainer.querySelector('[data-widget]');
        var widgetPath = widgetEl.getAttribute('data-widget');

        if (widgetPath) {
          global.widget = window.$_mod.require(widgetPath);

          testConfiguration.onInit();

          done();
        }
      });
    }

    testConfiguration.buildPage.then(buildDom);
  });

  afterEach(function () {
    testConfiguration.onDestroy();

    global.widget && global.widget.destroy && global.widget.destroy();
  });
}

function buildWidget() {
  beforeEach(function (done) {
    var widgetContainers = window['component-container'].querySelectorAll('[data-widget]');
    var widgetId = widgetContainers[0].id;

    // Initialize the widget
    window.$MARKO_WIDGETS.initWidgets(widgetId);

    // Make the widget available to the global scope
    global.widget = window.$MARKO_WIDGETS.getWidgetForEl(widgetId);

    done();
  });
}

module.exports.configure = testConfiguration.configure;
module.exports.testFixtures = testFixtures;
module.exports.buildComponent = buildComponent;
module.exports.buildWidget = buildWidget;
