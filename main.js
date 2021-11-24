const { parse } = require("acorn");
const acorn = require("acorn");
const walk = require("acorn-walk");
// https://github.com/acornjs/acorn

let code = `
function add(a, b) {
	return a + b;
}

function helloWorld() {
	let a = 1;
	let b = 2;
	let c = 3;
	console.log(add(a, c));
	console.log('This is a string')
	console.log(add(b, b));
    const result = add(7, 6);
}

const result = add(1, 2);
helloWorld();
`;

const searchFor = "add";
const codeLines = code.split("\n");

const printLines = (start, end) => {
  console.log(codeLines.slice(start - 1, end).join("\n"));
  //   for (let i = start - 1; i <= end; i++) {
  //     console.log(codeLines[i]);
  //   }
};

// console.log("--------------------------------------------------");
// console.log("TOKENS");
// console.log("--------------------------------------------------");

// console.log(
//   [...acorn.tokenizer(code)]
//     .map((token) => ({
//       value: token.value,
//       start: token.start,
//       end: token.end,
//     }))
//     .filter(({ value }) => !!value) // like comments and withespaces and parenthesis
// );

// console.log("--------------------------------------------------");
// console.log("Parse Tree Nodes");
// console.log("--------------------------------------------------");
// walk.full(
//   acorn.parse(code, {
//     sourceType: "module",
//     locations: true,
//     ecmaVersion: "2022",
//   }),
//   (node) => {
//     if (node.type === "FunctionDeclaration") {
//       console.log(node);
//     }
//     if (node.type === "CallExpression") {
//       console.log(node);
//     }
//     console.log(node);
//   }
// );

// console.log("--------------------------------------------------");
// console.log("The Function decleartion snippet");
// console.log("--------------------------------------------------");
// walk.full(
//   acorn.parse(code, {
//     sourceType: "module",
//     locations: true,
//     ecmaVersion: "2022",
//   }),
//   (node) => {
//     if (
//       node.type === "FunctionDeclaration" &&
//       node.id &&
//       node.id.name === searchFor
//     ) {
//       console.log(node);
//       printLines(node.loc.start.line, node.loc.end.line);
//     }
//   }
// );

console.log("--------------------------------------------------");
console.log("The Function Calls Expressions");
console.log("--------------------------------------------------");

const nodes = [];

walk.full(
  acorn.parse(code, {
    sourceType: "module",
    locations: true,
    ecmaVersion: "2022",
  }),
  (node) => {
    if (node.type === "CallExpression") {
      if (node.callee.name === searchFor) {
        // console.log(`Node: ${JSON.stringify(node)} \n`);
        // printLines(node.loc.start.line, node.loc.end.line);
        // console.log("\n");
        const nodeArguments = node.arguments
          .filter((arg) => arg.type === "Identifier" || arg.type === "Literal")
          .map((arg) => ({
            name: arg.name,
            value: arg.value,
            location: arg.loc.start.line - 1,
          }));
        nodes.push({
          node: node.callee,
          args: nodeArguments,
        });
      }
    }
  }
);

console.log([...nodes].map((node) => node.args));

console.log("--------------------------------------------------");
console.log("Function Argument decleartion");
console.log("--------------------------------------------------");

const withinBlockRange = (s, e, n) => {
  return s <= n && n <= e;
};
const fullCodeTree = acorn.parse(code, { locations: true, ecmaVersion: 2022 });

nodes.forEach((node) =>
  node.args
    .filter((arg) => arg.name)
    .forEach((arg) => {
      fullCodeTree.body.forEach((block) => {
        // search the variable declarations for non literal arguments
        if (
          withinBlockRange(
            block.loc.start.line,
            block.loc.end.line,
            node.node.loc.start.line
          )
        ) {
          walk.simple(block, {
            VariableDeclaration(node) {
              if (node.declarations[0].id.name === arg.name) {
                // the node is the declaration of the variable
                arg.startLocation = node.loc.start.line;
              }
            },
          });
        }
      });
    })
);

const interestingLines = [];

nodes.forEach((node) => {
  node.args.forEach((arg) => {
    if (arg.startLocation) {
      interestingLines.push({
        line: arg.startLocation,
        data: codeLines.slice(arg.startLocation - 1, arg.startLocation),
      });
    }
  });
});

function sortLines(a, b) {
  if (a.line < b.line) {
    return -1;
  }
  return 1;
}
const linesToPrint = Array.from([...new Set(interestingLines)]).sort(sortLines);
console.log(linesToPrint);

// no in use
// nodes.forEach((node) => {
//   interestingLines.push({
//     line: node.node.loc.start.line,
//     data: codeLines.slice(
//       node.node.loc.start.line - 1,
//       node.node.loc.start.line
//     ),
//   });
//   node.args.forEach((arg) => {
//     if (arg.startLocation) {
//       interestingLines.push({
//         line: arg.startLocation,
//         data: codeLines.slice(arg.startLocation - 1, arg.startLocation),
//       });
//     }
//   });
// });
