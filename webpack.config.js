  const path = require('path');
  const webpack = require('webpack');
  const env = require('yargs').argv.env; // use --env with webpack 2
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const {CleanWebpackPlugin} = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const miniCssPlugin = new MiniCssExtractPlugin({
    filename: 'assets/css/main.css'
  });

  const getEnvVals = (e) => {
    const isProd = e === 'build';
    const devMode =  env !== 'build';
    const mode = isProd ? 'production' : 'development';
    const map = isProd ? 'none' : 'inline-source-map';
    const publicPath = isProd ? '' : '/';
    return {devMode, mode, map, publicPath};

  };

  const envVals = getEnvVals(env);



  const shell = require('child_process').execSync ;


  const copyDir = (srcDirectory, destDirectory)=>{
    const P = {
      src: path.resolve(__dirname, srcDirectory)
    };

    shell(`mkdir -p ${destDirectory}`);
    shell(`cp -r ${P.src}/* ${destDirectory}`);
  };

  const assetsFolder = "assets/";




  const extractSass = new ExtractTextPlugin({
    filename: 'assets/css/main.css',
    disable: envVals.devMode

  });

  const cleanPlugin = new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep'],
    cleanAfterEveryBuildPatterns: ['!.gitkeep']
  });

  const htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.tmpl.html'
  });

  const devMode = env!=='build';



  const PATHS = {
    dist: path.join(__dirname, 'dist'),
    src: path.join(__dirname, 'src')
  };

  const config = {
    mode: envVals.mode,

    entry: {
      index: './src/index.js'
    },

    output: {
      filename: 'assets/js/[name].js',
      path: PATHS.dist,
      publicPath: envVals.publicPath,
    },

    devtool: envVals.map,

    devServer: {
      contentBase: PATHS.src,
      historyApiFallback: true,
      port: 8090
    },

    plugins: [miniCssPlugin, cleanPlugin, htmlPlugin],

    optimization: {
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: 'all',
          }
        },
      }
    },

    module: {
      rules: [

        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            } ,
              "css-loader"

          ]
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        },

        {
          test: /\.(sa|sc|c)ss$/,
          use: [
              envVals.devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  let dir = String(file).includes('/imgs/') === true ? 'static/imgs/' : '/static/data/';
                  if (devMode===false){
                    dir = assetsFolder+""+dir;
                  }

                  return dir + '[name].[ext]';
                },
              },
            }],

        },
        {
          type: 'javascript/auto',
          test: /\.(json|vtt)$/,
          use: [    {
            loader: 'file-loader',
            options: {
              name(file) {
                let dir = devMode === false ? assetsFolder+"static/data/" : "./static/data/";
                return dir + '[name].[ext]';
              },
            },
          } ]
        }
      ]
    },

    resolve: {
      alias: {
        plugins: path.resolve(__dirname, 'src/plugins/'),
        imgs: path.resolve(__dirname, 'src/static/imgs/'),
        fonts: path.resolve(__dirname, 'src/static/fonts/'),
        data: path.resolve(__dirname, 'src/static/data/'),
        css: path.resolve(__dirname, 'src/css/'),
        core: path.resolve(__dirname, 'src/core/'),
        traits: path.resolve(__dirname, 'src/app/traits/'),
        channels: path.resolve(__dirname, 'src/app/channels/'),
        components: path.resolve(__dirname, 'src/app/components/'),
        node_modules: path.resolve(__dirname, 'node_modules/')

      },
      extensions: ['.js', '.css'],
    }

  };



module.exports = config;
