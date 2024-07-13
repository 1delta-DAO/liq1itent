// Packages
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { realpathSync } from "fs";
// Plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import path, { relative, resolve } from "path";
// Webpack
import { Compiler, Configuration, DefinePlugin, ProgressPlugin } from "webpack";
import { getEnvConfig } from "./environments/util";

const appDirectory = realpathSync(process.cwd());
const resolveAppDirectories = (...relativePath: string[]): string =>
  resolve(appDirectory, ...relativePath);

const appBuildPath: string = resolveAppDirectories("dist");
const appNodeModulesPath: string = resolveAppDirectories("node_modules");
const appPublicPath: string = resolveAppDirectories("public");
const appSourcePath: string = resolveAppDirectories("src");

const LIFECYCLE_EVENT = process.env["npm_lifecycle_event"];
const isDevelopment: boolean = LIFECYCLE_EVENT === "start";
const isProduction: boolean = LIFECYCLE_EVENT?.startsWith("build") ?? false;

const configuration: Configuration = {};
configuration.bail = isProduction;

configuration.devtool = isDevelopment ? "source-map" : false;

configuration.entry = [`${appSourcePath}/index.tsx`];

configuration.mode = isDevelopment ? "development" : "production";

configuration.target = "web";

configuration.experiments = { topLevelAwait: true };

configuration.module = {
  rules: [
    {
      exclude: /node_modules/,
      include: `${appSourcePath}`,
      test: /\.(js|jsx|ts|tsx)$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            cacheCompression: true,
            cacheDirectory: true,
            compact: isProduction,
            plugins: [
              isDevelopment && require.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
      ],
    },

    {
      generator: {
        filename: "images/[hash][ext][query]",
      },
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      type: "asset/resource",
    },

    {
      test: /\.msvg$/i,
      use: ["@svgr/webpack"],
    },

    {
      generator: {
        filename: "images/[hash][ext][query]",
      },
      test: /\.(svg)(\?.*)?$/,
      type: "asset/resource",
    },

    {
      generator: {
        filename: "videos/[hash][ext][query]",
      },
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: "asset/resource",
    },

    {
      generator: {
        filename: "fonts/[hash][ext][query]",
      },
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      type: "asset/resource",
    },

    {
      include: /\.module\.scss$/,
      test: /\.(scss|css)$/i,
      use: [
        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: isDevelopment
                ? "[local]_[hash:base64:5]"
                : "[hash:base64:5]",
            },
            sourceMap: !isProduction,
          },
        },

        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugin: [
                "postcss-preset-env",
                {
                  autoprefixer: {
                    flexbox: "no-2009",
                  },
                  stage: 3,
                },
              ],
            },
          },
        },

        {
          loader: "sass-loader",
          options: {
            sourceMap: !isProduction,
          },
        },
      ],
    },
    {
      exclude: /\.module\.scss$/,
      test: /\.(scss|css)$/i,
      use: [
        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
        },
      ],
    },
  ],
  strictExportPresence: true,
};

configuration.node = {
  __dirname: true,
  __filename: true,
  global: true,
};

configuration.output = {
  chunkFilename: isProduction
    ? "js/[name].[chunkhash].chunk.js"
    : "js/[name].chunk.js",
  crossOriginLoading: false,
  devtoolModuleFilenameTemplate: isProduction
    ? (info: { absoluteResourcePath: string }): string => {
        return relative(appSourcePath, info.absoluteResourcePath).replace(
          /\\/g,
          "/"
        );
      }
    : (info: { absoluteResourcePath: string }): string => {
        return resolve(info.absoluteResourcePath).replace(/\\/g, "/");
      },
  filename: isProduction ? "js/[name].[contenthash].js" : "js/bundle.js",
  globalObject: "this",
  libraryTarget: "umd",
  path: appBuildPath,
  pathinfo: isDevelopment,
  publicPath: "/",
  umdNamedDefine: true,
};

configuration.performance = { hints: false };

configuration.plugins = [
  new CompressionPlugin(),

  new ForkTsCheckerWebpackPlugin(),

  new DefinePlugin(getEnvConfig()),

  new NodePolyfillPlugin(),

  new HtmlWebpackPlugin({
    cache: true,
    compile: true,
    favicon: `${appPublicPath}/favicon.ico`,
    filename: "index.html",
    hash: isProduction,
    inject: true,
    scriptLoading: "defer",
    showErrors: true,
    template: `${appPublicPath}/index.html`,
    xhtml: true,
  }),

  new ProgressPlugin({ entries: true }),
];

configuration.resolve = {
  extensions: [".js", ".json", "jsx", ".ts", ".tsx"],
  modules: ["node_modules", appNodeModulesPath],
  // alias: {
  //   three$: path.resolve("./src/utils/three.ts"),
  //   "../../../build/three.module.js": path.resolve("./src/utils/three.ts"),
  // },
};

if (isDevelopment) {
  configuration.plugins.push(new ReactRefreshWebpackPlugin());
}

if (isProduction) {
  configuration.optimization = {
    minimize: true,
    splitChunks: {
      chunks: "all",
    },
  };

  configuration.plugins.push(
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name].[contenthash:8].css",
      filename: "css/[name].[contenthash:8].css",
    }) as unknown as { apply: (compiler: Compiler) => void }
  );
}

export default configuration;
