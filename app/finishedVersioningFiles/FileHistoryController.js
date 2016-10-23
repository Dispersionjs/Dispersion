angular.module('FileHistoryController', [])
  .controller('FileHistoryController', ['ProjectService', '$scope', '$http', 'FileHistoryFactory', fileHistoryController]);
function fileHistoryController(ProjectService, $scope, $http, FileHistoryFactory) {
  //TODO: 
  $scope.showInfo = false;
  $scope.showEditor = false;
  $scope.showMedia = false;
  $scope.ext = $scope.filename.split('.').pop();
  $scope.previousEditorContent = '';
  $scope.theme = 'monokai';
  $scope.modes = [
    'abap',
    'actionscript',
    'ada',
    'apache_conf',
    'asciidoc',
    'assembly_x86',
    'autohotkey',
    'batchfile',
    'c9search',
    'c_cpp',
    'cirru',
    'clojure',
    'cobol',
    'coffee',
    'coldfusion',
    'csharp',
    'css',
    'curly',
    'd',
    'dart',
    'diff',
    'dockerfile',
    'dot',
    'dummy',
    'dummysyntax',
    'eiffel',
    'ejs',
    'elixir',
    'elm',
    'erlang',
    'forth',
    'ftl',
    'gcode',
    'gherkin',
    'gitignore',
    'glsl',
    'golang',
    'groovy',
    'haml',
    'handlebars',
    'haskell',
    'haxe',
    'html',
    'html_ruby',
    'ini',
    'io',
    'jack',
    'jade',
    'java',
    'javascript',
    'json',
    'jsoniq',
    'jsp',
    'jsx',
    'julia',
    'latex',
    'less',
    'liquid',
    'lisp',
    'livescript',
    'logiql',
    'lsl',
    'lua',
    'luapage',
    'lucene',
    'makefile',
    'markdown',
    'matlab',
    'mel',
    'mushcode',
    'mysql',
    'nix',
    'objectivec',
    'ocaml',
    'pascal',
    'perl',
    'pgsql',
    'php',
    'powershell',
    'praat',
    'prolog',
    'properties',
    'protobuf',
    'python',
    'r',
    'rdoc',
    'rhtml',
    'ruby',
    'rust',
    'sass',
    'scad',
    'scala',
    'scheme',
    'scss',
    'sh',
    'sjs',
    'smarty',
    'snippets',
    'soy_template',
    'space',
    'sql',
    'stylus',
    'svg',
    'tcl',
    'tex',
    'text',
    'textile',
    'toml',
    'twig',
    'typescript',
    'vala',
    'vbscript',
    'velocity',
    'verilog',
    'vhdl',
    'xml',
    'xquery',
    'yaml',
  ];
  $scope.projectobj = JSON.parse($scope.projectobject);
  $scope.versions = () => FileHistoryFactory.fileHistory($scope.filename);
  $scope.fileHistoryVersions = $scope.versions().sort((a, b) => {
    return (new Date(b.date) - new Date(a.date));
  });
  console.log($scope.fileHistoryVersions)
  $scope.logShit = () => console.log($scope.fileHistoryVersions);

  // $scope.fileHistory = 


  $scope.toggleEditor = () => {
    $scope.showEditor = !$scope.showEditor;
  }
  $scope.toggleShowInfo = () => {
    console.log('clicked toggle show info')
    $scope.showInfo = !$scope.showInfo;
  }
  $scope.makeNewHistoryObj = () => {
    return {
      date: new Date(),
      data: $scope.editorContent,
      hash: '',
      publish: false,
      changed: $scope.filename,
      url: '',
      files: $scope.projectobj.files
    }
  }
  $scope.saveFile = function () {
    console.log('$scope.editorcontent in saveFile', $scope.editorContent);
    let newHistoryObj = $scope.makeNewHistoryObj();
    console.log('save clicked, historyoobj generated: \n', newHistoryObj);
    FileHistoryFactory.add(newHistoryObj);
    $scope.fileHistoryVersions.unshift(newHistoryObj);
    // console.log('after push, file history versions \n\n\n\n', $scope.fileHistoryVersions);

  }
  $scope.recordIndex = function (index) {
    console.log(index)
    $scope.openVersionIndex = index;
  }
  $scope.delete = function () {
    //update to change in extended full app data store model
    console.log('filehistoryversions:', $scope.fileHistoryVersions)
    console.log($scope.openVersionIndex);
    console.log('deleteitem:', $scope.fileHistoryVersions[$scope.openVersionIndex])
    let deleteItem = $scope.fileHistoryVersions[$scope.openVersionIndex]
    if (confirm('Are you sure you wish to delete: ', $scope.filename.slice(1), deleteItem.date)) {
      $scope.fileHistoryVersions.splice($scope.openVersionIndex, 1);
    }
    $scope.aceEditor.setValue('');
    $scope.openVersionIndex = 0;
    $scope.updateEditorContent(0, $scope.fileHistoryVersions[0]);
  }
  $scope.aceEditor;
  $scope.aceLoaded = function (_editor) {
    _editor.$blockScrolling = Infinity;
    $scope.aceEditor = _editor;


    $scope.renderer = _editor.renderer;
    $scope.session = _editor.getSession();
    $scope.session.setUndoManager(new ace.UndoManager());
    _editor.on("changeSession", function (e) {
    })
    $scope.session.on("change", function (e) {
      $scope.editorContent = $scope.session.getValue()
    })
  }
  $scope.aceChanged = function (e) {

  };
  $scope.updateEditorContent = function (index = 0, file) {
    // console.log($scope.aceEditor);
    if (!$scope.image) {
      let version = file ? file : $scope.fileHistoryVersions[index];

      // console.log(version);

      if (version && version.data) {
        // $scope.editorContent = version.data;
        $scope.aceEditor.setValue(version.data)
        $scope.showEditor = true;
      } else {
        if (version && version.url) {
          $http.get(version.url + $scope.filename).then((res) => {
            // console.log('http called for ', version.url + $scope.filename)
            $scope.fileHistoryVersions[index].data = res.data;
            $scope.previousEditorContent = $scope.editorContent;
            $scope.editorContent = res.data;
            $scope.showEditor = true;
          });
        }
        // $scope.showEditor = false;
      }
    }
  }
  $scope.clearEditor = function () {
    console.log('clear clicked', $scope.editorContent)
    $scope.previousEditorContent = $scope.editorContent;
    $scope.aceEditor.setValue('');

  }
  $scope.undo = function () {
    console.log('undo clicked');
    console.log($scope.previousEditorContent);
    $scope.editorContent = $scope.previousEditorContent;
  }

  $scope.getMediaContent = (url) => {

    $scope.showEditor = false;
    $scope.mediaContentUrl = url;
    $scope.showMedia = true;
  }
  $scope.getContentUrl = ProjectService.getContentUrl; //function 
  // $http.get(self.getContentUrl(file)).then((res) => {
  //   $scope.editorContent = res.data;
  // })

  $scope.themes = [
    "chrome",
    "clouds",
    "crimson_editor",
    "dawn",
    "dreamweaver",
    "eclipse",
    "github",
    "solarized_light",
    "textmate",
    "tomorrow",
    "xcode",
    "kuroir",
    "katzenmilch",
    "ambiance",
    "chaos",
    "clouds_midnight",
    "cobalt",
    "idle_fingers",
    "kr_theme",
    "merbivore",
    "merbivore_soft",
    "mono_industrial",
    "monokai",
    "pastel_on_dark",
    "solarized_dark",
    "terminal",
    "tomorrow_night",
    "tomorrow_night_blue",
    "tomorrow_night_bright",
    "tomorrow_night_eighties",
    "twilight",
    "vibrant_ink"
  ];
}





//taken from project ctrl
// needs lots of refactoring
// self.aceOptions = {
//   useWrapMode: true,
//   showGutter: true,
//   onLoad: self.aceLoaded,
//   onChange: self.aceChanged,
// enableBasicAutocompletion: true,
//   //   enableLiveAutocompletion: true  
//   enableSnippets: true
//   // advanced: {
//   //   enableSnippets: true,
//   //   enableBasicAutocompletion: true,
//   //   enableLiveAutocompletion: true
//   // }
// };
// self.aceLoaded = function (_editor) {
//   // Options
//   _editor.setReadOnly(true);
// };

// self.aceChanged = function (e) {
//   //
// };
//   self.isImage = (file) => {
//     let imageTester = /(\.jpeg$)|(\.jpg$)|(\.png$)|(\.gif$)|(\.json$)|(\.md$)|(\.log$)/i;
//     return imageTester.test(file);
//   }
//   self.isText = (file) => {
//     let textTester = /(\.html$)|(\.js$)|(\.css$)|(\.txt$)|(\.json$)|(\.md$)|(\.log$)/i;
//     return textTester.test(file);
//   }
//   self.updateEditorContent = (index, url) => {
//     console.log(self.fileVersions(self.filesList()[index]))
//     if (!url) {
//       url = self.currentUrl() + self.filesList()[index];
//     }
//     let splitArr = url.split('/')
//     let file = splitArr[splitArr.length - 1];
//     let textTester = /(\.html$)|(\.js$)|(\.css$)|(\.txt$)|(\.json$)|(\.md$)|(\.log$)/;
//     let text = textTester.test(file);
//     let type;
//     if (text) {
//       type = textTester.exec(file)[0].slice(1);
//     }
//     if (!text) {
//       self.getMediaContent(url);
//     } else {

//       console.log(type);
//       self.getContent(url);
//     }
//   }
//   self.getMediaContent = (url) => {

//     self.showEditor = false;
//     self.mediaContentUrl = url;
//     self.showMedia = true;
//   }