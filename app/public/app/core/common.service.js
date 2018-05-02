(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('commonService', commonService);

  commonService.$inject = ['logger', 'TOOLTIP_MESSAGES', 'TILE_MIN_WIDTH_TRENDLINE','TILE_MIN_HEIGHT_TRENDLINE', 'TILE_MIN_HEIGHT_WITH_FILTERS', 'ALLOWED_CHART_TYPES', 'noty', 'BASE_URL', '$window', '$http'];

  function commonService(logger, TOOLTIP_MESSAGES, TILE_MIN_WIDTH_TRENDLINE,TILE_MIN_HEIGHT_TRENDLINE, TILE_MIN_HEIGHT_WITH_FILTERS, ALLOWED_CHART_TYPES, noty, BASE_URL, $window, $http) {

    var service = {

      getCommonData: getCommonData,

      /* ------------ FUSION CHARTS ---------------*/
      exportChart: exportChart,
      changeChartType: changeChartType,
      changeFusionTheme: changeFusionTheme,
      shareChart: shareChart,

      /* ------------ GRIDSTACK METHODS ---------------*/
      onItemAdded: onItemAdded,
      onResizeStart: onResizeStart,
      onResizeStop: onResizeStop,
      onWindowResize: onWindowResize,
      setChartWidthHeight: setChartWidthHeight,

      /* ------------ OTHERS ---------------*/
      getColumnWidth: getColumnWidth,
      notification: notification,
      getShareChart: getShareChart,
      exportUsersToCsv: exportUsersToCsv,
      exportSummaryToCsv: exportSummaryToCsv,
      createToken: createToken,

      /*-------CHART CONFIGURATIONS -------*/
      chartConfig: chartConfig,
      saveToDashboard: saveToDashboard
    };

    return service;

    function getCommonData() {
      var apiUrl = BASE_URL + "common/load-common-data/1";
      return $http.get(apiUrl);
    }

    /* ===============================================================================
     FUSION CHARTS
     ================================================================================= */

    // chart export
    function exportChart(index) {
        var chartObjId;
        chartObjId = angular.element("#fschart" + index).children()[0].id;

        FusionCharts.batchExport({
            "charts": [{
                "id": chartObjId
            }],
            "exportFileName": "chart-image"/* + chartId*/,
            "exportFormats": "jpg",
            "exportAtClientSide": "1"
        });
    }

    var shareChartInfo = {
      title: '',
      type: 'Metric',
      url: ''
    };
    function shareChart(index, title, type) {
      shareInterceprot(title, type);

      var chartObjId;
      chartObjId = angular.element("#fschart" + index).children()[0].id;

      FusionCharts.batchExport({
        charts: [{
          id: chartObjId
        }],
        exportFormats: 'png',
        exportAtClientSide: 0,
        exportAtClient: 0,
        exportHandler: BASE_URL + 'share',
        exportAction: 'save'
      });
    }

    function getShareChart() {
      return shareChartInfo;
    }

    function createToken(name, view) {
      var token = _.replace(name.toLowerCase(), new RegExp(' ', 'g'), '_');
      return token + '_' + view + '_instructions';
    }

    function shareInterceprot(title, type) {
      var oldSend = XMLHttpRequest.prototype.send;
      // override the native send()
      XMLHttpRequest.prototype.send = function() {
        this.onreadystatechange = function() {
          if (this.readyState === 4) {
            var url = location.protocol + '//' + location.host + JSON.parse(this.response).filename;
            angular.element('#share-modal #share-wrapper').jsSocials({
              url: encodeURI(url),
              showCount: false,
              shareIn: 'popup',
              shares: [{
                share: 'twitter',
                label: 'Share on Twitter'
              }, {
                share: 'facebook',
                label: 'Share on Facebook'
              }, {
                share: 'linkedin',
                label: 'Share on LinkedIn'
              }]
            });
            angular.element('#share-modal').modal();
            shareChartInfo = {
              title: title,
              type: type,
              url: url
            };
          }

          XMLHttpRequest.prototype.send = oldSend;
        }

        oldSend.apply(this, arguments);
      }
    }

    // chart type change methods
    function changeChartType(index, chartType) {
      // Get the chart object

      var chartObj, chartObjId;

      chartObjId = angular.element("#fschart" + index).children()[0].id;
      chartObj = FusionCharts(chartObjId);
      chartObj.chartType(chartType);
    }

    function changeFusionTheme(charts) {

      angular.forEach(charts, function (item, key) {
        item.chart_data.chart = {
          "theme": "tren"
        };
        if(item.set_height != 0)
          item.height = item.set_height;
        else
          item.height = 4;

        if(item.set_width != 0)
          item.width = item.set_width;
        else
          item.width = 3;
      });
    }

    /* ===============================================================================
     GRIDSTACK METHODS
     ================================================================================= */

    function onItemAdded2(item) {
      console.log(item);
      $scope.isGridItemReady = true;
    }

    function onItemAdded($scope) {
      return function (item) {
        // add title to grid chart resize handle
        addTitleToGridResizeHandle(item);

        // update status to inform fusion chart creation in add-chart directive
        $scope.isGridItemReady = true;
      };
    }

    function onResizeStart($scope) {
      return function (event, ui) {
        $scope.isChartResizing = true;
      };
    }

    function onResizeStop($scope, fn) {
      return function (event, ui) {
        $scope.isChartResizing = false;

                var gridItemIndex;
                gridItemIndex = ui.element.data('grid-item-index');
                setChartWidthHeight(ui.element, $scope.widgets[gridItemIndex]);
            fn($scope.widgets);};
        }


    function onWindowResize($scope) {
      return function (gridstack) {
        var gridItems = gridstack.grid.nodes;
        angular.forEach(gridItems, function (chartObj, key) {
          var widget, chartEl;
          chartEl = chartObj.el;
          widget = $scope.widgets[chartEl.data('grid-item-index')];
          setChartWidthHeight(chartEl, widget);
        });
      };
    }


    // method to set width and height to chart according to container
    function setChartWidthHeight(chart, widget) {
      var header, headerHeight, chartHeight, width, height;

      header = chart.find('.chart-header');
      headerHeight = header.outerHeight(true);
      chartHeight = chart.height();

      width = chart.width();
      height = parseInt((chartHeight - (headerHeight || 0)), 10);

      // remove padding on chart inside wrapper
      height = (height - 47);
      width = (width - 47);

      widget.chartWidth = width;
      widget.chartHeight = height;
    }


    function addTitleToGridResizeHandle(chart) {
      var handle;

      handle = chart.el.find(".ui-resizable-handle");

      if (!handle.length) {
        return false;
      }

      handle.attr("title", TOOLTIP_MESSAGES.GRIDSTACK.RESIZE_HANDLE);
    }


    /* ===============================================================================
     OTHERS
     ================================================================================= */

    function getColumnWidth(boxes, $window) {
      var columnWidth;
      var len = boxes.length;

      if (!len) {
        return false;
      }

      columnWidth = 12 / len;
      columnWidth = $window.Math.floor(columnWidth);

      // column must be col-6 as in case of only one label box
      if (columnWidth > 6) {
        columnWidth = 6;
      }

      // column can't be less than 2
      if (columnWidth < 2) {
        columnWidth = 2;
      }

      if (12 % len)
        boxes.lastColumnWidth = columnWidth + 12 % len;

      boxes.columnWidth = columnWidth;

    }

    function notification(text, type) {
      noty.show({
        text: text,
        layout: 'topCenter',
        type: type,
        killer: true
      });
    }

    function chartConfig($scope, vm) {
      vm.ALLOWED_CHART_TYPES = ALLOWED_CHART_TYPES;
      vm.TOOLTIP_TILES_MESSAGES = TOOLTIP_MESSAGES.TILES;
      vm.TOOLTIP_BACK_BUTTON = TOOLTIP_MESSAGES.BACK_BUTTON;

      vm.exportChart = exportChart;
      vm.changeChartType = changeChartType;


      // charts setting defined in core constants
      vm.TILE_MIN_WIDTH = TILE_MIN_WIDTH_TRENDLINE;
      vm.TILE_MIN_HEIGHT = TILE_MIN_HEIGHT_TRENDLINE;
      vm.TILE_MIN_HEIGHT_WITH_FILTERS = TILE_MIN_HEIGHT_WITH_FILTERS;

      // show charts handler all the time.
      $scope.options = {
        disableDrag: true,
        disableResize: true
      };

      // Chart Events: on chart add to inform chart directive
      $scope.isChartResizing = false;
      $scope.onItemAdded = onItemAdded($scope);
      $scope.onResizeStart = onResizeStart($scope);
      $scope.onResizeStop = onResizeStop($scope);
      $scope.onWindowResize = onWindowResize($scope);
    }

    function saveToDashboard(chart) {
      var copy = angular.copy(chart);
      this.charts = this.charts || [];
      copy.height = 4;
      copy.width = 3;
      delete copy.chart_data.annotations;
      this.charts.push(copy);
      this.notification(TOOLTIP_MESSAGES.TILES.ADD_TO_DASHBOARD_NOTY, 'success');
    }

    function exportUsersToCsv(filters, pagination, usersFilter, chartId) {
      var apiUrl = BASE_URL + 'connector-csv/export-users';
      return $http.post(apiUrl, {
        filters: filters,
        pagination: pagination,
        timeSpan: usersFilter.timeSpan || null,
        userTypes: usersFilter.types || null,
        chartId: chartId
      }).then(function(resp) {
        if (resp.status === 200) {
          window.location = encodeURI(BASE_URL + 'connector-csv/download-export/users/' + resp.data);
        }
      });
    }

    function exportSummaryToCsv(filters) {
      var apiUrl = BASE_URL + 'connector-csv/export-summary';
      return $http.post(apiUrl, {
        filters: filters
      }).then(function(resp) {
        if (resp.status === 200) {
          window.location.href = encodeURI(BASE_URL + 'connector-csv/download-export/summary/' + resp.data);
        }
      });
    }

  }

})();
