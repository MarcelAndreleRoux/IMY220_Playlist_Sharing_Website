const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    path: path.resolve(__dirname, "frontend", "public"),
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/, // For JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // For CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // For image files
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]", // Retains original file name and extension
              outputPath: "assets/images/", // Outputs to the existing assets/images directory
              publicPath: "/assets/images/", // Public path to access images
            },
          },
        ],
      },
    ],
  },
};
