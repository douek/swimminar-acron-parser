const esprima = require("esprima");
const fs = require("fs");

fs.readFile(
    "/Users/danieldouek/dev/SWM/swimm/src/app/common/utils/filters.js",
//   "/Users/danieldouek/dev/SWM/swimm/e2e/specs/basic-flow.e2e.js",
  "utf8",
  function (err, data) {
    if (err) throw err;
    console.log(data);
    const parseScriptResult = esprima.parseModule(data);
    console.log(parseScriptResult);
    // const tokenizeResult = esprima.tokenize(data);
    // console.log(tokenizeResult);
    const parseModuleResult = esprima.parseModule(data);
    console.log(parseModuleResult);
  }
);

// const data =`export async function verifyGithubToken() {
//     try {
//       const githubToken = await getGitHubToken();
//       if (!githubToken) {
//         return false;
//       }
  
//       await fetch('https://api.github.com', { method: 'GET', headers: { Authorization:\`token ${githubToken}\` } });
//       return true;
//     } catch (error) {
//       return false;
//     }`;
// const parseScriptResult = esprima.parseScript(data);
// console.log(parseScriptResult);
// // const tokenizeResult = esprima.tokenize(data);
// // console.log(tokenizeResult);
// const parseModuleResult = esprima.parseModule(data);
// console.log(parseModuleResult);
