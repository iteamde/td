(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('commonService', commonService);

  commonService.$inject = ['logger', 'TOOLTIP_MESSAGES', 'TILE_MIN_WIDTH_TRENDLINE','TILE_MIN_HEIGHT_TRENDLINE', 'TILE_MIN_HEIGHT_WITH_FILTERS', 'ALLOWED_CHART_TYPES', 'noty', 'BASE_URL', '$window'];

  function commonService(logger, TOOLTIP_MESSAGES, TILE_MIN_WIDTH_TRENDLINE,TILE_MIN_HEIGHT_TRENDLINE, TILE_MIN_HEIGHT_WITH_FILTERS, ALLOWED_CHART_TYPES, noty, BASE_URL, $window) {

    var service = {

      /* ------------ FUSION CHARTS ---------------*/
      exportChart: exportChart,
      changeChartType: changeChartType,
      changeFusionTheme: changeFusionTheme,
      shareChart: shareChart,

      /* ------------ GRID CONFIG ---------------*/
      configGrid: configGrid,
      setupGrid: setupGrid,

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
      createToken: createToken,

      /*-------CHART CONFIGURATIONS -------*/
      chartConfig: chartConfig,
      updateGrid: updateGrid,
      saveToDashboard: saveToDashboard
    };

    return service;


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
     GRID CONFIG
     ================================================================================= */
    function setupGrid($scope) {
      $scope.numRows = 10;
      $scope.maxSize = 5;
      $scope.gridOptions = {
        maxSize: $scope.maxSize,
        paginationPageSize: $scope.numRows,
        enablePaginationControls: false,
        paginationCurrentPage: 1,
        columnDefs: [
          {name: 'Name', field: 'name'},
          {name: 'Position', field: 'position'},
          {name: 'Office', field: 'office'},
          {name: 'Age', field: 'age'},
          {name: 'Cost', field: 'cost'},
          {name: 'Revenue', field: 'revenue'}
        ]
      };

      // more configuration would add later

    }

    function configGrid($scope, tableData) {
      // add pending grid configuration;
      if (!tableData) {
        return false;
      }
      $scope.gridBoxData = tableData;
      $scope.gridOptions.data = $scope.gridBoxData.chart_data.data;
      $scope.gridOptions.totalItems = $scope.gridOptions.data.length;
      $scope.gridOptions.minRowsToShow = $scope.gridOptions.data.length < $scope.numRows ? $scope.gridOptions.data.length : $scope.numRows;
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
      height = parseInt((chartHeight - headerHeight), 10);

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

      $scope.numRows = 10;
      $scope.gridOptions = {
        maxSize: $scope.maxSize,
        paginationPageSize: $scope.numRows,
        enablePaginationControls: false,
        paginationCurrentPage: 1,
        columnDefs: [
          {name: 'Full Name', field: 'full name',enableHiding: false},
          {name: 'Department', field: 'department',enableHiding: false},
          {name: 'Location', field: 'location',enableHiding: false},
          {name: 'Manager', field: 'manager',enableHiding: false}
          // {name: 'Date Of Joining', field: 'date_of_joining', type: 'date', cellFilter: 'date:"MMM dd, yyyy"'}
        ]
      };
      $scope.gridOptions2 = {
        maxSize: $scope.maxSize,
        paginationPageSize: 15,
        enablePaginationControls: false,
        paginationCurrentPage: 1,
        minRowsToShow: 12,
        enableColumnMenus: false,
        enableSorting: false,
        //rowTemplate: "<div ng-style=\"{ 'cursor': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\"><div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div><div ng-cell></div></div>",
        columnDefs: [
          {name: '', field: 'name', width: '18%'},
          {name: moment().subtract(6, 'month').format('MMMM'), field: moment().subtract(6, 'month').format('MMMM'), cellClass: 'ui-grid-cell-future', cellTemplate: '/app/core/common-partials/cell-template.html',enableHiding: false},
          {name: moment().subtract(5, 'month').format('MMMM'), field: moment().subtract(5, 'month').format('MMMM'), cellClass: 'ui-grid-cell-future', cellTemplate: '/app/core/common-partials/cell-template.html',enableHiding: false},
          {name: moment().subtract(4, 'month').format('MMMM'), field: moment().subtract(4, 'month').format('MMMM'), cellClass: 'ui-grid-cell-future', cellTemplate: '/app/core/common-partials/cell-template.html',enableHiding: false},
          {name: moment().subtract(3, 'month').format('MMMM'), field: moment().subtract(3, 'month').format('MMMM'), cellClass: 'ui-grid-cell-future', cellTemplate: '/app/core/common-partials/cell-template.html',enableHiding: false},
          {name: moment().subtract(2, 'month').format('MMMM'), field: moment().subtract(2, 'month').format('MMMM'), cellClass: 'ui-grid-cell-future', cellTemplate: '/app/core/common-partials/cell-template.html',enableHiding: false},
          {name: moment().subtract(1, 'month').format('MMMM'), field: moment().subtract(1, 'month').format('MMMM'), cellClass: 'ui-grid-cell-future', cellTemplate: '/app/core/common-partials/cell-template.html',enableHiding: false}
        ]
      };
      //for Summary
      $scope.gridOptions3 = {
        maxSize: $scope.maxSize,
        paginationPageSize: 15,
        enablePaginationControls: false,
        paginationCurrentPage: 1,
        minRowsToShow: 12,
        enableColumnMenus: false,
        enableSorting: false,
        //rowTemplate: "<div ng-style=\"{ 'cursor': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\"><div class=\"ngVerticalBar\" ng-style=\"{height: rowHeight}\" ng-class=\"{ ngVerticalBarVisible: !$last }\">&nbsp;</div><div ng-cell></div></div>",
        columnDefs: [
          {name: '', field: 'name', width: '18%'},
          {name: moment().subtract(6, 'month').format('MMMM'), field: moment().subtract(6, 'month').format('MMMM'), cellTemplate: '<div class="ui-grid-cell-contents flex-cell">{{grid.getCellValue(row, col) | number}}</div>'},
          {name: moment().subtract(5, 'month').format('MMMM'), field: moment().subtract(5, 'month').format('MMMM'), cellTemplate: '<div class="ui-grid-cell-contents flex-cell">{{grid.getCellValue(row, col) | number}}</div>'},
          {name: moment().subtract(4, 'month').format('MMMM'), field: moment().subtract(4, 'month').format('MMMM'), cellTemplate: '<div class="ui-grid-cell-contents flex-cell">{{grid.getCellValue(row, col) | number}}</div>'},
          {name: moment().subtract(3, 'month').format('MMMM'), field: moment().subtract(3, 'month').format('MMMM'), cellTemplate: '<div class="ui-grid-cell-contents flex-cell">{{grid.getCellValue(row, col) | number}}</div>'},
          {name: moment().subtract(2, 'month').format('MMMM'), field: moment().subtract(2, 'month').format('MMMM'), cellTemplate: '<div class="ui-grid-cell-contents flex-cell">{{grid.getCellValue(row, col) | number}}</div>'},
          {name: moment().subtract(1, 'month').format('MMMM'), field: moment().subtract(1, 'month').format('MMMM'), cellTemplate: '<div class="ui-grid-cell-contents flex-cell">{{grid.getCellValue(row, col) | number}}</div>'}
        ]
      };

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

    function updateGrid($scope, data) {
      $scope.gridOptions.data = _.filter(data, function (obj) {

        return  $scope.gridFilter.location.values[obj.location] &&
            $scope.gridFilter.gender.values[obj.gender] &&
            $scope.gridFilter.department.values[obj.department];
        /*return _.every(_.keys($scope.gridFilter), function (key) {
          return $scope.gridFilter[key].values[obj[key]]
        });*/
      });

      return $scope.gridOptions.data;
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

  }

})();
