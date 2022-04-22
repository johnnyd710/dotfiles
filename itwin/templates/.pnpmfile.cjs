// A hack only to be used when packages have incorrect dependencies
function readPackage(pkg) {
  // if (pkg.name == "foo") {
  //   pkg.dependencies["bar"] = "workspace:*";
  //   pkg.devDependencies["baz"] = "workspace:*";
  // }
  if (pkg.name == "@itwin/property-grid-react") {
    pkg.dependencies["@itwin/appui-abstract"] = "workspace:*";
    pkg.dependencies["@itwin/appui-react"] = "workspace:*";
    pkg.dependencies["@itwin/components-react"] = "workspace:*";
    pkg.dependencies["@itwin/core-bentley"] = "workspace:*";
    pkg.dependencies["@itwin/core-react"] = "workspace:*";
    pkg.dependencies["@itwin/presentation-components"] = "workspace:*";
    pkg.dependencies["@itwin/presentation-frontend"] = "workspace:*";
  }
  if (pkg.name == "@itwin/tree-widget-react") {
    pkg.dependencies["@itwin/appui-abstract"] = "workspace:*";
    pkg.dependencies["@itwin/appui-react"] = "workspace:*";
    pkg.dependencies["@itwin/components-react"] = "workspace:*";
    pkg.dependencies["@itwin/core-bentley"] = "workspace:*";
    pkg.dependencies["@itwin/core-frontend"] = "workspace:*";
    pkg.dependencies["@itwin/core-react"] = "workspace:*";
    pkg.dependencies["@itwin/presentation-components"] = "workspace:*";
    pkg.dependencies["@itwin/presentation-frontend"] = "workspace:*";
  }
  return pkg;
}
module.exports = {
  hooks: {
    readPackage,
  },
};
