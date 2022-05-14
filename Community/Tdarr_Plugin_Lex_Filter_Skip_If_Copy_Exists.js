const details = () => ({
  id: 'Tdarr_Plugin_Lex_Filter_Skip_If_Copy_Exists',
  Stage: 'Pre-processing',
  Name: 'Filter second copy ',
  Type: 'Video',
  Operation: 'Filter',
  Description: 'This plugin prevents processing files which have already been processed and are to be found inside the output folder. Note: This plugin ' +
    'checks for the name of the video and tries  \n\n',
  Version: '1.00',
  Tags: '',
  Inputs: [
    {
      name: 'Delimiter',
      type: 'string',
      defaultValue: '1080p',
      inputUI: {
        type: 'text',
      },
      tooltip: `Match the name of the video before the delimiter. For example: "Movie (2019) - 1080p", when the delimiter is set to 1080p, it will match
      "Movie (2019) - ". This way you can change the resolution or other details and still make shure Tdarr doesn't trancode the video again`,
    },
    ],
});

// eslint-disable-next-line no-unused-vars
const plugin = (file, librarySettings, inputs, otherArguments) => {
  const lib = require('../methods/lib')();
  const path = require('path');
  const fs = require('fs');
  // eslint-disable-next-line no-unused-vars,no-param-reassign
  inputs = lib.loadDefaultValues(inputs, details);
  // Must return this object at some point in the function else plugin will fail.

  const response = {
    processFile: true,
    infoLog: '',
  };

  const outputFolder = librarySettings.output;
  const delimiter = inputs.Delimiter;
  const fileToTranscodeName = file.file; //includes path, but does not require cleaning
  let outputFolderFileNames = [];

  fs.readdir(outputFolder, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan output folder: ' + err);
    }
    outputFolderFileNames = files;
    });

  for (let i = 0; i < outputFolderFileNames.length; i += 1) {
    let file = outputFolderFileNames[i];
    if (fileToTranscodeName.includes(file.split(delimiter)[0])) {
      response.processFile = false;
      response.infoLog += `Filter preventing processing. Name already present in output folder ${keywords[i]}`;
      break;
    }
  }

  return response;
};
module.exports.details = details;
module.exports.plugin = plugin;
