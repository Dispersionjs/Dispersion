// <li class="fileVersionListItem" ng-repeat="fileVersion in versions() track by $index">
let FileHistoryPartial =
  `
<div>
  <button class="fileButton" ng-click="updateEditorContent(); recordIndex(0); toggleShowInfo();">{{filename.slice(1)}}</button>
  <div class="filediv" ng-show="showInfo" ng-if="!image">
    <ul class="fileVersionList">
      <li>Previous Versions</li>
      <button><</button>

      <li class="fileVersionListItem" ng-repeat="item in fileHistoryVersions track by $index">
        <a href="#" class="fileVersion" ng-click="updateEditorContent($index); recordIndex($index)">{{item.date | date:"MM/dd/yy h:mma"}}</a>
      </li>
      <button>></button>
    </ul>
    <button ng-click="saveFile()">Save</button>
    <button ng-click="clearEditor()">Clear</button>
    <button ng-click="undo()">Undo</button>
    <select ng-options="theme as theme for theme in themes" ng-model="theme"></select>
    <select ng-options="mode as mode for mode in modes" ng-model="mode"></select>
    <div class="editor" ng-if="showEditor && !image" ng-model="editorContent" ui-ace="{
      useWrapMode: true,
      showGutter: true,
      onLoad: aceLoaded,
      onChange: aceChanged,
      theme:  theme,
      mode: mode,
      require: ['ace/ext/language_tools'],
      advanced: {
          enableSnippets: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true
      }}">
    </div>
    <button>Save</button>
    <button ng-click="delete()">Delete</button>
  </div>
  <div id="outer" ng-show="image">
    <img ng-if="image" ng-src='{{projectobj.url + filename}}' />
  </div>
</div>
`;

angular.module('FileHistoryDirective', ['FileHistoryController'])

  .directive('fileHistory', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        index: '@',
        filename: '@',
        projectname: '@',
        projectobject: '@',
        mode: '@'
      },
      controller: 'FileHistoryController',
      template: FileHistoryPartial,
      replace: true
    };
  })